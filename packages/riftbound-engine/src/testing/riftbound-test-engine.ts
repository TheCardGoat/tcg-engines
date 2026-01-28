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

    // Apply initial state overrides if provided
    if (config.initialState) {
      this.state = { ...this.state, ...config.initialState };
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
   */
  isGameOver(): boolean {
    return this.state.status === "finished";
  }

  /**
   * Get the winner (if any)
   */
  getWinner(): PlayerId | undefined {
    return this.state.winner;
  }
}
