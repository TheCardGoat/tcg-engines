import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { PeterPanFearlessFighter } from "./119-peter-pan-fearless-fighter";

describe("Peter Pan - Fearless Fighter", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [PeterPanFearlessFighter],
    });

    const cardUnderTest = testEngine.getCardModel(PeterPanFearlessFighter);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
