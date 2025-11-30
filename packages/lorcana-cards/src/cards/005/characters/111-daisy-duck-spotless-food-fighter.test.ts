import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { daisyDuckSpotlessFoodfighter } from "./111-daisy-duck-spotless-food-fighter";

describe("Daisy Duck - Spotless Food-Fighter", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [daisyDuckSpotlessFoodfighter],
    });
    const cardUnderTest = testEngine.getCardModel(daisyDuckSpotlessFoodfighter);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
