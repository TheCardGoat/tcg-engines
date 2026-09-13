/**
 * CHN030 Soul Shackle — action-phase-start banish top of deck.
 *
 * Printed: At the beginning of your action phase, banish the top card of
 * your deck.
 *
 * Status: ⬜→✅ — action-phase-start trigger and banish-deck-top proven.
 * Card fix: trigger gains actor:"controller" ("your action phase").
 * Reuses ELE109 action-phase-start trigger + banish primitive.
 */
import { describe, expect, it } from "vitest";

import { soulShackle } from "../../../../cards/src/cards/tokens/soul-shackle.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Soul Shackle token (CHN030)", () => {
  it("AAA: banishes top card of deck at controller's action phase start", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [soulShackle], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;
    const banishedBefore = Bravo.zone("banished").length;

    // Cycle through turns to reach Bravo's next action phase.
    Bravo.endTurn(); // Dash's turn — must NOT trigger (actor is controller)
    const Dash = game.as(dash);
    Dash.endTurn(); // Bravo's turn — action-phase-start triggers
    game.passBoth();

    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);
    expect(Bravo.zone("banished").length).toBe(banishedBefore + 1);
    expect(Bravo.zone("arena")).toContain(soulShackle.canonicalId);
  });

  it("boundary: does not banish on opponent's action phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [soulShackle], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;

    // Bravo ends turn — Dash's action phase should NOT trigger
    // Bravo's Soul Shackle (actor = controller).
    Bravo.endTurn();
    game.passBoth();

    expect(Bravo.zone("deck").length).toBe(deckBefore);
    expect(Bravo.zone("arena")).toContain(soulShackle.canonicalId);
  });
});
