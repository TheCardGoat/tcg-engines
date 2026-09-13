import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { boltOfCourageRed } from "../actions/bolt-of-courage.ts";
import { courageousSteelhandRed } from "./courageous-steelhand.ts";

/**
 * Courageous Steelhand, Red (BOL012) — Light Warrior Attack Reaction.
 *
 * Printed: "If you've charged this turn, target attack gains +3{p}."
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability of the reaction), CR 6.2
 *     (layer-continuous modify-numeric on the targeted chain-link attack),
 *     CR 8.5.29 (Charge — the charged-this-turn status), CR 2.9 (power).
 *   behaviorConstraints:
 *     - The +3{p} applies to the targeted attack only if the controller
 *       charged their hero's soul EARLIER THIS TURN; without a charge the
 *       reaction resolves with no power change.
 *     - The modifier joins the link before the damage step, so the boosted
 *       hit deals +3 damage.
 *   testImplications:
 *     - After a Bolt of Courage charge, Snatch reads 4+3 = 7{p}; with no
 *       charge this turn it stays 4{p}; the boosted hit deals 7 damage.
 */

describe("Courageous Steelhand (BOL012) AAA", () => {
  it("happy: after a charge this turn, the targeted attack gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageRed, nimblismBlue, snatchRed, courageousSteelhandRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    // Bolt of Courage's optional charge stamps charged-this-turn.
    Boltyn.attackWith(boltOfCourageRed, {
      charge: true,
      chargeCard: nimblismBlue,
    });
    game.helpers.resolveRestOfCombat();

    Boltyn.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Boltyn.must.playReaction(courageousSteelhandRed);
    game.passBoth();

    // Snatch base 4 + 3 from Courageous Steelhand = 7.
    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Boltyn, courageousSteelhandRed).toBeIn("graveyard");
  });

  it("boundary: no charge this turn — the targeted attack stays at 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [snatchRed, courageousSteelhandRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Boltyn.must.playReaction(courageousSteelhandRed);
    game.passBoth();

    // Nothing was charged this turn: the conditional +3 never applies.
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Boltyn, courageousSteelhandRed).toBeIn("graveyard");
  });

  it("timing: the +3{p} lands on the link before damage — the hit deals 7", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageRed, nimblismBlue, snatchRed, courageousSteelhandRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.attackWith(boltOfCourageRed, {
      charge: true,
      chargeCard: nimblismBlue,
    });
    game.helpers.resolveRestOfCombat();

    Boltyn.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    // Before the reaction: printed 4.
    expectCombat(game).toHaveAttackPower(4);
    Boltyn.must.playReaction(courageousSteelhandRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(7);

    game.helpers.resolveRestOfCombat();

    // 3 damage from the setup Bolt of Courage hit, then 4 base + 3
    // conditional damage from the boosted Snatch: 20 - 3 - 7 = 10.
    expectFabPlayer(Dash).toHaveLife(10);
  });
});
