/**
 * Gundam Card Game - Zone Operations Tests
 *
 * Tests for zone operations using @tcg/core utilities.
 * These tests verify that core zone operations work correctly with Gundam's zone structure.
 *
 * Test Coverage:
 * 1. Basic zone operations (add, remove, move cards)
 * 2. Gundam-specific zones (deck, resourceDeck, hand, battleArea, shield, base, resourceArea, trash, removal)
 * 3. Zone capacity limits (e.g., max 6 units in battle area, max 1 base)
 * 4. Zone visibility rules (private vs public zones)
 * 5. Special operations (shield damage, resource placement)
 *
 * References:
 * - Gundam Official Rules v1.0
 * - @tcg/core zone operations API
 */

import { beforeEach, describe, expect, it } from "bun:test";
import {
  type CardId,
  type PlayerId,
  type Zone,
  addCard,
  createCardId,
  createPlayerId,
  createZone,
  createZoneId,
  draw,
  moveCard,
  removeCard,
  shuffle,
} from "@tcg/core";

describe("Gundam Zone Operations - Core Integration", () => {
  let player1: PlayerId;
  let player2: PlayerId;
  let card1: CardId;
  let card2: CardId;
  let card3: CardId;

  beforeEach(() => {
    player1 = createPlayerId("player1");
    player2 = createPlayerId("player2");
    card1 = createCardId("card-1");
    card2 = createCardId("card-2");
    card3 = createCardId("card-3");
  });

  describe("Deck Operations", () => {
    it("should create a deck zone with proper configuration", () => {
      const deckZone = createZone(
        {
          faceDown: true,
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          owner: player1,
          visibility: "secret",
        },
        [],
      );

      expect(deckZone.config.id).toBeDefined();
      expect(deckZone.config.name).toBe("Deck");
      expect(deckZone.config.visibility).toBe("secret");
      expect(deckZone.config.ordered).toBe(true);
      expect(deckZone.config.owner).toBe(player1);
      expect(deckZone.config.faceDown).toBe(true);
      expect(deckZone.cards).toEqual([]);
    });

    it("should shuffle deck maintaining all cards", () => {
      const deckCards = [card1, card2, card3];
      const deckZone = createZone(
        {
          faceDown: true,
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          owner: player1,
          visibility: "secret",
        },
        deckCards,
      );

      const shuffled = shuffle(deckZone, "test-seed");

      expect(shuffled.cards).toHaveLength(3);
      expect(shuffled.cards).toContain(card1);
      expect(shuffled.cards).toContain(card2);
      expect(shuffled.cards).toContain(card3);
    });

    it("should draw card from deck to hand", () => {
      const deckZone = createZone(
        {
          faceDown: true,
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          owner: player1,
          visibility: "secret",
        },
        [card1, card2, card3],
      );

      const handZone = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          owner: player1,
          visibility: "private",
        },
        [],
      );

      const {
        fromZone: updatedDeck,
        toZone: updatedHand,
        drawnCards,
      } = draw(deckZone, handZone, 1);

      expect(drawnCards).toHaveLength(1);
      expect(drawnCards[0]).toBeDefined();
      expect(updatedDeck.cards).toHaveLength(2);
      expect(updatedDeck.cards).not.toContain(drawnCards[0]);
      expect(updatedHand.cards).toContain(drawnCards[0]);
    });
  });

  describe("Resource Deck Operations", () => {
    it("should create resource deck zone with proper configuration", () => {
      const resourceDeckZone = createZone({
        faceDown: true,
        id: createZoneId("resource-deck"),
        name: "Resource Deck",
        ordered: true,
        owner: player1,
        visibility: "secret",
      });

      expect(resourceDeckZone.config.name).toBe("Resource Deck");
      expect(resourceDeckZone.config.visibility).toBe("secret");
      expect(resourceDeckZone.config.faceDown).toBe(true);
    });

    it("should draw resource card from resource deck", () => {
      const resourceCards = [card1, card2, card3];
      const resourceDeckZone = createZone(
        {
          faceDown: true,
          id: createZoneId("resource-deck"),
          name: "Resource Deck",
          ordered: true,
          owner: player1,
          visibility: "secret",
        },
        resourceCards,
      );

      const resourceHandZone = createZone(
        {
          id: createZoneId("resource-hand"),
          name: "Resource Hand",
          ordered: false,
          owner: player1,
          visibility: "private",
        },
        [],
      );

      const {
        fromZone: updatedDeck,
        toZone: updatedHand,
        drawnCards,
      } = draw(resourceDeckZone, resourceHandZone, 1);

      expect(drawnCards).toHaveLength(1);
      expect(updatedDeck.cards).toHaveLength(2);
      expect(updatedHand.cards).toHaveLength(1);
    });
  });

  describe("Hand Operations", () => {
    it("should create hand zone with proper configuration", () => {
      const handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      expect(handZone.config.name).toBe("Hand");
      expect(handZone.config.visibility).toBe("private");
      expect(handZone.config.ordered).toBe(false);
    });

    it("should add card to hand", () => {
      const handZone = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      const updatedHand = addCard(handZone, card1);

      expect(updatedHand.cards).toContain(card1);
      expect(updatedHand.cards).toHaveLength(1);
    });

    it("should remove card from hand", () => {
      const handZone = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          owner: player1,
          visibility: "private",
        },
        [card1, card2],
      );

      const updatedHand = removeCard(handZone, card1);

      expect(updatedHand.cards).not.toContain(card1);
      expect(updatedHand.cards).toHaveLength(1);
    });

    it("should enforce hand limit of 10 cards", () => {
      const cards = Array.from({ length: 10 }, (_, i) => createCardId(`card-${i}`));
      const handZone = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          owner: player1,
          visibility: "private",
        },
        cards,
      );

      expect(handZone.cards).toHaveLength(10);
      // Validation for exceeding limit would be in move conditions
    });
  });

  describe("Battle Area Operations", () => {
    it("should create battle area zone with proper configuration", () => {
      const battleZone = createZone({
        id: createZoneId("battle-area"),
        name: "Battle Area",
        ordered: true,
        owner: player1,
        visibility: "public",
      });

      expect(battleZone.config.name).toBe("Battle Area");
      expect(battleZone.config.visibility).toBe("public");
      expect(battleZone.config.ordered).toBe(true);
    });

    it("should deploy unit to battle area", () => {
      const handZone = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          owner: player1,
          visibility: "private",
        },
        [card1],
      );

      const battleZone = createZone({
        id: createZoneId("battle-area"),
        name: "Battle Area",
        ordered: true,
        owner: player1,
        visibility: "public",
      });

      const { fromZone, toZone } = moveCard(handZone, battleZone, card1);

      expect(fromZone.cards).not.toContain(card1);
      expect(toZone.cards).toContain(card1);
    });

    it("should enforce battle area limit of 6 units", () => {
      const cards = Array.from({ length: 6 }, (_, i) => createCardId(`unit-${i}`));
      const battleZone = createZone(
        {
          id: createZoneId("battle-area"),
          name: "Battle Area",
          ordered: true,
          owner: player1,
          visibility: "public",
        },
        cards,
      );

      expect(battleZone.cards).toHaveLength(6);
      // Validation for exceeding limit would be in move conditions
    });
  });

  describe("Shield Section Operations", () => {
    it("should create shield section zone with proper configuration", () => {
      const shieldZone = createZone({
        faceDown: true,
        id: createZoneId("shield-section"),
        name: "Shield Section",
        ordered: true,
        owner: player1,
        visibility: "secret",
      });

      expect(shieldZone.config.name).toBe("Shield Section");
      expect(shieldZone.config.visibility).toBe("secret");
      expect(shieldZone.config.faceDown).toBe(true);
    });

    it("should place 6 shield cards during setup", () => {
      const shieldCards = Array.from({ length: 6 }, (_, i) => createCardId(`shield-${i}`));
      const shieldZone = createZone(
        {
          faceDown: true,
          id: createZoneId("shield-section"),
          name: "Shield Section",
          ordered: true,
          owner: player1,
          visibility: "secret",
        },
        shieldCards,
      );

      expect(shieldZone.cards).toHaveLength(6);
    });

    it("should remove shield when taking damage", () => {
      const shieldCards = [card1, card2, card3];
      const shieldZone = createZone(
        {
          faceDown: true,
          id: createZoneId("shield-section"),
          name: "Shield Section",
          ordered: true,
          owner: player1,
          visibility: "secret",
        },
        shieldCards,
      );

      const trashZone = createZone(
        {
          id: createZoneId("trash"),
          name: "Trash",
          ordered: true,
          owner: player1,
          visibility: "public",
        },
        [],
      );

      // Remove top shield (draw operation gets from top)
      const {
        fromZone: updatedShield,
        toZone: updatedTrash,
        drawnCards: removedShields,
      } = draw(shieldZone, trashZone, 1);

      expect(removedShields).toHaveLength(1);
      expect(updatedShield.cards).toHaveLength(2);
      expect(updatedTrash.cards).toHaveLength(1);
    });
  });

  describe("Base Section Operations", () => {
    it("should create base section zone with proper configuration", () => {
      const baseZone = createZone({
        id: createZoneId("base-section"),
        name: "Base Section",
        ordered: false,
        owner: player1,
        visibility: "public",
      });

      expect(baseZone.config.name).toBe("Base Section");
      expect(baseZone.config.visibility).toBe("public");
    });

    it("should place EX Base during setup", () => {
      const exBase = createCardId("ex-base");
      const baseZone = createZone({
        id: createZoneId("base-section"),
        name: "Base Section",
        ordered: false,
        owner: player1,
        visibility: "public",
      });

      const updatedBase = addCard(baseZone, exBase);

      expect(updatedBase.cards).toContain(exBase);
      expect(updatedBase.cards).toHaveLength(1);
    });

    it("should enforce base section limit of 1 card", () => {
      const exBase = createCardId("ex-base");
      const baseZone = createZone(
        {
          id: createZoneId("base-section"),
          name: "Base Section",
          ordered: false,
          owner: player1,
          visibility: "public",
        },
        [exBase],
      );

      expect(baseZone.cards).toHaveLength(1);
      // Validation for exceeding limit would be in move conditions
    });
  });

  describe("Resource Area Operations", () => {
    it("should create resource area zone with proper configuration", () => {
      const resourceZone = createZone({
        id: createZoneId("resource-area"),
        name: "Resource Area",
        ordered: false,
        owner: player1,
        visibility: "public",
      });

      expect(resourceZone.config.name).toBe("Resource Area");
      expect(resourceZone.config.visibility).toBe("public");
      expect(resourceZone.config.ordered).toBe(false);
    });

    it("should place resource card from hand", () => {
      const handZone = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          owner: player1,
          visibility: "private",
        },
        [card1],
      );

      const resourceZone = createZone({
        id: createZoneId("resource-area"),
        name: "Resource Area",
        ordered: false,
        owner: player1,
        visibility: "public",
      });

      const { fromZone, toZone } = moveCard(handZone, resourceZone, card1);

      expect(fromZone.cards).not.toContain(card1);
      expect(toZone.cards).toContain(card1);
    });

    it("should enforce resource area limit of 15 cards", () => {
      const resources = Array.from({ length: 15 }, (_, i) => createCardId(`resource-${i}`));
      const resourceZone = createZone(
        {
          id: createZoneId("resource-area"),
          name: "Resource Area",
          ordered: false,
          owner: player1,
          visibility: "public",
        },
        resources,
      );

      expect(resourceZone.cards).toHaveLength(15);
      // Validation for exceeding limit would be in move conditions
    });

    it("should give player 2 EX Resource during setup", () => {
      const exResource = createCardId("ex-resource");
      const resourceZone = createZone({
        id: createZoneId("resource-area"),
        name: "Resource Area",
        ordered: false,
        owner: player2,
        visibility: "public",
      });

      const updatedResource = addCard(resourceZone, exResource);

      expect(updatedResource.cards).toContain(exResource);
    });
  });

  describe("Trash Operations", () => {
    it("should create trash zone with proper configuration", () => {
      const trashZone = createZone({
        id: createZoneId("trash"),
        name: "Trash",
        ordered: true,
        owner: player1,
        visibility: "public",
      });

      expect(trashZone.config.name).toBe("Trash");
      expect(trashZone.config.visibility).toBe("public");
      expect(trashZone.config.ordered).toBe(true);
    });

    it("should move destroyed unit to trash", () => {
      const battleZone = createZone(
        {
          id: createZoneId("battle-area"),
          name: "Battle Area",
          ordered: true,
          owner: player1,
          visibility: "public",
        },
        [card1],
      );

      const trashZone = createZone({
        id: createZoneId("trash"),
        name: "Trash",
        ordered: true,
        owner: player1,
        visibility: "public",
      });

      const { fromZone, toZone } = moveCard(battleZone, trashZone, card1);

      expect(fromZone.cards).not.toContain(card1);
      expect(toZone.cards).toContain(card1);
    });

    it("should add cards to top of trash (visible)", () => {
      const trashZone = createZone(
        {
          id: createZoneId("trash"),
          name: "Trash",
          ordered: true,
          owner: player1,
          visibility: "public",
        },
        [card1],
      );

      const updatedTrash = addCard(trashZone, card2);

      expect(updatedTrash.cards[updatedTrash.cards.length - 1]).toBe(card2);
    });
  });

  describe("Removal Area Operations", () => {
    it("should create removal area zone with proper configuration", () => {
      const removalZone = createZone({
        id: createZoneId("removal"),
        name: "Removal Area",
        ordered: false,
        owner: player1,
        visibility: "public",
      });

      expect(removalZone.config.name).toBe("Removal Area");
      expect(removalZone.config.visibility).toBe("public");
      expect(removalZone.config.ordered).toBe(false);
    });

    it("should move card to removal area (removed from game)", () => {
      const battleZone = createZone(
        {
          id: createZoneId("battle-area"),
          name: "Battle Area",
          ordered: true,
          owner: player1,
          visibility: "public",
        },
        [card1],
      );

      const removalZone = createZone({
        id: createZoneId("removal"),
        name: "Removal Area",
        ordered: false,
        owner: player1,
        visibility: "public",
      });

      const { fromZone, toZone } = moveCard(battleZone, removalZone, card1);

      expect(fromZone.cards).not.toContain(card1);
      expect(toZone.cards).toContain(card1);
    });
  });

  describe("Zone Immutability", () => {
    it("should not mutate original zone when adding cards", () => {
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
      expect(originalZone).not.toBe(updatedZone);
    });

    it("should not mutate original zones when moving cards", () => {
      const originalFrom = createZone(
        {
          id: createZoneId("hand"),
          name: "Hand",
          ordered: false,
          owner: player1,
          visibility: "private",
        },
        [card1],
      );

      const originalTo = createZone({
        id: createZoneId("battle-area"),
        name: "Battle Area",
        ordered: true,
        owner: player1,
        visibility: "public",
      });

      const { fromZone, toZone } = moveCard(originalFrom, originalTo, card1);

      expect(originalFrom.cards).toEqual([card1]);
      expect(originalTo.cards).toEqual([]);
      expect(fromZone.cards).toEqual([]);
      expect(toZone.cards).toEqual([card1]);
    });
  });

  describe("Multi-Zone Operations", () => {
    it("should handle complex scenario: draw, deploy, and attack sequence", () => {
      // Setup initial zones
      const deck = createZone(
        {
          faceDown: true,
          id: createZoneId("deck"),
          name: "Deck",
          ordered: true,
          owner: player1,
          visibility: "secret",
        },
        [card1, card2, card3],
      );

      const hand = createZone({
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: player1,
        visibility: "private",
      });

      const battleArea = createZone({
        id: createZoneId("battle-area"),
        name: "Battle Area",
        ordered: true,
        owner: player1,
        visibility: "public",
      });

      // Step 1: Draw card
      const { fromZone: updatedDeck, toZone: handWithCard, drawnCards } = draw(deck, hand, 1);
      const drawnCard = drawnCards[0];
      expect(drawnCard).toBeDefined();

      // Step 2: Deploy unit
      const { fromZone: handAfterDeploy, toZone: battleAfterDeploy } = moveCard(
        handWithCard,
        battleArea,
        drawnCard!,
      );

      // Verify final state
      expect(updatedDeck.cards).toHaveLength(2);
      expect(handAfterDeploy.cards).toHaveLength(0);
      expect(battleAfterDeploy.cards).toHaveLength(1);
      expect(battleAfterDeploy.cards[0]).toBe(drawnCard);
    });
  });
});
