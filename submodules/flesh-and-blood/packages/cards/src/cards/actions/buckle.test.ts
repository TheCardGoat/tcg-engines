import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { bucklingBlowRed } from "./buckling-blow.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { buckleBlue } from "./buckle.ts";

/**
 * Buckle (DYN028) — Guardian Action, cost 3, 3{d}, go again.
 *
 * Printed: 'Your next Guardian attack this turn gains +1{p}, dominate, and
 * "When this hits a hero, destroy an equipment they control with a -1{d}
 * counter on it."\nGo again'
 */

describe("Buckle (DYN028) AAA", () => {
  it("happy: the next Guardian attack this turn gains +1{p} and dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [buckleBlue, bucklingBlowRed],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(buckleBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.attackWith(bucklingBlowRed);
    expectCombat(game).toHaveAttackPower(9);
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundary: a Generic attack does not receive +1{p} or dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [buckleBlue, brutalAssaultBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(buckleBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Bravo.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("timing: go again refunds the action point spent to play Buckle", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [buckleBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(buckleBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
