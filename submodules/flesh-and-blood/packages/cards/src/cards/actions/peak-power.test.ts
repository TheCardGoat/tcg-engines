import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchYellow } from "./snatch.ts";
import { wreckerRompRed } from "./wrecker-romp.ts";
import { peakPowerRed } from "./peak-power.ts";

/**
 * Peak Power, Red — Brute Action - Attack, cost 3, 7{p}.
 *
 * Printed: "When this attacks, reveal the top card of your deck. If the
 * revealed card has 6 or more base {p}, this gets overpower."
 */

describe("Peak Power AAA", () => {
  it("happy: revealing a 6+ base {p} card grants overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [peakPowerRed],
        deckTop: [wreckerRompRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(peakPowerRed);
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("overpower");

    const rejection = Dash.expectFailure({
      move: "defend",
      payload: {
        instanceIds: Dash.findCardsInZone("hand", [nimblismBlue, snatchYellow]),
      },
    });
    expect(rejection.errorCode).toBe("overpower");
  });

  it("boundary: revealing a low-power card does not grant overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [peakPowerRed],
        deckTop: [nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(peakPowerRed);
    expectCombat(game).toBeAtStep("defend").notToHaveKeyword("overpower");

    Dash.defendWith(nimblismBlue, snatchYellow);
  });
});
