/**
 * Gundam test logging configuration.
 *
 * Reads LOG_LEVEL from the environment (debug | info | warn | error | silent).
 * Defaults to "warn" to keep test output clean.
 *
 * Set LOG_LEVEL=debug before running tests to see full engine trace output:
 *   LOG_LEVEL=debug vp test
 *
 * @example
 * ```ts
 * import { testLogger } from "@tcg/gundam-engine/testing";
 * testLogger.debug("deploying unit", { cardId, playerId });
 * testLogger.info("phase transition", { from, to });
 * ```
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

const LEVEL_RANKS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

function resolveConfiguredLevel(): LogLevel {
  const raw = (typeof process !== "undefined" ? process.env["LOG_LEVEL"] : undefined) ?? "warn";
  const normalized = raw.toLowerCase();
  return normalized in LEVEL_RANKS ? (normalized as LogLevel) : "warn";
}

const activeRank = LEVEL_RANKS[resolveConfiguredLevel()];

function makeLogger(name: string) {
  const prefix = `[${name}]`;
  return {
    debug: (...args: unknown[]): void => {
      if (activeRank <= LEVEL_RANKS.debug) console.debug(prefix, ...args);
    },
    info: (...args: unknown[]): void => {
      if (activeRank <= LEVEL_RANKS.info) console.info(prefix, ...args);
    },
    warn: (...args: unknown[]): void => {
      if (activeRank <= LEVEL_RANKS.warn) console.warn(prefix, ...args);
    },
    error: (...args: unknown[]): void => {
      if (activeRank <= LEVEL_RANKS.error) console.error(prefix, ...args);
    },
  };
}

/** Logger for test-level messages (fixture setup, assertion context, etc.) */
export const testLogger = makeLogger("gundam-test");

/** Logger for engine-level messages (move execution, state transitions, etc.) */
export const engineLogger = makeLogger("gundam-engine");
