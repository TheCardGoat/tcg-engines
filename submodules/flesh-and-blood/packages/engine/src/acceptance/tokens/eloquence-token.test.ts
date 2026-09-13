/**
 * DTD233 Eloquence — non-attack-action play trigger destroys it and grants go again.
 *
 * CR 8.6.23 defines Eloquence; CR 8.3.5a restores the action point when go
 * again is an ability of a non-attack layer, so the grant is observed through
 * the returned action point after the played card resolves.
 */
import { describe, expect, it } from "vitest";

import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, potionOfStrengthBlue, snatchRed } from "../../rules/fixtures.ts";

import { eloquence } from "../../../../cards/src/cards/tokens/eloquence.ts";

describe("Eloquence token (DTD233)", () => {
  it("AAA: a non-attack action consumes Eloquence and the card gets go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [potionOfStrengthBlue], arena: [eloquence], deck: 6, actionPoints: 1 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.play(potionOfStrengthBlue);
    game.passBoth(); // resolves Eloquence's trigger (destroy + grant go again)
    game.passBoth(); // resolves the played card, refunding the action point

    expect(Bravo.zone("arena")).not.toContain(eloquence.canonicalId);
    // Go again on a non-attack layer returns the action point (CR 8.3.5a).
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundary: an attack action does not consume Eloquence or grant go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], arena: [eloquence], deck: 6, actionPoints: 1 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);

    expect(Bravo.zone("arena")).toContain(eloquence.canonicalId);
    // Snatch has no native go again; the boundary is the token surviving.
    expect(game.combat()?.activeLink?.keywords).not.toContain("go-again");
  });

  it("does not trigger when the opponent plays a non-attack action (CR 8.6.23)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [potionOfStrengthBlue], deck: 6, actionPoints: 1, resourcePoints: 3 },
      { hero: dash, arena: [eloquence], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(potionOfStrengthBlue);
    game.passBoth();
    game.passBoth();

    // Eloquence is controlled by Dash; Bravo's non-attack action must not consume it.
    expect(Dash.zone("arena")).toContain(eloquence.canonicalId);
  });
});
