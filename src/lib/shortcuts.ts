export const shortcuts = { sidebar: 'b', settings: ',' } as const;
export function isEditing(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
}
export function command(event: KeyboardEvent): keyof typeof shortcuts | undefined {
  if (event.repeat || event.altKey || event.shiftKey || !(event.metaKey || event.ctrlKey)) return;
  return (Object.keys(shortcuts) as (keyof typeof shortcuts)[]).find(action => shortcuts[action] === event.key.toLowerCase());
}
