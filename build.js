import { execSync } from 'child_process';
import { join } from 'path';

// Change to frontend directory
process.chdir('frontend');

// Add node_modules/.bin to PATH
const binPath = join(process.cwd(), 'node_modules', '.bin');
process.env.PATH = `${binPath}:${process.env.PATH}`;

// Run build
execSync('npm run build', { stdio: 'inherit' });
