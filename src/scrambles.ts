import { randomScrambleForEvent } from 'cubing/scramble';

type ScrambleResult = { text: string; error?: never } | { error: true; text?: never };

// cubing.js runs the random-state search in its own worker.
export function prepareScramble(): Promise<ScrambleResult> {
  return randomScrambleForEvent('333')
    .then((alg) => ({ text: alg.toString() }))
    .catch((error: unknown) => {
      console.error('Scramble generation failed', error);
      return { error: true as const };
    });
}
