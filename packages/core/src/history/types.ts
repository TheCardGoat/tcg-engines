/**
 * History Types
 *
 * Type definitions for the game move history system.
 * Provides structured move logging with player-aware visibility and i18next localization.
 */

import type { PlayerId } from "../types/branded";

/**
 * Verbosity Level
 *
 * Controls the level of detail in history messages:
 * - CASUAL: Simple, narrative descriptions for casual players
 * - ADVANCED: Technical details for competitive players
 * - DEVELOPER: Full internal details for debugging
 */
export type VerbosityLevel = "CASUAL" | "ADVANCED" | "DEVELOPER";

/**
 * Visibility Level
 *
 * Controls who can see a history entry:
 * - PUBLIC: Visible to all players
 * - PRIVATE: Visible only to specific player(s)
 * - PLAYER_SPECIFIC: Different details shown to different players
 */
export type VisibilityLevel = "PUBLIC" | "PRIVATE" | "PLAYER_SPECIFIC";

/**
 * Message Template Data
 *
 * i18next-compatible message template with interpolation values.
 *
 * @example
 * ```typescript
 * // Template: "{{player}} drew {{count}} cards"
 * {
 *   key: "moves.draw.success",
 *   values: { player: "Player 1", count: 5 }
 * }
 * ```
 */
export type MessageTemplateData = {
  /** i18next translation key */
  key: string;

  /** Interpolation values for the template */
  values?: Record<string, unknown>;
};

/**
 * Verbosity-Specific Messages
 *
 * Different message templates for different verbosity levels.
 * All levels are optional; if not provided, falls back to less detailed level.
 *
 * @example
 * ```typescript
 * {
 *   casual: { key: "moves.mulligan.casual", values: { count: 3 } },
 *   advanced: { key: "moves.mulligan.advanced", values: { cardIds: [...] } },
 *   developer: { key: "moves.mulligan.dev", values: { fullContext: {...} } }
 * }
 * ```
 */
export type VerbosityMessages = {
  /** Message for casual players (simple, narrative) */
  casual?: MessageTemplateData;

  /** Message for advanced players (technical details) */
  advanced?: MessageTemplateData;

  /** Message for developers (full internal details) */
  developer?: MessageTemplateData;
};

/**
 * Player-Specific Message Data
 *
 * Different message templates shown to different players.
 * Used for moves with private information (e.g., opponent mulligans).
 *
 * @example
 * ```typescript
 * // Mulligan: owning player sees cards, opponent sees count only
 * {
 *   player_one: {
 *     casual: { key: "mulligan.self", values: { cards: ["card1", "card2"] } }
 *   },
 *   player_two: {
 *     casual: { key: "mulligan.opponent", values: { count: 2 } }
 *   }
 * }
 * ```
 */
export type PlayerSpecificMessages = Record<string, VerbosityMessages>;

/**
 * History Entry Messages
 *
 * Message templates for a history entry.
 * Can be public (same for all) or player-specific (different per player).
 */
export type HistoryMessages =
  | {
      visibility: "PUBLIC" | "PRIVATE";
      /** Messages at different verbosity levels */
      messages: VerbosityMessages;
      /** If PRIVATE, which player(s) can see this entry */
      visibleTo?: PlayerId[];
    }
  | {
      visibility: "PLAYER_SPECIFIC";
      /** Different messages for different players */
      messages: PlayerSpecificMessages;
    };

/**
 * History Entry
 *
 * A single entry in the game move history.
 * Contains all information about a move execution including messages,
 * visibility, and raw data for debugging.
 */
export type HistoryEntry = {
  /** Unique identifier for this entry */
  id: string;

  /** Move ID that was executed */
  moveId: string;

  /** Player who executed the move */
  playerId: PlayerId;

  /** Move-specific parameters */
  params: unknown;

  /** Timestamp when move was executed (milliseconds) */
  timestamp: number;

  /** Turn number when move was executed */
  turn?: number;

  /** Game phase when move was executed */
  phase?: string;

  /** Game segment when move was executed */
  segment?: string;

  /** Message templates for this entry */
  messages: HistoryMessages;

  /** Whether the move was successful */
  success: boolean;

  /** Error information if move failed */
  error?: {
    /** Error code */
    code: string;
    /** Error message */
    message: string;
    /** Additional error context */
    context?: Record<string, unknown>;
  };

  /** Additional metadata for debugging */
  metadata?: Record<string, unknown>;
};

/**
 * Formatted History Entry
 *
 * A history entry with formatted message ready for display.
 * Returned by getHistory() after filtering and formatting.
 */
export type FormattedHistoryEntry = {
  /** Unique identifier for this entry */
  id: string;

  /** Move ID that was executed */
  moveId: string;

  /** Player who executed the move */
  playerId: PlayerId;

  /** Timestamp when move was executed (milliseconds) */
  timestamp: number;

  /** Turn number when move was executed */
  turn?: number;

  /** Game phase when move was executed */
  phase?: string;

  /** Game segment when move was executed */
  segment?: string;

  /** Formatted message ready for display */
  message: MessageTemplateData;

  /** Whether the move was successful */
  success: boolean;

  /** Error information if move failed */
  error?: {
    code: string;
    message: string;
    context?: Record<string, unknown>;
  };

  /** Additional metadata (only included in DEVELOPER mode) */
  metadata?: Record<string, unknown>;

  /** Raw parameters (only included in DEVELOPER mode) */
  params?: unknown;
};

/**
 * History Query Options
 *
 * Options for querying game history.
 */
export type HistoryQueryOptions = {
  /** Filter to entries visible to this player (undefined = all entries) */
  playerId?: PlayerId;

  /** Verbosity level for message formatting */
  verbosity?: VerbosityLevel;

  /** Only return entries after this timestamp */
  since?: number;

  /** Only return entries for this move ID */
  moveId?: string;

  /** Include successful moves (default: true) */
  includeSuccess?: boolean;

  /** Include failed moves (default: true) */
  includeFailures?: boolean;
};

/**
 * Log Entry Input
 *
 * Input data for creating a history entry via context.history.log()
 */
export type LogEntryInput = {
  /** Message templates for this entry */
  messages: HistoryMessages;

  /** Additional metadata for debugging */
  metadata?: Record<string, unknown>;
};
