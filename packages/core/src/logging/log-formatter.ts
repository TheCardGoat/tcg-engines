/**
 * Log Formatter
 *
 * Custom formatters for player-friendly log messages.
 * Transforms internal engine events into readable output.
 */

import type { LogContext, VerbosityPreset } from "./types";

/**
 * Format log message for player-friendly output
 *
 * Transforms raw log messages and context into readable format
 * based on the current verbosity level.
 *
 * @param message - Raw log message
 * @param context - Log context with metadata
 * @param level - Current verbosity preset
 * @returns Formatted message string
 */
export function formatMessage(
  message: string,
  context: LogContext,
  level: VerbosityPreset,
): string {
  // For SILENT, return empty (should never be called)
  if (level === "SILENT") {
    return "";
  }

  // NORMAL_PLAYER: Simple, clear messages
  if (level === "NORMAL_PLAYER") {
    return formatForNormalPlayer(message, context);
  }

  // ADVANCED_PLAYER: Include game mechanics details
  if (level === "ADVANCED_PLAYER") {
    return formatForAdvancedPlayer(message, context);
  }

  // DEVELOPER: Full internal details
  return formatForDeveloper(message, context);
}

/**
 * Format message for normal players
 *
 * Focus on basic game events without technical details.
 * Examples: "Card played", "Turn ended", "Player drew 2 cards"
 */
function formatForNormalPlayer(message: string, context: LogContext): string {
  let formatted = message;

  // Add player context if available
  if (context.playerId) {
    formatted = `[Player ${context.playerId}] ${formatted}`;
  }

  // Add turn context if available
  if (context.turn !== undefined) {
    formatted = `[Turn ${context.turn}] ${formatted}`;
  }

  return formatted;
}

/**
 * Format message for advanced players
 *
 * Include game mechanics and rule details.
 * Examples: "Card played (cost: 3 mana)", "Phase transition: Main -> Combat"
 */
function formatForAdvancedPlayer(message: string, context: LogContext): string {
  let formatted = message;

  // Add comprehensive game state context
  const contextParts: string[] = [];

  if (context.turn !== undefined) {
    contextParts.push(`Turn ${context.turn}`);
  }

  if (context.phase) {
    contextParts.push(`Phase: ${context.phase}`);
  }

  if (context.playerId) {
    contextParts.push(`Player: ${context.playerId}`);
  }

  if (contextParts.length > 0) {
    formatted = `[${contextParts.join(" | ")}] ${formatted}`;
  }

  // Add duration for performance-sensitive operations
  if (context.duration !== undefined) {
    formatted += ` (${context.duration}ms)`;
  }

  return formatted;
}

/**
 * Format message for developers
 *
 * Include all internal details for debugging.
 * Examples: Full context object, stack traces, state diffs
 */
function formatForDeveloper(message: string, context: LogContext): string {
  let formatted = message;

  // Add full context breadcrumbs
  const contextParts: string[] = [];

  if (context.turn !== undefined) {
    contextParts.push(`T${context.turn}`);
  }

  if (context.segment) {
    contextParts.push(`S:${context.segment}`);
  }

  if (context.phase) {
    contextParts.push(`P:${context.phase}`);
  }

  if (context.playerId) {
    contextParts.push(`Player:${context.playerId}`);
  }

  if (context.moveId) {
    contextParts.push(`Move:${context.moveId}`);
  }

  if (contextParts.length > 0) {
    formatted = `[${contextParts.join("|")}] ${formatted}`;
  }

  // Add performance metrics
  if (context.duration !== undefined) {
    formatted += ` [${context.duration}ms]`;
  }

  if (context.patchCount !== undefined) {
    formatted += ` [${context.patchCount} patches]`;
  }

  // Add error details
  if (context.errorCode) {
    formatted += ` [${context.errorCode}]`;
  }

  return formatted;
}

/**
 * Create Pino formatter options
 *
 * Returns Pino transport configuration for pretty printing
 * based on verbosity level.
 *
 * @param level - Verbosity preset
 * @returns Pino transport options
 */
export function createPinoFormatter(level: VerbosityPreset): unknown {
  // For SILENT, no formatter needed
  if (level === "SILENT") {
    return undefined;
  }

  // Configure pino-pretty for human-readable output
  return {
    options: {
      colorize: true,
      translateTime: "HH:MM:ss.l",
      ignore: "pid,hostname",
      // Customize format based on level
      messageFormat:
        level === "DEVELOPER" ? "{msg} {context}" : (level === "ADVANCED_PLAYER" ? "{msg}" : "{msg}"),
    },
    target: "pino-pretty",
  };
}
