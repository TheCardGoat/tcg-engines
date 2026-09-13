import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { leviaShadowbornAbomination } from "../heroes/levia-shadowborn-abomination.ts";
import { shadenSwingRed } from "./shaden-swing.ts";
import { slitheringShadowpedeRed } from "./slithering-shadowpede.ts";

/**
 * Slithering Shadowpede, Red (DTD109) — Shadow Brute Attack Action.
 *
 * Printed: "If this was banished from your hand this turn, you may play it
 * from your banished zone.\nBlood Debt" (cost 1, 6{p})
 *
 * CR 3.0.9c (this card is the CR example): the object retains hand→banished
 * move history this turn. CR 1.7.4e play-static permission. CR 8.3.11 Blood
 * Debt while public in banished.
 */

describe("Slithering Shadowpede (DTD109) AAA", () => {
  it("happy: after a hand-banish this turn, this is playable from banished at printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [shadenSwingRed, slitheringShadowpedeRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    Levia.attackWith(shadenSwingRed);
    expectFabCard(Levia, slitheringShadowpedeRed).toBeBanished();
    game.closeCombat();

    Levia.attackWith(slitheringShadowpedeRed, { from: "banished" });
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a copy arranged in banished (no hand-banish this turn) cannot be played from there", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [],
        banished: [slitheringShadowpedeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    expect(() => Levia.attackWith(slitheringShadowpedeRed, { from: "banished" })).toThrow();
    expectFabCard(Levia, slitheringShadowpedeRed).toBeBanished();
  });

  it("timing: Blood Debt — a copy left in banished costs 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [],
        banished: [slitheringShadowpedeRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    Levia.endTurn();
    game.helpers.untilIdle();

    expectFabPlayer(Levia).toHaveLife(19);
  });
});
