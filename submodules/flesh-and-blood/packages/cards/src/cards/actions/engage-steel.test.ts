import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { valiantThrustYellow } from "./valiant-thrust.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { engageSteelRed } from "./engage-steel.ts";

/**
 * Engage Steel, Red (MPW106) — Warrior Action, cost 0, go again.
 *
 * Printed: "Your next sword attack this turn gets +3{p} and "If this is
 * defended by a Warrior card, this gets +1{p}."\nGo again"
 */

describe("Engage Steel (MPW106) AAA", () => {
  it("happy: the sword attack gets +3 and +1 more when defended by a Warrior card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [engageSteelRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [valiantThrustYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(engageSteelRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1); // printed go again
    Bravo.activateAttack(goldenGrail);

    Dash.defendWith(valiantThrustYellow);
    game.passBoth(); // resolves the Warrior-defended trigger layer
    expectCombat(game).toHaveAttackPower(7); // 3 base + 3 printed + 1 Warrior-defended
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(16); // 7 - 3{d} = 4 damage
  });

  it("boundary: a non-Warrior defender card leaves only the printed +3", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [engageSteelRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [woundingBlowBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(engageSteelRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);

    Dash.defendWith(woundingBlowBlue);
    expectCombat(game).toHaveAttackPower(6); // 3 base + 3 printed, no +1
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17); // 6 - 3{d} = 3 damage
  });
});
