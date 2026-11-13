<script lang="ts">
  import { T, useThrelte } from '@threlte/core';
  import { DoubleSide, Matrix4, Quaternion, Vector3 } from 'three';
  import { basis, stickers, faceColors, paint, type Color, type Sticker, type Vec } from '../lib/cube';
  let { target, top, front, wrong }: { target: Sticker; top: Color; front: Color; wrong: boolean } = $props();
  const { size } = useThrelte();
  const zoom = $derived(Math.min(size.current.width / 10, size.current.height / 9));
  const mapping = $derived(faceColors(top, front));
  const geometry = stickers.map(s => {
    const b = basis[s.face];
    const rear = ['B','L','D'].includes(s.face);
    // Rear faces are projected outward so their stickers remain individually readable.
    const offset = rear ? 4.5 : 1.51;
    const position = b.n.map((n,i) => n*offset + b.right[i]*s.x + b.up[i]*s.y) as Vec;
    const matrix = new Matrix4().makeBasis(new Vector3(...b.right), new Vector3(...b.up), new Vector3(...b.n));
    return { ...s, rear, position, quaternion: new Quaternion().setFromRotationMatrix(matrix).toArray() as [number, number, number, number] };
  });
</script>
<T.OrthographicCamera makeDefault position={[6, 5, 7]} zoom={zoom} near={0.1} far={100} oncreate={camera => camera.lookAt(0,0,0)} />
{#each geometry as sticker (sticker.id)}
  {@const selected = sticker.id === target.id}
  <T.Group position={sticker.position} quaternion={sticker.quaternion}>
    <T.Mesh renderOrder={selected ? 2 : 0}>
      <T.PlaneGeometry args={[.96,.96]} />
      <T.MeshBasicMaterial color={selected ? (wrong ? '#b43d36' : '#174d3b') : (sticker.rear ? '#b9c7c0' : '#3b443f')} side={DoubleSide} toneMapped={false} depthTest={!selected} />
    </T.Mesh>
    <T.Mesh position={[0,0,sticker.rear ? -.008 : .008]} renderOrder={selected ? 3 : 1}>
      <T.PlaneGeometry args={selected ? [.68,.68] : [.88,.88]} />
      <T.MeshBasicMaterial color={paint[mapping[sticker.face]]} side={DoubleSide} toneMapped={false} depthTest={!selected} transparent opacity={sticker.rear && !selected ? .24 : 1} />
    </T.Mesh>
    {#if selected}
      <T.Mesh position={[0,0,sticker.rear ? -.02 : .02]} renderOrder={4}><T.CircleGeometry args={[.12,24]} /><T.MeshBasicMaterial color={wrong ? '#b43d36' : '#174d3b'} side={DoubleSide} depthTest={false} toneMapped={false} /></T.Mesh>
    {/if}
  </T.Group>
{/each}
