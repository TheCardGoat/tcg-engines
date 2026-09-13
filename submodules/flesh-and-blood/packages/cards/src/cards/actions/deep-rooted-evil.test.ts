import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { endlessMawRed } from "./endless-maw.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";
import { nimblismBlue } from "./nimblism.ts";
import { deepRootedEvilYellow } from "./deep-rooted-evil.ts";

/**
 * Deep Rooted Evil, Yellow (MON123) — Shadow Brute Attack Action.
 *
 * Printed: "If a card with 6 or more {p} has been put into your banished zone
 * this turn, you may play Deep Rooted Evil from your banished zone.\nBlood Debt"
 * (cost 3, 6{p})
 */

describe("Deep Rooted Evil (MON123) AAA", () => {
  it("happy: after a 6+{p} card is banished this turn, this is playable from banished at 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [endlessMawRed],
        banished: [deepRootedEvilYellow],
        graveyard: [nimblismBlue, nimblismBlue, smashWithBigTreeRed],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(endlessMawRed);
    game.closeCombat();
    Levia.attackWith(deepRootedEvilYellow, { from: "banished" });
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: the permission only extends playability — the hand copy is still an ordinary legal play", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [deepRootedEvilYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(deepRootedEvilYellow);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: Blood Debt — a copy left in banished costs 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [deepRootedEvilYellow],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Levia).toHaveLife(19);
  });
});
