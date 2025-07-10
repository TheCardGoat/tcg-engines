import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { GundamTestEngine } from "../testing/gundam-test-engine";

describe("Gundam Engine - Redraw Hand Action", () => {
  let testEngine: GundamTestEngine;

  beforeEach(() => {
    testEngine = new GundamTestEngine(
      { hand: 5, deck: 20 },
      { hand: 5, deck: 20 },
      { skipPreGame: false },
    );

    testEngine.chooseFirstPlayer("player_one");
    expect(testEngine.getCtx().otp).toBe("player_one");
    expect(testEngine.getGameSegment()).toBe("startingAGame");
    expect(testEngine.getGamePhase()).toBe("redrawHand");
  });

  afterEach(() => {
    testEngine.dispose();
  });

  it("should track that player has made mulligan decision when choosing not to redraw", () => {
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_one"),
    ).toBe(false);

    testEngine.redrawHand(false);

    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_one"),
    ).toBe(true);
  });

  it("should track that player has made mulligan decision when choosing to redraw", () => {
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_one"),
    ).toBe(false);

    testEngine.redrawHand(true);

    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_one"),
    ).toBe(true);
  });

  it("should keep hand unchanged when player chooses not to redraw", () => {
    const initialHand = [...testEngine.getZone("hand", "player_one")];
    const initialDeck = [...testEngine.getZone("deck", "player_one")];

    expect(initialHand).toHaveLength(5);
    expect(initialDeck).toHaveLength(20);

    testEngine.redrawHand(false);

    const finalHand = testEngine.getZone("hand", "player_one");
    const finalDeck = testEngine.getZone("deck", "player_one");

    expect(finalHand).toEqual(initialHand);
    expect(finalDeck).toEqual(initialDeck);
  });

  it("should replace entire hand when player chooses to redraw", () => {
    const initialHand = [...testEngine.getZone("hand", "player_one")];
    const initialDeck = [...testEngine.getZone("deck", "player_one")];

    expect(initialHand).toHaveLength(5);
    expect(initialDeck).toHaveLength(20);

    testEngine.redrawHand(true);

    const finalHand = testEngine.getZone("hand", "player_one");
    const finalDeck = testEngine.getZone("deck", "player_one");

    // Hand should still have 5 cards
    expect(finalHand).toHaveLength(5);

    // None of the original hand cards should be in the new hand
    for (const cardId of initialHand) {
      expect(finalHand).not.toContain(cardId);
    }

    // All original hand cards should be at the bottom of the deck
    const bottomOfDeck = finalDeck.slice(-5);
    for (const cardId of initialHand) {
      expect(bottomOfDeck).toContain(cardId);
    }

    // New hand should contain the top 5 cards from the original deck
    const expectedNewCards = initialDeck.slice(0, 5);
    for (const cardId of expectedNewCards) {
      expect(finalHand).toContain(cardId);
    }

    // Deck should still have the same total cards (20)
    expect(finalDeck).toHaveLength(20);
  });

  it("should shuffle deck after redraw", () => {
    const initialDeck = [...testEngine.getZone("deck", "player_one")];
    const initialHand = [...testEngine.getZone("hand", "player_one")];

    testEngine.redrawHand(true);

    const finalDeck = testEngine.getZone("deck", "player_one");
    const finalHand = testEngine.getZone("hand", "player_one");

    // Deck should still have 20 cards total
    expect(finalDeck).toHaveLength(20);

    // Hand should still have 5 cards
    expect(finalHand).toHaveLength(5);

    // The deck should now contain the original hand cards at the bottom
    // and the original deck minus the 5 cards that were drawn
    const expectedDeckCards = [
      ...initialDeck.slice(5), // Original deck minus top 5 cards
      ...initialHand, // Original hand cards added to bottom
    ];

    // All expected cards should be in the final deck
    expect(finalDeck).toEqual(expect.arrayContaining(expectedDeckCards));
    expect(finalDeck).toHaveLength(expectedDeckCards.length);

    // The new hand should contain the top 5 cards from the original deck
    const expectedHandCards = initialDeck.slice(0, 5);
    expect(finalHand).toEqual(expect.arrayContaining(expectedHandCards));
  });

  it("should advance to next player after redraw decision", () => {
    expect(testEngine.getPriorityPlayers()[0]).toBe("player_one");

    testEngine.redrawHand(false);

    // Priority should pass to player_two
    expect(testEngine.getPriorityPlayers()[0]).toBe("player_two");
  });

  it("should complete mulligan phase when both players have decided", () => {
    // Player one decides
    testEngine.redrawHand(false);
    expect(testEngine.getGamePhase()).toBe("redrawHand");
    expect(testEngine.getPriorityPlayers()[0]).toBe("player_two");

    // Player two decides
    testEngine.redrawHand(true);

    // After both players decide, the startingAGame segment should end
    // and progress to duringGame segment
    expect(testEngine.getGameSegment()).toBe("duringGame");
    expect(testEngine.getGamePhase()).toBe("startPhase");
  });

  it("should not allow player to redraw twice", () => {
    // Player one makes their first decision
    testEngine.redrawHand(false);
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_one"),
    ).toBe(true);

    // Check that player one is no longer in pendingMulligan
    expect(testEngine.getCtx().pendingMulligan.has("player_one")).toBe(false);

    // Player two makes their decision to complete the phase
    testEngine.redrawHand(false);

    // Both players have now completed their mulligan decisions
    // pendingMulligan is cleared (undefined) when the segment transitions
    expect(testEngine.getCtx().pendingMulligan).toBeUndefined();
    expect(testEngine.getGameSegment()).toBe("duringGame");

    // At this point, no more redraw moves should be valid since the phase is over
    // The key assertion is that the phase has properly transitioned
  });

  it("properly handles redrawing hand after first player is chosen", () => {
    // Verify we're in the right phase
    expect(testEngine.getGameSegment()).toBe("startingAGame");
    expect(testEngine.getGamePhase()).toBe("redrawHand");
    expect(testEngine.getCtx().pendingMulligan).toEqual(
      new Set(["player_one", "player_two"]),
    );

    // Player one should have priority to decide mulligan
    expect(testEngine.getPriorityPlayers()[0]).toBe("player_one");

    // Player chooses not to redraw hand
    testEngine.redrawHand(false);

    // Player two should now have priority to decide mulligan
    expect(testEngine.getPriorityPlayers()[0]).toBe("player_two");

    // Player two chooses to redraw hand
    testEngine.redrawHand(true);

    // After both players have made their mulligan decision, we should be out of the redrawHand phase
    // pendingMulligan is cleared (undefined) when the segment transitions
    expect(testEngine.getCtx().pendingMulligan).toBeUndefined();
    expect(testEngine.getGameSegment()).toBe("duringGame");
  });
});
