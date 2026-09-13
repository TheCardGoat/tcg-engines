import { useMemo } from "react";

import type { SimulatorEventLogEntry, SimulatorMatchHistoryRow } from "@tcg/simulator-contract";
import {
  projectFabPlayerNarrativeEntries,
  projectFabPlayerNarrativeHistory,
  projectFabPlayerNarrativeMatchStart,
} from "./player-narrative-projection";

import type { FabLiveEngineLogRecord } from "./live-engine-log";
export { appendFabEngineLogRecords, type FabLiveEngineLogRecord } from "./live-engine-log";

const EMPTY_EVENT_LOG: readonly SimulatorEventLogEntry[] = [];
const EMPTY_MATCH_HISTORY: readonly SimulatorMatchHistoryRow[] = [];

/**
 * Project accumulated live engine log records into panel entries.
 *
 * Memoized on the records identity (stable between batches by contract of
 * {@link appendFabEngineLogRecords}), so the projection runs once per
 * engine batch. A null viewer (spectator bootstraps) yields no entries;
 * live records arrive pre-composed for the viewer, so this layer never sees
 * another player's private replacement map.
 */
export function useFabEventLog({
  records,
  viewerId,
  seatIds,
}: {
  readonly records: readonly FabLiveEngineLogRecord[];
  readonly viewerId: string | null;
  readonly seatIds?: readonly string[];
}): readonly SimulatorEventLogEntry[] {
  return useMemo(() => {
    if (viewerId == null || records.length === 0) return EMPTY_EVENT_LOG;
    return projectFabPlayerNarrativeEntries(
      records.map((record) => record.log),
      { viewerId, seatIds: seatIds ?? [viewerId] },
    );
  }, [records, viewerId, seatIds]);
}

export function useFabMatchHistory({
  records,
  viewerId,
  seatIds,
  firstTurnPlayerId,
}: {
  readonly records: readonly FabLiveEngineLogRecord[];
  readonly viewerId: string | null;
  readonly seatIds?: readonly string[];
  readonly firstTurnPlayerId?: string;
}): readonly SimulatorMatchHistoryRow[] {
  return useMemo(() => {
    if (viewerId == null) return EMPTY_MATCH_HISTORY;
    const projectionOptions = {
      viewerId,
      seatIds: seatIds ?? [viewerId],
    } as const;
    const narrative = projectFabPlayerNarrativeHistory(
      records.map((record) => record.log),
      projectionOptions,
    );
    const firstPlayerId = firstTurnPlayerId ?? records[0]?.log.turnPlayerId;
    return firstPlayerId
      ? [
          projectFabPlayerNarrativeMatchStart(firstPlayerId, {
            ...projectionOptions,
            ...(records[0] ? { timestamp: records[0].log.timestamp } : {}),
          }),
          ...narrative,
        ]
      : narrative;
  }, [records, viewerId, seatIds, firstTurnPlayerId]);
}
