// Content Script - Focus Timer
console.log('Focus Timer: Content script carregado');

// Elemento do indicador
let focusIndicator = null;

// Estado do timer
let currentTimerState = {
    isRunning: false,
    currentTime: 0,
    mode: 'work'
};

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Função de inicialização
async function init() {
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getTimerState' });
        if (response && response.isRunning) {
            currentTimerState = response;
            showFocusIndicator();
        }
    } catch (error) {
        console.log('Focus Timer: Background script não disponível ainda');
    }
}

// Listener para mensagens do background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'timerUpdate':
            currentTimerState.currentTime = message.currentTime;
            updateIndicator();
            break;
            
        case 'timerComplete':
            hideFocusIndicator();
            showCompletionMessage();
            break;
    }
});

// Criar e mostrar indicador de foco
function showFocusIndicator() {
    if (focusIndicator) return;
    
    focusIndicator = document.createElement('div');
    focusIndicator.id = 'focus-timer-indicator';
    focusIndicator.innerHTML = `
        <div class="focus-indicator-content">
            <div class="focus-icon">🍅</div>
            <div class="focus-text">
                <span class="focus-mode">${currentTimerState.mode === 'work' ? 'FOCANDO' : 'PAUSANDO'}</span>
                <span class="focus-time">${formatTime(currentTimerState.currentTime)}</span>
            </div>
            <button class="focus-close">×</button>
        </div>
    `;
    
    // Adicionar evento de fechar
    focusIndicator.querySelector('.focus-close').addEventListener('click', () => {
        focusIndicator.style.display = 'none';
    });
    
    // Estilos CSS
    const styles = `
        #focus-timer-indicator {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            background: linear-gradient(135deg, ${currentTimerState.mode === 'work' ? '#ff6b6b, #ee5a52' : '#4ecdc4, #44a08d'}) !important;
            color: white !important;
            padding: 0 !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
            z-index: 999999 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            font-size: 14px !important;
            min-width: 180px !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            animation: slideInRight 0.3s ease-out !important;
        }
        
        .focus-indicator-content {
            display: flex !important;
            align-items: center !important;
            padding: 12px 16px !important;
            gap: 12px !important;
        }
        
        .focus-icon {
            font-size: 20px !important;
            animation: pulse 2s infinite !important;
        }
        
        .focus-text {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 2px !important;
        }
        
        .focus-mode {
            font-weight: bold !important;
            font-size: 12px !important;
            opacity: 0.9 !important;
            letter-spacing: 0.5px !important;
        }
        
        .focus-time {
            font-size: 16px !important;
            font-weight: bold !important;
            font-family: 'Courier New', monospace !important;
        }
        
        .focus-close {
            background: rgba(255, 255, 255, 0.2) !important;
            border: none !important;
            color: white !important;
            width: 24px !important;
            height: 24px !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 16px !important;
            line-height: 1 !important;
            transition: all 0.2s ease !important;
        }
        
        .focus-close:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: scale(1.1) !important;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    
    // Adicionar estilos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    // Adicionar ao DOM
    document.body.appendChild(focusIndicator);
}

// Atualizar indicador
function updateIndicator() {
    if (!focusIndicator) return;
    
    const timeElement = focusIndicator.querySelector('.focus-time');
    if (timeElement) {
        timeElement.textContent = formatTime(currentTimerState.currentTime);
    }
}

// Esconder indicador
function hideFocusIndicator() {
    if (focusIndicator && focusIndicator.parentNode) {
        focusIndicator.parentNode.removeChild(focusIndicator);
        focusIndicator = null;
    }
}

// Mostrar mensagem de conclusão
function showCompletionMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: linear-gradient(135deg, #667eea, #764ba2) !important;
            color: white !important;
            padding: 20px 30px !important;
            border-radius: 15px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
            z-index: 999999 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            text-align: center !important;
        ">
            <div style="font-size: 24px !important; margin-bottom: 10px !important;">
                ${currentTimerState.mode === 'work' ? '🎉' : '💪'}
            </div>
            <div style="font-size: 18px !important; font-weight: bold !important; margin-bottom: 5px !important;">
                ${currentTimerState.mode === 'work' ? 'Pausa Merecida!' : 'Hora de Focar!'}
            </div>
            <div style="font-size: 14px !important; opacity: 0.9 !important;">
                ${currentTimerState.mode === 'work' ? 'Sessão completada!' : 'Pausa acabou!'}
            </div>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (message && message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 3000);
}

// Formatar tempo em MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}