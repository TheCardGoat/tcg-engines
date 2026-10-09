import { describe, expect, it } from "bun:test";
import {
  getCosmeticProgressMultiplier,
  getEventTicketMultiplier,
  getPatronGrantInkmarks,
  getSupporterPerks,
  normalizeSupporterPerkTier,
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
