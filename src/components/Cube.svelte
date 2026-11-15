<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { basis, type Sticker, type Vec, type Face } from '../lib/cube';
  let { target, wrong, treatment = 0, fadeRearEdges = false }: { target: Sticker; wrong: boolean; treatment?: number; fadeRearEdges?: boolean } = $props();
  const uid = $props.id();
  const labels = $derived(treatment === 1 || treatment === 5);
  const rim = $derived(treatment === 2 || treatment === 5);
  const dashed = $derived(treatment === 3 || treatment === 5);
  const depth = $derived(treatment === 4 || treatment === 5);
  const faceNames: Record<Face, string> = { U:'TOP', D:'BOTTOM', F:'FRONT', B:'BACK', L:'LEFT', R:'RIGHT' };
  const mobile = new MediaQuery('(max-width: 767px)');
  const yaw = .26, pitch = .32;
  function project([x, y, z]: Vec): [number, number] {
    return [x * Math.cos(yaw) - z * Math.sin(yaw), -y * Math.cos(pitch) + (x * Math.sin(yaw) + z * Math.cos(yaw)) * Math.sin(pitch)];
  }
  function point(face: Face, x: number, y: number): Vec {
    const b = basis[face];
    return b.n.map((n, i) => n * 1.5 + b.right[i] * x + b.up[i] * y) as Vec;
  }
  function polygon(face: Face, x = 0, y = 0, half = 1.5) {
    return [[x-half,y+half],[x+half,y+half],[x+half,y-half],[x-half,y-half]]
      .map(([a,b]) => project(point(face,a,b)).join(',')).join(' ');
  }
  const onTarget = (v: Vec) => basis[target.face].n.reduce((sum, n, i) => sum + n * v[i], 0) === 1.5;
  const walls: Face[] = ['B','L','D'];
  const corners = [-1.5,1.5].flatMap(x => [-1.5,1.5].flatMap(y => [-1.5,1.5].map(z => [x,y,z] as Vec)));
  const outline = corners.flatMap((a,i) => corners.slice(i+1).filter(b => a.filter((n,j) => n !== b[j]).length === 1).map(b => ({ a:project(a), b:project(b), rear: a[2] === -1.5 && b[2] === -1.5, hiddenCorner: a.every(n => n === -1.5) || b.every(n => n === -1.5), start: a, end: b })));
  const grid = $derived([-.5,.5].flatMap(n => [
    { a:project(point(target.face,n,-1.5)), b:project(point(target.face,n,1.5)) },
    { a:project(point(target.face,-1.5,n)), b:project(point(target.face,1.5,n)) },
  ]));
</script>
<div class="cube" data-sticker={target.id} role="img" aria-label={`Solved cube outline with one ${target.kind === 'edges' ? 'edge' : 'corner'} sticker highlighted on a shaded face`}>
  <svg viewBox={treatment ? '-2.4 -2.4 4.8 4.8' : mobile.current ? '-2 -2.15 4 4.3' : '-2.9 -2.7 5.8 5.4'} aria-hidden="true">
    <defs><linearGradient id={uid} x1="0" y1="0" x2="0.2" y2="1"><stop offset="0%" stop-color="#a4b9ac" /><stop offset="100%" stop-color="#edf4ef" /></linearGradient></defs>
    {#each walls as face}<polygon points={polygon(face)} fill={depth ? (face === 'B' ? '#c1cdc5' : face === 'L' ? '#dbe2dd' : '#edf0ed') : face === 'D' ? '#e5ebe7' : '#f6f8f6'} />{/each}
    <polygon points={polygon(target.face)} fill={wrong ? '#f1dedb' : depth ? `url(#${uid})` : '#dbe8df'} stroke={fadeRearEdges ? 'none' : wrong ? '#bd8c84' : '#789582'} stroke-width=".025" />
    {#each grid as line}<line x1={line.a[0]} y1={line.a[1]} x2={line.b[0]} y2={line.b[1]} stroke={wrong ? '#c6a19b' : '#9eb4a6'} stroke-width=".018" />{/each}
    <polygon points={polygon(target.face,target.x,target.y,.44)} fill={wrong ? '#d69d94' : '#81ae94'} stroke={wrong ? '#ad3933' : '#174d3b'} stroke-width=".035" />
    {#each outline as line}
      <g data-faded-rear={fadeRearEdges && line.hiddenCorner ? 'true' : undefined} opacity={fadeRearEdges && line.hiddenCorner ? .3 : 1} stroke-dasharray={fadeRearEdges && line.hiddenCorner ? '.08 .09' : undefined}>
        {#if fadeRearEdges && onTarget(line.start) && onTarget(line.end)}<line x1={line.a[0]} y1={line.a[1]} x2={line.b[0]} y2={line.b[1]} stroke={wrong ? '#bd8c84' : '#789582'} stroke-width=".025"/>{/if}
        <line x1={line.a[0]} y1={line.a[1]} x2={line.b[0]} y2={line.b[1]} stroke={dashed && line.rear ? "#a8b3ac" : "#91a397"} stroke-width=".02" stroke-dasharray={dashed && line.rear ? ".07 .065" : undefined}/>
      </g>
    {/each}
    {#if rim}<polygon points={polygon('F')} fill="none" stroke="#52685a" stroke-width=".065" />
      <text x={project(point('F',0,-1.5))[0]} y={project(point('F',0,-1.5))[1] + .24} text-anchor="middle" font-size=".15" fill="#52685a">FRONT EDGE</text>
    {/if}
    {#if labels}
      <text x={project(point(target.face,0,0))[0]} y={project(point(target.face,0,0))[1]} text-anchor="middle" dominant-baseline="middle" font-size=".16" font-weight="700" fill="#174d3b" stroke="#edf4ef" stroke-width=".045" paint-order="stroke">{faceNames[target.face]}</text>
      <text x="0" y="-2.08" text-anchor="middle" font-size=".15" fill="#535e57">↑ TOP</text>
    {/if}
  </svg>
</div>
<style>
  .cube { width:100%; height:100%; min-height:0; }
  svg { display:block; width:100%; height:100%; stroke-linejoin:round; stroke-linecap:round; }
</style>
