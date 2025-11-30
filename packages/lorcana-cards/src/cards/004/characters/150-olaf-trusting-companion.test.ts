import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { olafTrustingCompanion } from "./150-olaf-trusting-companion";

describe("Olaf - Trusting Companion", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [olafTrustingCompanion],
    });
    const cardUnderTest = testEngine.getCardModel(olafTrustingCompanion);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
