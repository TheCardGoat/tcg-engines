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
import { jumpStartRed } from "./jump-start.ts";

/**
 * Jump Start, Red (DYN104) — Mechanologist Attack Action.
 *
 * Printed: "If you control a Hyper Driver, this costs {r} less to play.\nBoost"
 * (cost 2, 5{p}, 3{d})
 */

describe("Jump Start (DYN104) AAA", () => {
  it("happy: controlling a Hyper Driver reduces the cost by 1{r} and the attack is printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: hyperDriverRed, state: { steamCounters: 3 } }],
        hand: [jumpStartRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(jumpStartRed);
    expectCombat(game).toHaveAttackPower(5);
    expectFabPlayer(Dash).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(15);
    expectFabCard(Dash, jumpStartRed).toBeIn("graveyard");
  });

  it("boundary: without a Hyper Driver the printed 2{r} cannot be paid with 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [jumpStartRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.attackWith(jumpStartRed)).toThrow();
    expectFabCard(Dash, jumpStartRed).toBeIn("hand");
  });

  it("timing: paying the printed 2{r} without a Hyper Driver still attacks at 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [jumpStartRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(jumpStartRed);
    expectCombat(game).toHaveAttackPower(5);
    expectFabPlayer(Dash).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(15);
  });
});
