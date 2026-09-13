import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { fiddleDee } from "./fiddle-dee.ts";

/**
 * Fiddle Dee (TCC053) — Bard Arms d0.
 *
 * Printed: Action - Destroy this: Each hero creates a Might token. Go again
 */

describe("Fiddle Dee (TCC053) AAA", () => {
  it("happy: destroying this gives each hero a Might token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fiddleDee],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(fiddleDee);
    game.passBoth();

    expectFabCard(Bravo, fiddleDee).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1).toHaveAP(1);
    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
  });

  it("boundary: the Action is illegal with 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fiddleDee],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(fiddleDee);
    expectFabCard(Bravo, fiddleDee).toBeIn("arms");
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
  });

  it("timing: both heroes' Might tokens exist until start of their next turns", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fiddleDee],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(fiddleDee);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabPlayer(Dash).toHaveTokenCount("might", 1);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
  });
});
