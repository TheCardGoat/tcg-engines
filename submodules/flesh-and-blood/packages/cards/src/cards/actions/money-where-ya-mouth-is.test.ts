import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { headJabBlue, headJabRed } from "./head-jab.ts";
import { moneyWhereYaMouthIsRed } from "./money-where-ya-mouth-is.ts";

describe("Money Where Ya Mouth Is Red (BET017) AAA", () => {
  it("returns the action point so the next attack can receive +3 power", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [moneyWhereYaMouthIsRed, headJabRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(moneyWhereYaMouthIsRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
    Dash.playAttack(headJabRed, { optionals: "decline" });
    expectCombat(game).toHaveAttackPower(6);
  });

  it("consumes the power bonus on the first attack only", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [moneyWhereYaMouthIsRed, headJabRed, headJabBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(moneyWhereYaMouthIsRed);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(headJabRed, { optionals: "decline" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Dash.playAttack(headJabBlue);
    expectCombat(game).toHaveAttackPower(1);
  });
});
