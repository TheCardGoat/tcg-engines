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
import { figmentOfWarYellow } from "./figment-of-war.ts";

/**
 * Figment of War (DTD012) — Light Illusionist Instant Figment, cost 4.
 * Printed: Legendary. When this enters the arena, create a Courage token.
 */

describe("Figment of War (DTD012) AAA", () => {
  it("happy: entering the arena creates a Courage token", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfWarYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfWarYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, figmentOfWarYellow).toBeIn("arena");
    expectFabPlayer(Prism).toHaveTokenCount("courage", 1);
  });

  it("boundary: the opponent receives none of the Courage tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfWarYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfWarYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("courage", 0);
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
        hand: [figmentOfWarYellow],
        resourcePoints: 4,
        deck: 6,
      },
    );
    game.as(dash).playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    game.as(prism).play(figmentOfWarYellow);

    expectFabCard(game.as(prism), figmentOfWarYellow).toBeIn("arena");
    expectFabPlayer(game.as(prism)).toHaveTokenCount("courage", 1);
  });
});
