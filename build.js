import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Change to frontend directory
const frontendDir = join(__dirname, 'frontend');
process.chdir(frontendDir);

// Run vite build directly with full path
const vitePath = join(frontendDir, 'node_modules', '.bin', 'vite');
execSync(`${vitePath} build`, { stdio: 'inherit' });
