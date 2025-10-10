import { describe, expect, it } from "bun:test";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig, Zone, ZoneVisibility } from "./zone";

describe("Zone Type Definitions", () => {
  describe("ZoneVisibility", () => {
    it("should support public visibility type", () => {
      const visibility: ZoneVisibility = "public";
      expect(visibility).toBe("public");
    });

    it("should support private visibility type", () => {
      const visibility: ZoneVisibility = "private";
      expect(visibility).toBe("private");
    });

    it("should support secret visibility type", () => {
      const visibility: ZoneVisibility = "secret";
      expect(visibility).toBe("secret");
    });
  });

  describe("ZoneConfig", () => {
    it("should define valid zone configuration structure", () => {
      const config: CardZoneConfig = {
        id: "deck" as ZoneId,
        name: "Deck",
        visibility: "secret",
        ordered: true,
        faceDown: true,
      };

      expect(String(config.id)).toBe("deck");
      expect(config.name).toBe("Deck");
      expect(config.visibility).toBe("secret");
      expect(config.ordered).toBe(true);
      expect(config.faceDown).toBe(true);
    });

    it("should support optional owner property", () => {
      const configWithOwner: CardZoneConfig = {
        id: "hand" as ZoneId,
        name: "Hand",
        visibility: "private",
        ordered: false,
        owner: "player-1" as PlayerId,
      };

      expect(configWithOwner.owner).toBeDefined();
      expect(typeof configWithOwner.owner).toBe("string");
    });

    it("should support optional maxSize property", () => {
      const configWithMaxSize: CardZoneConfig = {
        id: "hand" as ZoneId,
        name: "Hand",
        visibility: "private",
        ordered: false,
        maxSize: 7,
      };

      expect(configWithMaxSize.maxSize).toBe(7);
    });

    it("should work without optional properties", () => {
      const minimalConfig: CardZoneConfig = {
        id: "play" as ZoneId,
        name: "Play Area",
        visibility: "public",
        ordered: false,
      };

      expect(minimalConfig.owner).toBeUndefined();
      expect(minimalConfig.maxSize).toBeUndefined();
      expect(minimalConfig.faceDown).toBeUndefined();
    });
  });

  describe("Zone", () => {
    it("should define valid zone structure with config and cards", () => {
      const zone: Zone = {
        config: {
          id: "deck" as ZoneId,
          name: "Deck",
          visibility: "secret",
          ordered: true,
          faceDown: true,
        },
        cards: [],
      };

      expect(zone.config).toBeDefined();
      expect(zone.cards).toBeInstanceOf(Array);
      expect(zone.cards).toHaveLength(0);
    });

    it("should support zone with card IDs", () => {
      const cardId1 = "card-1" as CardId;
      const cardId2 = "card-2" as CardId;

      const zone: Zone = {
        config: {
          id: "hand" as ZoneId,
          name: "Hand",
          visibility: "private",
          ordered: false,
        },
        cards: [cardId1, cardId2],
      };

      expect(zone.cards).toHaveLength(2);
      expect(zone.cards[0]).toBe(cardId1);
      expect(zone.cards[1]).toBe(cardId2);
    });

    it("should maintain card order when ordered is true", () => {
      const cardIds = [
        "card-1" as CardId,
        "card-2" as CardId,
        "card-3" as CardId,
      ];

      const orderedZone: Zone = {
        config: {
          id: "deck" as ZoneId,
          name: "Deck",
          visibility: "secret",
          ordered: true,
        },
        cards: cardIds,
      };

      expect(orderedZone.cards[0]).toBe(cardIds[0]);
      expect(orderedZone.cards[1]).toBe(cardIds[1]);
      expect(orderedZone.cards[2]).toBe(cardIds[2]);
    });
  });

  describe("Zone Type Safety", () => {
    it("should enforce ZoneId type for zone config id", () => {
      const zoneId = "deck" as ZoneId;
      const config: CardZoneConfig = {
        id: zoneId,
        name: "Deck",
        visibility: "secret",
        ordered: true,
      };

      const _typeCheck: ZoneId = config.id;
      expect(config.id).toBe(zoneId);
    });

    it("should enforce CardId array type for zone cards", () => {
      const cardIds: CardId[] = ["card-1" as CardId, "card-2" as CardId];

      const zone: Zone = {
        config: {
          id: "hand" as ZoneId,
          name: "Hand",
          visibility: "private",
          ordered: false,
        },
        cards: cardIds,
      };

      const _typeCheck: CardId[] = zone.cards;
      expect(zone.cards).toEqual(cardIds);
    });

    it("should enforce PlayerId type for owner", () => {
      const playerId = "player-1" as PlayerId;
      const config: CardZoneConfig = {
        id: "hand" as ZoneId,
        name: "Hand",
        visibility: "private",
        ordered: false,
        owner: playerId,
      };

      if (config.owner) {
        const _typeCheck: PlayerId = config.owner;
        expect(config.owner).toBe(playerId);
      }
    });
  });
});
