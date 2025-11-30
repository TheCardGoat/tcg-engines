import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { daisyDuckGhostFinder } from "./141-daisy-duck-ghost-finder";

describe("Daisy Duck - Ghost Finder", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [daisyDuckGhostFinder],
    });
    const cardUnderTest = testEngine.getCardModel(daisyDuckGhostFinder);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
