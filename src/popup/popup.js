// Elementos DOM
const timeDisplay = document.getElementById('timeDisplay');
const statusText = document.getElementById('statusText');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const todaySessionsSpan = document.getElementById('todaySessions');
const totalSessionsSpan = document.getElementById('totalSessions');

// Estado do timer
let timerState = {
    isRunning: false,
    isPaused: false,
    currentTime: 25 * 60,
    mode: 'work',
    workTime: 25,
    breakTime: 5
};

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await loadStats();
    await loadTimerState();
    updateDisplay();
    updateButtons();
});

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
workTimeInput.addEventListener('change', saveSettings);
breakTimeInput.addEventListener('change', saveSettings);

// Função para iniciar o timer
async function startTimer() {
    if (timerState.isPaused) {
        timerState.isPaused = false;
    } else {
        timerState.currentTime = timerState.mode === 'work' 
            ? timerState.workTime * 60 
            : timerState.breakTime * 60;
    }
    
    timerState.isRunning = true;
    
    try {
        chrome.runtime.sendMessage({
            action: 'startTimer',
            duration: timerState.currentTime,
            mode: timerState.mode
        });
    } catch (error) {
        console.log('Background script não disponível');
    }
    
    updateButtons();
    updateStatus();
}

// Função para pausar o timer
async function pauseTimer() {
    timerState.isRunning = false;
    timerState.isPaused = true;
    
    try {
        chrome.runtime.sendMessage({ action: 'pauseTimer' });
    } catch (error) {
        console.log('Background script não disponível');
    }
    
    updateButtons();
    updateStatus();
}

// Função para resetar o timer
async function resetTimer() {
    timerState.isRunning = false;
    timerState.isPaused = false;
    timerState.currentTime = timerState.mode === 'work' 
        ? timerState.workTime * 60 
        : timerState.breakTime * 60;
    
    try {
        chrome.runtime.sendMessage({ action: 'resetTimer' });
    } catch (error) {
        console.log('Background script não disponível');
    }
    
    updateDisplay();
    updateButtons();
    updateStatus();
}

// Carregar configurações
async function loadSettings() {
    try {
        const result = await chrome.storage.local.get(['workTime', 'breakTime']);
        
        if (result.workTime) {
            timerState.workTime = result.workTime;
            workTimeInput.value = result.workTime;
        }
        
        if (result.breakTime) {
            timerState.breakTime = result.breakTime;
            breakTimeInput.value = result.breakTime;
        }
        
        timerState.currentTime = timerState.workTime * 60;
    } catch (error) {
        console.log('Storage não disponível ainda');
    }
}

// Salvar configurações
async function saveSettings() {
    timerState.workTime = parseInt(workTimeInput.value);
    timerState.breakTime = parseInt(breakTimeInput.value);
    
    try {
        await chrome.storage.local.set({
            workTime: timerState.workTime,
            breakTime: timerState.breakTime
        });
        
        if (!timerState.isRunning) {
            timerState.currentTime = timerState.mode === 'work' 
                ? timerState.workTime * 60 
                : timerState.breakTime * 60;
            updateDisplay();
        }
    } catch (error) {
        console.log('Erro ao salvar configurações');
    }
}

// Carregar estatísticas
async function loadStats() {
    try {
        const result = await chrome.storage.local.get(['todaySessions', 'totalSessions', 'lastDate']);
        const today = new Date().toDateString();
        
        if (result.lastDate !== today) {
            await chrome.storage.local.set({
                todaySessions: 0,
                lastDate: today
            });
            todaySessionsSpan.textContent = '0';
        } else {
            todaySessionsSpan.textContent = result.todaySessions || 0;
        }
        
        totalSessionsSpan.textContent = result.totalSessions || 0;
    } catch (error) {
        console.log('Erro ao carregar estatísticas');
    }
}

// Carregar estado do timer
async function loadTimerState() {
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getTimerState' });
        if (response) {
            timerState.isRunning = response.isRunning;
            timerState.isPaused = response.isPaused;
            timerState.currentTime = response.currentTime;
            timerState.mode = response.mode;
        }
    } catch (error) {
        console.log('Background script não disponível ainda');
    }
}

// Atualizar display
function updateDisplay() {
    const minutes = Math.floor(timerState.currentTime / 60);
    const seconds = timerState.currentTime % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Atualizar botões
function updateButtons() {
    if (timerState.isRunning) {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
    } else {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = !timerState.isPaused;
    }
}

// Atualizar status
function updateStatus() {
    if (timerState.isRunning) {
        statusText.textContent = timerState.mode === 'work' 
            ? '🔥 Focando...' 
            : '☕ Pausa merecida';
    } else if (timerState.isPaused) {
        statusText.textContent = '⏸️ Pausado';
    } else {
        statusText.textContent = 'Pronto para começar';
    }
}