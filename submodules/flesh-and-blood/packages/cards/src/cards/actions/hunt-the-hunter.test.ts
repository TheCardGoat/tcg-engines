import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { enGardeRed } from "./en-garde.ts";
import { huntTheHunterRed } from "./hunt-the-hunter.ts";

/**
 * Hunt the Hunter (HNT161) — Draconic Action Attack, 5{p}/3{d}.
 *
 * Printed: When this attacks a hero, if you've played another red card this
 * turn, mark them.
 */

describe("Hunt the Hunter (HNT161) AAA", () => {
  it("happy: attacking after another red card this turn marks the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [enGardeRed, huntTheHunterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(enGardeRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(huntTheHunterRed);
    game.advanceUntil({ stopAt: "defend" });

    expectFabPlayer(game.as(dash)).toBeMarked();
  });

  it("boundary: attacking with no earlier red play does not mark", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [huntTheHunterRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(huntTheHunterRed);
    game.advanceUntil({ stopAt: "defend" });

    expectFabPlayer(game.as(dash)).notToBeMarked();
  });

  it("timing: mark is gone after combat closes", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [enGardeRed, huntTheHunterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(enGardeRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(huntTheHunterRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).notToBeMarked();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });
});
