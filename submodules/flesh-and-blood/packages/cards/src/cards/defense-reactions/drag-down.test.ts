import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dragDownRed, dragDownYellow, dragDownBlue } from "./drag-down.ts";

/**
 * Drag Down (FAB442 / PEN332 / PEN333) — Generic Defense Reaction.
 * Printed: When this defends an attack, the attack gets -X{p}, where the
 * pitch-scaled amount is red 3, yellow 2, blue 1.
 */

describe("Drag Down family AAA", () => {
  for (const [card, debuff, expectedLife] of [
    [dragDownRed, 3, 19],
    [dragDownYellow, 2, 18],
    [dragDownBlue, 1, 17],
  ] as const) {
    it(`defending reduces the attack by the printed ${debuff}{p} (${card.slug})`, () => {
      const game = FabTestEngine.start(
        { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
        { hero: bravo, hand: [card], life: 20, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);

      game.as(dash).attackWith(snatchRed);
      game.advanceCombatTo("reaction");
      game.as(dash).pass();
      Bravo.play(card);
      game.passBoth();
      game.passBoth();
      expectCombat(game).toHaveAttackPower(4 - debuff);
      game.helpers.resolveRestOfCombat();
      expectFabPlayer(Bravo).toHaveLife(expectedLife);
    });
  }

  it("boundary: without a Drag Down the attack keeps its printed power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(16);
    expectCombat(game).toBeClosed();
  });
});
