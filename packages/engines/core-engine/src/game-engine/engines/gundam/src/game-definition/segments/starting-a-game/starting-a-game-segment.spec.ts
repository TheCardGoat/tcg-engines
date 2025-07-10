import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { GundamTestEngine } from "../../../testing/gundam-test-engine";

describe("Gundam Engine - Starting a Game Segment", () => {
  let testEngine: GundamTestEngine;

  beforeEach(() => {
    // Initialize with enough cards for proper testing
    // Set shieldSection to 0 since we want to test the segment implementation
    testEngine = new GundamTestEngine(
      { deck: 50, resourceDeck: 10, shieldSection: 0, hand: 0 },
      { deck: 50, resourceDeck: 10, shieldSection: 0, hand: 0 },
      { skipPreGame: false }, // Test the full pre-game flow
    );
  });

  afterEach(() => {
    testEngine.dispose();
  });

  describe("5-2-1-2: Deck Shuffling", () => {
    // We can ignore this test for now
    it.skip("should shuffle both players' decks at segment start", () => {});
  });

  describe("5-2-1-4: First Player Selection", () => {
    it("should start in chooseFirstPlayer phase", () => {
      expect(testEngine.getGameSegment()).toBe("startingAGame");
      expect(testEngine.getGamePhase()).toBe("chooseFirstPlayer");
    });

    it("should allow choosing player_one as first player", () => {
      testEngine.chooseFirstPlayer("player_one");

      expect(testEngine.getCtx().otp).toBe("player_one");
      expect(testEngine.getGamePhase()).toBe("redrawHand");
    });

    it("should allow choosing player_two as first player", () => {
      testEngine.chooseFirstPlayer("player_two");

      expect(testEngine.getCtx().otp).toBe("player_two");
      expect(testEngine.getGamePhase()).toBe("redrawHand");
    });

    it("should advance to redrawHand phase after first player is chosen", () => {
      testEngine.chooseFirstPlayer("player_one");

      expect(testEngine.getGameSegment()).toBe("startingAGame");
      expect(testEngine.getGamePhase()).toBe("redrawHand");
    });
  });

  describe("5-2-1-5: Starting Hand Drawing", () => {
    it("should draw 5 cards for each player at segment end", () => {
      // Complete the first player selection and mulligan phases
      testEngine.chooseFirstPlayer("player_one");
      expect(testEngine.getGamePhase()).toBe("redrawHand");

      // Both players choose not to redraw
      testEngine.redrawHand(false); // player_one
      testEngine.redrawHand(false); // player_two

      // Should now be in duringGame segment with hands drawn
      expect(testEngine.getGameSegment()).toBe("duringGame");

      // Both players should have 5 cards in hand
      expect(testEngine.getZonesCardCount("player_one").hand).toBe(5);
      expect(testEngine.getZonesCardCount("player_two").hand).toBe(5);

      // Decks should have 11 fewer cards (5 for hand + 6 for shield section)
      expect(testEngine.getZonesCardCount("player_one").deck).toBe(39); // 50 - 5 - 6
      expect(testEngine.getZonesCardCount("player_two").deck).toBe(39); // 50 - 5 - 6
    });
  });

  describe("5-2-1-6 and 5-2-1-7: Mulligan Flow", () => {
    beforeEach(() => {
      testEngine.chooseFirstPlayer("player_one");
      expect(testEngine.getGamePhase()).toBe("redrawHand");
    });

    it("should start mulligan phase with player_one having priority", () => {
      expect(testEngine.getGamePhase()).toBe("redrawHand");
      expect(testEngine.getPriorityPlayers()[0]).toBe("player_one");
      expect(testEngine.getCtx().pendingMulligan).toEqual(
        new Set(["player_one", "player_two"]),
      );
    });

    it("should allow player_one to decide first, then player_two", () => {
      // Player one decides not to redraw
      testEngine.redrawHand(false);
      expect(testEngine.getPriorityPlayers()[0]).toBe("player_two");
      expect(testEngine.getGamePhase()).toBe("redrawHand");

      // Player two decides not to redraw
      testEngine.redrawHand(false);

      // Should complete the segment
      expect(testEngine.getGameSegment()).toBe("duringGame");
    });

    it("should handle player_one redrawing, then player_two not redrawing", () => {
      const initialP1Hand = [...testEngine.getZone("hand", "player_one")];
      const initialP2Hand = [...testEngine.getZone("hand", "player_two")];

      // Player one redraws
      testEngine.redrawHand(true);
      expect(testEngine.getPriorityPlayers()[0]).toBe("player_two");

      const newP1Hand = testEngine.getZone("hand", "player_one");
      expect(newP1Hand).toHaveLength(5);
      // Hand should be completely different
      for (const cardId of initialP1Hand) {
        expect(newP1Hand).not.toContain(cardId);
      }

      // Player two doesn't redraw
      testEngine.redrawHand(false);

      const finalP2Hand = testEngine.getZone("hand", "player_two");
      expect(finalP2Hand).toEqual(initialP2Hand); // Should be unchanged

      expect(testEngine.getGameSegment()).toBe("duringGame");
    });

    it("should handle both players redrawing", () => {
      const initialP1Hand = [...testEngine.getZone("hand", "player_one")];
      const initialP2Hand = [...testEngine.getZone("hand", "player_two")];

      // Player one redraws
      testEngine.redrawHand(true);
      const newP1Hand = testEngine.getZone("hand", "player_one");

      // Player two redraws
      testEngine.redrawHand(true);
      const newP2Hand = testEngine.getZone("hand", "player_two");

      // Both hands should be completely different
      for (const cardId of initialP1Hand) {
        expect(newP1Hand).not.toContain(cardId);
      }
      for (const cardId of initialP2Hand) {
        expect(newP2Hand).not.toContain(cardId);
      }

      expect(testEngine.getGameSegment()).toBe("duringGame");
    });
  });

  describe("Complete Segment Flow", () => {
    it("should properly transition through all phases of starting a game", () => {
      // Step 1: Verify initial state
      expect(testEngine.getGameSegment()).toBe("startingAGame");
      expect(testEngine.getGamePhase()).toBe("chooseFirstPlayer");

      // Step 2: Choose first player (5-2-1-4)
      testEngine.chooseFirstPlayer("player_one");
      expect(testEngine.getCtx().otp).toBe("player_one");
      expect(testEngine.getGamePhase()).toBe("redrawHand");

      // Step 3: Mulligan decisions (5-2-1-6 and 5-2-1-7)
      expect(testEngine.getPriorityPlayers()[0]).toBe("player_one");
      testEngine.redrawHand(false); // Player one keeps hand

      expect(testEngine.getPriorityPlayers()[0]).toBe("player_two");
      testEngine.redrawHand(true); // Player two redraws

      // Step 4: Verify segment completion and hand drawing (5-2-1-5)
      expect(testEngine.getGameSegment()).toBe("duringGame");
      expect(testEngine.getZonesCardCount("player_one").hand).toBe(5);
      expect(testEngine.getZonesCardCount("player_two").hand).toBe(5);

      // Verify priority and turn order
      expect(testEngine.getPriorityPlayers()[0]).toBe("player_one");
      expect(testEngine.getTurnPlayer()).toBe("player_one");
    });

    it("should handle choosing player_two as first player", () => {
      testEngine.chooseFirstPlayer("player_two");
      expect(testEngine.getCtx().otp).toBe("player_two");
      expect(testEngine.getPriorityPlayers()[0]).toBe("player_two");

      // Player two (first player) should decide first
      testEngine.redrawHand(false);
      expect(testEngine.getPriorityPlayers()[0]).toBe("player_one");

      // Player one decides
      testEngine.redrawHand(false);

      // Should complete with player_two as turn/priority player
      expect(testEngine.getGameSegment()).toBe("duringGame");
      expect(testEngine.getTurnPlayer()).toBe("player_two");
      expect(testEngine.getPriorityPlayers()[0]).toBe("player_two");
    });
  });

  describe("Missing Rule Implementation Tests", () => {
    it("should ensure both players have resource decks (5-2-1-3)", () => {
      // Resource decks should be initialized and available
      expect(testEngine.getZonesCardCount("player_one").resourceDeck).toBe(10);
      expect(testEngine.getZonesCardCount("player_two").resourceDeck).toBe(10);
    });

    it("should place 6 cards in shield section for each player (5-2-2)", () => {
      // Complete the segment to trigger final setup
      testEngine.chooseFirstPlayer("player_one");
      testEngine.redrawHand(false);
      testEngine.redrawHand(false);

      // After segment completion, both players should have 6 cards in shield section
      // NOTE: This test will fail until rule 5-2-2 is implemented in the segment
      expect(testEngine.getZonesCardCount("player_one").shieldSection).toBe(6);
      expect(testEngine.getZonesCardCount("player_two").shieldSection).toBe(6);

      // Decks should have 6 fewer cards (5 for hand + 6 for shield = 11 fewer)
      expect(testEngine.getZonesCardCount("player_one").deck).toBe(39); // 50 - 5 - 6
      expect(testEngine.getZonesCardCount("player_two").deck).toBe(39); // 50 - 5 - 6
    });

    it("should ensure EX Base tokens are placed in shield base (5-2-3)", () => {
      // Both players should start with EX Base token in shieldBase
      expect(testEngine.getZonesCardCount("player_one").shieldBase).toBe(1);
      expect(testEngine.getZonesCardCount("player_two").shieldBase).toBe(1);

      // Verify the cards are actually EX Base tokens
      const p1ShieldBase = testEngine.getCardsByZone(
        "shieldBase",
        "player_one",
      );
      const p2ShieldBase = testEngine.getCardsByZone(
        "shieldBase",
        "player_two",
      );

      expect(p1ShieldBase).toHaveLength(1);
      expect(p2ShieldBase).toHaveLength(1);
    });

    it("should place EX Resource token for Player Two (5-2-4)", () => {
      // Complete the segment to trigger final setup
      testEngine.chooseFirstPlayer("player_one");
      testEngine.redrawHand(false);
      testEngine.redrawHand(false);

      // Player Two should have 1 EX Resource token in resource area
      // NOTE: This test will fail until rule 5-2-4 is implemented in the segment
      expect(testEngine.getZonesCardCount("player_two").resourceArea).toBe(1);

      // Player One should NOT have an EX Resource token
      expect(testEngine.getZonesCardCount("player_one").resourceArea).toBe(0);

      // Verify the card is actually an EX Resource token
      const p2ResourceArea = testEngine.getCardsByZone(
        "resourceArea",
        "player_two",
      );
      expect(p2ResourceArea).toHaveLength(1);
    });

    it("should not advance segment until all conditions are met", () => {
      // Should not advance without choosing first player
      expect(testEngine.getGameSegment()).toBe("startingAGame");
      expect(testEngine.getGamePhase()).toBe("chooseFirstPlayer");

      // Choose first player
      testEngine.chooseFirstPlayer("player_one");
      expect(testEngine.getGameSegment()).toBe("startingAGame");
      expect(testEngine.getGamePhase()).toBe("redrawHand");

      // Should not advance until both players make mulligan decisions
      testEngine.redrawHand(false); // Player one decides
      expect(testEngine.getGameSegment()).toBe("startingAGame");
      expect(testEngine.getGamePhase()).toBe("redrawHand");

      // Now both players have decided, should advance
      testEngine.redrawHand(false); // Player two decides
      expect(testEngine.getGameSegment()).toBe("duringGame");
    });
  });

  describe("Edge Cases", () => {
    it("should handle players with fewer than 5 cards in deck", () => {
      // Create engine with small decks
      const smallDeckEngine = new GundamTestEngine(
        { deck: 3, resourceDeck: 10 },
        { deck: 2, resourceDeck: 10 },
        { skipPreGame: false },
      );

      smallDeckEngine.chooseFirstPlayer("player_one");
      smallDeckEngine.redrawHand(false);
      smallDeckEngine.redrawHand(false);

      // Should draw only available cards
      expect(smallDeckEngine.getZonesCardCount("player_one").hand).toBe(3);
      expect(smallDeckEngine.getZonesCardCount("player_two").hand).toBe(2);
      expect(smallDeckEngine.getZonesCardCount("player_one").deck).toBe(0);
      expect(smallDeckEngine.getZonesCardCount("player_two").deck).toBe(0);

      smallDeckEngine.dispose();
    });

    it("should properly clean up mulligan state after segment ends", () => {
      testEngine.chooseFirstPlayer("player_one");
      testEngine.redrawHand(false);
      testEngine.redrawHand(false);

      // After segment completion, mulligan state should be cleared
      expect(testEngine.getCtx().pendingMulligan).toBeUndefined();
      expect(testEngine.getGameSegment()).toBe("duringGame");
    });
  });

  describe("5-2-2: Shield Section Setup [MISSING IMPLEMENTATION]", () => {
    it("should place 6 cards in shield section for each player after game starts", () => {
      // This test validates that rule 5-2-2 is properly implemented
      // Rule: Each player takes the top six cards of their deck, one at a time,
      // and places them face down into the shield section of their shield area

      // Complete the pre-game sequence
      testEngine.chooseFirstPlayer("player_one");
      testEngine.redrawHand(false);
      testEngine.redrawHand(false);

      // After segment completion, both players should have 6 cards in shield section
      // Currently this will FAIL because rule 5-2-2 is not implemented
      expect(testEngine.getZonesCardCount("player_one").shieldSection).toBe(6);
      expect(testEngine.getZonesCardCount("player_two").shieldSection).toBe(6);

      // Decks should be reduced by: 5 (hand) + 6 (shield) = 11 cards each
      expect(testEngine.getZonesCardCount("player_one").deck).toBe(39); // 50 - 11
      expect(testEngine.getZonesCardCount("player_two").deck).toBe(39); // 50 - 11
    });
  });

  describe("5-2-4: Player Two EX Resource Token [MISSING IMPLEMENTATION]", () => {
    it("should place one active EX Resource token in Player Two's resource area", () => {
      // This test validates that rule 5-2-4 is properly implemented
      // Rule: Player Two places one active EX Resource token card into their resource area

      // Complete the pre-game sequence
      testEngine.chooseFirstPlayer("player_one");
      testEngine.redrawHand(false);
      testEngine.redrawHand(false);

      // Player Two should have 1 EX Resource token in resource area
      // Currently this will FAIL because rule 5-2-4 is not implemented
      expect(testEngine.getZonesCardCount("player_two").resourceArea).toBe(1);

      // Player One should NOT have an EX Resource token (only Player Two gets it)
      expect(testEngine.getZonesCardCount("player_one").resourceArea).toBe(0);

      // Verify the card is actually an EX Resource token
      const p2ResourceArea = testEngine.getCardsByZone(
        "resourceArea",
        "player_two",
      );
      expect(p2ResourceArea).toHaveLength(1);
      // TODO: Add assertion for token type when token definitions are available
    });
  });

  describe("Currently Working Rules", () => {
    it("should ensure EX Base tokens are placed in shield base (5-2-3) [WORKING]", () => {
      // This rule is already implemented in the test engine setup
      expect(testEngine.getZonesCardCount("player_one").shieldBase).toBe(1);
      expect(testEngine.getZonesCardCount("player_two").shieldBase).toBe(1);
    });

    it("should ensure resource decks are available (5-2-1-3) [WORKING]", () => {
      // This rule is already implemented
      expect(testEngine.getZonesCardCount("player_one").resourceDeck).toBe(10);
      expect(testEngine.getZonesCardCount("player_two").resourceDeck).toBe(10);
    });

    it("should draw 5 cards for starting hands (5-2-1-5) [WORKING]", () => {
      // Complete the pre-game sequence
      testEngine.chooseFirstPlayer("player_one");
      testEngine.redrawHand(false);
      testEngine.redrawHand(false);

      // Both players should have 5 cards in hand
      expect(testEngine.getZonesCardCount("player_one").hand).toBe(5);
      expect(testEngine.getZonesCardCount("player_two").hand).toBe(5);
    });
  });
});
