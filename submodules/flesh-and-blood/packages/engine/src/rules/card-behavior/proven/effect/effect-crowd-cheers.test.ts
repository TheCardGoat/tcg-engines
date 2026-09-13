/**
 * AAA test for effect:crowd-cheers.
 * Representative card: Heroic Pose (SUP059) — Revered Action, cost 1, go again.
 * Resolution effect: "The crowd cheers you" → { type: "crowd-cheers", target: "controller" }.
 * The engine reducer sets history.turn.crowdCheered = true (once per turn).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, cosmicFlareRed, dash, heroicPoseBlue } from "../../../fixtures.ts";

describe("effect: crowd-cheers", () => {
  it("Arrange/Act/Assert: Heroic Pose (crowd-cheers controller) sets crowdCheered flag when played", () => {
    // Arrange — Bravo has Heroic Pose and 1 resource to pay the cost.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [heroicPoseBlue], deck: 4, resourcePoints: 1 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — Play the action and let the stack resolve.
    Bravo.play(heroicPoseBlue);
    game.passBoth();

    // Assert — The crowd-cheers event set the per-turn flag on the controller.
    const player = game.getState().players[Bravo.id];
    expect(player?.history?.turn?.crowdCheered).toBe(true);
  });

  it("AAA boundary: without crowd-cheers, the flag stays false", () => {
    // Arrange — Cosmic Flare is a Lightning Instant with gain-resources (no crowd-cheers).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act
    Bravo.play(cosmicFlareRed);
    game.passBoth();

    // Assert — No crowd-cheers occurred.
    const player = game.getState().players[Bravo.id];
    expect(player?.history?.turn?.crowdCheered).toBe(false);
  });
});
