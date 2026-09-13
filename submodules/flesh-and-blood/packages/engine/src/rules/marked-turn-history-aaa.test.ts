/** Public AAA proof for turn-history conditions used by Marked cards. */
import { describe, expect, it } from "vitest";
import { enGardeRed } from "../../../cards/src/cards/actions/en-garde.ts";
import { huntTheHunterRed } from "../../../cards/src/cards/actions/hunt-the-hunter.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash } from "./fixtures.ts";

describe("Marked turn-history AAA", () => {
  it("HNT161 marks on hit after another real red card was played this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [enGardeRed, huntTheHunterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    game.as(bravo).play(enGardeRed);
    game.helpers.resolveUntilIdle();
    game.as(bravo).attackWith(huntTheHunterRed);
    game.passBoth();

    expect(game.getState().players[game.as(dash).id]!.marked).toBe(true);
    game.helpers.resolveRestOfCombat();
    expect(game.getState().players[game.as(dash).id]!.marked).toBe(false);
  });

  it("HNT161 does not mark without an earlier red play this turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [huntTheHunterRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    game.as(bravo).attackWith(huntTheHunterRed);
    game.passBoth();

    expect(game.getState().players[game.as(dash).id]!.marked).toBe(false);
  });
});
