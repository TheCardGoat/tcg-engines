import { describe, expect, it } from "vitest";

import {
  EFFECT_COVERAGE,
  incompleteEffectCoverage,
  nonVanillaCardIds,
  unaccountedEffectCardIds,
} from "../src/effect-coverage";

describe("revealed-card effect coverage", () => {
  it("accounts for every card with a skill or Support effect", () => {
    expect(unaccountedEffectCardIds()).toEqual([]);
    expect(EFFECT_COVERAGE.map((entry) => entry.cardId).sort()).toEqual(
      [...nonVanillaCardIds()].sort(),
    );
  });

  it("does not silently mark unresolved Preview behavior as complete", () => {
    expect(incompleteEffectCoverage()).toEqual([
      expect.objectContaining({
        cardId: "N-naruto-ex",
        status: "partial",
      }),
    ]);
  });
});
