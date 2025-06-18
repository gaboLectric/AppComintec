import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: 'public/html', dest: '' },
        { src: 'public/css', dest: '' },
        { src: 'public/js', dest: '' },
      ]
    })
  ],
  build: {
    outDir: '../backend/src/main/resources/static',
    emptyOutDir: true,
    assetsDir: '.',
  },
})
