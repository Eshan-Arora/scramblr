<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { paint, type Color, type Sticker } from '../lib/cube';
  import { pieceColors } from '../lib/pieces';
  let { target, top, front, wrong }: { target: Sticker; top: Color; front: Color; wrong: boolean } = $props();
  const colors = $derived(pieceColors(target, top, front));
  const edge = $derived(target.kind === 'edges');
  const edgeAngle = $derived.by(() => { target.id; return Math.random() < .5 ? 0 : 90; });
  const gradientId = $props.id();
  const shade = (color: Color) => color === 'white' ? '#ffffff' : `color-mix(in srgb, ${paint[color]} 90%, black)`;
  const mobile = new MediaQuery('(max-width: 767px)');
</script>
<div class="piece" data-sticker={target.id} role="img" aria-label={`${target.kind === 'edges' ? 'Edge' : 'Corner'} piece: ${colors.front}, ${colors.top}${colors.right ? `, ${colors.right}` : ''}. Name the outlined ${colors.front} sticker.`}>
  <svg viewBox={edge ? (mobile.current ? '40 13 220 220' : '0 0 300 246') : (mobile.current ? '50 25 210 205' : '0 0 310 240')} aria-hidden="true">
    {#if edge}
      <defs>
        <linearGradient id={`${gradientId}-front`} x2="1" y2=".8"><stop stop-color={paint[colors.front]} /><stop offset="1" stop-color={shade(colors.front)} /></linearGradient>
        <linearGradient id={`${gradientId}-top`} x2="1" y2=".5"><stop stop-color={paint[colors.top]} /><stop offset="1" stop-color={shade(colors.top)} /></linearGradient>
      </defs>
      <g transform={`rotate(${edgeAngle} 150 123)`} data-orientation={edgeAngle === 0 ? 'vertical' : 'horizontal'}>
        <polygon points="55,65 150,36 150,209 55,180" fill={`url(#${gradientId}-front)`} stroke={colors.front === 'white' ? '#d8dcd7' : paint[colors.front]} stroke-width="2" />
        <polygon points="150,36 245,65 245,180 150,209" fill={`url(#${gradientId}-top)`} stroke={colors.top === 'white' ? '#d8dcd7' : paint[colors.top]} stroke-width="2" />
        <path d="M150 37V208" stroke="#26352b" stroke-opacity=".22" stroke-width="1.4" />
        <path d="M57 66 150 38 243 66" fill="none" stroke="white" stroke-opacity=".4" stroke-width="1.5" />
        <polygon class="marker" points="66,74 140,51 140,195 66,172" stroke="white" stroke-width="7" />
        <polygon class="marker" points="66,74 140,51 140,195 66,172" stroke={wrong ? '#ad3933' : '#174d3b'} stroke-width="4" />
      </g>
    {:else}
      <g class="corner">
        <polygon points="73,79 152,43 238,81 158,119" fill={paint[colors.top]} />
        {#if colors.right}<polygon points="158,119 238,81 238,168 158,207" fill={paint[colors.right]} />{/if}
        <polygon points="73,79 158,119 158,207 73,166" fill={paint[colors.front]} />
        <polygon class="marker" points="83,94 148,125 148,191 83,160" stroke={wrong ? '#ad3933' : '#173223'} stroke-width="5" />
        <polygon class="marker" points="83,94 148,125 148,191 83,160" stroke="#fff" stroke-width="2" />
      </g>
    {/if}
  </svg>
</div>
<style>
  .piece { width:100%; height:100%; min-height:0; }
  svg { display:block; width:100%; height:100%; }
  polygon { stroke-linejoin:round; }
  .corner polygon:not(.marker) { stroke:#26352b; stroke-width:2; }
  .marker { fill:none; }
</style>
