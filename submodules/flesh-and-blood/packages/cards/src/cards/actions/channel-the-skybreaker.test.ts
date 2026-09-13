import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { evergreenRed as evergreen } from "./evergreen.ts";
import { channelTheSkybreakerYellow } from "./channel-the-skybreaker.ts";

/**
 * Channel the Skybreaker (PEN217) — Earth Action Aura, cost 2.
 * Printed: Go again. When this enters the arena and at the beginning of your
 * action phase, create 2 Might tokens. Channel Earth — At the beginning of
 * your end phase, put a flow counter on this, then destroy it unless you put
 * an Earth card from your pitch zone on the bottom of your deck for each flow
 * counter on it.
 */

describe("Channel the Skybreaker (PEN217) AAA", () => {
  it("happy: entering the arena creates 2 Might tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [channelTheSkybreakerYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(channelTheSkybreakerYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Oldhim, channelTheSkybreakerYellow).toBeIn("arena");
    expectFabPlayer(Oldhim).toHaveTokenCount("might", 2);
    expectFabPlayer(Oldhim).toHaveAP(1);
  });

  it("boundary: the opponent receives none of the Might tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [channelTheSkybreakerYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(oldhim).play(channelTheSkybreakerYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
  });

  it("timing: at the beginning of your next action phase create 2 more Might tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [channelTheSkybreakerYellow],
        pitch: [evergreen],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(channelTheSkybreakerYellow);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Oldhim).toHaveTokenCount("might", 2);

    Oldhim.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: true });
    expectFabCard(Oldhim, channelTheSkybreakerYellow).toBeIn("arena");

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Oldhim, channelTheSkybreakerYellow).toBeIn("arena");
    // Start-of-turn Might destroy (CR 8.6.17) consumes the enter-arena pair;
    // the action-phase trigger mints a fresh pair.
    expectFabPlayer(Oldhim).toHaveTokenCount("might", 2);
  });
});
