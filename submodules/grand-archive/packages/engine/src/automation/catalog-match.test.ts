import { describe, expect, it } from "vitest";
import { projectGrandArchiveViewerLog } from "../log/projection.ts";
import { firstLegalGrandArchiveStrategy } from "./bot-strategies.ts";
import { createGrandArchiveCatalogSmokeFixture } from "./catalog-smoke-fixture.ts";
import { playGrandArchiveAutomatedMatch } from "./play-match.ts";

describe("Grand Archive real-catalog automated match", () => {
  it("drives real cards from pregame through authoritative commands and snapshots", () => {
    const { program, initialState } = createGrandArchiveCatalogSmokeFixture(20260824);
    const played = playGrandArchiveAutomatedMatch({
      program,
      initialState,
      maximumActions: 20,
      defaultStrategy: firstLegalGrandArchiveStrategy,
      legalCommandOptions: {
        maximumDecisionCandidates: 1,
        maximumChosenVariableValue: 4,
      },
    });

    if (played.error) {
      throw new Error(
        JSON.stringify(
          {
            termination: played.termination,
            error: played.error,
            lastFrames: played.frames.slice(-5).map((frame) => ({
              index: frame.index,
              phase: frame.phase,
              actorId: frame.actorId,
              chosen: frame.chosen,
            })),
            decision: played.finalState.decision,
            stack: played.finalState.stack.map((item) => ({
              kind: item.kind,
              sourceId: item.sourceId,
            })),
          },
          null,
          2,
        ),
      );
    }
    expect(["max-actions", "finished"]).toContain(played.termination);
    expect(
      played.frames.some((frame) => frame.chosen.command.move === "complete-pregame-actions"),
    ).toBe(true);
    expect(played.frames.some((frame) => frame.chosen.command.move === "activate-card")).toBe(true);
    expect(played.frames.some((frame) => frame.chosen.command.move === "pass")).toBe(true);
    for (const playerId of played.finalState.turnOrder) {
      const log = projectGrandArchiveViewerLog(program, played.finalState, playerId);
      expect(log.length).toBeGreaterThan(0);
      expect(log.every((entry) => !/[{}]/.test(entry.defaultMessage))).toBe(true);
    }
  }, 15_000);
});
