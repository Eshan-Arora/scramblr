<script lang="ts">
  import { onMount } from 'svelte';
  import { searchPages, type Page } from '../lib/navigation';
  let { navigate, close }: { navigate: (page: Page) => void; close: () => void } = $props();
  let dialog: HTMLDialogElement;
  let input: HTMLInputElement;
  let query = $state('');
  let selected = $state(0);
  const results = $derived(searchPages(query));
  function choose(index = selected) { const result = results[index]; if (result) { navigate(result.id); close(); } }
  function keydown(e: KeyboardEvent) {
    if (e.isComposing) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); selected = results.length ? (selected + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length : 0;
    } else if (e.key === 'Enter') { e.preventDefault(); choose(); }
  }
  onMount(() => { dialog.showModal(); input.focus(); });
</script>
<dialog aria-label="Switch page" bind:this={dialog} oncancel={close} onclick={e => { if (e.target === dialog) close(); }} onclose={close}>
  <div class="panel">
    <input bind:this={input} bind:value={query} oninput={() => selected = 0} onkeydown={keydown} role="combobox" aria-label="Switch page" aria-expanded="true" aria-controls="page-results" aria-autocomplete="list" aria-activedescendant={results[selected] ? `result-${results[selected].id}` : undefined} placeholder="Go to…" autocomplete="off" />
    <div id="page-results" role="listbox" aria-label="Pages">
      {#each results as result, index (result.id)}
        <button id={`result-${result.id}`} role="option" aria-selected={selected === index} tabindex="-1" class:chosen={selected === index} onpointermove={() => selected = index} onclick={() => choose(index)}>{result.label}</button>
      {:else}<p>No matching pages</p>{/each}
    </div>
  </div>
</dialog>
<style>
  dialog { padding:0; border:1px solid var(--line); border-radius:8px; width:min(440px,calc(100vw - 32px)); margin:18svh auto auto; background:var(--surface); color:var(--text); box-shadow:0 16px 60px #0002; }
  dialog::backdrop { background:#0003; }
  .panel { padding:10px; } input { width:100%; margin-bottom:8px; }
  button { display:block; width:100%; text-align:left; border:0; border-radius:4px; background:transparent; padding:12px; }
  .chosen { background:var(--accent-soft); color:var(--accent); } p { padding:12px; color:var(--muted); font-size:14px; }
</style>
