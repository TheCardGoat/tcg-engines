import { describe, expect, it } from "bun:test";
import {
  formatSupporterAriaLabel,
  getSupporterDisplayConfig,
  isVisibleSupporterTier,
  normalizeSupporterTier,
} from "./supporter-display.js";

describe("supporter display", () => {
  it("keeps free, bot, missing and unknown tiers plain", () => {
    for (const tier of [undefined, null, "", "free", "bot", "unknown"]) {
      expect(normalizeSupporterTier(tier)).toBeNull();
      expect(getSupporterDisplayConfig(tier)).toBeNull();
      expect(isVisibleSupporterTier(tier)).toBe(false);
    }
  });

  it("maps paid tiers to the three public supporter tiers", () => {
    expect(normalizeSupporterTier("tier2")).toBe("supporter");
    expect(normalizeSupporterTier("tier3")).toBe("champion");
    expect(normalizeSupporterTier("tier4")).toBe("legend");
  });

  it("does not mix retired tiers or authorization roles into supporter flair", () => {
    for (const value of ["tier1", "tier5", "tier6", "admin", "donor", "moderator"]) {
      expect(normalizeSupporterTier(value)).toBeNull();
    }
  });

  it("formats an accessible supporter label", () => {
    expect(formatSupporterAriaLabel("Ariel", "tier3")).toBe("Ariel, Champion");
    expect(formatSupporterAriaLabel("Ursula", "admin")).toBe("Ursula");
    expect(formatSupporterAriaLabel("Ariel", "free")).toBe("Ariel");
  });
});
