import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { twoStepsAheadBlue } from "./two-steps-ahead.ts";

/**
 * Two Steps Ahead (SUP075) — Reviled Guardian Aura.
 *
 * Printed: At the start of your turn, destroy this, then create a Confidence
 * and 3 Might tokens.
 */

describe("Two Steps Ahead (SUP075) AAA", () => {
  it("happy: start-of-turn destroy then create a Confidence and 3 Might", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: bravo, arena: [twoStepsAheadBlue], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(game.as(bravo), twoStepsAheadBlue).toBeIn("graveyard");
    expectFabPlayer(game.as(bravo)).toHaveTokenCount("confidence", 1).toHaveTokenCount("might", 3);
  });

  it("boundary: no tokens if the aura never reaches your start phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [twoStepsAheadBlue], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(bravo), twoStepsAheadBlue).toBeIn("arena");
    expectFabPlayer(game.as(bravo)).toHaveTokenCount("confidence", 0);
    expectFabPlayer(game.as(bravo)).toHaveTokenCount("might", 0);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [twoStepsAheadBlue], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).endTurn();
    game.untilIdle();
    expectFabCard(game.as(bravo), twoStepsAheadBlue).toBeIn("arena");
    expectFabPlayer(game.as(bravo)).toHaveTokenCount("might", 0);
  });
});
