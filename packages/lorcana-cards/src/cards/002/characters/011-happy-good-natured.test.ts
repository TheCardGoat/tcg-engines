import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { happyGoodnatured } from "./011-happy-good-natured";

describe("Happy - Good-Natured", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [happyGoodnatured],
    });

    const cardUnderTest = testEngine.getCardModel(happyGoodnatured);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
