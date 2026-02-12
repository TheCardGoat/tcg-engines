import { describe, expect, it } from "bun:test";
import { createCardRegistry } from "../operations/card-registry-impl";
import { createCardId, createPlayerId, createZoneId } from "../types";
import type { CardDefinition } from "./card-definition";
import type { CardInstance } from "./card-instance";
import { getCardPower } from "./computed-properties";
import type { Modifier } from "./modifiers";

interface GameStateWithCards {
  // Biome-ignore lint/suspicious/noExplicitAny: any required for test covariance
  cards: Record<string, CardInstance<{ tapped: boolean; modifiers: Modifier<any>[] }>>;
}

describe("Conditional Modifiers", () => {
  describe("while-condition duration", () => {
    it("should apply modifier when condition is true", () => {
      const cardId = createCardId("card-1");

      const definition: CardDefinition = {
        abilities: [],
        basePower: 2,
        id: "creature",
        name: "Creature",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

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
            condition: (state: GameStateWithCards) => {
              const c = state.cards[String(cardId)];
              return c?.tapped === true; // Only apply if tapped
            },
            duration: "while-condition",
            id: "mod-1",
            property: "power",
            source: createCardId("source-1"),
            type: "stat",
            value: 2,
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
        abilities: [],
        basePower: 2,
        id: "creature",
        name: "Creature",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

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
            condition: (state: GameStateWithCards) => {
              const c = state.cards[String(cardId)];
              return c?.tapped === true; // Only apply if tapped
            },
            duration: "while-condition",
            id: "mod-1",
            property: "power",
            source: createCardId("source-1"),
            type: "stat",
            value: 2,
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
        abilities: [],
        basePower: 3,
        id: "creature",
        name: "Creature",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{
        tapped: boolean;
        modifiers: Modifier<GameStateWithCards>[];
      }> = {
        controller: createPlayerId("player-1"),
        definitionId: "creature",
        flipped: false,
        id: cardId,
        modifiers: [
          {
            condition: (state: GameStateWithCards) => {
              const c = state.cards[String(cardId)];
              return c?.tapped === true;
            },
            duration: "while-condition",
            id: "mod-1",
            property: "power",
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
        abilities: [],
        basePower: 1,
        id: "creature",
        name: "Creature",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{
        tapped: boolean;
        modifiers: Modifier<GameStateWithCards>[];
      }> = {
        controller: createPlayerId("player-1"),
        definitionId: "creature",
        flipped: false,
        id: cardId,
        modifiers: [
          {
            condition: (state: GameStateWithCards) => {
              const c = state.cards[String(cardId)];
              return c?.tapped === true; // Applies when tapped
            },
            duration: "while-condition",
            id: "mod-1",
            property: "power",
            source: createCardId("source-1"),
            type: "stat",
            value: 2,
          },
          {
            condition: (state: GameStateWithCards) => {
              const c = state.cards[String(cardId)];
              return c?.tapped === false; // Applies when NOT tapped
            },
            duration: "while-condition",
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
        tapped: true,
        zone: createZoneId("play"),
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
        abilities: [],
        basePower: 2,
        id: "creature",
        name: "Creature",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{
        tapped: boolean;
        modifiers: Modifier<GameStateWithCards>[];
      }> = {
        controller: createPlayerId("player-1"),
        definitionId: "creature",
        flipped: false,
        id: cardId,
        modifiers: [
          {
            condition: (state: GameStateWithCards) => {
              // Complex condition: +3 power if there's another tapped card
              const otherCard = state.cards[String(otherCardId)];
              return otherCard?.tapped === true;
            },
            duration: "while-condition",
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
        abilities: [],
        basePower: 1,
        id: "creature",
        name: "Creature",
        type: "creature",
      };

      const registry = createCardRegistry([definition]);

      const card: CardInstance<{
        tapped: boolean;
        modifiers: Modifier<GameStateWithCards>[];
      }> = {
        controller: createPlayerId("player-1"),
        definitionId: "creature",
        flipped: false,
        id: cardId,
        modifiers: [
          {
            duration: "permanent",
            id: "mod-1",
            property: "power",
            source: createCardId("source-1"),
            type: "stat",
            value: 2,
            // No condition - always applies
          },
          {
            condition: (state: GameStateWithCards) => {
              const c = state.cards[String(cardId)];
              return c?.tapped === true; // Only applies if tapped
            },
            duration: "while-condition",
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
