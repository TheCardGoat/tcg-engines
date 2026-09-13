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
import { boneyardMarauderRed } from "./boneyard-marauder.ts";

/**
 * Boneyard Marauder, Red (LEV009) — Shadow Brute Attack Action.
 *
 * Printed: "As an additional cost to play Boneyard Marauder, banish 3 random
 * cards from your graveyard.\nBlood Debt" (cost 1, 6{p}, 3{d})
 */

describe("Boneyard Marauder family AAA", () => {
  it("happy: banishing 3 graveyard cards pays the cost and the attack is printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [boneyardMarauderRed],
        graveyard: [nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(boneyardMarauderRed);
    expect(Levia.zone("graveyard")).toHaveLength(0);
    expect(Levia.zone("banished")).toHaveLength(3);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: with an empty graveyard the required banish cost cannot be paid — the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [boneyardMarauderRed],
        graveyard: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expectFabUnplayable(() => Levia.play(boneyardMarauderRed));
    expectFabCard(Levia, boneyardMarauderRed).toBeIn("hand");
  });

  it("timing: Blood Debt — an unplayed copy in the banished zone drains 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [boneyardMarauderRed],
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
