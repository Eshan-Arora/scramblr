<script lang="ts">
  import CubeRearCorner from './CubeRearCorner.svelte';
  
  import HiddenMockups from './HiddenMockups.svelte';
  const previous = new URLSearchParams(location.search).has('previous');
  import { faces, stickers, type Face } from '../lib/cube';
  let face = $state<Face>('D');
  let kind = $state('edges');
  let index = $state(0);
  let bottomOnly = $state(true);
  const pool = $derived(stickers.filter(s => s.face === face && s.kind === kind));
  const target = $derived(pool[index % pool.length]);
  const options = [
    {title:'Hide all three',text:'Remove the rear-left upright and the two bottom edges meeting it.'},
    {title:'Fine dots',text:'Closely spaced dots at full contrast.'},
    {title:'Spaced dots',text:'Wider spacing makes the hidden edges quieter.'},
    {title:'Short dashes',text:'Short, regular dashes mark the three hidden edges.'},
    {title:'Long dashes',text:'A more conventional hidden-edge drawing.'},
    {title:'Fade to 45%',text:'Keep the lines continuous, at less than half opacity.'},
    {title:'Fade to 22%',text:'A light reference with a stronger front/back distinction.'},
    {title:'Almost invisible · 9%',text:'A trace of the rear corner, close to fully hidden.'},
    {title:'Faded dots',text:'Dotted lines at 35% opacity.'},
    {title:'Faded short dashes',text:'Short dashes at 30% opacity.'},
  ];
</script>
<svelte:head><title>Blind · three rear edges</title></svelte:head>
{#if previous}<HiddenMockups />{:else}
<main>
  <header><a href="/">scramblr</a><a href="/#positions">Back to trainer ↗</a></header>
  <div class="intro"><span class="eyebrow">BLIND / DESIGN STUDIES</span><h1>Just the three rear edges.</h1><p>Hidden, dotted, dashed, and faded treatments for the three edges meeting at the rear-left-bottom corner. Same camera, same walls, same front frame.</p></div>
  <div class="controls">
    <label>Target face<select bind:value={face}>{#each faces as f}<option value={f}>{{ U:'Top', D:'Bottom', L:'Left', R:'Right', F:'Front', B:'Back' }[f]}</option>{/each}</select></label>
    <label>Piece<select bind:value={kind}><option value="edges">Edge</option><option value="corners">Corner</option></select></label>
    <button class="quiet" onclick={() => index++}>Next sticker →</button>
    <label class="scope"><input type="checkbox" bind:checked={bottomOnly}/> Only change bottom-face targets</label>
  </div>
  <p class="scope-note">{bottomOnly && face !== 'D' ? 'Bottom-only mode: these previews now show the unchanged cube. Uncheck the box to test this face.' : 'All ten show the same target. Try the front-bottom sticker as well as the rear-bottom sticker.'}</p>
  <div class="studies">
    <article class="baseline"><div class="card-heading"><span class="number">A</span><h3>These three edges</h3></div><div class="visual"><CubeRearCorner {target} variant={11}/></div><p>Orange marks exactly the three edges being changed. All other edges stay solid.</p></article>
    <article class="baseline"><div class="card-heading"><span class="number">B</span><h3>Original cube</h3></div><div class="visual"><CubeRearCorner {target} variant={0}/></div><p>The same cube with all twelve edges solid, for comparison.</p></article>
    {#each options as option, i}<article>
      <div class="card-heading"><span class="number">{String(i + 1).padStart(2,'0')}</span><h3>{option.title}</h3></div>
      <div class="visual"><CubeRearCorner {target} variant={i + 1} {bottomOnly}/></div><p>{option.text}</p>
    </article>{/each}

  </div>
  <footer><p>Bottom-only is on by default. Turn it off to compare the same rules on other faces. The two rear bottom edges also form the target-face border, so that border uses the same hidden/dotted/faded treatment instead of drawing solid lines back over them.</p><p><a href="?mockups&previous=hidden">Earlier line-hiding studies ↗</a></p></footer>
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
