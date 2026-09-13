import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { weaveEarthBlue } from "../actions/weave-earth.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { verdanceThornOfTheRose } from "../heroes/verdance-thorn-of-the-rose.ts";
import { staffOfVerdantShoots } from "./staff-of-verdant-shoots.ts";

describe("Staff of Verdant Shoots (ROS015) AAA", () => {
  it("happy: pitching Earth pays Amp 1 and go again; Embodiment waits on arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: verdanceThornOfTheRose,
        weapon1: [staffOfVerdantShoots],
        hand: [weaveEarthBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdanceThornOfTheRose);

    Verdance.activate(staffOfVerdantShoots);
    game.helpers.resolveUntilIdle({
      paymentCanonicalId: weaveEarthBlue.canonicalId,
    });
    expectFabPlayer(Verdance).toHaveAP(1);
    expectFabPlayer(Verdance).toHaveTokenCount("embodiment-of-earth", 0);
  });

  it("boundary: pitching a non-Earth card still amps but mints no Embodiment", () => {
    const game = FabTestEngine.start(
      {
        hero: verdanceThornOfTheRose,
        weapon1: [staffOfVerdantShoots],
        hand: [nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdanceThornOfTheRose);

    Verdance.activate(staffOfVerdantShoots);
    game.helpers.resolveUntilIdle({
      paymentCanonicalId: nimblismBlue.canonicalId,
    });
    expectFabPlayer(Verdance).toHaveAP(1);
    expectFabPlayer(Verdance).toHaveTokenCount("embodiment-of-earth", 0);
  });

  it("timing: a second activation this turn is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: verdanceThornOfTheRose,
        weapon1: [staffOfVerdantShoots],
        hand: [weaveEarthBlue],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdanceThornOfTheRose);

    Verdance.activate(staffOfVerdantShoots);
    game.untilIdle();
    expectFabPlayer(Verdance).toHaveAP(2);
    let rejected = false;
    try {
      Verdance.activate(staffOfVerdantShoots);
    } catch {
      rejected = true;
    }
    if (!rejected) {
      throw new Error("expected the once-per-turn staff activation to reject");
    }
  });
});
