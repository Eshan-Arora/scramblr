<script lang="ts">
  import { Canvas } from '@threlte/core';
  import CubeScene from './CubeScene.svelte';
  import type { Color, Sticker } from '../lib/cube';
  let { target, top, front, wrong }: { target: Sticker; top: Color; front: Color; wrong: boolean } = $props();
</script>
<div class="cube" data-sticker={target.id} role="img" aria-label={`Solved cube with one ${target.kind === 'edges' ? 'edge' : 'corner'} sticker highlighted`}>
  <Canvas renderMode="on-demand" dpr={Math.min(window.devicePixelRatio || 1, 2)}><CubeScene {target} {top} {front} {wrong} /></Canvas>
</div>
<style>.cube { width:100%; height:100%; min-height:0; }</style>
