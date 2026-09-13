import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { gauntletOfMight } from "./gauntlet-of-might.ts";

/**
 * Gauntlet of Might (BET006) — Brute/Guardian Arms d1 Blade Break.
 *
 * Printed: Action - Destroy this: Create a Might token. Go again
 */

describe("Gauntlet of Might (BET006) AAA", () => {
  it("happy: destroying this creates a Might token and refunds the Action AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletOfMight],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(gauntletOfMight);
    game.passBoth();

    expectFabCard(Bravo, gauntletOfMight).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
  });

  it("boundary: the Action is illegal with 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletOfMight],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(gauntletOfMight);
    expectFabCard(Bravo, gauntletOfMight).toBeIn("arms");
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
  });

  it("timing: the created Might is destroyed at the start of your next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletOfMight],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(gauntletOfMight);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);

    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
  });
});
