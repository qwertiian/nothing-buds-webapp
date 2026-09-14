import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { exec } from 'child_process';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'bluetooth-api-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/bluetooth/devices') {
            if (process.platform === 'win32') {
              const psCmd = `powershell -NoProfile -Command "Get-PnpDevice -Class Bluetooth | Where-Object FriendlyName -match 'Nothing|CMF|Buds|Ear' | Select-Object FriendlyName, InstanceId, Status | ConvertTo-Json -Compress"`;
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
              const psCmd = `powershell -NoProfile -Command "Start-Service bthserv -ErrorAction SilentlyContinue"`;
              exec(psCmd, () => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              });
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
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
