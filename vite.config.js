import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'php-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.includes('.php') || req.url.startsWith('/cart') || req.url.startsWith('/checkout'))) {
            const urlObj = new URL(req.url, 'http://localhost');
            req.url = '/index.html' + urlObj.search;
          }
          next();
        });
      }
    }
  ],
})

