import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";
import { dash } from "../heroes/dash.ts";

import { tributeToTheLegionsOfDoomRed } from "./tribute-to-the-legions-of-doom.ts";

/**
 * Tribute to the Legions of Doom, Red (DTD130) — Shadow Brute Action - Attack,
 * cost 3, 7{p}, 3{d}.
 *
 * Printed: "As an additional cost to play this, banish a random card from
 * your hand.\nIf a card with 6 or more {p} is banished this way, this gets
 * +2{p}.\nBlood Debt"
 */

describe("Tribute to the Legions of Doom family AAA", () => {
  it("happy: banishing a 6+{p} card this way grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [tributeToTheLegionsOfDoomRed, smashWithBigTreeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(tributeToTheLegionsOfDoomRed);
    expectFabCard(Levia, smashWithBigTreeRed).toBeIn("banished");
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(9);
  });

  it("boundary: with no other card in hand the required banish cost cannot be paid — the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [tributeToTheLegionsOfDoomRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expectFabUnplayable(() => Levia.play(tributeToTheLegionsOfDoomRed));
    expectFabCard(Levia, tributeToTheLegionsOfDoomRed).toBeIn("hand");
  });

  it("timing: Blood Debt — an unplayed copy in the banished zone drains 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [tributeToTheLegionsOfDoomRed],
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
