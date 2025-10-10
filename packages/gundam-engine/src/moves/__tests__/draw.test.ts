/**
 * Draw Move Tests
 *
 * Tests for the draw move in Gundam Card Game.
 * Covers normal drawing, multi-draw, deck empty handling, and win condition triggers.
 *
 * Test Structure:
 * 1. Normal draw scenarios (1 card, multiple cards)
 * 2. Deck empty scenarios (triggers loss condition)
 * 3. Edge cases (drawing more than available, drawing from empty deck)
 *
 * References:
 * - Gundam Official Rules: Draw Phase
 * - @tcg/core draw function
 */

import { beforeEach, describe, expect, it } from "bun:test";
import {
  type CardId,
  createCardId,
  createPlayerId,
  type PlayerId,
} from "@tcg/core";
import { createDeckZone, createHandZone, drawCards } from "../../zones";

describe("Draw Move", () => {
  let player1: PlayerId;
  let player2: PlayerId;
  let card1: CardId;
  let card2: CardId;
  let card3: CardId;
  let card4: CardId;
  let card5: CardId;

  beforeEach(() => {
    player1 = createPlayerId("player1");
    player2 = createPlayerId("player2");
    card1 = createCardId("card-1");
    card2 = createCardId("card-2");
    card3 = createCardId("card-3");
    card4 = createCardId("card-4");
    card5 = createCardId("card-5");
  });

  describe("Normal Draw", () => {
    it("should draw 1 card from deck to hand", () => {
      const deck = createDeckZone(player1, [card1, card2, card3]);
      const hand = createHandZone(player1, []);

      const result = drawCards(deck, hand, 1);

      expect(result.deck.cards).toHaveLength(2);
      expect(result.hand.cards).toHaveLength(1);
      expect(result.cards).toEqual([card1]);
      expect(result.hand.cards).toContain(card1);
      expect(result.deck.cards).not.toContain(card1);
    });

    it("should draw multiple cards from deck to hand", () => {
      const deck = createDeckZone(player1, [card1, card2, card3, card4, card5]);
      const hand = createHandZone(player1, []);

      const result = drawCards(deck, hand, 3);

      expect(result.deck.cards).toHaveLength(2);
      expect(result.hand.cards).toHaveLength(3);
      expect(result.cards).toEqual([card1, card2, card3]);
      expect(result.hand.cards).toContain(card1);
      expect(result.hand.cards).toContain(card2);
      expect(result.hand.cards).toContain(card3);
    });

    it("should draw cards in correct order (top of deck first)", () => {
      const deck = createDeckZone(player1, [card1, card2, card3]);
      const hand = createHandZone(player1, []);

      const result = drawCards(deck, hand, 2);

      expect(result.cards[0]).toBe(card1);
      expect(result.cards[1]).toBe(card2);
      expect(result.deck.cards[0]).toBe(card3);
    });

    it("should add drawn cards to existing hand", () => {
      const deck = createDeckZone(player1, [card1, card2]);
      const hand = createHandZone(player1, [card3, card4]);

      const result = drawCards(deck, hand, 1);

      expect(result.hand.cards).toHaveLength(3);
      expect(result.hand.cards).toContain(card1);
      expect(result.hand.cards).toContain(card3);
      expect(result.hand.cards).toContain(card4);
    });
  });

  describe("Deck Empty Handling", () => {
    it("should throw error when trying to draw from empty deck", () => {
      const deck = createDeckZone(player1, []);
      const hand = createHandZone(player1, []);

      expect(() => drawCards(deck, hand, 1)).toThrow();
    });

    it("should throw error when trying to draw more cards than available", () => {
      const deck = createDeckZone(player1, [card1, card2]);
      const hand = createHandZone(player1, []);

      expect(() => drawCards(deck, hand, 3)).toThrow();
    });

    it("should successfully draw all remaining cards when exact count", () => {
      const deck = createDeckZone(player1, [card1, card2]);
      const hand = createHandZone(player1, []);

      const result = drawCards(deck, hand, 2);

      expect(result.deck.cards).toHaveLength(0);
      expect(result.hand.cards).toHaveLength(2);
      expect(result.cards).toEqual([card1, card2]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle drawing 0 cards", () => {
      const deck = createDeckZone(player1, [card1, card2, card3]);
      const hand = createHandZone(player1, []);

      const result = drawCards(deck, hand, 0);

      expect(result.deck.cards).toHaveLength(3);
      expect(result.hand.cards).toHaveLength(0);
      expect(result.cards).toEqual([]);
    });

    it("should not mutate original zones", () => {
      const originalDeck = createDeckZone(player1, [card1, card2, card3]);
      const originalHand = createHandZone(player1, []);

      const result = drawCards(originalDeck, originalHand, 1);

      // Original zones should be unchanged
      expect(originalDeck.cards).toEqual([card1, card2, card3]);
      expect(originalHand.cards).toEqual([]);

      // Result zones should be different objects
      expect(result.deck).not.toBe(originalDeck);
      expect(result.hand).not.toBe(originalHand);
    });
  });
});
