import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { exec } from 'child_process';
import path from 'path';

const HELPER_SCRIPT = path.join(__dirname, 'scripts', 'bluetooth-helper.ps1');

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'bluetooth-api-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/bluetooth/devices') {
            if (process.platform === 'win32') {
              const psCmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${HELPER_SCRIPT}" -Action devices`;
              exec(psCmd, (error, stdout) => {
                res.setHeader('Content-Type', 'application/json');
                try {
                  const parsed = JSON.parse(stdout || '[]');
                  const array = Array.isArray(parsed) ? parsed : [parsed];
                  res.end(JSON.stringify(array));
                } catch {
                  res.end('[]');
                }
              });
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.end('[]');
            }
            return;
          }

          if (req.url === '/api/bluetooth/enable') {
            if (process.platform === 'win32') {
              const psCmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${HELPER_SCRIPT}" -Action enable`;
              exec(psCmd, (error, stdout) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(stdout || JSON.stringify({ success: true }));
              });
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            }
            return;
          }

          if (req.url === '/api/bluetooth/status') {
            if (process.platform === 'win32') {
              const psCmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${HELPER_SCRIPT}" -Action status`;
              exec(psCmd, (error, stdout) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(stdout || JSON.stringify({ radio: 'On', service: 'Running' }));
              });
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ radio: 'On', service: 'Running' }));
            }
            return;
          }

          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
});
