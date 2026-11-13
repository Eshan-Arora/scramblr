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
  let initialized = false;
  let next: ReturnType<typeof prepareScramble>;
  async function advance() {
    if (busy || disposed || !active) return;
    busy = true;
    const result = await next;
    if (disposed) return;
    failed = Boolean(result.error);
    if (result.text !== undefined) { scramble = result.text; if (initialized) count++; initialized = true; }
    next = prepareScramble(); busy = false;
  }
  function keydown(e: KeyboardEvent) {
    if (!active || isEditing(e.target) || e.target instanceof HTMLButtonElement || e.code !== 'Space' || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
    e.preventDefault(); void advance();
  }
  onMount(() => { next = prepareScramble(); busy = false; void advance(); return () => { disposed = true; }; });
</script>
<svelte:window onkeydown={keydown} />
<section class="scramble-page" aria-label="Scramble generator">
  <p class:error={failed} class="scramble" style:--characters={Math.max(scramble.length, 1)} aria-live="polite" aria-label="3 by 3 scramble">{failed ? 'Couldn’t generate a scramble. Try again.' : scramble}</p>
  <span class="counter" aria-label={`Scramble ${count}`}>{count}</span>
  <button class="quiet next" onclick={advance} disabled={busy}>New scramble <span class="shortcut">space</span></button>
</section>
<style>
  .scramble-page { padding:clamp(110px, 24svh, 280px) 24px 40px; text-align:center; container-type:inline-size; }
  .scramble { margin:0; font-weight:700; line-height:1.7; white-space:nowrap; font-size:min(32px, calc(100cqw / (var(--characters) * .61))); }
  .counter { display:block; margin-top:24px; color:var(--muted); font-size:16px; }
  .next { margin-top:24px; }
  .shortcut { font-size:12px; margin-left:12px; color:var(--muted); }
  .error { font-size:18px; white-space:normal; }
  @media (max-width: 767px) { .scramble-page { padding:clamp(90px, 18svh, 160px) 24px 32px; } .scramble { white-space:normal; font-size:24px; overflow-wrap:normal; } .shortcut { display:none; } }
</style>
