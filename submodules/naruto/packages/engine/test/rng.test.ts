import { describe, expect, it } from "vitest";

import { random, shuffle } from "../src/rng";

describe("rng", () => {
  it("random is deterministic for a given seed", () => {
    const a = random(42);
    const b = random(42);
    expect(a.value).toBe(b.value);
    expect(a.seed).toBe(b.seed);
  });

  it("random produces values in [0, 1) and threaded seeds diverge", () => {
    let seed = 7;
    const values: number[] = [];
    for (let i = 0; i < 100; i += 1) {
      const roll = random(seed);
      expect(roll.value).toBeGreaterThanOrEqual(0);
      expect(roll.value).toBeLessThan(1);
      values.push(roll.value);
      seed = roll.seed;
    }
    expect(new Set(values).size).toBeGreaterThan(90);
  });

  it("shuffle with the same seed yields the same permutation", () => {
    const input = Array.from({ length: 50 }, (_, i) => i);
    const a = shuffle(input, 1234);
    const b = shuffle(input, 1234);
    expect(a.items).toEqual(b.items);
    expect(a.seed).toBe(b.seed);
  });

  it("shuffle preserves elements and does not mutate the input", () => {
    const input = Array.from({ length: 50 }, (_, i) => `card-${i}`);
    const snapshot = [...input];
    const { items } = shuffle(input, 99);
    expect(input).toEqual(snapshot);
    expect([...items].sort()).toEqual([...input].sort());
  });

  it("different seeds produce different permutations", () => {
    const input = Array.from({ length: 50 }, (_, i) => i);
    const a = shuffle(input, 1);
    const b = shuffle(input, 2);
    expect(a.items).not.toEqual(b.items);
  });
});
