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
import { nimblismBlue } from "./nimblism.ts";
import { tributeToDemolitionRed } from "./tribute-to-demolition.ts";

/**
 * Tribute to Demolition, Red (DTD127) — Shadow Brute Action - Attack, cost 2, 6{p}, 3{d}.
 *
 * Printed: "As an additional cost to play this, banish a random card from
 * your hand.\nIf a card with 6 or more {p} is banished this way, this gets
 * +2{p}.\nBlood Debt"
 */

describe("Tribute to Demolition family AAA", () => {
  it("happy: banishing a 6+{p} card this way grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [tributeToDemolitionRed, smashWithBigTreeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(tributeToDemolitionRed);
    expectFabCard(Levia, smashWithBigTreeRed).toBeIn("banished");
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: banishing a card with less than 6{p} leaves printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [tributeToDemolitionRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.attackWith(tributeToDemolitionRed);
    expectFabCard(Levia, nimblismBlue).toBeIn("banished");
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: with no other card in hand the required banish cost cannot be paid — the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [tributeToDemolitionRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expectFabUnplayable(() => Levia.play(tributeToDemolitionRed));
    expectFabCard(Levia, tributeToDemolitionRed).toBeIn("hand");
  });

  it("timing: Blood Debt — an unplayed copy in the banished zone drains 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [tributeToDemolitionRed],
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
