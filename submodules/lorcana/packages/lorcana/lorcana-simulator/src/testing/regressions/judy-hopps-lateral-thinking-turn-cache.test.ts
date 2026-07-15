import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { judyHoppsLeadDetective } from "@tcg/lorcana-cards/cards/010";

/**
 * Regression: Judy Hopps LATERAL THINKING condition evaluates stale registry across turn boundary.
 *
 * The static effect registry caches by G.staticEffectsVersion. When a player passes their
 * turn without questing or challenging, no card meta changes, so staticEffectsVersion was not
 * incremented. The cached registry from the previous turn (built with turnOwnerId = Player 1)
 * was then reused on Player 2's first move, causing Detective characters to incorrectly retain
 * Alert and Resist +2 during Player 2's turn.
 *
 * Fix: pass-turn.ts now bumps staticEffectsVersion whenever turnOwnerId changes.
 */

const detectiveCharacter = createMockCharacter({
  id: "test-detective-char",
  name: "Test Detective",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Detective"],
});

describe("LATERAL THINKING - Judy Hopps, Lead Detective - turn-conditional keyword grant cache regression", () => {
  it("Detective characters gain Alert during Judy's controller's turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [judyHoppsLeadDetective, detectiveCharacter],
        deck: 5,
      },
      { deck: 5 },
    );

    expect(engine.asPlayerOne().hasKeyword(detectiveCharacter, "Alert")).toBe(true);
    expect(engine.asPlayerOne().hasKeyword(detectiveCharacter, "Resist")).toBe(true);
    expect(engine.asPlayerOne().getKeywordValue(detectiveCharacter, "Resist")).toBe(2);
  });

  it("Detective characters lose Alert and Resist after Judy's controller passes turn without acting", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [judyHoppsLeadDetective, detectiveCharacter],
        deck: 5,
      },
      { deck: 5 },
    );

    // Confirm keywords are active on Player 1's turn
    expect(engine.asPlayerOne().hasKeyword(detectiveCharacter, "Alert")).toBe(true);
    expect(engine.asPlayerOne().hasKeyword(detectiveCharacter, "Resist")).toBe(true);

    // Player 1 passes without questing or challenging — all cards remain ready.
    // This is the exact scenario that triggered the cache staleness bug: no card meta
    // changes, so staticEffectsVersion was not bumped, and the stale registry (with
    // the turn condition evaluated as true) was served on Player 2's first move.
    engine.asPlayerOne().passTurn();

    // During Player 2's turn, Judy's condition ("during your turn") must be false.
    // The keywords must no longer apply to the Detective character.
    expect(engine.asPlayerOne().hasKeyword(detectiveCharacter, "Alert")).toBe(false);
    expect(engine.asPlayerOne().hasKeyword(detectiveCharacter, "Resist")).toBe(false);
    expect(engine.asPlayerOne().getKeywordValue(detectiveCharacter, "Resist")).toBeNull();
  });

  it("Detective characters regain Alert and Resist when the turn returns to Judy's controller", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [judyHoppsLeadDetective, detectiveCharacter],
        deck: 5,
      },
      { deck: 5 },
    );

    engine.asPlayerOne().passTurn();

    // During Player 2's turn — keywords must be absent
    expect(engine.asPlayerOne().hasKeyword(detectiveCharacter, "Alert")).toBe(false);

    engine.asPlayerTwo().passTurn();

    // Back to Player 1's turn — keywords must return
    expect(engine.asPlayerOne().hasKeyword(detectiveCharacter, "Alert")).toBe(true);
    expect(engine.asPlayerOne().hasKeyword(detectiveCharacter, "Resist")).toBe(true);
    expect(engine.asPlayerOne().getKeywordValue(detectiveCharacter, "Resist")).toBe(2);
  });
});
