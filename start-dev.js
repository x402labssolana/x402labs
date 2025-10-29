// Custom script to start Next.js with telemetry completely disabled
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_TELEMETRY_DEBUG = '0';
process.env.NEXT_TELEMETRY_ANONYMOUS_ID = '';
process.env.NEXT_TELEMETRY_SESSION_ID = '';
process.env.NEXT_TRACE = '0';
process.env.WEBPACK_CACHE = 'false';
process.env.GENERATE_SOURCEMAP = 'false';

// Disable telemetry at the process level
process.env.NEXT_TELEMETRY_DISABLED = '1';

const { spawn } = require('child_process');

console.log('Starting Next.js with telemetry completely disabled...');

const child = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1',
    NEXT_TELEMETRY_DEBUG: '0',
    NEXT_TRACE: '0',
    WEBPACK_CACHE: 'false',
    GENERATE_SOURCEMAP: 'false'
  }
});

child.on('error', (err) => {
  console.error('Failed to start Next.js:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Next.js exited with code ${code}`);
  process.exit(code);
});
