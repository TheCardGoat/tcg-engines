import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { briar } from "../heroes/briar.ts";
import { snatchRed } from "./snatch.ts";
import { chorusOfRotwoodRed } from "./chorus-of-rotwood.ts";

/**
 * Chorus of Rotwood Red (PEN213) — Earth Runeblade Action.
 *
 * Printed: Decompose — You may banish 2 Earth cards and an action card from
 * your graveyard. If you do, create an Embodiment of Earth token.
 * Create 3 Runechant tokens.
 */

describe("Chorus of Rotwood (PEN213) AAA", () => {
  it("happy: paying Decompose creates the Embodiment on top of the 3 Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [chorusOfRotwoodRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(chorusOfRotwoodRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabPlayer(Briar).toHaveTokenCount("runechant", 3);
    expectFabToken(game, "embodiment-of-earth").toHaveCount(1);
    expect(Briar.zone("banished")).toHaveLength(3);
  });

  it("boundary: declining Decompose still creates the 3 Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [chorusOfRotwoodRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(chorusOfRotwoodRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Briar).toHaveTokenCount("runechant", 3);
    expectFabToken(game, "embodiment-of-earth").toHaveCount(0);
    expect(Briar.zone("banished")).toHaveLength(0);
  });
});
