/** HVY240 Agility — next attack gets go again at its controller's turn start. */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../rules/fixtures.ts";
import { agility } from "../../../../cards/src/cards/tokens/agility.ts";

describe("Agility token (HVY240)", () => {
  it("AAA: destroys at its controller's turn start and gives the next attack go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [agility], hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    Dash.endTurn();
    game.passBoth();
    expect(Bravo.zone("arena")).not.toContain(agility.canonicalId);

    Bravo.play(snatchRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    expect(Bravo.actionPoints()).toBe(1);
  });
});
