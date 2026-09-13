/** TCC105 Might — next attack power at its controller's turn start. */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../rules/fixtures.ts";
import { might } from "../../../../cards/src/cards/tokens/might.ts";

describe("Might token (TCC105)", () => {
  it("AAA: destroys at its controller's turn start and gives the next attack +1 power", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [might], hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    Dash.endTurn();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(might.canonicalId);
    expect(game.getState().rulesProcess).toBeNull();
    expect(game.getState().phase).toBe("action");
    Bravo.play(snatchRed);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });
});
