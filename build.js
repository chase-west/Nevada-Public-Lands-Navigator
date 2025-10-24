import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Change to frontend directory
const frontendDir = join(__dirname, 'frontend');
process.chdir(frontendDir);

// Debug: check what's in node_modules
console.log('Checking frontend/node_modules...');
const nmPath = join(frontendDir, 'node_modules');
if (existsSync(nmPath)) {
  console.log('node_modules exists');
  const binPath = join(nmPath, '.bin');
  if (existsSync(binPath)) {
    console.log('.bin exists, contents:', readdirSync(binPath).slice(0, 10));
  } else {
    console.log('.bin does NOT exist');
  }
  if (existsSync(join(nmPath, 'vite'))) {
    console.log('vite package exists');
  } else {
    console.log('vite package NOT found');
  }
} else {
  console.log('node_modules does NOT exist');
}

// Try using vite from package
const vitePackagePath = join(frontendDir, 'node_modules', 'vite', 'bin', 'vite.js');
console.log('Trying vite at:', vitePackagePath);
execSync(`node ${vitePackagePath} build`, { stdio: 'inherit' });
