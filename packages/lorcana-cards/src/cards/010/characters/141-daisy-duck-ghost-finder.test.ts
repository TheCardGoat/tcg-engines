import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { daisyDuckGhostFinder } from "./141-daisy-duck-ghost-finder";

describe("Daisy Duck - Ghost Finder", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [daisyDuckGhostFinder],
    });

    const cardUnderTest = testEngine.getCardModel(daisyDuckGhostFinder);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
