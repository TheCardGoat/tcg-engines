/**
 * JDG000 Intellect Penalty — -1 intellect continuous modifier.
 * CR 1.5.1–1.5.3.
 */
import { describe, expect, it } from "vitest";

import { intellectPenalty } from "../../../../cards/src/cards/macros/intellect-penalty.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../rules/fixtures.ts";

describe("Intellect Penalty macro (JDG000)", () => {
  it("a1 AAA: controller's hero has -1 intellect — draw-to-intellect reduced by 1", () => {
    // Bravo seats JDG000 which gives -1 intellect (4 → 3).
    // After using cards to reduce hand below 3, end-turn draw fills to 3, not 4.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        macros: [intellectPenalty],
        hand: [snatchRed],
        deck: 10,
        actionPoints: 1,
      },
      { hero: dash, hand: [nimblismBlue], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Verify JDG000 is in Bravo's arena
    expect(Bravo.zone("arena")).toContain(intellectPenalty.canonicalId);

    // Attack to use snatchRed (removes it from hand via combat resolution).
    // nimblismBlue is in Dash's hand for defense.
    Bravo.attackWith(snatchRed);
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    // End turn: draw-to-intellect fills hand to effective intellect.
    // With JDG000: intellect 3, without: intellect 4.
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Hand should be exactly 3 (effective intellect from JDG000).
    // If JDG000 weren't working, hand would be 4.
    expect(Bravo.zone("hand").length).toBe(3);
  });
});
