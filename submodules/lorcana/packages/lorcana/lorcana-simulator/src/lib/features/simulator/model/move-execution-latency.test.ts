import { describe, expect, it } from "bun:test";
import {
  buildMoveExecutionLatencySummary,
  createEmptyMoveExecutionLatencyCounters,
  type MoveExecutionLatencyCounters,
  recordMoveExecutionLatency,
  shouldFlushMoveExecutionLatency,
} from "./move-execution-latency";

describe("move execution latency analytics", () => {
  it("counts strict latency thresholds", () => {
    const counters = [199, 200, 201, 500, 501].reduce<MoveExecutionLatencyCounters>(
      (current, durationMs) => recordMoveExecutionLatency(current, durationMs),
      createEmptyMoveExecutionLatencyCounters(),
    );

    expect(counters).toEqual({
      executions_total: 5,
      over_200_count: 3,
      over_500_count: 1,
      max_duration_ms: 501,
    });
  });

  it("flushes after ten measured executions", () => {
    const nineExecutions = Array.from({ length: 9 }).reduce<MoveExecutionLatencyCounters>(
      (current) => recordMoveExecutionLatency(current, 1),
      createEmptyMoveExecutionLatencyCounters(),
    );
    const tenExecutions = recordMoveExecutionLatency(nineExecutions, 1);

    expect(shouldFlushMoveExecutionLatency(nineExecutions)).toBe(false);
    expect(shouldFlushMoveExecutionLatency(tenExecutions)).toBe(true);
  });

  it("builds aggregate payloads without raw move data", () => {
    const counters = [201, 501].reduce<MoveExecutionLatencyCounters>(
      (current, durationMs) => recordMoveExecutionLatency(current, durationMs),
      createEmptyMoveExecutionLatencyCounters(),
    );

    expect(
      buildMoveExecutionLatencySummary(counters, "interval", {
        mode: "constructed",
        format: "core",
        deck_id: "deck-1",
      }),
    ).toEqual({
      executions_total: 2,
      over_200_count: 2,
      over_500_count: 1,
      max_duration_ms: 501,
      flush_reason: "interval",
      mode: "constructed",
      format: "core",
      deck_id: "deck-1",
    });
  });

  it("skips empty flushes", () => {
    expect(
      buildMoveExecutionLatencySummary(createEmptyMoveExecutionLatencyCounters(), "destroy"),
    ).toBeNull();
  });
});
