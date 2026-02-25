/**
 * Trigger Integration Tests
 *
 * Tests the integration of trigger detection with game state changes.
 * Verifies that triggered effects are properly detected and enqueued
 * when game events occur (Deploy, Attack, Destroyed, Turn Start/End).
 *
 * @module effects/__tests__/trigger-integration
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId } from "@tcg/core";
import type { Effect } from "@tcg/gundam-types/effects";
import { createTestState, type TestZoneData } from "../../testing/test-helpers";
import type { GundamGameState } from "../../types";
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
  type EndOfTurnTriggerEvent,
  orderTriggeredEffects,
  type StartOfTurnTriggerEvent,
  type TriggeredEffectRef,
} from "../trigger-detection";

// ============================================================================
// Test Fixtures
// ============================================================================

const PLAYER_1 = "player-1" as PlayerId;
const PLAYER_2 = "player-2" as PlayerId;
const UNIT_1 = "unit-1" as CardId;
const UNIT_2 = "unit-2" as CardId;

/** Creates a minimal game state for testing */
function createMockGameState(): GundamGameState {
  return createTestState({
    players: [PLAYER_1, PLAYER_2],
    activePlayerId: PLAYER_1,
    turnNumber: 1,
    currentPhase: "main",
  });
}

/** Sets up a player's battle area with cards */
function setupBattleArea(
  state: GundamGameState,
  playerId: PlayerId,
  cardIds: CardId[],
): void {
  const zoneKey = `battleArea-${playerId}`;
  const zone = state.internal.zones[zoneKey] as TestZoneData | undefined;
  if (zone) {
    zone.cardIds = [...cardIds];
  }
  for (const cardId of cardIds) {
    state.external.cardPositions[cardId] = "active";
  }
}

/** Creates a card definition with deploy trigger */
function createDeployTriggerCard(cardId: CardId, effects: Effect[]): void {
  registerCardDefinition(cardId, {
    id: cardId,
    name: `Deploy Trigger Card ${cardId}`,
    cardType: "UNIT",
    cost: 2,
    level: 1,
    effects,
  });
}

/** Creates a card definition with attack trigger */
function createAttackTriggerCard(cardId: CardId, effects: Effect[]): void {
  registerCardDefinition(cardId, {
    id: cardId,
    name: `Attack Trigger Card ${cardId}`,
    cardType: "UNIT",
    cost: 2,
    level: 1,
    effects,
  });
}

/** Creates a card definition with destroyed trigger */
function createDestroyedTriggerCard(cardId: CardId, effects: Effect[]): void {
  registerCardDefinition(cardId, {
    id: cardId,
    name: `Destroyed Trigger Card ${cardId}`,
    cardType: "UNIT",
    cost: 2,
    level: 1,
    effects,
  });
}

// ============================================================================
// Tests
// ============================================================================

describe("Trigger Integration", () => {
  beforeEach(() => {
    clearCardDefinitions();
  });

  afterEach(() => {
    clearCardDefinitions();
  });

  describe("Deploy Triggers", () => {
    it("should detect deploy triggers when unit enters play", () => {
      const state = createMockGameState();
      setupBattleArea(state, PLAYER_1, [UNIT_1]);

      createDeployTriggerCard(UNIT_1, [
        {
          id: "deploy-effect-1",
          category: "triggered",
          timing: { type: "DEPLOY" },
          actions: [{ type: "DRAW", count: 1, player: "self" }],
          text: "When deployed, draw 1 card",
        },
      ]);

      const event: DeployTriggerEvent = {
        type: "DEPLOY",
        cardId: UNIT_1,
        playerId: PLAYER_1,
      };

      const result = detectDeployTriggers(state, event);
      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(1);
    });

    it("should not trigger for cards without deploy effects", () => {
      const state = createMockGameState();
      setupBattleArea(state, PLAYER_1, [UNIT_1]);

      registerCardDefinition(UNIT_1, {
        id: UNIT_1,
        name: "Unit without trigger",
        cardType: "UNIT",
        cost: 2,
        level: 1,
        effects: [],
      });

      const event: DeployTriggerEvent = {
        type: "DEPLOY",
        cardId: UNIT_1,
        playerId: PLAYER_1,
      };

      const result = detectDeployTriggers(state, event);
      expect(result.hasTriggers).toBe(false);
      expect(result.effects).toHaveLength(0);
    });
  });

  describe("Attack Triggers", () => {
    it("should detect attack triggers when unit attacks", () => {
      const state = createMockGameState();
      setupBattleArea(state, PLAYER_1, [UNIT_1]);

      createAttackTriggerCard(UNIT_1, [
        {
          id: "attack-effect-1",
          category: "triggered",
          timing: { type: "ATTACK" },
          actions: [{ type: "DRAW", count: 1, player: "self" }],
          text: "When attacking, draw 1 card",
        },
      ]);

      const event: AttackTriggerEvent = {
        type: "ATTACK",
        attackerId: UNIT_1,
        targetId: undefined,
        playerId: PLAYER_1,
      };

      const result = detectAttackTriggers(state, event);
      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(1);
    });
  });

  describe("Destroyed Triggers", () => {
    it("should detect destroyed triggers when unit is destroyed", () => {
      const state = createMockGameState();
      setupBattleArea(state, PLAYER_1, [UNIT_1]);

      createDestroyedTriggerCard(UNIT_1, [
        {
          id: "destroyed-effect-1",
          category: "triggered",
          timing: { type: "DESTROYED" },
          actions: [{ type: "DRAW", count: 1, player: "self" }],
          text: "When destroyed, draw 1 card",
        },
      ]);

      const event: DestroyedTriggerEvent = {
        type: "DESTROYED",
        cardId: UNIT_1,
        playerId: PLAYER_1,
      };

      const result = detectDestroyedTriggers(state, event);
      expect(result.hasTriggers).toBe(true);
      expect(result.effects).toHaveLength(1);
    });
  });

  describe("Turn Triggers", () => {
    it("should detect start of turn triggers", () => {
      const state = createMockGameState();
      setupBattleArea(state, PLAYER_1, [UNIT_1]);

      registerCardDefinition(UNIT_1, {
        id: UNIT_1,
        name: "Turn Start Card",
        cardType: "UNIT",
        cost: 2,
        level: 1,
        effects: [
          {
            id: "turn-start-effect",
            category: "triggered",
            timing: { type: "START_OF_TURN" },
            actions: [],
            text: "At start of turn",
          },
        ],
      });

      const event: StartOfTurnTriggerEvent = {
        type: "START_OF_TURN",
        playerId: PLAYER_1,
      };

      const result = detectStartOfTurnTriggers(state, event);
      expect(result.hasTriggers).toBe(true);
    });

    it("should detect end of turn triggers", () => {
      const state = createMockGameState();
      setupBattleArea(state, PLAYER_1, [UNIT_1]);

      registerCardDefinition(UNIT_1, {
        id: UNIT_1,
        name: "Turn End Card",
        cardType: "UNIT",
        cost: 2,
        level: 1,
        effects: [
          {
            id: "turn-end-effect",
            category: "triggered",
            timing: { type: "END_OF_TURN" },
            actions: [],
            text: "At end of turn",
          },
        ],
      });

      const event: EndOfTurnTriggerEvent = {
        type: "END_OF_TURN",
        playerId: PLAYER_1,
      };

      const result = detectEndOfTurnTriggers(state, event);
      expect(result.hasTriggers).toBe(true);
    });
  });

  describe("Effect Ordering", () => {
    it("should order effects by active player first", () => {
      const effect1: TriggeredEffectRef = {
        sourceCardId: UNIT_1,
        controllerId: PLAYER_1,
        effectRef: { effectId: "e1" },
      };

      const effect2: TriggeredEffectRef = {
        sourceCardId: UNIT_2,
        controllerId: PLAYER_2,
        effectRef: { effectId: "e2" },
      };

      const result = orderTriggeredEffects([effect1, effect2], PLAYER_1);
      expect(result.order[0]).toBe(0); // effect1 at index 0
      expect(result.order[1]).toBe(1); // effect2 at index 1
    });
  });
});
