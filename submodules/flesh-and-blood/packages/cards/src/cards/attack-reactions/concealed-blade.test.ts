import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { malignRed } from "../actions/malign.ts";
import { snatchRed } from "../actions/snatch.ts";
import { concealedBladeBlue } from "./concealed-blade.ts";

/**
 * Concealed Blade Blue (OUT143) — Assassin / Ninja Attack Reaction.
 *
 * Printed: Target Assassin or Ninja attack action card gains +1{p} and
 * "When this hits, equip a dagger from your inventory."
 */

describe("Concealed Blade (OUT143) AAA", () => {
  it("happy: target Assassin attack action gains +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [malignRed, concealedBladeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(concealedBladeBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Arakni, concealedBladeBlue).toBeIn("graveyard");
  });

  it("boundary: cannot target a Generic attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [snatchRed, concealedBladeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expect(() => Arakni.must.playReaction(concealedBladeBlue)).toThrow();
    expectFabCard(Arakni, concealedBladeBlue).toBeIn("hand");
  });

  it("timing: the +1 is on the chain before damage", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [malignRed, concealedBladeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    expectCombat(game).toHaveAttackPower(3);
    Arakni.must.playReaction(concealedBladeBlue);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
  });
});
