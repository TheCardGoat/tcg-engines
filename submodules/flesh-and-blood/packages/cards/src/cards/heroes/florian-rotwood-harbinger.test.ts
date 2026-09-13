import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { autumnSTouchBlue } from "../actions/autumn-s-touch.ts";
import { chorusOfRotwoodRed } from "../actions/chorus-of-rotwood.ts";
import { florianRotwoodHarbinger } from "./florian-rotwood-harbinger.ts";

/**
 * Florian, Rotwood Harbinger (ROS001) — Elemental Runeblade Hero.
 * Essence of Earth.
 *
 * Printed: If there are 8 or more Earth cards in your banished zone,
 * Florian gets "If you would create 1 or more aura tokens, instead create
 * that many plus 1 of each of those tokens."
 */

describe("Florian, Rotwood Harbinger (ROS001) AAA", () => {
  it("happy: with 8+ Earth cards banished, Runechant creation is amped plus 1", () => {
    const game = FabTestEngine.start(
      {
        hero: florianRotwoodHarbinger,
        hand: [chorusOfRotwoodRed],
        banished: [
          autumnSTouchBlue,
          autumnSTouchBlue,
          autumnSTouchBlue,
          autumnSTouchBlue,
          autumnSTouchBlue,
          autumnSTouchBlue,
          autumnSTouchBlue,
          autumnSTouchBlue,
        ],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Florian = game.as(florianRotwoodHarbinger);

    Florian.play(chorusOfRotwoodRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false }); // decline Decompose

    // Chorus prints 3 Runechants; Florian's threshold amps to 4.
    expectFabPlayer(Florian).toHaveTokenCount("runechant", 4);
  });

  it("boundary: below the 8-card threshold the creation stays printed", () => {
    const game = FabTestEngine.start(
      {
        hero: florianRotwoodHarbinger,
        hand: [chorusOfRotwoodRed],
        banished: [
          autumnSTouchBlue,
          autumnSTouchBlue,
          autumnSTouchBlue,
          autumnSTouchBlue,
          autumnSTouchBlue,
          autumnSTouchBlue,
          autumnSTouchBlue,
        ],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Florian = game.as(florianRotwoodHarbinger);

    Florian.play(chorusOfRotwoodRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Florian).toHaveTokenCount("runechant", 3);
    expectFabToken(game, "embodiment-of-earth").toHaveCount(0);
  });
});
