import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { risingSpeedRed } from "./rising-speed.ts";

/**
 * Rising Speed, Red (HVY166) — go again if you've drawn a card this turn.
 */

describe("Rising Speed family AAA", () => {
  it("happy: after drawing this turn, this gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [snatchRed, risingSpeedRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.playAttack(snatchRed);
    game.closeCombat();
    Levia.attackWith(risingSpeedRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(11);
    expectFabPlayer(Levia).toHaveAP(1);
  });

  it("boundary: without a draw this turn there is no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [risingSpeedRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(risingSpeedRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Levia).toHaveAP(0);
  });

  it("boundary: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [risingSpeedRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Levia.defendWith([risingSpeedRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Levia).toHaveLife(18);
  });
});
