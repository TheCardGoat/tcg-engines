import { describe, expect, it } from "bun:test";
import {
  formatSupporterAriaLabel,
  getSupporterDisplayConfig,
  isVisibleSupporterTier,
  normalizeSupporterTier,
} from "./supporter-display";

describe("supporter display", () => {
  it("keeps free, bot, missing and unknown tiers plain", () => {
    for (const tier of [undefined, null, "", "free", "bot", "unknown"]) {
      expect(normalizeSupporterTier(tier)).toBeNull();
      expect(getSupporterDisplayConfig(tier)).toBeNull();
      expect(isVisibleSupporterTier(tier)).toBe(false);
    }
  });

  it("maps paid tiers to the three public supporter tiers", () => {
    expect(normalizeSupporterTier("tier1")).toBe("supporter");
    expect(normalizeSupporterTier("tier2")).toBe("supporter");
    expect(normalizeSupporterTier("tier3")).toBe("champion");
    expect(normalizeSupporterTier("tier4")).toBe("legend");
    expect(normalizeSupporterTier("tier6")).toBe("legend");
  });

  it("maps admin tier and role marker to a distinct admin flair", () => {
    expect(normalizeSupporterTier("tier5")).toBe("admin");
    expect(normalizeSupporterTier("admin")).toBe("admin");
    expect(getSupporterDisplayConfig("tier5")?.label).toBe("Admin");
  });

  it("formats an accessible supporter label", () => {
    expect(formatSupporterAriaLabel("Ariel", "tier3")).toBe("Ariel, Champion");
    expect(formatSupporterAriaLabel("Ursula", "admin")).toBe("Ursula, Admin");
    expect(formatSupporterAriaLabel("Ariel", "free")).toBe("Ariel");
  });
});
