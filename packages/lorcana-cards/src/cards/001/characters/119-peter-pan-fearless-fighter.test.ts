import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { peterPanfearlessFighter } from "./119-peter-pan-fearless-fighter";

describe("Peter Pan - Fearless Fighter", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [peterPanfearlessFighter],
    });

    const cardUnderTest = testEngine.getCardModel(peterPanfearlessFighter);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
