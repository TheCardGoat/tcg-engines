import { describe, expect, test } from "vite-plus/test";

import { canShowSellCue, soldCardImageUrl } from "./useLastSoldCard";

describe("canShowSellCue", () => {
  const legal = {
    isOwnTurn: true,
    isMainPhase: true,
    gameEnded: false,
    soldThisTurn: false,
    attackInProgress: false,
  };

  test("keeps the reminder until the normal Sell action is no longer allowed", () => {
    expect(canShowSellCue(legal)).toBe(true);
    expect(canShowSellCue({ ...legal, isOwnTurn: false })).toBe(false);
    expect(canShowSellCue({ ...legal, isMainPhase: false })).toBe(false);
    expect(canShowSellCue({ ...legal, gameEnded: true })).toBe(false);
    expect(canShowSellCue({ ...legal, soldThisTurn: true })).toBe(false);
    expect(canShowSellCue({ ...legal, attackInProgress: true })).toBe(false);
  });

  test("ignores the eddie pool — selling is legal with every Eddie spent", () => {
    // SellCueInput has no eddie-count fields on purpose: spending the last
    // Eddie must not hide the slot, because selling adds a fresh one.
    expect(canShowSellCue(legal)).toBe(true);
  });
});

test("resolves art from the printed name recorded by a Sell move", () => {
  expect(soldCardImageUrl("Dying Night: V's Pistol")).toMatch(/\.webp$/);
});
