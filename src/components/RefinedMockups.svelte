<script lang="ts">
  import CubeRefined from './CubeRefined.svelte';
  import CubeOcclusion from './CubeOcclusion.svelte';
  import OcclusionMockups from './OcclusionMockups.svelte';
  const previous = ['structural','depth'].includes(new URLSearchParams(location.search).get('previous') ?? '');
  import { faces, stickers, type Face } from '../lib/cube';
  let face = $state<Face>('D');
  let kind = $state('edges');
  let index = $state(0);
  const pool = $derived(stickers.filter(s => s.face === face && s.kind === kind));
  const target = $derived(pool[index % pool.length]);
  const options = [
    {title:'Gentle perspective',text:'A more distant camera keeps the cube’s proportions calm. Soft neutral walls and fine edges keep attention on the sticker.'},
    {title:'Upright perspective',text:'Vertical edges stay vertical. A shifted architectural view shows the floor without the leaning walls.'},
    {title:'Soft contact shadow',text:'Gentle perspective with a soft cast shadow projected from the walls. Darker contact at the base anchors it to the surface.'},
    {title:'A physical shell',text:'Thin wall caps and a small base thickness give the opening a tangible edge. A soft shadow keeps it grounded.'},
    {title:'Studio lighting',text:'A little more perspective, subtle wall lighting, and soft shading at the interior seams. Stronger depth with quieter edges.'},
  ];
</script>
<svelte:head><title>Blind · refined perspective</title></svelte:head>
{#if previous}<OcclusionMockups />{:else}
<main>
  <header><a href="/">scramblr</a><a href="/#positions">Back to trainer ↗</a></header>
  <div class="intro"><span class="eyebrow">BLIND / DESIGN STUDIES</span><h1>Keep the depth. Refine the cube.</h1><p>Five new 3D studies built around perspective and softer lighting. Same target, fixed camera, readable sticker.</p></div>
  <div class="controls">
    <label>Target face<select bind:value={face}>{#each faces as f}<option value={f}>{{ U:'Top', D:'Bottom', L:'Left', R:'Right', F:'Front', B:'Back' }[f]}</option>{/each}</select></label>
    <label>Piece<select bind:value={kind}><option value="edges">Edge</option><option value="corners">Corner</option></select></label>
    <button class="quiet" onclick={() => index++}>Next sticker →</button>
  </div>
  <div class="studies">
    {#each options as option, i}<article>
      <div class="card-heading"><span class="number">0{i + 1}</span><h3>{option.title}</h3></div>
      <div class="visual"><CubeRefined {target} variant={i + 1}/></div><p>{option.text}</p>
    </article>{/each}
    <article class="baseline"><div class="card-heading"><span class="number">↩</span><h3>Previous perspective</h3></div><div class="visual"><CubeOcclusion {target} variant={4}/></div><p>The earlier, more distorted perspective for a direct comparison.</p></article>
  </div>
  <footer><p>Start with 01 and 02 for cleaner proportions, then compare 03–05 for lighting and material. All five retain depth; none use a flat face diagram.</p><p><a href="?mockups&previous=structural">Earlier structural studies ↗</a></p></footer>
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
