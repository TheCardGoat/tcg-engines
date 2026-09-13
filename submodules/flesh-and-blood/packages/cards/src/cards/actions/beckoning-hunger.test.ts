import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { levia } from "../heroes/levia.ts";
import { nimblismBlue } from "./nimblism.ts";
import { beckoningHungerRed } from "./beckoning-hunger.ts";

/**
 * Beckoning Hunger (IAR017) — Shadow Brute Action Attack, cost 3, 7{p}, 3{d}.
 *
 * Printed: "When this attacks, banish the top card of your deck.\nWhen this
 * hits, create a Blasmophet, the Insatiable Hunger token.\nBlood Debt"
 */

describe("Beckoning Hunger family AAA", () => {
  it("happy: attacking banishes the deck top, and a hit creates Blasmophet and deals 7", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [beckoningHungerRed],
        resourcePoints: 3,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(beckoningHungerRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    expect(Levia.zone("banished")).toContain(nimblismBlue.canonicalId);
    expectFabToken(game, "blasmophet-the-insatiable-hunger").toHaveCount(0);

    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabToken(game, "blasmophet-the-insatiable-hunger").toHaveCount(1);
    expectFabCard(Levia, beckoningHungerRed).toBeIn("graveyard");
  });

  it("boundary: a miss still banishes the deck top but creates no Blasmophet", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [beckoningHungerRed],
        resourcePoints: 3,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(beckoningHungerRed);
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expect(Levia.zone("banished")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabToken(game, "blasmophet-the-insatiable-hunger").toHaveCount(0);
  });

  it("timing: Blood Debt drains 1 life at end phase only while this is banished", () => {
    const banished = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [beckoningHungerRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    banished.as(levia).endTurn();
    banished.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });
    expectFabPlayer(banished.as(levia)).toHaveLife(19);

    const inHand = FabTestEngine.start(
      {
        hero: levia,
        hand: [beckoningHungerRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    inHand.as(levia).endTurn();
    inHand.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });
    expectFabPlayer(inHand.as(levia)).toHaveLife(20);
  });
});
