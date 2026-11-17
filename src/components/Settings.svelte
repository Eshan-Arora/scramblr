<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { isEditing } from '../lib/shortcuts';
  import LetterSchemeEditor from './LetterSchemeEditor.svelte';
  import { speffzScheme, type LetterScheme } from '../lib/letter-scheme';
  import { colors, opposite, type Color } from '../lib/cube';
  import { bufferOptions } from '../lib/buffers';
  import Dropdown from './Dropdown.svelte';
  import type { Settings } from '../lib/settings';
  let { settings, update }: { settings: Settings; update: (settings: Settings) => void } = $props();
  let search = $state('');
  let searchInput: HTMLInputElement;
  const terms = $derived(search.toLowerCase().trim().split(/\s+/).filter(Boolean));
  const matches = (text: string) => terms.every(term => text.toLowerCase().includes(term));
  const showScheme = $derived(matches('blind letter letters scheme schemes speffz custom configure configuration alphabet positions colors edges corners stickers'));
  const showOrientation = $derived(matches('blind solving orientation top front color yellow blue white green red orange'));
  const showBuffers = $derived(matches('blind hide buffer buffers pieces edge edges corner corners positions colors'));
  onMount(() => { searchInput.focus({ preventScroll: true }); });
  function searchShortcut(e: KeyboardEvent) {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey || e.isComposing || isEditing(e.target)) return;
    e.preventDefault(); searchInput.focus();
  }
  let editingScheme = $state(false);
  let customButton: HTMLButtonElement;
  async function closeEditor() { editingScheme = false; await tick(); customButton?.focus({ preventScroll: true }); }
  function saveScheme(customScheme: LetterScheme) { update({ ...settings, customScheme, letterScheme: 'custom' }); void closeEditor(); }
  const options = colors.map(value => ({ value, label: value[0].toUpperCase() + value.slice(1) }));
  function topChanged(value: string) {
    const top = value as Color;
    const front = settings.front === top || settings.front === opposite[top] ? colors.find(c => c !== top && c !== opposite[top])! : settings.front;
    update({ ...settings, top, front });
  }
</script>
<svelte:window onkeydown={searchShortcut} />
<section class="settings-page">
  <h1>Settings</h1>
  <div class="settings-search">
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.4" /><path d="m13 13 4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" /></svg>
    <input type="search" bind:this={searchInput} bind:value={search} data-settings-search aria-label="Search settings" aria-keyshortcuts="/" placeholder="Search settings" autocomplete="off" spellcheck={false} />
    <kbd aria-hidden="true">/</kbd>
  </div>
  {#if !showScheme && !showOrientation && !showBuffers}<p class="no-results" role="status">No settings match “{search}”.</p>{/if}
  <section aria-labelledby="blind-settings-heading" hidden={!showScheme && !showOrientation && !showBuffers}>
  <h2 id="blind-settings-heading">Blind</h2>
  <div class="scheme-setting" hidden={!showScheme}>
    <label class="scheme-label" for="letter-scheme">Letter scheme</label>
    <div class="scheme-controls"><Dropdown id="letter-scheme" label="Letter scheme" value={settings.letterScheme} options={settings.customScheme ? [{ value: 'speffz', label: 'Speffz' }, { value: 'custom', label: 'Custom' }] : [{ value: 'speffz', label: 'Speffz' }]} onchange={value => { update({ ...settings, letterScheme: value as 'speffz' | 'custom' }); editingScheme = false; }} /><button class="quiet" bind:this={customButton} aria-expanded={editingScheme} onclick={() => { editingScheme = !editingScheme; }}>{settings.customScheme ? 'Edit custom…' : 'Custom…'}</button></div>
    {#if editingScheme}<LetterSchemeEditor initial={settings.customScheme ?? speffzScheme()} save={saveScheme} cancel={closeEditor} />{/if}
  </div>
  <div hidden={!showOrientation}>
  <h3>Solving orientation</h3>
  <div class="fields">
    <div class="field"><label for="top-color">Top</label><Dropdown id="top-color" label="Top" value={settings.top} {options} onchange={topChanged} /></div>
    <div class="field"><label for="front-color">Front</label><Dropdown id="front-color" label="Front" value={settings.front} options={options.filter(c => c.value !== settings.top && c.value !== opposite[settings.top])} onchange={value => update({ ...settings, front: value as Color })} /></div>
  </div>
  </div>
  <div hidden={!showBuffers}>
  <label class="toggle-row"><span>Hide buffer pieces</span><input type="checkbox" role="switch" checked={settings.hideBuffers} onchange={e => update({ ...settings, hideBuffers: e.currentTarget.checked })} /></label>
  {#if settings.hideBuffers}
    <div class="fields">
      <div class="field"><label for="edge-buffer">Edge buffer</label><Dropdown id="edge-buffer" label="Edge buffer" value={settings.edgeBuffer} options={bufferOptions('edges')} onchange={edgeBuffer => update({ ...settings, edgeBuffer })} /></div>
      <div class="field"><label for="corner-buffer">Corner buffer</label><Dropdown id="corner-buffer" label="Corner buffer" value={settings.cornerBuffer} options={bufferOptions('corners')} onchange={cornerBuffer => update({ ...settings, cornerBuffer })} /></div>
    </div>
  {/if}
  </div>
  </section>
</section>
<style>
  .settings-search { position:relative; margin-bottom:32px; }
  .settings-search svg { position:absolute; top:14px; left:12px; color:var(--muted); pointer-events:none; }
  .settings-search input { width:100%; padding-left:40px; padding-right:42px; }
  .settings-search kbd { position:absolute; right:14px; top:13px; color:var(--muted); font:14px var(--font-mono); pointer-events:none; }
  .settings-search:focus-within kbd { display:none; }
  .no-results { color:var(--muted); font-size:14px; line-height:1.6; }

  .scheme-setting { margin-top:24px; }
  .scheme-label { display:block; font-size:14px; margin-bottom:10px; }
  .scheme-controls { display:flex; align-items:center; gap:10px; }
  .scheme-controls :global(.app-select) { flex:1; min-width:0; }
  .scheme-controls .quiet { white-space:nowrap; }

  h3 { font-size:14px; font-weight:400; margin:24px 0 0; }
  .toggle-row { margin-top:32px; }
  .toggle-row { display:flex; align-items:center; justify-content:space-between; min-height:44px; cursor:pointer; font-size:16px; }
  .toggle-row input { appearance:none; width:40px; min-height:24px; height:24px; padding:2px; margin:10px 0; border:0; border-radius:20px; background:#a4ada6; cursor:pointer; }
  .toggle-row input::before { content:''; display:block; width:20px; height:20px; border-radius:50%; background:white; }
  .toggle-row input:checked { background:var(--accent); }
  .toggle-row input:checked::before { transform:translateX(16px); }
  .settings-page { max-width:720px; margin:0 auto; padding:88px 24px 48px; }
  h1 { margin:0 0 24px; font-size:24px; } h2 { font-size:16px; margin:0 0 12px; }
  .fields { display:flex; gap:24px; margin-top:24px; } .field { display:grid; gap:10px; flex:1; min-width:0; font-size:14px; }
</style>
