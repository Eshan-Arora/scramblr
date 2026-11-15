<script lang="ts">
  import CubeHidden from './CubeHidden.svelte';
  import Cube from './Cube.svelte';
  
  import RefinedMockups from './RefinedMockups.svelte';
  const previous = new URLSearchParams(location.search).get('previous') !== 'hidden';
  import { faces, stickers, type Face } from '../lib/cube';
  let face = $state<Face>('D');
  let kind = $state('edges');
  let index = $state(0);
  let bottomOnly = $state(true);
  const pool = $derived(stickers.filter(s => s.face === face && s.kind === kind));
  const target = $derived(pool[index % pool.length]);
  const options = [
    {title:'Keep the front over the floor',text:'The bottom sits behind the complete front frame. Its near edges remain visible across the floor, establishing a view down into the cube.'},
    {title:'Gap behind the floor',text:'Leave a narrow gap at the target face for background edges, then restore the continuous front frame over the floor.'},
    {title:'Hide the rear uprights',text:'Remove both vertical edges at the back. Keep the upper rear edge and the target’s complete border.'},
    {title:'Open the rear top edge',text:'Remove just the top edge of the rear square, breaking that competing closed frame.'},
    {title:'Hide the rear frame',text:'Remove all four rear-frame edges. The highlighted face redraws its own border so the target stays complete.'},
    {title:'Hide the back wall too',text:'Remove the rear frame and its wall fill. Keep the side wall, front outline, and complete target face.'},
    {title:'Fade the background cage',text:'Fade the background walls and edges. The front frame stays complete and sits over the crisp bottom face.'},
    {title:'Silhouette and front frame',text:'Keep the outer contour and the near frame. Remove the internal rear lines; the floor stays behind the front.'},
    {title:'Keep edges attached to target',text:'Keep edges that touch the target, plus the complete front frame for bottom targets. Remove the opposite frame.'},
    {title:'Let two faces block lines',text:'An opaque rear panel covers background lines. Draw the front frame last so it remains in front of the bottom.'},
  ];
</script>
<svelte:head><title>Blind · hidden-line studies</title></svelte:head>
{#if previous}<RefinedMockups />{:else}
<main>
  <header><a href="/">scramblr</a><a href="/#positions">Back to trainer ↗</a></header>
  <div class="intro"><span class="eyebrow">BLIND / DESIGN STUDIES</span><h1>Hide the lines that confuse depth.</h1><p>Ten studies using the original projection. Look down into the cube: the bottom stays behind the front frame. Each version hides a different part of the background cage.</p></div>
  <div class="controls">
    <label>Target face<select bind:value={face}>{#each faces as f}<option value={f}>{{ U:'Top', D:'Bottom', L:'Left', R:'Right', F:'Front', B:'Back' }[f]}</option>{/each}</select></label>
    <label>Piece<select bind:value={kind}><option value="edges">Edge</option><option value="corners">Corner</option></select></label>
    <button class="quiet" onclick={() => index++}>Next sticker →</button>
    <label class="scope"><input type="checkbox" bind:checked={bottomOnly}/> Only change bottom-face targets</label>
  </div>
  <p class="scope-note">{bottomOnly && face !== 'D' ? 'Bottom-only mode: these previews now show the unchanged cube. Uncheck the box to test this face.' : 'All ten show the same target. Try the front-bottom sticker as well as the rear-bottom sticker.'}</p>
  <div class="studies">
    {#each options as option, i}<article>
      <div class="card-heading"><span class="number">{String(i + 1).padStart(2,'0')}</span><h3>{option.title}</h3></div>
      <div class="visual"><CubeHidden {target} variant={i + 1} {bottomOnly}/></div><p>{option.text}</p>
    </article>{/each}
    <article class="baseline"><div class="card-heading"><span class="number">↩</span><h3>Original cube</h3></div><div class="visual"><Cube {target} wrong={false}/></div><p>Reference: the full outline is drawn over the target face, including any crossing lines.</p></article>
  </div>
  <footer><p>Bottom-only is on by default. Turn it off to compare the same rules on other faces. For bottom targets, the near frame is always drawn in front of the floor. Only the background treatment varies; the camera and projection stay fixed.</p><p><a href="?mockups&previous=refined">Earlier perspective studies ↗</a></p></footer>
</main>
{/if}
<style>
  main { max-width:1440px; margin:auto; padding:28px 40px 64px; }
  header { display:flex; justify-content:space-between; gap:20px; } a { color:var(--accent); text-decoration:none; font-size:14px; } header a:first-child { font-size:18px; font-weight:700; }
  .intro { margin:56px 0 28px; } .eyebrow { font-size:11px; letter-spacing:.14em; color:var(--accent); font-weight:700; } h1 { font-size:clamp(28px,4vw,44px); letter-spacing:-.04em; margin:12px 0; } p { color:var(--muted); font-size:14px; line-height:1.6; }
  .controls { display:flex; flex-wrap:wrap; align-items:end; gap:12px; margin-bottom:28px; } label { display:grid; gap:7px; font-size:12px; color:var(--muted); } select { min-width:130px; }
  .scope { display:flex; align-items:center; gap:8px; min-height:44px; font-size:14px; } .scope input { width:18px; height:18px; min-height:18px; accent-color:var(--accent); } .scope-note { min-height:23px; }
  .studies { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; } article { border:1px solid var(--line); border-radius:12px; padding:20px; background:var(--surface); } .card-heading { display:flex; align-items:center; gap:10px; min-height:28px; flex-wrap:wrap; } .number { color:var(--muted); font-size:12px; } h3 { font-size:16px; margin:0; } footer { margin-top:36px; max-width:900px; } .visual { height:280px; } article p { margin:0; } .baseline { background:var(--subtle); }
  @media(max-width:1100px) { .studies { grid-template-columns:repeat(2,minmax(0,1fr)); } }
  @media(max-width:650px) { main { padding:24px 16px 40px; } .intro { margin-top:36px; } .studies { grid-template-columns:1fr; } .visual { height:300px; } }
</style>
