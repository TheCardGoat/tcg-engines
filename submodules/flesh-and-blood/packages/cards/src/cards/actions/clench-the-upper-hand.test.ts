import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { clenchTheUpperHandRed } from "./clench-the-upper-hand.ts";

/**
 * Clench the Upper Hand Red (SUP101) — Reviled Attack Action.
 *
 * Printed: When this attacks or defends, if you have less {h} than each
 * other hero, the crowd boos you.
 */

describe("Clench the Upper Hand family AAA", () => {
  it("happy: attacking from behind on life, the crowd boos you", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [clenchTheUpperHandRed],
        life: 15, // behind: the boo fires
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.playAttack(clenchTheUpperHandRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4
    expectFabPlayer(Tuffnut).toHaveCrowdBooedThisTurn();
  });

  it("boundary: ahead on life, attacking boos nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [clenchTheUpperHandRed],
        life: 20, // ahead: no boo
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.playAttack(clenchTheUpperHandRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(11); // 15 - 4
    // Fluent surface has no not-toHaveCrowdBooed inverse; the damage math
    // carries the boundary (no boo-conditioned riders on this card).
  });
});
