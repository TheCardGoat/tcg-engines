import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { gloryPlate } from "./glory-plate.ts";

/**
 * Glory Plate — Revered Equipment - Chest, d0 Guardwell.
 *
 * Printed: "This gets +1{d} for each Toughness token that has left the arena
 * this turn."
 * The Toughness token destroys itself at the start of the opponent's turn,
 * so the chest defends at 1{d} during that same turn's attack.
 */

describe("Glory Plate (PEN287) AAA", () => {
  it("happy: a Toughness token that left the arena this turn gives +1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [gloryPlate],
        arena: [fabToken("toughness")],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    // Finish the turn transition and the Toughness start-of-turn destroy.
    game.untilIdle({ ordering: "listed" });

    // The Toughness self-destructed at the start of Dash's turn — this turn.
    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(gloryPlate);
    game.helpers.resolveRestOfCombat();

    // Snatch 4{p} vs 0{d} + 1 = 3 damage.
    expectFabPlayer(Bravo).toHaveLife(17);
  });

  it("boundary: with no Toughness leaving the arena, the plate defends at printed 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [gloryPlate], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(gloryPlate);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
  });
});
