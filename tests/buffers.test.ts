import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bufferOptions, pieceKey, stickerNotation, targetPool } from '../src/lib/buffers.ts';
import { stickers } from '../src/lib/cube.ts';
import { defaults, readSettings } from '../src/lib/settings.ts';

test('every oriented buffer excludes its entire piece and no other pieces', () => {
  for (const kind of ['edges', 'corners'] as const) {
    const options = bufferOptions(kind);
    assert.equal(options.length, 24);
    assert.equal(new Set(options.map(o => o.value)).size, 24);
    for (const option of options) {
      const settings = { ...defaults, hideBuffers: true, [kind === 'edges' ? 'edgeBuffer' : 'cornerBuffer']: option.value };
      const buffer = stickers.find(s => s.kind === kind && stickerNotation(s) === option.value)!;
      const pool = targetPool(kind, settings);
      assert.equal(pool.length, kind === 'edges' ? 22 : 21);
      assert.ok(pool.every(s => pieceKey(s) !== pieceKey(buffer)));
    }
  }
  assert.equal(targetPool('mixed', { ...defaults, hideBuffers: true }).length, 43);
  assert.equal(targetPool('mixed', defaults).length, 48);
});

test('old settings acquire buffer defaults and invalid notation is rejected', () => {
  let stored = JSON.stringify({ version: 1, top: 'yellow', front: 'blue', mode: 'corners' });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => stored } });
  assert.deepEqual(readSettings(), { ...defaults, mode: 'corners' });
  stored = JSON.stringify({ ...defaults, hideBuffers: true, edgeBuffer: 'UD', cornerBuffer: 'FFF' });
  assert.deepEqual(readSettings(), { ...defaults, hideBuffers: true });
  delete (globalThis as { localStorage?: unknown }).localStorage;
});
