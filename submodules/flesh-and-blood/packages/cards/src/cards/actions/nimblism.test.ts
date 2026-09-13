import { describe, it } from "vitest";
import { expectCombat, expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue, nimblismRed, nimblismYellow } from "./nimblism.ts";

const variants = [
  { label: "Nimblism Red (WTR218)", card: nimblismRed, powerBonus: 3 },
  { label: "Nimblism Yellow (WTR219)", card: nimblismYellow, powerBonus: 2 },
  { label: "Nimblism Blue (WTR220)", card: nimblismBlue, powerBonus: 1 },
] as const;

describe.each(variants)("$label AAA", ({ card, powerBonus }) => {
  it(`happy: the next cost-1-or-less attack action gains +${powerBonus}{p}`, () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card, snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();
    Bravo.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4 + powerBonus);
  });

  it("boundary: a cost-2 attack action does not receive the power bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [card, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();
    Bravo.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play Nimblism", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
