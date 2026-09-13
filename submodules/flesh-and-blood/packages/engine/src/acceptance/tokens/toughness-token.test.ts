/** APS032 Toughness — next defending action gets +1 Defense. */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../rules/fixtures.ts";
import { toughness } from "../../../../cards/src/cards/tokens/toughness.ts";

describe("Toughness token (APS032)", () => {
  it("AAA: destroys at opponent turn start and gives the next defending action +1 Defense", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [toughness], hand: [nimblismBlue], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Bravo.life();

    Bravo.endTurn();
    game.passBoth();
    expect(Bravo.zone("arena")).not.toContain(toughness.canonicalId);

    Dash.play(snatchRed);
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.step).toBe("defend");
    Bravo.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.life()).toBe(lifeBefore - 1);
  });
});
