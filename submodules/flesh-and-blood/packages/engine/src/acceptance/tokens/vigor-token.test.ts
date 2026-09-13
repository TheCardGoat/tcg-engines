/** TCC107 Vigor — start-of-turn destroy then gain-resource acceptance. */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";
import { vigor } from "../../../../cards/src/cards/tokens/vigor.ts";

describe("Vigor token (TCC107)", () => {
  it("AAA: destroys itself and grants one resource only at its controller's next turn start", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [vigor], deck: 6, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Vigor must persist through the opponent's turn.
    Bravo.endTurn();
    expect(Bravo.zone("arena")).toContain(vigor.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);

    Dash.endTurn();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(vigor.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);
  });
});
