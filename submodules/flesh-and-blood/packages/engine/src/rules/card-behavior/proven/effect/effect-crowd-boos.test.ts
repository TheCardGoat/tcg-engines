/**
 * AAA test for effect:crowd-boos.
 * Representative card: Villainous Pose (SUP120) — Reviled Action, cost 2.
 * Resolution effect: "The crowd boos you" → { type: "crowd-boos", target: "controller" }.
 * The engine reducer sets history.turn.crowdBooed = true (once per turn).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, cosmicFlareRed, dash, villainousPoseRed } from "../../../fixtures.ts";

describe("effect: crowd-boos", () => {
  it("Arrange/Act/Assert: Villainous Pose (crowd-boos controller) sets crowdBooed flag when played", () => {
    // Arrange — Bravo has Villainous Pose and enough resources to pay cost 2.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [villainousPoseRed], deck: 4, resourcePoints: 2 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — Play the action and let the stack resolve (crowd-boos fires on resolution).
    Bravo.play(villainousPoseRed);
    game.passBoth();

    // Assert — The crowd-boos event set the per-turn flag on the controller.
    const player = game.getState().players[Bravo.id];
    expect(player?.history?.turn?.crowdBooed).toBe(true);
  });

  it("AAA boundary: without crowd-boos, the flag stays false", () => {
    // Arrange — Cosmic Flare is a Lightning Instant with gain-resources (no crowd-boos).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act
    Bravo.play(cosmicFlareRed);
    game.passBoth();

    // Assert — No crowd-boos occurred.
    const player = game.getState().players[Bravo.id];
    expect(player?.history?.turn?.crowdBooed).toBe(false);
  });
});
