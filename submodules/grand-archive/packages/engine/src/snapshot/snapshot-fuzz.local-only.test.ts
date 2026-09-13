import { describe, expect, it } from "vitest";
import { deterministicRandomGrandArchiveStrategy } from "../automation/bot-strategies.ts";
import { createGrandArchiveCatalogSmokeFixture } from "../automation/catalog-smoke-fixture.ts";
import { playGrandArchiveAutomatedMatch } from "../automation/play-match.ts";
import { listGrandArchiveLegalCommands } from "../commands/legal-commands.ts";
import { applyGrandArchiveCommand } from "../procedures/game-flow/runtime.ts";
import { readGrandArchiveWaitState } from "../projection/wait-state.ts";
import { writeGrandArchiveSnapshotRefusalReport } from "./refusal-report.ts";

const SEED_COUNT = Number(process.env.GRAND_ARCHIVE_SNAPSHOT_FUZZ_SEEDS ?? 3);
const MAXIMUM_ACTIONS = Number(process.env.GRAND_ARCHIVE_SNAPSHOT_FUZZ_ACTIONS ?? 100);

describe("local Grand Archive snapshot-refusal fuzz", () => {
  it.skipIf(process.env.CI === "true" || process.env.GRAND_ARCHIVE_SNAPSHOT_FUZZ !== "1")(
    "keeps every intermediate state of randomized real-catalog play persistable",
    () => {
      expect(Number.isSafeInteger(SEED_COUNT) && SEED_COUNT > 0).toBe(true);
      expect(Number.isSafeInteger(MAXIMUM_ACTIONS) && MAXIMUM_ACTIONS > 0).toBe(true);
      const terminations = new Map<string, number>();

      for (let index = 0; index < SEED_COUNT; index += 1) {
        const seed = 20260824 + index;
        const label = `snapshot-fuzz-${seed}`;
        const { program, initialState } = createGrandArchiveCatalogSmokeFixture(seed);
        const played = playGrandArchiveAutomatedMatch({
          program,
          initialState,
          maximumActions: MAXIMUM_ACTIONS,
          defaultStrategy: deterministicRandomGrandArchiveStrategy,
          legalCommandOptions: {
            maximumDecisionCandidates: 4,
            maximumChosenVariableValue: 8,
          },
        });
        terminations.set(played.termination, (terminations.get(played.termination) ?? 0) + 1);
        if (played.error) {
          const reportPath = writeGrandArchiveSnapshotRefusalReport({
            label,
            message: played.error,
            issues: played.diagnostic?.issues,
            rejectedSnapshot: played.diagnostic?.rejectedSnapshot,
            stateSummary: {
              stateVersion: played.finalState.stateVersion,
              turnNumber: played.finalState.turn.number,
              phase: played.finalState.turn.phase,
              decisionKind: played.finalState.decision?.kind ?? null,
              stackItems: played.finalState.stack.length,
              objects: Object.keys(played.finalState.objects).length,
              opportunity: played.finalState.opportunity,
              waitState: readGrandArchiveWaitState(played.finalState),
              opportunityPassProbe: played.finalState.opportunity
                ? (() => {
                    const result = applyGrandArchiveCommand(
                      program,
                      played.finalState,
                      { move: "pass" },
                      {
                        playerId: played.finalState.opportunity.holderId,
                        expectedStateVersion: played.finalState.stateVersion,
                      },
                    );
                    return result.ok
                      ? { ok: true, eventTypes: result.events.map((event) => event.type) }
                      : { ok: false, code: result.code, message: result.message };
                  })()
                : null,
              players: played.finalState.turnOrder.map((playerId) => ({
                playerId,
                lost: played.finalState.players[playerId]?.lost,
                legal: listGrandArchiveLegalCommands(program, played.finalState, playerId, {
                  maximumDecisionCandidates: 4,
                  maximumChosenVariableValue: 8,
                }).map((candidate) => candidate.label),
              })),
            },
            history: played.frames,
          });
          throw new Error(`${played.error}; snapshot fuzz evidence: ${reportPath}`);
        }
        expect(["finished", "max-actions"]).toContain(played.termination);
      }

      console.info(
        `GRAND_ARCHIVE_SNAPSHOT_FUZZ ${JSON.stringify(Object.fromEntries(terminations))}`,
      );
    },
    180_000,
  );
});
