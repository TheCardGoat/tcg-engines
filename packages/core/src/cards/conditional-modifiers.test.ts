import { describe, expect, it } from "bun:test";
import { createCardId, createPlayerId, createZoneId } from "../types";
import type { CardDefinition } from "./card-definition";
import { createDefinitionRegistry } from "./card-definition";
import type { CardInstance } from "./card-instance";
import { getCardPower } from "./computed-properties";
import type { Modifier } from "./modifiers";

type GameStateWithCards = {
  // biome-ignore lint/suspicious/noExplicitAny: any required for test covariance
  cards: Record<
    string,
    CardInstance<{ tapped: boolean; modifiers: Modifier<any>[] }>
  >;
};

describe("Conditional Modifiers", () => {
  describe("while-condition duration", () => {
    it("should apply modifier when condition is true", () => {
      const cardId = createCardId("card-1");

      const definition: CardDefinition = {
        id: "creature",
        name: "Creature",
        type: "creature",
        basePower: 2,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{
        tapped: boolean;
        modifiers: Modifier<GameStateWithCards>[];
      }> = {
        id: cardId,
        definitionId: "creature",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: true, // Card is tapped
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [
          {
            id: "mod-1",
            type: "stat",
            property: "power",
            value: 2,
            duration: "while-condition",
            condition: (state: GameStateWithCards) => {
              const c = state.cards[String(cardId)];
              return c?.tapped === true; // Only apply if tapped
            },
            source: createCardId("source-1"),
          },
        ],
      };

      const state: GameStateWithCards = {
        cards: {
          [String(cardId)]: card,
        },
      };

      const power = getCardPower(card, state, registry);

      expect(power).toBe(4); // 2 base + 2 from conditional modifier
    });

    it("should not apply modifier when condition is false", () => {
      const cardId = createCardId("card-1");

      const definition: CardDefinition = {
        id: "creature",
        name: "Creature",
        type: "creature",
        basePower: 2,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{
        tapped: boolean;
        modifiers: Modifier<GameStateWithCards>[];
      }> = {
        id: cardId,
        definitionId: "creature",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: false, // Card is NOT tapped
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [
          {
            id: "mod-1",
            type: "stat",
            property: "power",
            value: 2,
            duration: "while-condition",
            condition: (state: GameStateWithCards) => {
              const c = state.cards[String(cardId)];
              return c?.tapped === true; // Only apply if tapped
            },
            source: createCardId("source-1"),
          },
        ],
      };

      const state: GameStateWithCards = {
        cards: {
          [String(cardId)]: card,
        },
      };

      const power = getCardPower(card, state, registry);

      expect(power).toBe(2); // 2 base only, modifier not applied
    });

    it("should dynamically re-evaluate condition when state changes", () => {
      const cardId = createCardId("card-1");

      const definition: CardDefinition = {
        id: "creature",
        name: "Creature",
        type: "creature",
        basePower: 3,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{
        tapped: boolean;
        modifiers: Modifier<GameStateWithCards>[];
      }> = {
        id: cardId,
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
            duration: "while-condition",
            condition: (state: GameStateWithCards) => {
              const c = state.cards[String(cardId)];
              return c?.tapped === true;
            },
            source: createCardId("source-1"),
          },
        ],
      };

      // Initial state: card is untapped
      const state1: GameStateWithCards = {
        cards: {
          [String(cardId)]: card,
        },
      };

      const power1 = getCardPower(card, state1, registry);
      expect(power1).toBe(3); // Base power only

      // State changes: card becomes tapped
      const tappedCard = { ...card, tapped: true };
      const state2: GameStateWithCards = {
        cards: {
          [String(cardId)]: tappedCard,
        },
      };

      const power2 = getCardPower(tappedCard, state2, registry);
      expect(power2).toBe(5); // Base + conditional modifier
    });

    it("should handle multiple conditional modifiers independently", () => {
      const cardId = createCardId("card-1");

      const definition: CardDefinition = {
        id: "creature",
        name: "Creature",
        type: "creature",
        basePower: 1,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{
        tapped: boolean;
        modifiers: Modifier<GameStateWithCards>[];
      }> = {
        id: cardId,
        definitionId: "creature",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: true,
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [
          {
            id: "mod-1",
            type: "stat",
            property: "power",
            value: 2,
            duration: "while-condition",
            condition: (state: GameStateWithCards) => {
              const c = state.cards[String(cardId)];
              return c?.tapped === true; // Applies when tapped
            },
            source: createCardId("source-1"),
          },
          {
            id: "mod-2",
            type: "stat",
            property: "power",
            value: 3,
            duration: "while-condition",
            condition: (state: GameStateWithCards) => {
              const c = state.cards[String(cardId)];
              return c?.tapped === false; // Applies when NOT tapped
            },
            source: createCardId("source-2"),
          },
        ],
      };

      const state: GameStateWithCards = {
        cards: {
          [String(cardId)]: card,
        },
      };

      const power = getCardPower(card, state, registry);

      // Card is tapped, so first modifier applies (+2), second doesn't
      expect(power).toBe(3); // 1 base + 2 from first modifier
    });

    it("should handle complex condition logic", () => {
      const cardId = createCardId("card-1");
      const otherCardId = createCardId("card-2");

      const definition: CardDefinition = {
        id: "creature",
        name: "Creature",
        type: "creature",
        basePower: 2,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{
        tapped: boolean;
        modifiers: Modifier<GameStateWithCards>[];
      }> = {
        id: cardId,
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
            duration: "while-condition",
            condition: (state: GameStateWithCards) => {
              // Complex condition: +3 power if there's another tapped card
              const otherCard = state.cards[String(otherCardId)];
              return otherCard?.tapped === true;
            },
            source: createCardId("source-1"),
          },
        ],
      };

      const otherCard: CardInstance<{
        tapped: boolean;
        modifiers: Modifier[];
      }> = {
        id: otherCardId,
        definitionId: "creature",
        owner: createPlayerId("player-1"),
        controller: createPlayerId("player-1"),
        zone: createZoneId("play"),
        tapped: true, // This card is tapped
        flipped: false,
        revealed: false,
        phased: false,
        modifiers: [],
      };

      const state: GameStateWithCards = {
        cards: {
          [String(cardId)]: card,
          [String(otherCardId)]: otherCard,
        },
      };

      const power = getCardPower(card, state, registry);

      expect(power).toBe(5); // 2 base + 3 from conditional (other card is tapped)
    });

    it("should mix conditional and unconditional modifiers correctly", () => {
      const cardId = createCardId("card-1");

      const definition: CardDefinition = {
        id: "creature",
        name: "Creature",
        type: "creature",
        basePower: 1,
        abilities: [],
      };

      const registry = createDefinitionRegistry([definition]);

      const card: CardInstance<{
        tapped: boolean;
        modifiers: Modifier<GameStateWithCards>[];
      }> = {
        id: cardId,
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
            // No condition - always applies
          },
          {
            id: "mod-2",
            type: "stat",
            property: "power",
            value: 3,
            duration: "while-condition",
            condition: (state: GameStateWithCards) => {
              const c = state.cards[String(cardId)];
              return c?.tapped === true; // Only applies if tapped
            },
            source: createCardId("source-2"),
          },
        ],
      };

      const state: GameStateWithCards = {
        cards: {
          [String(cardId)]: card,
        },
      };

      const power = getCardPower(card, state, registry);

      // Card is NOT tapped: 1 base + 2 permanent modifier (conditional doesn't apply)
      expect(power).toBe(3);
    });
  });
});
