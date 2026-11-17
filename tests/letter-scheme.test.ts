import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stickers } from '../src/lib/cube.ts';
import { isLetterScheme, schemeLetter, speffzScheme } from '../src/lib/letter-scheme.ts';
import { defaults, readSettings, saveSettings } from '../src/lib/settings.ts';

test('custom mappings cover every sticker, keep piece types separate, and preserve home geometry', () => {
  const customScheme = speffzScheme();
  customScheme.edges.reverse();
  customScheme.corners.push(customScheme.corners.shift()!);
  const original = JSON.stringify(stickers);
  for (const sticker of stickers.filter(s => s.kind !== 'center')) {
    const index = sticker.letter.charCodeAt(0) - 65;
    assert.equal(schemeLetter(sticker, defaults), sticker.letter);
    assert.equal(schemeLetter(sticker, { letterScheme: 'custom', customScheme }), customScheme[sticker.kind as 'edges' | 'corners'][index]);
    assert.equal(schemeLetter(sticker, { letterScheme: 'speffz', customScheme }), sticker.letter);
  }
  assert.equal(JSON.stringify(stickers), original);
});

test('schemes reject partial, duplicate, lowercase, or non-letter entries', () => {
  assert.ok(isLetterScheme(speffzScheme()));
  for (const invalid of [null, {}, { edges: [], corners: [] }, { ...speffzScheme(), edges: Array(24).fill('A') }]) assert.equal(isLetterScheme(invalid), false);
  for (const value of ['', 'a', '1', 'AA', null]) {
    const scheme = speffzScheme();
    (scheme.edges as unknown[])[0] = value;
    assert.equal(isLetterScheme(scheme), false);
  }
});

test('settings migrate, persist custom mappings, and recover from invalid stored schemes', () => {
  let stored = JSON.stringify({ version: 1, top: 'yellow', front: 'blue', mode: 'edges' });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => stored, setItem: (_key: string, value: string) => { stored = value; } } });
  try {
    assert.deepEqual(readSettings(), defaults);
    const customScheme = speffzScheme(); customScheme.edges.reverse();
    const settings = { ...defaults, letterScheme: 'custom' as const, customScheme };
    assert.equal(saveSettings(settings), true);
    assert.deepEqual(readSettings(), settings);
    saveSettings({ ...settings, letterScheme: 'speffz' });
    assert.deepEqual(readSettings().customScheme, customScheme);
    stored = JSON.stringify({ ...settings, customScheme: { edges: ['A'], corners: [] } });
    assert.deepEqual(readSettings(), defaults);
  } finally { delete (globalThis as { localStorage?: unknown }).localStorage; }
});
