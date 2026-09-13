import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { quickstep } from "./quickstep.ts";

/**
 * Quickstep (TCC054) — Bard Legs d0.
 *
 * Printed: Action - Destroy this: Each hero creates a Quicken token. Go again
 */

describe("Quickstep (TCC054) AAA", () => {
  it("happy: destroying this gives each hero a Quicken token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [quickstep],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(quickstep);
    game.passBoth();

    expectFabCard(Bravo, quickstep).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("quicken", 1).toHaveAP(1);
    expectFabPlayer(Dash).toHaveTokenCount("quicken", 1);
  });

  it("boundary: the Action is illegal with 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [quickstep],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(quickstep);
    expectFabCard(Bravo, quickstep).toBeIn("legs");
    expectFabPlayer(Bravo).toHaveTokenCount("quicken", 0);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("quicken", 0);
  });

  it("timing: Quickstep is an Action with go again — AP is refunded", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [quickstep],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(quickstep);
    game.passBoth();

    expectFabPlayer(Bravo).toHaveAP(1).toHaveTokenCount("quicken", 1);
  });
});
