import type { PlayerId } from "../types/branded";

/**
 * Configuration for the tracker system
 */
export interface TrackerConfig {
  /** Trackers that reset at the end of each turn */
  perTurn?: string[];
  /** Trackers that reset at the end of specific phases */
  perPhase?: Record<string, string[]>;
  /** Whether trackers are per-player or global */
  perPlayer?: boolean;
}

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
      perPhase: config.perPhase ?? {},
      perPlayer: config.perPlayer ?? true,
      perTurn: config.perTurn ?? [],
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
   * Supports wildcard patterns (e.g., "quested:*" matches "quested:card-123", "quested:card-456", etc.)
   */
  public resetTurn(): void {
    for (const pattern of this.config.perTurn ?? []) {
      if (pattern.endsWith("*")) {
        // Wildcard pattern - delete all trackers matching the prefix
        const prefix = pattern.slice(0, -1); // Remove the "*"
        const keysToDelete: string[] = [];
        for (const trackerName of this.state.keys()) {
          if (trackerName.startsWith(prefix)) {
            keysToDelete.push(trackerName);
          }
        }
        for (const key of keysToDelete) {
          this.state.delete(key);
        }
      } else {
        // Exact match - delete specific tracker
        this.state.delete(pattern);
      }
    }
  }

  /**
   * Reset all trackers for a specific phase
   * Supports wildcard patterns (e.g., "action:*" matches "action:move", "action:attack", etc.)
   */
  public resetPhase(phaseName: string): void {
    const phaseTrackers = this.config.perPhase?.[phaseName] ?? [];
    for (const pattern of phaseTrackers) {
      if (pattern.endsWith("*")) {
        // Wildcard pattern - delete all trackers matching the prefix
        const prefix = pattern.slice(0, -1); // Remove the "*"
        const keysToDelete: string[] = [];
        for (const trackerName of this.state.keys()) {
          if (trackerName.startsWith(prefix)) {
            keysToDelete.push(trackerName);
          }
        }
        for (const key of keysToDelete) {
          this.state.delete(key);
        }
      } else {
        // Exact match - delete specific tracker
        this.state.delete(pattern);
      }
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
      result[name] = [...playerSet];
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
