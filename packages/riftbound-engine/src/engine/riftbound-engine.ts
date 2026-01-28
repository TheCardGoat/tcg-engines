/**
 * Riftbound Engine
 *
 * Main engine class for the Riftbound TCG.
 */

import type { RuleEngine } from "@tcg/core";
import type { RiftboundState } from "../types";

/**
 * Configuration options for creating a new game
 */
export interface RiftboundGameConfig {
  /** Player identifiers */
  readonly players: [string, string];
  /** Optional random seed for reproducibility */
  readonly seed?: number;
}

/**
 * RiftboundEngine - Main game engine class
 *
 * Provides the interface for creating and managing Riftbound games.
 */
export class RiftboundEngine {
  /**
   * Create a new Riftbound game
   *
   * @param config - Game configuration
   * @returns Initial game state
   */
  createGame(config: RiftboundGameConfig): RiftboundState {
    const { players } = config;

    // Create initial game state
    const initialState: RiftboundState = {
      gameId: crypto.randomUUID(),
      players: {
        [players[0]]: {
          id: players[0],
          health: 20,
          resources: 0,
        },
        [players[1]]: {
          id: players[1],
          health: 20,
          resources: 0,
        },
      },
      zones: {
        [players[0]]: {
          hand: [],
          deck: [],
          field: [],
          discard: [],
        },
        [players[1]]: {
          hand: [],
          deck: [],
          field: [],
          discard: [],
        },
      },
      turn: {
        number: 0,
        activePlayer: players[0],
        phase: "setup",
      },
      status: "setup",
    };

    return initialState;
  }

  /**
   * Get the rule engine for this game
   *
   * @returns RuleEngine instance (placeholder)
   */
  getRuleEngine(): RuleEngine<RiftboundState, Record<string, unknown>> | null {
    // Rule engine will be implemented when game rules are defined
    return null;
  }
}
