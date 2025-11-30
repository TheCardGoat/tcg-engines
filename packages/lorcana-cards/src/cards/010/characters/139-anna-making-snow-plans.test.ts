import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { annaMakingSnowPlans } from "./139-anna-making-snow-plans";

describe("Anna - Making Snow Plans", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [annaMakingSnowPlans],
    });
    const cardUnderTest = testEngine.getCardModel(annaMakingSnowPlans);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
