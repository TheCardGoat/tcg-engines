import { beforeEach, describe, expect, it } from "bun:test";
import { ZoneManager } from "../zone-manager";
import type { ZoneConfiguration } from "../zone-types";

// Test card type
interface TestCard {
  id: string;
  name: string;
  inkable?: boolean;
}

// Test configuration
const testConfiguration: ZoneConfiguration = {
  zones: {
    hand: {
      type: "private",
      perPlayer: true,
      maxSize: 7,
    },
    deck: {
      type: "private",
      perPlayer: true,
    },
    play: {
      type: "public",
      perPlayer: true,
    },
    discard: {
      type: "public",
      perPlayer: true,
    },
    shared: {
      type: "shared",
      perPlayer: false,
    },
  },
};

describe("ZoneManager", () => {
  let zoneManager: ZoneManager<TestCard>;

  beforeEach(() => {
    zoneManager = new ZoneManager<TestCard>(testConfiguration);
  });

  describe("initialization", () => {
    it("should initialize non-player zones on construction", () => {
      const sharedZone = zoneManager.getZone("shared");
      expect(sharedZone).toBeDefined();
      expect(sharedZone?.type).toBe("shared");
      expect(sharedZone?.owner).toBeUndefined();
    });

    it("should not initialize player zones on construction", () => {
      const handZone = zoneManager.getZone("player1-hand");
      expect(handZone).toBeUndefined();
    });

    it("should initialize player zones when requested", () => {
      zoneManager.initializePlayerZones("player1");

      const handZone = zoneManager.getPlayerZone("player1", "hand");
      expect(handZone).toBeDefined();
      expect(handZone?.owner).toBe("player1");
      expect(handZone?.type).toBe("private");
      expect(handZone?.maxSize).toBe(7);
    });

    it("should initialize multiple player zones", () => {
      zoneManager.initializePlayerZones("player1");
      zoneManager.initializePlayerZones("player2");

      const player1Hand = zoneManager.getPlayerZone("player1", "hand");
      const player2Hand = zoneManager.getPlayerZone("player2", "hand");

      expect(player1Hand).toBeDefined();
      expect(player2Hand).toBeDefined();
      expect(player1Hand?.id).not.toBe(player2Hand?.id);
    });
  });

  describe("card management", () => {
    const testCard1: TestCard = { id: "card1", name: "Test Card 1" };
    const testCard2: TestCard = { id: "card2", name: "Test Card 2" };

    beforeEach(() => {
      zoneManager.initializePlayerZones("player1");
    });

    it("should add card to zone", () => {
      const result = zoneManager.addCardToZone(testCard1, "player1-hand");

      expect(result.success).toBe(true);
      expect(result.toZone).toBe("player1-hand");

      const handCards = zoneManager.getCardsInZone("player1-hand");
      expect(handCards).toHaveLength(1);
      expect(handCards[0]).toBe(testCard1);
    });

    it("should track card location", () => {
      zoneManager.addCardToZone(testCard1, "player1-hand");

      const location = zoneManager.getCardLocation("card1");
      expect(location).toEqual({
        zoneId: "player1-hand",
        index: 0,
        owner: "player1",
      });
    });

    it("should move card between zones", () => {
      zoneManager.addCardToZone(testCard1, "player1-hand");

      const result = zoneManager.moveCard(
        "card1",
        "player1-hand",
        "player1-play",
      );

      expect(result.success).toBe(true);
      expect(result.fromZone).toBe("player1-hand");
      expect(result.toZone).toBe("player1-play");

      const handCards = zoneManager.getCardsInZone("player1-hand");
      const playCards = zoneManager.getCardsInZone("player1-play");

      expect(handCards).toHaveLength(0);
      expect(playCards).toHaveLength(1);
      expect(playCards[0]).toBe(testCard1);
    });

    it("should fail to move non-existent card", () => {
      const result = zoneManager.moveCard(
        "nonexistent",
        "player1-hand",
        "player1-play",
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("not found in zone");
    });

    it("should fail to move to non-existent zone", () => {
      zoneManager.addCardToZone(testCard1, "player1-hand");

      const result = zoneManager.moveCard(
        "card1",
        "player1-hand",
        "nonexistent",
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("Target zone");
    });

    it("should respect zone capacity", () => {
      // Fill hand to capacity
      for (let i = 0; i < 7; i++) {
        const card: TestCard = { id: `card${i}`, name: `Card ${i}` };
        zoneManager.addCardToZone(card, "player1-hand");
      }

      // Try to add one more
      const extraCard: TestCard = { id: "extra", name: "Extra Card" };
      const result = zoneManager.addCardToZone(extraCard, "player1-hand");

      expect(result.success).toBe(false);
      expect(result.error).toContain("full");
    });

    it("should remove card from zone", () => {
      zoneManager.addCardToZone(testCard1, "player1-hand");

      const result = zoneManager.removeCardFromZone("card1", "player1-hand");

      expect(result.success).toBe(true);
      expect(result.fromZone).toBe("player1-hand");

      const handCards = zoneManager.getCardsInZone("player1-hand");
      expect(handCards).toHaveLength(0);
    });

    it("should find card across zones", () => {
      zoneManager.addCardToZone(testCard1, "player1-hand");
      zoneManager.addCardToZone(testCard2, "player1-play");

      const result1 = zoneManager.findCard("card1");
      const result2 = zoneManager.findCard("card2");

      expect(result1?.card).toBe(testCard1);
      expect(result1?.zone.id).toBe("player1-hand");

      expect(result2?.card).toBe(testCard2);
      expect(result2?.zone.id).toBe("player1-play");
    });
  });

  describe("zone rules", () => {
    it("should enforce canAdd rule", () => {
      const restrictedConfig: ZoneConfiguration = {
        zones: {
          restricted: {
            type: "public",
            perPlayer: false,
            rules: {
              canAdd: (card: TestCard) => card.inkable === true,
            },
          },
        },
      };

      const manager = new ZoneManager<TestCard>(restrictedConfig);

      const inkableCard: TestCard = {
        id: "ink1",
        name: "Inkable",
        inkable: true,
      };
      const nonInkableCard: TestCard = {
        id: "noink1",
        name: "Not Inkable",
        inkable: false,
      };

      const result1 = manager.addCardToZone(inkableCard, "restricted");
      const result2 = manager.addCardToZone(nonInkableCard, "restricted");

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(false);
      expect(result2.error).toContain("cannot be added");
    });

    it("should enforce canRemove rule", () => {
      const restrictedConfig: ZoneConfiguration = {
        zones: {
          locked: {
            type: "public",
            perPlayer: false,
            rules: {
              canRemove: () => false,
            },
          },
        },
      };

      const manager = new ZoneManager<TestCard>(restrictedConfig);
      const card: TestCard = { id: "card1", name: "Locked Card" };

      manager.addCardToZone(card, "locked");
      const result = manager.removeCardFromZone("card1", "locked");

      expect(result.success).toBe(false);
      expect(result.error).toContain("cannot be removed");
    });

    it("should call onAdd and onRemove hooks", () => {
      let addedCard: TestCard | null = null;
      let removedCard: TestCard | null = null;

      const hookedConfig: ZoneConfiguration = {
        zones: {
          hooked: {
            type: "public",
            perPlayer: false,
            rules: {
              onAdd: (card: TestCard) => {
                addedCard = card;
              },
              onRemove: (card: TestCard) => {
                removedCard = card;
              },
            },
          },
        },
      };

      const manager = new ZoneManager<TestCard>(hookedConfig);
      const card: TestCard = { id: "card1", name: "Test Card" };

      manager.addCardToZone(card, "hooked");
      expect(addedCard).toBe(card);

      manager.removeCardFromZone("card1", "hooked");
      expect(removedCard).toBe(card);
    });
  });

  describe("zone queries", () => {
    beforeEach(() => {
      zoneManager.initializePlayerZones("player1");
      zoneManager.initializePlayerZones("player2");

      const card1: TestCard = { id: "card1", name: "Card 1" };
      const card2: TestCard = { id: "card2", name: "Card 2" };

      zoneManager.addCardToZone(card1, "player1-hand");
      zoneManager.addCardToZone(card2, "player2-play");
    });

    it("should query zones by type", () => {
      const privateZones = zoneManager.queryZones({ type: "private" });
      const publicZones = zoneManager.queryZones({ type: "public" });

      expect(privateZones.some((z) => z.name === "hand")).toBe(true);
      expect(privateZones.some((z) => z.name === "deck")).toBe(true);
      expect(publicZones.some((z) => z.name === "play")).toBe(true);
    });

    it("should query zones by owner", () => {
      const player1Zones = zoneManager.queryZones({ owner: "player1" });
      const player2Zones = zoneManager.queryZones({ owner: "player2" });

      expect(player1Zones).toHaveLength(4); // hand, deck, play, discard
      expect(player2Zones).toHaveLength(4);
    });

    it("should query zones by card count", () => {
      const zonesWithCards = zoneManager.queryZones({ hasCards: true });
      const emptyZones = zoneManager.queryZones({ hasCards: false });

      expect(zonesWithCards).toHaveLength(2); // player1-hand, player2-play
      expect(emptyZones.length).toBeGreaterThan(0);
    });

    it("should get zone statistics", () => {
      const stats = zoneManager.getZoneStats("player1-hand");

      expect(stats).toEqual({
        zoneId: "player1-hand",
        cardCount: 1,
        isFull: false,
        isEmpty: false,
        percentFull: (1 / 7) * 100,
      });
    });
  });

  describe("state management", () => {
    it("should capture and restore zone state", () => {
      zoneManager.initializePlayerZones("player1");

      const card1: TestCard = { id: "card1", name: "Card 1" };
      const card2: TestCard = { id: "card2", name: "Card 2" };

      zoneManager.addCardToZone(card1, "player1-hand");
      zoneManager.addCardToZone(card2, "player1-play");

      // Capture state
      const state = zoneManager.getZoneState();

      // Modify zones
      zoneManager.moveCard("card1", "player1-hand", "player1-discard");
      zoneManager.removeCardFromZone("card2", "player1-play");

      // Restore state
      zoneManager.restoreZoneState(state);

      // Verify restoration
      const handCards = zoneManager.getCardsInZone("player1-hand");
      const playCards = zoneManager.getCardsInZone("player1-play");
      const discardCards = zoneManager.getCardsInZone("player1-discard");

      expect(handCards).toHaveLength(1);
      expect(handCards[0].id).toBe("card1");
      expect(playCards).toHaveLength(1);
      expect(playCards[0].id).toBe("card2");
      expect(discardCards).toHaveLength(0);
    });

    it("should clear all zones", () => {
      zoneManager.initializePlayerZones("player1");

      const card1: TestCard = { id: "card1", name: "Card 1" };
      const card2: TestCard = { id: "card2", name: "Card 2" };

      zoneManager.addCardToZone(card1, "player1-hand");
      zoneManager.addCardToZone(card2, "player1-play");

      zoneManager.clearAllZones();

      const allZones = zoneManager.getAllZones();
      for (const zone of allZones) {
        expect(zone.cards).toHaveLength(0);
      }

      // Card locations should also be cleared
      expect(zoneManager.getCardLocation("card1")).toBeUndefined();
      expect(zoneManager.getCardLocation("card2")).toBeUndefined();
    });
  });

  describe("getAllZones", () => {
    it("should return all zones", () => {
      zoneManager.initializePlayerZones("player1");

      const allZones = zoneManager.getAllZones();

      // Should have shared zone + 4 player zones
      expect(allZones).toHaveLength(5);
      expect(allZones.some((z) => z.id === "shared")).toBe(true);
      expect(allZones.some((z) => z.id === "player1-hand")).toBe(true);
    });
  });
});
