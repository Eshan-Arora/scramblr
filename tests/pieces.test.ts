import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stickers, colors, opposite, basis } from '../src/lib/cube.ts';
import { pieceColors, pieceFaces } from '../src/lib/pieces.ts';

const targets = stickers.filter(s => s.kind !== 'center');
test('color prompts identify all 48 sticker targets uniquely in every solving orientation', () => {
  for (const top of colors) for (const front of colors) {
    if (top === front || opposite[top] === front) continue;
    const keys = new Set<string>();
    for (const target of targets) {
      const c = pieceColors(target, top, front);
      const companions = [c.top, ...(c.right ? [c.right] : [])];
      assert.equal(companions.length, target.kind === 'corners' ? 2 : 1);
      assert.equal(new Set([c.front, ...companions]).size, companions.length + 1);
      for (const other of companions) assert.notEqual(other, opposite[c.front]);
      if (c.right) assert.notEqual(c.right, opposite[c.top]);
      const key = `${c.front}:${companions.sort().join(',')}`;
      assert.ok(!keys.has(key), key);
      keys.add(key);
    }
    assert.equal(keys.size, 48);
  }
});
test('known default-orientation Speffz colors map to the correct target sticker', () => {
  const edgeB = targets.find(s => s.kind === 'edges' && s.letter === 'B')!;
  assert.deepEqual(pieceColors(edgeB, 'yellow', 'blue'), { front:'yellow', top:'red', right:undefined });
  const cornerJ = targets.find(s => s.kind === 'corners' && s.letter === 'J')!;
  assert.deepEqual(pieceColors(cornerJ, 'yellow', 'blue'), { front:'blue', top:'yellow', right:'red' });
});
test('every floating corner preserves a physical rotation rather than a mirrored color order', () => {
  for (const target of targets.filter(s => s.kind === 'corners')) {
    const p = pieceFaces(target);
    const u = basis[p.top].n, f = basis[p.front].n;
    const cross = [u[1]*f[2]-u[2]*f[1],u[2]*f[0]-u[0]*f[2],u[0]*f[1]-u[1]*f[0]];
    assert.deepEqual(cross.map(n => n || 0), basis[p.right!].n);
  }
});
