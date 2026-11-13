<script lang="ts">
  import { Select } from 'bits-ui';
  let { value, options, label, id, shortcut, compactMobile = false, open = $bindable(false), onchange, onclose }: {
    value: string; options: { value: string; label: string }[]; label: string; id?: string;
    shortcut?: string; compactMobile?: boolean; open?: boolean; onchange: (value: string) => void; onclose?: () => void;
  } = $props();
  let trigger = $state<HTMLButtonElement | null>(null);
  export function openMenu() { if (!open) { trigger?.focus(); trigger?.click(); } }
</script>
<Select.Root type="single" {value} items={options} bind:open allowDeselect={false} onValueChange={onchange} onOpenChangeComplete={isOpen => { if (!isOpen) onclose?.(); }}>
  <Select.Trigger {id} bind:ref={trigger} class={compactMobile ? 'app-select compact-mobile' : 'app-select'} aria-label={label} aria-keyshortcuts={shortcut ? 'Shift+P' : undefined}>
    <span class="select-value">{options.find(option => option.value === value)?.label}</span>
    <span class="select-accessory">{#if shortcut}<kbd>{shortcut}</kbd>{/if}<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 4.5 3 3 3-3" stroke="currentColor" stroke-width="1.3" /></svg></span>
    {#if compactMobile}<svg class="mobile-more" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="4" cy="10" r="1.6"/><circle cx="10" cy="10" r="1.6"/><circle cx="16" cy="10" r="1.6"/></svg>{/if}
  </Select.Trigger>
  <Select.Portal>
    <Select.Content class="app-select-menu" sideOffset={6} align="end">
      {#each options as option}
        <Select.Item value={option.value} label={option.label} class="app-select-option">
          <span>{option.label}</span><span aria-hidden="true">{value === option.value ? '✓' : ''}</span>
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Portal>
</Select.Root>
<style>
  :global(.app-select) { width:100%; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:10px 12px; border:1px solid var(--line); border-radius:5px; background:var(--surface); font-size:16px; text-align:left; }
  :global(.app-select:hover), :global(.app-select[data-state="open"]) { border-color:var(--accent); }
  .select-accessory { display:flex; align-items:center; gap:10px; color:var(--muted); }
  kbd { font:11px var(--font); white-space:nowrap; }
  :global(.app-select-menu) { z-index:40; min-width:max(160px,var(--bits-select-anchor-width)); max-height:var(--bits-select-content-available-height); overflow-y:auto; padding:4px; border:1px solid var(--line); border-radius:6px; background:var(--surface); color:var(--ink); box-shadow:0 6px 20px #17261b12; outline:none; }
  :global(.app-select-option) { min-height:44px; display:flex; align-items:center; justify-content:space-between; gap:24px; padding:10px 12px; font-size:15px; border-radius:3px; cursor:pointer; outline:none; }
  :global(.app-select-option[data-selected]) { color:var(--accent); }
  :global(.app-select-option[data-highlighted]) { background:var(--accent-soft); }
  .mobile-more { display:none; }
  @media (max-width:767px) {
    kbd { display:none; }
    :global(.compact-mobile.app-select) { width:44px; height:44px; justify-content:center; padding:0; border-color:transparent; }
    :global(.compact-mobile) .select-value, :global(.compact-mobile) .select-accessory { display:none; }
    .mobile-more { display:block; }
  }
</style>
