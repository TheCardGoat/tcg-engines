/**
 * Riftbound Operations
 *
 * Helper operations for manipulating Riftbound game state.
 * These are convenience functions that wrap common state mutations.
 *
 * Note: For the tabletop simulator, most operations are handled through
 * the core engine's zone and counter operations. These functions are
 * provided for game-specific state like victory points and rune pools.
 */

import type { CardId } from "@tcg/core";
import { produce } from "immer";
import type {
  Domain,
  DomainPower,
  PlayerId,
  RiftboundGameState,
  RunePool,
} from "../types";

/**
 * Add victory points to a player
 *
 * @param state - Current game state
 * @param playerId - Player receiving points
 * @param points - Number of points to add
 * @returns Updated game state
 */
export function addVictoryPoints(
  state: RiftboundGameState,
  playerId: PlayerId,
  points: number,
): RiftboundGameState {
  return produce(state, (draft) => {
    const player = draft.players[playerId];
    if (player) {
      player.victoryPoints += points;
    }
  });
}

/**
 * Add energy to a player's rune pool
 *
 * @param state - Current game state
 * @param playerId - Player receiving energy
 * @param amount - Amount of energy to add
 * @returns Updated game state
 */
export function addEnergy(
  state: RiftboundGameState,
  playerId: PlayerId,
  amount: number,
): RiftboundGameState {
  return produce(state, (draft) => {
    const pool = draft.runePools[playerId];
    if (pool) {
      pool.energy += amount;
    }
  });
}

/**
 * Add power to a player's rune pool
 *
 * @param state - Current game state
 * @param playerId - Player receiving power
 * @param domain - Domain of the power
 * @param amount - Amount of power to add
 * @returns Updated game state
 */
export function addPower(
  state: RiftboundGameState,
  playerId: PlayerId,
  domain: Domain,
  amount: number,
): RiftboundGameState {
  return produce(state, (draft) => {
    const pool = draft.runePools[playerId];
    if (pool) {
      pool.power[domain] = (pool.power[domain] ?? 0) + amount;
    }
  });
}

/**
 * Spend energy from a player's rune pool
 *
 * @param state - Current game state
 * @param playerId - Player spending energy
 * @param amount - Amount of energy to spend
 * @returns Updated game state, or null if insufficient energy
 */
export function spendEnergy(
  state: RiftboundGameState,
  playerId: PlayerId,
  amount: number,
): RiftboundGameState | null {
  const pool = state.runePools[playerId];
  if (!pool || pool.energy < amount) {
    return null;
  }

  return produce(state, (draft) => {
    const draftPool = draft.runePools[playerId];
    if (draftPool) {
      draftPool.energy -= amount;
    }
  });
}

/**
 * Spend power from a player's rune pool
 *
 * @param state - Current game state
 * @param playerId - Player spending power
 * @param domain - Domain of the power
 * @param amount - Amount of power to spend
 * @returns Updated game state, or null if insufficient power
 */
export function spendPower(
  state: RiftboundGameState,
  playerId: PlayerId,
  domain: Domain,
  amount: number,
): RiftboundGameState | null {
  const pool = state.runePools[playerId];
  if (!pool || (pool.power[domain] ?? 0) < amount) {
    return null;
  }

  return produce(state, (draft) => {
    const draftPool = draft.runePools[playerId];
    if (draftPool) {
      draftPool.power[domain] = (draftPool.power[domain] ?? 0) - amount;
    }
  });
}

/**
 * Empty a player's rune pool
 *
 * @param state - Current game state
 * @param playerId - Player whose pool to empty
 * @returns Updated game state
 */
export function emptyRunePool(
  state: RiftboundGameState,
  playerId: PlayerId,
): RiftboundGameState {
  return produce(state, (draft) => {
    const pool = draft.runePools[playerId];
    if (pool) {
      pool.energy = 0;
      pool.power = {};
    }
  });
}

/**
 * Set battlefield controller
 *
 * @param state - Current game state
 * @param battlefieldId - Battlefield to update
 * @param controllerId - New controller (null for uncontrolled)
 * @returns Updated game state
 */
export function setBattlefieldController(
  state: RiftboundGameState,
  battlefieldId: CardId,
  controllerId: PlayerId | null,
): RiftboundGameState {
  return produce(state, (draft) => {
    const battlefield = draft.battlefields[battlefieldId as string];
    if (battlefield) {
      battlefield.controller = controllerId;
    }
  });
}

/**
 * Set battlefield contested status
 *
 * @param state - Current game state
 * @param battlefieldId - Battlefield to update
 * @param contested - Whether the battlefield is contested
 * @param contestedBy - Player who contested (if contested)
 * @returns Updated game state
 */
export function setBattlefieldContested(
  state: RiftboundGameState,
  battlefieldId: CardId,
  contested: boolean,
  contestedBy?: PlayerId,
): RiftboundGameState {
  return produce(state, (draft) => {
    const battlefield = draft.battlefields[battlefieldId as string];
    if (battlefield) {
      battlefield.contested = contested;
      battlefield.contestedBy = contestedBy;
    }
  });
}

/**
 * Track a conquered battlefield for this turn
 *
 * @param state - Current game state
 * @param playerId - Player who conquered
 * @param battlefieldId - Battlefield that was conquered
 * @returns Updated game state
 */
export function trackConqueredBattlefield(
  state: RiftboundGameState,
  playerId: PlayerId,
  battlefieldId: CardId,
): RiftboundGameState {
  return produce(state, (draft) => {
    if (!draft.conqueredThisTurn[playerId]) {
      draft.conqueredThisTurn[playerId] = [];
    }
    draft.conqueredThisTurn[playerId].push(battlefieldId);
  });
}

/**
 * Track a scored battlefield for this turn
 *
 * @param state - Current game state
 * @param playerId - Player who scored
 * @param battlefieldId - Battlefield that was scored
 * @returns Updated game state
 */
export function trackScoredBattlefield(
  state: RiftboundGameState,
  playerId: PlayerId,
  battlefieldId: CardId,
): RiftboundGameState {
  return produce(state, (draft) => {
    if (!draft.scoredThisTurn[playerId]) {
      draft.scoredThisTurn[playerId] = [];
    }
    draft.scoredThisTurn[playerId].push(battlefieldId);
  });
}

/**
 * Clear turn-based tracking (conquered and scored battlefields)
 *
 * @param state - Current game state
 * @returns Updated game state
 */
export function clearTurnTracking(
  state: RiftboundGameState,
): RiftboundGameState {
  return produce(state, (draft) => {
    for (const playerId of Object.keys(draft.conqueredThisTurn)) {
      draft.conqueredThisTurn[playerId] = [];
    }
    for (const playerId of Object.keys(draft.scoredThisTurn)) {
      draft.scoredThisTurn[playerId] = [];
    }
  });
}
