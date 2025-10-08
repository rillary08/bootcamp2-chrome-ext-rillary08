// Estado do timer global
let timerState = {
    isRunning: false,
    isPaused: false,
    currentTime: 0,
    mode: 'work',
    intervalId: null
};

// Quando a extensão é instalada
chrome.runtime.onInstalled.addListener(() => {
    console.log('Focus Timer instalado com sucesso!');
    
    // Configurações iniciais
    chrome.storage.local.set({
        workTime: 25,
        breakTime: 5,
        todaySessions: 0,
        totalSessions: 0,
        lastDate: new Date().toDateString()
    });
});

// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'startTimer':
            startTimer(message.duration, message.mode);
            sendResponse({ success: true });
            break;
            
        case 'pauseTimer':
            pauseTimer();
            sendResponse({ success: true });
            break;
            
        case 'resetTimer':
            resetTimer();
            sendResponse({ success: true });
            break;
            
        case 'getTimerState':
            sendResponse(timerState);
            break;
            
        default:
            sendResponse({ error: 'Ação não reconhecida' });
    }
});

// Função para iniciar o timer
function startTimer(duration, mode) {
    console.log(`Iniciando timer: ${duration}s no modo ${mode}`);
    
    timerState.isRunning = true;
    timerState.isPaused = false;
    timerState.currentTime = duration;
    timerState.mode = mode;
    
    // Criar alarm para o final do timer
    chrome.alarms.create('timerEnd', {
        delayInMinutes: duration / 60
    });
    
    // Iniciar contagem regressiva
    startCountdown();
}

// Função para pausar o timer
function pauseTimer() {
    console.log('Timer pausado');
    
    timerState.isRunning = false;
    timerState.isPaused = true;
    
    // Limpar alarm
    chrome.alarms.clear('timerEnd');
    
    // Parar contagem
    if (timerState.intervalId) {
        clearInterval(timerState.intervalId);
        timerState.intervalId = null;
    }
}

// Função para resetar o timer
function resetTimer() {
    console.log('Timer resetado');
    
    timerState.isRunning = false;
    timerState.isPaused = false;
    timerState.currentTime = 0;
    
    // Limpar alarm e interval
    chrome.alarms.clear('timerEnd');
    if (timerState.intervalId) {
        clearInterval(timerState.intervalId);
        timerState.intervalId = null;
    }
    
    // Limpar badge
    chrome.action.setBadgeText({ text: '' });
}

// Função para contagem regressiva
function startCountdown() {
    if (timerState.intervalId) {
        clearInterval(timerState.intervalId);
    }
    
    timerState.intervalId = setInterval(() => {
        if (timerState.isRunning && timerState.currentTime > 0) {
            timerState.currentTime--;
            
            // Atualizar badge com tempo restante
            updateBadge();
            
            // Enviar atualização para popup (se estiver aberto)
            chrome.runtime.sendMessage({
                action: 'timerUpdate',
                currentTime: timerState.currentTime
            }).catch(() => {
                // Popup não está aberto, tudo bem
            });
        }
    }, 1000);
}

// Atualizar badge do ícone
function updateBadge() {
    if (timerState.isRunning) {
        const minutes = Math.floor(timerState.currentTime / 60);
        chrome.action.setBadgeText({
            text: minutes > 0 ? minutes.toString() : '<1'
        });
        chrome.action.setBadgeBackgroundColor({
            color: timerState.mode === 'work' ? '#ff6b6b' : '#4ecdc4'
        });
    } else {
        chrome.action.setBadgeText({ text: '' });
    }
}

// Listener para alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'timerEnd') {
        handleTimerComplete();
    }
});

// Lidar com conclusão do timer
async function handleTimerComplete() {
    console.log(`Timer ${timerState.mode} completado!`);
    
    // Parar timer
    timerState.isRunning = false;
    timerState.currentTime = 0;
    
    if (timerState.intervalId) {
        clearInterval(timerState.intervalId);
        timerState.intervalId = null;
    }
    
    // Atualizar estatísticas se foi sessão de trabalho
    if (timerState.mode === 'work') {
        await updateSessionStats();
    }
    
    // Limpar badge
    chrome.action.setBadgeText({ text: '' });
    
    // Criar notificação
    const isWork = timerState.mode === 'work';
    chrome.notifications.create(`timer-${Date.now()}`, {
        type: 'basic',
        iconUrl: '/icons/icon48.png',
        title: isWork ? '🎉 Pausa Merecida!' : '💪 Hora de Focar!',
        message: isWork 
            ? 'Sessão de foco completada. Que tal uma pausa?' 
            : 'Pausa acabou. Vamos para a próxima sessão!'
    });
}

// Atualizar estatísticas de sessões
async function updateSessionStats() {
    const result = await chrome.storage.local.get(['todaySessions', 'totalSessions', 'lastDate']);
    const today = new Date().toDateString();
    
    let todaySessions = result.todaySessions || 0;
    let totalSessions = result.totalSessions || 0;
    
    // Reset diário
    if (result.lastDate !== today) {
        todaySessions = 0;
    }
    
    todaySessions++;
    totalSessions++;
    
    await chrome.storage.local.set({
        todaySessions: todaySessions,
        totalSessions: totalSessions,
        lastDate: today
    });
    
    console.log(`Sessões atualizadas: Hoje ${todaySessions}, Total ${totalSessions}`);
}