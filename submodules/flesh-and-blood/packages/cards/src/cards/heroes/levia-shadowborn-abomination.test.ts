import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { ebonFold } from "../equipment/ebon-fold.ts";
import { skullCrackRed } from "../actions/skull-crack.ts";
import { shadowOfUrsurBlue } from "../actions/shadow-of-ursur.ts";
import { leviaShadowbornAbomination } from "./levia-shadowborn-abomination.ts";

/**
 * Levia, Shadowborn Abomination (MON119) — Shadow Brute Hero, 40{h}.
 *
 * Printed: If a card with 6 or more {p} has been put into your banished zone
 * this turn, you don't lose {h} from blood debt during the end phase.
 */

describe("Levia, Shadowborn Abomination (MON119) AAA", () => {
  it("happy: banishing a 6{p} card this turn skips blood-debt life loss", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        head: [ebonFold],
        hand: [skullCrackRed],
        banished: [shadowOfUrsurBlue],
        resourcePoints: 1,
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    Levia.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    expectFabCard(Levia, skullCrackRed).toBeBanished();
    expectFabCard(Levia, shadowOfUrsurBlue).toBeBanished();

    Levia.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Levia).toHaveLife(40);
  });

  it("boundary: blood debt still drains 1{h} when no 6{p} card was banished this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [],
        banished: [shadowOfUrsurBlue],
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    Levia.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Levia).toHaveLife(39);
  });

  it("timing: a prior turn's 6{p} banish does not skip the next end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        head: [ebonFold],
        hand: [skullCrackRed],
        banished: [shadowOfUrsurBlue],
        resourcePoints: 1,
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);
    const Dash = game.as(dash);

    Levia.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    Levia.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Levia).toHaveLife(40);

    Dash.endTurn();
    game.helpers.untilIdle();
    Levia.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Levia).toHaveLife(39);
  });
});
