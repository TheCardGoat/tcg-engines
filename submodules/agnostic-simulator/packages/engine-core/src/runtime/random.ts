export interface PRNGState {
  s0: number;
  s1: number;
}

export function seedFromString(seed: string): PRNGState {
  let s0 = 0;
  let s1 = 0;
  for (let i = 0; i < seed.length; i++) {
    const code = seed.charCodeAt(i);
    s0 = (s0 * 31 + code) >>> 0;
    s1 = (s1 * 17 + code) >>> 0;
  }
  s0 ^= s0 >>> 16;
  s0 = (s0 * 0x7feb352d) >>> 0;
  s0 ^= s0 >>> 15;
  s1 ^= s1 >>> 16;
  s1 = (s1 * 0x846ca68b) >>> 0;
  s1 ^= s1 >>> 15;
  return { s0, s1 };
}

export function nextRandom(state: PRNGState): { value: number; state: PRNGState } {
  let { s0, s1 } = state;
  s1 ^= s1 << 23;
  s1 ^= s1 >>> 17;
  s1 ^= s0;
  s1 ^= s0 >>> 26;
  const nextState = { s0: s1, s1: s0 };
  const value = ((s0 + s1) >>> 0) / 0x100000000;
  return { value, state: nextState };
}

export interface RandomAPIState {
  random(): number;
  shuffle<T>(array: T[]): T[];
  rollDie(sides: number): number;
  pick<T>(array: readonly T[]): T;
  getState(): { seed: string; state: PRNGState; drawCount: number };
  /** Fork a new independent RNG from the current state. Safe for replay / test isolation. */
  clone(): RandomAPIState;
}

/**
 * Creates a mutable RNG API. The internal PRNG state is updated in-place
 * for performance (no allocation per draw). Use `clone()` before sharing
 * across contexts that must not interfere with each other.
 */
export function createRandomAPI(
  initialSeed: string,
  initialState?: PRNGState,
  initialDrawCount = 0,
): RandomAPIState {
  let prng = initialState ?? seedFromString(initialSeed);
  let drawCount = initialDrawCount;

  const api: RandomAPIState = {
    random() {
      const result = nextRandom(prng);
      prng = result.state;
      drawCount++;
      return result.value;
    },
    shuffle<T>(array: T[]): T[] {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(this.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },
    rollDie(sides: number): number {
      return Math.floor(this.random() * sides) + 1;
    },
    pick<T>(array: readonly T[]): T {
      if (array.length === 0) {
        throw new Error("Cannot pick from empty array");
      }
      return array[Math.floor(this.random() * array.length)];
    },
    getState() {
      return { seed: initialSeed, state: { ...prng }, drawCount };
    },
    clone() {
      return createRandomAPI(initialSeed, { ...prng }, drawCount);
    },
  };

  return api;
}
