// Lower ranks prefer word prefixes, then substrings, then ordered letters.
export function fuzzyRank(text: string, query: string): number {
  const haystack = text.toLowerCase();
  const needle = query.trim().toLowerCase();
  if (!needle || haystack.split(/\s+/).some(word => word.startsWith(needle))) return 0;
  if (haystack.includes(needle)) return 1;
  let index = 0;
  for (const char of haystack) if (char === needle[index]) index++;
  return index === needle.length ? 2 : 3;
}
