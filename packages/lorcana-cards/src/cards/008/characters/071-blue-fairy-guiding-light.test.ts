import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { blueFairyGuidingLight } from "./071-blue-fairy-guiding-light";

describe("Blue Fairy - Guiding Light", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [blueFairyGuidingLight],
    });

    const cardUnderTest = testEngine.getCardModel(blueFairyGuidingLight);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [blueFairyGuidingLight],
    });

    const cardUnderTest = testEngine.getCardModel(blueFairyGuidingLight);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
