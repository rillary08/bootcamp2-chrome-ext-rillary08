// Aguardar DOM carregar completamente ANTES de fazer qualquer coisa
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTimer);
} else {
    initializeTimer();
}

// Variáveis globais
let currentTime = 25 * 60;
let isRunning = false;
let isPaused = false;
let timerInterval = null;
let elements = {};

// Função principal de inicialização
function initializeTimer() {
    console.log('Inicializando timer...');
    console.log('Document ready state:', document.readyState);
    
    // Buscar todos os elementos
    elements = {
        timeDisplay: document.getElementById('timeDisplay'),
        statusText: document.getElementById('statusText'),
        startBtn: document.getElementById('startBtn'),
        pauseBtn: document.getElementById('pauseBtn'),
        resetBtn: document.getElementById('resetBtn'),
        workTimeInput: document.getElementById('workTime'),
        breakTimeInput: document.getElementById('breakTime')
    };
    
    // Verificar se todos os elementos foram encontrados
    console.log('Elementos encontrados:');
    for (let key in elements) {
        console.log(`${key}:`, elements[key] ? 'OK' : 'NÃO ENCONTRADO');
    }
    
    // Se algum elemento não foi encontrado, tentar novamente em 100ms
    if (!elements.timeDisplay || !elements.startBtn) {
        console.log('Elementos não encontrados, tentando novamente...');
        setTimeout(initializeTimer, 100);
        return;
    }
    
    console.log('Todos os elementos encontrados! Configurando...');
    
    // Configurar event listeners
    elements.startBtn.addEventListener('click', startTimer);
    elements.pauseBtn.addEventListener('click', pauseTimer);
    elements.resetBtn.addEventListener('click', resetTimer);
    elements.workTimeInput.addEventListener('change', updateWorkTime);
    
    // Atualizar interface inicial
    updateDisplay();
    updateButtons();
    updateStatus();
    
    console.log('Timer inicializado com sucesso!');
}

function startTimer() {
    console.log('=== INICIANDO TIMER ===');
    
    if (!isPaused) {
        currentTime = parseInt(elements.workTimeInput.value) * 60;
        console.log('Novo timer iniciado com:', currentTime, 'segundos');
    } else {
        console.log('Resumindo timer pausado:', currentTime, 'segundos');
    }
    
    isRunning = true;
    isPaused = false;
    
    // Limpar timer anterior
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Iniciar contagem
    timerInterval = setInterval(() => {
        console.log('TICK - Tempo atual:', currentTime);
        
        if (currentTime > 0) {
            currentTime--;
            updateDisplay();
        } else {
            console.log('TIMER COMPLETADO!');
            timerComplete();
        }
    }, 1000);
    
    updateButtons();
    updateStatus();
    console.log('Timer rodando!');
}

function pauseTimer() {
    console.log('=== PAUSANDO TIMER ===');
    
    isRunning = false;
    isPaused = true;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    updateButtons();
    updateStatus();
    console.log('Timer pausado!');
}

function resetTimer() {
    console.log('=== RESETANDO TIMER ===');
    
    isRunning = false;
    isPaused = false;
    currentTime = parseInt(elements.workTimeInput.value) * 60;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    updateDisplay();
    updateButtons();
    updateStatus();
    console.log('Timer resetado para:', currentTime, 'segundos');
}

function timerComplete() {
    console.log('=== TIMER COMPLETADO ===');
    
    isRunning = false;
    isPaused = false;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    if (elements.statusText) {
        elements.statusText.textContent = '🎉 Completado!';
    }
    
    updateButtons();
    
    // Reset automático após 3 segundos
    setTimeout(() => {
        currentTime = parseInt(elements.workTimeInput.value) * 60;
        updateDisplay();
        updateStatus();
    }, 3000);
}

function updateWorkTime() {
    if (!isRunning && !isPaused) {
        currentTime = parseInt(elements.workTimeInput.value) * 60;
        updateDisplay();
        console.log('Tempo de trabalho alterado para:', currentTime, 'segundos');
    }
}

function updateDisplay() {
    if (!elements.timeDisplay) return;
    
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    elements.timeDisplay.textContent = timeString;
    console.log('Display atualizado para:', timeString);
}

function updateButtons() {
    if (!elements.startBtn || !elements.pauseBtn || !elements.resetBtn) return;
    
    if (isRunning) {
        elements.startBtn.disabled = true;
        elements.pauseBtn.disabled = false;
        elements.resetBtn.disabled = false;
    } else {
        elements.startBtn.disabled = false;
        elements.pauseBtn.disabled = true;
        elements.resetBtn.disabled = !isPaused;
    }
    
    console.log('Botões atualizados - Running:', isRunning, 'Paused:', isPaused);
}

function updateStatus() {
    if (!elements.statusText) return;
    
    if (isRunning) {
        elements.statusText.textContent = '🔥 Focando...';
    } else if (isPaused) {
        elements.statusText.textContent = '⏸️ Pausado';
    } else {
        elements.statusText.textContent = 'Pronto para começar';
    }
}

console.log('Script popup.js carregado!');