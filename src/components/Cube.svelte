<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { basis, type Sticker, type Vec, type Face } from '../lib/cube';
  let { target, wrong }: { target: Sticker; wrong: boolean } = $props();
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
  const walls: Face[] = ['B','L','D'];
  const corners = [-1.5,1.5].flatMap(x => [-1.5,1.5].flatMap(y => [-1.5,1.5].map(z => [x,y,z] as Vec)));
  const outline = corners.flatMap((a,i) => corners.slice(i+1).filter(b => a.filter((n,j) => n !== b[j]).length === 1).map(b => ({ a:project(a), b:project(b) })));
  const grid = $derived([-.5,.5].flatMap(n => [
    { a:project(point(target.face,n,-1.5)), b:project(point(target.face,n,1.5)) },
    { a:project(point(target.face,-1.5,n)), b:project(point(target.face,1.5,n)) },
  ]));
</script>
<div class="cube" data-sticker={target.id} role="img" aria-label={`Solved cube outline with one ${target.kind === 'edges' ? 'edge' : 'corner'} sticker highlighted on a shaded face`}>
  <svg viewBox={mobile.current ? '-2 -2.15 4 4.3' : '-2.9 -2.7 5.8 5.4'} aria-hidden="true">
    {#each walls as face}<polygon points={polygon(face)} fill={face === 'D' ? '#e5ebe7' : '#f6f8f6'} />{/each}
    <polygon points={polygon(target.face)} fill={wrong ? '#f1dedb' : '#dbe8df'} stroke={wrong ? '#bd8c84' : '#789582'} stroke-width=".025" />
    {#each grid as line}<line x1={line.a[0]} y1={line.a[1]} x2={line.b[0]} y2={line.b[1]} stroke={wrong ? '#c6a19b' : '#9eb4a6'} stroke-width=".018" />{/each}
    <polygon points={polygon(target.face,target.x,target.y,.44)} fill={wrong ? '#d69d94' : '#81ae94'} stroke={wrong ? '#ad3933' : '#174d3b'} stroke-width=".035" />
    {#each outline as line}<line x1={line.a[0]} y1={line.a[1]} x2={line.b[0]} y2={line.b[1]} stroke="#91a397" stroke-width=".02" />{/each}
  </svg>
</div>
<style>
  .cube { width:100%; height:100%; min-height:0; }
  svg { display:block; width:100%; height:100%; stroke-linejoin:round; stroke-linecap:round; }
</style>
