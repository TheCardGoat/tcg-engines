import { describe, it } from "vitest";
import { FabTestEngine, expectCombat } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { woundedBullRed } from "./wounded-bull.ts";

describe("Wounded Bull (WTR200) AAA", () => {
  it("happy: less life than the opposing hero grants +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [woundedBullRed], resourcePoints: 3, actionPoints: 1, life: 15, deck: 6 },
      { hero: azalea, hand: [], life: 20, deck: 6 },
    );

    game.as(dash).playAttack(woundedBullRed);
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: equal life does not grant the buff", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [woundedBullRed], resourcePoints: 3, actionPoints: 1, life: 20, deck: 6 },
      { hero: azalea, hand: [], life: 20, deck: 6 },
    );

    game.as(dash).playAttack(woundedBullRed);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: the +1{p} is only on this attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [woundedBullRed],
        arsenal: [snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        life: 15,
        deck: 6,
      },
      { hero: azalea, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(woundedBullRed);
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat();
    Dash.playAttack(snatchRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4);
  });
});
