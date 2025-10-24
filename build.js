import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Change to frontend directory
const frontendDir = join(__dirname, 'frontend');
process.chdir(frontendDir);

// Run vite build directly
const vitePackagePath = join(frontendDir, 'node_modules', 'vite', 'bin', 'vite.js');
execSync(`node ${vitePackagePath} build`, { stdio: 'inherit' });
