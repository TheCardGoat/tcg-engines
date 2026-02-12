import { describe, expect, it } from "bun:test";
import {
  addCard,
  addCardToBottom,
  addCardToTop,
  clearZone,
  createCardId,
  createPlayerId,
  createPlayerZones,
  createZone,
  createZoneId,
  getCardsInZone,
  getTopCard,
  getZoneSize,
  isCardInZone,
  moveCard,
  removeCard,
} from "@tcg/core";

/**
 * Task 7.2: Tests verifying lorcana zone operations work with core utilities
 *
 * These tests verify that core zone operations from @tcg/core can handle
 * Lorcana's zone management needs, validating the migration path.
 *
 * Tests cover:
 * - Zone creation for multiple players
 * - Card operations (add, remove, move)
 * - Zone queries (size, cards, top card)
 * - Ordered zone operations (top/bottom)
 * - Real-world Lorcana scenarios (draw, play, banish, ink)
 */

// Test helpers
function createTestPlayers(...names: string[]) {
  return names.map((name) => createPlayerId(name));
}

function _createTestCards(...names: string[]) {
  return names.map((name) => createCardId(name));
}

describe("Core Zone Integration for Lorcana", () => {
  describe("Zone Creation", () => {
    it("should create zones for multiple players using core utilities", () => {
      const [player1, player2] = createTestPlayers("player1", "player2");

      // Use core's createPlayerZones helper
      const handZones = createPlayerZones([player1, player2], () =>
        createZone({
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          visibility: "private",
        }),
      );

      expect(handZones[player1]).toBeDefined();
      expect(handZones[player2]).toBeDefined();
      expect(handZones[player1].cards).toEqual([]);
      expect(handZones[player2].cards).toEqual([]);
    });

    it("should create all 5 Lorcana zones with correct configurations", () => {
      const [player1] = createTestPlayers("player1");

      const deckZone = createZone({
        faceDown: true,
        id: createZoneId("deck"),
        name: "Deck",
        ordered: true,
        owner: player1,
        visibility: "secret",
      });

      const handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      const playZone = createZone({
        id: createZoneId("play"),
        name: "Play",
        ordered: false,
        owner: player1,
        visibility: "public",
      });

      const discardZone = createZone({
        id: createZoneId("discard"),
        name: "Discard",
        ordered: true,
        owner: player1,
        visibility: "public",
      });

      const inkwellZone = createZone({
        faceDown: true,
        id: createZoneId("inkwell"),
        name: "Inkwell",
        ordered: false,
        owner: player1,
        visibility: "secret",
      });

      expect(deckZone.config.visibility).toBe("secret");
      expect(deckZone.config.ordered).toBe(true);
      expect(handZone.config.visibility).toBe("private");
      expect(playZone.config.visibility).toBe("public");
      expect(discardZone.config.ordered).toBe(true);
      expect(inkwellZone.config.faceDown).toBe(true);
    });
  });

  describe("Basic Zone Operations", () => {
    it("should add card to zone using core addCard", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");

      const handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      const updatedHand = addCard(handZone, card1);

      expect(updatedHand.cards).toEqual([card1]);
      expect(handZone.cards).toEqual([]); // Original unchanged (immutable)
    });

    it("should remove card from zone using core removeCard", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");

      let handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      handZone = addCard(handZone, card1);
      handZone = addCard(handZone, card2);

      const updatedHand = removeCard(handZone, card1);

      expect(updatedHand.cards).toEqual([card2]);
    });

    it("should move card between zones using core moveCard", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");

      let handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      const playZone = createZone({
        id: createZoneId("play"),
        name: "Play",
        ordered: false,
        owner: player1,
        visibility: "public",
      });

      handZone = addCard(handZone, card1);

      const { fromZone: updatedHand, toZone: updatedPlay } = moveCard(handZone, playZone, card1);

      expect(updatedHand.cards).toEqual([]);
      expect(updatedPlay.cards).toEqual([card1]);
    });
  });

  describe("Zone Queries", () => {
    it("should check if card is in zone using core isCardInZone", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");

      let handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      handZone = addCard(handZone, card1);

      expect(isCardInZone(handZone, card1)).toBe(true);
      expect(isCardInZone(handZone, card2)).toBe(false);
    });

    it("should get all cards in zone using core getCardsInZone", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");
      const card3 = createCardId("card-3");

      let handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      handZone = addCard(handZone, card1);
      handZone = addCard(handZone, card2);
      handZone = addCard(handZone, card3);

      const cards = getCardsInZone(handZone);

      expect(cards).toEqual([card1, card2, card3]);
    });

    it("should get zone size using core getZoneSize", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");

      let deckZone = createZone({
        id: createZoneId("deck"),
        name: "Deck",
        ordered: true,
        owner: player1,
        visibility: "secret",
      });

      deckZone = addCard(deckZone, card1);
      deckZone = addCard(deckZone, card2);

      expect(getZoneSize(deckZone)).toBe(2);
    });

    it("should get top card using core getTopCard", () => {
      const player1 = createPlayerId("player1");
      const topCard = createCardId("top-card");
      const card2 = createCardId("card-2");

      let deckZone = createZone({
        id: createZoneId("deck"),
        name: "Deck",
        ordered: true,
        owner: player1,
        visibility: "secret",
      });

      deckZone = addCard(deckZone, topCard);
      deckZone = addCard(deckZone, card2);

      expect(getTopCard(deckZone)).toBe(topCard);
    });
  });

  describe("Ordered Zone Operations", () => {
    it("should add card to top of zone using core addCardToTop", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");

      let deckZone = createZone({
        id: createZoneId("deck"),
        name: "Deck",
        ordered: true,
        owner: player1,
        visibility: "secret",
      });

      deckZone = addCard(deckZone, card1);
      deckZone = addCardToTop(deckZone, card2);

      expect(deckZone.cards[0]).toBe(card2);
      expect(deckZone.cards[1]).toBe(card1);
    });

    it("should add card to bottom of zone using core addCardToBottom", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");

      let deckZone = createZone({
        id: createZoneId("deck"),
        name: "Deck",
        ordered: true,
        owner: player1,
        visibility: "secret",
      });

      deckZone = addCard(deckZone, card1);
      deckZone = addCardToBottom(deckZone, card2);

      expect(deckZone.cards[0]).toBe(card1);
      expect(deckZone.cards[1]).toBe(card2);
    });

    it("should clear zone using core clearZone", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");

      let handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      handZone = addCard(handZone, card1);
      handZone = addCard(handZone, card2);

      const clearedHand = clearZone(handZone);

      expect(clearedHand.cards).toEqual([]);
    });
  });

  describe("Lorcana Scenario Tests", () => {
    it("should handle draw card scenario (deck -> hand)", () => {
      const player1 = createPlayerId("player1");
      const topCard = createCardId("top-card");
      const card2 = createCardId("card-2");
      const card3 = createCardId("card-3");

      let deckZone = createZone({
        id: createZoneId("deck"),
        name: "Deck",
        ordered: true,
        owner: player1,
        visibility: "secret",
      });

      const handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      deckZone = addCard(deckZone, topCard);
      deckZone = addCard(deckZone, card2);
      deckZone = addCard(deckZone, card3);

      // Draw top card
      const { fromZone: updatedDeck, toZone: updatedHand } = moveCard(deckZone, handZone, topCard);

      expect(getZoneSize(updatedDeck)).toBe(2);
      expect(updatedHand.cards).toContain(topCard);
    });

    it("should handle play card scenario (hand -> play)", () => {
      const player1 = createPlayerId("player1");
      const character = createCardId("character-1");

      let handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      const playZone = createZone({
        id: createZoneId("play"),
        name: "Play",
        ordered: false,
        owner: player1,
        visibility: "public",
      });

      handZone = addCard(handZone, character);

      const { fromZone: updatedHand, toZone: updatedPlay } = moveCard(
        handZone,
        playZone,
        character,
      );

      expect(updatedHand.cards).toEqual([]);
      expect(updatedPlay.cards).toContain(character);
    });

    it("should handle banish scenario (play -> discard)", () => {
      const player1 = createPlayerId("player1");
      const character = createCardId("character-1");

      let playZone = createZone({
        id: createZoneId("play"),
        name: "Play",
        ordered: false,
        owner: player1,
        visibility: "public",
      });

      const discardZone = createZone({
        id: createZoneId("discard"),
        name: "Discard",
        ordered: true,
        owner: player1,
        visibility: "public",
      });

      playZone = addCard(playZone, character);

      const { fromZone: updatedPlay, toZone: updatedDiscard } = moveCard(
        playZone,
        discardZone,
        character,
      );

      expect(updatedPlay.cards).toEqual([]);
      expect(updatedDiscard.cards).toContain(character);
    });

    it("should handle ink card scenario (hand -> inkwell)", () => {
      const player1 = createPlayerId("player1");
      const inkableCard = createCardId("inkable-1");

      let handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      const inkwellZone = createZone({
        faceDown: true,
        id: createZoneId("inkwell"),
        name: "Inkwell",
        ordered: false,
        owner: player1,
        visibility: "secret",
      });

      handZone = addCard(handZone, inkableCard);

      const { fromZone: updatedHand, toZone: updatedInkwell } = moveCard(
        handZone,
        inkwellZone,
        inkableCard,
      );

      expect(updatedHand.cards).toEqual([]);
      expect(updatedInkwell.cards).toContain(inkableCard);
    });

    it("should handle mulligan scenario (put cards on bottom of deck)", () => {
      const player1 = createPlayerId("player1");
      const mulliganCard1 = createCardId("mulligan-1");
      const mulliganCard2 = createCardId("mulligan-2");
      const deckCard1 = createCardId("deck-1");
      const deckCard2 = createCardId("deck-2");

      let deckZone = createZone({
        id: createZoneId("deck"),
        name: "Deck",
        ordered: true,
        owner: player1,
        visibility: "secret",
      });

      // Deck has some cards
      deckZone = addCard(deckZone, deckCard1);
      deckZone = addCard(deckZone, deckCard2);

      // Put mulligan cards on bottom
      deckZone = addCardToBottom(deckZone, mulliganCard1);
      deckZone = addCardToBottom(deckZone, mulliganCard2);

      // Check order: original deck cards on top, mulligan cards on bottom
      expect(deckZone.cards[0]).toBe(deckCard1);
      expect(deckZone.cards[1]).toBe(deckCard2);
      expect(deckZone.cards[2]).toBe(mulliganCard1);
      expect(deckZone.cards[3]).toBe(mulliganCard2);
    });
  });

  describe("Immutability Tests", () => {
    it("should not mutate original zone when adding cards", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");

      const originalZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      const updatedZone = addCard(originalZone, card1);

      expect(originalZone.cards).toEqual([]);
      expect(updatedZone.cards).toEqual([card1]);
    });

    it("should not mutate original zones when moving cards", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");

      let handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      const playZone = createZone({
        id: createZoneId("play"),
        name: "Play",
        ordered: false,
        owner: player1,
        visibility: "public",
      });

      handZone = addCard(handZone, card1);

      const originalHandCards = [...handZone.cards];
      const originalPlayCards = [...playZone.cards];

      moveCard(handZone, playZone, card1);

      // Original zones unchanged
      expect(handZone.cards).toEqual(originalHandCards);
      expect(playZone.cards).toEqual(originalPlayCards);
    });
  });
});
