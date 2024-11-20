import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://admin.darussalam2.com/',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/storage': {
        target: 'http://admin.darussalam2.com/',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})
