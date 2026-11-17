<script lang="ts">
  import { untrack } from 'svelte';
  import { faces, stickers, type Face } from '../lib/cube';
  import { stickerNotation } from '../lib/buffers';
  import { isLetterScheme, speffzScheme, type LetterScheme } from '../lib/letter-scheme';
  let { initial, save, cancel }: { initial: LetterScheme; save: (scheme: LetterScheme) => void; cancel: () => void } = $props();
  let draft = $state<LetterScheme>(untrack(() => ({ edges: [...initial.edges], corners: [...initial.corners] })));
  let kind = $state<'edges' | 'corners'>('edges');
  let mobileFace = $state<Face>('U');
  let error = $state('');
  const names: Record<Face, string> = { U: 'Up', L: 'Left', F: 'Front', R: 'Right', B: 'Back', D: 'Down' };
  const cells = [-1, 0, 1].flatMap(row => [-1, 0, 1].map(x => ({ x, y: -row })));
  function edit(index: number, value: string) { draft[kind][index] = value.toUpperCase().replace(/[^A-Z]/g, '').slice(-1); error = ''; }
  function paste(e: ClipboardEvent, index: number) {
    const text = e.clipboardData?.getData('text').toUpperCase().replace(/[^A-Z]/g, '') ?? '';
    if (text.length < 2) return;
    e.preventDefault();
    for (const [i, letter] of [...text.slice(0, 4 - index % 4)].entries()) draft[kind][index + i] = letter;
    error = '';
  }
  function reset() { draft = speffzScheme(); error = ''; }
  function submit() {
    if (!isLetterScheme(draft)) { error = 'Use 24 unique letters from A–Z for edges and 24 for corners.'; return; }
    save({ edges: [...draft.edges], corners: [...draft.corners] });
  }
</script>
<section class="scheme-editor" aria-labelledby="custom-scheme-heading">
  <h3 id="custom-scheme-heading">Custom letter scheme</h3>
  <p class="description">Start from Speffz and change the stickers you use.</p>
  <div class="piece-tabs" aria-label="Piece type">
    <button type="button" class:selected={kind === 'edges'} aria-pressed={kind === 'edges'} onclick={() => { kind = 'edges'; }}>Edges</button>
    <button type="button" class:selected={kind === 'corners'} aria-pressed={kind === 'corners'} onclick={() => { kind = 'corners'; }}>Corners</button>
  </div>
  <div class="face-tabs" aria-label="Face">
    {#each faces as face}<button type="button" class:selected={mobileFace === face} aria-pressed={mobileFace === face} onclick={() => { mobileFace = face; }}>{face}</button>{/each}
  </div>
  <div class="net">
    {#each faces as face}
      <div class="face-wrap" class:mobile-active={mobileFace === face} data-face={face}>
        <p class="face-name">{face} · {names[face]}</p>
        <div class="face-grid">
          {#each cells as cell}
            {@const sticker = stickers.find(s => s.face === face && s.x === cell.x && s.y === cell.y)!}
            {#if sticker.kind === kind}
              {@const index = sticker.letter.charCodeAt(0) - 65}
              <input class="sticker" aria-label={`${kind === 'edges' ? 'Edge' : 'Corner'} ${stickerNotation(sticker)}`} value={draft[kind][index]} maxlength="1" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck={false} onfocus={e => e.currentTarget.select()} oninput={e => { edit(index, e.currentTarget.value); e.currentTarget.value = draft[kind][index]; }} onpaste={e => paste(e, index)} />
            {:else}<div class="sticker blank" class:center={sticker.kind === 'center'} aria-hidden="true">{sticker.kind === 'center' ? face : ''}</div>{/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>
  <p class="hint">Faces viewed from outside the cube. Edges and corners have separate letters.</p>
  <p class="message" class:error role="status">{error || `24 ${kind === 'edges' ? 'edge' : 'corner'} stickers · one letter per sticker`}</p>
  <div class="actions"><button type="button" class="reset" onclick={reset}>Reset to Speffz</button><div class="save-actions"><button type="button" class="quiet" onclick={cancel}>Cancel</button><button type="button" class="primary" onclick={submit}>Save custom</button></div></div>
</section>
<style>
  .scheme-editor { margin-top:20px; padding:20px 16px; border:1px solid var(--line); border-radius:6px; background:var(--subtle); container-type:inline-size; }
  h3 { margin:0 0 8px; font-size:18px; font-weight:500; }
  .description,.hint,.message { color:var(--muted); font-size:12px; line-height:1.6; }
  .description { margin:0 0 20px; font-size:13px; }
  .piece-tabs { display:inline-flex; gap:3px; border:1px solid var(--line); border-radius:5px; background:var(--surface); padding:3px; }
  .piece-tabs button,.face-tabs button { border:0; border-radius:4px; background:transparent; padding:8px 16px; font-size:14px; }
  .piece-tabs button.selected { background:var(--accent-soft); color:var(--accent); }
  .face-tabs { display:none; }
  .net { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin:24px 0; }
  .face-wrap[data-face="U"] { grid-column:2; }.face-wrap[data-face="L"] { grid-column:1; grid-row:2; }.face-wrap[data-face="F"] { grid-column:2; grid-row:2; }.face-wrap[data-face="R"] { grid-column:3; grid-row:2; }.face-wrap[data-face="B"] { grid-column:4; grid-row:2; }.face-wrap[data-face="D"] { grid-column:2; grid-row:3; }
  .face-name { margin:0 0 8px; font-size:12px; color:var(--muted); }
  .face-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:3px; }
  .sticker { display:grid; place-items:center; width:100%; min-width:0; min-height:44px; aspect-ratio:1; padding:0; text-align:center; border:1px solid var(--line); border-radius:4px; font:16px var(--font-mono); }
  .blank { background:#edf0eb; border-color:transparent; }.center { background:var(--accent-soft); color:var(--accent); font:12px var(--font); }
  .message { color:var(--accent); min-height:20px; }.message.error { color:var(--error); }
  .actions { display:flex; align-items:center; justify-content:space-between; gap:12px; border-top:1px solid var(--line); padding-top:16px; margin-top:16px; }
  .save-actions { display:flex; gap:8px; }.actions button { font-size:13px; }.reset { background:transparent; border:0; padding:8px 0; }.primary { border:1px solid var(--accent); border-radius:5px; padding:10px 16px; color:white; background:var(--accent); }
  @container(max-width:600px) {
    .face-tabs { display:flex; gap:4px; flex-wrap:wrap; margin-top:20px; }.face-tabs button { padding:8px 14px; min-width:44px; border:1px solid var(--line); background:var(--surface); }.face-tabs button.selected { background:var(--accent); color:white; border-color:var(--accent); }
    .net { display:block; }.face-wrap { display:none; }.face-wrap.mobile-active { display:block; width:180px; margin:0 auto; }.face-name { text-align:center; }
  }
  @media(max-width:420px) { .actions { flex-wrap:wrap; }.save-actions { margin-left:auto; } }
</style>
