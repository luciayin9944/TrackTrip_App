// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/me': 'http://localhost:5000',
      '/signup': 'http://localhost:5000',
      '/login': 'http://localhost:5000',
      '/trips': 'http://localhost:5000',
      "/expenses": "http://localhost:5000",
    }
  }
})
