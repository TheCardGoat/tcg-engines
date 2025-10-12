/**
 * Logger Class
 *
 * Core logging implementation wrapping Pino with TCG-specific features.
 * Provides structured logging with configurable verbosity levels.
 */

import pino, { type Logger as PinoLogger } from "pino";
import { type LogContext, type LoggerOptions, LogLevel } from "./types";

/**
 * Logger
 *
 * Structured logger with verbosity control and child logger support.
 *
 * Features:
 * - Zero-overhead SILENT mode
 * - Child loggers with namespace isolation
 * - Structured context merging
 * - Preset-based verbosity levels
 *
 * @example
 * ```typescript
 * const logger = new Logger({ level: 'DEVELOPER', pretty: true });
 *
 * logger.info('Game started', { players: 2 });
 * logger.debug('Move executed', { moveId: 'playCard', duration: 15 });
 *
 * const childLogger = logger.child('flow');
 * childLogger.info('Phase transition', { from: 'main', to: 'combat' });
 * ```
 */
export class Logger {
  private pinoLogger: PinoLogger | null;
  private currentLevel: LogLevel;
  private namespace?: string;

  /**
   * Create a new Logger instance
   *
   * @param options - Logger configuration
   */
  constructor(options: LoggerOptions = {}) {
    const level = options.level ?? "SILENT";

    // Map preset/level to numeric LogLevel
    this.currentLevel = this.mapToLogLevel(level);

    // For SILENT mode, skip Pino initialization entirely (zero overhead)
    if (this.currentLevel === LogLevel.SILENT) {
      this.pinoLogger = null;
      return;
    }

    // Map to Pino level strings
    const pinoLevel = this.mapToPinoLevel(this.currentLevel);

    // Configure Pino
    const { level: _, ...restOptions } = options;
    const pinoOptions: pino.LoggerOptions = {
      level: pinoLevel,
      ...restOptions,
    };

    // Add pretty printing if requested
    if (options.pretty !== false) {
      pinoOptions.transport = {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss.l",
          ignore: "pid,hostname",
        },
      };
    }

    // Create Pino logger
    this.pinoLogger = pino(pinoOptions);
  }

  /**
   * Map preset or numeric level to LogLevel enum
   */
  private mapToLogLevel(level: string | LogLevel): LogLevel {
    if (typeof level === "number") {
      return level;
    }

    // Map preset strings to LogLevel
    const presetMap: Record<string, LogLevel> = {
      SILENT: LogLevel.SILENT,
      NORMAL_PLAYER: LogLevel.INFO,
      ADVANCED_PLAYER: LogLevel.DEBUG,
      DEVELOPER: LogLevel.TRACE,
    };

    return presetMap[level] ?? LogLevel.SILENT;
  }

  /**
   * Map LogLevel to Pino level string
   */
  private mapToPinoLevel(level: LogLevel): pino.Level | "silent" {
    const levelMap: Record<LogLevel, pino.Level | "silent"> = {
      [LogLevel.SILENT]: "silent",
      [LogLevel.ERROR]: "error",
      [LogLevel.WARN]: "warn",
      [LogLevel.INFO]: "info",
      [LogLevel.DEBUG]: "debug",
      [LogLevel.TRACE]: "trace",
    };

    return levelMap[level] ?? "silent";
  }

  /**
   * Check if a specific level is enabled
   */
  private isLevelEnabled(level: LogLevel): boolean {
    return this.currentLevel >= level;
  }

  /**
   * Merge namespace into context
   */
  private mergeContext(context?: LogContext): LogContext {
    if (!this.namespace) {
      return context ?? {};
    }

    return {
      namespace: this.namespace,
      ...context,
    };
  }

  /**
   * Log trace message (TRACE level)
   *
   * Most verbose logging for internal operations.
   * Use for: operation details, state diffs, decision trees
   *
   * @param message - Log message
   * @param context - Structured context
   */
  trace(message: string, context?: LogContext): void {
    // Zero-overhead check for SILENT mode
    if (!(this.pinoLogger && this.isLevelEnabled(LogLevel.TRACE))) {
      return;
    }

    this.pinoLogger.trace(this.mergeContext(context), message);
  }

  /**
   * Log debug message (DEBUG level)
   *
   * Detailed information for debugging and analysis.
   * Use for: rule evaluations, condition checks, mechanics
   *
   * @param message - Log message
   * @param context - Structured context
   */
  debug(message: string, context?: LogContext): void {
    // Zero-overhead check for SILENT mode
    if (!(this.pinoLogger && this.isLevelEnabled(LogLevel.DEBUG))) {
      return;
    }

    this.pinoLogger.debug(this.mergeContext(context), message);
  }

  /**
   * Log info message (INFO level)
   *
   * Standard informational messages about game events.
   * Use for: move execution, phase transitions, game events
   *
   * @param message - Log message
   * @param context - Structured context
   */
  info(message: string, context?: LogContext): void {
    // Zero-overhead check for SILENT mode
    if (!(this.pinoLogger && this.isLevelEnabled(LogLevel.INFO))) {
      return;
    }

    this.pinoLogger.info(this.mergeContext(context), message);
  }

  /**
   * Log warning message (WARN level)
   *
   * Warning conditions that don't prevent execution.
   * Use for: failed conditions, invalid moves, edge cases
   *
   * @param message - Log message
   * @param context - Structured context
   */
  warn(message: string, context?: LogContext): void {
    // Zero-overhead check for SILENT mode
    if (!(this.pinoLogger && this.isLevelEnabled(LogLevel.WARN))) {
      return;
    }

    this.pinoLogger.warn(this.mergeContext(context), message);
  }

  /**
   * Log error message (ERROR level)
   *
   * Error conditions requiring attention.
   * Use for: exceptions, failures, critical errors
   *
   * @param message - Log message
   * @param context - Structured context
   */
  error(message: string, context?: LogContext): void {
    // Zero-overhead check for SILENT mode
    if (!(this.pinoLogger && this.isLevelEnabled(LogLevel.ERROR))) {
      return;
    }

    this.pinoLogger.error(this.mergeContext(context), message);
  }

  /**
   * Create child logger with namespace
   *
   * Child loggers inherit configuration but add a namespace
   * to all log entries for filtering and organization.
   *
   * @param namespace - Namespace identifier (e.g., 'flow', 'zones')
   * @returns New Logger instance with namespace
   *
   * @example
   * ```typescript
   * const logger = new Logger({ level: 'DEBUG' });
   * const flowLogger = logger.child('flow');
   *
   * flowLogger.info('Phase transition');
   * // Output: [flow] Phase transition
   * ```
   */
  child(namespace: string): Logger {
    // For SILENT mode, return a new SILENT logger
    if (!this.pinoLogger) {
      return new Logger({ level: "SILENT" });
    }

    // Create child with Pino child logger
    const childLogger = new Logger({ level: this.currentLevel });
    childLogger.pinoLogger = this.pinoLogger.child({ namespace });
    childLogger.namespace = namespace;

    return childLogger;
  }

  /**
   * Get current log level
   *
   * @returns Current LogLevel
   */
  getLevel(): LogLevel {
    return this.currentLevel;
  }

  /**
   * Check if logger is in SILENT mode
   *
   * @returns True if no logging will occur
   */
  isSilent(): boolean {
    return this.currentLevel === LogLevel.SILENT;
  }
}
