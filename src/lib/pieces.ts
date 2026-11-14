import { basis, faces, faceColors, type Color, type Face, type Sticker, type Vec } from './cube.ts';

const dot = (a: Vec, b: Vec) => a.reduce((sum, n, i) => sum + n * b[i], 0);
const cross = (a: Vec, b: Vec): Vec => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];

export function pieceFaces(target: Sticker): { front: Face; top: Face; right?: Face } {
  if (target.kind === 'center') throw new Error('A center is not a training piece');
  const b = basis[target.face];
  const position = b.n.map((n, i) => n + target.x * b.right[i] + target.y * b.up[i]) as Vec;
  const neighbors = faces.filter(face => face !== target.face && dot(basis[face].n, position) === 1);
  if (neighbors.length === 1) return { front: target.face, top: neighbors[0] };
  // Rotate the target sticker to the display's front without mirroring the corner.
  const top = neighbors.find(face => neighbors.some(other => dot(cross(basis[face].n, b.n), basis[other].n) === 1))!;
  return { front: target.face, top, right: neighbors.find(face => face !== top)! };
}

export function pieceColors(target: Sticker, top: Color, front: Color) {
  const colors = faceColors(top, front);
  const piece = pieceFaces(target);
  return { front: colors[piece.front], top: colors[piece.top], right: piece.right ? colors[piece.right] : undefined };
}
