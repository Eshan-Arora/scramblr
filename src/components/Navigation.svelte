<script lang="ts">
  export type Page = 'scramble' | 'blind' | 'settings';
  let { current, navigate, modifier }: { current: Page; navigate: (page: Page) => void; modifier: string } = $props();
</script>
<nav aria-label="Main navigation">
  <span class="wordmark">scramblr</span>
  <button class:chosen={current === 'scramble'} aria-current={current === 'scramble' ? 'page' : undefined} onclick={() => navigate('scramble')}>Scramble</button>
  <button class:chosen={current === 'blind'} aria-current={current === 'blind' ? 'page' : undefined} onclick={() => navigate('blind')}>Blind trainer</button>
  <button class="settings-link" class:chosen={current === 'settings'} aria-current={current === 'settings' ? 'page' : undefined} onclick={() => navigate('settings')}>Settings <kbd>{modifier},</kbd></button>
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
