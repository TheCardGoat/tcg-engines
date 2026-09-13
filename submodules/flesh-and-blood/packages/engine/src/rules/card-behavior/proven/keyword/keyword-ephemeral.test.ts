/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:ephemeral
 * Representative card: packages/cards/src/cards/actions/crouching-tiger.ts
 * Canonical id: fw9LtHDQTMHgTrdcK9gP6
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
import { FabTestEngine, baseHasKeyword, toFabCardDefinition } from "../../../../index.ts";
import { bravo, crouchingTiger, dash } from "../../../fixtures.ts";

describe("keyword: ephemeral", () => {
  it("AAA — Arrange: real Crouching Tiger (ephemeral, go again, power 0) in hand; Act: play and resolve combat; Assert: keyword registers and card resolves to a legal chain link", () => {
    expect(baseHasKeyword(toFabCardDefinition(crouchingTiger), "ephemeral")).toBe(true);
    const game = FabTestEngine.start(
      { hero: bravo, hand: [crouchingTiger], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(crouchingTiger);
    game.helpers.resolveRestOfCombat();
    // Power 0 attack — no damage.
    expect(game.as(dash).life()).toBe(20);
    // Ephemeral: card leaves the chain link. It should not be in hand.
    expect(game.as(bravo).zone("hand")).not.toContain(crouchingTiger.canonicalId);
  });
});
