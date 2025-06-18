import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom']
  },
  server: {
    port: 3000,
    open: false, // Disable auto-opening browser in Docker
    host: '0.0.0.0', // Allow connections from outside the container
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Make sure Rollup can find and bundle these modules
      external: [],
    }
  },
  css: {
    devSourcemap: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    esbuildOptions: {
      // Enable JSX in .js files
      jsx: 'automatic'
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
});