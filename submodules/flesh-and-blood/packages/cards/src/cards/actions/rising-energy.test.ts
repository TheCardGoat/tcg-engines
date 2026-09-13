import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { risingEnergyRed } from "./rising-energy.ts";

/**
 * Rising Energy, Red (HVY183) — Guardian / Warrior Attack Action.
 *
 * Printed: "If you've drawn a card this turn, this costs {r} less to play."
 * (cost 2, 6{p}, 2{d})
 */

describe("Rising Energy family AAA", () => {
  it("happy: after drawing this turn, this costs 1{r} and attacks for 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, risingEnergyRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.closeCombat();
    Bravo.attackWith(risingEnergyRed);
    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(10);
  });

  it("boundary: without a draw this turn, 1{r} cannot pay the printed 2{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [risingEnergyRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.attackWith(risingEnergyRed)).toThrow();
    expectFabCard(Bravo, risingEnergyRed).toBeIn("hand");
  });

  it("timing: paying the printed 2{r} without a draw still attacks at 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [risingEnergyRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(risingEnergyRed);
    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });
});
