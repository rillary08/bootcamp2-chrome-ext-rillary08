import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import archiver from 'archiver';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('🔨 Iniciando build da extensão...');

// Limpar pasta dist
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log('✅ Pasta dist limpa');
}

// Criar pasta dist
fs.mkdirSync(distDir, { recursive: true });
console.log('✅ Pasta dist criada');

// Copiar manifest.json
const manifestSrc = path.join(rootDir, 'manifest.json');
const manifestDest = path.join(distDir, 'manifest.json');
fs.copyFileSync(manifestSrc, manifestDest);
console.log('✅ manifest.json copiado');

// Copiar pasta src/
const srcDir = path.join(rootDir, 'src');
const srcDest = path.join(distDir, 'src');
if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, srcDest, { recursive: true });
    console.log('✅ Pasta src/ copiada');
}

// Copiar pasta icons/
const iconsDir = path.join(rootDir, 'icons');
const iconsDest = path.join(distDir, 'icons');
if (fs.existsSync(iconsDir)) {
    fs.cpSync(iconsDir, iconsDest, { recursive: true });
    console.log('✅ Pasta icons/ copiada');
}

// Criar arquivo ZIP
console.log('📦 Criando arquivo ZIP...');
const output = fs.createWriteStream(path.join(distDir, 'extension.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

archive.on('error', (err) => {
    throw err;
});

archive.on('end', () => {
    const zipSize = (fs.statSync(path.join(distDir, 'extension.zip')).size / 1024).toFixed(2);
    console.log(`✅ ZIP criado: ${zipSize} KB`);
    console.log('🎉 Build concluído com sucesso!');
    console.log(`📁 Arquivos em: ${distDir}`);
});

output.on('close', () => {
    console.log(`📦 Total de bytes: ${archive.pointer()}`);
});

// Adicionar arquivos ao ZIP (excluindo o próprio ZIP)
archive.directory(distDir, false, (entry) => {
    return entry.name !== 'extension.zip' ? entry : false;
});

archive.pipe(output);
await archive.finalize();