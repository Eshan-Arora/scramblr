<script lang="ts">
  import { basis, type Sticker, type Vec, type Face } from '../lib/cube';
  let { target, variant }: { target: Sticker; variant: number } = $props();
  const uid=$props.id();
  const grounded=$derived(variant>=3);
  const yaw=.28, pitch=.34;
  function project([x,y,z]:Vec):[number,number] {
    const px=x*Math.cos(yaw)-z*Math.sin(yaw);
    const depth=x*Math.sin(yaw)+z*Math.cos(yaw);
    if(variant===2) { const s=11/(11-depth); return [px*s,-y*s+3.7*(s-1)]; }
    const distance=variant===5?9:13;
    const s=distance/(distance-depth*Math.cos(pitch)-y*Math.sin(pitch));
    return [px*s,(-y*Math.cos(pitch)+depth*Math.sin(pitch))*s];
  }
  function point(face:Face,x:number,y:number):Vec { const b=basis[face];return b.n.map((n,i)=>1.5*n+x*b.right[i]+y*b.up[i]) as Vec; }
  function vertices(face:Face,x=0,y=0,half=1.5):Vec[] { return [[x-half,y+half],[x+half,y+half],[x+half,y-half],[x-half,y-half]].map(([a,b])=>point(face,a,b)); }
  function poly(v:Vec[]) {return v.map(p=>project(p).join(',')).join(' ');}
  function polygon(f:Face,x=0,y=0,half=1.5){return poly(vertices(f,x,y,half));}
  const walls:Face[]=['B','L','D'];
  // Parallel rays from an upper-left area light, intersected with the floor.
  function shadow(p:Vec):Vec { const h=p[1]+1.56;return [p[0]+h*.52,-1.56,p[2]+h*.24]; }
  const grid=$derived([-.5,.5].flatMap(n=>[{a:project(point(target.face,n,-1.5)),b:project(point(target.face,n,1.5))},{a:project(point(target.face,-1.5,n)),b:project(point(target.face,1.5,n))}]));
</script>
<div class="refined" data-sticker={target.id} role="img" aria-label={`Perspective study ${variant}, target face ${target.face}`}>
<svg viewBox="-2.65 -2.55 5.6 5.4" aria-hidden="true">
  <defs>
    <mask id={`${uid}-visible`}><rect x="-5" y="-5" width="10" height="10" fill="white"/>{#if !walls.includes(target.face)}<polygon points={polygon(target.face)} fill="black"/>{/if}</mask>
    <filter id={`${uid}-shadow`} x="-50%" y="-70%" width="220%" height="240%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".11"/></filter>
    <filter id={`${uid}-contact`} x="-30%" y="-50%" width="160%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".035"/></filter>
    <filter id={`${uid}-seam`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".075"/></filter>
    {#each walls as f}<clipPath id={`${uid}-${f}`}><polygon points={polygon(f)}/></clipPath>{/each}
    <linearGradient id={`${uid}-back`} x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e4e8e1"/><stop offset="1" stop-color="#c4cec4"/></linearGradient>
    <linearGradient id={`${uid}-side`} x1="0" y1="1" x2="1" y2="0"><stop stop-color="#e9ede6"/><stop offset="1" stop-color="#d5ddd2"/></linearGradient>
  </defs>
  {#if grounded}
    <g opacity={variant===5?'.19':'.13'} filter={`url(#${uid}-shadow)`}>
      {#each walls as f}<polygon points={poly(vertices(f).map(shadow))} fill="#23332a"/>{/each}
    </g>
    <polygon points={poly(vertices('D').map(p=>[p[0],-1.56,p[2]] as Vec))} fill="#263e30" opacity=".12" filter={`url(#${uid}-contact)`}/>
  {/if}
  {#if variant===4}
    <polygon points={poly([[-1.5,-1.5,1.5],[1.5,-1.5,1.5],[1.5,-1.60,1.5],[-1.5,-1.60,1.5]])} fill="#c3cdc2"/>
    <polygon points={poly([[1.5,-1.5,1.5],[1.5,-1.5,-1.5],[1.5,-1.60,-1.5],[1.5,-1.60,1.5]])} fill="#d2dacd"/>
  {/if}
  {#each walls as face}
    <polygon points={polygon(face)} fill={face==='D'?'#f1f4ed':variant===5?`url(#${uid}-${face==='B'?'back':'side'})`:face==='B'?'#d9e0d5':'#e8ede3'} stroke="#aab9aa" stroke-width=".014"/>
  {/each}
  <polygon points={polygon(target.face)} fill="#e2eddf" stroke="#a0b59f" stroke-width=".016"/>
  {#if variant>=3}
    <!-- Clipped, blurred contact shading at interior wall junctions. -->
    {#each walls as face}
      <g mask={`url(#${uid}-visible)`} clip-path={`url(#${uid}-${face})`} opacity={variant===5?'.23':'.12'}>
        <polyline points={poly([[-1.5,1.5,-1.5],[-1.5,-1.5,-1.5],[1.5,-1.5,-1.5]])} fill="none" stroke="#526a52" stroke-width=".14" filter={`url(#${uid}-seam)`}/>
        <line x1={project([-1.5,-1.5,-1.5])[0]} y1={project([-1.5,-1.5,-1.5])[1]} x2={project([-1.5,-1.5,1.5])[0]} y2={project([-1.5,-1.5,1.5])[1]} stroke="#526a52" stroke-width=".10" filter={`url(#${uid}-seam)`}/>
      </g>
    {/each}
  {/if}
  {#each grid as line}<line x1={line.a[0]} y1={line.a[1]} x2={line.b[0]} y2={line.b[1]} stroke="#afc2ab" stroke-width=".015"/>{/each}
  <polygon points={polygon(target.face,target.x,target.y,.43)} fill="#79a789" stroke="#174d3b" stroke-width=".025"/>
  {#if variant===4}
    <!-- Wall caps extend outward; they never cover the target face. -->
    <polygon points={poly([[-1.5,1.5,1.5],[-1.5,1.5,-1.5],[-1.60,1.5,-1.60],[-1.60,1.5,1.5]])} fill="#fafbf7" stroke="#b3bfad" stroke-width=".012"/>
    <polygon points={poly([[-1.5,1.5,-1.5],[1.5,1.5,-1.5],[1.5,1.5,-1.60],[-1.60,1.5,-1.60]])} fill="#f7faf3" stroke="#b3bfad" stroke-width=".012"/>
    <polygon points={poly([[-1.5,-1.5,1.5],[-1.5,1.5,1.5],[-1.60,1.5,1.5],[-1.60,-1.60,1.5]])} fill="#c3cebe"/>
  {/if}
</svg>
</div>
<style>.refined,svg { width:100%;height:100%; } svg {display:block;stroke-linejoin:round;stroke-linecap:round;}</style>
