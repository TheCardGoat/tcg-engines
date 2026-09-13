import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { ebonFold } from "../equipment/ebon-fold.ts";
import { skullCrackRed } from "./skull-crack.ts";
import { battlefieldBreakerRed } from "./battlefield-breaker.ts";

/**
 * Battlefield Breaker, Red (DTD121) — Shadow Brute Action - Attack, cost 3, 7{p}, 3{d}.
 *
 * Printed: "If you've banished a card with 6 or more {p} this turn, this gets
 * +1{p}.\nBlood Debt"
 */

describe("Battlefield Breaker family AAA", () => {
  it("happy: after banishing a 6{p} card this turn the attack is 8{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, battlefieldBreakerRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    expectFabCard(Levia, skullCrackRed).toBeBanished();

    Levia.attackWith(battlefieldBreakerRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(8);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(12);
    expectFabCard(Levia, battlefieldBreakerRed).toBeIn("graveyard");
  });

  it("boundary: with no 6+{p} banish this turn the attack stays at its printed 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [battlefieldBreakerRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.attackWith(battlefieldBreakerRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(13);
    expectFabCard(Levia, battlefieldBreakerRed).toBeIn("graveyard");
  });

  it("timing: Blood Debt — an unplayed copy in the banished zone drains 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [battlefieldBreakerRed],
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
