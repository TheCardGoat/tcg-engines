import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { sinkBelowBlue } from "../defense-reactions/sink-below.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { corruptAndConquerRed } from "./corrupt-and-conquer.ts";

/**
 * Corrupt and Conquer, Red (IAR164) — Shadow Attack, cost 2, 6{p}, Blood Debt.
 * Printed: If this was played from your banished zone, it gets "Defense
 * reaction cards can't be played this chain link."
 * When this hits a hero, banish all cards in their arsenal.
 */

describe("Corrupt and Conquer (IAR164) AAA", () => {
  it("happy: a hero hit banishes every card in their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [corruptAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arsenal: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.playAttack(corruptAndConquerRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(game.as(dash), snatchRed).toBeIn("banished");
  });

  it("boundary: a miss does not banish the defending hero's arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [corruptAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        arsenal: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(corruptAndConquerRed);
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
  });

  it("boundary: from hand, a defense reaction can still be played this chain link", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [corruptAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [sinkBelowBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(corruptAndConquerRed);
    game.toReaction("defender");
    Dash.must.playReaction(sinkBelowBlue);
    game.closeCombat();

    expectFabCard(Dash, sinkBelowBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: played from banished, a defense reaction cannot be played this chain link", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [corruptAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [sinkBelowBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(corruptAndConquerRed, { from: "banished" });
    game.toReaction("defender");
    expect(() => Dash.play(sinkBelowBlue)).toThrow();
    expectFabCard(Dash, sinkBelowBlue).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(6);
  });
});
