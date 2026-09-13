import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { figmentOfRavagesYellow } from "./figment-of-ravages.ts";

/**
 * Figment of Ravages (DTD008) — Light Illusionist Instant Figment, cost 4.
 * Printed: Legendary. When this enters the arena, deal 1 arcane damage to any
 * target.
 */

describe("Figment of Ravages (DTD008) AAA", () => {
  it("happy: entering the arena deals 1 arcane to the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfRavagesYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfRavagesYellow);
    game.passBoth();
    Prism.target(game.as(dash));
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, figmentOfRavagesYellow).toBeIn("arena");
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });

  it("boundary: without this in play the opposing hero is not pinged", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: may be played in the reaction window", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: prism,
        hand: [figmentOfRavagesYellow],
        resourcePoints: 4,
        deck: 6,
      },
    );
    game.as(dash).playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    game.as(prism).play(figmentOfRavagesYellow);
    game.as(prism).target(game.as(dash));
    game.helpers.resolveUntilIdle();

    expectFabCard(game.as(prism), figmentOfRavagesYellow).toBeIn("arena");
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });
});
