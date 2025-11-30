import { describe, expect, it } from "bun:test";
import { hasVanish } from "@tcg/lorcana";
import { palaceGuardSpectralSentry } from "./045-palace-guard-spectral-sentry";

describe("Palace Guard - Spectral Sentry", () => {
  it("should have Vanish ability", () => {
    expect(hasVanish(palaceGuardSpectralSentry)).toBe(true);
  });
});
