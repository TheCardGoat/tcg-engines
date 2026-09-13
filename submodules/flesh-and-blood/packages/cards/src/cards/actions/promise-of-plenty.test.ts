import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { promiseOfPlentyRed } from "./promise-of-plenty.ts";

describe("Promise of Plenty (CRU183) AAA", () => {
  it("happy: leftover AP after close at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arsenal: [promiseOfPlentyRed],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(promiseOfPlentyRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(game.as(bravo)).toHaveLife(17);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: a miss deals no damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [promiseOfPlentyRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(promiseOfPlentyRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: playing from hand does not grant leftover AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [promiseOfPlentyRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(promiseOfPlentyRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
