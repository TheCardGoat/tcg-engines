import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { nebulaBlade } from "./nebula-blade.ts";

/**
 * Nebula Blade (ARC077) — Runeblade 2H Sword.
 *
 * Printed: Once per Turn Action - {r}{r}: Attack
 * When this hits, create a Runechant token.
 * If you've played a non-attack action card this turn, this gets +3{p}.
 */

describe("Nebula Blade (ARC077) AAA", () => {
  it("happy: after a non-attack action the swing is 4{p} and the hit runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        weapon1: [nebulaBlade],
        hand: [tomeOfFyendalYellow],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();

    Vynnset.activateAttack(nebulaBlade);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4); // 1 + 3
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 1);
  });

  it("boundary: cold, the swing stays at its printed 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        weapon1: [nebulaBlade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.activateAttack(nebulaBlade);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(1);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(19); // 20 - 1
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 1); // hit leg still fires
  });
});
