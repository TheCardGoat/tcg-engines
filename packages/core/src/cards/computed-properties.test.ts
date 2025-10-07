import { describe, expect, it } from "bun:test";
import { createCardId, createPlayerId, createZoneId } from "../types";
import type { CardDefinition } from "./card-definition";
import { createDefinitionRegistry } from "./card-definition";
import type { CardInstance } from "./card-instance";
import {
  getCardCost,
  getCardPower,
  getCardToughness,
} from "./computed-properties";
import type { Modifier } from "./modifiers";

type GameStateWithModifiers = {
  cards: Record<string, CardInstance<{ modifiers: Modifier[] }>>;
};

describe("Computed Properties", () => {
  describe("getCardPower", () => {
    it("should return base power from definition", () => {
      const definition: CardDefinition = {
        id: "grizzly-bears",
        name: "Grizzly Bears",
        type: "creature",
        basePower: 2,
        baseToughness: 2,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "grizzly-bears",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(2);
    });

    it("should return 0 if definition has no basePower", () => {
      const definition: CardDefinition = {
        id: "instant-spell",
        name: "Instant Spell",
        type: "instant",
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "instant-spell",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("hand"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(0);
    });

    it("should add positive power modifiers to base power", () => {
      const definition: CardDefinition = {
        id: "creature",
        name: "Creature",
        type: "creature",
        basePower: 2,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "creature",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [
          {
            id: "mod-1",
            type: "stat",
            property: "power",
            value: 3,
            duration: "permanent",
            source: createCardId("source-1"),
          },
        ],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(5); // 2 + 3
    });

    it("should subtract negative power modifiers from base power", () => {
      const definition: CardDefinition = {
        id: "creature",
        name: "Creature",
        type: "creature",
        basePower: 5,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "creature",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [
          {
            id: "mod-1",
            type: "stat",
            property: "power",
            value: -2,
            duration: "permanent",
            source: createCardId("source-1"),
          },
        ],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(3); // 5 - 2
    });

    it("should sum multiple power modifiers", () => {
      const definition: CardDefinition = {
        id: "creature",
        name: "Creature",
        type: "creature",
        basePower: 1,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "creature",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [
          {
            id: "mod-1",
            type: "stat",
            property: "power",
            value: 2,
            duration: "permanent",
            source: createCardId("source-1"),
          },
          {
            id: "mod-2",
            type: "stat",
            property: "power",
            value: 3,
            duration: "permanent",
            source: createCardId("source-2"),
          },
        ],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(6); // 1 + 2 + 3
    });

    it("should ignore non-power modifiers", () => {
      const definition: CardDefinition = {
        id: "creature",
        name: "Creature",
        type: "creature",
        basePower: 2,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "creature",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [
          {
            id: "mod-1",
            type: "stat",
            property: "toughness",
            value: 5,
            duration: "permanent",
            source: createCardId("source-1"),
          },
          {
            id: "mod-2",
            type: "ability",
            property: "flying",
            value: true,
            duration: "permanent",
            source: createCardId("source-2"),
          },
        ],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const power = getCardPower(card, state, registry);

      expect(power).toBe(2); // Base power only
    });
  });

  describe("getCardToughness", () => {
    it("should return base toughness from definition", () => {
      const definition: CardDefinition = {
        id: "grizzly-bears",
        name: "Grizzly Bears",
        type: "creature",
        basePower: 2,
        baseToughness: 2,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "grizzly-bears",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const toughness = getCardToughness(card, state, registry);

      expect(toughness).toBe(2);
    });

    it("should return 0 if definition has no baseToughness", () => {
      const definition: CardDefinition = {
        id: "instant-spell",
        name: "Instant Spell",
        type: "instant",
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "instant-spell",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("hand"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const toughness = getCardToughness(card, state, registry);

      expect(toughness).toBe(0);
    });

    it("should add toughness modifiers to base toughness", () => {
      const definition: CardDefinition = {
        id: "creature",
        name: "Creature",
        type: "creature",
        baseToughness: 3,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "creature",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [
          {
            id: "mod-1",
            type: "stat",
            property: "toughness",
            value: 2,
            duration: "permanent",
            source: createCardId("source-1"),
          },
        ],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const toughness = getCardToughness(card, state, registry);

      expect(toughness).toBe(5); // 3 + 2
    });
  });

  describe("getCardCost", () => {
    it("should return base cost from definition", () => {
      const definition: CardDefinition = {
        id: "fire-bolt",
        name: "Fire Bolt",
        type: "instant",
        baseCost: 1,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "fire-bolt",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("hand"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const cost = getCardCost(card, state, registry);

      expect(cost).toBe(1);
    });

    it("should return 0 if definition has no baseCost", () => {
      const definition: CardDefinition = {
        id: "free-spell",
        name: "Free Spell",
        type: "instant",
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "free-spell",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("hand"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const cost = getCardCost(card, state, registry);

      expect(cost).toBe(0);
    });

    it("should apply cost reduction modifiers", () => {
      const definition: CardDefinition = {
        id: "spell",
        name: "Spell",
        type: "instant",
        baseCost: 5,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "spell",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("hand"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [
          {
            id: "mod-1",
            type: "stat",
            property: "cost",
            value: -2,
            duration: "permanent",
            source: createCardId("source-1"),
          },
        ],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const cost = getCardCost(card, state, registry);

      expect(cost).toBe(3); // 5 - 2
    });

    it("should not allow cost to go below zero", () => {
      const definition: CardDefinition = {
        id: "spell",
        name: "Spell",
        type: "instant",
        baseCost: 2,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "spell",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("hand"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [
          {
            id: "mod-1",
            type: "stat",
            property: "cost",
            value: -5,
            duration: "permanent",
            source: createCardId("source-1"),
          },
        ],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const cost = getCardCost(card, state, registry);

      expect(cost).toBe(0); // Can't go negative
    });

    it("should apply cost increase modifiers", () => {
      const definition: CardDefinition = {
        id: "spell",
        name: "Spell",
        type: "instant",
        baseCost: 3,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{ modifiers: Modifier[] }> = {
        id: createCardId("card-1"),
        definitionId: "spell",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("hand"),
        tapped: false,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [
          {
            id: "mod-1",
            type: "stat",
            property: "cost",
            value: 2,
            duration: "permanent",
            source: createCardId("source-1"),
          },
        ],
      };

      const state: GameStateWithModifiers = { cards: {} };
      const cost = getCardCost(card, state, registry);

      expect(cost).toBe(5); // 3 + 2
    });
  });
});
