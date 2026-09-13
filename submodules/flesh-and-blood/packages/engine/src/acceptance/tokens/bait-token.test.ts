/** SUP259 Bait — Aura with continuous restriction (can't play/activate owned cards) and attack. */
import { describe, expect, it } from "vitest";
import { bait } from "../../../../cards/src/cards/tokens/bait.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Bait token (SUP259)", () => {
  it("AAA: card loads into arena and restrict rule atom exists", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [bait], deck: 8, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Verify the card is in arena
    expect(Bravo.zone("arena")).toContain(bait.canonicalId);

    // Verify the restrict rule atom exists — the continuous effect from a1
    // ("You can't play or activate cards you own") should generate a rule
    // modification atom.
    const restrictionEvents = game
      .committedEvents()
      .filter((e) => e.name === "continuous-effect-generated");
    expect(restrictionEvents.length).toBeGreaterThanOrEqual(1);
  });
});
