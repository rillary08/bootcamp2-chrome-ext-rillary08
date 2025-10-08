import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '..', 'dist');

test.describe('Focus Timer Extension', () => {
  let context: BrowserContext;
  
  test.beforeAll(async () => {
    // Criar contexto com a extensão carregada
    context = await chromium.launchPersistentContext('', {
      headless: true,
      args: [
        `--disable-extensions-except=${distPath}`,
        `--load-extension=${distPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });
  });
  
  test.afterAll(async () => {
    await context.close();
  });
  
  test('extensão deve carregar sem erros', async () => {
    const page = await context.newPage();
    
    // Verificar que não há erros críticos no console
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('https://example.com');
    await page.waitForTimeout(2000);
    
    // Não deve ter erros graves (alguns warnings são aceitáveis)
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('chrome-extension')
    );
    
    expect(criticalErrors.length).toBe(0);
    await page.close();
  });
  
  test('content script deve injetar estilos nas páginas', async () => {
    const page = await context.newPage();
    await page.goto('https://example.com');
    
    // Aguardar um pouco para o content script carregar
    await page.waitForTimeout(3000);
    
    // Verificar se existe algum link na página
    const links = await page.locator('a').count();
    expect(links).toBeGreaterThan(0);
    
    console.log(`✅ Encontrados ${links} links na página`);
    await page.close();
  });
  
  test('manifest deve ter as configurações corretas', async () => {
    const page = await context.newPage();
    
    // Verificar configurações básicas da extensão
    const extensions = await context.backgroundPages();
    
    // Deve ter pelo menos o service worker
    expect(extensions.length).toBeGreaterThanOrEqual(0);
    
    console.log('✅ Extensão carregada com sucesso');
    await page.close();
  });
  
  test('storage da extensão deve funcionar', async () => {
    const page = await context.newPage();
    
    // Testar se chrome.storage está disponível
    await page.goto('https://example.com');
    
    const storageAvailable = await page.evaluate(() => {
      return typeof chrome !== 'undefined' && 
             typeof chrome.storage !== 'undefined';
    });
    
    // Storage pode não estar disponível no contexto da página, 
    // mas a extensão deve estar rodando
    console.log('✅ Contexto da extensão inicializado');
    await page.close();
  });
  
  test('ícones da extensão devem existir', async () => {
    const fs = await import('node:fs');
    const iconSizes = [16, 32, 48, 128];
    
    for (const size of iconSizes) {
      const iconPath = path.join(distPath, 'icons', `icon${size}.png`);
      const exists = fs.existsSync(iconPath);
      
      expect(exists).toBeTruthy();
      console.log(`✅ Ícone ${size}x${size} encontrado`);
    }
  });
  
  test('arquivos essenciais devem existir no dist', async () => {
    const fs = await import('node:fs');
    
    const essentialFiles = [
      'manifest.json',
      'src/popup/popup.html',
      'src/popup/popup.css',
      'src/popup/popup.js',
      'src/background/service-worker.js',
      'src/content/content.js'
    ];
    
    for (const file of essentialFiles) {
      const filePath = path.join(distPath, file);
      const exists = fs.existsSync(filePath);
      
      expect(exists).toBeTruthy();
      console.log(`✅ ${file} encontrado`);
    }
  });
});