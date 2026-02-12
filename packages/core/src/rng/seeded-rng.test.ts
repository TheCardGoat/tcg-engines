import { describe, expect, it } from "bun:test";
import { SeededRNG } from "./seeded-rng";

describe("SeededRNG", () => {
  describe("Interface", () => {
    it("should create RNG instance with default seed", () => {
      const rng = new SeededRNG();

      expect(rng).toBeDefined();
      expect(typeof rng.getSeed()).toBe("string");
    });

    it("should create RNG instance with provided seed", () => {
      const seed = "test-seed-123";
      const rng = new SeededRNG(seed);

      expect(rng.getSeed()).toBe(seed);
    });

    it("should have all required methods", () => {
      const rng = new SeededRNG();

      expect(typeof rng.getSeed).toBe("function");
      expect(typeof rng.setSeed).toBe("function");
      expect(typeof rng.random).toBe("function");
      expect(typeof rng.randomInt).toBe("function");
      expect(typeof rng.pick).toBe("function");
      expect(typeof rng.shuffle).toBe("function");
      expect(typeof rng.rollDice).toBe("function");
      expect(typeof rng.flipCoin).toBe("function");
      expect(typeof rng.createChild).toBe("function");
    });
  });

  describe("Seed Management", () => {
    it("should get current seed", () => {
      const seed = "my-seed";
      const rng = new SeededRNG(seed);

      expect(rng.getSeed()).toBe(seed);
    });

    it("should set new seed", () => {
      const rng = new SeededRNG("initial-seed");
      const newSeed = "new-seed";

      rng.setSeed(newSeed);

      expect(rng.getSeed()).toBe(newSeed);
    });

    it("should reset generator when seed changes", () => {
      const rng = new SeededRNG("seed1");
      const value1 = rng.random();

      rng.setSeed("seed1");
      const value2 = rng.random();

      expect(value1).toBe(value2);
    });
  });

  describe("Random Number Generation", () => {
    it("should generate random float between 0 and 1", () => {
      const rng = new SeededRNG("test");

      for (let i = 0; i < 100; i++) {
        const value = rng.random();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it("should generate random integer in range [min, max]", () => {
      const rng = new SeededRNG("test");

      for (let i = 0; i < 100; i++) {
        const value = rng.randomInt(1, 10);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(10);
        expect(Number.isInteger(value)).toBe(true);
      }
    });

    it("should generate random integer with single argument [0, max]", () => {
      const rng = new SeededRNG("test");

      for (let i = 0; i < 100; i++) {
        const value = rng.randomInt(5);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(5);
        expect(Number.isInteger(value)).toBe(true);
      }
    });

    it("should handle min === max in randomInt", () => {
      const rng = new SeededRNG("test");
      const value = rng.randomInt(5, 5);

      expect(value).toBe(5);
    });
  });

  describe("Array Operations", () => {
    it("should pick random element from array", () => {
      const rng = new SeededRNG("test");
      const array = ["a", "b", "c", "d", "e"];

      const picked = rng.pick(array);

      expect(array).toContain(picked);
    });

    it("should not mutate original array when picking", () => {
      const rng = new SeededRNG("test");
      const array = ["a", "b", "c"];
      const originalArray = [...array];

      rng.pick(array);

      expect(array).toEqual(originalArray);
    });

    it("should shuffle array", () => {
      const rng = new SeededRNG("test");
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const shuffled = rng.shuffle(array);

      expect(shuffled).toHaveLength(array.length);
      expect(shuffled.every((item) => array.includes(item))).toBe(true);
      expect(array.every((item) => shuffled.includes(item))).toBe(true);
    });

    it("should not mutate original array when shuffling", () => {
      const rng = new SeededRNG("test");
      const array = [1, 2, 3, 4, 5];
      const originalArray = [...array];

      rng.shuffle(array);

      expect(array).toEqual(originalArray);
    });

    it("should handle single element array", () => {
      const rng = new SeededRNG("test");
      const array = [42];

      const picked = rng.pick(array);
      const shuffled = rng.shuffle(array);

      expect(picked).toBe(42);
      expect(shuffled).toEqual([42]);
    });

    it("should handle empty array for pick", () => {
      const rng = new SeededRNG("test");
      const array: number[] = [];

      const picked = rng.pick(array);

      expect(picked).toBeUndefined();
    });

    it("should handle empty array for shuffle", () => {
      const rng = new SeededRNG("test");
      const array: number[] = [];

      const shuffled = rng.shuffle(array);

      expect(shuffled).toEqual([]);
    });
  });

  describe("Dice and Coin", () => {
    it("should roll dice with specified sides", () => {
      const rng = new SeededRNG("test");

      for (let i = 0; i < 100; i++) {
        const roll = rng.rollDice(6);
        expect(roll).toBeGreaterThanOrEqual(1);
        expect(roll).toBeLessThanOrEqual(6);
        expect(Number.isInteger(roll)).toBe(true);
      }
    });

    it("should roll multiple dice", () => {
      const rng = new SeededRNG("test");

      for (let i = 0; i < 50; i++) {
        const rolls = rng.rollDice(6, 3);
        expect(Array.isArray(rolls)).toBe(true);
        expect(rolls).toHaveLength(3);
        if (Array.isArray(rolls)) {
          for (const roll of rolls) {
            expect(roll).toBeGreaterThanOrEqual(1);
            expect(roll).toBeLessThanOrEqual(6);
            expect(Number.isInteger(roll)).toBe(true);
          }
        }
      }
    });

    it("should flip coin returning boolean", () => {
      const rng = new SeededRNG("test");
      let heads = 0;
      let tails = 0;

      for (let i = 0; i < 100; i++) {
        const flip = rng.flipCoin();
        expect(typeof flip).toBe("boolean");
        if (flip) {
          heads++;
        } else {
          tails++;
        }
      }

      // Both outcomes should occur (probability check)
      expect(heads).toBeGreaterThan(0);
      expect(tails).toBeGreaterThan(0);
    });

    it("should flip coin with bias", () => {
      const rng = new SeededRNG("test");
      let heads = 0;

      // 90% bias towards heads
      for (let i = 0; i < 1000; i++) {
        if (rng.flipCoin(0.9)) {
          heads++;
        }
      }

      // Should be roughly 900 heads out of 1000
      expect(heads).toBeGreaterThan(850);
      expect(heads).toBeLessThan(950);
    });
  });

  describe("Child RNG Creation", () => {
    it("should create child RNG with derived seed", () => {
      const parent = new SeededRNG("parent-seed");
      const child = parent.createChild("operation-1");

      expect(child).toBeInstanceOf(SeededRNG);
      expect(child.getSeed()).not.toBe(parent.getSeed());
    });

    it("should create independent child RNG", () => {
      const parent = new SeededRNG("parent-seed");
      const child = parent.createChild("child");

      // Generate some values in child
      child.random();
      child.random();

      // Parent should not be affected
      parent.setSeed("parent-seed");
      const parentValue = parent.random();

      parent.setSeed("parent-seed");
      const resetValue = parent.random();

      expect(parentValue).toBe(resetValue);
    });

    it("should create deterministic child RNGs", () => {
      const parent1 = new SeededRNG("seed");
      const child1 = parent1.createChild("operation");

      const parent2 = new SeededRNG("seed");
      const child2 = parent2.createChild("operation");

      expect(child1.random()).toBe(child2.random());
    });
  });

  describe("Deterministic Behavior", () => {
    it("should produce same sequence with same seed", () => {
      const rng1 = new SeededRNG("deterministic-seed");
      const sequence1 = Array.from({ length: 10 }, () => rng1.random());

      const rng2 = new SeededRNG("deterministic-seed");
      const sequence2 = Array.from({ length: 10 }, () => rng2.random());

      expect(sequence1).toEqual(sequence2);
    });

    it("should produce same shuffle with same seed", () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const rng1 = new SeededRNG("shuffle-seed");
      const shuffled1 = rng1.shuffle(array);

      const rng2 = new SeededRNG("shuffle-seed");
      const shuffled2 = rng2.shuffle(array);

      expect(shuffled1).toEqual(shuffled2);
    });

    it("should produce same dice rolls with same seed", () => {
      const rng1 = new SeededRNG("dice-seed");
      const rolls1 = Array.from({ length: 10 }, () => rng1.rollDice(20));

      const rng2 = new SeededRNG("dice-seed");
      const rolls2 = Array.from({ length: 10 }, () => rng2.rollDice(20));

      expect(rolls1).toEqual(rolls2);
    });

    it("should produce different sequences with different seeds", () => {
      const rng1 = new SeededRNG("seed1");
      const sequence1 = Array.from({ length: 10 }, () => rng1.random());

      const rng2 = new SeededRNG("seed2");
      const sequence2 = Array.from({ length: 10 }, () => rng2.random());

      expect(sequence1).not.toEqual(sequence2);
    });

    it("should maintain determinism across all operations", () => {
      const rng1 = new SeededRNG("complex-seed");
      const results1 = {
        coin: rng1.flipCoin(),
        dice: rng1.rollDice(6),
        int: rng1.randomInt(1, 100),
        pick: rng1.pick(["a", "b", "c", "d"]),
        random: rng1.random(),
      };

      const rng2 = new SeededRNG("complex-seed");
      const results2 = {
        coin: rng2.flipCoin(),
        dice: rng2.rollDice(6),
        int: rng2.randomInt(1, 100),
        pick: rng2.pick(["a", "b", "c", "d"]),
        random: rng2.random(),
      };

      expect(results1).toEqual(results2);
    });
  });
});
