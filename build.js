import { execSync } from 'child_process';

// Change to frontend directory and run build
process.chdir('frontend');
execSync('npm run build', { stdio: 'inherit' });
