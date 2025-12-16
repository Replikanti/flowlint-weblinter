/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@flowlint-web': path.resolve(__dirname, '../flowlint-web/src'),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  build: {
    modulePreload: {
      resolveDependencies: (_filename, deps) => {
        return deps.filter((dep) => !dep.includes('chunk-mermaid') && !dep.includes('chunk-syntax-highlighter'));
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-markdown'],
          'chunk-mermaid': ['mermaid'],
          'chunk-syntax-highlighter': ['react-syntax-highlighter'],
        },
      },
    },
  },
})