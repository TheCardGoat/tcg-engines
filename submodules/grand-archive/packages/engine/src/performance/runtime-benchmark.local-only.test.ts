import { describe, expect, it } from "vitest";
import { firstLegalGrandArchiveStrategy } from "../automation/bot-strategies.ts";
import { createGrandArchiveCatalogSmokeFixture } from "../automation/catalog-smoke-fixture.ts";
import { playGrandArchiveAutomatedMatch } from "../automation/play-match.ts";
import { grandArchivePlayerId } from "../game/identity.ts";
import { listGrandArchiveLegalCommands } from "../commands/legal-commands.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";
import { serializeGrandArchiveMatchSnapshot } from "../snapshot/snapshot.ts";

function percentile95(values: readonly number[]): number {
  const ordered = [...values].sort((left, right) => left - right);
  return ordered[Math.max(0, Math.ceil(ordered.length * 0.95) - 1)] ?? 0;
}

describe("local Grand Archive runtime benchmark", () => {
  it.skipIf(process.env.CI === "true" || process.env.GRAND_ARCHIVE_RUNTIME_BENCHMARK !== "1")(
    "derives the default real-catalog legal command list under the local budget",
    () => {
      const { program, initialState } = createGrandArchiveCatalogSmokeFixture(2_000);
      const runtime = new GrandArchiveMatchRuntime(program, initialState);
      for (const playerId of [grandArchivePlayerId("p1"), grandArchivePlayerId("p2")]) {
        const completed = runtime.execute({ move: "complete-pregame-actions" }, { playerId });
        if (!completed.ok) throw new Error(completed.message);
      }
      const before = serializeGrandArchiveMatchSnapshot(runtime.state);
      const startedAt = performance.now();
      const commands = listGrandArchiveLegalCommands(
        program,
        runtime.state,
        grandArchivePlayerId("p1"),
      );
      const durationMs = performance.now() - startedAt;
      console.info(
        `GRAND_ARCHIVE_LEGAL_COMMAND_BENCHMARK ${JSON.stringify({ durationMs, commandCount: commands.length })}`,
      );

      expect(commands).toHaveLength(50);
      expect(
        commands.filter((candidate) => candidate.command.move === "activate-card"),
      ).toHaveLength(49);
      expect(serializeGrandArchiveMatchSnapshot(runtime.state)).toEqual(before);
      expect(durationMs).toBeLessThan(2_000);
    },
    10_000,
  );

  it.skipIf(process.env.CI === "true" || process.env.GRAND_ARCHIVE_RUNTIME_BENCHMARK !== "1")(
    "executes 120 real-catalog heuristic actions under the local budget",
    () => {
      const actionDurations: number[] = [];
      const snapshotBytes: number[] = [];
      let acceptedActions = 0;
      let fixtureCount = 0;

      for (let fixtureIndex = 0; acceptedActions < 120; fixtureIndex += 1) {
        fixtureCount += 1;
        const { program, initialState } = createGrandArchiveCatalogSmokeFixture(
          20260824 + fixtureIndex,
        );
        const remaining = 120 - acceptedActions;
        const played = playGrandArchiveAutomatedMatch({
          program,
          initialState,
          maximumActions: Math.min(20, remaining),
          defaultStrategy: firstLegalGrandArchiveStrategy,
          legalCommandOptions: {
            maximumDecisionCandidates: 1,
            maximumChosenVariableValue: 4,
          },
          observeAction: ({ durationMs }) => actionDurations.push(durationMs),
        });
        if (played.error) throw new Error(played.error);
        if (played.actionCount === 0) throw new Error("Benchmark fixture made no progress");
        acceptedActions += played.actionCount;
        snapshotBytes.push(
          JSON.stringify(serializeGrandArchiveMatchSnapshot(played.finalState)).length,
        );
      }

      const totalMs = actionDurations.reduce((total, duration) => total + duration, 0);
      const report = {
        acceptedActions,
        fixtureCount,
        averageActionMs: Number((totalMs / actionDurations.length).toFixed(3)),
        p95ActionMs: Number(percentile95(actionDurations).toFixed(3)),
        largestSnapshotBytes: Math.max(...snapshotBytes),
      };
      console.info(`GRAND_ARCHIVE_RUNTIME_BENCHMARK ${JSON.stringify(report)}`);

      expect(acceptedActions).toBeGreaterThanOrEqual(120);
      // Local regression ceiling; this includes legal-command derivation and
      // a snapshot round-trip after every accepted command.
      expect(totalMs).toBeLessThan(35_000);
      expect(report.p95ActionMs).toBeLessThan(500);
    },
    45_000,
  );
});
