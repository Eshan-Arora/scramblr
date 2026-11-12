<script lang="ts">
  import { onMount } from 'svelte';
  import { prepareScramble } from './scrambles';

  let scramble = $state('…');
  let count = $state(0);
  let failed = $state(false);
  let busy = true;
  let disposed = false;
  let initialized = false;
  let next: ReturnType<typeof prepareScramble>;
  const fontSize = $derived(`min(32px, calc((100vw - 64px) / ${Math.max(scramble.length, 1) * 0.61}))`);

  async function advance() {
    if (busy || disposed) return;
    busy = true;
    const result = await next;
    if (disposed) return;
    failed = Boolean(result.error);
    if (result.text !== undefined) {
      scramble = result.text;
      if (initialized) count += 1;
      initialized = true;
    }
    next = prepareScramble();
    busy = false;
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.code !== 'Space' || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    if (!event.repeat) void advance();
  }

  onMount(() => {
    next = prepareScramble();
    busy = false;
    void advance();
    return () => { disposed = true; };
  });
</script>

<svelte:window onkeydown={onKeyDown} />

<main>
  <section class="scramble">
    <p
      class:error={failed}
      style:font-size={failed ? '18px' : fontSize}
      aria-live="polite"
      aria-atomic="true"
      aria-label="3 by 3 scramble"
      title="Press Space for a new scramble"
    >
      {failed ? 'Couldn’t generate a scramble. Press Space to retry.' : scramble}
    </p>
    <span class="counter" aria-label={`Scramble ${count}`}>{count}</span>
  </section>
</main>

<style>
  main {
    min-height: 100svh;
    padding: 28svh 32px 32px;
  }
  .scramble {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  p {
    margin: 0;
    font-weight: 700;
    line-height: 1.65;
    text-align: center;
    white-space: nowrap;
  }
  p.error {
    max-width: 100%;
    white-space: normal;
  }
  .counter {
    font-size: 16px;
    line-height: 1.5;
    color: #777;
    font-variant-numeric: tabular-nums;
  }
</style>
