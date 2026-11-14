export type Page = 'scramble' | 'time' | 'positions' | 'colors' | 'settings';
export const pages: { id: Page; label: string }[] = [
  { id: 'scramble', label: 'Scramble' },
  { id: 'time', label: 'Time' },
  { id: 'positions', label: 'Positions' },
  { id: 'colors', label: 'Colors' },
  { id: 'settings', label: 'Settings' },
];
export function searchPages(query: string) {
  const needle = query.trim().toLowerCase();
  return pages.map(page => {
    const text = `${page.id === 'positions' || page.id === 'colors' ? 'blind ' : ''}${page.label}`.toLowerCase();
    let rank = 3;
    if (!needle || text.split(/\s+/).some(word => word.startsWith(needle))) rank = 0;
    else if (text.includes(needle)) rank = 1;
    else {
      let index = 0;
      for (const char of text) if (char === needle[index]) index++;
      if (index === needle.length) rank = 2;
    }
    return { ...page, rank };
  }).filter(page => page.rank < 3).sort((a, b) => a.rank - b.rank);
}
