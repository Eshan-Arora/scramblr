import type { Sticker } from './cube.ts';

export type LetterScheme = { edges: string[]; corners: string[] };
export function speffzScheme(): LetterScheme {
  return { edges: Array.from({ length: 24 }, (_, i) => String.fromCharCode(65 + i)), corners: Array.from({ length: 24 }, (_, i) => String.fromCharCode(65 + i)) };
}
export function isLetterScheme(value: unknown): value is LetterScheme {
  if (!value || typeof value !== 'object') return false;
  return (['edges', 'corners'] as const).every(kind => {
    const letters = (value as LetterScheme)[kind];
    return Array.isArray(letters) && letters.length === 24 && letters.every(letter => typeof letter === 'string' && /^[A-Z]$/.test(letter)) && new Set(letters).size === 24;
  });
}
export function schemeLetter(sticker: Sticker, settings: { letterScheme: 'speffz' | 'custom'; customScheme: LetterScheme | null }): string {
  return settings.letterScheme === 'custom' && settings.customScheme && sticker.kind !== 'center'
    ? settings.customScheme[sticker.kind][sticker.letter.charCodeAt(0) - 65]
    : sticker.letter;
}
