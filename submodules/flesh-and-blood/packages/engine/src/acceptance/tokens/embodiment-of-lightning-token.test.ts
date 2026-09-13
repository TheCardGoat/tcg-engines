/** ELE110 Embodiment of Lightning — attack action trigger destroys it and grants go again. */
import { describe, expect, it } from "vitest";

import { embodimentOfLightning } from "../../../../cards/src/cards/tokens/embodiment-of-lightning.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../rules/fixtures.ts";

describe("Embodiment of Lightning token (ELE110)", () => {
  it("AAA: consumes on an attack action and grants that attack go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], arena: [embodimentOfLightning], deck: 8 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);

    expect(Bravo.zone("arena")).not.toContain(embodimentOfLightning.canonicalId);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundary: a non-attack action does not consume the token or grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismBlue],
        arena: [embodimentOfLightning],
        deck: 8,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimblismBlue);
    game.passBoth();

    expect(Bravo.zone("arena")).toContain(embodimentOfLightning.canonicalId);
    expect(game.combat()).toBeNull();
  });
});
