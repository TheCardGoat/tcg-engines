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
import { thriveYellow } from "./thrive.ts";

/**
 * Thrive Yellow (TER019) — Earth Action. Go again.
 *
 * Printed: If an attack would gain {p} this turn, instead it gains that much
 * plus 1.
 */

describe("Flourish (TER019) AAA", () => {
  it("happy: Nimblism's +1{p} gain becomes +4 on the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [thriveYellow, nimblismBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(thriveYellow);
    game.helpers.resolveUntilIdle();
    Oldhim.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Oldhim.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6); // 4 + (1 + 1)
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(14); // 20 - 6
  });

  it("boundary: without a {p} gain, the attack stays printed", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [thriveYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);

    Oldhim.play(thriveYellow);
    game.helpers.resolveUntilIdle();
    Oldhim.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4
  });
});
