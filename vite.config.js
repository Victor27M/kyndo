import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@data': path.resolve(__dirname, './src/data'),
      '@api': path.resolve(__dirname, './server'),
      '@api/types': path.resolve(__dirname, './server/types'),
      '@api/services': path.resolve(__dirname, './server/services'),
      '@api/repositories': path.resolve(__dirname, './server/repositories'),
      '@api/controllers': path.resolve(__dirname, './server/controllers'),
      '@api/middleware': path.resolve(__dirname, './server/middleware'),
      '@api/errors': path.resolve(__dirname, './server/errors'),
      '@api/utils': path.resolve(__dirname, './server/utils'),
      '@api/config': path.resolve(__dirname, './server/config'),
    },
  },
})
