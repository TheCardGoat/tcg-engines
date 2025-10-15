/**
 * Attack Move Implementation
 *
 * Implements attacking with units.
 * Handles:
 * - Attack validation (unit must be active/ready)
 * - Target validation (must be opponent's unit or direct attack)
 * - Resting (exhausting) the attacking unit
 * - Setting up battle state for resolution
 *
 * Rule References:
 * - Rule 6-1: Units attack during main phase
 * - Rule 6-2: Attacking unit becomes rested (exhausted)
 * - Rule 6-3: Can target opponent's units or attack directly
 * - Rule 6-4: Rested units cannot attack
 */

import type { CardId, GameMoveDefinition, MoveContext } from "@tcg/core";
import { isCardInZone } from "@tcg/core";
import type { Draft } from "immer";
import type { GundamGameState } from "../types";

/**
 * Extracts and validates attacker ID from move context
 */
function getAttackerId(context: MoveContext): CardId {
  const attackerId = context.params?.attackerId;

  if (!attackerId || typeof attackerId !== "string") {
    throw new Error(`Invalid attacker ID: ${attackerId}`);
  }

  return attackerId as CardId;
}

/**
 * Extracts target ID from move context (optional for direct attacks)
 */
function getTargetId(context: MoveContext): CardId | undefined {
  const targetId = context.params?.targetId;

  if (targetId === undefined || targetId === null) {
    return undefined; // Direct attack
  }

  if (typeof targetId !== "string") {
    throw new Error(`Invalid target ID: ${targetId}`);
  }

  return targetId as CardId;
}

/**
 * Attack Move Definition
 *
 * Declares an attack with a unit, targeting an opponent's unit or attacking directly.
 */
export const attackMove: GameMoveDefinition<GundamGameState> = {
  /**
   * Enumerator: Generate all possible attacks
   *
   * Enumerates all active units that can attack with all valid targets.
   */
  enumerator: (state: GundamGameState, context) => {
    const { playerId } = context;

    // Must be in main phase
    if (state.phase !== "main") return [];

    // Must be current player
    if (state.currentPlayer !== playerId) return [];

    const options = [];
    const battleArea = state.zones.battleArea[playerId];

    if (!battleArea) return [];

    // Get opponent
    const opponentId = state.players.find((p) => p !== playerId);
    if (!opponentId) return [];

    const opponentBattleArea = state.zones.battleArea[opponentId];
    if (!opponentBattleArea) return [];

    // For each active unit in player's battle area
    for (const attackerId of battleArea.cardIds) {
      const position = state.gundam.cardPositions[attackerId];
      const hasAttacked = state.gundam.attackedThisTurn.includes(attackerId);

      // Skip if unit is rested or has already attacked
      if (position !== "active" || hasAttacked) continue;

      // Can attack each opponent unit
      for (const targetId of opponentBattleArea.cardIds) {
        options.push({ attackerId, targetId });
      }

      // Can also attack directly (no target)
      options.push({ attackerId, targetId: undefined });
    }

    return options;
  },

  /**
   * Condition: Can attack if:
   * - In main phase
   * - Attacker is in player's battle area
   * - Attacker is active (not rested)
   * - Target (if specified) is in opponent's battle area
   * - Attacker hasn't attacked this turn
   */
  condition: (state: GundamGameState, context: MoveContext): boolean => {
    const { playerId } = context;

    // Must be in main phase
    if (state.phase !== "main") return false;

    // Must be current player
    if (state.currentPlayer !== playerId) return false;

    // Get and validate attacker ID
    let attackerId: CardId;
    try {
      attackerId = getAttackerId(context);
    } catch {
      return false;
    }

    // Attacker must be in player's battle area
    const battleArea = state.zones.battleArea[playerId];
    if (!(battleArea && isCardInZone(battleArea, attackerId))) return false;

    // Attacker must be active (not rested)
    const position = state.gundam.cardPositions[attackerId];
    if (position !== "active") return false;

    // Check if unit has already attacked this turn
    const hasAttackedThisTurn =
      state.gundam.attackedThisTurn.includes(attackerId);
    if (hasAttackedThisTurn) return false;

    // Validate target if specified
    const targetId = getTargetId(context);
    if (targetId !== undefined) {
      // Target must be in opponent's battle area
      const opponentId = state.players.find((p) => p !== playerId);
      if (!opponentId) return false;

      const opponentBattleArea = state.zones.battleArea[opponentId];
      if (!(opponentBattleArea && isCardInZone(opponentBattleArea, targetId))) {
        return false;
      }
    }

    return true;
  },

  /**
   * Reducer: Execute the attack
   *
   * Rests the attacking unit and sets up battle state.
   * Actual damage calculation happens in battle resolution phase.
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const { playerId } = context;
    const attackerId = getAttackerId(context);
    const targetId = getTargetId(context);

    // Validate attacker is in battle area
    const battleArea = draft.zones.battleArea[playerId];
    if (!(battleArea && isCardInZone(battleArea, attackerId))) {
      throw new Error(`Attacker ${attackerId} is not in player's battle area`);
    }

    // Validate attacker is active
    const position = draft.gundam.cardPositions[attackerId];
    if (position !== "active") {
      throw new Error(
        `Attacker ${attackerId} is not active (currently ${position})`,
      );
    }

    // Rest (exhaust) the attacking unit
    draft.gundam.cardPositions[attackerId] = "rested";

    // Track that this unit has attacked this turn
    if (!draft.gundam.attackedThisTurn.includes(attackerId)) {
      draft.gundam.attackedThisTurn.push(attackerId);
    }

    // TODO: Set up battle state for resolution
    // This would involve:
    // - Creating a battle state object
    // - Recording attacker and defender
    // - Triggering battle resolution sequence
    // For now, we just rest the attacker as a placeholder

    // If there's a target, validate it exists
    if (targetId !== undefined) {
      const opponentId = draft.players.find((p) => p !== playerId);
      if (!opponentId) {
        throw new Error("No opponent found");
      }

      const opponentBattleArea = draft.zones.battleArea[opponentId];
      if (!(opponentBattleArea && isCardInZone(opponentBattleArea, targetId))) {
        throw new Error(`Target ${targetId} is not in opponent's battle area`);
      }

      // TODO: Set up targeted attack battle state
    } else {
      // TODO: Set up direct attack battle state
    }
  },

  metadata: {
    category: "combat",
    tags: ["core", "main-phase-action"],
    description: "Attack with a unit",
    canBeUndone: false,
    affectsZones: ["battleArea"],
  },
};
