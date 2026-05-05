import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/genius': {
        target:      'https://pay.genius.ci',
        changeOrigin: true,
        rewrite:     (path) => path.replace(/^\/api\/genius/, ''),
      },
    },
  },
})
