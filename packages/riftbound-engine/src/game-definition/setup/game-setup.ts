/**
 * Riftbound Game Setup
 *
 * Initial game setup logic for the tabletop simulator.
 */

import type {
  createPlayerState,
  createRunePool,
  PlayerId,
  RiftboundGameState,
} from "../../types";

/**
 * Configuration for game setup
 */
export interface SetupConfig {
  readonly players: PlayerId[];
  readonly victoryScore: number;
}

/**
 * Default setup configuration for 1v1
 */
export const DEFAULT_SETUP_CONFIG: SetupConfig = {
  players: [],
  victoryScore: 8,
};

/**
 * Create the initial game state
 *
 * This creates the game-specific state. Zone state and card metadata
 * are managed by the core engine.
 *
 * @param players - Array of player objects from the engine
 * @returns Initial game state
 */
export function createInitialState(
  players: Array<{ id: string }>,
): RiftboundGameState {
  const playerIds = players.map((p) => p.id as PlayerId);

  // Initialize player states
  const playerStates: Record<
    PlayerId,
    { id: PlayerId; victoryPoints: number }
  > = {};
  const runePools: Record<
    PlayerId,
    { energy: number; power: Record<string, number> }
  > = {};
  const conqueredThisTurn: Record<PlayerId, string[]> = {};
  const scoredThisTurn: Record<PlayerId, string[]> = {};

  for (const playerId of playerIds) {
    playerStates[playerId] = {
      id: playerId,
      victoryPoints: 0,
    };
    runePools[playerId] = {
      energy: 0,
      power: {},
    };
    conqueredThisTurn[playerId] = [];
    scoredThisTurn[playerId] = [];
  }

  return {
    gameId: crypto.randomUUID(),
    players: playerStates,
    victoryScore: 8, // 1v1 victory score
    battlefields: {},
    runePools,
    conqueredThisTurn,
    scoredThisTurn,
    turn: {
      number: 1,
      activePlayer: playerIds[0] ?? ("" as PlayerId),
      phase: "setup",
    },
    status: "setup",
  };
}
