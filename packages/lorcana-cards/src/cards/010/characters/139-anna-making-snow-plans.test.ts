import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { annaMakingSnowPlans } from "./139-anna-making-snow-plans";

describe("Anna - Making Snow Plans", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [annaMakingSnowPlans],
    });

    const cardUnderTest = testEngine.getCardModel(annaMakingSnowPlans);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
