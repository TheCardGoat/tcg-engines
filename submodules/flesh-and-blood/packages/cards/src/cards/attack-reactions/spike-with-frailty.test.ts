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
import { spikeWithFrailtyRed } from "./spike-with-frailty.ts";

/**
 * Spike with Frailty (OUT022) — Assassin Attack Reaction, cost 1.
 *
 * Printed: Target attack action card with stealth gains +3{p} and "When this
 * hits a hero, create a Frailty token under their control."
 */

describe("Spike with Frailty (OUT022) AAA", () => {
  it("happy: the stealth attack gets +3{p} and puts a Frailty token under the hit hero's control", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [malignRed, spikeWithFrailtyRed],
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
    Arakni.must.playReaction(spikeWithFrailtyRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Arakni, spikeWithFrailtyRed).toBeIn("graveyard");

    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 1);
  });

  it("boundary: cannot target a non-stealth attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [snatchRed, spikeWithFrailtyRed],
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
    expectFabUnplayable(() => Arakni.must.playReaction(spikeWithFrailtyRed));

    expectFabCard(Arakni, spikeWithFrailtyRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: +3{p} applies during the reaction step; the token is created only after the hit", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [malignRed, spikeWithFrailtyRed],
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
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 0);

    Arakni.must.playReaction(spikeWithFrailtyRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 0);

    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 1);
  });
});
