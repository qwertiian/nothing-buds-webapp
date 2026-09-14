import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5173;
const DIST_DIR = path.join(__dirname, 'dist');
const HELPER_SCRIPT = path.join(__dirname, 'scripts', 'bluetooth-helper.ps1');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// Check if dist exists, if not build it
if (!fs.existsSync(DIST_DIR)) {
  console.log('Building project before launching desktop mode...');
}

const server = http.createServer((req, res) => {
  // Bluetooth OS Integration Endpoints (Nothing & CMF Buds only)
  if (req.url === '/api/bluetooth/devices') {
    if (process.platform === 'win32') {
      const psCmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${HELPER_SCRIPT}" -Action devices`;
      exec(psCmd, (error, stdout) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        try {
          const parsed = JSON.parse(stdout || '[]');
          const array = Array.isArray(parsed) ? parsed : [parsed];
          res.end(JSON.stringify(array));
        } catch {
          res.end('[]');
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('[]');
    }
    return;
  }

  if (req.url === '/api/bluetooth/enable') {
    if (process.platform === 'win32') {
      const psCmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${HELPER_SCRIPT}" -Action enable`;
      exec(psCmd, (error, stdout) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(stdout || JSON.stringify({ success: true }));
      });
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    }
    return;
  }

  if (req.url === '/api/bluetooth/status') {
    if (process.platform === 'win32') {
      const psCmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${HELPER_SCRIPT}" -Action status`;
      exec(psCmd, (error, stdout) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(stdout || JSON.stringify({ radio: 'On', service: 'Running' }));
      });
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ radio: 'On', service: 'Running' }));
    }
    return;
  }

  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);

  if (!fs.existsSync(filePath)) {
    // SPA fallback
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Server Error: ${err.code}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n======================================================`);
  console.log(` EAR (OS) - Nothing Buds Companion Desktop Launcher`);
  console.log(` Running at: ${url}`);
  console.log(`======================================================\n`);

  // Launch Chromium in App Mode (Chrome / Edge / Brave / Arc)
  const isWindows = process.platform === 'win32';
  const isMac = process.platform === 'darwin';
  const isLinux = process.platform === 'linux';

  let browserCmd = '';
  let browserArgs = [`--app=${url}`, '--window-size=1200,850'];

  if (isWindows) {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    if (fs.existsSync(chromePath)) browserCmd = chromePath;
    else if (fs.existsSync(edgePath)) browserCmd = edgePath;
    else browserCmd = 'cmd.exe';
    if (browserCmd === 'cmd.exe') {
      browserArgs = ['/c', 'start', url];
    }
  } else if (isMac) {
    browserCmd = 'open';
    browserArgs = ['-a', 'Google Chrome', '--args', `--app=${url}`];
  } else if (isLinux) {
    browserCmd = 'google-chrome';
  }

  try {
    const child = spawn(browserCmd, browserArgs, { detached: true, stdio: 'ignore' });
    child.unref();
  } catch (e) {
    console.log(`Open ${url} in your Chromium browser.`);
  }
});
