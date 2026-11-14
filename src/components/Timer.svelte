<script lang="ts">
  import { onMount } from 'svelte';
  import { prepareScramble } from '../scrambles';
  import { isEditing } from '../lib/shortcuts';
  let { active }: { active: boolean } = $props();
  let phase = $state<'idle' | 'holding' | 'ready' | 'running'>('idle');
  let elapsed = $state(0);
  let scramble = $state('…');
  let busy = $state(true);
  let failed = $state(false);
  let held: 'key' | 'pointer' | null = null;
  let started = 0;
  let pressed = 0;
  let frame = 0;
  let readyTimeout: ReturnType<typeof setTimeout>;
  let disposed = false;
  const history: string[] = [];
  let position = -1;
  let next: ReturnType<typeof prepareScramble>;
  const display = $derived(format(elapsed));
  function format(ms: number) {
    const hundredths = Math.floor(ms / 10);
    const seconds = Math.floor(hundredths / 100);
    const fraction = String(hundredths % 100).padStart(2, '0');
    return seconds >= 60 ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}.${fraction}` : `${seconds}.${fraction}`;
  }
  async function advance() {
    if (position + 1 < history.length) { scramble = history[++position]; failed = false; return; }
    busy = true;
    const result = await next;
    if (disposed) return;
    failed = Boolean(result.error);
    if (result.text !== undefined) { scramble = result.text; history.push(result.text); position = history.length - 1; }
    next = prepareScramble(); busy = false;
  }
  function draw() { elapsed = performance.now() - started; frame = requestAnimationFrame(draw); }
  function stop() {
    elapsed = performance.now() - started;
    cancelAnimationFrame(frame); phase = 'idle'; void advance();
  }
  function press(source: 'key' | 'pointer') {
    if (!active || held) return;
    held = source;
    if (phase === 'running') { stop(); return; }
    if (busy || failed) return;
    pressed = performance.now(); phase = 'holding';
    readyTimeout = setTimeout(() => { if (held && active) phase = 'ready'; }, 300);
  }
  function release(source: 'key' | 'pointer') {
    if (held !== source) return;
    held = null; clearTimeout(readyTimeout);
    if ((phase === 'holding' || phase === 'ready') && active && performance.now() - pressed >= 300) {
      started = performance.now(); elapsed = 0; phase = 'running'; frame = requestAnimationFrame(draw);
    } else if (phase === 'holding' || phase === 'ready') phase = 'idle';
  }
  function cancelHold() { held = null; clearTimeout(readyTimeout); if (phase === 'holding' || phase === 'ready') phase = 'idle'; }
  $effect(() => { if (!active) cancelHold(); });
  function keydown(e: KeyboardEvent) {
    if (!active || e.repeat || e.metaKey || e.ctrlKey || e.altKey || e.isComposing || isEditing(e.target) || (e.target instanceof HTMLElement && e.target.closest('nav,[role="dialog"],button:not(.timer)'))) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (phase !== 'idle' || held || busy) return;
      if (e.key === 'ArrowRight') void advance();
      else if (position > 0) { scramble = history[--position]; failed = false; }
      return;
    }
    if (e.code !== 'Space') return;
    e.preventDefault(); press('key');
  }
  function keyup(e: KeyboardEvent) { if (e.code === 'Space') { if (held === 'key') e.preventDefault(); release('key'); } }
  onMount(() => {
    next = prepareScramble(); void advance();
    const visibility = () => { if (document.hidden) cancelHold(); };
    document.addEventListener('visibilitychange', visibility);
    return () => { disposed = true; cancelHold(); cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', visibility); };
  });
</script>
<svelte:window onkeydown={keydown} onkeyup={keyup} onblur={cancelHold} />
<section class="timer-page" aria-label="Solve timer">
  <p class="scramble" style:--characters={Math.max(scramble.length, 1)} aria-label="3 by 3 scramble">{failed ? 'Couldn’t generate a scramble.' : scramble}</p>
  <button class="timer" class:holding={phase === 'holding'} class:ready={phase === 'ready'} data-phase={phase}
    aria-label={phase === 'running' ? 'Stop timer' : `Time ${display}. Hold, then release to start`}
    onpointerdown={e => { if (!e.isPrimary || e.button !== 0) return; e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); press('pointer'); }}
    onpointerup={() => release('pointer')} onpointercancel={cancelHold} onlostpointercapture={() => { if (held === 'pointer') cancelHold(); }} oncontextmenu={e => e.preventDefault()}>{display}</button>
  {#if failed}<button class="quiet" onclick={() => void advance()}>Retry</button>{/if}
</section>
<style>
  .timer-page { position:relative; min-height:100svh; padding:clamp(110px, 24svh, 280px) 24px 40px; text-align:center; container-type:inline-size; }
  .scramble { margin:0; font-family:var(--font-mono); font-weight:700; line-height:1.7; white-space:nowrap; font-size:min(32px, calc(100cqw / (var(--characters) * .61))); }
  .timer { display:block; margin:32px auto 0; padding:12px 24px; border:0; background:transparent; font-family:var(--font); font-size:clamp(64px, 10vw, 112px); font-weight:700; font-variant-numeric:tabular-nums; line-height:1.2; touch-action:none; user-select:none; -webkit-user-select:none; -webkit-touch-callout:none; -webkit-tap-highlight-color:transparent; }
  .timer::after { content:''; position:absolute; inset:0; }
  .holding { color:var(--error); } .ready { color:#24844c; }
  .quiet { position:relative; z-index:1; }
  @media (max-width:767px) { .timer-page { padding:clamp(90px,18svh,160px) 24px 32px; } .scramble { white-space:normal; font-size:24px; } .timer { margin-top:32px; font-size:72px; padding:12px 0; } }
</style>
