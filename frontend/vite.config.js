import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: '../backend/src/main/resources/static',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/html/main.html'),
        index: resolve(__dirname, 'public/html/index.html'),
        login: resolve(__dirname, 'public/html/login.html'),
        borrador: resolve(__dirname, 'public/html/borrador-cotizaciones.html'),
        solicitud: resolve(__dirname, 'public/html/solicitud-material.html'),
      },
      output: {
        // Mantener estructura de carpetas para legacy html
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          if (assetInfo.name && assetInfo.name.endsWith('.js')) {
            return 'js/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
})
