import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { rapidReflexRed } from "../attack-reactions/rapid-reflex.ts";
import { nimblismRed } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { buzzsawTrapBlue } from "./buzzsaw-trap.ts";

/**
 * Buzzsaw Trap (OUT102) — Ranger Defense Reaction Trap.
 *
 * Printed: Legendary Riptide Specialization
 * When this defends an attack with {p} greater than its base, the attack
 * can't gain {p} this turn.
 */

describe("Buzzsaw Trap (OUT102) family behavior AAA", () => {
  it("happy: an already-boosted attack keeps its {p} and cannot gain more", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismRed, snatchRed, rapidReflexRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [buzzsawTrapBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(nimblismRed);
    game.untilIdle();
    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(7);
    game.toReaction("defender");
    Dash.must.playReaction(buzzsawTrapBlue);
    game.passBoth();
    game.passBoth();

    Bravo.must.playReaction(rapidReflexRed);
    game.passBoth();

    // CR 6.3.1 / 6.3.5: restrict-gain-power is a rule-mod applied before
    // object CEs on recalc, so Nimblism's +3 does not persist and Rapid
    // Reflex cannot add. Snag vs Pummel is the same primitive.
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Dash, buzzsawTrapBlue).toBeIn("combatChain");
  });

  it("does not restrict a later reaction when the defended attack was at base power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, rapidReflexRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [buzzsawTrapBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.toReaction("defender");
    Dash.must.playReaction(buzzsawTrapBlue);
    game.passBoth();

    Bravo.must.playReaction(rapidReflexRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(7);
  });
});
