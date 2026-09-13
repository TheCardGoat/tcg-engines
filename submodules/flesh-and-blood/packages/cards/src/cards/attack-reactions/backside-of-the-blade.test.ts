import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { snatchRed } from "../actions/snatch.ts";
import { backsideOfTheBladeBlue } from "./backside-of-the-blade.ts";

/**
 * Backside of the Blade Blue (AHA019) — Warrior Attack Reaction.
 *
 * Printed:
 *   Target weapon attack gets +1{p}. If it has go again, you may attack an
 *   additional time with the weapon this turn.
 */

describe("Backside of the Blade (AHA019) AAA", () => {
  it("happy: target weapon attack gets +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [backsideOfTheBladeBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(backsideOfTheBladeBlue);
    game.passBoth();

    // Cintari Saber base 2 + 1 = 3. No go again, so no extra-attack offer.
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).notToHaveKeyword("go-again");
    expectFabCard(Kassai, backsideOfTheBladeBlue).toBeIn("graveyard");
  });

  it("boundary: cannot play targeting a non-weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [backsideOfTheBladeBlue, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expect(() => Kassai.must.playReaction(backsideOfTheBladeBlue)).toThrow();
  });
});
