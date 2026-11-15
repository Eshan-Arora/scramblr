<script lang="ts">
  import { basis, type Sticker, type Vec, type Face } from '../lib/cube';
  let { target, variant }: { target: Sticker; variant: number } = $props();
  const uid = $props.id();
  const yaw = .26, pitch = .32;
  function project([x,y,z]: Vec): [number,number] { return [x*Math.cos(yaw)-z*Math.sin(yaw), -y*Math.cos(pitch)+(x*Math.sin(yaw)+z*Math.cos(yaw))*Math.sin(pitch)]; }
  function point(face: Face, x: number, y: number): Vec { const b=basis[face]; return b.n.map((n,i)=>n*1.5+b.right[i]*x+b.up[i]*y) as Vec; }
  function poly(points: Vec[]) { return points.map(p=>project(p).join(',')).join(' '); }
  function polygon(face: Face,x=0,y=0,half=1.5) { return poly([[x-half,y+half],[x+half,y+half],[x+half,y-half],[x-half,y-half]].map(([a,b])=>point(face,a,b))); }
  const walls: Face[]=['B','L','D'];
  const corners=[-1.5,1.5].flatMap(x=>[-1.5,1.5].flatMap(y=>[-1.5,1.5].map(z=>[x,y,z] as Vec)));
  const lines=corners.flatMap((a,i)=>corners.slice(i+1).filter(b=>a.filter((n,j)=>n!==b[j]).length===1).map(b=>({a:project(a),b:project(b),front:a[2]===1.5&&b[2]===1.5,rear:a[2]===-1.5&&b[2]===-1.5})));
  const grid=$derived([-.5,.5].flatMap(n=>[{a:project(point(target.face,n,-1.5)),b:project(point(target.face,n,1.5))},{a:project(point(target.face,-1.5,n)),b:project(point(target.face,1.5,n))}]));
  function fill(face: Face) {
    if (variant===1) return ({B:'#c6ccc8',L:'#e1e5e2',D:'#f0f2ef'} as Partial<Record<Face,string>>)[face];
    if (variant===4 && face!=='B') return `url(#${uid}-${face})`;
    if (variant===4) return '#bdc8c1';
    if (variant===5) return ({B:'#52645b',L:'#7d8d82',D:'#b4bfb5'} as Partial<Record<Face,string>>)[face];
    return face==='D'?'#edf0ec':'#f4f6f3';
  }
</script>
<div class="cube-study" data-sticker={target.id} role="img" aria-label={`Cube study ${variant}, target on ${target.face} face`}>
<svg viewBox="-2.4 -2.4 4.8 4.8" aria-hidden="true">
  <defs>
    {#each ['L','D'] as face}
      {@const back=project(point(face as Face,face==='L'?-1.5:0,face==='D'?-1.5:0))}
      {@const front=project(point(face as Face,face==='L'?1.5:0,face==='D'?1.5:0))}
      <linearGradient id={`${uid}-${face}`} gradientUnits="userSpaceOnUse" x1={back[0]} y1={back[1]} x2={front[0]} y2={front[1]}><stop stop-color="#aab8ad"/><stop offset="1" stop-color="#fafbf7"/></linearGradient>
    {/each}
  </defs>
  {#each walls as face}<polygon points={polygon(face)} fill={fill(face)}/>{/each}
  {#if variant===7}<polygon points={polygon('B')} fill="#e8ece9" stroke="#cbd3cd" stroke-width=".025"/>{/if}
  <polygon points={polygon(target.face)} fill={variant===5?'#cbdccc':'#dbe8df'} fill-opacity={variant===1||variant===4?'.45':'.85'} stroke="#8ba793" stroke-width=".022"/>
  {#if variant===2}
    <!-- Narrow shadows at the interior seams; no wash over the sticker. -->
    {#each ['L','D'] as face}
      <polygon points={face==='L'?poly([[-1.5,-1.5,-1.5],[-1.5,1.5,-1.5],[-1.5,1.5,-1.23],[-1.5,-1.5,-1.23]]):poly([[-1.5,-1.5,-1.5],[1.5,-1.5,-1.5],[1.5,-1.5,-1.23],[-1.5,-1.5,-1.23]])} fill="#64786a" opacity=".22"/>
    {/each}
    <polygon points={poly([[-1.5,-1.5,-1.5],[-1.5,-1.5,1.5],[-1.28,-1.5,1.5],[-1.28,-1.5,-1.5]])} fill="#64786a" opacity=".15"/>
  {/if}
  {#each grid as line}<line x1={line.a[0]} y1={line.a[1]} x2={line.b[0]} y2={line.b[1]} stroke="#91aa99" stroke-width=".018"/>{/each}
  <polygon points={polygon(target.face,target.x,target.y,.44)} fill="#81ae94" stroke="#174d3b" stroke-width=".04"/>
  {#each lines as line}
    <line x1={line.a[0]} y1={line.a[1]} x2={line.b[0]} y2={line.b[1]}
      stroke={variant>=6?(line.front?'#3d5144':line.rear?'#c6d0c8':'#8d9f92'):variant===5?'#84988a':'#93a397'}
      stroke-width={variant>=6?(line.front?(variant===8?'.025':'.065'):'.018'):'.02'}
      opacity={variant===7&&line.rear?'.25':1}/>
  {/each}
  {#if variant===3}
    <!-- Wall lips sit outside the fixed opening, without moving any face. -->
    {#each [-1.5,1.5] as x}<polygon points={poly([[x,-1.5,1.5],[x,1.5,1.5],[x+(x<0?-.12:.12),1.62,1.5],[x+(x<0?-.12:.12),-1.62,1.5]])} fill={x<0?'#a9b5ab':'#c0c9c0'}/>{/each}
    {#each [-1.5,1.5] as y}<polygon points={poly([[-1.5,y,1.5],[1.5,y,1.5],[1.62,y+(y<0?-.12:.12),1.5],[-1.62,y+(y<0?-.12:.12),1.5]])} fill={y<0?'#a9b5ab':'#d4dcd2'}/>{/each}
  {/if}
  {#if variant===8}
    {#each [-1.5,1.5] as x}{#each [-1.5,1.5] as y}
      <polyline points={poly([[x-Math.sign(x)*.42,y,1.5],[x,y,1.5],[x,y-Math.sign(y)*.42,1.5]])} fill="none" stroke="#354f3f" stroke-width=".10"/>
    {/each}{/each}
  {/if}
  {#if variant===9}
    {#each [-1.5,1.5] as x}{#each [-1.5,1.5] as y}
      {@const a=project([x,y,1.5])}{@const b=project([x,y,-1.5])}
      <polygon points={`${a[0]-.035},${a[1]} ${b[0]-.005},${b[1]} ${b[0]+.005},${b[1]} ${a[0]+.035},${a[1]}`} fill="#5e7665"/>
      <circle cx={a[0]} cy={a[1]} r=".065" fill="#354f3f"/>
    {/each}{/each}
  {/if}
  {#if variant===10}
    <polygon points={polygon('F')} fill="none" stroke="#fff" stroke-width=".14"/>
    <polygon points={polygon('F')} fill="none" stroke="#3d5144" stroke-width=".055"/>
  {/if}
</svg>
</div>
<style>
  .cube-study { width:100%; height:100%; } svg { width:100%; height:100%; display:block; stroke-linecap:round; stroke-linejoin:round; }
</style>
