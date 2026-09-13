/** FAB165 Diamond — action self-destroy draws a card and grants go again. */
import { describe, expect, it } from "vitest";

import { diamond } from "../../../../cards/src/cards/tokens/diamond.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Diamond token (FAB165)", () => {
  it("AAA: destroy self to draw a card with go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [diamond], actionPoints: 1, deck: 8 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.handCount();

    Bravo.activate(diamond);
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(diamond.canonicalId);
    expect(Bravo.handCount()).toBe(handBefore + 1);
    expect(Bravo.actionPoints()).toBe(1); // go again refunds the action point
  });
});
