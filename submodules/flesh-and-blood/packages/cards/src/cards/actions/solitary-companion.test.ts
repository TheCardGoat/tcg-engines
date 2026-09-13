import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { solitaryCompanionRed } from "./solitary-companion.ts";

/**
 * Solitary Companion (MST149) — Illusionist Action Aura, cost 0.
 * Printed: When this enters the arena, if you control no other Illusionist
 * auras, create a Spectral Shield token. Ward 3.
 */

describe("Solitary Companion (MST149) AAA", () => {
  it("happy: entering the arena with no other Illusionist aura creates a Spectral Shield", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [solitaryCompanionRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(solitaryCompanionRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, solitaryCompanionRed).toBeIn("arena");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1);
  });

  it("boundary: controlling another Illusionist aura creates no Spectral Shield", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [solitaryCompanionRed],
        hand: [solitaryCompanionRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(solitaryCompanionRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });

  it("boundary: the opponent receives none of the Spectral Shields", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [solitaryCompanionRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prism).play(solitaryCompanionRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("spectral-shield", 0);
  });
});
