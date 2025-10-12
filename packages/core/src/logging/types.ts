/**
 * Logging Types
 *
 * Type definitions for the TCG Core logging system.
 * Provides structured logging with configurable verbosity levels.
 */

/**
 * Log Level Enum
 *
 * Numeric levels for log filtering (lower = more critical)
 * - SILENT (0): No logging
 * - ERROR (1): Error conditions only
 * - WARN (2): Warning conditions
 * - INFO (3): Informational messages
 * - DEBUG (4): Debug-level messages
 * - TRACE (5): Trace-level messages (most verbose)
 */
export enum LogLevel {
  SILENT = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
  TRACE = 5,
}

/**
 * Verbosity Preset
 *
 * Named presets for different user types:
 * - SILENT: No logging (production default)
 * - NORMAL_PLAYER: Basic game events (INFO level)
 * - ADVANCED_PLAYER: Detailed mechanics (DEBUG level)
 * - DEVELOPER: Full internal details (TRACE level)
 */
export type VerbosityPreset =
  | "SILENT"
  | "NORMAL_PLAYER"
  | "ADVANCED_PLAYER"
  | "DEVELOPER";

/**
 * Log Context
 *
 * Structured context information attached to log entries.
 * Provides rich metadata for filtering, searching, and analysis.
 *
 * Common fields:
 * - moveId: Move being executed
 * - playerId: Player performing action
 * - phase: Current game phase
 * - turn: Current turn number
 * - timestamp: Event timestamp
 *
 * Games can add custom fields via index signature.
 */
export type LogContext = {
  /** Move identifier */
  moveId?: string;
  /** Player identifier */
  playerId?: string;
  /** Current game phase */
  phase?: string;
  /** Current game segment */
  segment?: string;
  /** Current turn number */
  turn?: number;
  /** Event timestamp */
  timestamp?: number;
  /** Error message (for error logs) */
  error?: string;
  /** Stack trace (for error logs) */
  stack?: string;
  /** Error code (for structured errors) */
  errorCode?: string;
  /** Operation duration in milliseconds */
  duration?: number;
  /** Number of patches generated */
  patchCount?: number;
  /** Custom context fields */
  [key: string]: unknown;
};

/**
 * Logger Options
 *
 * Configuration for Logger instances.
 *
 * @example
 * ```typescript
 * // Use preset for convenience
 * const options: LoggerOptions = {
 *   level: 'DEVELOPER',
 *   pretty: true
 * };
 *
 * // Or use numeric level for fine control
 * const options: LoggerOptions = {
 *   level: LogLevel.DEBUG,
 *   pretty: false,
 *   destination: process.stdout
 * };
 * ```
 */
export type LoggerOptions = {
  /**
   * Log level or verbosity preset
   *
   * Controls which messages are logged:
   * - String presets: SILENT, NORMAL_PLAYER, ADVANCED_PLAYER, DEVELOPER
   * - Numeric levels: LogLevel.SILENT through LogLevel.TRACE
   *
   * Default: 'SILENT' (no logging)
   */
  level?: VerbosityPreset | LogLevel;

  /**
   * Enable pretty printing
   *
   * When true, formats logs for human readability.
   * When false, outputs JSON for machine consumption.
   *
   * Default: true
   */
  pretty?: boolean;

  /**
   * Log destination
   *
   * Where to write log output:
   * - process.stdout (default)
   * - process.stderr
   * - Writable stream
   * - File descriptor
   *
   * Default: process.stdout
   */
  destination?: unknown;

  /**
   * Additional Pino options
   *
   * Advanced configuration passed directly to Pino.
   * See Pino documentation for available options.
   */
  [key: string]: unknown;
};
