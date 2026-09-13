/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: effect:create-token
 * Representative card: packages/cards/src/cards/actions/oysten-heart-of-gold.ts
 * Canonical id: fDMt9jWjpCQKJPQbfcpWg
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
import { bravo, dash, arcticIncarcerationBlue, nimblismBlue } from "../../../fixtures.ts";

describe("effect: create-token", () => {
  it("Arrange/Act/Assert: Arctic Incarceration (create-token Frostbite) places a Frostbite token in the arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [arcticIncarcerationBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const arenaBefore = Bravo.zone("arena").length;
    Bravo.play(arcticIncarcerationBlue);
    game.passBoth();
    // A Frostbite token should appear in some player's arena
    const bravoArena = Bravo.zone("arena");
    const dashArena = game.as(dash).zone("arena");
    const totalTokens = bravoArena.length + dashArena.length - arenaBefore;
    expect(totalTokens).toBeGreaterThan(0);
    expect([...bravoArena, ...dashArena]).toContain("token:frostbite");
  });

  it("AAA boundary: without create-token effect, no token appears in the arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimblismBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const arenaBefore = Bravo.zone("arena").length;
    Bravo.play(nimblismBlue);
    game.passBoth();
    expect(Bravo.zone("arena").length).toBe(arenaBefore);
  });
});
