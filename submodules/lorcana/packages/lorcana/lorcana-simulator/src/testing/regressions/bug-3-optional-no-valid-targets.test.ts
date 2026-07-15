import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cheshireCatPerplexingFeline } from "@tcg/lorcana-cards/cards/007";

/**
 * BUG-3: Optional effects with owner:"any" + filter create a stuck target-selection prompt
 * when 0 valid targets exist.
 *
 * Cheshire Cat - Perplexing Feline (set 7, #91):
 * MAD GRIN: "When you play this character, you may deal 2 damage to chosen damaged character."
 * Effect: optional → deal-damage with owner:"any", filters:[{type:"damaged"}]
 *
 * Bug: when no damaged characters exist, the optional bag effect is presented to the player,
 * but if the player accepts it, they receive a target-selection prompt with 0 candidates
 * (a "stuck" state from which they cannot proceed).
 *
 * Fix: at bag-decision time, remove the owner:"any" early bail-out in optional-skip-analysis.ts
 * so that hasUnfillableChosenSlot correctly analyses all filters (including "damaged").
 * When no valid targets exist, bagEffectNeedsPlayerDecision returns false, causing the bag
 * to auto-resolve without requiring player input.
 *
 * Note: the bag entry IS still created (CR 6.2.3 compliance — triggers enter the bag even
 * with no valid targets). The fix is that the bag auto-drains without prompting, so no
 * stuck prompt appears.
 */
describe("BUG-3 — Cheshire Cat MAD GRIN auto-resolves when no damaged characters exist", () => {
  const undamagedOpponent = createMockCharacter({
    id: "bug3-undamaged-opponent",
    name: "Undamaged Opponent",
    cost: 2,
    strength: 2,
    willpower: 5,
    lore: 1,
  });

  const damagedOpponent = createMockCharacter({
    id: "bug3-damaged-opponent",
    name: "Damaged Opponent",
    cost: 2,
    strength: 2,
    willpower: 6,
    lore: 1,
  });

  it("MAD GRIN auto-resolves with no stuck prompt when no damaged characters exist", () => {
    // No damaged characters on either side
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cheshireCatPerplexingFeline],
        inkwell: cheshireCatPerplexingFeline.cost,
      },
      {
        play: [undamagedOpponent],
      },
    );

    expect(testEngine.asPlayerOne().playCard(cheshireCatPerplexingFeline)).toBeSuccessfulCommand();

    // The bag entry auto-resolves — no player input is required, no stuck prompt appears.
    // After auto-resolution the bag should be empty.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    const board = testEngine.asLorcanaPlayerOne().getBoard();
    expect(board.pendingChoice).toBeUndefined();

    // Undamaged character should remain undamaged
    expect(testEngine.asPlayerTwo().getDamage(undamagedOpponent)).toBe(0);
  });

  it("MAD GRIN auto-resolves when there are no characters in play at all", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cheshireCatPerplexingFeline],
        inkwell: cheshireCatPerplexingFeline.cost,
      },
      { deck: 2 },
    );

    expect(testEngine.asPlayerOne().playCard(cheshireCatPerplexingFeline)).toBeSuccessfulCommand();

    // No damaged characters at all — bag auto-resolves with no player interaction.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    const board = testEngine.asLorcanaPlayerOne().getBoard();
    expect(board.pendingChoice).toBeUndefined();
  });

  it("shows a bag prompt when at least one damaged character exists", () => {
    // damagedOpponent has 1 pre-existing damage
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cheshireCatPerplexingFeline],
        inkwell: cheshireCatPerplexingFeline.cost,
      },
      {
        play: [{ card: damagedOpponent, damage: 1 }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(cheshireCatPerplexingFeline)).toBeSuccessfulCommand();

    // There IS a damaged character, so the optional effect should be presented.
    // The engine merges the optional + target-selection into a single "target-selection" prompt
    // when there are valid candidates (the optional is accepted implicitly and target is requested).
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffects.length).toBe(1);
    // Selection context is present — player must resolve this bag effect
    expect(bagEffects[0]?.selectionContext).toBeDefined();
  });
});
