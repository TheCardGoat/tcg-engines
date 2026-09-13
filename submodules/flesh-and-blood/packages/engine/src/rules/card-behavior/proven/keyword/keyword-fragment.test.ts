/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:fragment
 * Representative card: packages/cards/src/cards/actions/blink-of-an-eye.ts
 * Canonical id: Cmf8GkhNpRqdpkwLg9RnK
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
import { bravo, dash, frayingLifeforceRed, nimblismBlue } from "../../../fixtures.ts";

describe("keyword: fragment", () => {
  it("AAA — Arrange: real Fraying Lifeforce (fragment) with a pitch card and a 2+ defense blocker; Act: play, pitch, block; Assert: power reduced by 2 and fragment triggers (gain 1 life)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        hand: [frayingLifeforceRed, nimblismBlue],
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(frayingLifeforceRed, {
      target: game.as(dash).id,
      pitch: [nimblismBlue],
    });
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.as(dash).blockWith(nimblismBlue);
    // Fragment: 2+ defense block reduces power by 2.
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.passBoth(); // resolve fragment triggered layer (gain 1 life).
    expect(game.as(bravo).life()).toBe(21);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(17);
  });

  it("AAA — boundary: no block → no fragment trigger and no power reduction", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        hand: [frayingLifeforceRed, nimblismBlue],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(frayingLifeforceRed, {
      target: game.as(dash).id,
      pitch: [nimblismBlue],
    });
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).life()).toBe(20);
    expect(game.as(dash).life()).toBe(13);
  });
});
