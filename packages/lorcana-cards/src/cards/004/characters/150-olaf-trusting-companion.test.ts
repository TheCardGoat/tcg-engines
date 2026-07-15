import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { olafTrustingCompanion } from "./150-olaf-trusting-companion";

describe("Olaf - Trusting Companion", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [olafTrustingCompanion],
    });

    const cardUnderTest = testEngine.getCardModel(olafTrustingCompanion);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
