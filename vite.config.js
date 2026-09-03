import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import chatHandler from './api/chat.js'
import weatherHandler from './api/weather.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }
  if (env.OPENWEATHER_API_KEY) {
    process.env.OPENWEATHER_API_KEY = env.OPENWEATHER_API_KEY;
  }
  if (env.VITE_OPENWEATHER_API_KEY) {
    process.env.VITE_OPENWEATHER_API_KEY = env.VITE_OPENWEATHER_API_KEY;
  }

  return {
    plugins: [
      react(),
      {
        name: 'api-dev-middleware',
        configureServer(server) {
          // /api/chat middleware
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.statusCode = 200;
              res.end();
              return;
            }
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                req.body = JSON.parse(body);
              } catch {
                req.body = {};
              }

              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return res;
              };

              try {
                await chatHandler(req, res);
              } catch (err) {
                console.error('[Vite Dev Chat Handler Error]:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  error: 'SERVER_ERROR',
                  userMessage: "AURA is taking a moment. The travel assistant isn't available right now."
                }));
              }
            });
          });

          // /api/weather middleware
          server.middlewares.use('/api/weather', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.statusCode = 200;
              res.end();
              return;
            }

            // Parse URL query params
            const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            req.query = Object.fromEntries(urlObj.searchParams);

            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            try {
              await weatherHandler(req, res);
            } catch (err) {
              console.error('[Vite Dev Weather Handler Error]:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: 'Weather information is temporarily unavailable.'
              }));
            }
          });
        }
      }
    ],
    server: {
      port: 3000,
      open: false,
    },
  };
});
