import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { queenOfHeartsImpulsiveRuler } from "./123-queen-of-hearts-impulsive-ruler";

describe("Queen of Hearts - Impulsive Ruler", () => {
  it("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [queenOfHeartsImpulsiveRuler],
    });
    const cardUnderTest = testEngine.getCardModel(queenOfHeartsImpulsiveRuler);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
