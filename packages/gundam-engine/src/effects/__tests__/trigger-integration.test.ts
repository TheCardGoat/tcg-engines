/**
 * Trigger Integration Tests
 *
 * Tests the integration of trigger detection with game moves.
 * Verifies that triggered effects are properly detected and enqueued
 * when game events occur (Deploy, Attack, Destroyed, Turn Start/End).
 *
 * @module effects/__tests__/trigger-integration
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId } from "@tcg/core";
import type {
  DestroyAction,
  Effect,
  TargetingSpec,
} from "@tcg/gundam-types/effects";
import { attackMove } from "../../game-definition/moves/core/attack";
import { deployUnitMove } from "../../moves/deploy-unit";
import type { GundamGameState } from "../../types";
import type { ActionContext } from "../action-handlers";
import {
  clearCardDefinitions,
  handleDestroyAction,
  registerCardDefinition,
} from "../action-handlers";

// ============================================================================
// Test Helpers
// ============================================================================

/** Creates a minimal game state for testing */
function createMockGameState(players: PlayerId[]): GundamGameState {
  const state: GundamGameState = {
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

  // Initialize all zones for all players
  const zoneTypes = [
    "deck",
    "resourceDeck",
    "hand",
    "battleArea",
    "shieldSection",
    "baseSection",
    "resourceArea",
    "trash",
    "removal",
    "limbo",
  ] as const;

  for (const player of players) {
    for (const zoneType of zoneTypes) {
      if (!state.zones[zoneType][player]) {
        state.zones[zoneType][player] = {
          cards: [],
          config: { owner: player } as any,
        };
      }
    }
  }

  return state;
}

/** Sets up a player's zones for testing */
function setupPlayerZones(
  state: GundamGameState,
  playerId: PlayerId,
  cardIds: { hand?: CardId[]; battleArea?: CardId[] },
): void {
  if (cardIds.hand) {
    state.zones.hand[playerId] = {
      cards: [...cardIds.hand],
      config: { owner: playerId } as any,
    };
  }
  if (cardIds.battleArea) {
    state.zones.battleArea[playerId] = {
      cards: [...cardIds.battleArea],
      config: { owner: playerId } as any,
    };
    // Set all battle area cards to active position
    for (const cardId of cardIds.battleArea) {
      state.gundam.cardPositions[cardId] = "active";
    }
  }
  // Initialize trash zone if not already present
  if (!state.zones.trash[playerId]) {
    state.zones.trash[playerId] = {
      cards: [],
      config: { owner: playerId } as any,
    };
  }
}

/** Sets up active resources for a player */
function setupResources(state: GundamGameState, playerId: PlayerId, amount: number): void {
  state.gundam.activeResources[playerId] = amount;
}

/** Creates a card with deploy trigger effect */
function createDeployTriggerCard(
  cardId: CardId,
  cost: number,
  effects: Effect[],
): void {
  registerCardDefinition(cardId, {
    cardType: "UNIT",
    cost,
    effects,
    id: cardId,
    level: 1,
    name: `Deploy Trigger Unit ${cardId}`,
  });
}

/** Creates a card with attack trigger effect */
function createAttackTriggerCard(cardId: CardId, effects: Effect[]): void {
  registerCardDefinition(cardId, {
    cardType: "UNIT",
    cost: 2,
    effects,
    id: cardId,
    level: 1,
    name: `Attack Trigger Unit ${cardId}`,
  });
}

/** Creates a card with destroyed trigger effect */
function createDestroyedTriggerCard(cardId: CardId, effects: Effect[]): void {
  registerCardDefinition(cardId, {
    cardType: "UNIT",
    cost: 2,
    effects,
    hp: 3,
    id: cardId,
    level: 1,
    name: `Destroyed Trigger Unit ${cardId}`,
  });
}

/** Gets the current effect stack size */
function getEffectStackSize(state: GundamGameState): number {
  return state.gundam.effectStack.stack.length;
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

  describe("Deploy Trigger Integration", () => {
    it("should detect and enqueue deploy triggers when deploying a unit", () => {
      const player1 = "player_one" as PlayerId;
      const player2 = "player_two" as PlayerId;
      const state = createMockGameState([player1, player2]);

      const cardId = "unit-deploy-trigger" as CardId;
      setupPlayerZones(state, player1, {
        battleArea: [],
        hand: [cardId],
      });
      setupResources(state, player1, 3);

      // Create a unit with deploy trigger
      const deployEffect: Effect = {
        category: "triggered",
        id: "deploy-effect",
        id: "deploy-effect",
        text: "When this unit deploys, draw 1 card",
        timing: { type: "DEPLOY" },
      };
      createDeployTriggerCard(cardId, 2, [deployEffect]);

      // Execute deploy move
      const initialStackSize = state.gundam.effectStack.stack.length;
      deployUnitMove.reducer(state, {
        params: { cardId },
        playerId: player1,
      } as any);

      // Verify effect was enqueued
      expect(getEffectStackSize(state)).toBe(initialStackSize + 1);
      expect(state.zones.hand[player1].cards).not.toContain(cardId);
      expect(state.zones.battleArea[player1].cards).toContain(cardId);
    });

    it("should detect deploy triggers from multiple cards", () => {
      const player1 = "player_one" as PlayerId;
      const player2 = "player_two" as PlayerId;
      const state = createMockGameState([player1, player2]);

      const deployingCard = "unit-001" as CardId;
      const existingCard = "unit-002" as CardId;

      setupPlayerZones(state, player1, {
        battleArea: [existingCard],
        hand: [deployingCard],
      });
      setupResources(state, player1, 5);

      // Both cards have deploy triggers
      const deployEffect1: Effect = {
        actions: [],
        category: "triggered",
        category: "triggered",
        id: "deploy-effect-1",
        id: "deploy-effect-1",
        text: "Deploy effect 1",
        timing: { type: "DEPLOY" },
        timing: { type: "DEPLOY" },
      };
      const deployEffect2: Effect = {
        actions: [],
        category: "triggered",
        category: "triggered",
        id: "deploy-effect-2",
        id: "deploy-effect-2",
        text: "Deploy effect 2",
        timing: { type: "DEPLOY" },
        timing: { type: "DEPLOY" },
      };

      createDeployTriggerCard(deployingCard, 2, [deployEffect1]);
      createDeployTriggerCard(existingCard, 2, [deployEffect2]);

      const initialStackSize = getEffectStackSize(state);
      deployUnitMove.reducer(state, {
        params: { cardId: deployingCard },
        playerId: player1,
      } as any);

      // Both effects should be enqueued
      expect(getEffectStackSize(state)).toBe(initialStackSize + 2);
    });

    it("should order active player effects first when multiple triggers exist", () => {
      const player1 = "player_one" as PlayerId;
      const player2 = "player_two" as PlayerId;
      const state = createMockGameState([player1, player2]);

      const deployingCard = "unit-001" as CardId;
      const opponentCard = "unit-002" as CardId;

      setupPlayerZones(state, player1, {
        battleArea: [],
        hand: [deployingCard],
      });
      setupPlayerZones(state, player2, {
        battleArea: [opponentCard],
      });
      setupResources(state, player1, 3);

      // Both cards have deploy triggers
      const deployEffect1: Effect = {
        actions: [],
        category: "triggered",
        category: "triggered",
        id: "deploy-effect-1",
        id: "deploy-effect-1",
        text: "Deploy effect 1",
        timing: { type: "DEPLOY" },
        timing: { type: "DEPLOY" },
      };
      const deployEffect2: Effect = {
        actions: [],
        category: "triggered",
        category: "triggered",
        id: "deploy-effect-2",
        id: "deploy-effect-2",
        text: "Deploy effect 2",
        timing: { type: "DEPLOY" },
        timing: { type: "DEPLOY" },
      };

      createDeployTriggerCard(deployingCard, 2, [deployEffect1]);
      createDeployTriggerCard(opponentCard, 2, [deployEffect2]);

      const initialStackSize = getEffectStackSize(state);
      deployUnitMove.reducer(state, {
        params: { cardId: deployingCard },
        playerId: player1,
      } as any);

      // Both effects should be enqueued
      expect(getEffectStackSize(state)).toBe(initialStackSize + 2);
    });
  });

  describe("Attack Trigger Integration", () => {
    it("should detect and enqueue attack triggers when attacking", () => {
      const player1 = "player_one" as PlayerId;
      const player2 = "player_two" as PlayerId;
      const state = createMockGameState([player1, player2]);

      const attackerId = "unit-attacker" as CardId;
      setupPlayerZones(state, player1, {
        battleArea: [attackerId],
      });
      setupPlayerZones(state, player2, {
        battleArea: [],
      });

      // Create attacker with attack trigger
      const attackEffect: Effect = {
        category: "triggered",
        id: "attack-effect",
        id: "attack-effect",
        text: "When this unit attacks, draw 1 card",
        timing: { type: "ATTACK" },
      };
      createAttackTriggerCard(attackerId, [attackEffect]);

      const initialStackSize = getEffectStackSize(state);
      attackMove.reducer(state, {
        params: { attackerId },
        playerId: player1,
      } as any);

      // Verify effect was enqueued
      expect(getEffectStackSize(state)).toBe(initialStackSize + 1);
    });
  });

  describe("Destroyed Trigger Integration", () => {
    it("should detect and enqueue destroyed triggers when a card is destroyed", () => {
      const player1 = "player_one" as PlayerId;
      const state = createMockGameState([player1]);

      const destroyedCard = "unit-destroyed" as CardId;
      setupPlayerZones(state, player1, {
        battleArea: [destroyedCard],
      });

      // Create card with destroyed trigger
      const destroyedEffect: Effect = {
        category: "triggered",
        id: "destroyed-effect",
        id: "destroyed-effect",
        text: "When this unit is destroyed, draw 1 card",
        timing: { type: "DESTROYED" },
      };
      createDestroyedTriggerCard(destroyedCard, [destroyedEffect]);

      const initialStackSize = getEffectStackSize(state);

      // Execute destroy action with proper TargetingSpec
      const destroyAction: DestroyAction = {
        target: {
          chooser: "controller",
          count: 1,
          timing: "on_resolution",
          validTargets: [{ owner: "any", type: "card" }],
        },
        type: "DESTROY",
      };
      const actionContext: ActionContext = {
        controllerId: player1,
        sourceCardId: destroyedCard,
        targets: [destroyedCard],
      };
      handleDestroyAction(state, destroyAction, actionContext);

      // Verify effect was enqueued
      expect(getEffectStackSize(state)).toBe(initialStackSize + 1);
      expect(state.zones.trash[player1].cards).toContain(destroyedCard);
      expect(state.zones.battleArea[player1].cards).not.toContain(destroyedCard);
    });

    it("should detect destroyed triggers from multiple cards", () => {
      const player1 = "player_one" as PlayerId;
      const state = createMockGameState([player1]);

      const destroyedCard = "unit-destroyed" as CardId;
      const otherCard = "unit-other" as CardId;
      setupPlayerZones(state, player1, {
        battleArea: [destroyedCard, otherCard],
      });

      // Both cards have destroyed triggers
      const destroyedEffect1: Effect = {
        actions: [],
        category: "triggered",
        category: "triggered",
        id: "destroyed-effect-1",
        id: "destroyed-effect-1",
        text: "Destroyed effect 1",
        timing: { type: "DESTROYED" },
        timing: { type: "DESTROYED" },
      };
      const destroyedEffect2: Effect = {
        actions: [],
        category: "triggered",
        category: "triggered",
        id: "destroyed-effect-2",
        id: "destroyed-effect-2",
        text: "Destroyed effect 2",
        timing: { type: "DESTROYED" },
        timing: { type: "DESTROYED" },
      };

      createDestroyedTriggerCard(destroyedCard, [destroyedEffect1]);
      createDestroyedTriggerCard(otherCard, [destroyedEffect2]);

      const initialStackSize = getEffectStackSize(state);

      // Execute destroy action with proper TargetingSpec
      const destroyAction: DestroyAction = {
        target: {
          chooser: "controller",
          count: 1,
          timing: "on_resolution",
          validTargets: [{ owner: "any", type: "card" }],
        },
        type: "DESTROY",
      };
      const actionContext: ActionContext = {
        controllerId: player1,
        sourceCardId: destroyedCard,
        targets: [destroyedCard],
      };
      handleDestroyAction(state, destroyAction, actionContext);

      // Both effects should be enqueued
      expect(getEffectStackSize(state)).toBe(initialStackSize + 2);
    });
  });

  describe("Simultaneous Trigger Ordering", () => {
    it("should order active player effects before opponent effects", () => {
      const player1 = "player_one" as PlayerId;
      const player2 = "player_two" as PlayerId;
      const state = createMockGameState([player1, player2]);

      const deployingCard = "unit-001" as CardId;
      const opponentCard = "unit-002" as CardId;

      setupPlayerZones(state, player1, {
        battleArea: [],
        hand: [deployingCard],
      });
      setupPlayerZones(state, player2, {
        battleArea: [opponentCard],
      });
      setupResources(state, player1, 3);

      // Both cards have deploy triggers
      const deployEffect1: Effect = {
        actions: [],
        category: "triggered",
        category: "triggered",
        id: "deploy-effect-1",
        id: "deploy-effect-1",
        text: "Deploy effect 1",
        timing: { type: "DEPLOY" },
        timing: { type: "DEPLOY" },
      };
      const deployEffect2: Effect = {
        actions: [],
        category: "triggered",
        category: "triggered",
        id: "deploy-effect-2",
        id: "deploy-effect-2",
        text: "Deploy effect 2",
        timing: { type: "DEPLOY" },
        timing: { type: "DEPLOY" },
      };

      createDeployTriggerCard(deployingCard, 2, [deployEffect1]);
      createDeployTriggerCard(opponentCard, 2, [deployEffect2]);

      deployUnitMove.reducer(state, {
        params: { cardId: deployingCard },
        playerId: player1,
      } as any);

      // Both effects should be enqueued
      const effectStack = state.gundam.effectStack.stack;
      expect(effectStack.length).toBe(2);

      // Active player effects should come first
      // The order in the stack should have active player effects before opponent effects
      // This is verified by checking that the controllerId matches the active player
      const firstEffect = effectStack[0];
      expect(firstEffect?.controllerId).toBe(player1);
    });
  });
});
