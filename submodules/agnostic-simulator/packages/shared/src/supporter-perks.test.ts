import { describe, expect, it } from "bun:test";
import {
  getCosmeticProgressMultiplier,
  getEventTicketMultiplier,
  getPatronGrantInkmarks,
  getSupporterPerks,
  hasActiveAlternateArtAccess,
  normalizeSupporterPerkTier,
} from "./supporter-perks";

describe("supporter perk config", () => {
  it("returns no paid perks for free or unknown tiers", () => {
    expect(getSupporterPerks("free")).toBeNull();
    expect(getSupporterPerks("bot")).toBeNull();
    expect(getPatronGrantInkmarks("free")).toBe(0);
    expect(getCosmeticProgressMultiplier("free")).toBe(1);
    expect(getEventTicketMultiplier("free")).toBe(1);
    expect(hasActiveAlternateArtAccess("free")).toBe(false);
  });

  it("maps legacy and active paid tiers to the configured perk tiers", () => {
    expect(normalizeSupporterPerkTier("tier1")).toBe("tier2");
    expect(normalizeSupporterPerkTier("tier2")).toBe("tier2");
    expect(normalizeSupporterPerkTier("tier3")).toBe("tier3");
    expect(normalizeSupporterPerkTier("tier4")).toBe("tier4");
    expect(normalizeSupporterPerkTier("tier5")).toBe("tier4");
    expect(normalizeSupporterPerkTier("tier6")).toBe("tier4");
  });

  it("centralizes grants, cosmetic multipliers, ticket multipliers, and art access", () => {
    expect(getPatronGrantInkmarks("tier2")).toBe(50);
    expect(getPatronGrantInkmarks("tier3")).toBe(100);
    expect(getPatronGrantInkmarks("tier4")).toBe(150);

    expect(getCosmeticProgressMultiplier("tier2")).toBe(2);
    expect(getCosmeticProgressMultiplier("tier3")).toBe(3);
    expect(getCosmeticProgressMultiplier("tier4")).toBe(5);

    expect(getEventTicketMultiplier("tier2")).toBe(2);
    expect(getEventTicketMultiplier("tier3")).toBe(3);
    expect(getEventTicketMultiplier("tier4")).toBe(5);

    expect(hasActiveAlternateArtAccess("tier3")).toBe(false);
    expect(hasActiveAlternateArtAccess("tier4")).toBe(true);
    expect(hasActiveAlternateArtAccess("tier6")).toBe(true);
  });
});
