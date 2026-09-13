import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { evergreenRed } from "./evergreen.ts";

/**
 * Evergreen Red (ELE119) — Earth Attack Action.
 *
 * Printed: If Evergreen is played from arsenal, put it on the bottom of
 * its owner's deck when the combat chain closes.
 */

describe("Evergreen (ELE119) AAA", () => {
  it("happy: played from arsenal, it cycles to the deck bottom at chain close", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        arsenal: [evergreenRed],
        weapon1: [],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.attackWith(evergreenRed, { from: "arsenal" });
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(13); // 20 - 7
    expect(Oldhim.zone("deck")[0]).toBe(evergreenRed.canonicalId); // bottomed
  });
});
