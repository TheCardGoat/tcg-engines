import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { scarTempestuousLion } from "./047-scar-tempestuous-lion";

describe("Scar - Tempestuous Lion", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [scarTempestuousLion],
    });

    const cardUnderTest = testEngine.getCardModel(scarTempestuousLion);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should have Challenger 3 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [scarTempestuousLion],
    });

    const cardUnderTest = testEngine.getCardModel(scarTempestuousLion);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
