import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { seekAndDestroyRed } from "./seek-and-destroy.ts";

/**
 * Seek and Destroy (ELE215) — Ranger Action, cost 0, 2{d}, go again.
 *
 * Printed: 'Your next arrow attack this turn gains +3{p} and "If this hits a
 * hero, at the beginning of their next end phase, they discard all cards in
 * their hand and destroy all cards in their arsenal." Go again'
 */

describe("Seek and Destroy (ELE215) AAA", () => {
  it("happy: the next arrow attack this turn gains +3{p} and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [seekAndDestroyRed],
        weapon1: [deathDealer],
        arsenal: [searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(seekAndDestroyRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    // Searing Shot printed 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a non-arrow attack does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [seekAndDestroyRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(seekAndDestroyRed);
    game.helpers.resolveUntilIdle();

    Azalea.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
