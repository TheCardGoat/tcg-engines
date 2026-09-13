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
import { figmentOfProtectionYellow } from "./figment-of-protection.ts";

/**
 * Figment of Protection (DTD007) — Light Illusionist Instant Figment, cost 4.
 * Printed: Legendary. When this enters the arena, create a Spectral Shield token.
 */

describe("Figment of Protection (DTD007) AAA", () => {
  it("happy: entering the arena creates a Spectral Shield token", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfProtectionYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfProtectionYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, figmentOfProtectionYellow).toBeIn("arena");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1);
  });

  it("boundary: the opponent receives none of the Spectral Shields", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfProtectionYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfProtectionYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("spectral-shield", 0);
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
        hand: [figmentOfProtectionYellow],
        resourcePoints: 4,
        deck: 6,
      },
    );
    game.as(dash).playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    game.as(prism).play(figmentOfProtectionYellow);

    expectFabCard(game.as(prism), figmentOfProtectionYellow).toBeIn("arena");
    expectFabPlayer(game.as(prism)).toHaveTokenCount("spectral-shield", 1);
  });
});
