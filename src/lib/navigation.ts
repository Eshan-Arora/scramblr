export type Page = 'scramble' | 'blind' | 'settings';
export const pages: { id: Page; label: string }[] = [
  { id: 'scramble', label: 'Scramble' },
  { id: 'blind', label: 'Blind trainer' },
  { id: 'settings', label: 'Settings' },
];
export function searchPages(query: string) {
  const needle = query.trim().toLowerCase();
  return pages.map(page => {
    const text = page.label.toLowerCase();
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
