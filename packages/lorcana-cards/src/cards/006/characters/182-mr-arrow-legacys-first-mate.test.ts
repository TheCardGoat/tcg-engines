import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mrArrowLegacysFirstMate } from "./182-mr-arrow-legacys-first-mate";

describe("Mr. Arrow - Legacy's First Mate", () => {
  it("should have Resist 1 ability", () => {
    const testEngine = new TestEngine({
      play: [mrArrowLegacysFirstMate],
    });
    const cardUnderTest = testEngine.getCardModel(mrArrowLegacysFirstMate);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
