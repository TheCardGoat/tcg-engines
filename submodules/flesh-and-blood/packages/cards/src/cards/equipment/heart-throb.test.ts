import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { heartThrob } from "./heart-throb.ts";

/**
 * Heart Throb (TCC052) — Bard Chest d0.
 *
 * Printed: Action - Destroy this: Each hero creates a Vigor token. Go again
 */

describe("Heart Throb (TCC052) AAA", () => {
  it("happy: destroying this gives each hero a Vigor token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heartThrob],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(heartThrob);
    game.passBoth();

    expectFabCard(Bravo, heartThrob).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 1).toHaveAP(1);
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 1);
  });

  it("boundary: the Action is illegal with 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heartThrob],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(heartThrob);
    expectFabCard(Bravo, heartThrob).toBeIn("chest");
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 0);
  });

  it("timing: both heroes' Vigor tokens are destroyed at the start of their next turns", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heartThrob],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(heartThrob);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 1);
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 1);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 0);
  });
});
