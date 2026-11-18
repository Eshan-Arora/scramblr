import { fuzzyRank } from './search';

export type Page = 'scramble' | 'time' | 'positions' | 'colors' | 'settings';
export const pages: { id: Page; label: string }[] = [
  { id: 'scramble', label: 'Scramble' },
  { id: 'time', label: 'Time' },
  { id: 'positions', label: 'Positions' },
  { id: 'colors', label: 'Colors' },
  { id: 'settings', label: 'Settings' },
];
export function searchPages(query: string) {
  return pages.map(page => {
    const text = `${page.id === 'positions' || page.id === 'colors' ? 'blind ' : ''}${page.label}`;
    return { ...page, rank: fuzzyRank(text, query) };
  }).filter(page => page.rank < 3).sort((a, b) => a.rank - b.rank);
}
