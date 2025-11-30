import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { happyGoodnatured } from "./011-happy-good-natured";

describe("Happy - Good-Natured", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [happyGoodnatured],
      },
    );

    const cardUnderTest = testEngine.getCardModel(happyGoodnatured);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
