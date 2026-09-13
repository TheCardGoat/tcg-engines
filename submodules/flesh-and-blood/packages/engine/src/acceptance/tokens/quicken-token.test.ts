/** RNR031 Quicken — Errata Bulletin #5 attack-action and weapon triggers. */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../rules/fixtures.ts";

import { quicken } from "../../../../cards/src/cards/tokens/quicken.ts";

describe("Quicken token (RNR031)", () => {
  it("AAA: playing an attack action destroys Quicken and grants that attack go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], arena: [quicken], deck: 6, actionPoints: 1 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);

    expect(Bravo.zone("arena")).not.toContain(quicken.canonicalId);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("AAA: activating a weapon attack also destroys Quicken and grants the attack go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        arena: [quicken],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(dawnblade);
    // First pair resolves Quicken's triggered layer; the second resolves the
    // still-stacked Dawnblade activation into its combat attack.
    game.passBoth();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(quicken.canonicalId);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });
});
