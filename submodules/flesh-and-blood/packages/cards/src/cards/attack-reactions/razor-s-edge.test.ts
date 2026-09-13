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
import { snatchRed } from "../actions/snatch.ts";
import { malignRed } from "../actions/malign.ts";
import { razorSEdgeRed } from "./razor-s-edge.ts";

/**
 * Razor's Edge Red (ARA016) — Assassin Attack Reaction.
 *
 * Printed:
 *   Target attack action card with stealth gets +3{p}.
 */

describe("Razor's Edge (ARA016) AAA", () => {
  it("happy: target attack action with stealth gets +3", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [razorSEdgeRed, malignRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(razorSEdgeRed);
    game.passBoth();

    // Malign base 3 + 3 = 6.
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Arakni, razorSEdgeRed).toBeIn("graveyard");
  });

  it("boundary: cannot target a non-stealth attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [razorSEdgeRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expect(() => Arakni.must.playReaction(razorSEdgeRed)).toThrow();
    expectFabCard(Arakni, razorSEdgeRed).toBeIn("hand");
  });

  it("timing: +3 applies during the reaction step before damage", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [razorSEdgeRed, malignRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    expectCombat(game).toHaveAttackPower(3);

    Arakni.must.playReaction(razorSEdgeRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);

    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14);
  });
});
