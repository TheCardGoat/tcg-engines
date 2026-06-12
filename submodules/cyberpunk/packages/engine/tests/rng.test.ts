import { describe, expect, it } from "vite-plus/test";
import { SeededRNG } from "../src/state/rng.ts";
import type { DieType } from "../src/types/gig-die.ts";

describe("SeededRNG", () => {
  it("is deterministic for a given seed", () => {
    const first = new SeededRNG("deterministic");
    const second = new SeededRNG("deterministic");

    const firstValues = Array.from({ length: 8 }, () => first.nextInt(0, 999_999_999));
    const secondValues = Array.from({ length: 8 }, () => second.nextInt(0, 999_999_999));

    expect(firstValues).toEqual([
      971_958_103, 189_262_995, 378_573_378, 963_834_486, 715_507_559, 355_303_577, 115_700_300,
      326_402_895,
    ]);
    expect(secondValues).toEqual(firstValues);
  });

  it("can persist and resume its state", () => {
    const uninterrupted = new SeededRNG("resume");
    const interrupted = new SeededRNG("resume");

    const firstValue = interrupted.nextInt(1, 20);
    const savedState = interrupted.getState();

    const resumed = new SeededRNG("ignored-after-set-state");
    resumed.setState(savedState);

    expect(firstValue).toBe(uninterrupted.nextInt(1, 20));
    expect(resumed.nextInt(1, 20)).toBe(uninterrupted.nextInt(1, 20));
    expect(resumed.nextInt(1, 20)).toBe(uninterrupted.nextInt(1, 20));
  });

  it("rolls every game die inside its legal range", () => {
    const dice: DieType[] = ["d4", "d6", "d8", "d10", "d12", "d20"];
    const maxByDie: Record<DieType, number> = { d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20 };

    for (const die of dice) {
      const rng = new SeededRNG(`range:${die}`);
      for (let i = 0; i < 1_000; i++) {
        const roll = rng.rollDie(die);
        expect(roll).toBeGreaterThanOrEqual(1);
        expect(roll).toBeLessThanOrEqual(maxByDie[die]);
      }
    }
  });

  it("keeps game-die frequencies within expected sampling noise", () => {
    const rolls = 120_000;
    const dice: DieType[] = ["d4", "d6", "d8", "d10", "d12", "d20"];
    const maxByDie: Record<DieType, number> = { d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20 };

    for (const die of dice) {
      const sides = maxByDie[die];
      const expected = rolls / sides;
      const tolerance = expected * 0.04;
      const counts = Array.from({ length: sides }, () => 0);
      const rng = new SeededRNG(`frequency:${die}`);

      for (let i = 0; i < rolls; i++) {
        counts[rng.rollDie(die) - 1]++;
      }

      for (const count of counts) {
        expect(Math.abs(count - expected)).toBeLessThanOrEqual(tolerance);
      }
    }
  });

  it("rejects invalid integer ranges", () => {
    const rng = new SeededRNG("invalid-range");

    expect(() => rng.nextInt(3, 2)).toThrow("invalid range");
    expect(() => rng.nextInt(1.5, 2)).toThrow("integer bounds");
  });
});
