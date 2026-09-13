import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malignRed } from "../actions/malign.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { snatchRed } from "../actions/snatch.ts";
import { spikeWithInertiaRed } from "./spike-with-inertia.ts";

/**
 * Spike with Inertia (OUT023) — Assassin Attack Reaction, cost 1.
 *
 * Printed: Target attack action card with stealth gains +3{p} and "When this
 * hits a hero, create an Inertia token under their control."
 */

describe("Spike with Inertia (OUT023) AAA", () => {
  it("happy: the stealth attack gets +3{p} and puts an Inertia token under the hit hero's control", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [malignRed, spikeWithInertiaRed],
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
    Arakni.must.playReaction(spikeWithInertiaRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Arakni, spikeWithInertiaRed).toBeIn("graveyard");

    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Dash).toHaveTokenCount("inertia", 1);
  });

  it("boundary: cannot target a non-stealth attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [snatchRed, spikeWithInertiaRed],
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
    expectFabUnplayable(() => Arakni.must.playReaction(spikeWithInertiaRed));

    expectFabCard(Arakni, spikeWithInertiaRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: +3{p} applies during the reaction step; the token is created only after the hit", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [malignRed, spikeWithInertiaRed],
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
    expectFabPlayer(Dash).toHaveTokenCount("inertia", 0);

    Arakni.must.playReaction(spikeWithInertiaRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Dash).toHaveTokenCount("inertia", 0);

    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Dash).toHaveTokenCount("inertia", 1);
  });
});
