<script lang="ts">
  import { basis, type Sticker, type Vec, type Face } from '../lib/cube';
  let { target, variant, bottomOnly }: { target:Sticker; variant:number; bottomOnly:boolean }=$props();
  const uid=$props.id();
  const active=$derived(!bottomOnly || target.face==='D');
  const yaw=.26,pitch=.32;
  function project([x,y,z]:Vec):[number,number] {return [x*Math.cos(yaw)-z*Math.sin(yaw),-y*Math.cos(pitch)+(x*Math.sin(yaw)+z*Math.cos(yaw))*Math.sin(pitch)];}
  function point(f:Face,x:number,y:number):Vec {const b=basis[f];return b.n.map((n,i)=>1.5*n+x*b.right[i]+y*b.up[i]) as Vec;}
  function poly(v:Vec[]) {return v.map(p=>project(p).join(',')).join(' ');}
  function polygon(f:Face,x=0,y=0,h=1.5){return poly([[x-h,y+h],[x+h,y+h],[x+h,y-h],[x-h,y-h]].map(([a,b])=>point(f,a,b)));}
  const walls:Face[]=['B','L','D'];
  const corners=[-1.5,1.5].flatMap(x=>[-1.5,1.5].flatMap(y=>[-1.5,1.5].map(z=>[x,y,z] as Vec)));
  const lines=corners.flatMap((a,i)=>corners.slice(i+1).filter(b=>a.filter((n,j)=>n!==b[j]).length===1).map(b=>({a,b,rear:a[2]===-1.5&&b[2]===-1.5,vertical:a[1]!==b[1],top:a[1]===1.5&&b[1]===1.5})));
  const grid=$derived([-.5,.5].flatMap(n=>[{a:project(point(target.face,n,-1.5)),b:project(point(target.face,n,1.5))},{a:project(point(target.face,-1.5,n)),b:project(point(target.face,1.5,n))}]));
  const onFace=(v:Vec)=>basis[target.face].n.reduce((s,n,i)=>s+n*v[i],0)===1.5;
  function keep(line:typeof lines[number]) {
    if(!active)return true;
    if(variant===3)return !(line.rear&&line.vertical);
    if(variant===4)return !(line.rear&&line.top);
    if(variant===5||variant===6)return !line.rear;
    if(variant===8)return false;
    if(variant===9)return onFace(line.a)||onFace(line.b);
    return true;
  }
  // Convex silhouette, independent of the target; the camera never changes.
  const sorted=corners.map(project).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const turn=(a:number[],b:number[],c:number[])=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  function halfHull(ps:number[][]){const h:number[][]=[];for(const p of ps){while(h.length>1&&turn(h[h.length-2],h[h.length-1],p)<=0)h.pop();h.push(p);}return h.slice(0,-1);}
  const silhouette=[...halfHull(sorted),...halfHull([...sorted].reverse())].map(p=>p.join(',')).join(' ');
  const panel=$derived(target.face==='B'?'L':'B');
</script>
<div class="study" data-sticker={target.id} data-active={active} role="img" aria-label={`Hidden-line study ${variant}, ${target.face} face`}>
<svg viewBox="-2.4 -2.4 4.8 4.8" aria-hidden="true">
  <defs>
    <mask id={`${uid}-face`} maskUnits="userSpaceOnUse" x="-3" y="-3" width="6" height="6"><rect x="-3" y="-3" width="6" height="6" fill="white"/><polygon points={polygon(target.face)} fill="black" stroke="black" stroke-width={variant===2?'.12':'0'}/></mask>
    <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="black"/><stop offset=".48" stop-color="black"/><stop offset=".85" stop-color="white"/></linearGradient>
    <mask id={`${uid}-lower`} maskUnits="userSpaceOnUse" x="-3" y="-3" width="6" height="6"><rect x="-2.4" y="-2.4" width="4.8" height="4.8" fill={`url(#${uid}-fade)`}/></mask>
  </defs>
  <g mask={active&&variant===7?`url(#${uid}-lower)`:undefined}>
    {#each walls as face}{#if !(active&&variant===6&&face==='B')}<polygon points={polygon(face)} fill={face==='D'?'#e5ebe7':'#f6f8f6'}/>{/if}{/each}
  </g>
  {#if !active}<polygon points={polygon(target.face)} fill="#dbe8df" stroke="#789582" stroke-width=".025"/>{/if}
  <g mask={active&&variant===7?`url(#${uid}-lower)`:active&&variant===2?`url(#${uid}-face)`:undefined}>
    {#each lines as line}{#if keep(line)}
      <line x1={project(line.a)[0]} y1={project(line.a)[1]} x2={project(line.b)[0]} y2={project(line.b)[1]} stroke="#91a397" stroke-width=".02"/>
    {/if}{/each}
    {#if active&&variant===8}<polygon points={silhouette} fill="none" stroke="#91a397" stroke-width=".02"/>{/if}
  </g>
  {#if active&&variant===10}<polygon points={polygon(panel)} fill="#e9eee8" stroke="#91a397" stroke-width=".02"/>{/if}
  {#if active}<polygon points={polygon(target.face)} fill="#dbe8df" stroke="#789582" stroke-width=".025"/>{/if}
  {#each grid as line}<line x1={line.a[0]} y1={line.a[1]} x2={line.b[0]} y2={line.b[1]} stroke="#9eb4a6" stroke-width=".018"/>{/each}
  <polygon points={polygon(target.face,target.x,target.y,.44)} fill="#81ae94" stroke="#174d3b" stroke-width=".035"/>
  {#if active && target.face === 'D'}
    <!-- Looking down into the opening: the near frame occludes the floor.
         Draw it after every face, mask, and sticker, including in the fade study. -->
    <polygon data-front-frame points={polygon('F')} fill="none" stroke="#91a397" stroke-width=".02"/>
  {/if}
  {#if !active}{#each lines as line}<line x1={project(line.a)[0]} y1={project(line.a)[1]} x2={project(line.b)[0]} y2={project(line.b)[1]} stroke="#91a397" stroke-width=".02"/>{/each}{/if}
</svg>
</div>
<style>.study,svg{width:100%;height:100%;}svg{display:block;stroke-linecap:round;stroke-linejoin:round;}</style>
