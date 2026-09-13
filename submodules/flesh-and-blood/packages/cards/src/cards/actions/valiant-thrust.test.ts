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
import { nimblismBlue } from "./nimblism.ts";
import { boltOfCourageRed } from "./bolt-of-courage.ts";
import { valiantThrustRed } from "./valiant-thrust.ts";

/**
 * Valiant Thrust, Red (BOL017) — Light Warrior Attack Action.
 *
 * Printed: "If you've charged this turn, Valiant Thrust gains +3{p}."
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability generates its effect when the
 *     card-layer resolves), CR 6.2 (layer-continuous modify-numeric on the
 *     chain link), CR 8.5.29 (Charge — the charged-this-turn status),
 *     CR 2.9 (power).
 *   behaviorConstraints:
 *     - The +3{p} applies only if the controller charged their hero's soul
 *       EARLIER THIS TURN; without a charge this turn the attack stays at
 *       its printed 4{p}.
 *     - The modifier joins the link before the damage step, so the boosted
 *       hit deals +3 damage.
 *   testImplications:
 *     - After a Bolt of Courage charge, Valiant Thrust reads 4+3 = 7{p};
 *       with no charge this turn it stays 4{p}; the boosted hit deals 7.
 */

describe("Valiant Thrust (BOL017) AAA", () => {
  it("happy: after a charge this turn, the thrust reads 7{p} on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageRed, nimblismBlue, valiantThrustRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    // Bolt of Courage's optional charge stamps charged-this-turn.
    Boltyn.attackWith(boltOfCourageRed, {
      charge: true,
      chargeCard: nimblismBlue,
    });
    game.helpers.resolveRestOfCombat();

    Boltyn.must.playAttack(valiantThrustRed);
    game.advanceCombatTo("defend");
    // Printed 4{p} + 3 from the charge-conditional = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: no charge this turn — the thrust stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [valiantThrustRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.must.playAttack(valiantThrustRed);
    game.advanceCombatTo("defend");
    // Nothing was charged this turn: the conditional +3 never applies.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +3{p} is on the link before damage — the hit deals 7", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltOfCourageRed, nimblismBlue, valiantThrustRed],
        resourcePoints: 1,
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

    Boltyn.must.playAttack(valiantThrustRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();

    // 3 damage from the setup Bolt of Courage hit, then 4 base + 3
    // conditional damage from the boosted thrust: 20 - 3 - 7 = 10.
    expectFabPlayer(Dash).toHaveLife(10);
    expectFabCard(Boltyn, valiantThrustRed).toBeIn("graveyard");
  });
});
