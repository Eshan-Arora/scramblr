<script lang="ts">
  import { colors, opposite, type Color } from '../lib/cube';
  import { bufferOptions } from '../lib/buffers';
  import Dropdown from './Dropdown.svelte';
  import type { Settings } from '../lib/settings';
  let { settings, update }: { settings: Settings; update: (settings: Settings) => void } = $props();
  const options = colors.map(value => ({ value, label: value[0].toUpperCase() + value.slice(1) }));
  function topChanged(value: string) {
    const top = value as Color;
    const front = settings.front === top || settings.front === opposite[top] ? colors.find(c => c !== top && c !== opposite[top])! : settings.front;
    update({ ...settings, top, front });
  }
</script>
<section class="settings-page">
  <h1>Settings</h1>
  <section aria-labelledby="blind-settings-heading">
  <h2 id="blind-settings-heading">Blind</h2>
  <h3>Solving orientation</h3>
  <div class="fields">
    <div class="field"><label for="top-color">Top</label><Dropdown id="top-color" label="Top" value={settings.top} {options} onchange={topChanged} /></div>
    <div class="field"><label for="front-color">Front</label><Dropdown id="front-color" label="Front" value={settings.front} options={options.filter(c => c.value !== settings.top && c.value !== opposite[settings.top])} onchange={value => update({ ...settings, front: value as Color })} /></div>
  </div>
  <label class="toggle-row"><span>Hide buffer pieces</span><input type="checkbox" role="switch" checked={settings.hideBuffers} onchange={e => update({ ...settings, hideBuffers: e.currentTarget.checked })} /></label>
  {#if settings.hideBuffers}
    <div class="fields">
      <div class="field"><label for="edge-buffer">Edge buffer</label><Dropdown id="edge-buffer" label="Edge buffer" value={settings.edgeBuffer} options={bufferOptions('edges')} onchange={edgeBuffer => update({ ...settings, edgeBuffer })} /></div>
      <div class="field"><label for="corner-buffer">Corner buffer</label><Dropdown id="corner-buffer" label="Corner buffer" value={settings.cornerBuffer} options={bufferOptions('corners')} onchange={cornerBuffer => update({ ...settings, cornerBuffer })} /></div>
    </div>
  {/if}
  </section>
</section>
<style>
  h3 { font-size:14px; font-weight:400; margin:24px 0 0; }
  .toggle-row { margin-top:32px; }
  .toggle-row { display:flex; align-items:center; justify-content:space-between; min-height:44px; cursor:pointer; font-size:16px; }
  .toggle-row input { appearance:none; width:40px; min-height:24px; height:24px; padding:2px; margin:10px 0; border:0; border-radius:20px; background:#a4ada6; cursor:pointer; }
  .toggle-row input::before { content:''; display:block; width:20px; height:20px; border-radius:50%; background:white; }
  .toggle-row input:checked { background:var(--accent); }
  .toggle-row input:checked::before { transform:translateX(16px); }
  .settings-page { max-width:640px; margin:0 auto; padding:88px 24px 48px; }
  h1 { margin:0 0 44px; font-size:24px; } h2 { font-size:16px; margin:0 0 12px; }
  .fields { display:flex; gap:24px; margin-top:24px; } .field { display:grid; gap:10px; flex:1; min-width:0; font-size:14px; }
</style>
