import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { daisyDuckGhostFinder } from "./141-daisy-duck-ghost-finder";

describe("Daisy Duck - Ghost Finder", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [daisyDuckGhostFinder],
      },
    );

    const cardUnderTest = testEngine.getCardModel(daisyDuckGhostFinder);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
