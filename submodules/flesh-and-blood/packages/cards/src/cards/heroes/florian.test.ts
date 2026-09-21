import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { florianRotwoodHarbinger } from "./florian-rotwood-harbinger.ts";
import { riptide } from "./riptide.ts";
import { takeTheBaitRed } from "../actions/take-the-bait.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
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

// Runtime identity interaction; the Florian specialization fixture excludes deck construction.
describe("Florian aura creation identity", () => {
  for (const { label, hero, threshold } of [
    { label: "Florian", hero: florian, threshold: 4 },
    { label: "Florian Rotwood Harbinger", hero: florianRotwoodHarbinger, threshold: 8 },
  ]) {
    it(`${label} increases tokens he creates under opposing control`, () => {
      const game = FabTestEngine.start(
        {
          hero,
          hand: [takeTheBaitRed],
          banished: Array.from({ length: threshold }, () => autumnSTouchBlue),
          deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        { hero: dash, hand: [], deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue] },
        FAB_MANUAL_HARNESS,
      );
      game.as(hero).play(takeTheBaitRed);
      game.untilIdle({ entityTargets: "minimum" });
      expectFabPlayer(game.as(dash)).toHaveTokenCount("bait", 2);
      expectFabPlayer(game.as(hero)).toHaveTokenCount("bait", 0).toHaveAP(1);
    });
    it(`${label} does not increase tokens merely received from an opponent`, () => {
      const game = FabTestEngine.start(
        {
          hero: riptide,
          hand: [takeTheBaitRed],
          deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        {
          hero,
          hand: [],
          banished: Array.from({ length: threshold }, () => autumnSTouchBlue),
          deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        FAB_MANUAL_HARNESS,
      );
      game.as(riptide).play(takeTheBaitRed);
      game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
      expectFabPlayer(game.as(hero)).toHaveTokenCount("bait", 1);
      expectFabPlayer(game.as(riptide)).toHaveTokenCount("bait", 0).toHaveAP(1);
    });
  }
});
