import { describe, expect, it } from "bun:test";
import { createCardId, createPlayerId } from "../../types/branded-types";
import {
  addCardToZone,
  createZoneState,
  getCardsInZone,
  isCardInZone,
  moveCardBetweenZones,
  removeCardFromZone,
  type ZoneState,
} from "../zone-operations";

/**
 * Task 1.5, 1.6: Tests for Zone Transition Operations
 *
 * Validates helper functions for managing cards in zones:
 * - Adding cards to zones
 * - Removing cards from zones
 * - Moving cards between zones
 * - Querying cards in zones
 *
 * References:
 * - Rule 8.1 (Zones are separate)
 * - Rule 8.4.4 (Leaving play triggers abilities)
 * - Rule 8.1.5 (Cards entering private zones lose all info)
 */

describe("Zone Operations", () => {
  describe("createZoneState", () => {
    it("should create empty zone state for all players", () => {
      const player1 = createPlayerId("player1");
      const player2 = createPlayerId("player2");

      const zoneState = createZoneState([player1, player2]);

      expect(zoneState[player1]).toEqual([]);
      expect(zoneState[player2]).toEqual([]);
    });
  });

  describe("addCardToZone", () => {
    it("should add card to player's zone", () => {
      const player1 = createPlayerId("player1");
      const player2 = createPlayerId("player2");
      const card1 = createCardId("card-1");

      const zoneState: ZoneState = {
        [player1]: [],
        [player2]: [],
      };

      addCardToZone(zoneState, player1, card1);

      expect(zoneState[player1]).toEqual([card1]);
      expect(zoneState[player2]).toEqual([]);
    });

    it("should add multiple cards maintaining order", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");
      const card3 = createCardId("card-3");

      const zoneState: ZoneState = {
        [player1]: [],
      };

      addCardToZone(zoneState, player1, card1);
      addCardToZone(zoneState, player1, card2);
      addCardToZone(zoneState, player1, card3);

      expect(zoneState[player1]).toEqual([card1, card2, card3]);
    });
  });

  describe("removeCardFromZone", () => {
    it("should remove card from player's zone", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");

      const zoneState: ZoneState = {
        [player1]: [card1, card2],
      };

      removeCardFromZone(zoneState, player1, card1);

      expect(zoneState[player1]).toEqual([card2]);
    });

    it("should maintain order when removing from middle", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");
      const card3 = createCardId("card-3");

      const zoneState: ZoneState = {
        [player1]: [card1, card2, card3],
      };

      removeCardFromZone(zoneState, player1, card2);

      expect(zoneState[player1]).toEqual([card1, card3]);
    });

    it("should do nothing if card not in zone", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");

      const zoneState: ZoneState = {
        [player1]: [card1],
      };

      removeCardFromZone(zoneState, player1, card2);

      expect(zoneState[player1]).toEqual([card1]);
    });
  });

  describe("moveCardBetweenZones", () => {
    it("should move card from one zone to another", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");

      const handZone: ZoneState = {
        [player1]: [card1],
      };

      const playZone: ZoneState = {
        [player1]: [],
      };

      moveCardBetweenZones(handZone, playZone, player1, card1);

      expect(handZone[player1]).toEqual([]);
      expect(playZone[player1]).toEqual([card1]);
    });

    it("should handle moving between zones of different players", () => {
      const player1 = createPlayerId("player1");
      const player2 = createPlayerId("player2");
      const card1 = createCardId("card-1");

      const player1Hand: ZoneState = {
        [player1]: [card1],
      };

      const player2Hand: ZoneState = {
        [player2]: [],
      };

      // This would be unusual but tests the operation works
      removeCardFromZone(player1Hand, player1, card1);
      addCardToZone(player2Hand, player2, card1);

      expect(player1Hand[player1]).toEqual([]);
      expect(player2Hand[player2]).toEqual([card1]);
    });

    it("should maintain card order in destination zone", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");
      const card3 = createCardId("card-3");

      const sourceZone: ZoneState = {
        [player1]: [card2],
      };

      const destZone: ZoneState = {
        [player1]: [card1, card3],
      };

      moveCardBetweenZones(sourceZone, destZone, player1, card2);

      expect(sourceZone[player1]).toEqual([]);
      expect(destZone[player1]).toEqual([card1, card3, card2]);
    });
  });

  describe("isCardInZone", () => {
    it("should return true if card is in player's zone", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");

      const zoneState: ZoneState = {
        [player1]: [card1],
      };

      expect(isCardInZone(zoneState, player1, card1)).toBe(true);
    });

    it("should return false if card is not in player's zone", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");

      const zoneState: ZoneState = {
        [player1]: [card1],
      };

      expect(isCardInZone(zoneState, player1, card2)).toBe(false);
    });

    it("should return false if player has no zone", () => {
      const player1 = createPlayerId("player1");
      const player2 = createPlayerId("player2");
      const card1 = createCardId("card-1");

      const zoneState: ZoneState = {
        [player1]: [card1],
      };

      expect(isCardInZone(zoneState, player2, card1)).toBe(false);
    });
  });

  describe("getCardsInZone", () => {
    it("should return all cards in player's zone", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");
      const card2 = createCardId("card-2");
      const card3 = createCardId("card-3");

      const zoneState: ZoneState = {
        [player1]: [card1, card2, card3],
      };

      const cards = getCardsInZone(zoneState, player1);

      expect(cards).toEqual([card1, card2, card3]);
    });

    it("should return empty array if player has no cards", () => {
      const player1 = createPlayerId("player1");

      const zoneState: ZoneState = {
        [player1]: [],
      };

      const cards = getCardsInZone(zoneState, player1);

      expect(cards).toEqual([]);
    });

    it("should return empty array if player has no zone", () => {
      const player1 = createPlayerId("player1");

      const zoneState: ZoneState = {};

      const cards = getCardsInZone(zoneState, player1);

      expect(cards).toEqual([]);
    });

    it("should return copy of array (not mutate original)", () => {
      const player1 = createPlayerId("player1");
      const card1 = createCardId("card-1");

      const zoneState: ZoneState = {
        [player1]: [card1],
      };

      const cards = getCardsInZone(zoneState, player1);
      cards.push(createCardId("card-2"));

      // Original should be unchanged
      expect(zoneState[player1]).toEqual([card1]);
    });
  });

  describe("Zone Transition Scenarios", () => {
    it("should handle draw card scenario (deck -> hand)", () => {
      const player1 = createPlayerId("player1");
      const topCard = createCardId("top-card");

      const deckZone: ZoneState = {
        [player1]: [topCard, createCardId("card-2"), createCardId("card-3")],
      };

      const handZone: ZoneState = {
        [player1]: [],
      };

      // Draw top card
      moveCardBetweenZones(deckZone, handZone, player1, topCard);

      expect(deckZone[player1]).toHaveLength(2);
      expect(handZone[player1]).toEqual([topCard]);
    });

    it("should handle play card scenario (hand -> play)", () => {
      const player1 = createPlayerId("player1");
      const card = createCardId("character-1");

      const handZone: ZoneState = {
        [player1]: [card],
      };

      const playZone: ZoneState = {
        [player1]: [],
      };

      moveCardBetweenZones(handZone, playZone, player1, card);

      expect(handZone[player1]).toEqual([]);
      expect(playZone[player1]).toEqual([card]);
    });

    it("should handle banish scenario (play -> discard)", () => {
      const player1 = createPlayerId("player1");
      const character = createCardId("character-1");

      const playZone: ZoneState = {
        [player1]: [character],
      };

      const discardZone: ZoneState = {
        [player1]: [],
      };

      moveCardBetweenZones(playZone, discardZone, player1, character);

      expect(playZone[player1]).toEqual([]);
      expect(discardZone[player1]).toEqual([character]);
    });

    it("should handle ink card scenario (hand -> inkwell)", () => {
      const player1 = createPlayerId("player1");
      const inkableCard = createCardId("inkable-1");

      const handZone: ZoneState = {
        [player1]: [inkableCard],
      };

      const inkwellZone: ZoneState = {
        [player1]: [],
      };

      moveCardBetweenZones(handZone, inkwellZone, player1, inkableCard);

      expect(handZone[player1]).toEqual([]);
      expect(inkwellZone[player1]).toEqual([inkableCard]);
    });
  });
});
