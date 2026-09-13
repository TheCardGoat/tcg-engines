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
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { snatchRed } from "../actions/snatch.ts";
import { gleamOfTheBladeRed } from "./gleam-of-the-blade.ts";

/**
 * Gleam of the Blade Red (AHA008) — Warrior Attack Reaction.
 *
 * Printed:
 *   Target weapon attack gets +3{p}.
 *   Instant - Discard this: Create a Flurry token.
 */

describe("Gleam of the Blade (AHA008) family AAA", () => {
  it("happy: target weapon attack gets +3 power", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [gleamOfTheBladeRed],
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
    Kassai.must.playReaction(gleamOfTheBladeRed);
    game.passBoth();

    // Cintari Saber base 2 + 3 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Kassai, gleamOfTheBladeRed).toBeIn("graveyard");
  });

  it("boundary: cannot play targeting a non-weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [gleamOfTheBladeRed, snatchRed],
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

    expectFabUnplayable(() => Kassai.must.playReaction(gleamOfTheBladeRed));
    expectFabCard(Kassai, gleamOfTheBladeRed).toBeIn("hand");
  });

  it("interaction: Instant discard creates a Flurry token", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [gleamOfTheBladeRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(gleamOfTheBladeRed, {
      abilityId: `${gleamOfTheBladeRed.canonicalId}:discardFlurry`,
    });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kassai).toHaveTokenCount("flurry", 1);
    expectFabCard(Kassai, gleamOfTheBladeRed).toBeIn("graveyard");
  });
});
