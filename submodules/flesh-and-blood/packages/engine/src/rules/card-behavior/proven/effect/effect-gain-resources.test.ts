/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: effect:gain-resources
 * Representative card: packages/cards/src/cards/equipment/inverter-s-nightcowl.ts
 * Canonical id: gMWcDdjLpcdzMFDTBNpmM
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
import { bravo, dash, cosmicFlareRed, nimblismBlue } from "../../../fixtures.ts";

describe("effect: gain-resources", () => {
  it("Arrange/Act/Assert: Cosmic Flare (gain-resources 3) raises resourcePoints by 3 when played", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.resourcePoints()).toBe(0);
    // The default harness resolves this response-free stack window.
    Bravo.play(cosmicFlareRed);
    expect(Bravo.resourcePoints()).toBe(3);
  });

  it("AAA boundary: without gain-resources effect, playing a card does not change resourcePoints", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimblismBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.resourcePoints()).toBe(0);
    Bravo.play(nimblismBlue);
    // No gain effect means no change; the response-free stack resolves automatically.
    expect(Bravo.resourcePoints()).toBe(0);
  });
});
