<script lang="ts">
  import { pages, type Page } from '../lib/navigation';
  let { current, navigate, modifier, leave }: { current: Page; navigate: (page: Page, keyboard?: boolean) => void; modifier: string; leave: () => void } = $props();
  let nav: HTMLElement;
  export function focus() { nav.querySelector<HTMLButtonElement>('[aria-current="page"]')?.focus(); }
  function keydown(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); leave(); return; }
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const index = pages.findIndex(page => page.id === current);
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? pages.length - 1 : (index + (e.key === 'ArrowDown' ? 1 : -1) + pages.length) % pages.length;
    navigate(pages[next].id, true);
    nav.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
  }
</script>
<nav bind:this={nav} aria-label="Main navigation">
  <span class="wordmark">scramblr</span>
  {#each pages as page}
    <button onkeydown={keydown} class:settings-link={page.id === 'settings'} class:chosen={current === page.id} aria-current={current === page.id ? 'page' : undefined} onclick={() => navigate(page.id)}>{page.label}{#if page.id === 'settings'}<kbd>{modifier},</kbd>{/if}</button>
  {/each}
</nav>
<style>
  nav { display:flex; flex-direction:column; gap:4px; height:100%; padding:24px 12px; }
  .wordmark { padding:4px 12px 30px; font-weight:700; font-size:18px; }
  button { text-align:left; padding:12px; border:0; border-radius:5px; background:transparent; display:flex; align-items:center; justify-content:space-between; }
  button:hover { background:var(--subtle); }
  .chosen { color:var(--accent); background:var(--accent-soft); font-weight:700; }
  .settings-link { margin-top:auto; }
  kbd { font:12px var(--font); color:var(--muted); }
</style>
