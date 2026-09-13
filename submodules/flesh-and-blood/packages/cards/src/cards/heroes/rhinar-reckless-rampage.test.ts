import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { bloodrushBellowYellow } from "../actions/bloodrush-bellow.ts";
import { alphaRampageRed } from "../actions/alpha-rampage.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rhinarRecklessRampage } from "./rhinar-reckless-rampage.ts";

describe("Rhinar, Reckless Rampage (RNR001) AAA", () => {
  it("happy: discarding a 6+{p} card during the action phase intimidates", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinarRecklessRampage,
        hand: [bloodrushBellowYellow, alphaRampageRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Opponent = game.as(dash);

    game.as(rhinarRecklessRampage).play(bloodrushBellowYellow);
    game.helpers.resolveUntilIdle();

    // Intimidate banished one card from the opponent's 2-card hand.
    expect(Opponent.handCount()).toBe(1);
  });

  it("boundary: discarding a card with fewer than 6{p} does not intimidate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinarRecklessRampage,
        hand: [bloodrushBellowYellow, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Opponent = game.as(dash);
    const handBefore = Opponent.handCount();

    game.as(rhinarRecklessRampage).play(bloodrushBellowYellow);
    game.helpers.resolveUntilIdle();

    expect(Opponent.handCount()).toBe(handBefore);
  });
});
