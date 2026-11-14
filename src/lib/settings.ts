import { colors, opposite, type Color, type Mode } from './cube.ts';
import { bufferOptions, type BufferSettings } from './buffers.ts';
export type Settings = BufferSettings & { version: 1; top: Color; front: Color; mode: Mode };
export const defaults: Settings = { version: 1, top: 'yellow', front: 'blue', mode: 'edges', hideBuffers: false, edgeBuffer: 'UF', cornerBuffer: 'UFR' };
const key = 'scramblr.settings';
export function readSettings(): Settings {
  try {
    const s = JSON.parse(localStorage.getItem(key) || 'null');
    if (!s || s.version !== 1 || !colors.includes(s.top) || !colors.includes(s.front) || s.top === s.front || opposite[s.top as Color] === s.front) return { ...defaults };
    return { hideBuffers: s.hideBuffers === true, edgeBuffer: bufferOptions('edges').some(o => o.value === s.edgeBuffer) ? s.edgeBuffer : defaults.edgeBuffer, cornerBuffer: bufferOptions('corners').some(o => o.value === s.cornerBuffer) ? s.cornerBuffer : defaults.cornerBuffer, version: 1, top: s.top, front: s.front, mode: ['edges','corners','mixed'].includes(s.mode) ? s.mode : 'edges' };
  } catch { return { ...defaults }; }
}
export function saveSettings(settings: Settings): boolean {
  try { localStorage.setItem(key, JSON.stringify(settings)); return true; } catch { return false; }
}
