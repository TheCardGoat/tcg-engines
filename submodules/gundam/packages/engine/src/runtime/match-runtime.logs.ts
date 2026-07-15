/**
 * Game log system — Collects, indexes, and projects game log entries.
 */

import type { GameLogEntry } from "../types/game-events.ts";
import type { PlayerId } from "../types/branded.ts";
import type { LogEntry } from "../types/move-types.ts";

// ── Projection interface ────────────────────────────────────────────────────

export interface GameLogProjection {
  /** All log entries */
  entries: GameLogEntry[];
  /** Get entries visible to a specific player */
  getForPlayer: (playerId: PlayerId) => GameLogEntry[];
  /** Get entries by type */
  getByType: (type: string) => GameLogEntry[];
  /** Get entries in a state range */
  getInRange: (fromStateID: number, toStateID: number) => GameLogEntry[];
}

// ── GameLogger ──────────────────────────────────────────────────────────────

/**
 * Collects log entries during command execution. Create one per command,
 * call log() during move execution, then retrieve entries and clear.
 */
export class GameLogger {
  private entries: GameLogEntry[] = [];
  private idCounter: number;

  constructor(startId: number = 0) {
    this.idCounter = startId;
  }

  /**
   * Add one or more log entries for the current command.
   *
   * @param entry - A single LogEntry or an array of LogEntry objects
   * @param stateID - The current stateID at the time of logging
   * @param playerId - Optional player who caused this log
   */
  log(entry: LogEntry | readonly LogEntry[], stateID: number, playerId?: PlayerId): void {
    const entries = Array.isArray(entry) ? entry : [entry];
    for (const e of entries) {
      this.entries.push({
        id: this.idCounter++,
        stateID,
        timestamp: Date.now(),
        type: e.type,
        message: e.message,
        playerId: e.playerId ?? playerId,
        cardIds: e.cardIds,
        data: e.data,
        visibleTo: e.visibleTo ?? "all",
      });
    }
  }

  /**
   * Get all entries collected so far during this command.
   */
  getEntries(): GameLogEntry[] {
    return [...this.entries];
  }

  /**
   * Get the current id counter value (useful for chaining loggers).
   */
  getNextId(): number {
    return this.idCounter;
  }

  /**
   * Reset for the next command.
   */
  clear(): void {
    this.entries = [];
  }
}

// ── Log projection ──────────────────────────────────────────────────────────

/**
 * Build a GameLogProjection from all accumulated log entries.
 * Indexes by type and stateID for efficient queries.
 */
export function createLogProjection(allEntries: GameLogEntry[]): GameLogProjection {
  // Build index by type
  const byType = new Map<string, GameLogEntry[]>();
  for (const entry of allEntries) {
    let list = byType.get(entry.type);
    if (!list) {
      list = [];
      byType.set(entry.type, list);
    }
    list.push(entry);
  }

  // Build sorted stateID index for efficient range queries.
  // Entries are assumed to be in insertion order which generally
  // correlates with stateID order, but we sort to be safe.
  const sortedByStateID = [...allEntries].sort((a, b) => a.stateID - b.stateID);

  return {
    entries: allEntries,

    getForPlayer(playerId: PlayerId): GameLogEntry[] {
      return allEntries.filter((entry) => {
        if (entry.visibleTo === undefined || entry.visibleTo === "all") {
          return true;
        }
        return entry.visibleTo.includes(playerId);
      });
    },

    getByType(type: string): GameLogEntry[] {
      return byType.get(type) ?? [];
    },

    getInRange(fromStateID: number, toStateID: number): GameLogEntry[] {
      // Binary search for the start position
      let lo = 0;
      let hi = sortedByStateID.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (sortedByStateID[mid]!.stateID < fromStateID) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }

      const result: GameLogEntry[] = [];
      for (let i = lo; i < sortedByStateID.length; i++) {
        const entry = sortedByStateID[i]!;
        if (entry.stateID > toStateID) {
          break;
        }
        result.push(entry);
      }
      return result;
    },
  };
}
