/**
 * AAA test for activated draw with mixed cost.
 * Representative card: Blue Sea Tricorn (SEA126) — Pirate Head Equipment.
 * Defense 1, bladeBreak.
 * Activated (a1): "Action — {r}{r}{r}, destroy this: Draw a card. Go again"
 *   → activated: cost all(3 resources + destroy-self) → effect: draw { count: 1, player: controller }
 *
 * Verifies that paying the mixed resource + destroy-self cost draws 1 card and
 * moves the equipment to graveyard. Boundary: before activation it stays in head.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, blueSeaTricorn } from "../../../fixtures.ts";

describe("activated draw with mixed cost (Blue Sea Tricorn)", () => {
  it("AAA: activating Blue Sea Tricorn destroys it and draws 1 card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [blueSeaTricorn], deck: 6, resourcePoints: 3 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;

    Bravo.activate(blueSeaTricorn);

    // Equipment destroyed, deck shrank by 1.
    expect(Bravo.zone("head")).not.toContain(blueSeaTricorn.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(blueSeaTricorn.canonicalId);
    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);
  });

  it("AAA boundary: before activation the equipment is in the head zone", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [blueSeaTricorn], deck: 6, resourcePoints: 3 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("head")).toContain(blueSeaTricorn.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(blueSeaTricorn.canonicalId);
  });
});
