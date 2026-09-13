import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { unboundByShadowRed } from "./unbound-by-shadow.ts";
import { abyssalBiteBlue } from "./abyssal-bite.ts";

/**
 * Abyssal Bite, Blue — Shadow Action, cost 1, go again, Blood Debt.
 *
 * Printed: "You may play this from your banished zone.\nYour next Shadow
 * attack this turn gets +1{p}. Go again\nBlood Debt"
 */

describe("Abyssal Bite AAA", () => {
  it("happy: playing from banished arms the next Shadow attack with +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [unboundByShadowRed],
        banished: [abyssalBiteBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(abyssalBiteBlue, { from: "banished" });
    game.untilIdle();
    expectFabPlayer(Chane).toHaveAP(1);

    Chane.playAttack(unboundByShadowRed);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: the next generic attack does not get +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed],
        banished: [abyssalBiteBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(abyssalBiteBlue, { from: "banished" });
    game.untilIdle();

    Chane.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
