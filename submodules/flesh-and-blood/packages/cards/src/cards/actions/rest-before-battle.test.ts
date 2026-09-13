import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { restBeforeBattleYellow } from "./rest-before-battle.ts";

/**
 * Rest Before Battle, Yellow (MPW067) — Warrior Action - Aura, cost 0.
 *
 * Printed: "Play this only if you've attacked with a weapon this turn.\nAt the
 * start of your turn, destroy this and draw a card."
 */

describe("Rest Before Battle (MPW067) AAA", () => {
  it("happy: after a weapon attack the aura enters, then draws at the next start of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [restBeforeBattleYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 12,
      },
      { hero: dash, hand: [], life: 20, deck: 12 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(goldenGrail);
    game.helpers.resolveRestOfCombat();
    game.untilIdle();

    Bravo.play(restBeforeBattleYellow);
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveAP(0);
    expectFabCard(Bravo, restBeforeBattleYellow).toBeIn("arena");

    Bravo.endTurn();
    game.as(dash).endTurn();
    game.untilIdle();
    // Turn-1 end phase drew Bravo up to intellect; the start of Bravo's next
    // turn destroyed the aura and drew one more on top.
    expectFabPlayer(Bravo).toHaveHandCount(5);
    expectFabCard(Bravo, restBeforeBattleYellow).toBeIn("graveyard");
  });

  it("boundary: without a weapon attack this turn the aura cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [restBeforeBattleYellow],
        actionPoints: 1,
        deck: 12,
      },
      { hero: dash, hand: [], life: 20, deck: 12 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabUnplayable(
      () => Bravo.play(restBeforeBattleYellow),
      /play condition is not satisfied/,
    );
    expectFabCard(Bravo, restBeforeBattleYellow).toBeIn("hand");
    expectWait(game).toBeIdle();
  });

  it("timing: after attacking on the previous turn only, the play window has closed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [restBeforeBattleYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 12,
      },
      { hero: dash, hand: [], life: 20, deck: 12 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(goldenGrail);
    game.helpers.resolveRestOfCombat();
    game.untilIdle();
    Bravo.endTurn();
    // Dash's turn passes without Bravo attacking; on Bravo's next turn the
    // play restriction no longer sees a weapon attack this turn.
    game.as(dash).endTurn();
    expectFabUnplayable(
      () => Bravo.play(restBeforeBattleYellow),
      /play condition is not satisfied/,
    );
    expectFabCard(Bravo, restBeforeBattleYellow).toBeIn("hand");
  });
});
