/** DTD232 Courage — Errata Bulletin #5 attack-action and weapon triggers. */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../rules/fixtures.ts";
import { courage } from "../../../../cards/src/cards/tokens/courage.ts";

describe("Courage token (DTD232)", () => {
  it("AAA: an attack action consumes Courage and gives that attack +1 power", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], arena: [courage], deck: 6, actionPoints: 1 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);

    expect(Bravo.zone("arena")).not.toContain(courage.canonicalId);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("AAA: a weapon attack consumes Courage and gives its resulting attack +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        arena: [courage],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(dawnblade);
    game.passBoth();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(courage.canonicalId);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });
});
