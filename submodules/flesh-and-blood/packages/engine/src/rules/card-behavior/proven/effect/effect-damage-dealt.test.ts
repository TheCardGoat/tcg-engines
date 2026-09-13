/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: effect:damage-dealt
 * Representative card: packages/cards/src/cards/actions/written-in-the-stars.ts
 * Canonical id: q69qJCPFdP8PzL8rpNK9b
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
import { bravo, dash, nimblismBlue } from "../../../fixtures.ts";
import { writtenInTheStarsBlue } from "../../../../../../cards/src/cards/actions/written-in-the-stars.ts";

describe("effect: damage-dealt", () => {
  it("Arrange/Act/Assert: Written in the Stars creates token and the damage-dealt condition prevents draw without arcane damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [writtenInTheStarsBlue, nimblismBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );

    game.as(bravo).play(writtenInTheStarsBlue);
    // The default harness resolves this response-free stack window.

    // a1: Embodiment of Lightning token created unconditionally
    expect(game.as(bravo).zone("arena")).toContain("token:embodiment-of-lightning");

    // a2: No draw — no arcane damage was dealt this turn (condition false)
    // After playing one card, hand should have nimblismBlue left (no draw added a card)
    expect(game.as(bravo).handCount()).toBe(1);
  });
});
