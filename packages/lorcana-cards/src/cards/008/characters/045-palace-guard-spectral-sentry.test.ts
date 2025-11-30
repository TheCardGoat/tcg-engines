import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { palaceGuardSpectralSentry } from "./045-palace-guard-spectral-sentry";

describe("Palace Guard - Spectral Sentry", () => {
  it.skip("should have Vanish ability", () => {
    const testEngine = new TestEngine({
      play: [palaceGuardSpectralSentry],
    });

    const cardUnderTest = testEngine.getCardModel(palaceGuardSpectralSentry);
    expect(cardUnderTest.hasVanish).toBe(true);
  });
});
