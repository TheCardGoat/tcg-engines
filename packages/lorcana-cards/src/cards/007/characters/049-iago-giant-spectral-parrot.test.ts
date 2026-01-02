import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { iagoGiantSpectralParrot } from "./049-iago-giant-spectral-parrot";

describe("Iago - Giant Spectral Parrot", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [iagoGiantSpectralParrot],
    });

    const cardUnderTest = testEngine.getCardModel(iagoGiantSpectralParrot);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("should have Vanish ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [iagoGiantSpectralParrot],
    });

    const cardUnderTest = testEngine.getCardModel(iagoGiantSpectralParrot);
    expect(cardUnderTest.hasVanish).toBe(true);
  });
});
