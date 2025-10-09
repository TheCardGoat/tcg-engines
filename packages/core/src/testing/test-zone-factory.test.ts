import { describe, expect, it } from "bun:test";
import { createCardId, createPlayerId } from "../types";
import type { Zone } from "../zones/zone";
import {
  createTestDeck,
  createTestGraveyard,
  createTestHand,
  createTestPlayArea,
  createTestZone,
} from "./test-zone-factory";

describe("test-zone-factory", () => {
  describe("createTestZone", () => {
    it("should create zone with default values", () => {
      const zone = createTestZone();

      expect(zone.config.id).toBeDefined();
      expect(zone.config.name).toBeDefined();
      expect(zone.config.visibility).toBeDefined();
      expect(zone.config.ordered).toBeDefined();
      expect(zone.cards).toEqual([]);
    });

    it("should override config properties", () => {
      const zone = createTestZone({
        name: "Custom Zone",
        visibility: "secret",
        ordered: true,
      });

      expect(zone.config.name).toBe("Custom Zone");
      expect(zone.config.visibility).toBe("secret");
      expect(zone.config.ordered).toBe(true);
    });

    it("should include initial cards", () => {
      const cards = [
        createCardId("card1"),
        createCardId("card2"),
        createCardId("card3"),
      ];

      const zone = createTestZone({}, cards);

      expect(zone.cards).toEqual(cards);
      expect(zone.cards.length).toBe(3);
    });

    it("should generate unique zone IDs", () => {
      const zone1 = createTestZone();
      const zone2 = createTestZone();
      const zone3 = createTestZone();

      expect(zone1.config.id).not.toBe(zone2.config.id);
      expect(zone2.config.id).not.toBe(zone3.config.id);
    });

    it("should support maxSize", () => {
      const zone = createTestZone({ maxSize: 10 });

      expect(zone.config.maxSize).toBe(10);
    });

    it("should support owner", () => {
      const playerId = createPlayerId("p1");
      const zone = createTestZone({ owner: playerId });

      expect(zone.config.owner).toBe(playerId);
    });

    it("should support faceDown", () => {
      const zone = createTestZone({ faceDown: true });

      expect(zone.config.faceDown).toBe(true);
    });

    it("should create valid Zone type", () => {
      const zone = createTestZone();

      // TypeScript type check
      const validate = (z: Zone) => z;
      expect(() => validate(zone)).not.toThrow();
    });
  });

  describe("createTestDeck", () => {
    it("should create deck zone with appropriate defaults", () => {
      const deck = createTestDeck();

      expect(deck.config.name).toContain("Deck");
      expect(deck.config.visibility).toBe("secret");
      expect(deck.config.ordered).toBe(true);
      expect(deck.config.faceDown).toBe(true);
    });

    it("should include cards when provided", () => {
      const cards = [
        createCardId("card1"),
        createCardId("card2"),
        createCardId("card3"),
      ];

      const deck = createTestDeck(cards);

      expect(deck.cards).toEqual(cards);
    });

    it("should support owner", () => {
      const playerId = createPlayerId("p1");
      const deck = createTestDeck([], playerId);

      expect(deck.config.owner).toBe(playerId);
    });

    it("should maintain card order", () => {
      const cards = [
        createCardId("card1"),
        createCardId("card2"),
        createCardId("card3"),
      ];

      const deck = createTestDeck(cards);

      // Order should be preserved
      expect(deck.cards[0]).toBe(cards[0]);
      expect(deck.cards[1]).toBe(cards[1]);
      expect(deck.cards[2]).toBe(cards[2]);
    });
  });

  describe("createTestHand", () => {
    it("should create hand zone with appropriate defaults", () => {
      const hand = createTestHand();

      expect(hand.config.name).toContain("Hand");
      expect(hand.config.visibility).toBe("private");
      expect(hand.config.ordered).toBe(false);
      expect(hand.config.faceDown).toBe(false);
    });

    it("should include cards when provided", () => {
      const cards = [createCardId("card1"), createCardId("card2")];

      const hand = createTestHand(cards);

      expect(hand.cards).toEqual(cards);
    });

    it("should support owner", () => {
      const playerId = createPlayerId("p1");
      const hand = createTestHand([], playerId);

      expect(hand.config.owner).toBe(playerId);
    });
  });

  describe("createTestPlayArea", () => {
    it("should create play area with appropriate defaults", () => {
      const playArea = createTestPlayArea();

      expect(playArea.config.name).toContain("Play Area");
      expect(playArea.config.visibility).toBe("public");
      expect(playArea.config.ordered).toBe(false);
      expect(playArea.config.faceDown).toBe(false);
    });

    it("should include cards when provided", () => {
      const cards = [createCardId("card1"), createCardId("card2")];

      const playArea = createTestPlayArea(cards);

      expect(playArea.cards).toEqual(cards);
    });

    it("should support owner", () => {
      const playerId = createPlayerId("p1");
      const playArea = createTestPlayArea([], playerId);

      expect(playArea.config.owner).toBe(playerId);
    });
  });

  describe("createTestGraveyard", () => {
    it("should create graveyard with appropriate defaults", () => {
      const graveyard = createTestGraveyard();

      expect(graveyard.config.name).toContain("Graveyard");
      expect(graveyard.config.visibility).toBe("public");
      expect(graveyard.config.ordered).toBe(true);
      expect(graveyard.config.faceDown).toBe(false);
    });

    it("should include cards when provided", () => {
      const cards = [createCardId("card1"), createCardId("card2")];

      const graveyard = createTestGraveyard(cards);

      expect(graveyard.cards).toEqual(cards);
    });

    it("should support owner", () => {
      const playerId = createPlayerId("p1");
      const graveyard = createTestGraveyard([], playerId);

      expect(graveyard.config.owner).toBe(playerId);
    });

    it("should maintain card order", () => {
      const cards = [
        createCardId("card1"),
        createCardId("card2"),
        createCardId("card3"),
      ];

      const graveyard = createTestGraveyard(cards);

      // Order should be preserved (cards go on top)
      expect(graveyard.cards[0]).toBe(cards[0]);
      expect(graveyard.cards[1]).toBe(cards[1]);
      expect(graveyard.cards[2]).toBe(cards[2]);
    });
  });

  describe("integration", () => {
    it("should create complete player zone setup", () => {
      const playerId = createPlayerId("p1");

      // Create all zones for a player
      const deckCards = [
        createCardId("card1"),
        createCardId("card2"),
        createCardId("card3"),
      ];
      const handCards = [createCardId("card4"), createCardId("card5")];

      const deck = createTestDeck(deckCards, playerId);
      const hand = createTestHand(handCards, playerId);
      const playArea = createTestPlayArea([], playerId);
      const graveyard = createTestGraveyard([], playerId);

      // Verify all zones created correctly
      expect(deck.config.owner).toBe(playerId);
      expect(hand.config.owner).toBe(playerId);
      expect(playArea.config.owner).toBe(playerId);
      expect(graveyard.config.owner).toBe(playerId);

      // Verify zones have correct visibility
      expect(deck.config.visibility).toBe("secret");
      expect(hand.config.visibility).toBe("private");
      expect(playArea.config.visibility).toBe("public");
      expect(graveyard.config.visibility).toBe("public");

      // Verify cards distributed correctly
      expect(deck.cards.length).toBe(3);
      expect(hand.cards.length).toBe(2);
      expect(playArea.cards.length).toBe(0);
      expect(graveyard.cards.length).toBe(0);
    });

    it("should work with zone operations", () => {
      const deck = createTestDeck([
        createCardId("card1"),
        createCardId("card2"),
        createCardId("card3"),
      ]);

      // Test that zone factory creates zones compatible with zone operations
      expect(deck.cards.length).toBe(3);
      expect(deck.config.ordered).toBe(true);

      // Simulate drawing a card
      const drawnCard = deck.cards.pop();
      expect(drawnCard).toBe(createCardId("card3"));
      expect(deck.cards.length).toBe(2);
    });

    it("should create zones for multiple players", () => {
      const p1 = createPlayerId("p1");
      const p2 = createPlayerId("p2");

      const p1Deck = createTestDeck(
        [createCardId("p1-card1"), createCardId("p1-card2")],
        p1,
      );
      const p2Deck = createTestDeck(
        [createCardId("p2-card1"), createCardId("p2-card2")],
        p2,
      );

      expect(p1Deck.config.owner).toBe(p1);
      expect(p2Deck.config.owner).toBe(p2);
      expect(p1Deck.config.id).not.toBe(p2Deck.config.id);
    });
  });
});
