# Base image com Playwright pré-instalado
FROM mcr.microsoft.com/playwright:v1.46.0-jammy

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --silent

# Instalar navegadores do Playwright (Chromium)
RUN npx playwright install --with-deps chromium

# Copiar todo o código do projeto
COPY . .

# Build da extensão
RUN npm run build

# Comando padrão: rodar testes
CMD ["npm", "test"]