import type { MoveExecutionLatencySummaryParams } from "$lib/analytics/types.js";

export const MOVE_EXECUTION_LATENCY_FLUSH_INTERVAL = 10;

export type MoveExecutionLatencyFlushReason = MoveExecutionLatencySummaryParams["flush_reason"];

export type MoveExecutionLatencyContext = Pick<
  MoveExecutionLatencySummaryParams,
  "deck_id" | "format" | "mode"
>;

export interface MoveExecutionLatencyCounters {
  executions_total: number;
  max_duration_ms: number;
  over_200_count: number;
  over_500_count: number;
}

export function createEmptyMoveExecutionLatencyCounters(): MoveExecutionLatencyCounters {
  return {
    executions_total: 0,
    max_duration_ms: 0,
    over_200_count: 0,
    over_500_count: 0,
  };
}

export function recordMoveExecutionLatency(
  counters: MoveExecutionLatencyCounters,
  durationMs: number,
): MoveExecutionLatencyCounters {
  const normalizedDurationMs = Math.max(0, Math.round(durationMs));
  return {
    executions_total: counters.executions_total + 1,
    max_duration_ms: Math.max(counters.max_duration_ms, normalizedDurationMs),
    over_200_count: counters.over_200_count + (normalizedDurationMs > 200 ? 1 : 0),
    over_500_count: counters.over_500_count + (normalizedDurationMs > 500 ? 1 : 0),
  };
}

export function shouldFlushMoveExecutionLatency(counters: MoveExecutionLatencyCounters): boolean {
  return counters.executions_total >= MOVE_EXECUTION_LATENCY_FLUSH_INTERVAL;
}

export function buildMoveExecutionLatencySummary(
  counters: MoveExecutionLatencyCounters,
  flushReason: MoveExecutionLatencyFlushReason,
  context: MoveExecutionLatencyContext = {},
): MoveExecutionLatencySummaryParams | null {
  if (counters.executions_total === 0) {
    return null;
  }

  return {
    ...counters,
    flush_reason: flushReason,
    ...(context.mode ? { mode: context.mode } : {}),
    ...(context.format ? { format: context.format } : {}),
    ...(context.deck_id ? { deck_id: context.deck_id } : {}),
  };
}
