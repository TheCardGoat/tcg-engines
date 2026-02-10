/**
 * Integration tests for the targeting system
 * Tests targeting with actual effect definitions and game state
 */

import { describe, expect, it } from "bun:test";
import { createCardId, createPlayerId } from "@tcg/core";
import type { GundamGameState } from "../../types";
import type {
  BaseEffectCardDefinition,
  TargetingSpec,
} from "../../types/effects";
import {
  enumerateValidTargets,
  type TargetingContext,
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
  const player1 = "player-1" as const;
  const player2 = "player-2" as const;

  return {
    players: [player1, player2],
    currentPlayer: player1,
    turn: 2,
    phase: "main",
    zones: {
      deck: {
        [player1]: {
          config: {
            id: "deck-p1",
            name: "Deck",
            visibility: "secret" as const,
            ordered: true,
            owner: player1,
            faceDown: true,
            maxSize: 50,
          },
          cards: config.player1Cards?.deck ?? [],
        },
        [player2]: {
          config: {
            id: "deck-p2",
            name: "Deck",
            visibility: "secret" as const,
            ordered: true,
            owner: player2,
            faceDown: true,
            maxSize: 50,
          },
          cards: config.player2Cards?.deck ?? [],
        },
      },
      resourceDeck: {
        [player1]: {
          config: {
            id: "res-deck-p1",
            name: "Resource Deck",
            visibility: "secret" as const,
            ordered: true,
            owner: player1,
            faceDown: true,
            maxSize: 10,
          },
          cards: [],
        },
        [player2]: {
          config: {
            id: "res-deck-p2",
            name: "Resource Deck",
            visibility: "secret" as const,
            ordered: true,
            owner: player2,
            faceDown: true,
            maxSize: 10,
          },
          cards: [],
        },
      },
      hand: {
        [player1]: {
          config: {
            id: "hand-p1",
            name: "Hand",
            visibility: "private" as const,
            ordered: false,
            owner: player1,
            maxSize: 10,
          },
          cards: config.player1Cards?.hand ?? [],
        },
        [player2]: {
          config: {
            id: "hand-p2",
            name: "Hand",
            visibility: "private" as const,
            ordered: false,
            owner: player2,
            maxSize: 10,
          },
          cards: config.player2Cards?.hand ?? [],
        },
      },
      battleArea: {
        [player1]: {
          config: {
            id: "ba-p1",
            name: "Battle Area",
            visibility: "public" as const,
            ordered: true,
            owner: player1,
            maxSize: 6,
          },
          cards: config.player1Cards?.battleArea ?? [],
        },
        [player2]: {
          config: {
            id: "ba-p2",
            name: "Battle Area",
            visibility: "public" as const,
            ordered: true,
            owner: player2,
            maxSize: 6,
          },
          cards: config.player2Cards?.battleArea ?? [],
        },
      },
      shieldSection: {
        [player1]: {
          config: {
            id: "shield-p1",
            name: "Shield Section",
            visibility: "secret" as const,
            ordered: true,
            owner: player1,
            faceDown: true,
            maxSize: 6,
          },
          cards: [],
        },
        [player2]: {
          config: {
            id: "shield-p2",
            name: "Shield Section",
            visibility: "secret" as const,
            ordered: true,
            owner: player2,
            faceDown: true,
            maxSize: 6,
          },
          cards: [],
        },
      },
      baseSection: {
        [player1]: {
          config: {
            id: "base-p1",
            name: "Base Section",
            visibility: "public" as const,
            ordered: false,
            owner: player1,
            maxSize: 1,
          },
          cards: [],
        },
        [player2]: {
          config: {
            id: "base-p2",
            name: "Base Section",
            visibility: "public" as const,
            ordered: false,
            owner: player2,
            maxSize: 1,
          },
          cards: [],
        },
      },
      resourceArea: {
        [player1]: {
          config: {
            id: "res-area-p1",
            name: "Resource Area",
            visibility: "public" as const,
            ordered: false,
            owner: player1,
            maxSize: 15,
          },
          cards: [],
        },
        [player2]: {
          config: {
            id: "res-area-p2",
            name: "Resource Area",
            visibility: "public" as const,
            ordered: false,
            owner: player2,
            maxSize: 15,
          },
          cards: [],
        },
      },
      trash: {
        [player1]: {
          config: {
            id: "trash-p1",
            name: "Trash",
            visibility: "public" as const,
            ordered: true,
            owner: player1,
            maxSize: 0,
          },
          cards: [],
        },
        [player2]: {
          config: {
            id: "trash-p2",
            name: "Trash",
            visibility: "public" as const,
            ordered: true,
            owner: player2,
            maxSize: 0,
          },
          cards: [],
        },
      },
      removal: {
        [player1]: {
          config: {
            id: "removal-p1",
            name: "Removal",
            visibility: "public" as const,
            ordered: false,
            owner: player1,
            maxSize: 0,
          },
          cards: [],
        },
        [player2]: {
          config: {
            id: "removal-p2",
            name: "Removal",
            visibility: "public" as const,
            ordered: false,
            owner: player2,
            maxSize: 0,
          },
          cards: [],
        },
      },
    },
    gundam: {
      activeResources: { [player1]: 3, [player2]: 2 },
      cardPositions: config.cardPositions ?? {},
      attackedThisTurn: [],
      hasPlayedResourceThisTurn: { [player1]: true, [player2]: false },
      effectStack: {
        stack: [],
        nextInstanceId: 0,
      },
      temporaryModifiers:
        config.temporaryModifiers ??
        ({} as GundamGameState["gundam"]["temporaryModifiers"]),
    },
  };
}

// Helper to create card definitions
function createCardDefinitions(
  cards: Array<{
    id: string;
    name: string;
    cardType: "UNIT" | "COMMAND" | "BASE";
    cost: number;
    lv: number;
    color?: string;
    traits?: string[];
  }>,
): Record<string, BaseEffectCardDefinition> {
  const result: Record<string, BaseEffectCardDefinition> = {};

  for (const card of cards) {
    result[card.id] = {
      id: card.id,
      name: card.name,
      cardType: card.cardType,
      cost: card.cost,
      lv: card.lv,
      text: "",
      effects: [],
      ...(card.color ? { color: card.color as const } : {}),
      ...(card.traits ? { traits: card.traits } : {}),
    };
  }

  return result;
}

// Helper to create targeting context
function createContext(
  controllerId: string,
  sourceCardId: string,
  cardDefinitions: Record<string, BaseEffectCardDefinition>,
): TargetingContext {
  return {
    controllerId,
    sourceCardId,
    cardDefinitions,
  };
}

const PLAYER_1 = "player-1" as const;
const PLAYER_2 = "player-2" as const;

// Sample cards
const RX78 = "rx-78-2" as const;
const ZAKU = "zaku-ii" as const;
const GM = "gm" as const;
const DOM = "dom" as const;
const GOUF = "gouf" as const;

describe("targeting integration with actual effect definitions", () => {
  describe("destroy effect - destroy unit with cost 2 or less", () => {
    it("should find valid targets for destroy effect", () => {
      const state = createGameState({
        player1Cards: { battleArea: [RX78] },
        player2Cards: { battleArea: [ZAKU, GM, DOM] },
      });

      const cardDefs = createCardDefinitions([
        { id: RX78, name: "RX-78-2 Gundam", cardType: "UNIT", cost: 3, lv: 2 },
        { id: ZAKU, name: "Zaku II", cardType: "UNIT", cost: 2, lv: 1 },
        { id: GM, name: "GM", cardType: "UNIT", cost: 1, lv: 1 },
        { id: DOM, name: "Dom", cardType: "UNIT", cost: 3, lv: 2 },
      ]);

      const targetingSpec: TargetingSpec = {
        count: 1,
        validTargets: [
          {
            type: "unit",
            owner: "opponent",
            zone: "battleArea",
            properties: { cost: { max: 2 } },
          },
        ],
        chooser: "controller",
        timing: "on_resolution",
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
        { id: RX78, name: "RX-78-2 Gundam", cardType: "UNIT", cost: 3, lv: 2 },
        { id: ZAKU, name: "Zaku II", cardType: "UNIT", cost: 2, lv: 1 },
        { id: GM, name: "GM", cardType: "UNIT", cost: 1, lv: 1 },
        { id: DOM, name: "Dom", cardType: "UNIT", cost: 3, lv: 2 },
      ]);

      const targetingSpec: TargetingSpec = {
        count: 1,
        validTargets: [
          {
            type: "unit",
            owner: "opponent",
            zone: "battleArea",
            properties: { cost: { max: 2 } },
          },
        ],
        chooser: "controller",
        timing: "on_resolution",
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);

      // Valid choice
      expect(validateTargets(state, targetingSpec, [ZAKU], context)).toBe(true);
      expect(validateTargets(state, targetingSpec, [GM], context)).toBe(true);

      // Invalid: cost too high
      expect(validateTargets(state, targetingSpec, [DOM], context)).toBe(false);

      // Invalid: wrong count
      expect(validateTargets(state, targetingSpec, [ZAKU, GM], context)).toBe(
        false,
      );

      // Invalid: own card
      expect(validateTargets(state, targetingSpec, [RX78], context)).toBe(
        false,
      );
    });
  });

  describe("rest effect - rest up to 2 units", () => {
    it("should find valid targets for rest effect", () => {
      const state = createGameState({
        player1Cards: { battleArea: [RX78, ZAKU, GM] },
        player2Cards: { battleArea: [DOM] },
        cardPositions: {
          [RX78]: "active",
          [ZAKU]: "active",
          [GM]: "rested",
          [DOM]: "active",
        },
      });

      const cardDefs = createCardDefinitions([
        { id: RX78, name: "RX-78-2 Gundam", cardType: "UNIT", cost: 3, lv: 2 },
        { id: ZAKU, name: "Zaku II", cardType: "UNIT", cost: 2, lv: 1 },
        { id: GM, name: "GM", cardType: "UNIT", cost: 1, lv: 1 },
        { id: DOM, name: "Dom", cardType: "UNIT", cost: 3, lv: 2 },
      ]);

      const targetingSpec: TargetingSpec = {
        count: { min: 0, max: 2 },
        validTargets: [
          {
            type: "unit",
            owner: "opponent",
            zone: "battleArea",
            state: { rested: false },
          },
        ],
        chooser: "controller",
        timing: "on_resolution",
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);
      const validTargets = enumerateValidTargets(state, targetingSpec, context);

      // Only opponent's active units
      expect(validTargets).toHaveLength(1);
      expect(validTargets).toContain(DOM);
    });

    it("should validate optional targets", () => {
      const state = createGameState({
        player1Cards: { battleArea: [RX78] },
        player2Cards: { battleArea: [ZAKU] },
        cardPositions: {
          [RX78]: "active",
          [ZAKU]: "active",
        },
      });

      const cardDefs = createCardDefinitions([
        { id: RX78, name: "RX-78-2 Gundam", cardType: "UNIT", cost: 3, lv: 2 },
        { id: ZAKU, name: "Zaku II", cardType: "UNIT", cost: 2, lv: 1 },
      ]);

      const targetingSpec: TargetingSpec = {
        count: { min: 0, max: 1 },
        validTargets: [
          {
            type: "unit",
            owner: "opponent",
            zone: "battleArea",
          },
        ],
        chooser: "controller",
        timing: "on_resolution",
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);

      // Can choose 0 targets (optional)
      expect(validateTargets(state, targetingSpec, [], context)).toBe(true);

      // Can choose 1 target
      expect(validateTargets(state, targetingSpec, [ZAKU], context)).toBe(true);

      // Cannot choose more than max
      expect(validateTargets(state, targetingSpec, [ZAKU, RX78], context)).toBe(
        false,
      );
    });
  });

  describe("multiple filter effects - choose unit OR command", () => {
    it("should combine targets from multiple filters", () => {
      const state = createGameState({
        player1Cards: { battleArea: [RX78], hand: [GOUF] },
        player2Cards: { battleArea: [ZAKU], hand: [] },
      });

      const cardDefs = createCardDefinitions([
        { id: RX78, name: "RX-78-2 Gundam", cardType: "UNIT", cost: 3, lv: 2 },
        { id: ZAKU, name: "Zaku II", cardType: "UNIT", cost: 2, lv: 1 },
        { id: GOUF, name: "Gouf", cardType: "COMMAND", cost: 2, lv: 1 },
      ]);

      const targetingSpec: TargetingSpec = {
        count: 1,
        validTargets: [
          {
            type: "unit",
            owner: "any",
            zone: "battleArea",
          },
          {
            type: "card",
            owner: "self",
            zone: "hand",
            properties: { cardType: "COMMAND" },
          },
        ],
        chooser: "controller",
        timing: "on_resolution",
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
          id: RX78,
          name: "RX-78-2 Gundam",
          cardType: "UNIT",
          cost: 3,
          lv: 2,
          traits: ["E.F.S.F", "Mobile Suit"],
        },
        {
          id: ZAKU,
          name: "Zaku II",
          cardType: "UNIT",
          cost: 2,
          lv: 1,
          traits: ["Zeon", "Mobile Suit"],
        },
        {
          id: GM,
          name: "GM",
          cardType: "UNIT",
          cost: 1,
          lv: 1,
          traits: ["E.F.S.F", "Mobile Suit"],
        },
        {
          id: DOM,
          name: "Dom",
          cardType: "UNIT",
          cost: 3,
          lv: 2,
          traits: ["Zeon", "Mobile Suit"],
        },
      ]);

      const targetingSpec: TargetingSpec = {
        count: 1,
        validTargets: [
          {
            type: "unit",
            owner: "opponent",
            zone: "battleArea",
            properties: { trait: ["Zeon"] },
          },
        ],
        chooser: "controller",
        timing: "on_resolution",
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
          id: RX78,
          name: "RX-78-2 Gundam",
          cardType: "UNIT",
          cost: 3,
          lv: 2,
          color: "Blue",
        },
        {
          id: ZAKU,
          name: "Zaku II",
          cardType: "UNIT",
          cost: 2,
          lv: 1,
          color: "Red",
        },
        { id: GM, name: "GM", cardType: "UNIT", cost: 1, lv: 1, color: "Blue" },
      ]);

      const targetingSpec: TargetingSpec = {
        count: 1,
        validTargets: [
          {
            type: "unit",
            owner: "opponent",
            zone: "battleArea",
            properties: { color: "Blue" },
          },
        ],
        chooser: "controller",
        timing: "on_resolution",
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
      { id: RX78, name: "RX-78-2 Gundam", cardType: "UNIT", cost: 3, lv: 2 },
      { id: ZAKU, name: "Zaku II", cardType: "UNIT", cost: 2, lv: 1 },
      { id: GM, name: "GM", cardType: "UNIT", cost: 1, lv: 1 },
    ]);

    const targetingSpec: TargetingSpec = {
      count: 1,
      validTargets: [
        {
          type: "unit",
          owner: "opponent",
          zone: "battleArea",
        },
      ],
      chooser: "controller",
      timing: "on_resolution",
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
      player1Cards: { battleArea: [RX78] },
      player2Cards: { battleArea: [ZAKU, GM] },
      cardPositions: {
        [RX78]: "active",
        [ZAKU]: "active",
        [GM]: "rested",
      },
    });

    const cardDefs = createCardDefinitions([
      { id: RX78, name: "RX-78-2 Gundam", cardType: "UNIT", cost: 3, lv: 2 },
      { id: ZAKU, name: "Zaku II", cardType: "UNIT", cost: 2, lv: 1 },
      { id: GM, name: "GM", cardType: "UNIT", cost: 1, lv: 1 },
    ]);

    const targetingSpec: TargetingSpec = {
      count: 1,
      validTargets: [
        {
          type: "unit",
          owner: "opponent",
          zone: "battleArea",
          state: { rested: false },
        },
      ],
      chooser: "controller",
      timing: "on_resolution",
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
        { id: RX78, name: "RX-78-2 Gundam", cardType: "UNIT", cost: 3, lv: 2 },
        { id: ZAKU, name: "Zaku II", cardType: "UNIT", cost: 2, lv: 1 },
        { id: GM, name: "GM", cardType: "UNIT", cost: 1, lv: 1 },
        { id: DOM, name: "Dom", cardType: "UNIT", cost: 3, lv: 2 },
        { id: GOUF, name: "Gouf", cardType: "UNIT", cost: 2, lv: 2 },
      ]);

      const targetingSpec: TargetingSpec = {
        count: { min: 2, max: 3 },
        validTargets: [
          {
            type: "unit",
            owner: "self",
            zone: "battleArea",
          },
        ],
        chooser: "controller",
        timing: "on_resolution",
      };

      const context = createContext(PLAYER_1, RX78, cardDefs);

      // Valid: 2 targets
      expect(validateTargets(state, targetingSpec, [RX78, ZAKU], context)).toBe(
        true,
      );

      // Valid: 3 targets
      expect(
        validateTargets(state, targetingSpec, [RX78, ZAKU, GM], context),
      ).toBe(true);

      // Invalid: 1 target (below min)
      expect(validateTargets(state, targetingSpec, [RX78], context)).toBe(
        false,
      );

      // Invalid: 4 targets (above max)
      expect(
        validateTargets(state, targetingSpec, [RX78, ZAKU, GM, DOM], context),
      ).toBe(false);
    });
  });

  describe("effect with no valid targets", () => {
    it("should handle fizzled effects gracefully", () => {
      const state = createGameState({
        player1Cards: { battleArea: [RX78] },
        player2Cards: { battleArea: [] },
      });

      const cardDefs = createCardDefinitions([
        { id: RX78, name: "RX-78-2 Gundam", cardType: "UNIT", cost: 3, lv: 2 },
      ]);

      const targetingSpec: TargetingSpec = {
        count: 1,
        validTargets: [
          {
            type: "unit",
            owner: "opponent",
            zone: "battleArea",
          },
        ],
        chooser: "controller",
        timing: "on_resolution",
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
      player1Cards: { battleArea: [RX78] },
      player2Cards: { battleArea: [ZAKU, GM] },
      cardPositions: {
        [RX78]: "active",
        [ZAKU]: "active",
        [GM]: "active",
      },
    });

    const cardDefs = createCardDefinitions([
      { id: RX78, name: "RX-78-2 Gundam", cardType: "UNIT", cost: 3, lv: 2 },
      { id: ZAKU, name: "Zaku II", cardType: "UNIT", cost: 2, lv: 1 },
      { id: GM, name: "GM", cardType: "UNIT", cost: 1, lv: 1 },
    ]);

    // Effect: Rest 1 target unit, then deal 2 damage to it
    const restTargeting: TargetingSpec = {
      count: 1,
      validTargets: [
        {
          type: "unit",
          owner: "opponent",
          zone: "battleArea",
          state: { rested: false },
        },
      ],
      chooser: "controller",
      timing: "on_resolution",
    };

    const context = createContext(PLAYER_1, RX78, cardDefs);
    const validTargets = enumerateValidTargets(state, restTargeting, context);

    expect(validTargets).toHaveLength(2);

    // Player chooses ZAKU
    const chosenTarget = ZAKU;
    expect(validateTargets(state, restTargeting, [chosenTarget], context)).toBe(
      true,
    );

    // After resting, the target would still be valid for damage effect
    // (This simulates the flow of effect resolution)
  });
});
