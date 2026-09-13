import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { drawnToTheBladeYellow } from "./drawn-to-the-blade.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";

/**
 * Drawn to the Blade (MPW030) — Warrior Action, cost 0, Sharpen, go again.
 *
 * Printed: "Sharpen target sword you control.\nIf it has 2 or more +1{p}
 * counters, the next time it hits this turn, draw a card.\nGo again"
 */

describe("Drawn to the Blade (MPW030) AAA", () => {
  it("happy: two sharpen counters arm a draw when the sword hits", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [drawnToTheBladeYellow, drawnToTheBladeYellow],
        resourcePoints: 1,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(drawnToTheBladeYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    Hala.play(drawnToTheBladeYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(2);

    Hala.activate(zenithBlade);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Hala).toHaveHandCount(1);
  });

  it("boundary: a single sharpen counter does not arm the draw", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [drawnToTheBladeYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(drawnToTheBladeYellow);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: zenithBlade.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(1);

    Hala.activate(zenithBlade);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Hala).toHaveHandCount(0);
  });
});
