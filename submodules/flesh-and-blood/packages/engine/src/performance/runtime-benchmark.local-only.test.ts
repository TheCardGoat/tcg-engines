import { describe, expect, it } from "vite-plus/test";
import { fleshAndBloodDeckCardLibrary } from "../../../cards/src/deck-library.ts";
import { createFabPracticeMatch } from "../automation/create-practice-match.ts";
import { heuristicStrategy } from "../automation/bot-strategies.ts";
import { listLegalCommands } from "../automation/legal-commands.ts";
import { decodeFabCommand } from "../moves.ts";
import { observeFabCopyOnWrite } from "../copy-on-write.ts";
import { observeFabPerformance } from "../performance-observer.ts";
import {
  observeFabSnapshotSerialization,
  serializeFabMatchSnapshot,
} from "../snapshot/match-context.ts";
import { snapshotFunctionalTriggerSources } from "../rules/snapshots.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

function percentile95(values: readonly number[]): number {
  const ordered = [...values].sort((left, right) => left - right);
  return ordered[Math.max(0, Math.ceil(ordered.length * 0.95) - 1)] ?? 0;
}

describe("local FAB runtime benchmark", () => {
  it.skipIf(process.env.CI === "true" || process.env.FAB_RUNTIME_BENCHMARK !== "1")(
    "executes 120 warm heuristic actions under the local budget",
    () => {
      let { runtime, engine } = createFabPracticeMatch(fleshAndBloodDeckCardLibrary, {
        seed: "autoplay-1",
      });
      const startState = runtime.getState();
      const startSnapshot = serializeFabMatchSnapshot(startState);
      const startBytes = JSON.stringify(startSnapshot).length;
      const durations: number[] = [];
      const durationsByMove = new Map<string, number[]>();
      let acceptedActions = 0;
      let fixtureCount = 1;
      const nativeStructuredClone = globalThis.structuredClone;
      let structuredCloneCalls = 0;
      let structuredCloneMs = 0;
      const structuredCloneCallSites = new Map<string, number>();
      let copyOnWriteCalls = 0;
      let copyOnWriteMs = 0;
      let snapshotSerializations = 0;
      let recordCommandBoundary = false;
      const copyOnWriteCallSites = new Map<string, { count: number; totalMs: number }>();
      const operations = new Map<string, { count: number; totalMs: number }>();
      observeFabCopyOnWrite((sample) => {
        if (!recordCommandBoundary) return;
        copyOnWriteCalls += 1;
        copyOnWriteMs += sample.durationMs;
        const callSite =
          new Error().stack
            ?.split("\n")
            .filter(
              (line) =>
                line.includes("packages/engine/src/") &&
                !line.includes("runtime-benchmark") &&
                !line.includes("copy-on-write.ts"),
            )
            .slice(0, 4)
            .map((line) => line.trim())
            .join(" <- ") || "unknown";
        const aggregate = copyOnWriteCallSites.get(callSite) ?? { count: 0, totalMs: 0 };
        aggregate.count += 1;
        aggregate.totalMs += sample.durationMs;
        copyOnWriteCallSites.set(callSite, aggregate);
      });
      observeFabPerformance((sample) => {
        const aggregate = operations.get(sample.operation) ?? { count: 0, totalMs: 0 };
        aggregate.count += 1;
        aggregate.totalMs += sample.durationMs;
        operations.set(sample.operation, aggregate);
      });
      observeFabSnapshotSerialization(() => {
        if (!recordCommandBoundary) return;
        snapshotSerializations += 1;
      });
      globalThis.structuredClone = ((value: unknown, options?: StructuredSerializeOptions) => {
        const startedAt = performance.now();
        try {
          return nativeStructuredClone(value, options);
        } finally {
          structuredCloneCalls += 1;
          structuredCloneMs += performance.now() - startedAt;
          const callSite =
            new Error().stack
              ?.split("\n")
              .find(
                (line) =>
                  line.includes("packages/engine/src/") && !line.includes("runtime-benchmark"),
              )
              ?.trim() ?? "unknown";
          structuredCloneCallSites.set(callSite, (structuredCloneCallSites.get(callSite) ?? 0) + 1);
        }
      }) as typeof structuredClone;

      try {
        const autoplayGuard = createFabLoopGuard({
          label: "runtime-benchmark: autoplay",
          limit: 10_000,
        });
        while (acceptedActions < 120) {
          autoplayGuard.tick();
          const index = acceptedActions;
          const actorId = runtime.getPriorityPlayerId() ?? runtime.getActivePlayerId();
          if (!actorId) {
            fixtureCount += 1;
            ({ runtime, engine } = createFabPracticeMatch(fleshAndBloodDeckCardLibrary, {
              seed: "autoplay-" + fixtureCount,
            }));
            continue;
          }
          const legal = listLegalCommands(runtime, actorId);
          const command = heuristicStrategy(runtime, actorId, legal);
          if (!command) {
            fixtureCount += 1;
            ({ runtime, engine } = createFabPracticeMatch(fleshAndBloodDeckCardLibrary, {
              seed: "autoplay-" + fixtureCount,
            }));
            continue;
          }
          const startedAt = performance.now();
          const decoded = decodeFabCommand(command.move, command.payload);
          if (!decoded)
            throw new Error(`Failed to decode generated ${command.move} benchmark command.`);
          recordCommandBoundary = true;
          const result = runtime.applyCommand(actorId, decoded, {
            commandId: `benchmark:${index + 1}`,
            timestamp: index + 1,
          });
          recordCommandBoundary = false;
          const duration = performance.now() - startedAt;
          durations.push(duration);
          const moveDurations = durationsByMove.get(command.move) ?? [];
          moveDurations.push(duration);
          durationsByMove.set(command.move, moveDurations);
          expect(result.success).toBe(true);
          acceptedActions += 1;
        }
      } finally {
        recordCommandBoundary = false;
        observeFabCopyOnWrite(null);
        observeFabPerformance(null);
        observeFabSnapshotSerialization(null);
        globalThis.structuredClone = nativeStructuredClone;
      }

      const sorted = [...durations].sort((left, right) => left - right);
      const endState = runtime.getState();
      const endSnapshot = serializeFabMatchSnapshot(endState);
      const endTriggerSources = snapshotFunctionalTriggerSources(endState);
      const jsonBytes = (value: unknown) => JSON.stringify(value)?.length ?? 0;
      const totalMs = durations.reduce((total, value) => total + value, 0);
      const report = {
        acceptedActions,
        fixtureCount,
        totalMs: Number(totalMs.toFixed(2)),
        averageMs: Number((totalMs / Math.max(1, durations.length)).toFixed(3)),
        p95Ms: Number(percentile95(sorted).toFixed(3)),
        startSnapshotBytes: startBytes,
        endSnapshotBytes: jsonBytes(endSnapshot),
        immutableContextBytes: jsonBytes(endState.cardDefinitions),
        snapshotComponents: {
          players: jsonBytes(endSnapshot.players),
          objects: jsonBytes(endSnapshot.objects),
          lkiArena: jsonBytes(endSnapshot.lkiArena),
          rulesProcess: jsonBytes(endSnapshot.rulesProcess),
          rulesStack: jsonBytes(endSnapshot.rulesStack),
          continuousEffectInstances: jsonBytes(endSnapshot.continuousEffectInstances),
          replacementEffects: jsonBytes(endSnapshot.replacementEffects),
          delayedTriggers: jsonBytes(endSnapshot.delayedTriggers),
        },
        snapshotGrowth: {
          players: jsonBytes(endState.players) - jsonBytes(startState.players),
          objects: jsonBytes(endState.objects) - jsonBytes(startState.objects),
        },
        activeBoundary: endState.rulesProcess
          ? {
              futureSubjectEvents: endState.rulesProcess.futureSubjectEvents.length,
              pendingTriggers: endState.rulesProcess.pendingTriggers.length,
              resolutionEventGroups: endState.rulesProcess.resolutionEventGroups.length,
              procedureEventGroups: endState.rulesProcess.procedure?.eventGroups.length ?? 0,
            }
          : null,
        reachableLkiCount: Object.keys(endSnapshot.lkiArena).length,
        endObjectCount: Object.keys(endState.objects).length,
        endTriggerSourceCount: endTriggerSources.length,
        endTriggerSourceObjectCount: new Set(
          endTriggerSources.map((source) => source.source.instanceId),
        ).size,
        committedEventCount: engine.committedEvents().length,
        structuredCloneCalls,
        structuredCloneMs: Number(structuredCloneMs.toFixed(2)),
        structuredCloneCallSites: Object.fromEntries(structuredCloneCallSites),
        copyOnWriteCalls,
        copyOnWriteMs: Number(copyOnWriteMs.toFixed(2)),
        snapshotSerializations,
        copyOnWriteCallSites: Object.fromEntries(
          [...copyOnWriteCallSites.entries()]
            .sort(([, left], [, right]) => right.totalMs - left.totalMs)
            .map(([callSite, aggregate]) => [
              callSite,
              {
                count: aggregate.count,
                totalMs: Number(aggregate.totalMs.toFixed(2)),
              },
            ]),
        ),
        operations: Object.fromEntries(
          [...operations].map(([operation, aggregate]) => [
            operation,
            {
              count: aggregate.count,
              totalMs: Number(aggregate.totalMs.toFixed(2)),
            },
          ]),
        ),
        moves: Object.fromEntries(
          [...durationsByMove].map(([move, values]) => [
            move,
            {
              count: values.length,
              totalMs: Number(values.reduce((total, value) => total + value, 0).toFixed(2)),
              averageMs: Number(
                (values.reduce((total, value) => total + value, 0) / values.length).toFixed(3),
              ),
              p95Ms: Number(percentile95(values).toFixed(3)),
            },
          ]),
        ),
      };
      console.info(`FAB_RUNTIME_BENCHMARK ${JSON.stringify(report)}`);

      expect(acceptedActions).toBe(120);
      expect(copyOnWriteCalls).toBe(acceptedActions);
      expect(snapshotSerializations).toBe(acceptedActions);
      // This is a regression ceiling over the current profiled baseline, not
      // the long-term runtime target. Keep the profiler runnable while the
      // trigger/rules-view hot path is optimized in follow-up work.
      expect(totalMs).toBeLessThan(6_000);
    },
    30_000,
  );

  it.skipIf(process.env.CI === "true" || process.env.FAB_RUNTIME_BENCHMARK !== "1")(
    "keeps ordinary settled priority pass p95 under the local budget",
    () => {
      const durations: number[] = [];

      for (let index = 0; index < 120; index += 1) {
        // A completed two-player pass cycle is an Action Phase transition,
        // not an ordinary priority pass (CR 1.11.4a, 4.3.4). Construct each
        // fixture before timing so the metric remains the hot-path handoff.
        const { runtime } = createFabPracticeMatch(fleshAndBloodDeckCardLibrary, {
          seed: `ordinary-pass-${index + 1}`,
        });
        const actorId = runtime.getPriorityPlayerId();
        expect(actorId).toBeDefined();
        expect(runtime.isOrdinaryPriorityPass()).toBe(true);
        const startedAt = performance.now();
        const result = runtime.applyCommand(
          actorId!,
          { move: "pass" },
          {
            commandId: `ordinary-pass:${index + 1}`,
            timestamp: index + 1,
          },
        );
        durations.push(performance.now() - startedAt);
        expect(result.success).toBe(true);
      }

      const p95Ms = percentile95(durations);
      console.info(
        `FAB_ORDINARY_PRIORITY_PASS_BENCHMARK ${JSON.stringify({
          samples: durations.length,
          p95Ms: Number(p95Ms.toFixed(3)),
        })}`,
      );
      expect(p95Ms).toBeLessThan(5);
    },
    30_000,
  );
});
