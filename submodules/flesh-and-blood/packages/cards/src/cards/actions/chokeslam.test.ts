import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { scarForAScarRed } from "./scar-for-a-scar.ts";
import { nimblismRed } from "./nimblism.ts";
import { chokeslamRed } from "./chokeslam.ts";

/**
 * Chokeslam Red (CRU035) — Guardian Action Attack.
 *
 * Printed: When this deals 4 or more damage to a hero, attack action cards
 * they control can't gain {p} during their next action phase.
 */

describe("Chokeslam family AAA", () => {
  it("prevents the damaged hero's Nimblism gain during their next action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [chokeslamRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismRed, scarForAScarRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(chokeslamRed);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(12);
    Bravo.endTurn();
    game.untilIdle({ ordering: "listed" });

    Dash.play(nimblismRed);
    game.untilIdle();
    Dash.playAttack(scarForAScarRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("does not arm when two real defending cards reduce the damage below 4", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [chokeslamRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, nimblismRed, scarForAScarRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(chokeslamRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(18);
    Bravo.endTurn();
    game.untilIdle({ ordering: "listed" });

    Dash.play(nimblismRed);
    game.untilIdle();
    Dash.playAttack(scarForAScarRed);

    expectCombat(game).toHaveAttackPower(7);
  });

  it("does not suppress the attacking hero's later gain on the Chokeslam turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [chokeslamRed, nimblismRed, scarForAScarRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(chokeslamRed);
    game.closeCombat();
    Bravo.play(nimblismRed);
    game.untilIdle();
    Bravo.playAttack(scarForAScarRed);

    expectCombat(game).toHaveAttackPower(7);
  });
});
