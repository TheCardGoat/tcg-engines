/**
 * Riftbound Test Engine
 *
 * A test-friendly wrapper around the Riftbound engine.
 */

import type { CardId } from "@tcg/core";
import {
  RiftboundEngine,
  type RiftboundGameConfig,
} from "../engine/riftbound-engine";
import type { PlayerId, RiftboundGameState } from "../types";

/**
 * Deep merge utility for RiftboundGameState
 * Handles nested objects like players and battlefields while preserving type safety
 */
function deepMergeState(
  target: RiftboundGameState,
  source: Partial<RiftboundGameState>,
): RiftboundGameState {
  return {
    gameId: source.gameId ?? target.gameId,
    players:
      source.players !== undefined
        ? { ...target.players, ...source.players }
        : target.players,
    victoryScore: source.victoryScore ?? target.victoryScore,
    battlefields:
      source.battlefields !== undefined
        ? { ...target.battlefields, ...source.battlefields }
        : target.battlefields,
    runePools:
      source.runePools !== undefined
        ? { ...target.runePools, ...source.runePools }
        : target.runePools,
    conqueredThisTurn:
      source.conqueredThisTurn !== undefined
        ? { ...target.conqueredThisTurn, ...source.conqueredThisTurn }
        : target.conqueredThisTurn,
    scoredThisTurn:
      source.scoredThisTurn !== undefined
        ? { ...target.scoredThisTurn, ...source.scoredThisTurn }
        : target.scoredThisTurn,
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
  readonly initialState?: Partial<RiftboundGameState>;
}

/**
 * RiftboundTestEngine - Test-friendly game engine
 *
 * Provides additional utilities for testing game scenarios.
 */
export class RiftboundTestEngine {
  private engine: RiftboundEngine;
  private state: RiftboundGameState;

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
  getState(): RiftboundGameState {
    return this.state;
  }

  /**
   * Set the game state directly (for testing)
   */
  setState(state: RiftboundGameState): void {
    this.state = state;
  }

  /**
   * Get a player's victory points
   */
  getVictoryPoints(playerId: PlayerId): number {
    return this.state.players[playerId]?.victoryPoints ?? 0;
  }

  /**
   * Get a player's rune pool energy
   */
  getEnergy(playerId: PlayerId): number {
    return this.state.runePools[playerId]?.energy ?? 0;
  }

  /**
   * Get the active player
   */
  getActivePlayer(): PlayerId {
    return this.state.turn.activePlayer;
  }

  /**
   * Check if the game is over
   * Returns true if status is "finished" or if any player has reached victory score
   */
  isGameOver(): boolean {
    if (this.state.status === "finished") {
      return true;
    }
    // Check for victory point win condition
    for (const playerId of Object.keys(this.state.players)) {
      const player = this.state.players[playerId];
      if (player && player.victoryPoints >= this.state.victoryScore) {
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
