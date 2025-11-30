import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { daisyDuckSpotlessFoodfighter } from "./111-daisy-duck-spotless-food-fighter";

describe("Daisy Duck - Spotless Food-Fighter", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [daisyDuckSpotlessFoodfighter],
    });

    const cardUnderTest = testEngine.getCardModel(daisyDuckSpotlessFoodfighter);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
