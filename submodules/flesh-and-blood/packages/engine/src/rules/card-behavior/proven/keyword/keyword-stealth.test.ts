/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:stealth
 * Representative card: packages/cards/src/cards/actions/creep.ts
 * Canonical id: 77dWGRQb88WqJDbh6dtcd
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
import { bravo, creepRed, dash } from "../../../fixtures.ts";

describe("keyword: stealth", () => {
  it("AAA — Arrange: real Creep (stealth, power 3) in hand; Act: play it and resolve combat undefended; Assert: stealth is a noop keyword and deals printed damage", () => {
    expect(baseHasKeyword(toFabCardDefinition(creepRed), "stealth")).toBe(true);
    const game = FabTestEngine.start(
      { hero: bravo, hand: [creepRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(creepRed);
    game.helpers.resolveRestOfCombat();
    // Stealth is a noop — attack deals its printed 3 power as damage.
    expect(game.as(dash).life()).toBe(17);
  });
});
