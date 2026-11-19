import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Necesario para GitHub Pages: la app vive en /my-virtual-closet/
  base: '/my-virtual-closet/',
  // Configuración de Vitest
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})