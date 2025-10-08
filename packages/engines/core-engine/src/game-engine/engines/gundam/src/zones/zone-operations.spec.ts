import { describe, expect, it } from "bun:test";
import type { PlayerState } from "../gundam-engine-types";
import {
  addCardToZone,
  getCardsInZone,
  getZoneCount,
  moveCardBetweenZones,
  type Result,
  removeCardFromZone,
  validateZoneCapacity,
  type ZoneOperationError,
} from "./zone-operations";

describe("Zone Operations (with Result types)", () => {
  const createTestPlayerState = (): PlayerState => ({
    id: "player1",
    name: "Test Player",
    turnHistory: [],
    zones: {
      deck: ["card1", "card2", "card3"],
      resourceDeck: ["res1", "res2"],
      resourceArea: [],
      battleArea: [],
      shieldBase: [],
      shieldSection: [],
      removalArea: [],
      hand: [],
      trash: [],
      sideboard: [],
    },
  });

  describe("Result type error handling", () => {
    describe("removeCardFromZone", () => {
      it("returns error when card not found", () => {
        const player = createTestPlayerState();
        const result = removeCardFromZone(player, "deck", "nonexistent");

        if (result.success) throw new Error("Expected error result");
        expect(result.success).toBe(false);
        expect(result.error.type).toBe("cardNotFound");
        expect(result.error.cardId).toBe("nonexistent");
        expect(result.error.zone).toBe("deck");
      });

      it("returns success when card found and removed", () => {
        const player = createTestPlayerState();
        const result = removeCardFromZone(player, "deck", "card2");

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.zones.deck).toEqual(["card1", "card3"]);
        }
      });
    });

    describe("moveCardBetweenZones", () => {
      it("returns error when card not in source zone", () => {
        const player = createTestPlayerState();
        const result = moveCardBetweenZones(
          player,
          "deck",
          "hand",
          "nonexistent",
        );

        if (result.success) throw new Error("Expected error result");
        expect(result.success).toBe(false);
        expect(result.error.type).toBe("cardNotFound");
        expect(result.error.zone).toBe("deck");
      });

      it("returns success when card moved", () => {
        const player = createTestPlayerState();
        const result = moveCardBetweenZones(player, "deck", "hand", "card1");

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.zones.deck).toEqual(["card2", "card3"]);
          expect(result.data.zones.hand).toEqual(["card1"]);
        }
      });
    });
  });

  describe("Capacity validation in operations", () => {
    describe("addCardToZone", () => {
      it("returns error when adding to full battleArea (6 max)", () => {
        const player = {
          ...createTestPlayerState(),
          zones: {
            ...createTestPlayerState().zones,
            battleArea: ["u1", "u2", "u3", "u4", "u5", "u6"],
          },
        };

        const result = addCardToZone(player, "battleArea", "u7");

        if (result.success) throw new Error("Expected error result");
        expect(result.success).toBe(false);
        expect(result.error.type).toBe("capacityExceeded");
        expect(result.error.zone).toBe("battleArea");
        expect(result.error.capacity).toBe(6);
      });

      it("returns error when adding to full shieldBase (1 max)", () => {
        const player = {
          ...createTestPlayerState(),
          zones: {
            ...createTestPlayerState().zones,
            shieldBase: ["base1"],
          },
        };

        const result = addCardToZone(player, "shieldBase", "base2");

        if (result.success) throw new Error("Expected error result");
        expect(result.success).toBe(false);
        expect(result.error.type).toBe("capacityExceeded");
        expect(result.error.zone).toBe("shieldBase");
        expect(result.error.capacity).toBe(1);
      });

      it("returns error when adding to full hand (10 max)", () => {
        const player = {
          ...createTestPlayerState(),
          zones: {
            ...createTestPlayerState().zones,
            hand: Array.from({ length: 10 }, (_, i) => `card${i}`),
          },
        };

        const result = addCardToZone(player, "hand", "card11");

        if (result.success) throw new Error("Expected error result");
        expect(result.success).toBe(false);
        expect(result.error.type).toBe("capacityExceeded");
      });

      it("returns error when adding to full resourceArea (15 max)", () => {
        const player = {
          ...createTestPlayerState(),
          zones: {
            ...createTestPlayerState().zones,
            resourceArea: Array.from({ length: 15 }, (_, i) => `res${i}`),
          },
        };

        const result = addCardToZone(player, "resourceArea", "res16");

        if (result.success) throw new Error("Expected error result");
        expect(result.success).toBe(false);
        expect(result.error.type).toBe("capacityExceeded");
      });

      it("succeeds when adding to zone under capacity", () => {
        const player = createTestPlayerState();
        const result = addCardToZone(player, "battleArea", "unit1");

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.zones.battleArea).toEqual(["unit1"]);
        }
      });

      it("succeeds when adding to zone with no capacity limit", () => {
        const player = {
          ...createTestPlayerState(),
          zones: {
            ...createTestPlayerState().zones,
            trash: Array.from({ length: 100 }, (_, i) => `card${i}`),
          },
        };

        const result = addCardToZone(player, "trash", "card101");

        expect(result.success).toBe(true);
      });
    });

    describe("moveCardBetweenZones", () => {
      it("returns error when destination zone is at capacity", () => {
        const player = {
          ...createTestPlayerState(),
          zones: {
            ...createTestPlayerState().zones,
            deck: ["uniqueCard"],
            hand: Array.from({ length: 10 }, (_, i) => `card${i}`),
          },
        };

        const result = moveCardBetweenZones(
          player,
          "deck",
          "hand",
          "uniqueCard",
        );

        if (result.success) throw new Error("Expected error result");
        expect(result.success).toBe(false);
        expect(result.error.type).toBe("capacityExceeded");
        expect(result.error.zone).toBe("hand");
      });

      it("succeeds when destination has space", () => {
        const player = createTestPlayerState();
        const result = moveCardBetweenZones(player, "deck", "hand", "card1");

        expect(result.success).toBe(true);
      });
    });
  });

  describe("Duplicate card detection", () => {
    describe("addCardToZone", () => {
      it("returns error when card already exists in zone", () => {
        const player = {
          ...createTestPlayerState(),
          zones: {
            ...createTestPlayerState().zones,
            hand: ["card1", "card2"],
          },
        };

        const result = addCardToZone(player, "hand", "card1");

        if (result.success) throw new Error("Expected error result");
        expect(result.success).toBe(false);
        expect(result.error.type).toBe("duplicateCard");
        expect(result.error.cardId).toBe("card1");
        expect(result.error.zone).toBe("hand");
      });

      it("succeeds when card is unique in zone", () => {
        const player = {
          ...createTestPlayerState(),
          zones: {
            ...createTestPlayerState().zones,
            hand: ["card1"],
          },
        };

        const result = addCardToZone(player, "hand", "card2");

        expect(result.success).toBe(true);
      });
    });

    describe("moveCardBetweenZones", () => {
      it("returns error when card already exists in destination", () => {
        const player = {
          ...createTestPlayerState(),
          zones: {
            ...createTestPlayerState().zones,
            deck: ["card1", "card2"],
            hand: ["card1"], // Duplicate!
          },
        };

        const result = moveCardBetweenZones(player, "deck", "hand", "card1");

        if (result.success) throw new Error("Expected error result");
        expect(result.success).toBe(false);
        expect(result.error.type).toBe("duplicateCard");
      });

      it("allows moving card within same zone (reordering)", () => {
        const player = {
          ...createTestPlayerState(),
          zones: {
            ...createTestPlayerState().zones,
            hand: ["card1", "card2", "card3"],
          },
        };

        const result = moveCardBetweenZones(
          player,
          "hand",
          "hand",
          "card2",
          "start",
        );

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.zones.hand).toEqual(["card2", "card1", "card3"]);
        }
      });
    });
  });

  describe("Edge cases and boundary conditions", () => {
    it("removes first card from zone", () => {
      const player = createTestPlayerState();
      const result = removeCardFromZone(player, "deck", "card1");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.zones.deck).toEqual(["card2", "card3"]);
      }
    });

    it("removes last card from zone", () => {
      const player = createTestPlayerState();
      const result = removeCardFromZone(player, "deck", "card3");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.zones.deck).toEqual(["card1", "card2"]);
      }
    });

    it("removes only card from zone leaving empty array", () => {
      const player = {
        ...createTestPlayerState(),
        zones: {
          ...createTestPlayerState().zones,
          hand: ["onlyCard"],
        },
      };

      const result = removeCardFromZone(player, "hand", "onlyCard");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.zones.hand).toEqual([]);
      }
    });

    it("allows adding when zone is one below capacity", () => {
      const player = {
        ...createTestPlayerState(),
        zones: {
          ...createTestPlayerState().zones,
          hand: Array.from({ length: 9 }, (_, i) => `card${i}`),
        },
      };

      const result = addCardToZone(player, "hand", "card10");

      expect(result.success).toBe(true);
    });
  });

  describe("Immutability verification", () => {
    it("creates new object references when adding card", () => {
      const player = createTestPlayerState();
      const originalZones = player.zones;
      const originalHand = player.zones.hand;

      const result = addCardToZone(player, "hand", "newCard");

      expect(result.success).toBe(true);
      if (result.success) {
        // Verify new objects created
        expect(result.data.zones).not.toBe(originalZones);
        expect(result.data.zones.hand).not.toBe(originalHand);
        // Verify original unchanged
        expect(player.zones.hand).toEqual([]);
        expect(originalHand).toEqual([]);
      }
    });

    it("creates new object references when removing card", () => {
      const player = createTestPlayerState();
      const originalZones = player.zones;
      const originalDeck = player.zones.deck;

      const result = removeCardFromZone(player, "deck", "card1");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.zones).not.toBe(originalZones);
        expect(result.data.zones.deck).not.toBe(originalDeck);
        expect(player.zones.deck).toEqual(["card1", "card2", "card3"]);
      }
    });

    it("creates new object references when moving card", () => {
      const player = createTestPlayerState();
      const originalZones = player.zones;
      const originalDeck = player.zones.deck;
      const originalHand = player.zones.hand;

      const result = moveCardBetweenZones(player, "deck", "hand", "card1");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.zones).not.toBe(originalZones);
        expect(result.data.zones.deck).not.toBe(originalDeck);
        expect(result.data.zones.hand).not.toBe(originalHand);
      }
    });
  });

  // Keep existing read-only operation tests
  describe("getCardsInZone", () => {
    it("returns all cards in specified zone", () => {
      const player = createTestPlayerState();
      const cards = getCardsInZone(player, "deck");
      expect(cards).toEqual(["card1", "card2", "card3"]);
    });

    it("returns empty array for empty zone", () => {
      const player = createTestPlayerState();
      const cards = getCardsInZone(player, "hand");
      expect(cards).toEqual([]);
    });
  });

  describe("getZoneCount", () => {
    it("returns correct count of cards in zone", () => {
      const player = createTestPlayerState();
      expect(getZoneCount(player, "deck")).toBe(3);
      expect(getZoneCount(player, "hand")).toBe(0);
    });
  });

  describe("validateZoneCapacity", () => {
    it("returns true when zone under capacity", () => {
      const player = createTestPlayerState();
      expect(validateZoneCapacity(player, "battleArea")).toBe(true);
    });

    it("returns false when zone at capacity", () => {
      const player = {
        ...createTestPlayerState(),
        zones: {
          ...createTestPlayerState().zones,
          battleArea: Array.from({ length: 6 }, (_, i) => `u${i}`),
        },
      };
      expect(validateZoneCapacity(player, "battleArea")).toBe(false);
    });
  });
});
