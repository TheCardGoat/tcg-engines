import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";

import { nimblismBlue } from "./nimblism.ts";
import { lifeForALifeRed } from "./life-for-a-life.ts";

describe("Life for a Life (ARC164) AAA", () => {
  it("happy: leftover AP after close and gain 1{h} on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: 10,
        hand: [lifeForALifeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(lifeForALifeRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(16);
    expectFabPlayer(Dash).toHaveLife(11).toHaveAP(1);
  });

  it("boundary: a miss does not gain life", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: 10,
        hand: [lifeForALifeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(lifeForALifeRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Dash).toHaveLife(10);
  });

  it("timing: equal life does not grant leftover AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: 20,
        hand: [lifeForALifeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(lifeForALifeRed);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
