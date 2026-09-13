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
import { bladeFlurryRed } from "./blade-flurry.ts";

/**
 * Blade Flurry Red (HVY101) — Warrior Attack Reaction.
 *
 * Printed:
 *   Target weapon attack gets +2{p}.
 *   Your next weapon attack this turn gets +2{p}.
 */

describe("Blade Flurry (HVY101) family AAA", () => {
  it("happy: target weapon attack gets +2 power", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [bladeFlurryRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(bladeFlurryRed);
    game.passBoth();

    // Cintari Saber base 2 + Blade Flurry 2 = 4.
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, bladeFlurryRed).toBeIn("graveyard");
  });

  it("boundary: cannot play targeting a non-weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [bladeFlurryRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expect(() => Kassai.must.playReaction(bladeFlurryRed)).toThrow();
  });
});
