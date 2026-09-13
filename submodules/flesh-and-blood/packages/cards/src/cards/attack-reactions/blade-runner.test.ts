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
import { dawnblade } from "../weapons/dawnblade.ts";
import { bladeRunnerRed } from "./blade-runner.ts";

/**
 * Blade Runner Red (EVR060) — Warrior Attack Reaction.
 *
 * Printed:
 *   Target 1H weapon attack gains go again.
 *   Your next weapon attack this turn gains +3{p}.
 */

describe("blade-runner family AAA", () => {
  it("happy: target 1H weapon attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [bladeRunnerRed],
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
    Kassai.must.playReaction(bladeRunnerRed);
    game.passBoth();

    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Kassai, bladeRunnerRed).toBeIn("graveyard");
  });

  it("boundary: cannot target a 2H weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [dawnblade],
        hand: [bladeRunnerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.activate(dawnblade);
    game.advanceCombatTo("reaction");

    expect(() => Kassai.must.playReaction(bladeRunnerRed)).toThrow();
  });
});
