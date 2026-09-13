import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { apexBusterYellow } from "./apex-buster.ts";
import { battleClearingBellowBlue } from "./battle-clearing-bellow.ts";
import { headJabRed } from "./head-jab.ts";

/**
 * Battle Clearing Bellow (IAR040) — Brute Action, cost 3, go again.
 *
 * Printed: "Your next attack with 6 or more base {p} this turn gets +6{p}.\nGo again"
 */

describe("Battle Clearing Bellow (IAR040) AAA", () => {
  it("happy: the next attack with 6 or more base {p} gets +6 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [battleClearingBellowBlue, apexBusterYellow],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(battleClearingBellowBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(apexBusterYellow, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(12);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(8);
    expectFabCard(Bravo, battleClearingBellowBlue).toBeIn("graveyard");
  });

  it("boundary: an attack with less than 6 base {p} gets no bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [battleClearingBellowBlue, headJabRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(battleClearingBellowBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(headJabRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("UST notes: an ineligible attack does not consume the next qualifying attack bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [battleClearingBellowBlue, headJabRed, apexBusterYellow],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 30, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(battleClearingBellowBlue);
    game.untilIdle();
    Bravo.playAttack(headJabRed);
    expectCombat(game).toHaveAttackPower(3);
    game.advanceCombatTo("resolution");

    Bravo.playAttack(apexBusterYellow, { optionals: "decline" });
    expectCombat(game).toHaveAttackPower(12);
  });
});
