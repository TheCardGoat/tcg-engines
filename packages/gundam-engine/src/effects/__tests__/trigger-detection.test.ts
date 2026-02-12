/**
 * Trigger Detection System Tests
 *
 * Tests for the trigger detection module that detects triggered effects
 * from game events (Deploy, Attack, Destroyed, Start/End of Turn).
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId } from "@tcg/core";
import type { Effect, EffectTiming } from "@tcg/gundam-types/effects";
import type { GundamGameState } from "../../types";
import {
  clearCardDefinitions,
  registerCardDefinition,
} from "../action-handlers";
import {
  type AttackTriggerEvent,
  type DeployTriggerEvent,
  type DestroyedTriggerEvent,
  type EndOfTurnTriggerEvent,
  type StartOfTurnTriggerEvent,
  type TriggerEvent,
  type TriggeredEffectRef,
  detectAttackTriggers,
  detectDeployTriggers,
  detectDestroyedTriggers,
  detectEndOfTurnTriggers,
  detectStartOfTurnTriggers,
  detectTriggeredEffects,
  orderTriggeredEffects,
} from "../trigger-detection";

// Helper function to create a mock card definition with effects
function createMockCardDefinition(cardId: CardId, effects: Effect[]): Effect {
  const def: Effect = {
    actions: [],
    category: "triggered",
    category: "triggered",
    id: `effect-${cardId}`,
    id: `effect-${cardId}`,
    text: "Mock effect",
    timing: { type: "DEPLOY" },
    timing: { type: "DEPLOY" },
  };
  return def;
}

// Helper to create a minimal game state
function createMockGameState(players: PlayerId[]): GundamGameState {
  return {
    currentPlayer: players[0]!,
    gundam: {
      activeResources: {},
      attackedThisTurn: [],
      cardDamage: {},
      cardPositions: {},
      effectStack: {
        nextInstanceId: 0,
        stack: [],
      },
      hasPlayedResourceThisTurn: {},
      revealedCards: [],
      temporaryModifiers: {},
    },
    phase: "main",
    players,
    turn: 1,
    zones: {
      baseSection: {},
      battleArea: {},
      deck: {},
      hand: {},
      limbo: {},
      removal: {},
      resourceArea: {},
      resourceDeck: {},
      shieldSection: {},
      trash: {},
    },
  } as GundamGameState;
}

// Helper to setup zones for a player
function setupPlayerZones(state: GundamGameState, playerId: PlayerId, cardIds: CardId[]): void {
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
      const deployEffect: Effect = {
        category: "triggered",
        id: "deploy-effect",
        id: "deploy-effect",
        text: "When this unit deploys, draw 1 card",
        timing: { type: "DEPLOY" },
      };
      registerCardDefinition(cardId, {
        cardType: "UNIT",
        cost: 1,
        effects: [deployEffect],
        id: cardId,
        level: 1,
        name: "Test Unit",
      });

      const event: DeployTriggerEvent = {
        cardId,
        playerId: player1,
        type: "DEPLOY",
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
      const attackEffect: Effect = {
        category: "triggered",
        id: "attack-effect",
        id: "attack-effect",
        text: "When this unit attacks, draw 1 card",
        timing: { type: "ATTACK" },
      };
      registerCardDefinition(attackerId, {
        cardType: "UNIT",
        cost: 1,
        effects: [attackEffect],
        id: attackerId,
        level: 1,
        name: "Test Unit",
      });

      const event: AttackTriggerEvent = {
        attackerId,
        playerId: player1,
        targetId: undefined,
        type: "ATTACK",
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
      const destroyedEffect: Effect = {
        category: "triggered",
        id: "destroyed-effect",
        id: "destroyed-effect",
        text: "When this unit is destroyed, draw 1 card",
        timing: { type: "DESTROYED" },
      };
      registerCardDefinition(cardId, {
        cardType: "UNIT",
        cost: 1,
        effects: [destroyedEffect],
        id: cardId,
        level: 1,
        name: "Test Unit",
      });

      const event: DestroyedTriggerEvent = {
        cardId,
        playerId: player1,
        type: "DESTROYED",
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
      const startTurnEffect: Effect = {
        category: "triggered",
        id: "start-turn-effect",
        id: "start-turn-effect",
        text: "At start of your turn, draw 1 card",
        timing: { type: "START_OF_TURN" },
      };
      registerCardDefinition(cardId, {
        cardType: "UNIT",
        cost: 1,
        effects: [startTurnEffect],
        id: cardId,
        level: 1,
        name: "Test Unit",
      });

      const event: StartOfTurnTriggerEvent = {
        playerId: player1,
        type: "START_OF_TURN",
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
      const endTurnEffect: Effect = {
        category: "triggered",
        id: "end-turn-effect",
        id: "end-turn-effect",
        text: "At end of turn, draw 1 card",
        timing: { type: "END_OF_TURN" },
      };
      registerCardDefinition(cardId, {
        cardType: "UNIT",
        cost: 1,
        effects: [endTurnEffect],
        id: cardId,
        level: 1,
        name: "Test Unit",
      });

      const event: EndOfTurnTriggerEvent = {
        playerId: player1,
        type: "END_OF_TURN",
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
        const effect: Effect = {
          actions: [],
          category: "triggered",
          category: "triggered",
          id: `deploy-effect-${id}`,
          id: `deploy-effect-${id}`,
          text: "Deploy effect",
          timing: { type: "DEPLOY" },
          timing: { type: "DEPLOY" },
        };
        registerCardDefinition(id, {
          cardType: "UNIT",
          cost: 1,
          effects: [effect],
          id,
          level: 1,
          name: `Unit ${id}`,
        });
      }

      const event: DeployTriggerEvent = {
        cardId: card1,
        playerId: player1,
        type: "DEPLOY",
      };

      const result = detectDeployTriggers(state, event);

      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(2);
    });

    it("should return empty result when no deploy triggers exist", () => {
      const player1 = "player_one" as PlayerId;
      const state = createMockGameState([player1]);

      const cardId = "unit-001" as CardId;
      setupPlayerZones(state, player1, [cardId]);

      // Register card without deploy effect
      const attackEffect: Effect = {
        actions: [],
        category: "triggered",
        category: "triggered",
        id: "attack-effect",
        id: "attack-effect",
        text: "Attack effect",
        timing: { type: "ATTACK" },
        timing: { type: "ATTACK" },
      };
      registerCardDefinition(cardId, {
        cardType: "UNIT",
        cost: 1,
        effects: [attackEffect],
        id: cardId,
        level: 1,
        name: "Test Unit",
      });

      const event: DeployTriggerEvent = {
        cardId,
        playerId: player1,
        type: "DEPLOY",
      };

      const result = detectDeployTriggers(state, event);

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
        const effect: Effect = {
          actions: [],
          category: "triggered",
          category: "triggered",
          id: `attack-effect-${id}`,
          id: `attack-effect-${id}`,
          text: "Attack effect",
          timing: { type: "ATTACK" },
          timing: { type: "ATTACK" },
        };
        registerCardDefinition(id, {
          cardType: "UNIT",
          cost: 1,
          effects: [effect],
          id,
          level: 1,
          name: `Unit ${id}`,
        });
      }

      const event: AttackTriggerEvent = {
        attackerId,
        playerId: player1,
        targetId: undefined,
        type: "ATTACK",
      };

      const result = detectAttackTriggers(state, event);

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
        const effect: Effect = {
          actions: [],
          category: "triggered",
          category: "triggered",
          id: `destroyed-effect-${id}`,
          id: `destroyed-effect-${id}`,
          text: "Destroyed effect",
          timing: { type: "DESTROYED" },
          timing: { type: "DESTROYED" },
        };
        registerCardDefinition(id, {
          cardType: "UNIT",
          cost: 1,
          effects: [effect],
          id,
          level: 1,
          name: `Unit ${id}`,
        });
      }

      const event: DestroyedTriggerEvent = {
        cardId: destroyedId,
        playerId: player1,
        type: "DESTROYED",
      };

      const result = detectDestroyedTriggers(state, event);

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
        const effect: Effect = {
          actions: [],
          category: "triggered",
          category: "triggered",
          id: `start-turn-effect-${id}`,
          id: `start-turn-effect-${id}`,
          text: "Start of turn effect",
          timing: { type: "START_OF_TURN" },
          timing: { type: "START_OF_TURN" },
        };
        registerCardDefinition(id, {
          cardType: "UNIT",
          cost: 1,
          effects: [effect],
          id,
          level: 1,
          name: `Unit ${id}`,
        });
      }

      // Only player1's turn
      const event: StartOfTurnTriggerEvent = {
        playerId: player1,
        type: "START_OF_TURN",
      };

      const result = detectStartOfTurnTriggers(state, event);

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
        const effect: Effect = {
          actions: [],
          category: "triggered",
          category: "triggered",
          id: `end-turn-effect-${id}`,
          id: `end-turn-effect-${id}`,
          text: "End of turn effect",
          timing: { type: "END_OF_TURN" },
          timing: { type: "END_OF_TURN" },
        };
        registerCardDefinition(id, {
          cardType: "UNIT",
          cost: 1,
          effects: [effect],
          id,
          level: 1,
          name: `Unit ${id}`,
        });
      }

      // Player1's turn is ending
      const event: EndOfTurnTriggerEvent = {
        playerId: player1,
        type: "END_OF_TURN",
      };

      const result = detectEndOfTurnTriggers(state, event);

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
          controllerId: player1,
          effectRef: { effectId: "effect-1" },
          sourceCardId: "card-1" as CardId,
        },
        {
          controllerId: player2,
          effectRef: { effectId: "effect-2" },
          sourceCardId: "card-2" as CardId,
        },
        {
          controllerId: player1,
          effectRef: { effectId: "effect-3" },
          sourceCardId: "card-3" as CardId,
        },
        {
          controllerId: player2,
          effectRef: { effectId: "effect-4" },
          sourceCardId: "card-4" as CardId,
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
          controllerId: player1,
          effectRef: { effectId: "effect-1" },
          sourceCardId: "card-1" as CardId,
        },
        {
          controllerId: player1,
          effectRef: { effectId: "effect-2" },
          sourceCardId: "card-2" as CardId,
        },
        {
          controllerId: player1,
          effectRef: { effectId: "effect-3" },
          sourceCardId: "card-3" as CardId,
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
          controllerId: player2,
          effectRef: { effectId: "effect-1" },
          sourceCardId: "card-1" as CardId,
        },
        {
          controllerId: player2,
          effectRef: { effectId: "effect-2" },
          sourceCardId: "card-2" as CardId,
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
