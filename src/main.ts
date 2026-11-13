import { mount } from 'svelte';
import App from './App.svelte';
import './style.css';

const target = document.getElementById('root');
if (!target) throw new Error('Missing app root');
mount(App, { target });

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const register = () => { void navigator.serviceWorker.register('/sw.js').catch(() => {}); };
    if ('requestIdleCallback' in window) window.requestIdleCallback(register, { timeout: 5000 });
    else setTimeout(register, 1000);
  });
}
