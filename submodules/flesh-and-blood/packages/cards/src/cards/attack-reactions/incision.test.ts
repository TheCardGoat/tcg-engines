import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { malignRed } from "../actions/malign.ts";
import { incisionRed } from "./incision.ts";

/**
 * Incision (ARK015) — Assassin / Warrior Attack Reaction (red).
 *
 * Printed:
 *   Target dagger attack gets +3{p}.
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability generates its effect when the
 *     reaction layer resolves), CR 6.2 (layer-continuous modify-numeric on
 *     the declared target), CR 7.4 (attack reactions are playable in the
 *     reaction step by the attack's controller), CR 8.1 (Attack Reaction
 *     type keyword), CR 2.9 (power).
 *   behaviorConstraints:
 *     - May target only a Dagger-subtype attack on the combat chain and
 *       grants +3{p}; a non-dagger attack action is not a legal target.
 *     - The +3{p} applies during the reaction step, before the damage step.
 *   testImplications:
 *     - Assert the dagger link (Nerve Scalpel base 1) reads 4 after the
 *       reaction, the reaction card reaches the graveyard; a non-dagger
 *       attack (Malign base 3) is rejected as a target leaving Incision in
 *       hand; the buffed dagger deals 4 damage (20 → 16).
 */

describe("Incision (ARK015) AAA", () => {
  it("happy: a dagger attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [nerveScalpel],
        hand: [incisionRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.activate(nerveScalpel);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(incisionRed);
    game.passBoth();

    // Nerve Scalpel base 1 + 3 = 4.
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Arakni, incisionRed).toBeIn("graveyard");
  });

  it("boundary: a non-dagger attack is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [incisionRed, malignRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");

    // Malign is an attack action, not a dagger: target rejected.
    expect(() => Arakni.must.playReaction(incisionRed)).toThrow();
    expectFabCard(Arakni, incisionRed).toBeIn("hand");
  });

  it("timing: the +3{p} applies during the reaction step before damage", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [nerveScalpel],
        hand: [incisionRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);

    Arakni.must.activate(nerveScalpel);
    game.advanceCombatTo("reaction");
    expectCombat(game).toHaveAttackPower(1);

    Arakni.must.playReaction(incisionRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);

    game.helpers.resolveRestOfCombat();

    // The unblocked dagger deals its buffed 4 damage.
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
