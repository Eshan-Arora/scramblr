import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stickers, colors, opposite, faceColors, basis, pickTarget } from '../src/lib/cube.ts';

test('Speffz gives each piece type exactly A–X in U L F R B D order', () => {
  for (const kind of ['edges','corners'] as const) {
    const targets = stickers.filter(s => s.kind === kind);
    assert.equal(targets.length, 24);
    assert.equal(targets.map(s => s.letter).sort().join(''), 'ABCDEFGHIJKLMNOPQRSTUVWX');
  }
  assert.equal(stickers.filter(s => s.kind === 'center').length, 6);
});

test('Speffz face starts match UBL LBU FLU RFU BRU DLF', () => {
  const expected = [[-1,1,-1],[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1],[-1,-1,1]];
  for (const [i, letter] of [...'AEIMQU'].entries()) {
    const s = stickers.find(s => s.kind === 'corners' && s.letter === letter)!;
    const b = basis[s.face];
    assert.deepEqual(b.n.map((n,j) => n + b.right[j]*s.x + b.up[j]*s.y), expected[i]);
  }
  const edge = stickers.find(s => s.kind === 'edges' && s.letter === 'C')!;
  assert.equal(edge.face, 'U'); assert.equal(edge.x, 0); assert.equal(edge.y, -1);
});

test('all 24 orientations preserve color opposites and right-handed geometry', () => {
  let count = 0;
  for (const top of colors) for (const front of colors) {
    if (top === front || opposite[top] === front) continue;
    const c = faceColors(top, front); count++;
    assert.equal(new Set(Object.values(c)).size, 6);
    assert.equal(c.D, opposite[c.U]); assert.equal(c.B, opposite[c.F]); assert.equal(c.L, opposite[c.R]);
  }
  assert.equal(count, 24);
  assert.deepEqual(faceColors('yellow','blue'), { U:'yellow', D:'white', F:'blue', B:'green', R:'red', L:'orange' });
});

test('targets respect practice mode, exclude centers, and never repeat immediately', () => {
  for (const mode of ['edges','corners','mixed'] as const) {
    let previous = '';
    for (let i=0;i<200;i++) {
      const s = pickTarget(mode, previous);
      assert.notEqual(s.kind, 'center'); assert.notEqual(s.id, previous);
      if (mode !== 'mixed') assert.equal(s.kind, mode);
      previous = s.id;
    }
  }
});
