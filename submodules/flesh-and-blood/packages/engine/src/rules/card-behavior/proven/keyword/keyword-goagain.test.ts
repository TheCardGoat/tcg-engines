/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:goAgain
 * Representative card: packages/cards/src/cards/actions/line-it-up.ts
 * Canonical id: htRtFwB8MhppFMqwLnNzK
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
import { bravo, dash, scourTheBattlescapeRed, snatchRed } from "../../../fixtures.ts";

describe("keyword: goAgain", () => {
  it("AAA — Arrange: real go-again attack and follow-up attack; Act: resolve both through FabTestEngine; Assert: AP is retained then spent", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arsenal: [scourTheBattlescapeRed], hand: [snatchRed], deck: 8 },
      { hero: dash, life: 20, deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(scourTheBattlescapeRed, { from: "arsenal" });
    game.helpers.resolveRestOfCombat();

    expect(game.as(bravo).actionPoints()).toBe(1);
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).actionPoints()).toBe(0);
  });

  it("AAA — boundary: a card without go-again does not retain an action point", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 8 },
      { hero: dash, life: 20, deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).actionPoints()).toBe(0);
  });
});
