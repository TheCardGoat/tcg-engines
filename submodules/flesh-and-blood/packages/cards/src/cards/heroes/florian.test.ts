import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { florian } from "./florian.ts";
import { autumnSTouchBlue } from "../actions/autumn-s-touch.ts";
import { chorusOfRotwoodRed } from "../actions/chorus-of-rotwood.ts";
import { rotwoodReaper } from "../weapons/rotwood-reaper.ts";

/**
 * Hero behavior acceptance test — Florian (FLR001).
 *
 * Printed: If there are 4 or more Earth cards in your banished zone, Florian
 * gets "If you would create 1 or more aura tokens, instead create that many
 * plus 1 of each of those tokens."
 */

const opponentHero = dash;

const fourEarth = [autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue];

describe("florian (FLR001) AAA", () => {
  it("happy: with 4+ Earth cards banished, Runechant creation is amped plus 1", () => {
    const game = FabTestEngine.start(
      {
        hero: florian,
        hand: [chorusOfRotwoodRed],
        banished: fourEarth,
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Florian = game.as(florian);

    Florian.play(chorusOfRotwoodRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false }); // decline Decompose

    // Chorus prints 3 Runechants; Florian's threshold amps that many plus 1 → 4.
    expectFabPlayer(Florian).toHaveTokenCount("runechant", 4);
  });

  it("boundary: below the 4-card threshold the creation stays printed", () => {
    const game = FabTestEngine.start(
      {
        hero: florian,
        hand: [chorusOfRotwoodRed],
        banished: [autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Florian = game.as(florian);

    Florian.play(chorusOfRotwoodRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Florian).toHaveTokenCount("runechant", 3);
    expectFabToken(game, "embodiment-of-earth").toHaveCount(0);
  });

  it("signature weapon: Rotwood Reaper (FLR002) can attack for 2{r} with base power 2", () => {
    const game = FabTestEngine.start(
      {
        hero: florian,
        weapon1: [rotwoodReaper],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Florian = game.as(florian);

    Florian.activate(rotwoodReaper);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(2);
  });
});
