<script lang="ts">
  import { onMount, tick, type Component } from 'svelte';
  import { Dialog } from 'bits-ui';
  import Navigation from './components/Navigation.svelte';
  import QuickSwitcher from './components/QuickSwitcher.svelte';
  import type { Page } from './lib/navigation';
  import Scramble from './components/Scramble.svelte';
  import SettingsPage from './components/Settings.svelte';
  import { defaults, readSettings, saveSettings, type Settings } from './lib/settings';
  import { command } from './lib/shortcuts';
  let page = $state<Page>('scramble');
  let sidebar = $state(false);
  let switcher = $state(false);
  let navigation = $state<Navigation>();
  let main: HTMLElement;
  function focusPage() { (main.querySelector<HTMLElement>('[data-trainer-input]') ?? main).focus({ preventScroll: true }); }
  async function toggleSidebar() { sidebar = !sidebar; await tick(); if (sidebar) navigation?.focus(); else focusPage(); }
  async function closeSwitcher() { switcher = false; await tick(); focusPage(); }
  let mobile = $state(false);
  let modifier = $state('Ctrl+');
  let settings = $state<Settings>({ ...defaults });
  let storageFailed = $state(false);
  let Trainer = $state<Component<{ settings: Settings; update: (s: Settings) => void; blocked: boolean; exercise: 'positions' | 'colors' }> | null>(null);
  let loadFailed = $state(false);
  function update(s: Settings) { settings = s; storageFailed = !saveSettings(s); }
  function navigate(next: Page, keyboard = false) { page = next; window.location.hash = next === 'scramble' ? '' : next; if (mobile && !keyboard) sidebar = false; }
  async function loadTrainer() { try { loadFailed = false; Trainer = (await import('./components/Trainer.svelte')).default; } catch { loadFailed = true; } }
  $effect(() => { if ((page === 'positions' || page === 'colors') && !Trainer && !loadFailed) void loadTrainer(); });
  function keydown(e: KeyboardEvent) {
    const action = command(e);
    if (!action) return;
    e.preventDefault();
    if (action === 'switcher') { if (switcher) void closeSwitcher(); else switcher = true; }
    else if (!switcher && action === 'sidebar') void toggleSidebar();
    else if (!switcher) navigate('settings');
  }
  onMount(() => {
    settings = readSettings(); modifier = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl+';
    const media = matchMedia('(max-width: 767px)');
    const resize = () => { mobile = media.matches; sidebar = false; };
    const route = () => { const value = location.hash.slice(1); page = value === 'blind' ? 'positions' : value === 'positions' || value === 'colors' || value === 'settings' ? value : 'scramble'; };
    resize(); route(); media.addEventListener('change', resize); window.addEventListener('hashchange', route);
    return () => { media.removeEventListener('change', resize); window.removeEventListener('hashchange', route); };
  });
</script>
<svelte:window onkeydown={keydown} />
{#snippet menuIcon()}<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" /></svg>{/snippet}
{#if mobile}
  <Dialog.Root bind:open={sidebar}>
    <Dialog.Trigger class="menu-toggle" aria-label="Open sidebar">{@render menuIcon()}</Dialog.Trigger>
    <Dialog.Portal><Dialog.Overlay class="drawer-overlay" /><Dialog.Content class="drawer" onEscapeKeydown={e => e.preventDefault()}><Dialog.Title class="sr-only">Navigation</Dialog.Title><Dialog.Description class="sr-only">Choose a page</Dialog.Description><Navigation bind:this={navigation} current={page} {navigate} {modifier} leave={focusPage} /><Dialog.Close class="drawer-close" aria-label="Close sidebar">×</Dialog.Close></Dialog.Content></Dialog.Portal>
  </Dialog.Root>
{:else}
  <button class="menu-toggle" class:shifted={sidebar} aria-label={sidebar ? 'Close sidebar' : 'Open sidebar'} aria-expanded={sidebar} title={`${modifier}B`} onclick={toggleSidebar}>{@render menuIcon()}</button>
  {#if sidebar}<aside><Navigation bind:this={navigation} current={page} {navigate} {modifier} leave={focusPage} /></aside>{/if}
{/if}
<main bind:this={main} tabindex="-1" class:with-sidebar={sidebar && !mobile}>
  <div hidden={page !== 'scramble'}><Scramble active={page === 'scramble' && !(mobile && sidebar) && !switcher} /></div>
  {#if page === 'settings'}<SettingsPage {settings} {update} />{/if}
  {#if (page === 'positions' || page === 'colors')}
    {#if Trainer}<Trainer {settings} {update} exercise={page === 'colors' ? 'colors' : 'positions'} blocked={(mobile && sidebar) || switcher} />{:else}<div class="loading" role="status">{#if loadFailed}<button class="quiet" onclick={loadTrainer}>Retry loading trainer</button>{:else}Loading cube…{/if}</div>{/if}
  {/if}
  {#if storageFailed}<p class="storage-error" role="status">Settings work for this visit, but couldn’t be saved.</p>{/if}
</main>
{#if switcher}<QuickSwitcher {navigate} close={closeSwitcher} />{/if}
<style>
  aside { position:fixed; inset:0 auto 0 0; width:220px; background:var(--surface); border-right:1px solid var(--line); }
  main { min-width:0; min-height:100svh; } main.with-sidebar { margin-left:220px; }
  .loading { padding:30svh 24px; text-align:center; color:var(--muted); }
  .storage-error { padding:12px 24px; font-size:13px; color:var(--error); }
</style>
