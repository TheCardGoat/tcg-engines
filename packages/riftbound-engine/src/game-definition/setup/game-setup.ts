/**
 * Riftbound Game Setup
 *
 * Initial game setup logic.
 */

import type { PlayerId, RiftboundState } from "../../types";

/**
 * Configuration for game setup
 */
export interface SetupConfig {
  readonly players: [PlayerId, PlayerId];
  readonly startingHealth: number;
  readonly startingHandSize: number;
}

/**
 * Default setup configuration
 */
export const DEFAULT_SETUP_CONFIG: SetupConfig = {
  players: ["player1", "player2"],
  startingHealth: 20,
  startingHandSize: 7,
};

/**
 * Create the initial game state
 *
 * @param config - Setup configuration
 * @returns Initial game state
 */
export function createInitialState(
  config: Partial<SetupConfig> = {},
): RiftboundState {
  const fullConfig = { ...DEFAULT_SETUP_CONFIG, ...config };
  const { players, startingHealth } = fullConfig;
  // TODO: startingHandSize will be used when deck/draw logic is implemented

  return {
    gameId: crypto.randomUUID(),
    players: {
      [players[0]]: {
        id: players[0],
        health: startingHealth,
        resources: 0,
      },
      [players[1]]: {
        id: players[1],
        health: startingHealth,
        resources: 0,
      },
    },
    zones: {
      [players[0]]: {
        hand: [],
        deck: [],
        field: [],
        discard: [],
        exile: [],
      },
      [players[1]]: {
        hand: [],
        deck: [],
        field: [],
        discard: [],
        exile: [],
      },
    },
    turn: {
      number: 0,
      activePlayer: players[0],
      phase: "setup",
    },
    status: "setup",
  };
}
