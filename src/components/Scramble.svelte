<script lang="ts">
  import { onMount } from 'svelte';
  import { prepareScramble } from '../scrambles';
  import { isEditing } from '../lib/shortcuts';
  let { active }: { active: boolean } = $props();
  let scramble = $state('…');
  let count = $state(0);
  let failed = $state(false);
  let busy = $state(true);
  let disposed = false;
  const history: string[] = [];
  let position = -1;
  let next: ReturnType<typeof prepareScramble>;
  async function advance() {
    if (busy || disposed || !active) return;
    if (position + 1 < history.length) { scramble = history[++position]; count = position; failed = false; return; }
    busy = true;
    const result = await next;
    if (disposed) return;
    failed = Boolean(result.error);
    if (result.text !== undefined) { scramble = result.text; history.push(result.text); position = history.length - 1; count = position; }
    next = prepareScramble(); busy = false;
  }
  function previous() {
    if (!active || busy || position <= 0) return;
    scramble = history[--position]; count = position; failed = false;
  }
  function keydown(e: KeyboardEvent) {
    if (active && !e.repeat && !e.metaKey && !e.ctrlKey && !e.altKey && !isEditing(e.target) && !(e.target instanceof HTMLElement && e.target.closest('nav,[role="dialog"],[role="combobox"]')) && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault(); if (e.key === 'ArrowLeft') previous(); else void advance(); return;
    }
    if (!active || isEditing(e.target) || e.target instanceof HTMLButtonElement || e.code !== 'Space' || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
    e.preventDefault(); void advance();
  }
  onMount(() => { next = prepareScramble(); busy = false; void advance(); return () => { disposed = true; }; });
</script>
<svelte:window onkeydown={keydown} />
<section class="scramble-page" aria-label="Scramble generator">
  <button type="button" onclick={advance} onkeydown={e => { if (e.repeat && (e.code === 'Space' || e.key === 'Enter')) e.preventDefault(); }} aria-disabled={busy} title="New scramble" class:error={failed} class="scramble" style:--characters={Math.max(scramble.length, 1)} aria-live="polite" aria-label="3 by 3 scramble">{failed ? 'Couldn’t generate a scramble. Try again.' : scramble}</button>
  <span class="counter" aria-label={`Scramble ${count}`}>{count}</span>
</section>
<style>
  .scramble-page { padding:clamp(110px, 24svh, 280px) 24px 40px; text-align:center; container-type:inline-size; }
  .scramble { font-family:var(--font-mono); -webkit-tap-highlight-color:transparent; appearance:none; display:block; width:100%; border:0; padding:0; background:transparent; margin:0; font-weight:700; line-height:1.7; white-space:nowrap; font-size:min(32px, calc(100cqw / (var(--characters) * .61))); }
  .counter { display:block; margin-top:24px; color:var(--muted); font-size:16px; }
  .error { font-size:18px; white-space:normal; }
  @media (max-width: 767px) { .scramble-page { position:relative; min-height:100svh; padding:clamp(90px, 18svh, 160px) 24px 32px; } .scramble::after { content:""; position:absolute; inset:0; } .scramble { white-space:normal; font-size:24px; overflow-wrap:normal; } }
</style>
