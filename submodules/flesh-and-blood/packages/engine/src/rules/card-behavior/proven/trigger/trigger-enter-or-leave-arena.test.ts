/**
 * AAA test for trigger:enter-or-leave-arena.
 * Representative card: Superstar (APS024) — Revered Guardian Instant Aura, cost 1.
 * Has the `suspense` keyword (aura enters arena with suspense counters) and a
 * triggered ability: "When this enters or leaves the arena, the crowd cheers you."
 * The crowd-cheers producer was previously blocked; it is now supported.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, cosmicFlareRed, dash, superstarBlue } from "../../../fixtures.ts";

describe("trigger: enter-or-leave-arena", () => {
  it("Arrange/Act/Assert: Superstar enters arena → crowd-cheers controller flag set", () => {
    // Arrange — Bravo has Superstar (Instant Aura with suspense) and 1 resource.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [superstarBlue], deck: 4, resourcePoints: 1 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — Play the instant aura; it enters the arena, firing the trigger.
    Bravo.play(superstarBlue);

    // Assert — The enter-or-leave-arena trigger fired crowd-cheers on the controller.
    const player = game.getState().players[Bravo.id];
    expect(player?.history?.turn?.crowdCheered).toBe(true);
  });

  it("AAA boundary: a non-aura card does not trigger enter-or-leave-arena", () => {
    // Arrange — Cosmic Flare is a Lightning Instant (not an aura, no arena trigger).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act
    Bravo.play(cosmicFlareRed);

    // Assert — No crowd-cheers from a non-aura card.
    const player = game.getState().players[Bravo.id];
    expect(player?.history?.turn?.crowdCheered).toBe(false);
  });
});
