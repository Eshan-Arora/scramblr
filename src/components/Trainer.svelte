<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import Cube from './Cube.svelte';
  import Dropdown from './Dropdown.svelte';
  import { pickTarget, type Mode } from '../lib/cube';
  import type { Settings } from '../lib/settings';
  import { isEditing } from '../lib/shortcuts';
  let { settings, update, blocked }: { settings: Settings; update: (s: Settings) => void; blocked: boolean } = $props();
  let target = $state(pickTarget(untrack(() => settings.mode)));
  let wrong = $state(false);
  let modeOpen = $state(false);
  let modeDropdown: Dropdown;
  const modes = [{ value: 'edges', label: 'Edges' }, { value: 'corners', label: 'Corners' }, { value: 'mixed', label: 'Mixed' }];
  let feedback = $state('');
  let input: HTMLInputElement;
  let timeout: ReturnType<typeof setTimeout>;
  let height = $state('100svh');
  let viewportTop = $state('0px');
  let ready = $state(false);
  let lastMode = untrack(() => settings.mode);
  $effect(() => { if (settings.mode !== lastMode) { lastMode = settings.mode; clearTimeout(timeout); wrong = false; feedback = ''; target = pickTarget(settings.mode, target.id); } });
  function answer(value: string) {
    if (blocked || modeOpen || wrong || !/^[a-z]$/i.test(value)) return;
    if (value.toUpperCase() === target.letter) { feedback = ''; target = pickTarget(settings.mode, target.id); }
    else { wrong = true; feedback = `${target.letter}`; timeout = setTimeout(() => { target = pickTarget(settings.mode, target.id); wrong = false; feedback = ''; }, 850); }
  }
  function entered(e: Event) {
    const el = e.currentTarget as HTMLInputElement;
    if ((e as InputEvent).isComposing) return;
    const value = el.value; el.value = ''; if (value.length === 1) answer(value);
  }
  function keydown(e: KeyboardEvent) {
    if (!blocked && !e.repeat && !e.isComposing && e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'p' && !(e.target instanceof HTMLElement && e.target.closest('nav'))) {
      e.preventDefault(); modeDropdown.openMenu(); return;
    }
    if (modeOpen || (e.target instanceof HTMLElement && e.target.closest('[role="combobox"]'))) return;
    if (blocked || e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.isComposing || isEditing(e.target) || (e.target instanceof HTMLElement && !!e.target.closest('nav'))) return;
    if (/^[a-z]$/i.test(e.key)) { e.preventDefault(); answer(e.key); }
  }
  onMount(() => {
    const viewport = window.visualViewport;
    const resize = () => {
      height = `${viewport?.height ?? window.innerHeight}px`;
      viewportTop = `${viewport?.offsetTop ?? 0}px`;
      document.documentElement.style.setProperty('--trainer-viewport-top', viewportTop);
    };
    resize(); viewport?.addEventListener('resize', resize); viewport?.addEventListener('scroll', resize); window.addEventListener('resize', resize); ready = true;
    return () => { clearTimeout(timeout); viewport?.removeEventListener('resize', resize); viewport?.removeEventListener('scroll', resize); document.documentElement.style.removeProperty('--trainer-viewport-top'); window.removeEventListener('resize', resize); };
  });
</script>
<svelte:window onkeydown={keydown} />
<section class="trainer" style:--viewport={height} style:--viewport-top={viewportTop} aria-label="Blind lettering trainer">
  <header><h1>Blind trainer</h1><div class="practice-select"><Dropdown bind:this={modeDropdown} label="Practice" compactMobile value={settings.mode} options={modes} bind:open={modeOpen} shortcut="Shift P" onchange={value => update({ ...settings, mode: value as Mode })} onclose={() => input?.focus({ preventScroll: true })} /></div></header>
  <div class="stage">{#if ready}<Cube {target} {wrong} />{/if}</div>
  <div class="answer-area">
    <div class="feedback" class:wrong aria-live="polite">{#if wrong}<span>Correct letter</span> <strong>{feedback}</strong>{/if}</div>
    <input data-trainer-input bind:this={input} aria-label="Type a letter" type="text" inputmode="text" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck={false} oninput={entered} oncompositionend={entered} onkeydown={e => { if (e.repeat && /^[a-z]$/i.test(e.key)) e.preventDefault(); }} />
  </div>
</section>
<style>
  .trainer { height:var(--viewport); min-height:340px; max-height:1100px; display:flex; flex-direction:column; padding:72px 24px 16px; max-width:850px; margin:0 auto; }
  header { display:flex; align-items:center; justify-content:space-between; gap:20px; flex-shrink:0; }
  h1 { font-size:18px; margin:0; } .practice-select { width:184px; }
  .stage { flex:1; min-height:150px; }
  .answer-area { position:relative; flex-shrink:0; text-align:center; padding-bottom:env(safe-area-inset-bottom); }
  .feedback { position:absolute; bottom:100%; left:0; right:0; display:flex; align-items:center; justify-content:center; gap:14px; min-height:36px; font-size:14px; }
  .feedback.wrong { color:var(--error); } strong { font-size:28px; }
  input { display:block; margin:8px auto 0; text-align:center; width:180px; font-size:16px; background:var(--surface); }
  @media (max-width:767px) {
    .trainer { position:fixed; top:var(--viewport-top); left:0; right:0; width:100%; min-height:0; max-height:none; padding:60px 12px 12px; overflow:hidden; }
    .stage { min-height:0; }
    :global(html:has(.trainer)), :global(body:has(.trainer)) { overflow:hidden; overscroll-behavior:none; }
    :global(body:has(.trainer)) { position:fixed; inset:0; }
    :global(body:has(.trainer) .menu-toggle) { top:calc(max(12px, env(safe-area-inset-top)) + var(--trainer-viewport-top, 0px)); }
    header { position:absolute; top:max(12px, env(safe-area-inset-top)); right:12px; z-index:10; }
    h1 { display:none; }
    .practice-select { width:44px; }
    .feedback { font-size:12px; }
  }
</style>
