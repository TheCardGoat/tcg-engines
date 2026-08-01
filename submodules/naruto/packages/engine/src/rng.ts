/**
 * Deterministic seeded RNG (mulberry32-style). The seed is threaded through
 * `state.seed`, so a game is fully replayable from `seed + action log`.
 */

export interface RandomResult {
  /** Uniform float in [0, 1). */
  readonly value: number;
  /** Next seed. */
  readonly seed: number;
}

export function random(seed: number): RandomResult {
  let a = (seed + 0x6d2b79f5) | 0;
  a = Math.imul(a ^ (a >>> 15), 1 | a);
  a = (a + Math.imul(a ^ (a >>> 7), 61 | a)) ^ a;
  return {
    value: ((a ^ (a >>> 14)) >>> 0) / 0x100000000,
    seed: a,
  };
}

export interface ShuffleResult<T> {
  readonly items: T[];
  readonly seed: number;
}

/** Fisher-Yates shuffle driven by `random`. Never mutates the input. */
export function shuffle<T>(items: readonly T[], seed: number): ShuffleResult<T> {
  const result = [...items];
  let currentSeed = seed;
  for (let i = result.length - 1; i > 0; i -= 1) {
    const roll = random(currentSeed);
    currentSeed = roll.seed;
    const j = Math.floor(roll.value * (i + 1));
    const a = result[i] as T;
    result[i] = result[j] as T;
    result[j] = a;
  }
  return { items: result, seed: currentSeed };
}
