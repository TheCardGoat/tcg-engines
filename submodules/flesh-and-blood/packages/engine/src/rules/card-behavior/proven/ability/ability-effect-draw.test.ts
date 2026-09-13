/**
 * AAA test for effect:draw.
 * Representative card: Cerebellum Processor Blue (AIO026) — Mechanologist Item.
 * Cost 0, enters arena with 2 steam counters.
 * Activated ability (a3): "Once per Turn Action — 0: Draw a card."
 *   → activated: cost resources 0, limit once/turn → effect: draw { count: 1, player: controller }
 *
 * Verifies that activating the item draws exactly 1 card from the deck.
 * Boundary: the once-per-turn limit prevents a second activation from drawing.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, cerebellumProcessorBlue } from "../../../fixtures.ts";

describe("effect: draw (Cerebellum Processor Blue)", () => {
  it("AAA: activating Cerebellum Processor draws 1 card from the deck", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [cerebellumProcessorBlue], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;

    Bravo.activate(cerebellumProcessorBlue);

    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);
  });

  it("AAA boundary: the item remains in the arena after activation (once per turn limit)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [cerebellumProcessorBlue], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(cerebellumProcessorBlue);
    const deckAfter1 = Bravo.zone("deck").length;

    // Second activation in the same turn should be blocked by once-per-turn.
    expect(() => Bravo.activate(cerebellumProcessorBlue)).toThrow();
    expect(Bravo.zone("deck").length).toBe(deckAfter1);
    expect(Bravo.zone("arena")).toContain(cerebellumProcessorBlue.canonicalId);
  });
});
