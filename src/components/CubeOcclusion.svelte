<script lang="ts">
  import { basis, type Sticker, type Vec, type Face } from '../lib/cube';
  let { target, variant }: { target: Sticker; variant: number } = $props();
  const yaw=.26, pitch=.32;
  function project([x,y,z]: Vec): [number,number] {
    const px=x*Math.cos(yaw)-z*Math.sin(yaw);
    const py=-y*Math.cos(pitch)+(x*Math.sin(yaw)+z*Math.cos(yaw))*Math.sin(pitch);
    const distance=x*Math.sin(yaw)*Math.cos(pitch)+z*Math.cos(yaw)*Math.cos(pitch)+y*Math.sin(pitch);
    const scale=variant===4?6/(6-distance):1;
    return [px*scale,py*scale];
  }
  function point(face: Face,x:number,y:number):Vec { const b=basis[face]; return b.n.map((n,i)=>1.5*n+x*b.right[i]+y*b.up[i]) as Vec; }
  function poly(points:Vec[]) { return points.map(p=>project(p).join(',')).join(' '); }
  function polygon(face:Face,x=0,y=0,half=1.5) { return poly([[x-half,y+half],[x+half,y+half],[x+half,y-half],[x-half,y-half]].map(([a,b])=>point(face,a,b))); }
  const walls:Face[]=['B','L','D'];
  const names:Record<Face,string>={U:'Top',D:'Bottom',L:'Left',R:'Right',F:'Front',B:'Back'};
  const grid=$derived([-.5,.5].flatMap(n=>[{a:project(point(target.face,n,-1.5)),b:project(point(target.face,n,1.5))},{a:project(point(target.face,-1.5,n)),b:project(point(target.face,1.5,n))}]));
  // Adjacent face names for an outside, face-on view; follows the same basis as Speffz.
  function neighbour(v:Vec) { return (Object.keys(basis) as Face[]).find(f=>basis[f].n.every((n,i)=>n===v[i]))!; }
  const top=$derived(neighbour(basis[target.face].up));
  const left=$derived(neighbour(basis[target.face].right.map(n=>-n) as Vec));
  const right=$derived(neighbour(basis[target.face].right));
  const bottom=$derived(neighbour(basis[target.face].up.map(n=>-n) as Vec));
</script>
<div class="study" data-sticker={target.id} role="img" aria-label={`${names[target.face]} face, study ${variant}`}>
<svg viewBox={variant===4?'-2.8 -2.8 5.6 5.6':'-2.5 -2.5 5 5'} aria-hidden="true">
{#if variant===5}
  <rect x="-1.5" y="-1.5" width="3" height="3" rx=".02" fill="#edf4ef" stroke="#637b6b" stroke-width=".025"/>
  {#each [-.5,.5] as n}<path d={`M ${n} -1.5 V 1.5 M -1.5 ${n} H 1.5`} fill="none" stroke="#adc1b3" stroke-width=".02"/>{/each}
  <rect x={target.x-.44} y={-target.y-.44} width=".88" height=".88" rx=".035" fill="#81ae94" stroke="#174d3b" stroke-width=".045"/>
  <text x="0" y=".06" text-anchor="middle" font-size=".19" font-weight="700" fill="#174d3b">{names[target.face].toUpperCase()}</text>
  <text x="0" y="-1.78" text-anchor="middle">{names[top]}</text><text x="0" y="1.95" text-anchor="middle">{names[bottom]}</text>
  <text x="-1.72" y=".06" text-anchor="end">{names[left]}</text><text x="1.72" y=".06">{names[right]}</text>
{:else}
  {#if variant===3}
    <polygon points={poly([[-2,-1.6,-2],[2.7,-1.6,-2],[2.7,-1.6,2.1],[-2,-1.6,2.1]])} fill="#f2f3ef"/>
    <!-- Directional-light projection of the back wall onto the ground. -->
    <polygon points={poly([[-1.5,-1.59,-1.5],[1.5,-1.59,-1.5],[2.6,-1.59,.35],[-.4,-1.59,.35]])} fill="#b8c1b8" opacity=".7"/>
  {/if}
  {#if variant!==1}
    <!-- Only the three opaque interior walls; no transparent front/top/right cage. -->
    {#each walls as face}
      <polygon points={polygon(face)} fill={face==='B'?'#b7c3b9':face==='L'?'#d8dfd6':'#eef1e8'} stroke="#819686" stroke-width=".025"/>
    {/each}
  {/if}
  <polygon points={polygon(target.face)} fill="#dbe8df" stroke="#789582" stroke-width=".025"/>
  {#if variant===3 && target.face==='D'}
    <polygon points={poly([[-1.5,-1.5,-1.5],[1.5,-1.5,-1.5],[1.5,-1.5,-1.05],[-1.18,-1.5,-1.05]])} fill="#56745f" opacity=".16"/>
  {/if}
  {#each grid as line}<line x1={line.a[0]} y1={line.a[1]} x2={line.b[0]} y2={line.b[1]} stroke="#9bb2a2" stroke-width=".02"/>{/each}
  <polygon points={polygon(target.face,target.x,target.y,.44)} fill="#81ae94" stroke="#174d3b" stroke-width=".04"/>
  {#if variant===1}
    <!-- An incomplete front reference instead of a second overlapping cube frame. -->
    <polyline points={poly([[-1.5,1.5,1.5],[-1.5,-1.5,1.5],[1.5,-1.5,1.5]])} fill="none" stroke="#607968" stroke-width=".045"/>
    <text x="0" y="2.2" text-anchor="middle">{names[target.face]} face · rear cage removed</text>
  {/if}
{/if}
</svg>
</div>
<style>
  .study,svg { width:100%; height:100%; } svg { display:block; stroke-linejoin:round; stroke-linecap:round; } text { font-family:var(--font); font-size:.16px; fill:var(--muted); }
</style>
