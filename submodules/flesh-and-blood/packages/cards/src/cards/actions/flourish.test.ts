import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { flourishBlue } from "./flourish.ts";
import { flourishYellow as flourish } from "./flourish.ts";

/**
 * Flourish Blue (TER024) — Earth Action. Go again.
 *
 * Printed: The next time an attack would gain {p} this turn, instead it
 * gains that much plus 2.
 */

describe("Flourish (TER024) AAA", () => {
  it("happy: Nimblism's +1{p} gain becomes +4 on the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [flourishBlue, nimblismBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(flourishBlue);
    game.helpers.resolveUntilIdle();
    Oldhim.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Oldhim.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7); // 4 + (1 + 2)
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(13); // 20 - 7
  });

  it("boundary: without a {p} gain, the attack stays printed", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [flourishBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(flourishBlue);
    game.helpers.resolveUntilIdle();
    Oldhim.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4
  });
});

/**
 * Flourish Red (TER017) — Earth Action. Go again.
 *
 * Printed: The next time an attack would gain {p} this turn, instead it
 * gains that much plus 3.
 */

describe("Flourish (TER017) AAA", () => {
  it("happy: Nimblism's +1{p} gain becomes +4 on the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [flourish, nimblismBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(flourish);
    game.helpers.resolveUntilIdle();
    Oldhim.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Oldhim.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(8); // 4 + (1 + 3)
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(12); // 20 - 8
  });

  it("boundary: without a {p} gain, the attack stays printed", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [flourish, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(flourish);
    game.helpers.resolveUntilIdle();
    Oldhim.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4
  });
});
