import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { vigorGirth } from "./vigor-girth.ts";

/**
 * Vigor Girth (BET005) — Guardian/Warrior Chest d1 Blade Break.
 *
 * Printed: Action - Destroy this: Create a Vigor token. Go again
 */

describe("Vigor Girth (BET005) AAA", () => {
  it("happy: destroying this creates a Vigor token and refunds the Action AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [vigorGirth],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(vigorGirth);
    game.passBoth();

    expectFabCard(Bravo, vigorGirth).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 1).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("vigor", 0);
  });

  it("boundary: the Action is illegal with 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [vigorGirth],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(vigorGirth);
    expectFabCard(Bravo, vigorGirth).toBeIn("chest");
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
  });

  it("timing: the created Vigor is destroyed at the start of your next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [vigorGirth],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(vigorGirth);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 1);

    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
  });
});
