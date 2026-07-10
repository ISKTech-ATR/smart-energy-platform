import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // '/' for local dev & most hosts; set BASE_PATH=/smart-energy-platform/ for GitHub Pages
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5175,
    host: true,
  },
})
