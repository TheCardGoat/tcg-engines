import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { palaceGuardSpectralSentry } from "./045-palace-guard-spectral-sentry";

describe("Palace Guard - Spectral Sentry", () => {
  it("should have Vanish ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [palaceGuardSpectralSentry],
    });

    const cardUnderTest = testEngine.getCardModel(palaceGuardSpectralSentry);
    expect(cardUnderTest.hasVanish).toBe(true);
  });
});
