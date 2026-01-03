import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { ladyKluckProtectiveConfidant } from "./172-lady-kluck-protective-confidant";

describe("Lady Kluck - Protective Confidant", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ladyKluckProtectiveConfidant],
    });

    const cardUnderTest = testEngine.getCardModel(ladyKluckProtectiveConfidant);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ladyKluckProtectiveConfidant],
    });

    const cardUnderTest = testEngine.getCardModel(ladyKluckProtectiveConfidant);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
