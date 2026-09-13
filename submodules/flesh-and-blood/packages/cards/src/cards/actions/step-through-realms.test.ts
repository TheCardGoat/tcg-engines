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
import { stepThroughRealmsRed, stepThroughRealmsYellow } from "./step-through-realms.ts";

/**
 * Step through Realms, Red — Shadow Action, cost 2, go again.
 *
 * Printed: "Your next Shadow attack this turn gets +4{p} and \"When this hits,
 * create a Gate to i'Arathael token.\"\nGo again"
 */

describe("Step through Realms AAA", () => {
  it("happy: the next Shadow attack gets +4{p} and creates a Gate on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [stepThroughRealmsRed, unboundByShadowRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(stepThroughRealmsRed);
    game.untilIdle();
    expectFabPlayer(Chane).toHaveAP(1);

    Chane.playAttack(unboundByShadowRed);
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(12);
    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 1);
  });

  it("boundary: a generic attack gets neither the +4{p} nor the Gate", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [stepThroughRealmsRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(stepThroughRealmsRed);
    game.untilIdle();

    Chane.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 0);
  });

  it("happy: yellow grants the printed +3{p} rather than the red +4", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [stepThroughRealmsYellow, unboundByShadowRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(stepThroughRealmsYellow);
    game.untilIdle();
    expectFabPlayer(Chane).toHaveAP(1);

    Chane.playAttack(unboundByShadowRed);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 1);
  });
});
