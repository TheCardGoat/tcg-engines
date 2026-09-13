import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { comebackKidRed } from "./comeback-kid.ts";

/**
 * Comeback Kid, Red (SUP027) — Action - Attack, 7{p}.
 * Printed: "When this attacks a hero, if you have less {h} than them,
 * the crowd cheers you. If you've been cheered this turn, this gets
 * +1{p}."
 */

describe("Comeback Kid family AAA", () => {
  it("happy: attacking with less life draws cheers and +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [comebackKidRed],
        life: 10,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 30, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(comebackKidRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: attacking with more life draws no cheers and stays 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [comebackKidRed],
        life: 30,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 10, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(comebackKidRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: equal life is not 'less' — stays 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [comebackKidRed],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(comebackKidRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(7);
  });
});
