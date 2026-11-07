import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy opcional: así en desarrollo puedes llamar /api sin problemas de CORS.
    // El backend Laravel corre en http://localhost:8000 (ver docker-compose de IPS-v2).
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
