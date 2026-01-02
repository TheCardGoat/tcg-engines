import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { trustyLoyalBloodhound } from "./006-trusty-loyal-bloodhound";

describe("Trusty - Loyal Bloodhound", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [trustyLoyalBloodhound],
    });

    const cardUnderTest = testEngine.getCardModel(trustyLoyalBloodhound);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
