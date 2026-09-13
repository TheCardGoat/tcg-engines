import { describe, expect, it } from "bun:test";
import {
  ALT_ART_CALIBRATION_TARGET,
  ALT_ART_TOP_RARITY_BY_GAME,
  getCosmeticProgressMultiplier,
  getEventTicketMultiplier,
  getPatronGrantInkmarks,
  getSupporterPerks,
  normalizeSupporterPerkTier,
  replayRetentionDaysForTier,
  replayRetentionExpiryAt,
} from "./supporter-perks.js";

describe("supporter perk config", () => {
  it("returns no paid perks for free or unknown tiers", () => {
    expect(getSupporterPerks("free")).toBeNull();
    expect(getSupporterPerks("bot")).toBeNull();
    expect(getPatronGrantInkmarks("free")).toBe(0);
    expect(getCosmeticProgressMultiplier("free")).toBe(1);
    expect(getEventTicketMultiplier("free")).toBe(1);
  });

  it("maps active perk tiers to the configured perk tiers", () => {
    expect(normalizeSupporterPerkTier("tier1")).toBeNull();
    expect(normalizeSupporterPerkTier("tier2")).toBe("tier2");
    expect(normalizeSupporterPerkTier("tier3")).toBe("tier3");
    expect(normalizeSupporterPerkTier("tier4")).toBe("tier4");
    expect(normalizeSupporterPerkTier("tier5")).toBeNull();
    expect(normalizeSupporterPerkTier("tier6")).toBeNull();
  });

  it("centralizes grants and engagement multipliers without granting card printings", () => {
    expect(getPatronGrantInkmarks("tier1")).toBe(0);
    expect(getPatronGrantInkmarks("tier2")).toBe(50);
    expect(getPatronGrantInkmarks("tier3")).toBe(100);
    expect(getPatronGrantInkmarks("tier4")).toBe(150);

    expect(getCosmeticProgressMultiplier("tier1")).toBe(1);
    expect(getCosmeticProgressMultiplier("tier2")).toBe(2);
    expect(getCosmeticProgressMultiplier("tier3")).toBe(3);
    expect(getCosmeticProgressMultiplier("tier4")).toBe(5);

    expect(getEventTicketMultiplier("tier1")).toBe(1);
    expect(getEventTicketMultiplier("tier2")).toBe(2);
    expect(getEventTicketMultiplier("tier3")).toBe(3);
    expect(getEventTicketMultiplier("tier4")).toBe(5);
  });

  it("owns the replay retention policy for free and paid tiers", () => {
    expect(replayRetentionDaysForTier("free")).toBe(1);
    expect(replayRetentionDaysForTier("tier2")).toBe(30);
    expect(replayRetentionDaysForTier("tier3")).toBe(60);
    expect(replayRetentionDaysForTier("tier4")).toBe(90);
    expect(replayRetentionDaysForTier("unknown")).toBe(1);
  });

  it("guarantees a full day after publication without shortening paid retention", () => {
    const completed = new Date("2026-09-01T12:00:00.000Z");
    expect(replayRetentionExpiryAt(completed, 1).toISOString()).toBe("2026-09-02T12:00:00.000Z");
    expect(
      replayRetentionExpiryAt(completed, 1, new Date("2026-09-02T11:00:00.000Z")).toISOString(),
    ).toBe("2026-09-03T11:00:00.000Z");
    expect(replayRetentionExpiryAt(completed, 90, new Date("2026-09-02T11:00:00.000Z"))).toEqual(
      new Date("2026-11-30T12:00:00.000Z"),
    );
  });
});

describe("alt-art cross-game calibration anchor", () => {
  it("pins the top-rarity permanent-marks target at 120", () => {
    expect(ALT_ART_CALIBRATION_TARGET.topRarityPermanentMarks).toBe(120);
  });

  it("declares the rarity code every game's top tier maps onto", () => {
    expect(ALT_ART_CALIBRATION_TARGET.topRarityCode).toBe("enchanted");
  });

  it("maps every known game's rarest alt-art onto the calibration rarity code", () => {
    for (const [game, code] of Object.entries(ALT_ART_TOP_RARITY_BY_GAME)) {
      expect(code).toBe(ALT_ART_CALIBRATION_TARGET.topRarityCode);
    }
    // Both supported games are present and both resolve to "enchanted".
    expect(ALT_ART_TOP_RARITY_BY_GAME.lorcana).toBe("enchanted");
    expect(ALT_ART_TOP_RARITY_BY_GAME.cyberpunk).toBe("enchanted");
  });
});
