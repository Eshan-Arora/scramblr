import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    // Solver workers cannot use DOM-based module preloading.
    modulePreload: false,
    rollupOptions: {
      output: {
        // Keep shared solver code independent of the DOM entry point.
        manualChunks(id) {
          if (id.includes('/cubing/dist/lib/cubing/chunks/chunk-')) return 'cubing';
        },
      },
    },
  },
});
