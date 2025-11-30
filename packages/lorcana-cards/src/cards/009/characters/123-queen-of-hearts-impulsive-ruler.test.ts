import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { queenOfHeartsImpulsiveRuler } from "./123-queen-of-hearts-impulsive-ruler";

describe("Queen of Hearts - Impulsive Ruler", () => {
  it("should have Rush ability", () => {
    expect(hasRush(queenOfHeartsImpulsiveRuler)).toBe(true);
  });
});
