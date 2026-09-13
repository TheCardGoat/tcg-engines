import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { chorusOfRotwoodRed } from "../actions/chorus-of-rotwood.ts";
import { tremorOfAnticipation } from "./tremor-of-anticipation.ts";

/**
 * Tremor of Anticipation (SMP032) — Event.
 *
 * Printed: Until end of turn, if any hero would create 1 or more tokens,
 * instead they create that many plus 1 of each of those tokens.
 * Create a Gold token.
 */

describe("Tremor of Anticipation (SMP032) AAA", () => {
  it("happy+pin: the token amp applies (4 Runechants); the Event's own Gold creation is inert", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arena: [tremorOfAnticipation],
        hand: [chorusOfRotwoodRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(chorusOfRotwoodRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false }); // decline Decompose

    // Chorus prints 3 Runechants; the Event amps to 4.
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 4);
    // PIN: "Create a Gold token" never fires — seated Events do not resolve,
    // so their discrete creation legs are inert (§5 engine/event-seated-create-inert).
    expectFabToken(game, "gold").toHaveCount(0);
  });

  it("boundary: without the Event the creation stays printed", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [chorusOfRotwoodRed],
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
    expectFabToken(game, "gold").toHaveCount(0);
  });
});
