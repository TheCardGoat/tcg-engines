import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { vipoxRed } from "../actions/vipox.ts";
import { malignRed } from "../actions/malign.ts";
import { shortAndSharpRed } from "./short-and-sharp.ts";

/**
 * Short and Sharp (ARA017) — Assassin / Ninja Attack Reaction (red).
 *
 * Printed:
 *   Choose 1;
 *   - Target dagger attack gains +3{p}.
 *   - Target attack action card with 2 or less base {p} gains +3{p}.
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.1 (mode declaration when playing the card), CR 5.3
 *     (resolution ability generates its effect when the reaction layer
 *     resolves), CR 6.2 (layer-continuous modify-numeric on the declared
 *     target), CR 7.4 (attack reactions are playable in the reaction step
 *     by the attack's controller), CR 8.1 (Attack Reaction type keyword),
 *     CR 2.9 (base power).
 *   behaviorConstraints:
 *     - Exactly one mode is chosen when the reaction is played.
 *     - Mode 1 may target only a Dagger-subtype attack on the combat chain
 *       and grants +3{p}.
 *     - Mode 2 may target only an attack ACTION card on the combat chain
 *       whose BASE power is 2 or less and grants +3{p}; an attack action
 *       with base 3{p} or more is not a legal target.
 *     - The +3{p} applies during the reaction step, before the damage step.
 *   testImplications:
 *     - Assert the dagger link (Nerve Scalpel base 1) reads 4 after mode 1,
 *       the attack-action link (Vipox base 1) reads 4 after mode 2, mode 2
 *       against a base-3 attack action (Malign) is rejected leaving the
 *       reaction in hand, and the buffed dagger deals 4 damage (20 -> 16).
 */

const modeId = (card: typeof shortAndSharpRed, mode: "daggerAttack" | "lowPowerAttack") =>
  `${card.canonicalId}:chooseMode:${mode}`;

describe("Short and Sharp (ARA017) AAA", () => {
  it("happy: mode 1 gives a dagger attack +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [nerveScalpel],
        hand: [shortAndSharpRed],
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
    Arakni.must.playReaction(shortAndSharpRed, {
      modeIds: [modeId(shortAndSharpRed, "daggerAttack")],
    });
    game.passBoth();

    // Nerve Scalpel base 1 + 3 = 4.
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Arakni, shortAndSharpRed).toBeIn("graveyard");
  });

  it("happy: mode 2 gives an attack action with 2 or less base {p} +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [shortAndSharpRed, vipoxRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.playAttack(vipoxRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(shortAndSharpRed, {
      modeIds: [modeId(shortAndSharpRed, "lowPowerAttack")],
    });
    game.passBoth();

    // Vipox base 1 + 3 = 4.
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Arakni, shortAndSharpRed).toBeIn("graveyard");
  });

  it("boundary: mode 2 cannot target an attack action with base 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [shortAndSharpRed, malignRed],
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

    // Malign's base 3{p} fails the "2 or less base {p}" restriction.
    expectFabUnplayable(() =>
      Arakni.must.playReaction(shortAndSharpRed, {
        modeIds: [modeId(shortAndSharpRed, "lowPowerAttack")],
      }),
    );
    expectFabCard(Arakni, shortAndSharpRed).toBeIn("hand");
  });

  it("timing: mode 1 +3{p} applies during the reaction step before damage", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [nerveScalpel],
        hand: [shortAndSharpRed],
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

    Arakni.must.playReaction(shortAndSharpRed, {
      modeIds: [modeId(shortAndSharpRed, "daggerAttack")],
    });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);

    game.helpers.resolveRestOfCombat();

    // The unblocked dagger deals its buffed 4 damage.
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
