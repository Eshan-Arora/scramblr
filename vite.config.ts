import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte(), {
    name: 'offline',
    apply: 'build',
    generateBundle(_options, bundle) {
      const assets = Object.keys(bundle).filter(name => /\.(js|css)$/.test(name));
      const entry = assets.find(name => name.startsWith('assets/index-') && name.endsWith('.js')) ?? 'app';
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: `
const CACHE = ${JSON.stringify('scramblr-')} + ${JSON.stringify(entry)};
const FILES = ${JSON.stringify(['/','/index.html', ...assets.map(name => '/' + name)])};
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('scramblr-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.open(CACHE).then(cache => cache.match('/index.html', { ignoreVary: true }))));
  } else {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request, { ignoreVary: true })).then(cached => cached || fetch(event.request)));
  }
});
` });
    },
  }],
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
