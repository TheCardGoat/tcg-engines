import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { flatTrackers } from "./flat-trackers.ts";

/**
 * Flat Trackers (HVY155) — Brute/Warrior Legs d1 Blade Break.
 *
 * Printed: Action - Destroy this: Create an Agility token. Go again
 */

describe("Flat Trackers (HVY155) AAA", () => {
  it("happy: destroying this creates an Agility token and refunds the Action AP", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [flatTrackers],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(flatTrackers);
    game.passBoth();

    expectFabCard(Rhinar, flatTrackers).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 1).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("agility", 0);
  });

  it("boundary: the Action is illegal with 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [flatTrackers],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.expectActivationRejected(flatTrackers);
    expectFabCard(Rhinar, flatTrackers).toBeIn("legs");
    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 0);
  });

  it("timing: the created Agility is destroyed at the start of your next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [flatTrackers],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.activate(flatTrackers);
    game.passBoth();
    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 1);

    Rhinar.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 0);
  });
});
