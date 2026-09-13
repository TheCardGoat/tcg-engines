import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { sparkSprayRed } from "./spark-spray.ts";

/**
 * Spark Spray (AST015) — Lightning Attack, 0-cost 4{p}/2{d}.
 *
 * Printed: When this is defended by 1 or more cards, you may pay {r}. If you
 * do, this gets +1{p}.
 */

describe("Spark Spray (AST015) AAA", () => {
  it("happy: defended, pays {r}, and the +1{p} rides the damage step", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [sparkSprayRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(sparkSprayRed, { stopAt: "defend" });
    Bravo.defendWith(brutalAssaultBlue);
    game.passBoth();
    Dash.accept(); // pay {r} for the +1{p}
    expectCombat(game).toHaveAttackPower(5); // 4 base + 1
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveResourceCount(0);
    expectFabPlayer(Bravo).toHaveLife(18); // 5{p} vs a 3-block
  });

  it("boundary: declining the pay keeps the resource and the printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [sparkSprayRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(sparkSprayRed, { stopAt: "defend" });
    Bravo.defendWith(brutalAssaultBlue);
    game.passBoth();
    Dash.decline();
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabPlayer(Bravo).toHaveLife(19); // 4{p} vs a 3-block
  });

  it("timing: an undefended attack never offers the pay", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [sparkSprayRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(sparkSprayRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabPlayer(game.as(bravo)).toHaveLife(16); // undefended 4{p}
  });
});
