import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { iraScarletRevenger } from "../heroes/ira-scarlet-revenger.ts";
import { dash } from "../heroes/dash.ts";
import { harmonizedKodachi } from "../weapons/harmonized-kodachi.ts";
import { snatchRed } from "./snatch.ts";
import { bleedOutRed } from "./bleed-out.ts";

/**
 * Bleed Out (BEN007) — "Bleed Out costs X resource points less to play, where
 * X is the total damage you've dealt with daggers this combat chain.
 * Go again"
 *
 * Mode B (fab-rules): the cost discount is a continuous self-cost modifier
 * evaluated at announcement (CR 5.4.4): X counts damage already dealt this
 * combat chain by dagger sources only. Proven: dagger damage discounts, no
 * prior damage does not, and blocked dagger damage (0 dealt) does not.
 */

describe("Bleed Out family AAA", () => {
  it("happy: 1 dagger damage on the chain discounts the play cost from 2 to 1", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [bleedOutRed],
        weapon1: [harmonizedKodachi],
        // 1 for the Kodachi activation ({r}) + the discounted Bleed Out cost.
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);

    // Link 1: Harmonized Kodachi (Ninja Dagger, 1{p}) deals 1 damage.
    Ira.activateAttack(harmonizedKodachi);
    game.advanceCombatTo("resolution");

    // Link 2 on the open chain: Bleed Out costs 2 - 1 = 1.
    Ira.must.playAttack(bleedOutRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4); // printed power untouched
    expectFabPlayer(Ira).toHaveResourceCount(1); // 3 - 1 (dagger) - 1 (discounted)
  });

  it("boundary: with no dagger damage on the chain the cost stays 2", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [bleedOutRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);

    Ira.must.playAttack(bleedOutRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Ira).toHaveResourceCount(0); // X = 0: full cost paid
  });

  it("timing: dagger damage that was fully blocked (0 dealt) gives no discount", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [bleedOutRed],
        weapon1: [harmonizedKodachi],
        // 1 for the Kodachi activation + Bleed Out's undiscounted cost of 2.
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);
    const Dash = game.as(dash);

    // Link 1: the dagger is on the chain but its 1 damage is fully blocked.
    Ira.activateAttack(harmonizedKodachi);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed); // 2{d} vs 1{p} -> 0 damage dealt
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Link 2: X counts damage dealt, not daggers played — still full cost.
    Ira.must.playAttack(bleedOutRed);

    expectFabPlayer(Ira).toHaveResourceCount(0); // 3 - 1 (dagger) - 2 (full)
    expectFabPlayer(Dash).toHaveLife(20); // nothing has gotten through
  });
});
