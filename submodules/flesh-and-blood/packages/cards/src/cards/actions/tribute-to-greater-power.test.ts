import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { malice } from "../heroes/malice.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed, snatchYellow } from "./snatch.ts";
import { tributeToGreaterPowerRed } from "./tribute-to-greater-power.ts";

/**
 * Tribute to Greater Power, Red (IAR177) — Shadow Action - Attack, 6{p}, Blood
 * Debt.
 *
 * Printed: "Instant - Banish this from your hand: Your next attack this turn
 * gets overpower.\nBlood Debt"
 */

describe("Tribute to Greater Power (IAR177) AAA", () => {
  it("happy: banishing the tribute overpowers the next attack, then Blood Debt bites", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [tributeToGreaterPowerRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.activate(tributeToGreaterPowerRed);
    game.untilIdle();
    expectFabCard(Malice, tributeToGreaterPowerRed).toBeIn("banished");

    Malice.playAttack(snatchRed);
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("overpower");

    // Overpower: the defender cannot declare more than one action card.
    const rejection = Dash.expectFailure({
      move: "defend",
      payload: {
        instanceIds: Dash.findCardsInZone("hand", [nimblismBlue, snatchYellow]),
      },
    });
    expect(rejection.errorCode).toBe("overpower");

    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(18);

    // Blood Debt: the tribute sits in the banished zone at the end phase.
    Malice.endTurn();
    expectFabPlayer(Malice).toHaveLife(19);
  });

  it("boundary: without the tribute a two-action defense is legal", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.playAttack(snatchRed);
    expectCombat(game).toBeAtStep("defend").notToHaveKeyword("overpower");

    Dash.defendWith(nimblismBlue, snatchYellow);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
