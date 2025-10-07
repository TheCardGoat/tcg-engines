import { beforeEach, describe, expect, it } from "bun:test";
import {
  createCardId,
  createPlayerId,
  createZoneId,
} from "../../types/branded-types";
import type { CardInstance, CardInstanceBase } from "../card-instance-types";

describe("CardInstanceBase", () => {
  let cardId: ReturnType<typeof createCardId>;
  let playerId: ReturnType<typeof createPlayerId>;
  let zoneId: ReturnType<typeof createZoneId>;

  beforeEach(() => {
    cardId = createCardId("card-1");
    playerId = createPlayerId("player-1");
    zoneId = createZoneId("hand");
  });

  describe("Mandatory Identity Fields", () => {
    it("should have id field of type CardId", () => {
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        position: 0,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(cardInstance.id).toBe(cardId);
    });

    it("should have definitionId field of type string", () => {
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "forest",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        position: 0,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(cardInstance.definitionId).toBe("forest");
    });

    it("should have owner field of type PlayerId", () => {
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        position: 0,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(cardInstance.owner).toBe(playerId);
    });

    it("should have controller field of type PlayerId", () => {
      const player2 = createPlayerId("player-2");
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: player2,
        zone: zoneId,
        position: 0,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(cardInstance.controller).toBe(player2);
    });

    it("should allow controller to differ from owner", () => {
      const player2 = createPlayerId("player-2");
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: player2,
        zone: zoneId,
        position: 0,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(cardInstance.owner).toBe(playerId);
      expect(cardInstance.controller).toBe(player2);
      expect(cardInstance.owner).not.toBe(cardInstance.controller);
    });
  });

  describe("Mandatory Location Fields", () => {
    it("should have zone field of type ZoneId", () => {
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        position: 0,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(cardInstance.zone).toBe(zoneId);
    });

    it("should have optional position field of type number", () => {
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        position: 3,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(cardInstance.position).toBe(3);
    });

    it("should allow position to be undefined", () => {
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(cardInstance.position).toBeUndefined();
    });
  });

  describe("Mandatory State Flags", () => {
    it("should have tapped field of type boolean", () => {
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        position: 0,
        tapped: true,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(cardInstance.tapped).toBe(true);
    });

    it("should have flipped field of type boolean", () => {
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        position: 0,
        tapped: false,
        flipped: true,
        revealed: false,
        phased: false,
      };

      expect(cardInstance.flipped).toBe(true);
    });

    it("should have revealed field of type boolean", () => {
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        position: 0,
        tapped: false,
        flipped: false,
        revealed: true,
        phased: false,
      };

      expect(cardInstance.revealed).toBe(true);
    });

    it("should have phased field of type boolean", () => {
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        position: 0,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: true,
      };

      expect(cardInstance.phased).toBe(true);
    });
  });

  describe("Complete CardInstanceBase Structure", () => {
    it("should create valid CardInstanceBase with all mandatory fields", () => {
      const cardInstance: CardInstanceBase = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        position: 5,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(cardInstance.id).toBe(cardId);
      expect(cardInstance.definitionId).toBe("grizzly-bears");
      expect(cardInstance.owner).toBe(playerId);
      expect(cardInstance.controller).toBe(playerId);
      expect(cardInstance.zone).toBe(zoneId);
      expect(cardInstance.position).toBe(5);
      expect(cardInstance.tapped).toBe(false);
      expect(cardInstance.flipped).toBe(false);
      expect(cardInstance.revealed).toBe(false);
      expect(cardInstance.phased).toBe(false);
    });
  });
});

describe("CardInstance<TCustomState>", () => {
  let cardId: ReturnType<typeof createCardId>;
  let playerId: ReturnType<typeof createPlayerId>;
  let zoneId: ReturnType<typeof createZoneId>;

  beforeEach(() => {
    cardId = createCardId("card-1");
    playerId = createPlayerId("player-1");
    zoneId = createZoneId("battlefield");
  });

  describe("Generic Type Extension", () => {
    it("should extend CardInstanceBase with empty custom state", () => {
      const cardInstance: CardInstance = {
        id: cardId,
        definitionId: "mountain",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
      };

      expect(cardInstance.id).toBe(cardId);
      expect(cardInstance.definitionId).toBe("mountain");
    });

    it("should extend CardInstanceBase with Magic custom state", () => {
      type MagicCardState = {
        summoningSick: boolean;
        damageTaken: number;
        counters: Record<string, number>;
        attachments: ReturnType<typeof createCardId>[];
        attachedTo?: ReturnType<typeof createCardId>;
      };

      type MagicCard = CardInstance<MagicCardState>;

      const magicCard: MagicCard = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        summoningSick: true,
        damageTaken: 2,
        counters: { "+1/+1": 1, "-1/-1": 0 },
        attachments: [],
      };

      expect(magicCard.summoningSick).toBe(true);
      expect(magicCard.damageTaken).toBe(2);
      expect(magicCard.counters["+1/+1"]).toBe(1);
      expect(magicCard.attachments).toEqual([]);
    });

    it("should extend CardInstanceBase with Hearthstone custom state", () => {
      type HearthstoneCardState = {
        damageTaken: number;
        divineShield: boolean;
        stealth: boolean;
        frozen: boolean;
        silenced: boolean;
      };

      type HearthstoneCard = CardInstance<HearthstoneCardState>;

      const hearthstoneCard: HearthstoneCard = {
        id: cardId,
        definitionId: "boulderfist-ogre",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        damageTaken: 3,
        divineShield: false,
        stealth: false,
        frozen: true,
        silenced: false,
      };

      expect(hearthstoneCard.damageTaken).toBe(3);
      expect(hearthstoneCard.divineShield).toBe(false);
      expect(hearthstoneCard.frozen).toBe(true);
      expect(hearthstoneCard.silenced).toBe(false);
    });

    it("should support different custom states for different game types", () => {
      type PokemonCardState = {
        energyAttached: number;
        status: "normal" | "poisoned" | "paralyzed" | "asleep";
        damage: number;
      };

      type PokemonCard = CardInstance<PokemonCardState>;

      const pokemonCard: PokemonCard = {
        id: cardId,
        definitionId: "pikachu",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        energyAttached: 2,
        status: "poisoned",
        damage: 10,
      };

      expect(pokemonCard.energyAttached).toBe(2);
      expect(pokemonCard.status).toBe("poisoned");
      expect(pokemonCard.damage).toBe(10);
    });
  });

  describe("Type Safety", () => {
    it("should maintain type safety for custom state fields", () => {
      type MagicCardState = {
        summoningSick: boolean;
        damageTaken: number;
      };

      type MagicCard = CardInstance<MagicCardState>;

      const magicCard: MagicCard = {
        id: cardId,
        definitionId: "grizzly-bears",
        owner: playerId,
        controller: playerId,
        zone: zoneId,
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        summoningSick: true,
        damageTaken: 2,
      };

      // TypeScript should enforce these types
      expect(typeof magicCard.summoningSick).toBe("boolean");
      expect(typeof magicCard.damageTaken).toBe("number");
    });
  });
});
