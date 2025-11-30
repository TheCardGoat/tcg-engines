import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { peterPanFearlessFighter } from "./119-peter-pan-fearless-fighter";

describe("Peter Pan - Fearless Fighter", () => {
  it.skip("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [peterPanFearlessFighter],
    });

    const cardUnderTest = testEngine.getCardModel(peterPanFearlessFighter);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
