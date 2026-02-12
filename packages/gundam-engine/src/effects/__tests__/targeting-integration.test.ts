/**
 * Integration tests for the targeting system
 * Tests targeting with actual effect definitions and game state
 */

import { describe, expect, it } from "bun:test";
import type { CardId, PlayerId } from "@tcg/core";
import { createCardId, createPlayerId } from "@tcg/core";
import type {
  BaseEffectCardDefinition,
  TargetingSpec,
} from "@tcg/gundam-types";
import type { GundamGameState } from "../../types";
import {
  type TargetingContext,
  enumerateValidTargets,
  validateTargets,
} from "../targeting-system";

// Helper to create a complete game state
function createGameState(
  config: {
    player1Cards?: { battleArea?: string[]; hand?: string[]; deck?: string[] };
    player2Cards?: { battleArea?: string[]; hand?: string[]; deck?: string[] };
    cardPositions?: Record<string, "active" | "rested">;
    temporaryModifiers?: Record<string, unknown[]>;
  } = {},
): GundamGameState {
  const player1 = "player-1" as PlayerId;
  const player2 = "player-2" as PlayerId;

  return {
    currentPlayer: player1,
    gundam: {
      activeResources: {
        [player1]: 3,
        [player2]: 2,
      } as Record<PlayerId, number>,
      attackedThisTurn: [] as CardId[],
      cardDamage: {} as Record<CardId, number>,
      cardPositions: (config.cardPositions ?? {}) as Record<CardId, "active" | "rested">,
      effectStack: {
        nextInstanceId: 0,
        stack: [],
      },
      hasPlayedResourceThisTurn: {
        [player1]: true,
        [player2]: false,
      } as Record<PlayerId, boolean>,
      revealedCards: [] as CardId[],
      temporaryModifiers:
        (config.temporaryModifiers as any) ??
        ({} as GundamGameState["gundam"]["temporaryModifiers"]),
    },
    phase: "main",
    players: [player1, player2],
    turn: 2,
    zones: {
      baseSection: {
        [player1]: {
          cards: [] as CardId[],
          config: {
            id: "base-p1",
            maxSize: 1,
            name: "Base Section",
            ordered: false,
            owner: player1,
            visibility: "public" as const,
          },
        },
        [player2]: {
          cards: [] as CardId[],
          config: {
            id: "base-p2",
            maxSize: 1,
            name: "Base Section",
            ordered: false,
            owner: player2,
            visibility: "public" as const,
          },
        },
      } as any,
      battleArea: {
        [player1]: {
          cards: (config.player1Cards?.battleArea ?? []) as CardId[],
          config: {
            id: "ba-p1",
            maxSize: 6,
            name: "Battle Area",
            ordered: true,
            owner: player1,
            visibility: "public" as const,
          },
        },
        [player2]: {
          cards: (config.player2Cards?.battleArea ?? []) as CardId[],
          config: {
            id: "ba-p2",
            maxSize: 6,
            name: "Battle Area",
            ordered: true,
            owner: player2,
            visibility: "public" as const,
          },
        },
      } as any,
      deck: {
        [player1]: {
          cards: (config.player1Cards?.deck ?? []) as CardId[],
          config: {
            faceDown: true,
            id: "deck-p1",
            maxSize: 50,
            name: "Deck",
            ordered: true,
            owner: player1,
            visibility: "secret" as const,
          },
        },
        [player2]: {
          cards: (config.player2Cards?.deck ?? []) as CardId[],
          config: {
            faceDown: true,
            id: "deck-p2",
            maxSize: 50,
            name: "Deck",
            ordered: true,
            owner: player2,
            visibility: "secret" as const,
          },
        },
      } as any,
      hand: {
        [player1]: {
          cards: (config.player1Cards?.hand ?? []) as CardId[],
          config: {
            id: "hand-p1",
            maxSize: 10,
            name: "Hand",
            ordered: false,
            owner: player1,
            visibility: "private" as const,
          },
        },
        [player2]: {
          cards: (config.player2Cards?.hand ?? []) as CardId[],
          config: {
            id: "hand-p2",
            maxSize: 10,
            name: "Hand",
            ordered: false,
            owner: player2,
            visibility: "private" as const,
          },
        },
      } as any,
      limbo: {
        [player1]: {
          cards: [] as CardId[],
          config: {
            id: "limbo-p1",
            maxSize: 0,
            name: "Limbo",
            ordered: false,
            owner: player1 as PlayerId,
            visibility: "public" as const,
          },
        },
        [player2]: {
          cards: [] as CardId[],
          config: {
            id: "limbo-p2",
            maxSize: 0,
            name: "Limbo",
            ordered: false,
            owner: player2 as PlayerId,
            visibility: "public" as const,
          },
        },
      } as any,
      removal: {
        [player1]: {
          cards: [] as CardId[],
          config: {
            id: "removal-p1",
            maxSize: 0,
            name: "Removal",
            ordered: false,
            owner: player1 as PlayerId,
            visibility: "public" as const,
          },
        },
        [player2]: {
          cards: [] as CardId[],
          config: {
            id: "removal-p2",
            maxSize: 0,
            name: "Removal",
            ordered: false,
            owner: player2 as PlayerId,
            visibility: "public" as const,
          },
        },
      } as any,
      resourceArea: {
        [player1]: {
          cards: [] as CardId[],
          config: {
            id: "res-area-p1",
            maxSize: 15,
            name: "Resource Area",
            ordered: false,
            owner: player1,
            visibility: "public" as const,
          },
        },
        [player2]: {
          cards: [] as CardId[],
          config: {
            id: "res-area-p2",
            maxSize: 15,
            name: "Resource Area",
            ordered: false,
            owner: player2,
            visibility: "public" as const,
          },
        },
      } as any,
      resourceDeck: {
        [player1]: {
          cards: [] as CardId[],
          config: {
            faceDown: true,
            id: "res-deck-p1",
            maxSize: 10,
            name: "Resource Deck",
            ordered: true,
            owner: player1,
            visibility: "secret" as const,
          },
        },
        [player2]: {
          cards: [] as CardId[],
          config: {
            faceDown: true,
            id: "res-deck-p2",
            maxSize: 10,
            name: "Resource Deck",
            ordered: true,
            owner: player2,
            visibility: "secret" as const,
          },
        },
      } as any,
      shieldSection: {
        [player1]: {
          cards: [] as CardId[],
          config: {
            faceDown: true,
            id: "shield-p1",
            maxSize: 6,
            name: "Shield Section",
            ordered: true,
            owner: player1,
            visibility: "secret" as const,
          },
        },
        [player2]: {
          cards: [] as CardId[],
          config: {
            faceDown: true,
            id: "shield-p2",
            maxSize: 6,
            name: "Shield Section",
            ordered: true,
            owner: player2,
            visibility: "secret" as const,
          },
        },
      } as any,
      trash: {
        [player1]: {
          cards: [] as CardId[],
          config: {
            id: "trash-p1",
            maxSize: 0,
            name: "Trash",
            ordered: true,
            owner: player1,
            visibility: "public" as const,
          },
        },
        [player2]: {
          cards: [] as CardId[],
          config: {
            id: "trash-p2",
            maxSize: 0,
            name: "Trash",
            ordered: true,
            owner: player2,
            visibility: "public" as const,
          },
        },
      } as any,
    },
  };
}

// Helper to create card definitions
function createCardDefinitions(
  cards: {
    id: string;
    name: string;
    cardType: "UNIT" | "COMMAND" | "BASE";
    cost: number;
    lv: number;
    color?: string;
    traits?: string[];
  }[],
): Record<CardId, BaseEffectCardDefinition> {
  const result: Record<CardId, BaseEffectCardDefinition> = {};

  for (const card of cards) {
    result[card.id as CardId] = {
      cardType: card.cardType,
      cost: card.cost,
      effects: [],
      id: card.id,
      lv: card.lv,
      name: card.name,
      text: "",
      ...(card.color ? { color: card.color as any } : {}),
      ...(card.traits ? { traits: card.traits } : {}),
    } as any;
  }

  return result;
}

// Helper to create targeting context
function createContext(
  controllerId: string,
  sourceCardId: string,
  cardDefinitions: Record<CardId, BaseEffectCardDefinition>,
): TargetingContext {
  return {
    cardDefinitions,
    controllerId: controllerId as PlayerId,
    sourceCardId: sourceCardId as CardId,
  };
}

const PLAYER_1 = "player-1" as PlayerId;
const PLAYER_2 = "player-2" as PlayerId;

// Sample cards
const RX78 = "rx-78-2" as CardId;
const ZAKU = "zaku-ii" as CardId;
const GM = "gm" as CardId;
const DOM = "dom" as CardId;
const GOUF = "gouf" as CardId;

describe("targeting integration with actual effect definitions", () => {
  describe("destroy effect - destroy unit with cost 2 or less", () => {
    it("should find valid targets for destroy effect", () => {
      const state = createGameState({
        player1Cards: { battleArea: [RX78] },
        player2Cards: { battleArea: [ZAKU, GM, DOM] },
      });

      const cardDefs = createCardDefinitions([
        { cardType: "UNIT", cost: 3, id: RX78, lv: 2, name: "RX-78-2 Gundam" },
        { cardType: "UNIT", cost: 2, id: ZAKU, lv: 1, name: "Zaku II" },
        { cardType: "UNIT", cost: 1, id: GM, lv: 1, name: "GM" },
        { cardType: "UNIT", cost: 3, id: DOM, lv: 2, name: "Dom" },
      ]);

      const targetingSpec: TargetingSpec = {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [
          {
            owner: "opponent",
            properties: { cost: { max: 2 } },
            type: "unit",
            zone: "battleArea",
          },
        ],
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);
      const validTargets = enumerateValidTargets(state, targetingSpec, context);

      expect(validTargets).toHaveLength(2);
      expect(validTargets).toContain(ZAKU);
      expect(validTargets).toContain(GM);
      expect(validTargets).not.toContain(DOM);
    });

    it("should validate player choice for destroy effect", () => {
      const state = createGameState({
        player1Cards: { battleArea: [RX78] },
        player2Cards: { battleArea: [ZAKU, GM, DOM] },
      });

      const cardDefs = createCardDefinitions([
        { cardType: "UNIT", cost: 3, id: RX78, lv: 2, name: "RX-78-2 Gundam" },
        { cardType: "UNIT", cost: 2, id: ZAKU, lv: 1, name: "Zaku II" },
        { cardType: "UNIT", cost: 1, id: GM, lv: 1, name: "GM" },
        { cardType: "UNIT", cost: 3, id: DOM, lv: 2, name: "Dom" },
      ]);

      const targetingSpec: TargetingSpec = {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [
          {
            owner: "opponent",
            properties: { cost: { max: 2 } },
            type: "unit",
            zone: "battleArea",
          },
        ],
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);

      // Valid choice
      expect(validateTargets(state, targetingSpec, [ZAKU], context)).toBe(true);
      expect(validateTargets(state, targetingSpec, [GM], context)).toBe(true);

      // Invalid: cost too high
      expect(validateTargets(state, targetingSpec, [DOM], context)).toBe(false);

      // Invalid: wrong count
      expect(validateTargets(state, targetingSpec, [ZAKU, GM], context)).toBe(false);

      // Invalid: own card
      expect(validateTargets(state, targetingSpec, [RX78], context)).toBe(false);
    });
  });

  describe("rest effect - rest up to 2 units", () => {
    it("should find valid targets for rest effect", () => {
      const state = createGameState({
        cardPositions: {
          [RX78]: "active",
          [ZAKU]: "active",
          [GM]: "rested",
          [DOM]: "active",
        },
        player1Cards: { battleArea: [RX78, ZAKU, GM] },
        player2Cards: { battleArea: [DOM] },
      });

      const cardDefs = createCardDefinitions([
        { cardType: "UNIT", cost: 3, id: RX78, lv: 2, name: "RX-78-2 Gundam" },
        { cardType: "UNIT", cost: 2, id: ZAKU, lv: 1, name: "Zaku II" },
        { cardType: "UNIT", cost: 1, id: GM, lv: 1, name: "GM" },
        { cardType: "UNIT", cost: 3, id: DOM, lv: 2, name: "Dom" },
      ]);

      const targetingSpec: TargetingSpec = {
        chooser: "controller",
        count: { max: 2, min: 0 },
        timing: "on_resolution",
        validTargets: [
          {
            owner: "opponent",
            state: { rested: false },
            type: "unit",
            zone: "battleArea",
          },
        ],
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);
      const validTargets = enumerateValidTargets(state, targetingSpec, context);

      // Only opponent's active units
      expect(validTargets).toHaveLength(1);
      expect(validTargets).toContain(DOM);
    });

    it("should validate optional targets", () => {
      const state = createGameState({
        cardPositions: {
          [RX78]: "active",
          [ZAKU]: "active",
        },
        player1Cards: { battleArea: [RX78] },
        player2Cards: { battleArea: [ZAKU] },
      });

      const cardDefs = createCardDefinitions([
        { cardType: "UNIT", cost: 3, id: RX78, lv: 2, name: "RX-78-2 Gundam" },
        { cardType: "UNIT", cost: 2, id: ZAKU, lv: 1, name: "Zaku II" },
      ]);

      const targetingSpec: TargetingSpec = {
        chooser: "controller",
        count: { max: 1, min: 0 },
        timing: "on_resolution",
        validTargets: [
          {
            owner: "opponent",
            type: "unit",
            zone: "battleArea",
          },
        ],
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);

      // Can choose 0 targets (optional)
      expect(validateTargets(state, targetingSpec, [], context)).toBe(true);

      // Can choose 1 target
      expect(validateTargets(state, targetingSpec, [ZAKU], context)).toBe(true);

      // Cannot choose more than max
      expect(validateTargets(state, targetingSpec, [ZAKU, RX78], context)).toBe(false);
    });
  });

  describe("multiple filter effects - choose unit OR command", () => {
    it("should combine targets from multiple filters", () => {
      const state = createGameState({
        player1Cards: { battleArea: [RX78], hand: [GOUF] },
        player2Cards: { battleArea: [ZAKU], hand: [] },
      });

      const cardDefs = createCardDefinitions([
        { cardType: "UNIT", cost: 3, id: RX78, lv: 2, name: "RX-78-2 Gundam" },
        { cardType: "UNIT", cost: 2, id: ZAKU, lv: 1, name: "Zaku II" },
        { cardType: "COMMAND", cost: 2, id: GOUF, lv: 1, name: "Gouf" },
      ]);

      const targetingSpec: TargetingSpec = {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [
          {
            owner: "any",
            type: "unit",
            zone: "battleArea",
          },
          {
            owner: "self",
            properties: { cardType: "COMMAND" },
            type: "card",
            zone: "hand",
          },
        ],
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);
      const validTargets = enumerateValidTargets(state, targetingSpec, context);

      expect(validTargets).toHaveLength(3);
      expect(validTargets).toContain(RX78);
      expect(validTargets).toContain(ZAKU);
      expect(validTargets).toContain(GOUF);
    });
  });

  describe("trait-based targeting", () => {
    it("should target cards with specific traits", () => {
      const state = createGameState({
        player1Cards: { battleArea: [RX78, ZAKU] },
        player2Cards: { battleArea: [GM, DOM] },
      });

      const cardDefs = createCardDefinitions([
        {
          cardType: "UNIT",
          cost: 3,
          id: RX78,
          lv: 2,
          name: "RX-78-2 Gundam",
          traits: ["E.F.S.F", "Mobile Suit"],
        },
        {
          cardType: "UNIT",
          cost: 2,
          id: ZAKU,
          lv: 1,
          name: "Zaku II",
          traits: ["Zeon", "Mobile Suit"],
        },
        {
          cardType: "UNIT",
          cost: 1,
          id: GM,
          lv: 1,
          name: "GM",
          traits: ["E.F.S.F", "Mobile Suit"],
        },
        {
          cardType: "UNIT",
          cost: 3,
          id: DOM,
          lv: 2,
          name: "Dom",
          traits: ["Zeon", "Mobile Suit"],
        },
      ]);

      const targetingSpec: TargetingSpec = {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [
          {
            owner: "opponent",
            properties: { trait: ["Zeon"] },
            type: "unit",
            zone: "battleArea",
          },
        ],
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);
      const validTargets = enumerateValidTargets(state, targetingSpec, context);

      // From Player 1's perspective, only opponent's (Player 2's) Zeon cards are valid
      // ZAKU is Player 1's card (self), DOM is Player 2's card (opponent with Zeon)
      expect(validTargets).toHaveLength(1);
      expect(validTargets).toContain(DOM);
      expect(validTargets).not.toContain(ZAKU);
    });
  });

  describe("color-based targeting", () => {
    it("should target cards by color", () => {
      const state = createGameState({
        player1Cards: { battleArea: [RX78] },
        player2Cards: { battleArea: [ZAKU, GM] },
      });

      const cardDefs = createCardDefinitions([
        {
          cardType: "UNIT",
          color: "Blue",
          cost: 3,
          id: RX78,
          lv: 2,
          name: "RX-78-2 Gundam",
        },
        {
          cardType: "UNIT",
          color: "Red",
          cost: 2,
          id: ZAKU,
          lv: 1,
          name: "Zaku II",
        },
        { cardType: "UNIT", color: "Blue", cost: 1, id: GM, lv: 1, name: "GM" },
      ]);

      const targetingSpec: TargetingSpec = {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [
          {
            owner: "opponent",
            properties: { color: "Blue" },
            type: "unit",
            zone: "battleArea",
          },
        ],
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);
      const validTargets = enumerateValidTargets(state, targetingSpec, context);

      expect(validTargets).toHaveLength(1);
      expect(validTargets).toContain(GM);
    });
  });
});

describe("dynamic game state changes", () => {
  it("should update valid targets when cards move zones", () => {
    const state = createGameState({
      player1Cards: { battleArea: [RX78], hand: [ZAKU] },
      player2Cards: { battleArea: [GM] },
    });

    const cardDefs = createCardDefinitions([
      { cardType: "UNIT", cost: 3, id: RX78, lv: 2, name: "RX-78-2 Gundam" },
      { cardType: "UNIT", cost: 2, id: ZAKU, lv: 1, name: "Zaku II" },
      { cardType: "UNIT", cost: 1, id: GM, lv: 1, name: "GM" },
    ]);

    const targetingSpec: TargetingSpec = {
      chooser: "controller",
      count: 1,
      timing: "on_resolution",
      validTargets: [
        {
          owner: "opponent",
          type: "unit",
          zone: "battleArea",
        },
      ],
    };

    const context = createContext(PLAYER_1, RX78, cardDefs);

    // Initially only GM is valid
    let validTargets = enumerateValidTargets(state, targetingSpec, context);
    expect(validTargets).toEqual([GM]);

    // Simulate ZAKU being played to battle area
    const updatedState = createGameState({
      player1Cards: { battleArea: [RX78], hand: [] },
      player2Cards: { battleArea: [GM, ZAKU] },
    });

    validTargets = enumerateValidTargets(updatedState, targetingSpec, context);
    expect(validTargets).toHaveLength(2);
    expect(validTargets).toContain(GM);
    expect(validTargets).toContain(ZAKU);
  });

  it("should update valid targets when card state changes", () => {
    const state = createGameState({
      cardPositions: {
        [RX78]: "active",
        [ZAKU]: "active",
        [GM]: "rested",
      },
      player1Cards: { battleArea: [RX78] },
      player2Cards: { battleArea: [ZAKU, GM] },
    });

    const cardDefs = createCardDefinitions([
      { cardType: "UNIT", cost: 3, id: RX78, lv: 2, name: "RX-78-2 Gundam" },
      { cardType: "UNIT", cost: 2, id: ZAKU, lv: 1, name: "Zaku II" },
      { cardType: "UNIT", cost: 1, id: GM, lv: 1, name: "GM" },
    ]);

    const targetingSpec: TargetingSpec = {
      chooser: "controller",
      count: 1,
      timing: "on_resolution",
      validTargets: [
        {
          owner: "opponent",
          state: { rested: false },
          type: "unit",
          zone: "battleArea",
        },
      ],
    };

    const context = createContext(PLAYER_1, RX78, cardDefs);

    // Only active units
    const validTargets = enumerateValidTargets(state, targetingSpec, context);
    expect(validTargets).toHaveLength(1);
    expect(validTargets).toContain(ZAKU);
    expect(validTargets).not.toContain(GM);
  });
});

describe("complex targeting scenarios", () => {
  describe("effect with multiple choice requirements", () => {
    it("should handle choose 2-3 different units", () => {
      const state = createGameState({
        player1Cards: { battleArea: [RX78, ZAKU, GM, DOM, GOUF] },
        player2Cards: { battleArea: [] },
      });

      const cardDefs = createCardDefinitions([
        { cardType: "UNIT", cost: 3, id: RX78, lv: 2, name: "RX-78-2 Gundam" },
        { cardType: "UNIT", cost: 2, id: ZAKU, lv: 1, name: "Zaku II" },
        { cardType: "UNIT", cost: 1, id: GM, lv: 1, name: "GM" },
        { cardType: "UNIT", cost: 3, id: DOM, lv: 2, name: "Dom" },
        { cardType: "UNIT", cost: 2, id: GOUF, lv: 2, name: "Gouf" },
      ]);

      const targetingSpec: TargetingSpec = {
        chooser: "controller",
        count: { max: 3, min: 2 },
        timing: "on_resolution",
        validTargets: [
          {
            owner: "self",
            type: "unit",
            zone: "battleArea",
          },
        ],
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);

      // Valid: 2 targets
      expect(validateTargets(state, targetingSpec, [RX78, ZAKU], context)).toBe(true);

      // Valid: 3 targets
      expect(validateTargets(state, targetingSpec, [RX78, ZAKU, GM], context)).toBe(true);

      // Invalid: 1 target (below min)
      expect(validateTargets(state, targetingSpec, [RX78], context)).toBe(false);

      // Invalid: 4 targets (above max)
      expect(validateTargets(state, targetingSpec, [RX78, ZAKU, GM, DOM], context)).toBe(false);
    });
  });

  describe("effect with no valid targets", () => {
    it("should handle fizzled effects gracefully", () => {
      const state = createGameState({
        player1Cards: { battleArea: [RX78] },
        player2Cards: { battleArea: [] },
      });

      const cardDefs = createCardDefinitions([
        { cardType: "UNIT", cost: 3, id: RX78, lv: 2, name: "RX-78-2 Gundam" },
      ]);

      const targetingSpec: TargetingSpec = {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [
          {
            owner: "opponent",
            type: "unit",
            zone: "battleArea",
          },
        ],
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);

      const validTargets = enumerateValidTargets(state, targetingSpec, context);
      expect(validTargets).toHaveLength(0);

      // Should not validate any choice
      expect(validateTargets(state, targetingSpec, [], context)).toBe(false);
    });
  });
});

describe("integration with effect resolution", () => {
  it("should provide targets for multi-action effects", () => {
    const state = createGameState({
      cardPositions: {
        [RX78]: "active",
        [ZAKU]: "active",
        [GM]: "active",
      },
      player1Cards: { battleArea: [RX78] },
      player2Cards: { battleArea: [ZAKU, GM] },
    });

    const cardDefs = createCardDefinitions([
      { cardType: "UNIT", cost: 3, id: RX78, lv: 2, name: "RX-78-2 Gundam" },
      { cardType: "UNIT", cost: 2, id: ZAKU, lv: 1, name: "Zaku II" },
      { cardType: "UNIT", cost: 1, id: GM, lv: 1, name: "GM" },
    ]);

    // Effect: Rest 1 target unit, then deal 2 damage to it
    const restTargeting: TargetingSpec = {
      chooser: "controller",
      count: 1,
      timing: "on_resolution",
      validTargets: [
        {
          owner: "opponent",
          state: { rested: false },
          type: "unit",
          zone: "battleArea",
        },
      ],
    };

    const context = createContext(PLAYER_1, RX78, cardDefs);
    const validTargets = enumerateValidTargets(state, restTargeting, context);

    expect(validTargets).toHaveLength(2);

    // Player chooses ZAKU
    const chosenTarget = ZAKU;
    expect(validateTargets(state, restTargeting, [chosenTarget], context)).toBe(true);

    // After resting, the target would still be valid for damage effect
    // (This simulates the flow of effect resolution)
  });
});
