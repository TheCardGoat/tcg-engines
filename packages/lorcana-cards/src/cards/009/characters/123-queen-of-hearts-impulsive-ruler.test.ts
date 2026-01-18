import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { queenOfHeartsImpulsiveRuler } from "./123-queen-of-hearts-impulsive-ruler";

describe("Queen of Hearts - Impulsive Ruler", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [queenOfHeartsImpulsiveRuler],
    });

    const cardUnderTest = testEngine.getCardModel(queenOfHeartsImpulsiveRuler);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
