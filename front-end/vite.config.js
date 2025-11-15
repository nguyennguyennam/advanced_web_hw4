import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
    origin: 'https://nonseverable-noninjuriously-drucilla.ngrok-free.dev',
    cors: true,
  },
  plugins: [react()],
})
