import { basis, faces, stickers, type Mode, type Sticker } from './cube.ts';

export function pieceKey(sticker: Sticker): string {
  const b = basis[sticker.face];
  return b.n.map((n, i) => n + sticker.x * b.right[i] + sticker.y * b.up[i]).join(',');
}

export function stickerNotation(sticker: Sticker): string {
  const position = pieceKey(sticker).split(',').map(Number);
  const adjacent = faces.filter(face => face !== sticker.face && basis[face].n.reduce((sum, n, i) => sum + n * position[i], 0) === 1);
  adjacent.sort((a, b) => 'UDFBRL'.indexOf(a) - 'UDFBRL'.indexOf(b));
  return sticker.face + adjacent.join('');
}

export const bufferOptions = (kind: 'edges' | 'corners') => stickers.filter(s => s.kind === kind).map(s => ({ value: stickerNotation(s), label: stickerNotation(s) }));
export type BufferSettings = { hideBuffers: boolean; edgeBuffer: string; cornerBuffer: string };
export function targetPool(mode: Mode, settings: BufferSettings): Sticker[] {
  const excluded = new Set(settings.hideBuffers ? stickers.filter(s => (s.kind === 'edges' && stickerNotation(s) === settings.edgeBuffer) || (s.kind === 'corners' && stickerNotation(s) === settings.cornerBuffer)).map(pieceKey) : []);
  return stickers.filter(s => s.kind !== 'center' && (mode === 'mixed' || s.kind === mode) && !excluded.has(pieceKey(s)));
}
export function pickPracticeTarget(settings: BufferSettings & { mode: Mode }, previous?: string): Sticker {
  const pool = targetPool(settings.mode, settings).filter(s => s.id !== previous);
  return pool[Math.floor(Math.random() * pool.length)];
}
