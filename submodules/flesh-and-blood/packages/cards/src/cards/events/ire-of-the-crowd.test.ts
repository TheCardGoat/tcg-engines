import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ireOfTheCrowd } from "./ire-of-the-crowd.ts";

/**
 * Ire of the Crowd (SMP026) — Event.
 *
 * Printed: "At the beginning of your end phase, if you didn't hit a hero this
 * turn, lose 2{h}."
 *
 * The end-phase gate is authored as the supported negation of the controller's
 * typed `hit` turn-history event.
 */

describe("Ire of the Crowd (SMP026) AAA", () => {
  it("happy: without a hero hit this turn, the controller loses 2 life", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [ireOfTheCrowd], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveLife(18);
  });

  it("boundary: hitting a hero this turn prevents the life loss", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [ireOfTheCrowd], hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // The positive gate branch is reachable: snatch connects unblocked.
    Bravo.attackWith(snatchRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Bravo).toHaveLife(20);

    Bravo.endTurn();
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: the end-phase penalty resolves only for a no-hit turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [ireOfTheCrowd], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveLife(18);
  });
});
