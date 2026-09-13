import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { figmentOfEruditionYellow } from "./figment-of-erudition.ts";

/**
 * Figment of Erudition (DTD005) — Light Illusionist Instant Figment, cost 4.
 * Printed: Legendary. When this enters the arena, create a Ponder token.
 */

describe("Figment of Erudition (DTD005) AAA", () => {
  it("happy: entering the arena creates a Ponder token", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfEruditionYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfEruditionYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, figmentOfEruditionYellow).toBeIn("arena");
    expectFabPlayer(Prism).toHaveTokenCount("ponder", 1);
  });

  it("boundary: the opponent receives none of the Ponder tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfEruditionYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfEruditionYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("ponder", 0);
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
        hand: [figmentOfEruditionYellow],
        resourcePoints: 4,
        deck: 6,
      },
    );
    game.as(dash).playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    game.as(prism).play(figmentOfEruditionYellow);

    expectFabCard(game.as(prism), figmentOfEruditionYellow).toBeIn("arena");
    expectFabPlayer(game.as(prism)).toHaveTokenCount("ponder", 1);
  });
});
