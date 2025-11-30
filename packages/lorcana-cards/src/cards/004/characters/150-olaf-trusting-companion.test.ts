import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { olafTrustingCompanion } from "./150-olaf-trusting-companion";

describe("Olaf - Trusting Companion", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [olafTrustingCompanion],
    });

    const cardUnderTest = testEngine.getCardModel(olafTrustingCompanion);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
