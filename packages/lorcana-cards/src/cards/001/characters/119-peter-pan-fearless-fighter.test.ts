import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { peterPanFearlessFighter } from "./119-peter-pan-fearless-fighter";

describe("Peter Pan - Fearless Fighter", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [peterPanFearlessFighter],
    });

    const cardUnderTest = testEngine.getCardModel(peterPanFearlessFighter);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
