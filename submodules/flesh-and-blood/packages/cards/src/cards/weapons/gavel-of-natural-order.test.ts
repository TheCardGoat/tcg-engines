import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { gavelOfNaturalOrder } from "./gavel-of-natural-order.ts";

/**
 * Gavel of Natural Order (JDG005) — Adjudicator 1H Hammer, 2{p}.
 * Printed: Pairs with an off-hand. Once per Turn Action - {r}{r}: Attack.
 * Whenever an opponent plays or activates their first card or ability each
 * turn, if it's not their turn, put a +1{p} counter on this. At the beginning
 * of your end phase, remove all +1{p} counters from this.
 */

describe("Gavel of Natural Order (JDG005) AAA", () => {
  it("happy: paying {r}{r} attacks for printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [gavelOfNaturalOrder],
        hand: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(gavelOfNaturalOrder);
    expectCombat(game).toHaveAttackPower(2);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("boundary: a second activation the same turn is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [gavelOfNaturalOrder],
        hand: [nimblismBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(gavelOfNaturalOrder);
    game.helpers.resolveRestOfCombat();
    expect(() => Bravo.activateAttack(gavelOfNaturalOrder)).toThrow(
      /activation|limit|once per turn/i,
    );
  });

  it("timing: end phase removes seeded +1{p} counters", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [{ card: gavelOfNaturalOrder, state: { powerCounters: 2 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.untilIdle();

    expectFabCard(Bravo, gavelOfNaturalOrder).toHavePower(2);
  });
});
