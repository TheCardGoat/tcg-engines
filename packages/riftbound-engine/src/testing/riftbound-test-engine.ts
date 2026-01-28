/**
 * Riftbound Test Engine
 *
 * A test-friendly wrapper around the Riftbound engine.
 */

import type { CardId } from "@tcg/riftbound-types";
import {
  RiftboundEngine,
  type RiftboundGameConfig,
} from "../engine/riftbound-engine";
import type { PlayerId, RiftboundState } from "../types";

/**
 * Deep merge utility for RiftboundState
 * Handles nested objects like players and zones while preserving type safety
 */
function deepMergeState(
  target: RiftboundState,
  source: Partial<RiftboundState>,
): RiftboundState {
  return {
    gameId: source.gameId ?? target.gameId,
    players:
      source.players !== undefined
        ? { ...target.players, ...source.players }
        : target.players,
    zones:
      source.zones !== undefined
        ? { ...target.zones, ...source.zones }
        : target.zones,
    turn:
      source.turn !== undefined
        ? { ...target.turn, ...source.turn }
        : target.turn,
    status: source.status ?? target.status,
    winner: source.winner !== undefined ? source.winner : target.winner,
  };
}

/**
 * Test engine configuration
 */
export interface TestEngineConfig extends RiftboundGameConfig {
  /** Initial state override for testing */
  readonly initialState?: Partial<RiftboundState>;
}

/**
 * RiftboundTestEngine - Test-friendly game engine
 *
 * Provides additional utilities for testing game scenarios.
 */
export class RiftboundTestEngine {
  private engine: RiftboundEngine;
  private state: RiftboundState;

  constructor(config: TestEngineConfig) {
    this.engine = new RiftboundEngine();
    this.state = this.engine.createGame(config);

    // Apply initial state overrides if provided (deep merge to preserve nested structures)
    if (config.initialState) {
      this.state = deepMergeState(this.state, config.initialState);
    }
  }

  /**
   * Get the current game state
   */
  getState(): RiftboundState {
    return this.state;
  }

  /**
   * Set the game state directly (for testing)
   */
  setState(state: RiftboundState): void {
    this.state = state;
  }

  /**
   * Get a player's hand
   */
  getHand(playerId: PlayerId): CardId[] {
    return this.state.zones[playerId]?.hand ?? [];
  }

  /**
   * Get a player's field
   */
  getField(playerId: PlayerId): CardId[] {
    return this.state.zones[playerId]?.field ?? [];
  }

  /**
   * Get a player's health
   */
  getHealth(playerId: PlayerId): number {
    return this.state.players[playerId]?.health ?? 0;
  }

  /**
   * Get the active player
   */
  getActivePlayer(): PlayerId {
    return this.state.turn.activePlayer;
  }

  /**
   * Check if the game is over
   * Returns true if status is "finished" or if any player has 0 or less health
   */
  isGameOver(): boolean {
    if (this.state.status === "finished") {
      return true;
    }
    // Also check for health-based victory conditions
    for (const playerId of Object.keys(this.state.players)) {
      if (this.state.players[playerId].health <= 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the winner (if any)
   */
  getWinner(): PlayerId | undefined {
    return this.state.winner;
  }
}
