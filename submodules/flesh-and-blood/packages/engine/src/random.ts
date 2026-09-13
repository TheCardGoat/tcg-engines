/**
 * Deterministic PRNG for Flesh and Blood match logic. Inlined here so the
 * engine package stays leaf-dependency-free; swap for `@tcg/engine-core`'s
 * `createRandomAPI` if shared replay tooling is needed later.
 */

export interface FabPrngState {
  s0: number;
  s1: number;
}

export function seedFromString(seed: string): FabPrngState {
  let s0 = 0;
  let s1 = 0;
  for (let i = 0; i < seed.length; i++) {
    const code = seed.charCodeAt(i);
    s0 = (s0 * 31 + code) >>> 0;
    s1 = (s1 * 17 + code) >>> 0;
  }
  s0 = mix(s0);
  s1 = mix(s1 ^ 0x9e3779b9);
  if (s0 === 0) s0 = 0x12345678;
  if (s1 === 0) s1 = 0x9abcdef0;
  return { s0, s1 };
}

export function nextRandom(state: FabPrngState): { value: number; state: FabPrngState } {
  let { s0, s1 } = state;
  s1 ^= s1 << 23;
  s1 ^= s1 >>> 17;
  s1 ^= s0;
  s1 ^= s0 >>> 26;
  const nextState = { s0: s1, s1: s0 };
  const value = ((s0 + s1) >>> 0) / 0x100000000;
  return { value, state: nextState };
}

/** Deterministically shuffle in place using the provided PRNG state. */
export function shuffleWith<T>(
  array: T[],
  state: FabPrngState,
): { array: T[]; state: FabPrngState } {
  const out = array.slice();
  let rng = state;
  for (let i = out.length - 1; i > 0; i--) {
    const roll = nextRandom(rng);
    rng = roll.state;
    const j = Math.floor(roll.value * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return { array: out, state: rng };
}

function mix(x: number): number {
  x ^= x >>> 16;
  x = (x * 0x7feb352d) >>> 0;
  x ^= x >>> 15;
  return x;
}
