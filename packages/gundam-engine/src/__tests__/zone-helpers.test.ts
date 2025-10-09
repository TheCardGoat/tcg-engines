/**
 * Gundam Card Game - Zone Helper Tests
 *
 * Tests for gundam-specific zone helper functions using @tcg/core/testing utilities.
 * Demonstrates proper usage of test factories, assertions, and builders.
 *
 * @module __tests__/zone-helpers
 */

import { beforeEach, describe, expect, it } from "bun:test";
import { type CardId, createPlayerId } from "@tcg/core";
import {
  createTestCard,
  createTestCards,
  resetCardCounter,
} from "@tcg/core/testing";
import {
  createPlayerZones,
  deployUnit,
  destroyUnit,
  drawCards,
  placeResource,
  shuffleDeck,
  takeDamage,
} from "../zones";

describe("Gundam Zone Helpers - Using @tcg/core/testing", () => {
  beforeEach(() => {
    // Reset card counter for deterministic test IDs
    resetCardCounter();
  });

  describe("createPlayerZones", () => {
    it("should create all zones for a player", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      // Verify all zones exist
      expect(zones.deck).toBeDefined();
      expect(zones.resourceDeck).toBeDefined();
      expect(zones.hand).toBeDefined();
      expect(zones.battleArea).toBeDefined();
      expect(zones.shieldSection).toBeDefined();
      expect(zones.baseSection).toBeDefined();
      expect(zones.resourceArea).toBeDefined();
      expect(zones.trash).toBeDefined();
      expect(zones.removal).toBeDefined();

      // Verify zones are properly configured
      expect(zones.deck.config.owner).toBe(playerId);
      expect(zones.hand.config.maxSize).toBe(10);
      expect(zones.battleArea.config.maxSize).toBe(6);
      expect(zones.resourceArea.config.maxSize).toBe(15);
      expect(zones.baseSection.config.maxSize).toBe(1);
    });

    it("should create zones with correct visibility", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      expect(zones.deck.config.visibility).toBe("secret");
      expect(zones.hand.config.visibility).toBe("private");
      expect(zones.battleArea.config.visibility).toBe("public");
      expect(zones.trash.config.visibility).toBe("public");
    });
  });

  describe("drawCards", () => {
    it("should draw cards from deck to hand using test factories", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      // Create test cards using core testing utilities
      const cards = createTestCards(5);
      const deckWithCards = {
        ...zones.deck,
        cards: cards.map((c) => c.id) as CardId[],
      };

      const result = drawCards(deckWithCards, zones.hand, 2);

      expect(result.cards).toHaveLength(2);
      expect(result.deck.cards).toHaveLength(3);
      expect(result.hand.cards).toHaveLength(2);
    });

    it("should maintain card order when drawing", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const card1 = createTestCard({ name: "First Card" });
      const card2 = createTestCard({ name: "Second Card" });
      const card3 = createTestCard({ name: "Third Card" });

      const deckWithCards = {
        ...zones.deck,
        cards: [card1.id, card2.id, card3.id] as CardId[],
      };

      const result = drawCards(deckWithCards, zones.hand, 1);

      // First card should be drawn (from top of deck)
      expect(result.cards[0]).toBe(card1.id as CardId);
      expect(result.deck.cards).toEqual([card2.id, card3.id] as CardId[]);
    });
  });

  describe("shuffleDeck", () => {
    it("should shuffle deck deterministically with same seed", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const cards = createTestCards(10);
      const deckWithCards = {
        ...zones.deck,
        cards: cards.map((c) => c.id) as CardId[],
      };

      const shuffled1 = shuffleDeck(deckWithCards, "test-seed-123");
      const shuffled2 = shuffleDeck(deckWithCards, "test-seed-123");

      expect(shuffled1.cards).toEqual(shuffled2.cards);
    });

    it("should produce different orders with different seeds", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const cards = createTestCards(10);
      const deckWithCards = {
        ...zones.deck,
        cards: cards.map((c) => c.id) as CardId[],
      };

      const shuffled1 = shuffleDeck(deckWithCards, "seed-1");
      const shuffled2 = shuffleDeck(deckWithCards, "seed-2");

      expect(shuffled1.cards).not.toEqual(shuffled2.cards);
    });
  });

  describe("deployUnit", () => {
    it("should move unit from hand to battle area", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const unit = createTestCard({ name: "Gundam" });
      const handWithCard = { ...zones.hand, cards: [unit.id] as CardId[] };

      const result = deployUnit(
        handWithCard,
        zones.battleArea,
        unit.id as CardId,
      );

      expect(result.hand.cards).not.toContain(unit.id);
      expect(result.battleArea.cards).toContain(unit.id);
    });

    it("should respect battle area maximum size", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const units = createTestCards(6);
      const battleAreaFull = {
        ...zones.battleArea,
        cards: units.map((u) => u.id) as CardId[],
      };

      const newUnit = createTestCard({ name: "Extra Unit" });
      const handWithCard = { ...zones.hand, cards: [newUnit.id] as CardId[] };

      // This should throw because battle area is at max capacity
      expect(() => {
        deployUnit(handWithCard, battleAreaFull, newUnit.id as CardId);
      }).toThrow();
    });
  });

  describe("placeResource", () => {
    it("should move card from hand to resource area", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const resource = createTestCard({ name: "Resource Card" });
      const handWithCard = { ...zones.hand, cards: [resource.id] as CardId[] };

      const result = placeResource(
        handWithCard,
        zones.resourceArea,
        resource.id as CardId,
      );

      expect(result.hand.cards).not.toContain(resource.id);
      expect(result.resourceArea.cards).toContain(resource.id);
    });

    it("should respect resource area maximum size (15)", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const resources = createTestCards(15);
      const resourceAreaFull = {
        ...zones.resourceArea,
        cards: resources.map((r) => r.id) as CardId[],
      };

      const newResource = createTestCard({ name: "Extra Resource" });
      const handWithCard = {
        ...zones.hand,
        cards: [newResource.id] as CardId[],
      };

      expect(() => {
        placeResource(handWithCard, resourceAreaFull, newResource.id as CardId);
      }).toThrow();
    });
  });

  describe("destroyUnit", () => {
    it("should move unit from battle area to trash", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const unit = createTestCard({ name: "Destroyed Unit" });
      const battleAreaWithUnit = {
        ...zones.battleArea,
        cards: [unit.id] as CardId[],
      };

      const result = destroyUnit(
        battleAreaWithUnit,
        zones.trash,
        unit.id as CardId,
      );

      expect(result.battleArea.cards).not.toContain(unit.id);
      expect(result.trash.cards).toContain(unit.id);
    });

    it("should maintain trash order (newest on top)", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const unit1 = createTestCard({ name: "First Destroyed" });
      const unit2 = createTestCard({ name: "Second Destroyed" });

      const battleArea = {
        ...zones.battleArea,
        cards: [unit1.id, unit2.id] as CardId[],
      };
      const trash = { ...zones.trash, cards: [] as CardId[] };

      const result1 = destroyUnit(battleArea, trash, unit1.id as CardId);
      const battleAreaAfter = { ...result1.battleArea };
      const result2 = destroyUnit(
        battleAreaAfter,
        result1.trash,
        unit2.id as CardId,
      );

      // Newest destroyed unit should be at the end (visible on top)
      expect(result2.trash.cards[result2.trash.cards.length - 1]).toBe(
        unit2.id as CardId,
      );
    });
  });

  describe("takeDamage", () => {
    it("should remove shields equal to damage", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const shields = createTestCards(6);
      const shieldSectionWithCards = {
        ...zones.shieldSection,
        cards: shields.map((s) => s.id) as CardId[],
      };

      const result = takeDamage(shieldSectionWithCards, zones.trash, 2);

      expect(result.removedShields).toHaveLength(2);
      expect(result.shieldSection.cards).toHaveLength(4);
      expect(result.trash.cards).toHaveLength(2);
    });

    it("should handle lethal damage (no shields remaining)", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const shields = createTestCards(2);
      const shieldSectionWithCards = {
        ...zones.shieldSection,
        cards: shields.map((s) => s.id) as CardId[],
      };

      // Taking more damage than shields available should throw
      expect(() => {
        takeDamage(shieldSectionWithCards, zones.trash, 3);
      }).toThrow();
    });

    it("should remove shields in order (top first)", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const shield1 = createTestCard({ name: "Shield 1" });
      const shield2 = createTestCard({ name: "Shield 2" });
      const shield3 = createTestCard({ name: "Shield 3" });

      const shieldSection = {
        ...zones.shieldSection,
        cards: [shield1.id, shield2.id, shield3.id] as CardId[],
      };

      const result = takeDamage(shieldSection, zones.trash, 1);

      // First shield should be removed
      expect(result.removedShields[0]).toBe(shield1.id as CardId);
      expect(result.shieldSection.cards).toEqual([
        shield2.id,
        shield3.id,
      ] as CardId[]);
    });
  });

  describe("Game Flow Scenario Tests", () => {
    it("should handle typical turn: draw, place resource, deploy unit", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      // Setup: Create deck with test cards
      const deckCards = createTestCards(50);
      const resourceCard = createTestCard({ name: "Resource" });
      const unitCard = createTestCard({ name: "Mobile Suit" });

      let deck = {
        ...zones.deck,
        cards: deckCards.map((c) => c.id) as CardId[],
      };
      let hand = {
        ...zones.hand,
        cards: [resourceCard.id, unitCard.id] as CardId[],
      };
      let resourceArea = zones.resourceArea;
      let battleArea = zones.battleArea;

      // Step 1: Draw a card
      const drawResult = drawCards(deck, hand, 1);
      deck = drawResult.deck;
      hand = drawResult.hand;

      expect(hand.cards).toHaveLength(3); // Started with 2, drew 1

      // Step 2: Place resource
      const placeResult = placeResource(
        hand,
        resourceArea,
        resourceCard.id as CardId,
      );
      hand = placeResult.hand;
      resourceArea = placeResult.resourceArea;

      expect(resourceArea.cards).toContain(resourceCard.id);
      expect(hand.cards).toHaveLength(2);

      // Step 3: Deploy unit
      const deployResult = deployUnit(hand, battleArea, unitCard.id as CardId);
      hand = deployResult.hand;
      battleArea = deployResult.battleArea;

      expect(battleArea.cards).toContain(unitCard.id);
      expect(hand.cards).toHaveLength(1); // Should have 1 card left (the drawn card)
    });

    it("should handle combat scenario: attack and take damage", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      // Setup shields
      const shields = createTestCards(6);
      let shieldSection = {
        ...zones.shieldSection,
        cards: shields.map((s) => s.id) as CardId[],
      };

      // Setup attacking unit
      const attacker = createTestCard({ name: "Attacking Unit" });
      const battleArea = {
        ...zones.battleArea,
        cards: [attacker.id] as CardId[],
      };

      let trash = zones.trash;

      // Defender takes 3 damage
      const damageResult = takeDamage(shieldSection, trash, 3);
      shieldSection = damageResult.shieldSection;
      trash = damageResult.trash;

      expect(shieldSection.cards).toHaveLength(3); // 6 - 3 = 3 shields remaining
      expect(trash.cards).toHaveLength(3); // 3 shields in trash
      expect(damageResult.removedShields).toHaveLength(3);
    });
  });

  describe("Immutability", () => {
    it("should not mutate original zones in any operation", () => {
      const playerId = createPlayerId("player1");
      const zones = createPlayerZones(playerId);

      const card = createTestCard({ name: "Test Card" });
      const originalDeck = { ...zones.deck, cards: [card.id] as CardId[] };
      const originalHand = { ...zones.hand, cards: [] as CardId[] };

      // Copy original state
      const originalDeckCards = [...originalDeck.cards];
      const originalHandCards = [...originalHand.cards];

      // Perform operation
      drawCards(originalDeck, originalHand, 1);

      // Verify originals unchanged
      expect(originalDeck.cards).toEqual(originalDeckCards);
      expect(originalHand.cards).toEqual(originalHandCards);
    });
  });
});
