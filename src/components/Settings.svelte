<script lang="ts">
  import { colors, opposite, faceColors, paint, type Color } from '../lib/cube';
  import type { Settings } from '../lib/settings';
  let { settings, update }: { settings: Settings; update: (settings: Settings) => void } = $props();
  const mapping = $derived(faceColors(settings.top, settings.front));
  function topChanged(e: Event) {
    const top = (e.target as HTMLSelectElement).value as Color;
    const front = settings.front === top || settings.front === opposite[top] ? colors.find(c => c !== top && c !== opposite[top])! : settings.front;
    update({ ...settings, top, front });
  }
</script>
<section class="settings-page">
  <h1>Settings</h1>
  <h2>Solving orientation</h2>
  <p class="muted">Speffz letters follow face positions. Your top is U; your front is F.</p>
  <div class="fields">
    <label>Top <select value={settings.top} onchange={topChanged}>{#each colors as color}<option value={color}>{color}</option>{/each}</select></label>
    <label>Front <select value={settings.front} onchange={e => update({ ...settings, front: e.currentTarget.value as Color })}>{#each colors.filter(c => c !== settings.top && c !== opposite[settings.top]) as color}<option value={color}>{color}</option>{/each}</select></label>
  </div>
  <div class="orientation" aria-label="Face colors">{#each ['U','F','R'] as face}<span><i style:background={paint[mapping[face as keyof typeof mapping]]}></i>{face} · {mapping[face as keyof typeof mapping]}</span>{/each}</div>
  <p class="muted persistence">Saved on this browser.</p>
</section>
<style>
  .settings-page { max-width:640px; margin:0 auto; padding:88px 24px 48px; }
  h1 { margin:0 0 44px; font-size:24px; } h2 { font-size:16px; margin:0 0 12px; }
  p { font-size:14px; line-height:1.7; }
  .fields { display:flex; gap:24px; margin-top:24px; } label { display:grid; gap:10px; flex:1; font-size:14px; }
  select { width:100%; text-transform:capitalize; }
  .orientation { display:flex; flex-wrap:wrap; gap:18px; margin-top:24px; font-size:13px; } .orientation span { display:flex; align-items:center; gap:8px; } i { width:14px; height:14px; border:1px solid #999; border-radius:3px; }
  .persistence { margin-top:40px; }
</style>
