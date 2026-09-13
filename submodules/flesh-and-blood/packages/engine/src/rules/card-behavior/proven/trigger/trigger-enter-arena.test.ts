/**
 * AAA test for trigger:enter-arena.
 * Representative card: Concealed Object (SUP097) — Reviled Instant Item.
 * Static triggered ability: "When this enters the arena, the crowd boos you."
 * The enter-arena event fires the crowd-boos effect targeting controller.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "../../../../index.ts";
import { bravo, concealedObjectBlue, cosmicFlareRed, dash } from "../../../fixtures.ts";

describe("trigger: enter-arena", () => {
  it("Arrange/Act/Assert: Concealed Object enter-arena trigger fires crowd-boos on controller", () => {
    // Arrange — Bravo has Concealed Object (cost 0 Instant Item) in hand.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [concealedObjectBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — Play the item; it enters the arena and the enter-arena trigger fires.
    Bravo.play(concealedObjectBlue);

    // Assert — The card is in the arena and the trigger set crowdBooed.
    expectFabCard(Bravo, concealedObjectBlue).toBeIn("arena");
    const player = game.getState().players[Bravo.id];
    expect(player?.history?.turn?.crowdBooed).toBe(true);
  });

  it("AAA boundary: a card without enter-arena trigger does not set crowdBooed", () => {
    // Arrange — Cosmic Flare is a Lightning Instant (no enter-arena trigger).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act
    Bravo.play(cosmicFlareRed);

    // Assert — No enter-arena trigger; crowdBooed stays false.
    const player = game.getState().players[Bravo.id];
    expect(player?.history?.turn?.crowdBooed).toBe(false);
  });
});
