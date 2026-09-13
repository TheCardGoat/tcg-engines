/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:play
 * Representative card: packages/cards/src/cards/heroes/jarl-vetrei-i.ts
 * Canonical id: 9QL68DDb9hCqhWWhgnQgR
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
import { channelGalciaSCradleBlue } from "../../../../../../cards/src/cards/actions/channel-galcia-s-cradle.ts";
import { jarlVetreiI } from "../../../../../../cards/src/cards/heroes/jarl-vetrei-i.ts";
import { bravo, nimblismBlue } from "../../../fixtures.ts";

describe("trigger: play", () => {
  it("Arrange/Act/Assert: Jarl creates Frostbite when its controller plays an Ice card", () => {
    // Arrange: Jarl is the real static trigger source and Channel Galcia is a real Ice card.
    const game = FabTestEngine.start(
      { hero: jarlVetreiI, hand: [channelGalciaSCradleBlue], deck: 6 },
      { hero: bravo, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    // Act: commit the card through the production play path.
    game.as(jarlVetreiI).play(channelGalciaSCradleBlue);
    game.passBoth(); // resolve the play triggered layer (create Frostbite).

    // Assert: structured trigger creates Frostbite in an exposed equipment zone
    // (first amongExposed seat = head), not the arena.
    const Opp = game.as(bravo);
    expect(Opp.zone("head").some((id) => /frostbite/i.test(id))).toBe(true);
    expect(Opp.zone("arena").some((id) => /frostbite/i.test(id))).toBe(false);
  });

  it("Arrange/Act/Assert: a non-Ice play does not match Jarl's structured filter", () => {
    const game = FabTestEngine.start(
      { hero: jarlVetreiI, hand: [nimblismBlue], deck: 6 },
      { hero: bravo, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(jarlVetreiI).play(nimblismBlue);
    const Opp = game.as(bravo);
    expect(Opp.zone("head").some((id) => /frostbite/i.test(id))).toBe(false);
    expect(Opp.zone("arena").some((id) => /frostbite/i.test(id))).toBe(false);
  });
});
