import { describe, expect, it } from "bun:test";
import { createCardId, createPlayerId, createZoneId } from "../types";
import type { CardZoneConfig } from "./zone";
import { createZone } from "./zone-factory";

describe("Zone Factory", () => {
  describe("createZone", () => {
    it("should create a zone with valid configuration", () => {
      const config: CardZoneConfig = {
        faceDown: true,
        id: createZoneId("deck"),
        name: "Deck",
        ordered: true,
        visibility: "secret",
      };

      const zone = createZone(config);

      expect(zone.config).toEqual(config);
      expect(zone.cards).toBeInstanceOf(Array);
      expect(zone.cards).toHaveLength(0);
    });

    it("should create a zone with initial cards", () => {
      const config: CardZoneConfig = {
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        visibility: "private",
      };

      const initialCards = [createCardId("card-1"), createCardId("card-2")];
      const zone = createZone(config, initialCards);

      expect(zone.cards).toEqual(initialCards);
      expect(zone.cards).toHaveLength(2);
    });

    it("should create zone with minimal configuration", () => {
      const config: CardZoneConfig = {
        id: createZoneId("play"),
        name: "Play Area",
        ordered: false,
        visibility: "public",
      };

      const zone = createZone(config);

      expect(zone.config.id).toBe(config.id);
      expect(zone.config.name).toBe(config.name);
      expect(zone.config.visibility).toBe("public");
      expect(zone.config.owner).toBeUndefined();
      expect(zone.config.maxSize).toBeUndefined();
      expect(zone.cards).toHaveLength(0);
    });

    it("should validate maxSize when provided", () => {
      const config: CardZoneConfig = {
        id: createZoneId("hand"),
        maxSize: 7,
        name: "Hand",
        ordered: false,
        visibility: "private",
      };

      const zone = createZone(config);
      expect(zone.config.maxSize).toBe(7);
    });

    it("should throw error if initial cards exceed maxSize", () => {
      const config: CardZoneConfig = {
        id: createZoneId("hand"),
        maxSize: 2,
        name: "Hand",
        ordered: false,
        visibility: "private",
      };

      const tooManyCards = [createCardId("card-1"), createCardId("card-2"), createCardId("card-3")];

      expect(() => createZone(config, tooManyCards)).toThrow(
        "Cannot create zone: initial cards (3) exceed maxSize (2)",
      );
    });

    it("should create ordered zone (deck)", () => {
      const config: CardZoneConfig = {
        faceDown: true,
        id: createZoneId("deck"),
        name: "Deck",
        ordered: true,
        visibility: "secret",
      };

      const zone = createZone(config);

      expect(zone.config.ordered).toBe(true);
      expect(zone.config.faceDown).toBe(true);
    });

    it("should create unordered zone (play area)", () => {
      const config: CardZoneConfig = {
        id: createZoneId("play"),
        name: "Play Area",
        ordered: false,
        visibility: "public",
      };

      const zone = createZone(config);

      expect(zone.config.ordered).toBe(false);
    });

    it("should create zone with owner", () => {
      const playerId = createPlayerId("player-1");
      const config: CardZoneConfig = {
        id: createZoneId("hand"),
        name: "Hand",
        ordered: false,
        owner: playerId,
        visibility: "private",
      };

      const zone = createZone(config);

      expect(zone.config.owner).toBe(playerId);
    });

    it("should create shared zone without owner", () => {
      const config: CardZoneConfig = {
        id: createZoneId("graveyard"),
        name: "Graveyard",
        ordered: true,
        visibility: "public",
      };

      const zone = createZone(config);

      expect(zone.config.owner).toBeUndefined();
    });

    it("should validate zone id is provided", () => {
      const invalidConfig = {
        name: "Test Zone",
        ordered: false,
        visibility: "public",
      } as CardZoneConfig;

      expect(() => createZone(invalidConfig)).toThrow("Zone configuration must include an id");
    });

    it("should validate zone name is provided", () => {
      const invalidConfig = {
        id: createZoneId("test"),
        ordered: false,
        visibility: "public",
      } as CardZoneConfig;

      expect(() => createZone(invalidConfig)).toThrow("Zone configuration must include a name");
    });

    it("should validate visibility is valid", () => {
      const invalidConfig = {
        id: createZoneId("test"),
        name: "Test Zone",
        ordered: false,
        visibility: "invalid",
      } as unknown as CardZoneConfig;

      expect(() => createZone(invalidConfig)).toThrow(
        'Invalid visibility: must be "public", "private", or "secret"',
      );
    });
  });
});
