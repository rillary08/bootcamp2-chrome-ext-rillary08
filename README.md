# 🍅 Focus Timer - Extensão Chrome

Uma extensão de timer Pomodoro para Chrome que ajuda a aumentar a produtividade nos estudos e trabalho, desenvolvida com Manifest V3.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte do Bootcamp II, implementando uma extensão Chrome funcional que utiliza a técnica Pomodoro para gerenciamento de tempo e foco.

## ⚡ Funcionalidades

### Timer Pomodoro
- ⏰ Timer configurável (padrão: 25min trabalho / 5min pausa)
- ▶️ Controles de iniciar, pausar e resetar
- 🔄 Contagem regressiva visual em tempo real
- 🎯 Indicação visual do modo atual (foco/pausa)

### Interface Intuitiva
- 🎨 Design moderno com gradientes e glassmorphism
- 📱 Layout responsivo otimizado para popup
- 🎮 Botões com estados visuais claros
- ⚙️ Configurações de tempo personalizáveis

### Recursos Avançados
- 🔔 Notificações do sistema ao completar sessões
- 📊 Estatísticas de sessões diárias e totais
- 🔢 Badge no ícone mostrando tempo restante
- 🌐 Indicador flutuante em páginas web durante sessões
- 💾 Persistência de dados e configurações

## 🛠️ Tecnologias Utilizadas

- **Manifest V3** - Versão mais recente da API de extensões Chrome
- **HTML/CSS/JavaScript** - Frontend vanilla sem dependências
- **Chrome Extension APIs:**
  - `chrome.storage` - Armazenamento local
  - `chrome.alarms` - Alarmes para timer
  - `chrome.notifications` - Notificações do sistema
  - `chrome.action` - Badge e popup
  - `chrome.runtime` - Comunicação entre scripts

## 📁 Estrutura do Projeto

```
bootcamp2-chrome-ext-rillary08/
├── manifest.json              # Configuração da extensão
├── src/
│   ├── popup/                 # Interface principal
│   │   ├── popup.html         # Estrutura HTML
│   │   ├── popup.css          # Estilos modernos
│   │   └── popup.js           # Lógica do timer
│   ├── background/            # Script em segundo plano
│   │   └── service-worker.js  # Gerencia alarms e notificações
│   └── content/               # Script para páginas web
│       └── content.js         # Indicador flutuante
├── icons/                     # Ícones da extensão
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── docs/                      # GitHub Pages
│   └── index.html             # Página de demonstração
├── README.md                  # Esta documentação
└── LICENSE                    # Licença MIT
```

## 🚀 Instalação

### Instalação Manual (Modo Desenvolvedor)

1. **Baixe o código:**
   ```bash
   git clone https://github.com/rillary08/bootcamp2-chrome-ext-rillary08.git
   cd bootcamp2-chrome-ext-rillary08
   ```

2. **Abra o Chrome** e vá para `chrome://extensions/`

3. **Ative o "Modo do desenvolvedor"** (toggle no canto superior direito)

4. **Clique em "Carregar sem compactação"**

5. **Selecione a pasta** `bootcamp2-chrome-ext-rillary08`

6. **A extensão será instalada** e o ícone aparecerá na barra do Chrome

### Download da Release

Alternativamente, baixe o arquivo .zip da [página de releases](https://github.com/rillary08/bootcamp2-chrome-ext-rillary08/releases) e siga os passos 2-6 acima.

## 📖 Como Usar

1. **Clique no ícone** 🍅 da extensão na barra do Chrome
2. **Configure o tempo** de trabalho e pausa (opcional)
3. **Clique em "Iniciar"** para começar uma sessão de foco
4. **Trabalhe focado** até o timer terminar
5. **Receba a notificação** quando completar a sessão
6. **Faça uma pausa** quando sugerido

### Controles Disponíveis
- **Iniciar** - Começa uma nova sessão ou retoma pausada
- **Pausar** - Pausa a sessão atual
- **Reset** - Cancela e reinicia o timer

### Configurações
- **Trabalho (min)** - Duração das sessões de foco (1-60 min)
- **Pausa (min)** - Duração das pausas (1-30 min)

## 🎯 Recursos Especiais

### Badge Inteligente
O ícone da extensão mostra o tempo restante em minutos, com cores diferentes para trabalho (vermelho) e pausa (azul).

### Indicador de Página
Durante sessões ativas, aparece um indicador discreto no canto das páginas web visitadas, lembrando que você está focando.

### Estatísticas
Acompanhe seu progresso com contadores de:
- Sessões completadas hoje
- Total de sessões completadas

### Persistência
Todas as configurações e estatísticas são salvas automaticamente e sincronizadas entre abas.

## 🔧 Desenvolvimento

### Pré-requisitos
- Google Chrome 114+
- Editor de código (VS Code recomendado)
- Git para controle de versão

### Executar em Desenvolvimento
1. Clone o repositório
2. Abra a pasta no VS Code
3. Carregue a extensão no Chrome (modo desenvolvedor)
4. Faça alterações nos arquivos
5. Recarregue a extensão em `chrome://extensions`

### Estrutura de Desenvolvimento
- **popup/** - Interface e lógica principal
- **background/** - Service worker para funcionalidades em segundo plano
- **content/** - Scripts injetados em páginas web
- **manifest.json** - Configuração e permissões da extensão

## 🐛 Resolução de Problemas

### Extensão não carrega
- Verifique se o modo desenvolvedor está ativo
- Confirme que todos os arquivos estão na estrutura correta
- Veja erros no console em `chrome://extensions`

### Timer não conta visualmente
- Recarregue a extensão completamente
- Abra as ferramentas de desenvolvedor (F12) para ver logs
- Verifique se há erros JavaScript no console

### Notificações não aparecem
- Permita notificações para o Chrome nas configurações do sistema
- Verifique se a extensão tem permissões de notificação

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

## 👨‍💻 Desenvolvimento

Desenvolvido por **rillary08** como projeto do Bootcamp II.

### Tecnologias Aprendidas
- Desenvolvimento de extensões Chrome
- Manifest V3 e suas APIs
- JavaScript moderno (async/await, modules)
- CSS avançado (gradientes, backdrop-filter)
- Git e GitHub para versionamento

---

**Contribuições são bem-vindas!** Sinta-se à vontade para abrir issues ou pull requests.