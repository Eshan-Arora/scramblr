<script lang="ts">
  import Cube from './Cube.svelte';
  import CubeOcclusion from './CubeOcclusion.svelte';
  import DepthMockups from './DepthMockups.svelte';
  const previous = new URLSearchParams(location.search).get('previous') === 'depth';
  import { faces, stickers, type Face } from '../lib/cube';
  let face = $state<Face>('D');
  let kind = $state('edges');
  let index = $state(0);
  const pool = $derived(stickers.filter(s => s.face === face && s.kind === kind));
  const target = $derived(pool[index % pool.length]);
  const options = [
    {title:'Remove the rear cage',text:'Only the target face and an incomplete front reference remain. Removes the competing rear square instead of fading it.'},
    {title:'Open three-wall cutaway',text:'Keep only opaque back, left, and bottom walls. Remove the front, top, and right cage edges that cross the interior.'},
    {title:'Set it on the ground',text:'The same cutaway sits on a ground plane with a directional cast shadow. Tests whether grounding makes the bottom feel stable.'},
    {title:'Use real perspective',text:'The cutaway uses perspective: nearer geometry is larger and depth lines converge. The camera stays fixed between targets.'},
    {title:'Remove depth altogether',text:'A face-on diagram with adjacent face names. No cube reversal to interpret; the tradeoff is losing whole-cube spatial practice.'},
  ];
</script>
<svelte:head><title>Blind · occlusion studies</title></svelte:head>
{#if previous}<DepthMockups />{:else}
<main>
  <header><a href="/">scramblr</a><a href="/#positions">Back to trainer ↗</a></header>
  <div class="intro"><span class="eyebrow">BLIND / DESIGN STUDIES</span><h1>Break the reversible cube.</h1><p>Five structural alternatives: remove competing lines, use opaque surfaces, add a ground shadow, change projection, or remove depth.</p></div>
  <div class="controls">
    <label>Target face<select bind:value={face}>{#each faces as f}<option value={f}>{{ U:'Top', D:'Bottom', L:'Left', R:'Right', F:'Front', B:'Back' }[f]}</option>{/each}</select></label>
    <label>Piece<select bind:value={kind}><option value="edges">Edge</option><option value="corners">Corner</option></select></label>
    <button class="quiet" onclick={() => index++}>Next sticker →</button>
  </div>
  <div class="studies">
    {#each options as option, i}<article>
      <div class="card-heading"><span class="number">0{i + 1}</span><h3>{option.title}</h3></div>
      <div class="visual"><CubeOcclusion {target} variant={i + 1}/></div><p>{option.text}</p>
    </article>{/each}
    <article class="baseline"><div class="card-heading"><span class="number">↩</span><h3>Original wireframe</h3></div><div class="visual"><Cube {target} wrong={false}/></div><p>The original for comparison. Try the bottom face first, then cycle through the other faces.</p></article>
  </div>
  <footer><p>These are hypotheses to compare, not a promise that every 3D view will stop flipping. In 01, the back face appears when it is the target; in 02–04, the selected face is added to the fixed cutaway. 05 shows the face from outside, with adjacent-face labels to preserve its orientation.</p><p><a href="?mockups&previous=depth">Previous ten variations ↗</a></p><p>Research: <a href="https://www.cs.ubc.ca/labs/imager/contributions/flinn/Illusions/NC/nc.html">Necker cube and occlusion (UBC)</a> · <a href="https://web.mit.edu/9.35/www/archives/2020/vision/papers/cast_shadows_review.pdf">The perception of cast shadows</a></p></footer>
</main>
{/if}
<style>
  main { max-width:1440px; margin:auto; padding:28px 40px 64px; }
  header { display:flex; justify-content:space-between; gap:20px; } a { color:var(--accent); text-decoration:none; font-size:14px; } header a:first-child { font-size:18px; font-weight:700; }
  .intro { margin:56px 0 28px; } .eyebrow { font-size:11px; letter-spacing:.14em; color:var(--accent); font-weight:700; } h1 { font-size:clamp(28px,4vw,44px); letter-spacing:-.04em; margin:12px 0; } p { color:var(--muted); font-size:14px; line-height:1.6; }
  .controls { display:flex; flex-wrap:wrap; align-items:end; gap:12px; margin-bottom:28px; } label { display:grid; gap:7px; font-size:12px; color:var(--muted); } select { min-width:130px; }
  .studies { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; } article { border:1px solid var(--line); border-radius:12px; padding:20px; background:var(--surface); } .card-heading { display:flex; align-items:center; gap:10px; min-height:28px; flex-wrap:wrap; } .number { color:var(--muted); font-size:12px; } h3 { font-size:16px; margin:0; } footer { margin-top:36px; max-width:900px; } .visual { height:280px; } article p { margin:0; } .baseline { background:var(--subtle); }
  @media(max-width:1100px) { .studies { grid-template-columns:repeat(2,minmax(0,1fr)); } }
  @media(max-width:650px) { main { padding:24px 16px 40px; } .intro { margin-top:36px; } .studies { grid-template-columns:1fr; } .visual { height:300px; } }
</style>
