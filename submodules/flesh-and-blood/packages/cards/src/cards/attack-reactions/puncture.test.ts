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
import { punctureRed } from "./puncture.ts";

/**
 * Puncture Red (DYN079) — Warrior Attack Reaction.
 *
 * Printed:
 *   Target sword or dagger attack gains +3{p} and piercing 1.
 */

describe("puncture family AAA", () => {
  it("happy: sword attack gains +3 power and piercing", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [punctureRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(punctureRed);
    game.passBoth();

    // Cintari Saber base 2 + 3 = 5, plus piercing.
    expectCombat(game).toHaveAttackPower(5);
    expectCombat(game).toHaveKeyword("piercing");
    expectFabCard(Kassai, punctureRed).toBeIn("graveyard");
  });

  it("boundary: cannot target a non-sword, non-dagger attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [punctureRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expect(() => Kassai.must.playReaction(punctureRed)).toThrow();
  });
});
