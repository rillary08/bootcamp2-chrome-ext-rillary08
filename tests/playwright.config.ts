import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');

export default defineConfig({
  testDir: __dirname,
  
  // Timeout para cada teste (30 segundos)
  timeout: 30000,
  
  // Tentar novamente testes que falharem
  retries: 2,
  
  // Número de workers (testes paralelos)
  workers: 1,
  
  // Reporters
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  
  // Configurações compartilhadas
  use: {
    // Timeout para ações (cliques, etc)
    actionTimeout: 10000,
    
    // Screenshots apenas em falhas
    screenshot: 'only-on-failure',
    
    // Vídeo apenas em falhas
    video: 'retain-on-failure',
    
    // Trace apenas em falhas
    trace: 'on-first-retry',
  },
  
  // Projetos (navegadores)
  projects: [
    {
      name: 'chromium-with-extension',
      use: {
        ...devices['Desktop Chrome'],
        
        // Headless mode
        headless: true,
        
        // Argumentos para carregar a extensão
        launchOptions: {
          args: [
            `--disable-extensions-except=${distPath}`,
            `--load-extension=${distPath}`,
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ]
        }
      }
    }
  ]
});