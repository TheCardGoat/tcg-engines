import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { mightyWindupRed } from "./mighty-windup.ts";

/**
 * Mighty Windup (HVY143) — Brute/Guardian Attack Action, Red.
 *
 * Printed: Instant - Discard this: Create a Might token.
 */

describe("Mighty Windup family AAA", () => {
  it("happy: Instant discard from hand creates a Might token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [mightyWindupRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(mightyWindupRed);
    game.passBoth();

    expectFabCard(Bravo, mightyWindupRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
  });

  it("boundary: cannot activate a second time after the card is discarded", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [mightyWindupRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(mightyWindupRed);
    game.passBoth();
    Bravo.expectActivationRejected(mightyWindupRed);

    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
  });

  it("timing: Instant spends no AP; Might is destroyed at the start of your next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [mightyWindupRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(mightyWindupRed);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveAP(1).toHaveTokenCount("might", 1);

    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
  });
});
