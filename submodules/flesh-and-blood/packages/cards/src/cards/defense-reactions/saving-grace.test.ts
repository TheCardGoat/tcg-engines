import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { throttleRed } from "../actions/throttle.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { savingGraceYellow } from "./saving-grace.ts";

/**
 * Saving Grace (ASB025) — Light Warrior Defense Reaction (yellow).
 *
 * Printed:
 *   As an additional cost to play this, you may charge your hero's soul.
 *   If you've charged this turn, target attack gets -2{p}.
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability generates its effect when the
 *     reaction layer resolves), CR 6.2 (layer-continuous modify-numeric on
 *     the declared target), CR 1.11 (charge your hero's soul — move a card
 *     from the soul deck/zone per the Charge keyword, CR 8.4), CR 7.5
 *     (defense reactions are playable in the reaction step by the
 *     defending player), CR 2.9 (power).
 *   behaviorConstraints:
 *     - The charge is OPTIONAL additional cost: paying it moves the chosen
 *       card into the hero's soul zone.
 *     - The -2{p} applies only if the controller has charged THIS TURN;
 *       declining (and having charged nothing else) leaves the attack's
 *       power untouched.
 *     - The modifier applies to the on-stack attack before the damage step.
 *   testImplications:
 *     - With the charge paid the attack reads base 4 − 2 = 2 and the
 *       charged card sits in the soul zone; declining keeps the attack at
 *       its base 4 and the fodder in hand; a 6{p} Throttle debuffed to 4
 *       against Saving Grace's own 3{d} leaves exactly 1 damage (20 → 19),
 *       proving the debuff lands before the damage step.
 */

describe("Saving Grace (ASB025) AAA", () => {
  it("happy: charging the soul debuffs the attack by -2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: boltyn,
        hand: [savingGraceYellow, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Boltyn = game.as(boltyn);

    Dash.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    if (Dash.hasPriority()) Dash.pass();

    Boltyn.play(savingGraceYellow, { chargeCard: nimblismBlue });
    game.passBoth();

    // Snatch base 4 - 2 from the charged Saving Grace = 2, and the fodder
    // card was charged into Boltyn's soul.
    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
  });

  it("boundary: declining the charge leaves the attack untouched", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: boltyn,
        hand: [savingGraceYellow, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Boltyn = game.as(boltyn);

    Dash.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    if (Dash.hasPriority()) Dash.pass();

    // No chargeCard is passed: the additional cost is declined, so the
    // "if you've charged this turn" condition never becomes true.
    Boltyn.play(savingGraceYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Boltyn, nimblismBlue).toBeIn("hand");
  });

  it("timing: the -2{p} lands before the damage step", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [throttleRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: boltyn,
        hand: [savingGraceYellow, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Boltyn = game.as(boltyn);

    Dash.must.playAttack(throttleRed);
    game.advanceCombatTo("reaction");
    if (Dash.hasPriority()) Dash.pass();

    Boltyn.play(savingGraceYellow, { chargeCard: nimblismBlue });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });

    // Throttle's 6{p} is debuffed to 4 before damage; Saving Grace's own 3{d}
    // blocks 3 of it, leaving exactly 1 damage (6 - 2 - 3).
    expectFabPlayer(Boltyn).toHaveLife(19);
  });
});
