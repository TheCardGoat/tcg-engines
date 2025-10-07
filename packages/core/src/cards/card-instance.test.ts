import { describe, expect, it } from "bun:test";
import type { CardId } from "../types";
import { createCardId, createPlayerId, createZoneId } from "../types";
import type { CardInstance, CardInstanceBase } from "./card-instance";

describe("Card Instance Model", () => {
  describe("CardInstanceBase", () => {
    it("should define valid card instance with mandatory identity fields", () => {
      const cardId = createCardId("card-1");
      const owner = createPlayerId("player-1");
      const controller = createPlayerId("player-1");
      const zone = createZoneId("hand");

      const card: CardInstanceBase = {
        id: cardId,
        definitionId: "fire-bolt",
        owner,
        controller,
        zone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(card.id).toBe(cardId);
      expect(card.definitionId).toBe("fire-bolt");
      expect(card.owner).toBe(owner);
      expect(card.controller).toBe(controller);
    });

    it("should require all mandatory location fields", () => {
      const card: CardInstanceBase = {
        id: createCardId("card-1"),
        definitionId: "fire-bolt",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(card.zone).toBeDefined();
      expect(typeof card.zone).toBe("string");
    });

    it("should support optional position field for ordered zones", () => {
      const card: CardInstanceBase = {
        id: createCardId("card-1"),
        definitionId: "fire-bolt",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("deck"),
        position: 5,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(card.position).toBe(5);
    });

    it("should work without optional position field", () => {
      const card: CardInstanceBase = {
        id: createCardId("card-1"),
        definitionId: "fire-bolt",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("hand"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(card.position).toBeUndefined();
    });

    it("should require all state flag fields", () => {
      const card: CardInstanceBase = {
        id: createCardId("card-1"),
        definitionId: "fire-bolt",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(typeof card.tapped).toBe("boolean");
      expect(typeof card.flipped).toBe("boolean");
      expect(typeof card.revealed).toBe("boolean");
      expect(typeof card.phased).toBe("boolean");
    });

    it("should support tapped state", () => {
      const card: CardInstanceBase = {
        id: createCardId("card-1"),
        definitionId: "creature",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: true,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(card.tapped).toBe(true);
    });

    it("should support flipped state (face-down)", () => {
      const card: CardInstanceBase = {
        id: createCardId("card-1"),
        definitionId: "morph-creature",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: true,
        revealed: false,
        phased: false,
      };

      expect(card.flipped).toBe(true);
    });

    it("should support revealed state (temporarily visible)", () => {
      const card: CardInstanceBase = {
        id: createCardId("card-1"),
        definitionId: "fire-bolt",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("hand"),
        tapped: false,
        flipped: false,
        revealed: true,
        phased: false,
      };

      expect(card.revealed).toBe(true);
    });

    it("should support phased state (not in play but not in another zone)", () => {
      const card: CardInstanceBase = {
        id: createCardId("card-1"),
        definitionId: "creature",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: true,
      };

      expect(card.phased).toBe(true);
    });

    it("should allow controller to differ from owner", () => {
      const owner = createPlayerId("player-1");
      const controller = createPlayerId("player-2");

      const card: CardInstanceBase = {
        id: createCardId("card-1"),
        definitionId: "mind-control-target",
        owner,
        controller,
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(card.owner).toBe(owner);
      expect(card.controller).toBe(controller);
      expect(card.owner).not.toBe(card.controller);
    });
  });

  describe("CardInstanceBase Type Safety", () => {
    it("should enforce CardId type for id field", () => {
      const cardId = createCardId("card-1");
      const card: CardInstanceBase = {
        id: cardId,
        definitionId: "fire-bolt",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      const _typeCheck: typeof cardId = card.id;
      expect(card.id).toBe(cardId);
    });

    it("should enforce PlayerId type for owner and controller", () => {
      const owner = createPlayerId("player-1");
      const controller = createPlayerId("player-2");

      const card: CardInstanceBase = {
        id: createCardId("card-1"),
        definitionId: "fire-bolt",
        owner,
        controller,
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      const _ownerTypeCheck: typeof owner = card.owner;
      const _controllerTypeCheck: typeof controller = card.controller;
      expect(card.owner).toBe(owner);
      expect(card.controller).toBe(controller);
    });

    it("should enforce ZoneId type for zone field", () => {
      const zone = createZoneId("play");
      const card: CardInstanceBase = {
        id: createCardId("card-1"),
        definitionId: "fire-bolt",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      const _typeCheck: typeof zone = card.zone;
      expect(card.zone).toBe(zone);
    });
  });

  describe("CardInstance<TCustomState>", () => {
    it("should extend CardInstanceBase with empty custom state", () => {
      // biome-ignore lint/complexity/noBannedTypes: Empty object type is intentional for testing
      type EmptyCard = CardInstance<{}>;

      const card: EmptyCard = {
        id: createCardId("card-1"),
        definitionId: "fire-bolt",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("hand"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      // Verify it has all base fields
      expect(card.id).toBeDefined();
      expect(card.definitionId).toBe("fire-bolt");
      expect(card.owner).toBeDefined();
      expect(card.controller).toBeDefined();
      expect(card.zone).toBeDefined();
    });

    it("should extend CardInstanceBase with Magic-style custom state", () => {
      type MagicCardState = {
        summoningSick: boolean;
        damageTaken: number;
        counters: Record<string, number>;
        attachments: CardId[];
        attachedTo?: CardId;
      };

      type MagicCard = CardInstance<MagicCardState>;

      const card: MagicCard = {
        id: createCardId("card-1"),
        definitionId: "grizzly-bears",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        // Custom state
        summoningSick: true,
        damageTaken: 2,
        counters: { "+1/+1": 1, "-1/-1": 0 },
        attachments: [],
      };

      expect(card.summoningSick).toBe(true);
      expect(card.damageTaken).toBe(2);
      expect(card.counters["+1/+1"]).toBe(1);
      expect(card.attachments).toHaveLength(0);
    });

    it("should extend CardInstanceBase with Hearthstone-style custom state", () => {
      type HearthstoneCardState = {
        damageTaken: number;
        divineShield: boolean;
        stealth: boolean;
        frozen: boolean;
        silenced: boolean;
      };

      type HearthstoneCard = CardInstance<HearthstoneCardState>;

      const card: HearthstoneCard = {
        id: createCardId("card-1"),
        definitionId: "yeti",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        // Custom state
        damageTaken: 1,
        divineShield: true,
        stealth: false,
        frozen: false,
        silenced: false,
      };

      expect(card.divineShield).toBe(true);
      expect(card.stealth).toBe(false);
      expect(card.frozen).toBe(false);
      expect(card.silenced).toBe(false);
    });

    it("should support attachment relationships", () => {
      type MagicCardState = {
        summoningSick: boolean;
        damageTaken: number;
        counters: Record<string, number>;
        attachments: CardId[];
        attachedTo?: CardId;
      };

      type MagicCard = CardInstance<MagicCardState>;

      const creatureId = createCardId("creature-1");
      const auraId = createCardId("aura-1");

      const creature: MagicCard = {
        id: creatureId,
        definitionId: "grizzly-bears",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        summoningSick: false,
        damageTaken: 0,
        counters: {},
        attachments: [auraId], // Aura attached to this creature
      };

      const aura: MagicCard = {
        id: auraId,
        definitionId: "holy-strength",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        summoningSick: false,
        damageTaken: 0,
        counters: {},
        attachments: [],
        attachedTo: creatureId, // Aura is attached to creature
      };

      expect(creature.attachments).toContain(auraId);
      expect(aura.attachedTo).toBe(creatureId);
    });

    it("should preserve type safety with custom state", () => {
      type CustomState = {
        customField: string;
        customNumber: number;
      };

      type CustomCard = CardInstance<CustomState>;

      const card: CustomCard = {
        id: createCardId("card-1"),
        definitionId: "test-card",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("hand"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        customField: "test",
        customNumber: 42,
      };

      // Type checks
      const _fieldCheck: string = card.customField;
      const _numberCheck: number = card.customNumber;

      expect(card.customField).toBe("test");
      expect(card.customNumber).toBe(42);
    });
  });
});
