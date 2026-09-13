import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { bladeCuff } from "./blade-cuff.ts";

/**
 * Blade Cuff (OUT141) — Assassin Ninja Arms d1 Blade Break.
 *
 * Printed: Action - {r}{r}, destroy Blade Cuff: Your daggers gain +1{p} this
 * turn. Go again
 *
 * The destroyed arms buff every dagger attack this turn (count all): two
 * 1H Nerve Scalpels each swing at 2{p} after one activation.
 */

describe("Blade Cuff (OUT141) AAA", () => {
  it("happy: destroy the cuff so this turn's dagger attacks gain +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        arms: [bladeCuff],
        weapon1: [nerveScalpel],
        hand: [],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.activate(bladeCuff);
    game.helpers.resolveUntilIdle();
    expectFabCard(Fang, bladeCuff).toBeIn("graveyard");
    expectFabPlayer(Fang).toHaveAP(1);

    Fang.activate(nerveScalpel);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: without the cuff the dagger stays printed 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [nerveScalpel],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.activate(nerveScalpel);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(1);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("timing: every dagger attack this turn is buffed, not just the first", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        arms: [bladeCuff],
        weapon1: [nerveScalpel],
        weapon2: [nerveScalpel],
        hand: [],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.activate(bladeCuff);
    game.helpers.resolveUntilIdle();

    Fang.activate(nerveScalpel, { index: 0 });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    Fang.activate(nerveScalpel, { index: 1 });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(36);
  });
});
