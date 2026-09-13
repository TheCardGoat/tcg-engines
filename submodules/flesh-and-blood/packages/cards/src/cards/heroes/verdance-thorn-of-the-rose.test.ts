import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { weaveEarthBlue } from "../actions/weave-earth.ts";
import { healingBalmBlue } from "../actions/healing-balm.ts";
import { verdanceThornOfTheRose } from "./verdance-thorn-of-the-rose.ts";

const eightEarth = [
  weaveEarthBlue,
  weaveEarthBlue,
  weaveEarthBlue,
  weaveEarthBlue,
  weaveEarthBlue,
  weaveEarthBlue,
  weaveEarthBlue,
  weaveEarthBlue,
];

describe("Verdance, Thorn of the Rose (ROS013) AAA", () => {
  it("happy: 8 Earth in banished lets a gain-{h} ping 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: verdanceThornOfTheRose,
        hand: [healingBalmBlue],
        banished: eightEarth,
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdanceThornOfTheRose);
    const Dash = game.as(dash);

    Verdance.play(healingBalmBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabPlayer(Verdance).toHaveLife(41);
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: 7 Earth in banished does not ping on gain-{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: verdanceThornOfTheRose,
        hand: [healingBalmBlue],
        banished: eightEarth.slice(1),
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdanceThornOfTheRose);

    Verdance.play(healingBalmBlue);
    game.untilIdle();

    expectFabPlayer(Verdance).toHaveLife(41);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: gain-{h} on the opponent's turn does not ping", () => {
    const game = FabTestEngine.start(
      {
        hero: verdanceThornOfTheRose,
        banished: eightEarth,
        life: 40,
        deck: 6,
      },
      {
        hero: dash,
        hand: [healingBalmBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdanceThornOfTheRose);
    const Dash = game.as(dash);

    Verdance.endTurn();
    Dash.play(healingBalmBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(21);
    expectFabPlayer(Verdance).toHaveLife(40);
  });
});
