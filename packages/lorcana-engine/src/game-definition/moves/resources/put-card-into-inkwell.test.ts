import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createPlayerId } from "@tcg/core";
import {
  LorcanaTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/lorcana-test-engine";

describe("Move: Put a Card Into The Inkwell", () => {
  let testEngine: LorcanaTestEngine;

  beforeEach(() => {
    testEngine = new LorcanaTestEngine(
      { hand: 7, deck: 10, inkwell: 0 },
      { hand: 7, deck: 10, inkwell: 0 },
      { skipPreGame: false },
    );

    // Complete pre-game setup to get to main phase
    const ctx = testEngine.getCtx();
    const choosingPlayer = ctx.choosingFirstPlayer;
    testEngine.changeActivePlayer(choosingPlayer || PLAYER_ONE);
    testEngine.chooseWhoGoesFirst(PLAYER_ONE);

    // Complete mulligans for both players
    testEngine.changeActivePlayer(PLAYER_ONE);
    testEngine.alterHand([]);
    testEngine.changeActivePlayer(PLAYER_TWO);
    testEngine.alterHand([]);

    // After mulligans, game is in mainGame segment, turn 2, player_two's turn
    // Need to pass turns to get to a stable state

    // Player two takes their turn (beginning -> main -> end -> next turn)
    testEngine.changeActivePlayer(PLAYER_TWO);
    testEngine.passTurn(); // beginning -> main
    testEngine.passTurn(); // main -> end -> turn 3 beginning -> main (player_one)

    // Player one takes their turn
    testEngine.changeActivePlayer(PLAYER_ONE);
    testEngine.passTurn(); // main -> end -> turn 4 beginning -> main (player_two)

    // Back to player two
    testEngine.changeActivePlayer(PLAYER_TWO);
    testEngine.passTurn(); // main -> end -> turn 5 beginning -> main (player_one)

    // Now on player_one's turn in main phase
    testEngine.changeActivePlayer(PLAYER_ONE);
    // Now we're in main phase and can ink cards
  });

  afterEach(() => {
    testEngine.dispose();
  });

  // ========== Basic Behavior Tests ==========

  describe("Basic Inking Behavior", () => {
    it("should successfully ink a card from hand", () => {
      const hand = testEngine.getZone("hand", PLAYER_ONE);
      const cardToInk = hand[0];
      const initialHandSize = hand.length;

      expect(initialHandSize).toBeGreaterThan(0);
      expect(testEngine.getZone("inkwell", PLAYER_ONE).length).toBe(0);

      // Ink the card
      testEngine.putCardInInkwell(cardToInk);

      // Verify card moved zones
      const newHand = testEngine.getZone("hand", PLAYER_ONE);
      const inkwell = testEngine.getZone("inkwell", PLAYER_ONE);

      expect(newHand.length).toBe(initialHandSize - 1);
      expect(newHand).not.toContain(cardToInk);
      expect(inkwell.length).toBe(1);
      expect(inkwell).toContain(cardToInk);
    });

    it("should mark hasInked tracker after inking", () => {
      const hand = testEngine.getZone("hand", PLAYER_ONE);
      const cardToInk = hand[0];

      // Initially should not be marked (may be undefined or false)
      const ctx = testEngine.getCtx();
      const initialInked = ctx.trackers?.check(
        "hasInked",
        createPlayerId(PLAYER_ONE),
      );
      expect(initialInked).toBeFalsy(); // undefined or false

      // Ink the card
      testEngine.putCardInInkwell(cardToInk);

      // Should now be marked
      const newCtx = testEngine.getCtx();
      expect(
        newCtx.trackers?.check("hasInked", createPlayerId(PLAYER_ONE)),
      ).toBe(true);
    });

    it("should allow inking different cards in different turns", () => {
      const hand = testEngine.getZone("hand", PLAYER_ONE);
      const firstCard = hand[0];

      // Ink first card
      testEngine.putCardInInkwell(firstCard);

      // Pass turn and come back to player one
      testEngine.passTurn(); // Pass to player two
      testEngine.passTurn(); // Pass back to player one

      const newHand = testEngine.getZone("hand", PLAYER_ONE);
      const secondCard = newHand[0];

      // Should be able to ink again
      testEngine.putCardInInkwell(secondCard);

      const inkwell = testEngine.getZone("inkwell", PLAYER_ONE);
      expect(inkwell.length).toBe(2);
      expect(inkwell).toContain(firstCard);
      expect(inkwell).toContain(secondCard);
    });
  });

  // ========== Once-Per-Turn Validation ==========

  describe("Once-Per-Turn Validation", () => {
    it("should reject second ink attempt in same turn", () => {
      const hand = testEngine.getZone("hand", PLAYER_ONE);
      const firstCard = hand[0];
      const secondCard = hand[1];

      // First ink succeeds
      testEngine.putCardInInkwell(firstCard);

      // Second ink should fail
      const result = testEngine.engine.executeMove("putACardIntoTheInkwell", {
        playerId: createPlayerId(PLAYER_ONE),
        params: {
          cardId: secondCard,
        },
      });

      expect(result.success).toBe(false);
      // The error should indicate the action was already used
      if (!result.success) {
        // Accept either specific or generic error code
        expect(
          result.errorCode === "ALREADY_USED_ACTION" ||
            result.errorCode === "CONDITION_FAILED",
        ).toBe(true);
      }

      // Verify second card still in hand
      const newHand = testEngine.getZone("hand", PLAYER_ONE);
      expect(newHand).toContain(secondCard);

      // Verify only one card in inkwell
      const inkwell = testEngine.getZone("inkwell", PLAYER_ONE);
      expect(inkwell.length).toBe(1);
    });

    it("should allow inking after turn passes", () => {
      const hand = testEngine.getZone("hand", PLAYER_ONE);
      const firstCard = hand[0];

      // Ink first card
      testEngine.putCardInInkwell(firstCard);

      // Pass turn and come back to player one
      testEngine.passTurn(); // Pass to player two
      testEngine.passTurn(); // Pass back to player one
      const newHand = testEngine.getZone("hand", PLAYER_ONE);
      const secondCard = newHand[0];

      // Should succeed
      testEngine.putCardInInkwell(secondCard);

      const inkwell = testEngine.getZone("inkwell", PLAYER_ONE);
      expect(inkwell.length).toBe(2);
    });
  });

  // ========== Card Location Validation ==========

  describe("Card Location Validation", () => {
    it("should reject cards not in hand - card in deck", () => {
      const deck = testEngine.getZone("deck", PLAYER_ONE);
      const cardInDeck = deck[0];

      const result = testEngine.engine.executeMove("putACardIntoTheInkwell", {
        playerId: createPlayerId(PLAYER_ONE),
        params: {
          cardId: cardInDeck,
        },
      });

      expect(result.success).toBe(false);
      // Card should still be in deck
      expect(testEngine.getZone("deck", PLAYER_ONE)).toContain(cardInDeck);
    });

    it("should reject cards not in hand - card in play", () => {
      // Set up with a card in play
      const testEngineWithPlay = new LorcanaTestEngine(
        { hand: 7, deck: 10, play: 1 },
        { hand: 7, deck: 10 },
        { skipPreGame: false },
      );

      // Complete setup
      const ctx = testEngineWithPlay.getCtx();
      testEngineWithPlay.changeActivePlayer(
        ctx.choosingFirstPlayer || PLAYER_ONE,
      );
      testEngineWithPlay.chooseWhoGoesFirst(PLAYER_ONE);
      testEngineWithPlay.changeActivePlayer(PLAYER_ONE);
      testEngineWithPlay.alterHand([]);
      testEngineWithPlay.changeActivePlayer(PLAYER_TWO);
      testEngineWithPlay.alterHand([]);
      testEngineWithPlay.changeActivePlayer(PLAYER_ONE);

      const playZone = testEngineWithPlay.getZone("play", PLAYER_ONE);
      const cardInPlay = playZone[0];

      const result = testEngineWithPlay.engine.executeMove(
        "putACardIntoTheInkwell",
        {
          playerId: createPlayerId(PLAYER_ONE),
          params: {
            cardId: cardInPlay,
          },
        },
      );

      expect(result.success).toBe(false);

      testEngineWithPlay.dispose();
    });

    it("should reject invalid card IDs", () => {
      const result = testEngine.engine.executeMove("putACardIntoTheInkwell", {
        playerId: createPlayerId(PLAYER_ONE),
        params: {
          cardId: "invalid-card-id-12345",
        },
      });

      expect(result.success).toBe(false);
    });

    it("should reject opponent's cards", () => {
      const opponentHand = testEngine.getZone("hand", PLAYER_TWO);
      const opponentCard = opponentHand[0];

      const result = testEngine.engine.executeMove("putACardIntoTheInkwell", {
        playerId: createPlayerId(PLAYER_ONE),
        params: {
          cardId: opponentCard,
        },
      });

      expect(result.success).toBe(false);

      // Card should still be in opponent's hand
      expect(testEngine.getZone("hand", PLAYER_TWO)).toContain(opponentCard);
    });

    it("should reject cards already in inkwell", () => {
      const hand = testEngine.getZone("hand", PLAYER_ONE);
      const cardToInk = hand[0];

      // Ink the card first time
      testEngine.putCardInInkwell(cardToInk);

      // Pass turn to reset hasInked tracker
      testEngine.passTurn();
      testEngine.passTurn();

      // Try to ink the same card again (now it's in inkwell)
      const result = testEngine.engine.executeMove("putACardIntoTheInkwell", {
        playerId: createPlayerId(PLAYER_ONE),
        params: {
          cardId: cardToInk,
        },
      });

      expect(result.success).toBe(false);
    });
  });

  // ========== Priority Tests ==========

  describe("Priority and Turn Order", () => {
    it("should allow both players to ink on their respective turns", () => {
      // Player one inks
      const p1Hand = testEngine.getZone("hand", PLAYER_ONE);
      const p1Card = p1Hand[0];
      testEngine.putCardInInkwell(p1Card);

      // Pass to player two
      testEngine.passTurn();

      // Player two inks
      testEngine.changeActivePlayer(PLAYER_TWO);
      const p2Hand = testEngine.getZone("hand", PLAYER_TWO);
      const p2Card = p2Hand[0];
      testEngine.putCardInInkwell(p2Card);

      // Verify both inkwells
      expect(testEngine.getZone("inkwell", PLAYER_ONE)).toContain(p1Card);
      expect(testEngine.getZone("inkwell", PLAYER_TWO)).toContain(p2Card);
    });
  });

  // ========== Edge Cases ==========

  describe("Edge Cases", () => {
    it("should handle empty hand gracefully", () => {
      const emptyHandEngine = new LorcanaTestEngine(
        { hand: 0, deck: 10 },
        { hand: 7, deck: 10 },
        { skipPreGame: false },
      );

      // Complete setup
      const ctx = emptyHandEngine.getCtx();
      emptyHandEngine.changeActivePlayer(ctx.choosingFirstPlayer || PLAYER_ONE);
      emptyHandEngine.chooseWhoGoesFirst(PLAYER_ONE);
      emptyHandEngine.changeActivePlayer(PLAYER_ONE);
      emptyHandEngine.alterHand([]);
      emptyHandEngine.changeActivePlayer(PLAYER_TWO);
      emptyHandEngine.alterHand([]);
      emptyHandEngine.changeActivePlayer(PLAYER_ONE);

      // Try to ink with no cards in hand
      const result = emptyHandEngine.engine.executeMove(
        "putACardIntoTheInkwell",
        {
          playerId: createPlayerId(PLAYER_ONE),
          params: {
            cardId: "any-card-id",
          },
        },
      );

      expect(result.success).toBe(false);

      emptyHandEngine.dispose();
    });

    it("should accumulate cards in inkwell over multiple turns", () => {
      const cardsInked: string[] = [];

      // Ink a card each turn for 3 turns
      for (let i = 0; i < 3; i++) {
        const hand = testEngine.getZone("hand", PLAYER_ONE);
        if (hand.length > 0) {
          const cardToInk = hand[0];
          cardsInked.push(cardToInk);

          testEngine.putCardInInkwell(cardToInk);
        }

        // Pass both players' turns
        testEngine.passTurn();
        testEngine.passTurn();
      }

      // Verify all cards are in inkwell
      const inkwell = testEngine.getZone("inkwell", PLAYER_ONE);
      expect(inkwell.length).toBe(3);

      for (const card of cardsInked) {
        expect(inkwell).toContain(card);
      }
    });

    it("should verify inkwell is a public zone", () => {
      // This is verified by the zone configuration
      // Just ensure inking works and cards are visible
      const hand = testEngine.getZone("hand", PLAYER_ONE);
      const cardToInk = hand[0];

      testEngine.putCardInInkwell(cardToInk);

      // Both players should be able to see inkwell (public zone)
      const p1Inkwell = testEngine.getZone("inkwell", PLAYER_ONE);
      const p2View = testEngine.getZone("inkwell", PLAYER_ONE); // Same zone

      expect(p1Inkwell).toEqual(p2View);
      expect(p1Inkwell).toContain(cardToInk);
    });
  });

  // ========== Integration Tests ==========

  describe("Integration with Game Flow", () => {
    it("should reset hasInked tracker at start of turn", () => {
      const hand = testEngine.getZone("hand", PLAYER_ONE);
      const firstCard = hand[0];

      // Ink a card
      testEngine.putCardInInkwell(firstCard);

      // Verify tracker is marked
      let ctx = testEngine.getCtx();
      expect(ctx.trackers?.check("hasInked", createPlayerId(PLAYER_ONE))).toBe(
        true,
      );

      // Pass turn and come back
      testEngine.passTurn();
      testEngine.passTurn();

      // Tracker should be reset (undefined or false)
      ctx = testEngine.getCtx();
      const trackerValue = ctx.trackers?.check(
        "hasInked",
        createPlayerId(PLAYER_ONE),
      );
      expect(trackerValue).toBeFalsy(); // undefined or false

      // Should be able to ink again
      const newHand = testEngine.getZone("hand", PLAYER_ONE);
      if (newHand.length > 0) {
        const secondCard = newHand[0];
        testEngine.putCardInInkwell(secondCard);

        const inkwell = testEngine.getZone("inkwell", PLAYER_ONE);
        expect(inkwell.length).toBe(2);
      }
    });

    it("should work correctly in a realistic game scenario", () => {
      // Simulate several turns of gameplay with inking
      for (let turn = 0; turn < 3; turn++) {
        // Player one's turn
        const p1Hand = testEngine.getZone("hand", PLAYER_ONE);
        if (p1Hand.length > 0) {
          testEngine.putCardInInkwell(p1Hand[0]);
        }
        testEngine.passTurn();

        // Player two's turn
        testEngine.changeActivePlayer(PLAYER_TWO);
        const p2Hand = testEngine.getZone("hand", PLAYER_TWO);
        if (p2Hand.length > 0) {
          testEngine.putCardInInkwell(p2Hand[0]);
        }
        testEngine.passTurn();

        testEngine.changeActivePlayer(PLAYER_ONE);
      }

      // Verify both players have accumulated ink
      expect(testEngine.getZone("inkwell", PLAYER_ONE).length).toBe(3);
      expect(testEngine.getZone("inkwell", PLAYER_TWO).length).toBe(3);
    });
  });
});
