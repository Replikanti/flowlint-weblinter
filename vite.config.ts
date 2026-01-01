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
    exclude: ['**/node_modules/**', '**/dist/**', '**/playwright-report/**', '**/test-results/**', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'clover', 'cobertura'],
      include: ['src/**'],
      exclude: ['src/test/**', '**/node_modules/**', 'src/components/ui/**'], // UI components often low coverage
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
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