<script lang="ts">
  import Cube from './Cube.svelte';
  import CubeStudy from './CubeStudy.svelte';
  import { faces, stickers, type Face } from '../lib/cube';
  let face = $state<Face>('D');
  let kind = $state('edges');
  let index = $state(0);
  const pool = $derived(stickers.filter(s => s.face === face && s.kind === kind));
  const target = $derived(pool[index % pool.length]);
  const groups = [
    { title: 'Give the walls depth', prefix: 'D', note: 'Five ways to make the interior feel solid. No face labels.', original: 4, options: [
      { title: 'Matte planes', text: 'Flat, neutral tones: darker back, midtone side, light floor. No gradients.' },
      { title: 'Shadows at the seams', text: 'Light walls with narrow shadows where they meet. Depth stays at the joints.' },
      { title: 'Thick wall lips', text: 'A small visible thickness around the opening makes this read as a physical shell.' },
      { title: 'Light from the opening', text: 'Side and floor brighten toward the front. Light follows the depth of each plane.' },
      { title: 'Dark interior', text: 'A deeper neutral cavity gives the target strong contrast against the walls.' },
    ]},
    { title: 'Separate near and far', prefix: 'N', note: 'Stronger depth cues than dotted lines. All rear edges stay continuous.', original: 3, options: [
      { title: 'Strong line hierarchy', text: 'A dark, heavy front frame; fine pale rear edges; midtone connections.' },
      { title: 'Ghost the back', text: 'The back becomes a faint filled plane with barely visible edges. The front stays crisp.' },
      { title: 'Mark the front corners', text: 'Four bold corner brackets anchor the nearest plane without a heavy continuous rim.' },
      { title: 'Taper the depth rails', text: 'Connections narrow as they recede. Solid front nodes reinforce the direction of depth.' },
      { title: 'Break lines behind the rim', text: 'A clean gap around the front rim makes the other lines read as passing behind it.' },
    ]},
  ];
</script>
<svelte:head><title>Blind · depth variations</title></svelte:head>
<main>
  <header><a href="/">scramblr</a><a href="/#positions">Back to trainer ↗</a></header>
  <div class="intro"><span class="eyebrow">BLIND / DESIGN STUDIES</span><h1>Two directions. Ten variations.</h1><p>Compare wall depth and stronger near/far cues. Every cube shows the same sticker in the same fixed orientation.</p></div>
  <div class="controls">
    <label>Target face<select bind:value={face}>{#each faces as f}<option value={f}>{{ U:'Top', D:'Bottom', L:'Left', R:'Right', F:'Front', B:'Back' }[f]}</option>{/each}</select></label>
    <label>Piece<select bind:value={kind}><option value="edges">Edge</option><option value="corners">Corner</option></select></label>
    <button class="quiet" onclick={() => index++}>Next sticker →</button>
  </div>
  {#each groups as group, g}
    <section aria-label={group.title}>
      <div class="group-heading"><span class="eyebrow">0{g + 1} / FIVE VARIATIONS</span><h2>{group.title}</h2><p>{group.note}</p></div>
      <div class="studies">
        {#each group.options as option, i}<article>
          <div class="card-heading"><span class="number">{group.prefix}{i + 1}</span><h3>{option.title}</h3></div>
          <div class="visual"><CubeStudy {target} variant={g * 5 + i + 1} /></div>
          <p>{option.text}</p>
        </article>{/each}
        <article class="baseline"><div class="card-heading"><span class="number">↩</span><h3>Previous example</h3></div><div class="visual"><Cube {target} wrong={false} treatment={group.original} /></div><p>The earlier treatment, shown here for comparison.</p></article>
      </div>
    </section>
  {/each}
</main>
<style>
  main { max-width:1440px; margin:auto; padding:28px 40px 64px; }
  header { display:flex; justify-content:space-between; gap:20px; } a { color:var(--accent); text-decoration:none; font-size:14px; } header a:first-child { font-size:18px; font-weight:700; }
  .intro { margin:56px 0 28px; } .eyebrow { font-size:11px; letter-spacing:.14em; color:var(--accent); font-weight:700; } h1 { font-size:clamp(28px,4vw,44px); letter-spacing:-.04em; margin:12px 0; } p { color:var(--muted); font-size:14px; line-height:1.6; }
  .controls { display:flex; flex-wrap:wrap; align-items:end; gap:12px; margin-bottom:28px; } label { display:grid; gap:7px; font-size:12px; color:var(--muted); } select { min-width:130px; }
  .studies { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; } article { border:1px solid var(--line); border-radius:12px; padding:20px; background:var(--surface); } .card-heading { display:flex; align-items:center; gap:10px; min-height:28px; flex-wrap:wrap; } .number { color:var(--muted); font-size:12px; } h3 { font-size:16px; margin:0; } .group-heading { margin:36px 0 20px; } .group-heading h2 { font-size:24px; margin:10px 0 6px; } .group-heading p { margin:0; } section + section { margin-top:56px; } .visual { height:280px; } article p { margin:0; } .baseline { background:var(--subtle); }
  @media(max-width:1100px) { .studies { grid-template-columns:repeat(2,minmax(0,1fr)); } }
  @media(max-width:650px) { main { padding:24px 16px 40px; } .intro { margin-top:36px; } .studies { grid-template-columns:1fr; } .visual { height:300px; } }
</style>
