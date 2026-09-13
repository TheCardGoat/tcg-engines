import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { ritesOfNightfallBlue } from "./rites-of-nightfall.ts";

/**
 * Rites of Nightfall, Blue — Shadow Action, cost 1, go again.
 *
 * Printed: "Create a Gate to i'Arathael token.\nGo again"
 */

describe("Rites of Nightfall AAA", () => {
  it("happy: playing this creates a Gate and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [ritesOfNightfallBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(ritesOfNightfallBlue);
    game.untilIdle();

    expectFabPlayer(Chane).toHaveAP(1).toHaveTokenCount("gate-to-i-arathael", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("gate-to-i-arathael", 0);
  });

  it("boundary: without playing this, neither hero has a Gate", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [ritesOfNightfallBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabPlayer(game.as(chane)).toHaveTokenCount("gate-to-i-arathael", 0);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("gate-to-i-arathael", 0);
  });
});
