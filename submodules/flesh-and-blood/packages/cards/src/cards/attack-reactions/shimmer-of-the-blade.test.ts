import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { snatchRed } from "../actions/snatch.ts";
import { shimmerOfTheBladeRed } from "./shimmer-of-the-blade.ts";

/**
 * Shimmer of the Blade (MPW051) — Warrior Attack Reaction, cost 1, 2{d}.
 *
 * Printed:
 *   Target weapon attack gets +3{p}.
 *   Instant - Discard this: Create a Blade Dance token.
 */

describe("Shimmer of the Blade (MPW051) AAA", () => {
  it("happy: target weapon attack gets +3 power", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [shimmerOfTheBladeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activateAttack(cintariSaber);
    game.toReaction("attacker");
    Kassai.must.playReaction(shimmerOfTheBladeRed);
    game.passBoth();

    // Cintari Saber base 2 + 3 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Kassai, shimmerOfTheBladeRed).toBeIn("graveyard");
  });

  it("boundary: cannot play targeting a non-weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [shimmerOfTheBladeRed, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.playAttack(snatchRed);
    game.toReaction("attacker");

    expectFabUnplayable(() => Kassai.must.playReaction(shimmerOfTheBladeRed));
    expectFabCard(Kassai, shimmerOfTheBladeRed).toBeIn("hand");
  });

  it("interaction: Instant discard creates a Blade Dance token", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [shimmerOfTheBladeRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(shimmerOfTheBladeRed, {
      abilityId: `${shimmerOfTheBladeRed.canonicalId}:discardBladeDance`,
    });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kassai).toHaveTokenCount("blade-dance", 1);
    expectFabCard(Kassai, shimmerOfTheBladeRed).toBeIn("graveyard");
  });
});
