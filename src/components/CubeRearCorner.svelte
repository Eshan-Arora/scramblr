<script lang="ts">
  import { basis, type Sticker, type Vec, type Face } from '../lib/cube';
  let { target, variant, bottomOnly=false }: {target:Sticker;variant:number;bottomOnly?:boolean}=$props();
  const active=$derived(!bottomOnly||target.face==='D');
  const yaw=.26,pitch=.32;
  function project([x,y,z]:Vec):[number,number]{return [x*Math.cos(yaw)-z*Math.sin(yaw),-y*Math.cos(pitch)+(x*Math.sin(yaw)+z*Math.cos(yaw))*Math.sin(pitch)];}
  function point(f:Face,x:number,y:number):Vec{const b=basis[f];return b.n.map((n,i)=>1.5*n+x*b.right[i]+y*b.up[i]) as Vec;}
  function polygon(f:Face,x=0,y=0,h=1.5){return [[x-h,y+h],[x+h,y+h],[x+h,y-h],[x-h,y-h]].map(([a,b])=>project(point(f,a,b)).join(',')).join(' ');}
  const corner:Vec=[-1.5,-1.5,-1.5];
  const isRearCorner=(v:Vec)=>v.every((n,i)=>n===corner[i]);
  const corners=[-1.5,1.5].flatMap(x=>[-1.5,1.5].flatMap(y=>[-1.5,1.5].map(z=>[x,y,z] as Vec)));
  const lines=corners.flatMap((a,i)=>corners.slice(i+1).filter(b=>a.filter((n,j)=>n!==b[j]).length===1).map(b=>({a,b,rear:isRearCorner(a)||isRearCorner(b)})));
  const onTarget=(v:Vec)=>basis[target.face].n.reduce((s,n,i)=>s+n*v[i],0)===1.5;
  const grid=$derived([-.5,.5].flatMap(n=>[{a:project(point(target.face,n,-1.5)),b:project(point(target.face,n,1.5))},{a:project(point(target.face,-1.5,n)),b:project(point(target.face,1.5,n))}]));
  const styles=[
    {opacity:1,dash:undefined},
    {opacity:0,dash:undefined},
    {opacity:1,dash:'.001 .09'},
    {opacity:1,dash:'.001 .16'},
    {opacity:1,dash:'.065 .07'},
    {opacity:1,dash:'.16 .10'},
    {opacity:.45,dash:undefined},
    {opacity:.22,dash:undefined},
    {opacity:.09,dash:undefined},
    {opacity:.35,dash:'.001 .12'},
    {opacity:.30,dash:'.08 .09'},
    {opacity:1,dash:undefined},
  ];
</script>
<div class="study" data-sticker={target.id} data-variant={variant} data-active={active} role="img" aria-label={variant===11?'The three rear-left-bottom edges marked in orange':`Rear-corner study ${variant}, target face ${target.face}`}>
<svg viewBox="-2.4 -2.4 4.8 4.8" aria-hidden="true">
  {#each ['B','L','D'] as face}<polygon points={polygon(face as Face)} fill={face==='D'?'#e5ebe7':'#f6f8f6'}/>{/each}
  <polygon points={polygon(target.face)} fill="#dbe8df"/>
  {#each grid as line}<line x1={line.a[0]} y1={line.a[1]} x2={line.b[0]} y2={line.b[1]} stroke="#9eb4a6" stroke-width=".018"/>{/each}
  <polygon points={polygon(target.face,target.x,target.y,.44)} fill="#81ae94" stroke="#174d3b" stroke-width=".035"/>
  {#each lines as line}
    {@const style=styles[line.rear&&active?variant:0]}
    <g data-rear-edge={line.rear?'true':undefined} opacity={style.opacity} stroke-dasharray={style.dash}>
      {#if onTarget(line.a)&&onTarget(line.b)}<line x1={project(line.a)[0]} y1={project(line.a)[1]} x2={project(line.b)[0]} y2={project(line.b)[1]} stroke="#789582" stroke-width=".025"/>{/if}
      <line x1={project(line.a)[0]} y1={project(line.a)[1]} x2={project(line.b)[0]} y2={project(line.b)[1]} stroke={variant===11&&line.rear?'#bd6734':'#91a397'} stroke-width={variant===11&&line.rear?'.05':'.02'}/>
    </g>
  {/each}
  {#if variant===11}<circle cx={project(corner)[0]} cy={project(corner)[1]} r=".07" fill="#bd6734"/>{/if}
</svg>
</div>
<style>.study,svg{width:100%;height:100%;}svg{display:block;stroke-linejoin:round;stroke-linecap:round;}</style>
