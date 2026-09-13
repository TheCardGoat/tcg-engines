import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { mockingBlowRed } from "./mocking-blow.ts";

/**
 * Mocking Blow, Red (SUP090) — Action - Attack, 1{p}.
 * Printed: "When this attacks a hero, if you have more {h} than them,
 * the crowd boos you. If you've been booed this turn, this gets +4{p}."
 */

describe("Mocking Blow family AAA", () => {
  it("happy: attacking with more life draws boos and +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [mockingBlowRed],
        life: 30,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 10, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(mockingBlowRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: attacking with less life draws no boos and stays 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [mockingBlowRed],
        life: 10,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 30, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(mockingBlowRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(1);
  });

  it("timing: equal life is not 'more' — stays 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [mockingBlowRed],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(mockingBlowRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(1);
  });
});
