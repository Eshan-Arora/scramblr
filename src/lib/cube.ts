export type Face = 'U' | 'L' | 'F' | 'R' | 'B' | 'D';
export type Color = 'white' | 'yellow' | 'green' | 'blue' | 'red' | 'orange';
export type Mode = 'edges' | 'corners' | 'mixed';
export type Vec = [number, number, number];
export const faces: Face[] = ['U', 'L', 'F', 'R', 'B', 'D'];
export const colors: Color[] = ['white', 'yellow', 'green', 'blue', 'red', 'orange'];
export const paint: Record<Color, string> = { white: '#ffffff', yellow: '#f1d34b', green: '#47956b', blue: '#4779bc', red: '#c65150', orange: '#e89746' };
export const opposite: Record<Color, Color> = { white: 'yellow', yellow: 'white', green: 'blue', blue: 'green', red: 'orange', orange: 'red' };
const vectors: Record<Color, Vec> = { white: [0,1,0], yellow: [0,-1,0], green: [0,0,1], blue: [0,0,-1], red: [1,0,0], orange: [-1,0,0] };
const cross = (a: Vec, b: Vec): Vec => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
export function faceColors(top: Color, front: Color): Record<Face, Color> {
  const right = cross(vectors[top], vectors[front]);
  const r = colors.find(c => vectors[c].every((n,i) => n === right[i]))!;
  return { U: top, D: opposite[top], F: front, B: opposite[front], R: r, L: opposite[r] };
}
export const basis: Record<Face, { n: Vec; right: Vec; up: Vec }> = {
  U: { n:[0,1,0], right:[1,0,0], up:[0,0,-1] },
  L: { n:[-1,0,0], right:[0,0,1], up:[0,1,0] },
  F: { n:[0,0,1], right:[1,0,0], up:[0,1,0] },
  R: { n:[1,0,0], right:[0,0,-1], up:[0,1,0] },
  B: { n:[0,0,-1], right:[-1,0,0], up:[0,1,0] },
  D: { n:[0,-1,0], right:[1,0,0], up:[0,0,1] },
};
export type Sticker = { id: string; face: Face; x: number; y: number; kind: 'edges' | 'corners' | 'center'; letter: string };
const corners = [[-1,1],[1,1],[1,-1],[-1,-1]];
const edges = [[0,1],[1,0],[0,-1],[-1,0]];
export const stickers: Sticker[] = faces.flatMap((face, f) => [-1,0,1].flatMap(x => [-1,0,1].map(y => {
  const kind = x === 0 && y === 0 ? 'center' : x !== 0 && y !== 0 ? 'corners' : 'edges';
  const index = (kind === 'corners' ? corners : edges).findIndex(([a,b]) => a === x && b === y);
  return { id: `${face}:${x}:${y}`, face, x, y, kind, letter: kind === 'center' ? '' : String.fromCharCode(65 + f*4 + index) };
})));
export function pickTarget(mode: Mode, previous?: string): Sticker {
  const pool = stickers.filter(s => s.kind !== 'center' && (mode === 'mixed' || s.kind === mode) && s.id !== previous);
  return pool[Math.floor(Math.random() * pool.length)];
}
