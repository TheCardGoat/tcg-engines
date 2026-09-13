import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { figmentOfTenacityYellow } from "./figment-of-tenacity.ts";

/**
 * Figment of Tenacity (DTD010) — Light Illusionist Instant Figment, cost 4.
 * Printed: Legendary. When this enters the arena, your next attack this turn
 * gets dominate.
 */

describe("Figment of Tenacity (DTD010) AAA", () => {
  it("happy: entering the arena grants dominate to your next attack this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfTenacityYellow, snatchRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfTenacityYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Prism, figmentOfTenacityYellow).toBeIn("arena");

    Prism.playAttack(snatchRed);
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundary: without this in play a later attack does not have dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prism).playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("dominate");
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
        hand: [figmentOfTenacityYellow],
        resourcePoints: 4,
        deck: 6,
      },
    );
    game.as(dash).playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    game.as(prism).play(figmentOfTenacityYellow);

    expectFabCard(game.as(prism), figmentOfTenacityYellow).toBeIn("arena");
  });
});
