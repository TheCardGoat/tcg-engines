import { describe, expect, it } from "vite-plus/test";
import { bravo, dash, nimblismBlue } from "../rules/fixtures.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { observeFabTestInitialization } from "../testing/test-initialization-profiler.ts";

function percentile95(values: readonly number[]): number {
  const ordered = [...values].sort((left, right) => left - right);
  return ordered[Math.max(0, Math.ceil(ordered.length * 0.95) - 1)] ?? 0;
}

describe("local FAB test-initialization benchmark", () => {
  it.skipIf(process.env.CI === "true" || process.env.FAB_TEST_INITIALIZATION_BENCHMARK !== "1")(
    "profiles the real two-player test lifecycle without changing its setup",
    () => {
      const samples = new Map<string, number[]>();
      const totalDurations: number[] = [];
      observeFabTestInitialization(({ operation, durationMs }) => {
        const durations = samples.get(operation) ?? [];
        durations.push(durationMs);
        samples.set(operation, durations);
      });

      try {
        for (let index = 0; index < 100; index += 1) {
          const startedAt = performance.now();
          const game = FabTestEngine.start(
            { hero: bravo, hand: [nimblismBlue], deck: 6 },
            { hero: dash, hand: [nimblismBlue], deck: 6 },
          );
          totalDurations.push(performance.now() - startedAt);
          expect(game.getPriorityPlayerId()).toBeDefined();
        }
      } finally {
        observeFabTestInitialization(null);
      }

      const report = Object.fromEntries(
        [...samples.entries()].map(([operation, durations]) => [
          operation,
          {
            count: durations.length,
            totalMs: Number(durations.reduce((total, value) => total + value, 0).toFixed(2)),
            averageMs: Number(
              (durations.reduce((total, value) => total + value, 0) / durations.length).toFixed(3),
            ),
            p95Ms: Number(percentile95(durations).toFixed(3)),
          },
        ]),
      );
      console.info(
        `FAB_TEST_INITIALIZATION_BENCHMARK ${JSON.stringify({
          samples: totalDurations.length,
          totalMs: Number(totalDurations.reduce((total, value) => total + value, 0).toFixed(2)),
          averageMs: Number(
            (
              totalDurations.reduce((total, value) => total + value, 0) / totalDurations.length
            ).toFixed(3),
          ),
          p95Ms: Number(percentile95(totalDurations).toFixed(3)),
          operations: report,
        })}`,
      );
      expect(totalDurations).toHaveLength(100);
    },
    30_000,
  );
});
