// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/signup': 'http://localhost:5000',
      '/login': 'http://localhost:5000',
      '/me': 'http://localhost:5000',
    }
  }
})
