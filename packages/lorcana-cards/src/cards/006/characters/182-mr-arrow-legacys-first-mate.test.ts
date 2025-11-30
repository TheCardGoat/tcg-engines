import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { mrArrowLegacysFirstMate } from "./182-mr-arrow-legacys-first-mate";

describe("Mr. Arrow - Legacy's First Mate", () => {
  it.skip("should have Resist 1 ability", () => {
    const testEngine = new TestEngine({
      play: [mrArrowLegacysFirstMate],
    });

    const cardUnderTest = testEngine.getCardModel(mrArrowLegacysFirstMate);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
