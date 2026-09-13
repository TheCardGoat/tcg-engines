import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { headJabRed } from "./head-jab.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { devouringDoomwakeRed } from "./devouring-doomwake.ts";

/**
 * Devouring Doomwake, Red — Shadow Brute Action - Attack, cost 6, 11{p}, 3{d}.
 *
 * Printed: "When this hits, banish it and all defending cards. Blood Debt"
 */

describe("Devouring Doomwake AAA", () => {
  it("happy: an unblocked hit banishes this instead of the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [devouringDoomwakeRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(devouringDoomwakeRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(11);
    Dash.defendWith();
    game.closeCombat();

    expectFabCard(Levia, devouringDoomwakeRed).toBeBanished();
    expectFabPlayer(Dash).toHaveLife(9);
  });

  it("happy: a blocked hit also banishes the defending card", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [devouringDoomwakeRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(devouringDoomwakeRed);
    Dash.defendWith(snatchRed);
    game.closeCombat();

    expectFabCard(Levia, devouringDoomwakeRed).toBeBanished();
    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabPlayer(Dash).toHaveLife(11);
  });

  it("UST notes: a hit banishes defending cards from every link on the combat chain", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [headJabRed, devouringDoomwakeRed],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(headJabRed);
    Dash.defendWith(nimblismBlue);
    game.advanceCombatTo("resolution");

    Levia.playAttack(devouringDoomwakeRed);
    Dash.defendWith(nimblismBlue);
    game.closeCombat();

    expectFabCard(Levia, devouringDoomwakeRed).toBeBanished();
    expect(Dash.cardsIn("banished", nimblismBlue)).toHaveLength(2);
  });
});
