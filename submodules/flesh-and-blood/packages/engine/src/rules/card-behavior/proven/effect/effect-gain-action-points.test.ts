/**
 * AAA test for effect:gain-action-points.
 * Representative card: Blink (ELE176) — Lightning Instant, cost 0, resolution
 * effect: gain-action-points 1. Instants do not consume AP, so the net result
 * is a pure +1 AP.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { blinkBlue, bravo, cosmicFlareRed, dash } from "../../../fixtures.ts";

describe("effect: gain-action-points", () => {
  it("Arrange/Act/Assert: Blink (gain-action-points 1) raises actionPoints by exactly 1 when played", () => {
    // Arrange — Bravo starts a turn with 1 AP (default) and Blink in hand.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [blinkBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const apBefore = Bravo.actionPoints();

    // Act — Play the instant (0 cost, does not consume AP); the response-free
    // stack resolves under the default harness policy.
    Bravo.play(blinkBlue);

    // Assert — The gain-action-points effect added exactly 1 AP.
    expect(Bravo.actionPoints()).toBe(apBefore + 1);
  });

  it("AAA boundary: without gain-action-points, playing an instant does not change AP", () => {
    // Arrange — Cosmic Flare is a Lightning Instant with gain-resources, no AP.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const apBefore = Bravo.actionPoints();

    // Act — Play Cosmic Flare; the response-free stack resolves automatically.
    Bravo.play(cosmicFlareRed);

    // Assert — AP unchanged (no gain-action-points effect).
    expect(Bravo.actionPoints()).toBe(apBefore);
  });
});
