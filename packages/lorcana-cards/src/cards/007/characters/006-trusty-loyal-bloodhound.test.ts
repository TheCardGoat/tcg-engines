import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { trustyLoyalBloodhound } from "./006-trusty-loyal-bloodhound";

describe("Trusty - Loyal Bloodhound", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [trustyLoyalBloodhound],
    });
    const cardUnderTest = testEngine.getCardModel(trustyLoyalBloodhound);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
