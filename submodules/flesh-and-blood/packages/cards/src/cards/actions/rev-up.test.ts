import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { revUpRed } from "./rev-up.ts";

/**
 * Rev Up, Red (EVO183) — Mechanologist Attack Action.
 *
 * Printed: "If you control a Hyper Driver, this costs {r} less to play.\nBoost"
 * (cost 3, 6{p}, 3{d})
 */

describe("Rev Up (EVO183) AAA", () => {
  it("happy: controlling a Hyper Driver reduces the cost by 1{r} and the attack is printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: hyperDriverRed, state: { steamCounters: 3 } }],
        hand: [revUpRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(revUpRed);
    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Dash).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(14);
    expectFabCard(Dash, revUpRed).toBeIn("graveyard");
  });

  it("boundary: without a Hyper Driver the printed 3{r} cannot be paid with 2{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [revUpRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.attackWith(revUpRed)).toThrow();
    expectFabCard(Dash, revUpRed).toBeIn("hand");
  });

  it("timing: paying the printed 3{r} without a Hyper Driver still attacks at 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [revUpRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(revUpRed);
    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Dash).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(14);
  });
});
