<script lang="ts">
  import { colors, opposite, type Color } from '../lib/cube';
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
  <h2>Solving orientation</h2>
  <div class="fields">
    <div class="field"><label for="top-color">Top</label><Dropdown id="top-color" label="Top" value={settings.top} {options} onchange={topChanged} /></div>
    <div class="field"><label for="front-color">Front</label><Dropdown id="front-color" label="Front" value={settings.front} options={options.filter(c => c.value !== settings.top && c.value !== opposite[settings.top])} onchange={value => update({ ...settings, front: value as Color })} /></div>
  </div>
</section>
<style>
  .settings-page { max-width:640px; margin:0 auto; padding:88px 24px 48px; }
  h1 { margin:0 0 44px; font-size:24px; } h2 { font-size:16px; margin:0 0 12px; }
  .fields { display:flex; gap:24px; margin-top:24px; } .field { display:grid; gap:10px; flex:1; min-width:0; font-size:14px; }
</style>
