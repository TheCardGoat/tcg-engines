/**
 * Trigger Detection System Tests
 *
 * Tests for the trigger detection module that detects triggered effects
 * from game events (Deploy, Attack, Destroyed, Start/End of Turn).
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId } from "@tcg/core";
import type { GundamGameState } from "../../types";
import type { EffectDefinition, EffectTiming } from "../../types/effects";
import {
  clearCardDefinitions,
  registerCardDefinition,
} from "../action-handlers";
import {
  type AttackTriggerEvent,
  type DeployTriggerEvent,
  type DestroyedTriggerEvent,
  detectAttackTriggers,
  detectDeployTriggers,
  detectDestroyedTriggers,
  detectEndOfTurnTriggers,
  detectStartOfTurnTriggers,
  detectTriggeredEffects,
  type EndOfTurnTriggerEvent,
  orderTriggeredEffects,
  type StartOfTurnTriggerEvent,
  type TriggerEvent,
  type TriggeredEffectRef,
} from "../trigger-detection";

// Helper function to create a mock card definition with effects
function createMockCardDefinition(
  cardId: CardId,
  effects: EffectDefinition[],
): EffectDefinition {
  const def: EffectDefinition = {
    id: `effect-${cardId}`,
    category: "triggered",
    timing: { type: "DEPLOY" },
    actions: [],
    text: "Mock effect",
  };
  return def;
}

// Helper to create a minimal game state
function createMockGameState(players: PlayerId[]): GundamGameState {
  return {
    players,
    currentPlayer: players[0]!,
    phase: "main",
    turn: 1,
    zones: {
      deck: {},
      resourceDeck: {},
      hand: {},
      battleArea: {},
      shieldSection: {},
      baseSection: {},
      resourceArea: {},
      trash: {},
      removal: {},
      limbo: {},
    },
    gundam: {
      cardPositions: {},
      cardDamage: {},
      activeResources: {},
      attackedThisTurn: [],
      effectStack: {
        stack: [],
        nextInstanceId: 0,
      },
      temporaryModifiers: {},
      revealedCards: [],
      hasPlayedResourceThisTurn: {},
    },
  } as GundamGameState;
}

// Helper to setup zones for a player
function setupPlayerZones(
  state: GundamGameState,
  playerId: PlayerId,
  cardIds: CardId[],
): void {
  state.zones.battleArea[playerId] = {
    cards: [...cardIds],
    config: { owner: playerId } as any,
  };

  // Set all cards to active position
  for (const cardId of cardIds) {
    state.gundam.cardPositions[cardId] = "active";
  }
}

describe("Trigger Detection", () => {
  beforeEach(() => {
    // Clear card definitions before each test
    clearCardDefinitions();
  });

  afterEach(() => {
    // Clean up after each test
    clearCardDefinitions();
  });

  describe("detectTriggeredEffects", () => {
    it("should detect deploy triggers", () => {
      const player1 = "player_one" as PlayerId;
      const player2 = "player_two" as PlayerId;
      const state = createMockGameState([player1, player2]);

      const cardId = "unit-001" as CardId;
      setupPlayerZones(state, player1, [cardId]);

      // Register card with deploy effect
      const deployEffect: EffectDefinition = {
        id: "deploy-effect",
        category: "triggered",
        timing: { type: "DEPLOY" },
        actions: [{ type: "DRAW", count: 1, player: "self" }],
        text: "When this unit deploys, draw 1 card",
      };
      registerCardDefinition(cardId, {
        id: cardId,
        name: "Test Unit",
        cardType: "UNIT",
        cost: 1,
        level: 1,
        effects: [deployEffect],
      });

      const event: DeployTriggerEvent = {
        type: "DEPLOY",
        playerId: player1,
        cardId,
      };

      const result = detectTriggeredEffects(state, event);

      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(1);
      expect(result.effects[0]?.sourceCardId).toBe(cardId);
    });

    it("should detect attack triggers", () => {
      const player1 = "player_one" as PlayerId;
      const state = createMockGameState([player1]);

      const attackerId = "unit-001" as CardId;
      setupPlayerZones(state, player1, [attackerId]);

      // Register card with attack effect
      const attackEffect: EffectDefinition = {
        id: "attack-effect",
        category: "triggered",
        timing: { type: "ATTACK" },
        actions: [{ type: "DRAW", count: 1, player: "self" }],
        text: "When this unit attacks, draw 1 card",
      };
      registerCardDefinition(attackerId, {
        id: attackerId,
        name: "Test Unit",
        cardType: "UNIT",
        cost: 1,
        level: 1,
        effects: [attackEffect],
      });

      const event: AttackTriggerEvent = {
        type: "ATTACK",
        playerId: player1,
        attackerId,
        targetId: undefined,
      };

      const result = detectTriggeredEffects(state, event);

      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(1);
      expect(result.effects[0]?.sourceCardId).toBe(attackerId);
    });

    it("should detect destroyed triggers", () => {
      const player1 = "player_one" as PlayerId;
      const state = createMockGameState([player1]);

      const cardId = "unit-001" as CardId;
      setupPlayerZones(state, player1, [cardId]);

      // Register card with destroyed effect
      const destroyedEffect: EffectDefinition = {
        id: "destroyed-effect",
        category: "triggered",
        timing: { type: "DESTROYED" },
        actions: [{ type: "DRAW", count: 1, player: "self" }],
        text: "When this unit is destroyed, draw 1 card",
      };
      registerCardDefinition(cardId, {
        id: cardId,
        name: "Test Unit",
        cardType: "UNIT",
        cost: 1,
        level: 1,
        effects: [destroyedEffect],
      });

      const event: DestroyedTriggerEvent = {
        type: "DESTROYED",
        playerId: player1,
        cardId,
      };

      const result = detectTriggeredEffects(state, event);

      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(1);
      expect(result.effects[0]?.sourceCardId).toBe(cardId);
    });

    it("should detect start of turn triggers", () => {
      const player1 = "player_one" as PlayerId;
      const state = createMockGameState([player1]);

      const cardId = "unit-001" as CardId;
      setupPlayerZones(state, player1, [cardId]);

      // Register card with start of turn effect
      const startTurnEffect: EffectDefinition = {
        id: "start-turn-effect",
        category: "triggered",
        timing: { type: "START_OF_TURN" },
        actions: [{ type: "DRAW", count: 1, player: "self" }],
        text: "At start of your turn, draw 1 card",
      };
      registerCardDefinition(cardId, {
        id: cardId,
        name: "Test Unit",
        cardType: "UNIT",
        cost: 1,
        level: 1,
        effects: [startTurnEffect],
      });

      const event: StartOfTurnTriggerEvent = {
        type: "START_OF_TURN",
        playerId: player1,
      };

      const result = detectTriggeredEffects(state, event);

      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(1);
      expect(result.effects[0]?.sourceCardId).toBe(cardId);
    });

    it("should detect end of turn triggers", () => {
      const player1 = "player_one" as PlayerId;
      const state = createMockGameState([player1]);

      const cardId = "unit-001" as CardId;
      setupPlayerZones(state, player1, [cardId]);

      // Register card with end of turn effect
      const endTurnEffect: EffectDefinition = {
        id: "end-turn-effect",
        category: "triggered",
        timing: { type: "END_OF_TURN" },
        actions: [{ type: "DRAW", count: 1, player: "self" }],
        text: "At end of turn, draw 1 card",
      };
      registerCardDefinition(cardId, {
        id: cardId,
        name: "Test Unit",
        cardType: "UNIT",
        cost: 1,
        level: 1,
        effects: [endTurnEffect],
      });

      const event: EndOfTurnTriggerEvent = {
        type: "END_OF_TURN",
        playerId: player1,
      };

      const result = detectTriggeredEffects(state, event);

      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(1);
      expect(result.effects[0]?.sourceCardId).toBe(cardId);
    });
  });

  describe("detectDeployTriggers", () => {
    it("should detect deploy triggers from all cards in play", () => {
      const player1 = "player_one" as PlayerId;
      const player2 = "player_two" as PlayerId;
      const state = createMockGameState([player1, player2]);

      const card1 = "unit-001" as CardId;
      const card2 = "unit-002" as CardId;
      setupPlayerZones(state, player1, [card1]);
      setupPlayerZones(state, player2, [card2]);

      // Register both cards with deploy effects
      for (const [id, owner] of [
        [card1, player1],
        [card2, player2],
      ] as const) {
        const effect: EffectDefinition = {
          id: `deploy-effect-${id}`,
          category: "triggered",
          timing: { type: "DEPLOY" },
          actions: [],
          text: "Deploy effect",
        };
        registerCardDefinition(id, {
          id,
          name: `Unit ${id}`,
          cardType: "UNIT",
          cost: 1,
          level: 1,
          effects: [effect],
        });
      }

      const result = detectDeployTriggers(state, card1, player1);

      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(2);
    });

    it("should return empty result when no deploy triggers exist", () => {
      const player1 = "player_one" as PlayerId;
      const state = createMockGameState([player1]);

      const cardId = "unit-001" as CardId;
      setupPlayerZones(state, player1, [cardId]);

      // Register card without deploy effect
      const attackEffect: EffectDefinition = {
        id: "attack-effect",
        category: "triggered",
        timing: { type: "ATTACK" },
        actions: [],
        text: "Attack effect",
      };
      registerCardDefinition(cardId, {
        id: cardId,
        name: "Test Unit",
        cardType: "UNIT",
        cost: 1,
        level: 1,
        effects: [attackEffect],
      });

      const result = detectDeployTriggers(state, cardId, player1);

      expect(result.hasTriggers).toBe(false);
      expect(result.effects).toHaveLength(0);
    });
  });

  describe("detectAttackTriggers", () => {
    it("should detect attack triggers from all cards in play", () => {
      const player1 = "player_one" as PlayerId;
      const state = createMockGameState([player1]);

      const attackerId = "unit-001" as CardId;
      const otherUnitId = "unit-002" as CardId;
      setupPlayerZones(state, player1, [attackerId, otherUnitId]);

      // Register both cards with attack effects
      for (const id of [attackerId, otherUnitId]) {
        const effect: EffectDefinition = {
          id: `attack-effect-${id}`,
          category: "triggered",
          timing: { type: "ATTACK" },
          actions: [],
          text: "Attack effect",
        };
        registerCardDefinition(id, {
          id,
          name: `Unit ${id}`,
          cardType: "UNIT",
          cost: 1,
          level: 1,
          effects: [effect],
        });
      }

      const result = detectAttackTriggers(
        state,
        attackerId,
        undefined,
        player1,
      );

      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(2);
    });
  });

  describe("detectDestroyedTriggers", () => {
    it("should detect destroyed triggers from all cards in play", () => {
      const player1 = "player_one" as PlayerId;
      const state = createMockGameState([player1]);

      const destroyedId = "unit-001" as CardId;
      const otherUnitId = "unit-002" as CardId;
      setupPlayerZones(state, player1, [destroyedId, otherUnitId]);

      // Register both cards with destroyed effects
      for (const id of [destroyedId, otherUnitId]) {
        const effect: EffectDefinition = {
          id: `destroyed-effect-${id}`,
          category: "triggered",
          timing: { type: "DESTROYED" },
          actions: [],
          text: "Destroyed effect",
        };
        registerCardDefinition(id, {
          id,
          name: `Unit ${id}`,
          cardType: "UNIT",
          cost: 1,
          level: 1,
          effects: [effect],
        });
      }

      const result = detectDestroyedTriggers(state, destroyedId, player1);

      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(2);
    });
  });

  describe("detectStartOfTurnTriggers", () => {
    it("should detect start of turn triggers for current player only", () => {
      const player1 = "player_one" as PlayerId;
      const player2 = "player_two" as PlayerId;
      const state = createMockGameState([player1, player2]);

      const card1 = "unit-001" as CardId;
      const card2 = "unit-002" as CardId;
      setupPlayerZones(state, player1, [card1]);
      setupPlayerZones(state, player2, [card2]);

      // Register both cards with start of turn effects
      for (const id of [card1, card2]) {
        const effect: EffectDefinition = {
          id: `start-turn-effect-${id}`,
          category: "triggered",
          timing: { type: "START_OF_TURN" },
          actions: [],
          text: "Start of turn effect",
        };
        registerCardDefinition(id, {
          id,
          name: `Unit ${id}`,
          cardType: "UNIT",
          cost: 1,
          level: 1,
          effects: [effect],
        });
      }

      // Only player1's turn
      const result = detectStartOfTurnTriggers(state, player1);

      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(1);
      expect(result.effects[0]?.sourceCardId).toBe(card1);
    });
  });

  describe("detectEndOfTurnTriggers", () => {
    it("should detect end of turn triggers from all players", () => {
      const player1 = "player_one" as PlayerId;
      const player2 = "player_two" as PlayerId;
      const state = createMockGameState([player1, player2]);

      const card1 = "unit-001" as CardId;
      const card2 = "unit-002" as CardId;
      setupPlayerZones(state, player1, [card1]);
      setupPlayerZones(state, player2, [card2]);

      // Register both cards with end of turn effects
      for (const id of [card1, card2]) {
        const effect: EffectDefinition = {
          id: `end-turn-effect-${id}`,
          category: "triggered",
          timing: { type: "END_OF_TURN" },
          actions: [],
          text: "End of turn effect",
        };
        registerCardDefinition(id, {
          id,
          name: `Unit ${id}`,
          cardType: "UNIT",
          cost: 1,
          level: 1,
          effects: [effect],
        });
      }

      // Player1's turn is ending
      const result = detectEndOfTurnTriggers(state, player1);

      expect(result.hasTriggers).toBe(true);
      // Both players' end of turn effects trigger
      expect(result.effects).toHaveLength(2);
    });
  });

  describe("orderTriggeredEffects", () => {
    it("should order active player effects first", () => {
      const player1 = "player_one" as PlayerId;
      const player2 = "player_two" as PlayerId;

      const effects: TriggeredEffectRef[] = [
        {
          sourceCardId: "card-1" as CardId,
          effectRef: { effectId: "effect-1" },
          controllerId: player1,
        },
        {
          sourceCardId: "card-2" as CardId,
          effectRef: { effectId: "effect-2" },
          controllerId: player2,
        },
        {
          sourceCardId: "card-3" as CardId,
          effectRef: { effectId: "effect-3" },
          controllerId: player1,
        },
        {
          sourceCardId: "card-4" as CardId,
          effectRef: { effectId: "effect-4" },
          controllerId: player2,
        },
      ];

      const result = orderTriggeredEffects(effects, player1);

      // Active player effects (indices 0, 2) should come first
      expect(result.activePlayerEffects).toEqual([0, 2]);
      expect(result.opponentEffects).toEqual([1, 3]);
      expect(result.order).toEqual([0, 2, 1, 3]);
    });

    it("should handle all effects belonging to active player", () => {
      const player1 = "player_one" as PlayerId;

      const effects: TriggeredEffectRef[] = [
        {
          sourceCardId: "card-1" as CardId,
          effectRef: { effectId: "effect-1" },
          controllerId: player1,
        },
        {
          sourceCardId: "card-2" as CardId,
          effectRef: { effectId: "effect-2" },
          controllerId: player1,
        },
        {
          sourceCardId: "card-3" as CardId,
          effectRef: { effectId: "effect-3" },
          controllerId: player1,
        },
      ];

      const result = orderTriggeredEffects(effects, player1);

      expect(result.activePlayerEffects).toEqual([0, 1, 2]);
      expect(result.opponentEffects).toEqual([]);
      expect(result.order).toEqual([0, 1, 2]);
    });

    it("should handle all effects belonging to opponent", () => {
      const player1 = "player_one" as PlayerId;
      const player2 = "player_two" as PlayerId;

      const effects: TriggeredEffectRef[] = [
        {
          sourceCardId: "card-1" as CardId,
          effectRef: { effectId: "effect-1" },
          controllerId: player2,
        },
        {
          sourceCardId: "card-2" as CardId,
          effectRef: { effectId: "effect-2" },
          controllerId: player2,
        },
      ];

      const result = orderTriggeredEffects(effects, player1);

      expect(result.activePlayerEffects).toEqual([]);
      expect(result.opponentEffects).toEqual([0, 1]);
      expect(result.order).toEqual([0, 1]);
    });

    it("should handle empty effects array", () => {
      const player1 = "player_one" as PlayerId;
      const effects: TriggeredEffectRef[] = [];

      const result = orderTriggeredEffects(effects, player1);

      expect(result.activePlayerEffects).toEqual([]);
      expect(result.opponentEffects).toEqual([]);
      expect(result.order).toEqual([]);
    });
  });
});
