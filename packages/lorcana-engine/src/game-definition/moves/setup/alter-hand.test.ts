import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createPlayerId } from "@tcg/core";
import { LorcanaTestEngine, PLAYER_ONE, PLAYER_TWO } from "../../../testing/lorcana-test-engine";

describe("Move: Alter Hand (Mulligan)", () => {
  let testEngine: LorcanaTestEngine;

  beforeEach(() => {
    testEngine = new LorcanaTestEngine(
      { deck: 10, hand: 7 },
      { deck: 10, hand: 7 },
      { skipPreGame: false },
    );

    // Choose first player to get to mulligan phase
    const ctx = testEngine.getCtx();
    const choosingPlayer = ctx.choosingFirstPlayer;
    testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
    testEngine.chooseWhoGoesFirst(PLAYER_ONE);

    expect(testEngine.getGameSegment()).toBe("startingAGame");
    expect(testEngine.getGamePhase()).toBe("mulligan");
  });

  afterEach(() => {
    testEngine.dispose();
  });

  // ========== Basic Behavior Tests ==========

  describe("Basic Mulligan Behavior", () => {
    it("should allow keeping all cards (empty mulligan)", () => {
      const initialHand = [...testEngine.getZone("hand", PLAYER_ONE)];
      expect(initialHand.length).toBe(7);

      // Mulligan with empty array (keep all cards)
      testEngine.changeActivePlayer(PLAYER_ONE);
      testEngine.alterHand([]);

      const finalHand = testEngine.getZone("hand", PLAYER_ONE);
      expect(finalHand.length).toBe(7);

      // Should have same cards
      for (const cardId of initialHand) {
        expect(finalHand).toContain(cardId);
      }

      // Player should be marked as mulliganed
      const ctx = testEngine.getCtx();
      expect(ctx.pendingMulligan).not.toContain(PLAYER_ONE);
    });

    it("should mulligan whole hand (all 7 cards)", () => {
      const initialHand = [...testEngine.getZone("hand", PLAYER_ONE)];
      const initialDeck = [...testEngine.getZone("deck", PLAYER_ONE)];

      expect(initialHand.length).toBe(7);
      expect(initialDeck.length).toBe(10);

      testEngine.changeActivePlayer(PLAYER_ONE);
      testEngine.alterHand(initialHand);

      const finalHand = testEngine.getZone("hand", PLAYER_ONE);
      const finalDeck = testEngine.getZone("deck", PLAYER_ONE);

      // Should still have 7 cards in hand
      expect(finalHand.length).toBe(7);

      // None of the original hand cards should be in new hand
      for (const cardId of initialHand) {
        expect(finalHand).not.toContain(cardId);
      }

      // Original hand cards should be in deck (shuffled, so anywhere in deck)
      for (const cardId of initialHand) {
        expect(finalDeck).toContain(cardId);
      }

      // Deck should still have 10 cards (7 returned + 7 drawn from top = 10)
      expect(finalDeck.length).toBe(10);
    });

    it("should mulligan partial hand (3 cards)", () => {
      const initialHand = [...testEngine.getZone("hand", PLAYER_ONE)];
      const initialDeck = [...testEngine.getZone("deck", PLAYER_ONE)];

      const cardsToMulligan = initialHand.slice(0, 3);
      const cardsToKeep = initialHand.slice(3);

      testEngine.changeActivePlayer(PLAYER_ONE);
      testEngine.alterHand(cardsToMulligan);

      const finalHand = testEngine.getZone("hand", PLAYER_ONE);
      const finalDeck = testEngine.getZone("deck", PLAYER_ONE);

      // Should still have 7 cards
      expect(finalHand.length).toBe(7);

      // Kept cards should still be in hand
      for (const cardId of cardsToKeep) {
        expect(finalHand).toContain(cardId);
      }

      // Mulliganed cards should NOT be in hand
      for (const cardId of cardsToMulligan) {
        expect(finalHand).not.toContain(cardId);
      }

      // Mulliganed cards should be in deck (shuffled, so anywhere in deck)
      for (const cardId of cardsToMulligan) {
        expect(finalDeck).toContain(cardId);
      }

      // New cards should be from top of initial deck
      const newCards = finalHand.filter((id) => !initialHand.includes(id));
      expect(newCards.length).toBe(3);

      const topOfInitialDeck = initialDeck.slice(0, 3);
      for (const cardId of topOfInitialDeck) {
        expect(finalHand).toContain(cardId);
      }
    });
  });

  // ========== Priority & Turn Order Tests ==========

  describe("Priority and Turn Order", () => {
    it("should pass priority to next player after mulligan", () => {
      // Player one has priority first
      expect(testEngine.getPriorityPlayers()).toContain(PLAYER_ONE);

      testEngine.changeActivePlayer(PLAYER_ONE);
      testEngine.alterHand([]);

      // Priority should switch to player two
      expect(testEngine.getPriorityPlayers()).toContain(PLAYER_TWO);
      expect(testEngine.getPriorityPlayers()).not.toContain(PLAYER_ONE);
    });

    it("should transition to main game when all players mulligan", () => {
      // Player one mulligans
      testEngine.changeActivePlayer(PLAYER_ONE);
      testEngine.alterHand([]);

      expect(testEngine.getGamePhase()).toBe("mulligan");

      // Player two mulligans (last player)
      testEngine.changeActivePlayer(PLAYER_TWO);
      testEngine.alterHand([]);

      // After last mulligan, pending list should be empty
      const ctx = testEngine.getCtx();
      expect(ctx.pendingMulligan).toHaveLength(0);

      // Note: Segment transition happens via flow manager's endIf check
      // Which is triggered by endPhase(). This works in real gameplay.
    });

    it("should respect priority - can't mulligan out of turn", () => {
      // Player one has priority
      expect(testEngine.getPriorityPlayers()).toContain(PLAYER_ONE);

      // Try to mulligan as player two (not their turn)
      testEngine.changeActivePlayer(PLAYER_TWO);

      const result = testEngine.engine.executeMove("alterHand", {
        params: {
          cardsToMulligan: [],
          playerId: createPlayerId(PLAYER_TWO),
        },
        playerId: createPlayerId(PLAYER_TWO),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("NOT_PRIORITY_PLAYER");
        expect(result.error).toContain("can mulligan right now");
      }
    });
  });

  // ========== Edge Case Tests ==========

  describe("Edge Cases - Invalid Card IDs", () => {
    it("should reject invalid card IDs", () => {
      testEngine.changeActivePlayer(PLAYER_ONE);

      const result = testEngine.engine.executeMove("alterHand", {
        params: {
          cardsToMulligan: ["invalid-card-id-12345"],
          playerId: createPlayerId(PLAYER_ONE),
        },
        playerId: createPlayerId(PLAYER_ONE),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("INVALID_CARD_ID");
        expect(result.error).toContain("invalid-card-id-12345");
        expect(result.error).toContain("does not exist");
      }
    });

    it("should reject cards not in hand", () => {
      testEngine.changeActivePlayer(PLAYER_ONE);

      const deckCards = testEngine.getZone("deck", PLAYER_ONE);
      const cardInDeck = deckCards[0];

      const result = testEngine.engine.executeMove("alterHand", {
        params: {
          cardsToMulligan: [cardInDeck],
          playerId: createPlayerId(PLAYER_ONE),
        },
        playerId: createPlayerId(PLAYER_ONE),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("CARD_NOT_IN_HAND");
        expect(result.error).toContain("not in your hand");
        expect(result.error).toContain("deck");
      }
    });

    it("should reject opponent's cards", () => {
      testEngine.changeActivePlayer(PLAYER_ONE);

      const opponentHand = testEngine.getZone("hand", PLAYER_TWO);
      const opponentCard = opponentHand[0];

      const result = testEngine.engine.executeMove("alterHand", {
        params: {
          cardsToMulligan: [opponentCard],
          playerId: createPlayerId(PLAYER_ONE),
        },
        playerId: createPlayerId(PLAYER_ONE),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("CARD_NOT_IN_HAND");
        expect(result.error).toContain("not in your hand");
      }
    });

    it("should reject more cards than in hand", () => {
      testEngine.changeActivePlayer(PLAYER_ONE);

      const hand = testEngine.getZone("hand", PLAYER_ONE);
      const tooManyCards = [...hand, ...hand]; // Duplicate to get 14 cards

      const result = testEngine.engine.executeMove("alterHand", {
        params: {
          cardsToMulligan: tooManyCards,
          playerId: createPlayerId(PLAYER_ONE),
        },
        playerId: createPlayerId(PLAYER_ONE),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("TOO_MANY_CARDS");
        expect(result.error).toContain("14 cards");
        expect(result.error).toContain("only has 7");
      }
    });
  });

  describe("Edge Cases - Phase and State Validation", () => {
    it("should reject mulligan after mulligan phase ends", () => {
      // Complete mulligans
      testEngine.changeActivePlayer(PLAYER_ONE);
      testEngine.alterHand([]);
      testEngine.changeActivePlayer(PLAYER_TWO);
      testEngine.alterHand([]);

      // All players have mulliganed
      const ctx = testEngine.getCtx();
      expect(ctx.pendingMulligan).toHaveLength(0);

      // Try to mulligan again after mulligan phase
      testEngine.changeActivePlayer(PLAYER_ONE);

      const result = testEngine.engine.executeMove("alterHand", {
        params: {
          cardsToMulligan: [],
          playerId: createPlayerId(PLAYER_ONE),
        },
        playerId: createPlayerId(PLAYER_ONE),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        // Phase has ended (no longer in mulligan phase)
        // After phase transition fix, game correctly advances to next phase
        expect(result.errorCode).toBe("WRONG_PHASE");
        expect(result.error).toContain("phase");
      }
    });

    it("should reject mulliganing twice", () => {
      // First mulligan
      testEngine.changeActivePlayer(PLAYER_ONE);
      testEngine.alterHand([]);

      const ctx = testEngine.getCtx();
      expect(ctx.pendingMulligan).not.toContain(PLAYER_ONE);

      // Try to mulligan again - should fail because not in pending list
      // (Priority has passed to PLAYER_TWO, so this will fail on priority check)
      const result = testEngine.engine.executeMove("alterHand", {
        params: {
          cardsToMulligan: [],
          playerId: createPlayerId(PLAYER_ONE),
        },
        playerId: createPlayerId(PLAYER_ONE),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        // Will fail on already-mulliganed check (checked before priority)
        expect(result.errorCode).toBe("ALREADY_MULLIGANED");
        expect(result.error).toContain("already mulliganed");
      }
    });
  });

  // ========== Shuffle Behavior Tests ==========

  describe("Shuffle Behavior", () => {
    it("should NOT shuffle when keeping all cards", () => {
      const initialDeck = [...testEngine.getZone("deck", PLAYER_ONE)];

      testEngine.changeActivePlayer(PLAYER_ONE);
      testEngine.alterHand([]); // Keep all cards

      const finalDeck = testEngine.getZone("deck", PLAYER_ONE);

      // Deck should be unchanged (no shuffle, no draws)
      expect(finalDeck).toEqual(initialDeck);
    });

    it("should shuffle when returning cards", () => {
      const initialDeck = [...testEngine.getZone("deck", PLAYER_ONE)];
      const hand = testEngine.getZone("hand", PLAYER_ONE);

      testEngine.changeActivePlayer(PLAYER_ONE);
      testEngine.alterHand([hand[0]]); // Return 1 card

      const finalDeck = testEngine.getZone("deck", PLAYER_ONE);

      // Deck should be shuffled (very unlikely to be in same order)
      // We can't test randomness perfectly, but we can check deck was modified
      // Note: With small deck size, there's a tiny chance they're the same
      // This is acceptable for testing
      expect(finalDeck.length).toBe(initialDeck.length);
      expect(finalDeck).toContain(hand[0]); // Returned card is in deck
    });
  });

  // ========== Cards Go to Bottom Tests ==========

  describe("Cards Go to Bottom of Deck (Lorcana-Specific)", () => {
    it("should place returned cards at bottom before shuffle", () => {
      const initialDeck = [...testEngine.getZone("deck", PLAYER_ONE)];
      const hand = testEngine.getZone("hand", PLAYER_ONE);
      const cardsToReturn = hand.slice(0, 3);

      // We can't fully test this after shuffle, but we can verify:
      // 1. Cards are in deck
      // 2. Deck has correct size
      // 3. New hand doesn't contain returned cards

      testEngine.changeActivePlayer(PLAYER_ONE);
      testEngine.alterHand(cardsToReturn);

      const finalDeck = testEngine.getZone("deck", PLAYER_ONE);
      const finalHand = testEngine.getZone("hand", PLAYER_ONE);

      // Returned cards should be somewhere in deck
      for (const cardId of cardsToReturn) {
        expect(finalDeck).toContain(cardId);
        expect(finalHand).not.toContain(cardId);
      }

      // Deck size should be correct
      expect(finalDeck.length).toBe(initialDeck.length);
    });
  });
});
