import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { unboundByShadowRed } from "./unbound-by-shadow.ts";
import { abyssalRushBlue } from "./abyssal-rush.ts";

/**
 * Abyssal Rush, Blue — Shadow Action, cost 1, go again, Blood Debt.
 *
 * Printed: "You may play this from your banished zone.\nYour next Shadow
 * attack this turn gets \"When this hits, it gets go again.\" Go again\nBlood Debt"
 */

describe("Abyssal Rush AAA", () => {
  it("happy: a hitting Shadow attack gets go again from the granted on-hit", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [unboundByShadowRed],
        banished: [abyssalRushBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(abyssalRushBlue, { from: "banished" });
    game.untilIdle();
    expectFabPlayer(Chane).toHaveAP(1);

    Chane.playAttack(unboundByShadowRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Chane).toHaveAP(1);
  });

  it("boundary: a generic attack that hits does not get the on-hit go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed],
        banished: [abyssalRushBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(abyssalRushBlue, { from: "banished" });
    game.untilIdle();

    Chane.playAttack(snatchRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Chane).toHaveAP(0);
  });
});
