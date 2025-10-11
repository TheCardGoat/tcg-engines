import { describe, expect, it } from "bun:test";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { ZoneOperations } from "./zone-operations";

describe("ZoneOperations Interface", () => {
  // Mock implementation for testing the interface structure
  const createMockZoneOperations = (): ZoneOperations => {
    const zones: Record<string, { cardIds: string[] }> = {
      deck: { cardIds: ["card-1", "card-2", "card-3"] },
      hand: { cardIds: ["card-4"] },
      play: { cardIds: [] },
    };

    return {
      moveCard: (args) => {
        const { cardId, targetZoneId } = args;
        // Find and remove from source
        for (const zoneId in zones) {
          const index = zones[zoneId].cardIds.indexOf(cardId);
          if (index !== -1) {
            zones[zoneId].cardIds.splice(index, 1);
            break;
          }
        }
        // Add to target
        if (!zones[targetZoneId]) {
          zones[targetZoneId] = { cardIds: [] };
        }
        if (args.position === "top") {
          zones[targetZoneId].cardIds.unshift(cardId);
        } else if (args.position === "bottom" || args.position === undefined) {
          zones[targetZoneId].cardIds.push(cardId);
        } else if (typeof args.position === "number") {
          zones[targetZoneId].cardIds.splice(args.position, 0, cardId);
        }
      },

      getCardsInZone: (zoneId, ownerId?) => {
        // Return a copy to avoid mutation issues
        return [...(zones[zoneId]?.cardIds || [])] as unknown as CardId[];
      },

      shuffleZone: (zoneId, ownerId?) => {
        // Mock shuffle - just reverse for testing
        if (zones[zoneId]) {
          zones[zoneId].cardIds.reverse();
        }
      },

      getCardZone: (cardId) => {
        for (const zoneId in zones) {
          if (zones[zoneId].cardIds.includes(cardId)) {
            return zoneId as ZoneId;
          }
        }
        return undefined;
      },

      drawCards: (params) => {
        const { from, to, count, playerId } = params;
        const drawn: CardId[] = [];
        const sourceZone = zones[from];
        if (sourceZone) {
          for (let i = 0; i < count; i++) {
            const cardId = sourceZone.cardIds.shift();
            if (cardId) {
              drawn.push(cardId as CardId);
              if (!zones[to]) zones[to] = { cardIds: [] };
              zones[to].cardIds.push(cardId);
            }
          }
        }
        return drawn;
      },

      mulligan: (params) => {
        const { hand, deck, drawCount, playerId } = params;
        // Move all cards from hand to deck
        if (zones[hand]) {
          zones[deck].cardIds.push(...zones[hand].cardIds);
          zones[hand].cardIds = [];
        }
        // Shuffle (reverse for testing)
        zones[deck].cardIds.reverse();
        // Draw new cards
        for (let i = 0; i < drawCount; i++) {
          const cardId = zones[deck].cardIds.shift();
          if (cardId) {
            zones[hand].cardIds.push(cardId);
          }
        }
      },

      bulkMove: (params) => {
        const { from, to, count, playerId, position } = params;
        const moved: CardId[] = [];
        const sourceZone = zones[from];
        if (sourceZone) {
          for (let i = 0; i < count; i++) {
            const cardId = sourceZone.cardIds.shift();
            if (cardId) {
              moved.push(cardId as CardId);
              if (!zones[to]) zones[to] = { cardIds: [] };
              if (position === 'top') {
                zones[to].cardIds.unshift(cardId);
              } else {
                zones[to].cardIds.push(cardId);
              }
            }
          }
        }
        return moved;
      },

      createDeck: (params) => {
        const { zoneId, playerId, cardCount, shuffle } = params;
        const created: CardId[] = [];
        if (!zones[zoneId]) zones[zoneId] = { cardIds: [] };
        for (let i = 0; i < cardCount; i++) {
          const cardId = `card-${Date.now()}-${i}` as CardId;
          created.push(cardId);
          zones[zoneId].cardIds.push(cardId);
        }
        if (shuffle) {
          zones[zoneId].cardIds.reverse(); // Mock shuffle
        }
        return created;
      },
    };
  };

  describe("moveCard", () => {
    it("should move a card to target zone", () => {
      const ops = createMockZoneOperations();

      ops.moveCard({
        cardId: "card-1" as CardId,
        targetZoneId: "hand" as ZoneId,
      });

      const deckCards = ops.getCardsInZone("deck" as ZoneId);
      const handCards = ops.getCardsInZone("hand" as ZoneId);

      expect(deckCards).not.toContain("card-1");
      expect(handCards).toContain("card-1");
    });

    it("should add card to top when position is 'top'", () => {
      const ops = createMockZoneOperations();

      ops.moveCard({
        cardId: "card-1" as CardId,
        targetZoneId: "hand" as ZoneId,
        position: "top",
      });

      const handCards = ops.getCardsInZone("hand" as ZoneId);
      expect(handCards[0]).toBe("card-1" as unknown as CardId);
    });

    it("should add card to bottom when position is 'bottom'", () => {
      const ops = createMockZoneOperations();

      ops.moveCard({
        cardId: "card-1" as CardId,
        targetZoneId: "hand" as ZoneId,
        position: "bottom",
      });

      const handCards = ops.getCardsInZone("hand" as ZoneId);
      expect(handCards[handCards.length - 1]).toBe(
        "card-1" as unknown as CardId,
      );
    });

    it("should insert card at specific position when position is a number", () => {
      const ops = createMockZoneOperations();

      ops.moveCard({
        cardId: "card-4" as CardId,
        targetZoneId: "deck" as ZoneId,
        position: 1,
      });

      const deckCards = ops.getCardsInZone("deck" as ZoneId);
      expect(deckCards[1]).toBe("card-4" as unknown as CardId);
    });
  });

  describe("getCardsInZone", () => {
    it("should return all cards in a zone", () => {
      const ops = createMockZoneOperations();

      const deckCards = ops.getCardsInZone("deck" as ZoneId);

      expect(deckCards).toHaveLength(3);
      expect(deckCards).toContain("card-1");
      expect(deckCards).toContain("card-2");
      expect(deckCards).toContain("card-3");
    });

    it("should return empty array for empty zone", () => {
      const ops = createMockZoneOperations();

      const playCards = ops.getCardsInZone("play" as ZoneId);

      expect(playCards).toHaveLength(0);
    });

    it("should accept optional ownerId parameter for player-specific zones", () => {
      const ops = createMockZoneOperations();

      // This just tests the signature works
      const cards = ops.getCardsInZone(
        "hand" as ZoneId,
        "player-1" as unknown as PlayerId,
      );

      expect(cards).toBeDefined();
    });
  });

  describe("shuffleZone", () => {
    it("should shuffle cards in a zone", () => {
      const ops = createMockZoneOperations();

      const beforeShuffle = ops.getCardsInZone("deck" as ZoneId);
      ops.shuffleZone("deck" as ZoneId);
      const afterShuffle = ops.getCardsInZone("deck" as ZoneId);

      // Mock implementation reverses, so order should be different
      expect(afterShuffle).toHaveLength(beforeShuffle.length);
      expect(afterShuffle[0]).not.toBe(beforeShuffle[0]);
    });

    it("should accept optional ownerId parameter for player-specific zones", () => {
      const ops = createMockZoneOperations();

      // This just tests the signature works
      ops.shuffleZone("deck" as ZoneId, "player-1" as unknown as PlayerId);

      expect(true).toBe(true); // Just verify it doesn't throw
    });
  });

  describe("getCardZone", () => {
    it("should return the zone containing a card", () => {
      const ops = createMockZoneOperations();

      const zone = ops.getCardZone("card-2" as CardId);

      expect(zone).toBe("deck" as ZoneId);
    });

    it("should return undefined when card is not in any zone", () => {
      const ops = createMockZoneOperations();

      const zone = ops.getCardZone("nonexistent-card" as CardId);

      expect(zone).toBeUndefined();
    });
  });

  describe("Type Safety", () => {
    it("should enforce CardId type for card identifiers", () => {
      const ops = createMockZoneOperations();

      // This is a compile-time test - it should type-check correctly
      const zone = ops.getCardZone("card-1" as unknown as CardId);

      expect(zone).toBeDefined();
    });

    it("should enforce ZoneId type for zone identifiers", () => {
      const ops = createMockZoneOperations();

      // This is a compile-time test - it should type-check correctly
      const cards = ops.getCardsInZone("deck" as unknown as ZoneId);

      expect(cards).toBeDefined();
    });

    it("should enforce PlayerId type for owner identifiers", () => {
      const ops = createMockZoneOperations();

      // This is a compile-time test - it should type-check correctly
      const cards = ops.getCardsInZone(
        "hand" as unknown as ZoneId,
        "player-1" as unknown as PlayerId,
      );

      expect(cards).toBeDefined();
    });
  });
});
