import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { palaceGuardSpectralSentry } from "./045-palace-guard-spectral-sentry";

describe("Palace Guard - Spectral Sentry", () => {
  it("should have Vanish ability", () => {
    const testEngine = new TestEngine({
      play: [palaceGuardSpectralSentry],
    });
    const cardUnderTest = testEngine.getCardModel(palaceGuardSpectralSentry);
    expect(cardUnderTest.hasVanish).toBe(true);
  });
});
