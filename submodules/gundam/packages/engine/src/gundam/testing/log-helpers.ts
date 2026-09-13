/**
 * Player-visible game-log helpers for rules / card tests.
 *
 * Mirrors the Lorcana/Gundam storage model:
 * - PUBLIC entries: visible to everyone
 * - PRIVATE entries: only listed `visibleTo` players
 * Private card identities live in `data.values` (and sometimes only on
 * PRIVATE sibling entries), never on the public summary.
 */

import type { GameLogEntry } from "../../types/game-events.ts";
import type { GundamGameLogEntry, GundamLogMessageKey } from "../logging.ts";
import type { GundamPlayerId, GundamTestEngine } from "./test-engine.ts";
import { PLAYER_ONE, PLAYER_TWO } from "./test-engine.ts";

export type TypedGameLog = {
  entry: GameLogEntry;
  typed: GundamGameLogEntry;
  turnNumber: number;
};

function asTyped(entry: GameLogEntry): GundamGameLogEntry {
  return entry.data as unknown as GundamGameLogEntry;
}

/** Full raw history (includes PRIVATE entries for both players). */
export function getAllGameLogs(engine: GundamTestEngine): TypedGameLog[] {
  return engine
    .getRuntime()
    .getGameLogHistory()
    .map(({ entry, turnNumber }) => ({
      entry,
      typed: asTyped(entry),
      turnNumber,
    }));
}

/** Logs visible to a specific player (storage-layer `visibleTo` filter). */
export function getLogsForPlayer(
  engine: GundamTestEngine,
  playerId: GundamPlayerId,
): TypedGameLog[] {
  return getAllGameLogs(engine).filter(({ entry }) => {
    if (entry.visibleTo === undefined || entry.visibleTo === "all") return true;
    return entry.visibleTo.includes(playerId as never);
  });
}

export function getLogsOfType(
  engine: GundamTestEngine,
  type: GundamLogMessageKey,
  viewer?: GundamPlayerId,
): TypedGameLog[] {
  const source = viewer ? getLogsForPlayer(engine, viewer) : getAllGameLogs(engine);
  return source.filter(({ entry }) => entry.type === type);
}

export function expectLogType(
  engine: GundamTestEngine,
  type: GundamLogMessageKey,
  opts: {
    viewer?: GundamPlayerId;
    min?: number;
    max?: number;
    count?: number;
  } = {},
): TypedGameLog[] {
  const logs = getLogsOfType(engine, type, opts.viewer);
  if (opts.count !== undefined && logs.length !== opts.count) {
    throw new Error(`Expected ${opts.count} log(s) of type ${type}, got ${logs.length}`);
  }
  if (opts.min !== undefined && logs.length < opts.min) {
    throw new Error(`Expected at least ${opts.min} log(s) of type ${type}, got ${logs.length}`);
  }
  if (opts.max !== undefined && logs.length > opts.max) {
    throw new Error(`Expected at most ${opts.max} log(s) of type ${type}, got ${logs.length}`);
  }
  return logs;
}

/** Assert a PUBLIC entry exists with the given values (no private-only fields required). */
export function expectPublicLog(
  engine: GundamTestEngine,
  type: GundamLogMessageKey,
  values: Record<string, unknown>,
): TypedGameLog {
  const matches = getLogsOfType(engine, type).filter(({ entry, typed }) => {
    if (entry.visibleTo !== undefined && entry.visibleTo !== "all") return false;
    if (typed.visibility.mode !== "PUBLIC") return false;
    return Object.entries(values).every(
      ([k, v]) => (typed.values as Record<string, unknown>)[k] === v,
    );
  });
  if (matches.length === 0) {
    throw new Error(
      `Expected PUBLIC log ${type} matching ${JSON.stringify(values)}; found ${
        getLogsOfType(engine, type).length
      } of that type`,
    );
  }
  return matches[0]!;
}

/** Assert a PRIVATE entry is visible only to the listed player(s). */
export function expectPrivateLog(
  engine: GundamTestEngine,
  type: GundamLogMessageKey,
  visibleTo: GundamPlayerId | GundamPlayerId[],
  values: Record<string, unknown> = {},
): TypedGameLog {
  const expectedViewers = Array.isArray(visibleTo) ? visibleTo : [visibleTo];
  const matches = getLogsOfType(engine, type).filter(({ entry, typed }) => {
    if (typed.visibility.mode !== "PRIVATE") return false;
    const viewers = entry.visibleTo;
    if (!Array.isArray(viewers)) return false;
    if (expectedViewers.some((id) => !viewers.includes(id as never))) return false;
    return Object.entries(values).every(([k, v]) => {
      const actual = (typed.values as Record<string, unknown>)[k];
      if (Array.isArray(v)) {
        return (
          Array.isArray(actual) && v.length === actual.length && v.every((x) => actual.includes(x))
        );
      }
      return actual === v;
    });
  });
  if (matches.length === 0) {
    throw new Error(
      `Expected PRIVATE log ${type} visible to [${expectedViewers.join(", ")}] matching ${JSON.stringify(values)}`,
    );
  }

  // Opponent must not see this entry when it is single-player private.
  for (const viewer of expectedViewers) {
    const other = viewer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    if (expectedViewers.includes(other)) continue;
    const leaked = getLogsForPlayer(engine, other).some((l) => l.entry.id === matches[0]!.entry.id);
    if (leaked) {
      throw new Error(`PRIVATE log ${type} leaked to ${other}`);
    }
  }

  return matches[0]!;
}

/**
 * Assert that for a given type, every viewer-visible entry omits private
 * identity fields (e.g. cardIds / returnedCardIds / drawnCardIds).
 */
export function expectNoPrivateCardIdsInViewerLogs(
  engine: GundamTestEngine,
  type: GundamLogMessageKey,
  viewer: GundamPlayerId,
  privateFields: readonly string[] = ["cardIds", "returnedCardIds", "drawnCardIds"],
): void {
  for (const { typed } of getLogsOfType(engine, type, viewer)) {
    const values = typed.values as Record<string, unknown>;
    for (const field of privateFields) {
      if (values[field] !== undefined) {
        // Private detail is allowed for the owner — only flag if this entry is PUBLIC
        if (typed.visibility.mode === "PUBLIC") {
          throw new Error(`PUBLIC ${type} for viewer ${viewer} leaked private field ${field}`);
        }
      }
    }
  }
}
