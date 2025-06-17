import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Custom plugin to handle jspdf and jspdf-autotable imports
const jspdfPlugin = () => {
  return {
    name: 'vite-plugin-jspdf',
    // This plugin will run before Vite's internal resolution
    enforce: 'pre',
    
    // Handle module resolution
    resolveId(id, importer) {
      // Handle jspdf imports
      if (id === 'jspdf') {
        return { id: 'jspdf/dist/jspdf.es.min.js', external: false };
      }
      
      // Handle jspdf-autotable imports
      if (id === 'jspdf-autotable') {
        return { id: 'jspdf-autotable/dist/jspdf.plugin.autotable.js', external: false };
      }
      
      return null;
    },
    
    // Handle module loading
    load(id) {
      // Special handling for jspdf-autotable if needed
      if (id.includes('jspdf-autotable')) {
        // Return the module content if needed
        return null; // Let Vite handle the actual loading
      }
      
      return null; // Let Vite handle other modules
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    jspdfPlugin()
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
      jsx: 'automatic',
      // Mark jspdf and jspdf-autotable as external to prevent optimization issues
      external: ['jspdf', 'jspdf-autotable']
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