import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { flockOfTheFeatherWalkersBlue } from "./flock-of-the-feather-walkers.ts";

describe("Flock of the Feather Walkers family AAA", () => {
  it("happy: a legal reveal creates Quicken on attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [flockOfTheFeatherWalkersBlue, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.attackWith(flockOfTheFeatherWalkersBlue);
    expectFabToken(game, "quicken").toHaveCount(1);
  });
  it("boundary: a hand without a cheap card cannot pay", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [flockOfTheFeatherWalkersBlue, brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expect(() => game.as(dash).playAttack(flockOfTheFeatherWalkersBlue)).toThrow();
    expectFabToken(game, "quicken").toHaveCount(0);
  });
  it("timing: playing without attacking creates no Quicken", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [flockOfTheFeatherWalkersBlue, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).play(flockOfTheFeatherWalkersBlue);
    expectFabToken(game, "quicken").toHaveCount(0);
  });
});
