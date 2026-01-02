import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { minnieMouseStylishSurfer } from "./113-minnie-mouse-stylish-surfer";

describe("Minnie Mouse - Stylish Surfer", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [minnieMouseStylishSurfer],
    });

    const cardUnderTest = testEngine.getCardModel(minnieMouseStylishSurfer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
