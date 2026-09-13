/**
 * AAA test for effect:discard-self.
 * Representative card: Gleam of the Blade (AHA008) — Warrior Attack Reaction.
 * Instant activated ability: "Discard this: Create a Flurry token."
 * Cost: discard-self. Tests that the discard-self cost moves the card from
 * hand to graveyard as part of activating the ability.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, gleamOfTheBladeRed, nimblismBlue } from "../../../fixtures.ts";

describe("effect: discard-self", () => {
  it("Arrange/Act/Assert: activating the Instant ability discards Gleam of the Blade from hand", () => {
    // Arrange — Bravo has Gleam of the Blade in hand.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [gleamOfTheBladeRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.handCount()).toBe(1);

    // Act — Activate the Instant ability (cost: discard-self).
    // The default harness resolves this response-free stack window.
    Bravo.activate(gleamOfTheBladeRed);

    // Assert — The card was discarded (moved from hand to graveyard).
    expect(Bravo.handCount()).toBe(0);
    expect(Bravo.zone("graveyard")).toContain(gleamOfTheBladeRed.canonicalId);
  });

  it("AAA boundary: a different card in hand is not discarded when Gleam is activated", () => {
    // Arrange — Bravo has Gleam of the Blade plus another card in hand.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [gleamOfTheBladeRed, nimblismBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — Activate the Instant ability.
    Bravo.activate(gleamOfTheBladeRed);

    // Assert — Only Gleam was discarded; nimblismBlue stays in hand.
    expect(Bravo.handCount()).toBe(1);
    expect(Bravo.hand()).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(gleamOfTheBladeRed.canonicalId);
  });
});
