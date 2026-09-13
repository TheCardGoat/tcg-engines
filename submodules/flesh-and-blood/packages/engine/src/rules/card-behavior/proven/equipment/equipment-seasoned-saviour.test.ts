/**
 * DYN026 Seasoned Saviour — Guardian Off-Hand d3.
 *
 * Printed a1: "When you equip Seasoned Saviour, put two -1{d} counters on
 * it. Battleworn."
 *
 * The equip trigger is the printed ability; the resulting d1 is shown through
 * combat, rather than treating generic battleworn lifecycle as acceptance.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { seasonedSaviour } from "../../../../../../cards/src/cards/equipment/seasoned-saviour.ts";

const SNATCH = 4;

function resolveSetup(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 8; safety += 1) {
    if (game.getState().rulesStack.length === 0 && !game.getState().decision) return;
    game.passBoth();
  }
  throw new Error("Seasoned Saviour equip trigger did not resolve");
}

describe("seasoned-saviour (DYN026)", () => {
  it("a1: equip creates exactly two -1 defense counters, leaving d1 for combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, weapon2: [seasonedSaviour], life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    resolveSetup(game);
    const saviourId = Defender.findCardInZone("weapon2", seasonedSaviour);
    expect(game.objectState(saviourId)?.defenseCounterTotal).toBe(-2);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(seasonedSaviour);
    game.helpers.resolveRestOfCombat();

    // Printed d3 minus exactly two equip counters means it blocks one.
    expect(Defender.life()).toBe(20 - (SNATCH - 1));
  });
});
