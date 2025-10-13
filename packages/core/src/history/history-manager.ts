/**
 * History Manager
 *
 * Manages game move history with Immer-based immutable store.
 * Tracks all move executions chronologically with player-aware visibility.
 */

import { nanoid } from "nanoid";
import type { PlayerId } from "../types/branded";
import type {
  FormattedHistoryEntry,
  HistoryEntry,
  HistoryQueryOptions,
  MessageTemplateData,
  VerbosityLevel,
  VerbosityMessages,
} from "./types";

/**
 * History Manager Options
 *
 * Configuration for HistoryManager initialization.
 */
export type HistoryManagerOptions = {
  /** Initial entries (for replay/restore) */
  initialEntries?: HistoryEntry[];
};

/**
 * History Manager
 *
 * In-memory store for game move history.
 * Uses simple array storage (Immer patches handle immutability at engine level).
 *
 * @example
 * ```typescript
 * const manager = new HistoryManager();
 *
 * // Add entry
 * manager.addEntry({
 *   moveId: 'playCard',
 *   playerId: 'p1',
 *   params: { cardId: 'card-123' },
 *   timestamp: Date.now(),
 *   success: true,
 *   messages: {
 *     visibility: 'PUBLIC',
 *     messages: {
 *       casual: { key: 'moves.playCard', values: { card: 'Knight' } }
 *     }
 *   }
 * });
 *
 * // Query history
 * const entries = manager.query({ playerId: 'p1', verbosity: 'CASUAL' });
 * ```
 */
export class HistoryManager {
  private entries: HistoryEntry[];

  /**
   * Create a new HistoryManager
   *
   * @param options - Configuration options
   */
  constructor(options: HistoryManagerOptions = {}) {
    this.entries = options.initialEntries ?? [];
  }

  /**
   * Add a new history entry
   *
   * @param entry - Entry data (without id - will be generated)
   * @returns The created entry with generated id
   */
  addEntry(entry: Omit<HistoryEntry, "id">): HistoryEntry {
    const fullEntry: HistoryEntry = {
      id: nanoid(),
      ...entry,
    };

    this.entries.push(fullEntry);
    return fullEntry;
  }

  /**
   * Query history entries with filtering and formatting
   *
   * @param options - Query options
   * @returns Formatted entries matching the query
   */
  query(options: HistoryQueryOptions = {}): FormattedHistoryEntry[] {
    const {
      playerId,
      verbosity = "CASUAL",
      since,
      moveId,
      includeSuccess = true,
      includeFailures = true,
    } = options;

    // Filter entries
    let filtered = this.entries;

    // Filter by timestamp
    if (since !== undefined) {
      filtered = filtered.filter((entry) => entry.timestamp > since);
    }

    // Filter by move ID
    if (moveId !== undefined) {
      filtered = filtered.filter((entry) => entry.moveId === moveId);
    }

    // Filter by success/failure
    if (!includeSuccess) {
      filtered = filtered.filter((entry) => !entry.success);
    }
    if (!includeFailures) {
      filtered = filtered.filter((entry) => entry.success);
    }

    // Filter by player visibility and format
    return filtered
      .map((entry) => this.formatEntry(entry, playerId, verbosity))
      .filter((entry): entry is FormattedHistoryEntry => entry !== null);
  }

  /**
   * Get all entries (raw, no filtering)
   *
   * Used for debugging and serialization.
   *
   * @returns All history entries
   */
  getAllEntries(): readonly HistoryEntry[] {
    return this.entries;
  }

  /**
   * Clear all history entries
   *
   * Used for testing.
   */
  clear(): void {
    this.entries = [];
  }

  /**
   * Get the number of entries
   *
   * @returns Entry count
   */
  getCount(): number {
    return this.entries.length;
  }

  /**
   * Check if player can see this entry
   *
   * @param entry - History entry
   * @param playerId - Player requesting access (undefined = see all)
   * @returns True if player can see this entry
   */
  private canPlayerSeeEntry(
    entry: HistoryEntry,
    playerId: PlayerId | undefined,
  ): boolean {
    // If no player filter, show all entries
    if (playerId === undefined) {
      return true;
    }

    const { messages } = entry;

    // PUBLIC entries are visible to all
    if (messages.visibility === "PUBLIC") {
      return true;
    }

    // PRIVATE entries are visible only to specified players
    if (messages.visibility === "PRIVATE") {
      return (
        messages.visibleTo === undefined ||
        messages.visibleTo.some((id) => String(id) === String(playerId))
      );
    }

    // PLAYER_SPECIFIC entries are visible if player has a message
    if (messages.visibility === "PLAYER_SPECIFIC") {
      return String(playerId) in messages.messages;
    }

    return false;
  }

  /**
   * Format an entry for display
   *
   * @param entry - Raw history entry
   * @param playerId - Player requesting the entry (for filtering)
   * @param verbosity - Verbosity level for message selection
   * @returns Formatted entry or null if player can't see it
   */
  private formatEntry(
    entry: HistoryEntry,
    playerId: PlayerId | undefined,
    verbosity: VerbosityLevel,
  ): FormattedHistoryEntry | null {
    // Check visibility
    if (!this.canPlayerSeeEntry(entry, playerId)) {
      return null;
    }

    // Get message for this player and verbosity
    const message = this.getMessageForPlayer(entry, playerId, verbosity);
    if (!message) {
      return null;
    }

    // Build formatted entry
    const formatted: FormattedHistoryEntry = {
      id: entry.id,
      moveId: entry.moveId,
      playerId: entry.playerId,
      timestamp: entry.timestamp,
      turn: entry.turn,
      phase: entry.phase,
      segment: entry.segment,
      message,
      success: entry.success,
      error: entry.error,
    };

    // Include additional details for DEVELOPER mode
    if (verbosity === "DEVELOPER") {
      formatted.metadata = entry.metadata;
      formatted.params = entry.params;
    }

    return formatted;
  }

  /**
   * Get the appropriate message for a player and verbosity level
   *
   * @param entry - History entry
   * @param playerId - Player requesting the message
   * @param verbosity - Verbosity level
   * @returns Message template data or null if no message available
   */
  private getMessageForPlayer(
    entry: HistoryEntry,
    playerId: PlayerId | undefined,
    verbosity: VerbosityLevel,
  ): MessageTemplateData | null {
    const { messages } = entry;

    // Get verbosity-specific messages
    let verbosityMessages: VerbosityMessages | undefined;

    if (messages.visibility === "PUBLIC" || messages.visibility === "PRIVATE") {
      verbosityMessages = messages.messages;
    } else if (messages.visibility === "PLAYER_SPECIFIC") {
      // Get player-specific messages
      if (playerId !== undefined) {
        verbosityMessages = messages.messages[String(playerId)];
      } else {
        // If no player specified, use first available
        const firstPlayerId = Object.keys(messages.messages)[0];
        if (firstPlayerId) {
          verbosityMessages = messages.messages[firstPlayerId];
        }
      }
    }

    if (!verbosityMessages) {
      return null;
    }

    // Select message based on verbosity level with fallback
    return this.selectMessageByVerbosity(verbosityMessages, verbosity);
  }

  /**
   * Select message by verbosity level with fallback
   *
   * Falls back to less detailed level if requested level not available:
   * DEVELOPER -> ADVANCED -> CASUAL
   *
   * @param messages - Verbosity-specific messages
   * @param verbosity - Requested verbosity level
   * @returns Message template data or null if no messages available
   */
  private selectMessageByVerbosity(
    messages: VerbosityMessages,
    verbosity: VerbosityLevel,
  ): MessageTemplateData | null {
    switch (verbosity) {
      case "DEVELOPER":
        return (
          messages.developer ?? messages.advanced ?? messages.casual ?? null
        );
      case "ADVANCED":
        return messages.advanced ?? messages.casual ?? null;
      case "CASUAL":
        return messages.casual ?? null;
      default:
        return messages.casual ?? null;
    }
  }
}
