import type { PlayerId } from "../types/branded";

/**
 * Configuration for the tracker system
 */
export type TrackerConfig = {
  /** Trackers that reset at the end of each turn */
  perTurn?: string[];
  /** Trackers that reset at the end of specific phases */
  perPhase?: Record<string, string[]>;
  /** Whether trackers are per-player or global */
  perPlayer?: boolean;
};

/**
 * Internal storage for tracker state
 */
type TrackerState = Map<string, Set<PlayerId | "global">>;

/**
 * System for managing boolean flags that automatically reset based on turn/phase boundaries.
 * Useful for tracking "has done X this turn" style game state.
 *
 * @example
 * ```typescript
 * const trackers = new TrackerSystem({
 *   perTurn: ["hasDrawnCard", "hasPlayedResource"],
 *   perPhase: {
 *     main: ["hasAttacked"]
 *   },
 *   perPlayer: true
 * });
 *
 * // In a move:
 * if (!trackers.check("hasDrawnCard", playerId)) {
 *   // Draw card
 *   trackers.mark("hasDrawnCard", playerId);
 * }
 *
 * // At turn end:
 * trackers.resetTurn();
 * ```
 */
export class TrackerSystem {
  private state: TrackerState = new Map();
  private config: TrackerConfig;

  constructor(config: TrackerConfig = {}) {
    this.config = {
      perPlayer: config.perPlayer ?? true,
      perTurn: config.perTurn ?? [],
      perPhase: config.perPhase ?? {},
    };
  }

  /**
   * Check if a tracker is marked for a player or globally
   */
  public check(name: string, playerId?: PlayerId): boolean {
    const key = this.getKey(playerId);
    const trackerSet = this.state.get(name);
    return trackerSet ? trackerSet.has(key) : false;
  }

  /**
   * Mark a tracker as true for a player or globally
   */
  public mark(name: string, playerId?: PlayerId): void {
    const key = this.getKey(playerId);
    if (!this.state.has(name)) {
      this.state.set(name, new Set());
    }
    this.state.get(name)?.add(key);
  }

  /**
   * Unmark a tracker (set to false) for a player or globally
   */
  public unmark(name: string, playerId?: PlayerId): void {
    const key = this.getKey(playerId);
    this.state.get(name)?.delete(key);
  }

  /**
   * Reset all turn-scoped trackers
   */
  public resetTurn(): void {
    for (const trackerName of this.config.perTurn ?? []) {
      this.state.delete(trackerName);
    }
  }

  /**
   * Reset all trackers for a specific phase
   */
  public resetPhase(phaseName: string): void {
    const phaseTrackers = this.config.perPhase?.[phaseName] ?? [];
    for (const trackerName of phaseTrackers) {
      this.state.delete(trackerName);
    }
  }

  /**
   * Reset all trackers (useful for game reset)
   */
  public resetAll(): void {
    this.state.clear();
  }

  /**
   * Get the storage key for a player or global tracker
   */
  private getKey(playerId?: PlayerId): PlayerId | "global" {
    if (this.config.perPlayer && playerId) {
      return playerId;
    }
    return "global";
  }

  /**
   * Get all currently marked trackers (for debugging/serialization)
   */
  public getState(): Record<string, (PlayerId | "global")[]> {
    const result: Record<string, (PlayerId | "global")[]> = {};
    for (const [name, playerSet] of this.state.entries()) {
      result[name] = Array.from(playerSet);
    }
    return result;
  }

  /**
   * Restore tracker state (for deserialization)
   */
  public setState(state: Record<string, (PlayerId | "global")[]>): void {
    this.state.clear();
    for (const [name, players] of Object.entries(state)) {
      this.state.set(name, new Set(players));
    }
  }
}
