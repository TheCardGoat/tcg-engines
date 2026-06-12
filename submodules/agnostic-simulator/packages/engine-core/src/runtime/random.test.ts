import { describe, expect, test } from "vitest";
import { createRandomAPI, nextRandom, seedFromString } from "./random.ts";

describe("seedFromString", () => {
  test("produces deterministic state for same seed", () => {
    const a = seedFromString("test-seed");
    const b = seedFromString("test-seed");
    expect(a).toEqual(b);
  });

  test("produces different state for different seeds", () => {
    const a = seedFromString("seed-a");
    const b = seedFromString("seed-b");
    expect(a).not.toEqual(b);
  });
});

describe("nextRandom", () => {
  test("returns values in [0, 1)", () => {
    let state = seedFromString("rng-test");
    for (let i = 0; i < 100; i++) {
      const result = nextRandom(state);
      expect(result.value).toBeGreaterThanOrEqual(0);
      expect(result.value).toBeLessThan(1);
      state = result.state;
    }
  });

  test("is deterministic", () => {
    const stateA = seedFromString("det-test");
    const stateB = seedFromString("det-test");

    const r1a = nextRandom(stateA);
    const r1b = nextRandom(stateB);
    expect(r1a.value).toBe(r1b.value);

    const r2a = nextRandom(r1a.state);
    const r2b = nextRandom(r1b.state);
    expect(r2a.value).toBe(r2b.value);
  });
});

describe("createRandomAPI", () => {
  test("shuffle is deterministic from seed", () => {
    const api1 = createRandomAPI("shuffle-test");
    const api2 = createRandomAPI("shuffle-test");

    const input = [1, 2, 3, 4, 5];
    expect(api1.shuffle([...input])).toEqual(api2.shuffle([...input]));
  });

  test("rollDie returns integers in range", () => {
    const api = createRandomAPI("die-test");
    for (let i = 0; i < 100; i++) {
      const result = api.rollDie(6);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(6);
    }
  });

  test("pick returns an element from array", () => {
    const api = createRandomAPI("pick-test");
    const arr = ["a", "b", "c"];
    const result = api.pick(arr);
    expect(arr).toContain(result);
  });

  test("getState tracks draw count", () => {
    const api = createRandomAPI("count-test");
    expect(api.getState().drawCount).toBe(0);
    api.random();
    expect(api.getState().drawCount).toBe(1);
    api.shuffle([1, 2, 3]);
    expect(api.getState().drawCount).toBe(3);
  });

  test("clone forks without affecting original", () => {
    const api = createRandomAPI("clone-test");
    api.random();
    api.random();

    const cloned = api.clone();
    expect(cloned.getState().drawCount).toBe(2);

    const originalNext = api.random();
    const clonedNext = cloned.random();
    expect(originalNext).toBe(clonedNext);

    api.random();
    expect(api.getState().drawCount).toBe(4);
    expect(cloned.getState().drawCount).toBe(3);
  });
});
