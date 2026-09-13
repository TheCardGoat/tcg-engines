import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { flyingHighBlue, flyingHighRed } from "./flying-high.ts";

describe("Flying High AAA", () => {
  it("happy: a matching-color next attack gets +1 power and go again", () => {
    for (const [card, attack, expected] of [
      [flyingHighRed, snatchRed, 5],
      [flyingHighBlue, brutalAssaultBlue, 5],
    ] as const) {
      const game = FabTestEngine.start(
        { hero: dash, hand: [card, attack], resourcePoints: 2, actionPoints: 2, deck: 6 },
        { hero: bravo, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      Dash.play(card);
      game.helpers.resolveUntilIdle();
      Dash.playAttack(attack);
      expectCombat(game).toHaveAttackPower(expected).toHaveKeyword("go-again");
    }
  });

  it("boundary: a nonmatching-color attack is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [flyingHighRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(flyingHighRed);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
  });
});
