import { describe, expect, it } from "bun:test";
import { createCardRegistry } from "../operations/card-registry-impl";
import { createCardId, createPlayerId, createZoneId } from "../types";
import type { CardDefinition } from "./card-definition";
import type { CardInstance } from "./card-instance";
import { getCardCost, getCardPower, getCardToughness } from "./computed-properties";
import type { Modifier } from "./modifiers";

interface GameStateWithModifiers {
  cards: Record<string, CardInstance<{ modifiers: Modifier[] }>>;
}

describe("Computed Properties", () => {
  describe("getCardPower", () => {
    it("should return base power from definition", () => {
      const definition: CardDefinition = {
        abilities: [],
        basePower: 2,
        baseToughness: 2,
        id: "grizzly-bears",
        name: "Grizzly Bears",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "grizzly-bears",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("play"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(2);
    });

    it("should return 0 if definition has no basePower", () => {
      const definition: CardDefinition = {
        abilities: [],
        id: "instant-spell",
        name: "Instant Spell",
        type: "instant",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "instant-spell",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("hand"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(0);
    });

    it("should add positive power modifiers to base power", () => {
      const definition: CardDefinition = {
        abilities: [],
        basePower: 2,
        id: "creature",
        name: "Creature",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "creature",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [
          {
            duration: "permanent",
            id: "mod-1",
            property: "power",
            source: createCardId("source-1"),
            type: "stat",
            value: 3,
          },
        ],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("play"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(5); // 2 + 3
    });

    it("should subtract negative power modifiers from base power", () => {
      const definition: CardDefinition = {
        abilities: [],
        basePower: 5,
        id: "creature",
        name: "Creature",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "creature",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [
          {
            duration: "permanent",
            id: "mod-1",
            property: "power",
            source: createCardId("source-1"),
            type: "stat",
            value: -2,
          },
        ],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("play"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(3); // 5 - 2
    });

    it("should sum multiple power modifiers", () => {
      const definition: CardDefinition = {
        abilities: [],
        basePower: 1,
        id: "creature",
        name: "Creature",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "creature",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [
          {
            duration: "permanent",
            id: "mod-1",
            property: "power",
            source: createCardId("source-1"),
            type: "stat",
            value: 2,
          },
          {
            duration: "permanent",
            id: "mod-2",
            property: "power",
            source: createCardId("source-2"),
            type: "stat",
            value: 3,
          },
        ],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("play"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(6); // 1 + 2 + 3
    });

    it("should ignore non-power modifiers", () => {
      const definition: CardDefinition = {
        abilities: [],
        basePower: 2,
        id: "creature",
        name: "Creature",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "creature",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [
          {
            duration: "permanent",
            id: "mod-1",
            property: "toughness",
            source: createCardId("source-1"),
            type: "stat",
            value: 5,
          },
          {
            duration: "permanent",
            id: "mod-2",
            property: "flying",
            source: createCardId("source-2"),
            type: "ability",
            value: true,
          },
        ],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("play"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(2); // Base power only
    });
  });

  describe("getCardToughness", () => {
    it("should return base toughness from definition", () => {
      const definition: CardDefinition = {
        abilities: [],
        basePower: 2,
        baseToughness: 2,
        id: "grizzly-bears",
        name: "Grizzly Bears",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "grizzly-bears",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("play"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const toughness = getCardToughness(card, state, registry);

      expect(toughness).toBe(2);
    });

    it("should return 0 if definition has no baseToughness", () => {
      const definition: CardDefinition = {
        abilities: [],
        id: "instant-spell",
        name: "Instant Spell",
        type: "instant",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "instant-spell",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("hand"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const toughness = getCardToughness(card, state, registry);

      expect(toughness).toBe(0);
    });

    it("should add toughness modifiers to base toughness", () => {
      const definition: CardDefinition = {
        abilities: [],
        baseToughness: 3,
        id: "creature",
        name: "Creature",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "creature",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [
          {
            duration: "permanent",
            id: "mod-1",
            property: "toughness",
            source: createCardId("source-1"),
            type: "stat",
            value: 2,
          },
        ],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("play"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const toughness = getCardToughness(card, state, registry);

      expect(toughness).toBe(5); // 3 + 2
    });
  });

  describe("getCardCost", () => {
    it("should return base cost from definition", () => {
      const definition: CardDefinition = {
        abilities: [],
        baseCost: 1,
        id: "fire-bolt",
        name: "Fire Bolt",
        type: "instant",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "fire-bolt",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("hand"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const cost = getCardCost(card, state, registry);

      expect(cost).toBe(1);
    });

    it("should return 0 if definition has no baseCost", () => {
      const definition: CardDefinition = {
        abilities: [],
        id: "free-spell",
        name: "Free Spell",
        type: "instant",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "free-spell",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("hand"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const cost = getCardCost(card, state, registry);

      expect(cost).toBe(0);
    });

    it("should apply cost reduction modifiers", () => {
      const definition: CardDefinition = {
        abilities: [],
        baseCost: 5,
        id: "spell",
        name: "Spell",
        type: "instant",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "spell",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [
          {
            duration: "permanent",
            id: "mod-1",
            property: "cost",
            source: createCardId("source-1"),
            type: "stat",
            value: -2,
          },
        ],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("hand"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const cost = getCardCost(card, state, registry);

      expect(cost).toBe(3); // 5 - 2
    });

    it("should not allow cost to go below zero", () => {
      const definition: CardDefinition = {
        abilities: [],
        baseCost: 2,
        id: "spell",
        name: "Spell",
        type: "instant",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "spell",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [
          {
            duration: "permanent",
            id: "mod-1",
            property: "cost",
            source: createCardId("source-1"),
            type: "stat",
            value: -5,
          },
        ],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("hand"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const cost = getCardCost(card, state, registry);

      expect(cost).toBe(0); // Can't go negative
    });

    it("should apply cost increase modifiers", () => {
      const definition: CardDefinition = {
        abilities: [],
        baseCost: 3,
        id: "spell",
        name: "Spell",
        type: "instant",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        controller: createPlayerId("player-1"),
        definitionId: "spell",
        flipped: false,
        id: createCardId("card-1"),
        modifiers: [
          {
            duration: "permanent",
            id: "mod-1",
            property: "cost",
            source: createCardId("source-1"),
            type: "stat",
            value: 2,
          },
        ],
        owner: createPlayerId("player-1"),
        phased: false,
        revealed: false,
        tapped: false,
        zone: createZoneId("hand"),
      };

      const state: GameStateWithModifiers = { cards: {} };
      const cost = getCardCost(card, state, registry);

      expect(cost).toBe(5); // 3 + 2
    });
  });
});
