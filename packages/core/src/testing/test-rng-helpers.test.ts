import { describe, expect, it } from "bun:test";
import type { SeededRNG } from "../rng/seeded-rng";
import { createDeterministicRNG, expectDeterministicBehavior, withSeed } from "./test-rng-helpers";

describe("test-rng-helpers", () => {
  describe("withSeed", () => {
    it("should execute function with deterministic RNG", () => {
      const result1 = withSeed("test-seed", (rng) => rng.randomInt(1, 100));

      const result2 = withSeed("test-seed", (rng) => rng.randomInt(1, 100));

      // Same seed should produce same results
      expect(result1).toBe(result2);
    });

    it("should produce different results with different seeds", () => {
      const result1 = withSeed("seed-1", (rng) => rng.randomInt(1, 100));

      const result2 = withSeed("seed-2", (rng) => rng.randomInt(1, 100));

      // Different seeds should (very likely) produce different results
      // This test could theoretically fail but probability is very low
      expect(result1).not.toBe(result2);
    });

    it("should work with multiple RNG operations", () => {
      const results1 = withSeed("test-seed", (rng) => [
        rng.randomInt(1, 10),
        rng.randomInt(1, 10),
        rng.randomInt(1, 10),
      ]);

      const results2 = withSeed("test-seed", (rng) => [
        rng.randomInt(1, 10),
        rng.randomInt(1, 10),
        rng.randomInt(1, 10),
      ]);

      // Same seed should produce same sequence
      expect(results1).toEqual(results2);
    });

    it("should work with shuffle operations", () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const shuffled1 = withSeed("shuffle-seed", (rng) => rng.shuffle(array));

      const shuffled2 = withSeed("shuffle-seed", (rng) => rng.shuffle(array));

      // Same seed should produce same shuffle
      expect(shuffled1).toEqual(shuffled2);
    });

    it("should work with pick operations", () => {
      const array = ["a", "b", "c", "d", "e"];

      const picked1 = withSeed("pick-seed", (rng) => [
        rng.pick(array),
        rng.pick(array),
        rng.pick(array),
      ]);

      const picked2 = withSeed("pick-seed", (rng) => [
        rng.pick(array),
        rng.pick(array),
        rng.pick(array),
      ]);

      // Same seed should produce same picks
      expect(picked1).toEqual(picked2);
    });

    it("should return function result", () => {
      const result = withSeed("test", (rng) => ({ text: "hello", value: rng.randomInt(1, 10) }));

      expect(result).toHaveProperty("value");
      expect(result).toHaveProperty("text");
      expect(result.text).toBe("hello");
    });
  });

  describe("createDeterministicRNG", () => {
    it("should create RNG with specified seed", () => {
      const rng = createDeterministicRNG("my-seed");

      expect(rng.getSeed()).toBe("my-seed");
    });

    it("should use default seed if none provided", () => {
      const rng = createDeterministicRNG();

      expect(rng.getSeed()).toBe("test-seed");
    });

    it("should produce deterministic results", () => {
      const rng1 = createDeterministicRNG("same-seed");
      const rng2 = createDeterministicRNG("same-seed");

      const value1 = rng1.randomInt(1, 1000);
      const value2 = rng2.randomInt(1, 1000);

      expect(value1).toBe(value2);
    });

    it("should be reusable", () => {
      const rng = createDeterministicRNG("reuse-seed");

      const results1 = [rng.randomInt(1, 10), rng.randomInt(1, 10)];

      // Reset by creating new RNG with same seed
      const rng2 = createDeterministicRNG("reuse-seed");
      const results2 = [rng2.randomInt(1, 10), rng2.randomInt(1, 10)];

      expect(results1).toEqual(results2);
    });
  });

  describe("expectDeterministicBehavior", () => {
    it("should pass when function produces same results", () => {
      const fn = (rng: SeededRNG) => rng.randomInt(1, 100);

      // Should not throw
      expectDeterministicBehavior(fn, "test-seed");
    });

    it("should throw when function produces different results", () => {
      let counter = 0;
      const fn = (rng: SeededRNG) => {
        // Add non-deterministic behavior
        counter++;
        return rng.randomInt(1, 100) + counter;
      };

      expect(() => {
        expectDeterministicBehavior(fn, "test-seed");
      }).toThrow(/deterministic/);
    });

    it("should work with complex return values", () => {
      const fn = (rng: SeededRNG) => ({
        flip: rng.flipCoin(),
        pick: rng.pick(["a", "b", "c"]),
        roll: rng.randomInt(1, 6),
      });

      // Should not throw
      expectDeterministicBehavior(fn, "complex-seed");
    });

    it("should work with array returns", () => {
      const fn = (rng: SeededRNG) => Array.from({ length: 10 }, () => rng.randomInt(1, 100));

      // Should not throw
      expectDeterministicBehavior(fn, "array-seed");
    });

    it("should detect non-determinism from external state", () => {
      let callCount = 0;
      const fn = (rng: SeededRNG) => {
        // Each call uses a different RNG seed due to external state
        callCount++;
        const tempRng = new (rng.constructor as new (seed: string) => SeededRNG)(
          `seed-${callCount}`,
        );
        return tempRng.randomInt(1, 100);
      };

      callCount = 0;
      expect(() => {
        expectDeterministicBehavior(fn, "shuffle-seed");
      }).toThrow(/deterministic/);
    });

    it("should use default seed if none provided", () => {
      const fn = (rng: SeededRNG) => rng.randomInt(1, 10);

      // Should not throw
      expectDeterministicBehavior(fn);
    });

    it("should provide helpful error message", () => {
      let callCount = 0;
      const fn = (_rng: SeededRNG) => {
        callCount++;
        return callCount; // Always different
      };

      expect(() => {
        expectDeterministicBehavior(fn, "test");
      }).toThrow(/Expected function to be deterministic/);
    });
  });

  describe("integration", () => {
    it("should help test game mechanics", () => {
      // Simulate drawing cards deterministically
      const drawCards = (rng: SeededRNG, count: number) => {
        const deck = ["card1", "card2", "card3", "card4", "card5"];
        const shuffled = rng.shuffle(deck);
        return shuffled.slice(0, count);
      };

      const hand1 = withSeed("game-seed", (rng) => drawCards(rng, 3));
      const hand2 = withSeed("game-seed", (rng) => drawCards(rng, 3));

      expect(hand1).toEqual(hand2);
    });

    it("should help test dice rolls", () => {
      const rollAttack = (rng: SeededRNG) => {
        const attack = rng.rollDice(20) as number; // D20
        const damage = rng.rollDice(6, 2) as number[]; // 2d6
        return { attack, damage };
      };

      const result1 = withSeed("combat-seed", rollAttack);
      const result2 = withSeed("combat-seed", rollAttack);

      expect(result1).toEqual(result2);
    });

    it("should help test probability distributions", () => {
      const generateResults = (rng: SeededRNG) =>
        Array.from({ length: 100 }, () => rng.randomInt(1, 6));

      const results1 = withSeed("distribution-seed", generateResults);
      const results2 = withSeed("distribution-seed", generateResults);

      // Should be identical
      expect(results1).toEqual(results2);

      // Should have good distribution (all values 1-6 appear)
      const uniqueValues = new Set(results1);
      expect(uniqueValues.size).toBeGreaterThan(4); // At least 5 different values
    });
  });
});
