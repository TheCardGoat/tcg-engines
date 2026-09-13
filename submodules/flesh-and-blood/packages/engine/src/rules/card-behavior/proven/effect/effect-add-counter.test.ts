/**
 * AAA test for effect:add-counter.
 * Representative card: Optekal Monocle (ARC037) — Mechanologist Action Item.
 * Static continuous ability: "Enters the arena with 5 steam counters on it."
 * The replacement effect wraps an add-counter modification targeting self.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, cosmicFlareRed, dash, optekalMonocle } from "../../../fixtures.ts";

describe("effect: add-counter", () => {
  it("Arrange/Act/Assert: Optekal Monocle enters arena with 5 steam counters via replacement add-counter", () => {
    // Arrange — Bravo has Optekal Monocle (cost 0 Action Item) in hand.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [optekalMonocle], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — Play the item; it enters the arena and the replacement fires.
    Bravo.play(optekalMonocle);
    game.passBoth();

    // Assert — The card is in the arena with exactly 5 steam counters.
    expect(Bravo.zone("arena")).toContain(optekalMonocle.canonicalId);
    const id = Bravo.findCardInZone("arena", optekalMonocle);
    expect(id).toBeTruthy();
    expect(game.objectState(id)?.steamCounters).toBe(5);
  });

  it("AAA boundary: an Instant without add-counter resolves to graveyard with no steam counters", () => {
    // Arrange — Cosmic Flare is a Lightning Instant (no replacement, no counters).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act
    Bravo.play(cosmicFlareRed);
    game.passBoth();

    // Assert — Instant resolved to graveyard; never entered arena; no counters.
    expect(Bravo.zone("graveyard")).toContain(cosmicFlareRed.canonicalId);
    expect(Bravo.zone("arena")).not.toContain(cosmicFlareRed.canonicalId);
  });
});
