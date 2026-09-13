import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crouchingTiger } from "../actions/crouching-tiger.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tearingShuko } from "./tearing-shuko.ts";

/**
 * Tearing Shuko (DYN046) — Ninja Arms battleworn.
 *
 * Printed:
 *   Instant - Destroy this: The next Crouching Tiger you play this turn gains +2{p}.
 */

describe("Tearing Shuko (DYN046) AAA", () => {
  it("happy: next Crouching Tiger this turn is 0 + 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [tearingShuko],
        hand: [crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(tearingShuko);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, tearingShuko).toBeIn("graveyard");

    Bravo.attackWith(crouchingTiger);
    expectCombat(game).toHaveAttackPower(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("boundary: a non-Crouching-Tiger attack does not get +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [tearingShuko],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(tearingShuko);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: Instant destroy spends no action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [tearingShuko],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(tearingShuko);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, tearingShuko).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
