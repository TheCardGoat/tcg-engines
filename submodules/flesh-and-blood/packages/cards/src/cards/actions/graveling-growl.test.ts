import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { endlessMawRed } from "./endless-maw.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";
import { nimblismBlue } from "./nimblism.ts";
import { gravelingGrowlRed } from "./graveling-growl.ts";

/**
 * Graveling Growl, Red (LEV013) — Shadow Brute Attack Action.
 *
 * Printed: "Play Graveling Growl only if a card with 6 or more {p} has been
 * put into your banished zone this turn.\nBlood Debt" (cost 1, 7{p}, 3{d})
 */

describe("Graveling Growl family AAA", () => {
  it("happy: after a 6+{p} card is put into the banished zone this turn, this attacks at 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [endlessMawRed, gravelingGrowlRed],
        graveyard: [nimblismBlue, nimblismBlue, smashWithBigTreeRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(endlessMawRed);
    game.closeCombat();
    Levia.attackWith(gravelingGrowlRed);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: without a 6+{p} card put into the banished zone this turn, the play is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [gravelingGrowlRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expect(() => Levia.attackWith(gravelingGrowlRed)).toThrow();
    expectFabCard(Levia, gravelingGrowlRed).toBeIn("hand");
  });

  it("timing: Blood Debt — an unplayed copy in the banished zone drains 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [gravelingGrowlRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Levia).toHaveLife(19);
  });
});
