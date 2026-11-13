<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import Cube from './Cube.svelte';
  import { pickTarget, type Mode } from '../lib/cube';
  import type { Settings } from '../lib/settings';
  import { isEditing } from '../lib/shortcuts';
  let { settings, update, blocked }: { settings: Settings; update: (s: Settings) => void; blocked: boolean } = $props();
  let target = $state(pickTarget(untrack(() => settings.mode)));
  let wrong = $state(false);
  let feedback = $state('');
  let input: HTMLInputElement;
  let timeout: ReturnType<typeof setTimeout>;
  let height = $state('100svh');
  let ready = $state(false);
  let lastMode = untrack(() => settings.mode);
  $effect(() => { if (settings.mode !== lastMode) { lastMode = settings.mode; clearTimeout(timeout); wrong = false; feedback = ''; target = pickTarget(settings.mode, target.id); } });
  function answer(value: string) {
    if (blocked || wrong || !/^[a-z]$/i.test(value)) return;
    if (value.toUpperCase() === target.letter) { feedback = ''; target = pickTarget(settings.mode, target.id); }
    else { wrong = true; feedback = `${target.letter}`; timeout = setTimeout(() => { target = pickTarget(settings.mode, target.id); wrong = false; feedback = ''; }, 850); }
  }
  function entered(e: Event) {
    const el = e.currentTarget as HTMLInputElement;
    if ((e as InputEvent).isComposing) return;
    const value = el.value; el.value = ''; if (value.length === 1) answer(value);
  }
  function keydown(e: KeyboardEvent) {
    if (blocked || e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.isComposing || isEditing(e.target)) return;
    if (/^[a-z]$/i.test(e.key)) { e.preventDefault(); answer(e.key); }
  }
  onMount(() => {
    const viewport = window.visualViewport;
    const resize = () => { height = `${viewport?.height ?? window.innerHeight}px`; };
    resize(); viewport?.addEventListener('resize', resize); window.addEventListener('resize', resize); ready = true;
    return () => { clearTimeout(timeout); viewport?.removeEventListener('resize', resize); window.removeEventListener('resize', resize); };
  });
</script>
<svelte:window onkeydown={keydown} />
<section class="trainer" style:--viewport={height} aria-label="Blind lettering trainer">
  <header><h1>Blind trainer</h1><label class="sr-only" for="practice-mode">Practice</label><select id="practice-mode" value={settings.mode} onchange={e => update({ ...settings, mode: e.currentTarget.value as Mode })}><option value="edges">Edges</option><option value="corners">Corners</option><option value="mixed">Mixed</option></select></header>
  <div class="stage">{#if ready}<Cube {target} top={settings.top} front={settings.front} {wrong} />{/if}</div>
  <div class="answer-area">
    <div class="feedback" class:wrong aria-live="polite">{#if wrong}<span>Correct letter</span> <strong>{feedback}</strong>{:else}<span>Type the highlighted sticker’s letter</span>{/if}</div>
    <input data-trainer-input bind:this={input} aria-label="Type a letter" placeholder="Tap to type" type="text" inputmode="text" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck={false} oninput={entered} oncompositionend={entered} onkeydown={e => { if (e.repeat && /^[a-z]$/i.test(e.key)) e.preventDefault(); }} />
    <p class="hint">Faint faces show the left, back and bottom.</p>
  </div>
</section>
<style>
  .trainer { height:var(--viewport); min-height:340px; max-height:1100px; display:flex; flex-direction:column; padding:72px 24px 16px; max-width:850px; margin:0 auto; }
  header { display:flex; align-items:center; justify-content:space-between; gap:20px; flex-shrink:0; }
  h1 { font-size:18px; margin:0; } select { width:120px; }
  .stage { flex:1; min-height:150px; }
  .answer-area { flex-shrink:0; text-align:center; padding-bottom:env(safe-area-inset-bottom); }
  .feedback { display:flex; align-items:center; justify-content:center; gap:14px; min-height:36px; font-size:14px; }
  .feedback.wrong { color:var(--error); } strong { font-size:28px; }
  input { display:block; margin:8px auto 0; text-align:center; width:180px; font-size:16px; background:var(--surface); }
  .hint { margin:14px 0 0; font-size:12px; color:var(--muted); }
  @media (max-width:767px) { .trainer { padding:64px 16px 12px; } h1 { font-size:16px; } .hint { font-size:11px; margin-top:8px; } .feedback { font-size:12px; } }
</style>
