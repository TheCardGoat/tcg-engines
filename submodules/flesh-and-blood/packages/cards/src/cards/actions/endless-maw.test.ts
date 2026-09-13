import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { nimblismBlue } from "./nimblism.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";
import { endlessMawRed } from "./endless-maw.ts";

/**
 * Endless Maw (LEV012) — Shadow Brute Action - Attack, cost 3, 6{p}, 3{d}.
 *
 * Printed: "As an additional cost to play Endless Maw, banish 3 random cards
 * from your graveyard.
 * If a card with 6 or more {p} is banished this way, Endless maw gains +3{p}.
 * Blood Debt"
 */

describe("Endless Maw family AAA", () => {
  it("happy: banishing 3 graveyard cards including a 6+{p} card grants +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [endlessMawRed],
        graveyard: [nimblismBlue, nimblismBlue, smashWithBigTreeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(endlessMawRed);
    expect(Levia.zone("graveyard")).toHaveLength(0);
    expect(Levia.zone("banished")).toHaveLength(3);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(9);
  });

  it("boundary: with an empty graveyard the required banish cost cannot be paid — the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [endlessMawRed],
        graveyard: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expectFabUnplayable(() => Levia.play(endlessMawRed));
    expectFabCard(Levia, endlessMawRed).toBeIn("hand");
  });

  it("timing: Blood Debt — an unplayed copy in the banished zone drains 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [endlessMawRed],
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
