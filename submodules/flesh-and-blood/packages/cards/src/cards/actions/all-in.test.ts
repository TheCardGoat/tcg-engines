import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  expectWinner,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { allInRed } from "./all-in.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { headJabRed } from "./head-jab.ts";
import { nimblismBlue } from "./nimblism.ts";

/**
 * All In (MPW027) — Warrior Action, cost 0, go again.
 *
 * Printed: "The next time a sword you control attacks this turn, destroy all
 * Gold you control. The attack gets +2{p} for each Gold destroyed this way.
 * When the chain link resolves, if the attack didn't hit, you lose the game."
 */

describe("All In (MPW027) AAA", () => {
  it("happy: the sword attack destroys all Gold and gets +2 per Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [allInRed],
        arena: [fabToken("gold"), fabToken("gold")],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 30, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(allInRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail, { alternativeCostIndex: 0 });

    expectCombat(game).toHaveAttackPower(7);
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(23);
  });

  it("boundary: a non-sword attack destroys no Gold and gets no bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [allInRed, headJabRed],
        arena: [fabToken("gold"), fabToken("gold")],
        resourcePoints: 2,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 30, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(allInRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(headJabRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 2);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(27);
  });

  it("timing: a sword attack that fails to hit loses the game", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [allInRed],
        arena: [fabToken("gold")],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        life: 30,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(allInRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail, { alternativeCostIndex: 0 });
    expectCombat(game).toHaveAttackPower(5);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectWinner(game, dash);
    expectFabPlayer(Dash).toHaveLife(30);
  });
});
