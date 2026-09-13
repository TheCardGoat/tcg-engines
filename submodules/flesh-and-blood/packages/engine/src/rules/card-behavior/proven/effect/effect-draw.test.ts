/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: effect:draw
 * Representative card: packages/cards/src/cards/equipment/target-totalizer.ts
 * Canonical id: QBPpDnWkrTkRMnJBkjHLq
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
import {
  bravo,
  dash,
  nimblismRed,
  tomeOfFyendalYellow,
  cosmicFlareRed,
} from "../../../fixtures.ts";

describe("effect: draw", () => {
  it("Arrange/Act/Assert: Tome of Fyendal (draw 2) reduces deck by exactly 2 when played", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tomeOfFyendalYellow, nimblismRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;
    Bravo.play(tomeOfFyendalYellow);
    // The default harness resolves this response-free stack window.
    expect(Bravo.zone("deck").length).toBe(deckBefore - 2);
  });

  it("AAA boundary: without draw effect, playing a card does not change deck size", () => {
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
