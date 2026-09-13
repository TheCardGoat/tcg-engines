import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { liarSCharmYellow } from "../instants/liar-s-charm.ts";
import { bigBullyRed } from "./big-bully.ts";

/**
 * Big Bully Red (SUP067) — Reviled Brute AAC, 4{p}.
 *
 * Printed: When this attacks a hero, if you have more {h} than them, the
 * crowd boos you. If you've been booed this turn, this card's base {p} is
 * doubled.
 */

describe("Big Bully (SUP067) AAA", () => {
  it("happy: attacking with more life boos you and doubles base {p} to 8", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bigBullyRed],
        life: 30,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 10, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(bigBullyRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: attacking with less life draws no boos and stays 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bigBullyRed],
        life: 10,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 30, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(bigBullyRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: already booed this turn doubles even when you do not have more {h}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bigBullyRed, liarSCharmYellow],
        life: 10,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 30, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(liarSCharmYellow, { modeIndexes: [1] });
    game.passBoth();
    Bravo.playAttack(bigBullyRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(8);
  });
});
