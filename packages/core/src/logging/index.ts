/**
 * Logging Module
 *
 * Production-grade structured logging for TCG Core.
 *
 * @example
 * ```typescript
 * import { Logger, LogLevel } from '@tcg/core/logging';
 *
 * const logger = new Logger({
 *   level: 'DEVELOPER',
 *   pretty: true
 * });
 *
 * logger.info('Game started', { players: 2 });
 * logger.debug('Move validated', { moveId, validationResult });
 * ```
 */

export { createPinoFormatter, formatMessage } from "./log-formatter";
export { Logger } from "./logger";
export { type LogContext, type LoggerOptions, LogLevel, type VerbosityPreset } from "./types";
