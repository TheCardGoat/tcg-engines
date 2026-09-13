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
import { malignRed } from "../actions/malign.ts";
import { snatchRed } from "../actions/snatch.ts";
import { spikeWithBloodrotRed } from "./spike-with-bloodrot.ts";

/**
 * Spike with Bloodrot Red (ARA018) — Assassin Attack Reaction.
 *
 * Printed:
 *   Target attack action card with stealth gains +3{p} and "When this hits
 *   a hero, create a Bloodrot Pox token under their control."
 */

describe("Spike with Bloodrot (ARA018) AAA", () => {
  it("happy: the stealth attack gets +3{p} and puts a Bloodrot Pox token under the hit hero's control", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [malignRed, spikeWithBloodrotRed],
        resourcePoints: 1,
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
    Arakni.must.playReaction(spikeWithBloodrotRed);
    game.passBoth();

    // Malign base 3 + 3 = 6.
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Arakni, spikeWithBloodrotRed).toBeIn("graveyard");

    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 1);
  });

  it("boundary: cannot target a non-stealth attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [snatchRed, spikeWithBloodrotRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expect(() => Arakni.must.playReaction(spikeWithBloodrotRed)).toThrow();
    expectFabCard(Arakni, spikeWithBloodrotRed).toBeIn("hand");
  });

  it("timing: +3{p} applies during the reaction step, the token only after the hit", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [malignRed, spikeWithBloodrotRed],
        resourcePoints: 1,
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
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 0);

    Arakni.must.playReaction(spikeWithBloodrotRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 0);

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 1);
  });
});
