import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { bucklingBlowRed } from "./buckling-blow.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { senseWeaknessBlue } from "./sense-weakness.ts";

describe("Sense Weakness (PEN021) AAA", () => {
  it("happy: the next Guardian attack this turn gets +1{p} and dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [senseWeaknessBlue, bucklingBlowRed],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(senseWeaknessBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.attackWith(bucklingBlowRed);
    expectCombat(game).toHaveAttackPower(9);
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundary: a Generic attack does not receive +1{p} or dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [senseWeaknessBlue, brutalAssaultBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(senseWeaknessBlue);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("dominate");
  });
});
