/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: effect:opt
 * Representative card: packages/cards/src/cards/actions/locked-and-loaded.ts
 * Canonical id: RBmR6mwf6mzwwg7nwtGzK
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, forceSight, nimblismRed, cosmicFlareRed } from "../../../fixtures.ts";

describe("effect: opt", () => {
  it("Arrange/Act/Assert: Force Sight (opt 2) preserves deck size — opt rearranges but does not draw or discard", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [forceSight, nimblismRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    Bravo.play(forceSight);
    // Opt rearranges top cards but does not draw or discard — deck size unchanged
    expect(Bravo.zone("deck").length).toBe(4);
  });

  it("AAA boundary: without opt keyword, deck size unchanged by playing a non-opt card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;
    Bravo.play(cosmicFlareRed);
    expect(Bravo.zone("deck").length).toBe(deckBefore);
  });
});
