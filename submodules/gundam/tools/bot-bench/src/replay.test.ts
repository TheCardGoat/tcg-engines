import { GUNDAM_MOVE_NAMES, type GundamBotCandidateFamily } from "@tcg/gundam-engine";
import { describe, expect, test } from "vite-plus/test";

import { buildReplay, verifyReplay, type BenchReplay } from "./replay.ts";
import { classifyRegressions, parseFailOn } from "./regression.ts";
import type { BenchReport, FamilyStats } from "./run.ts";

function emptyFamilyStats(): Record<GundamBotCandidateFamily, FamilyStats> {
  const stats = {} as Record<GundamBotCandidateFamily, FamilyStats>;
  for (const name of GUNDAM_MOVE_NAMES) {
    stats[name as GundamBotCandidateFamily] = {
      attempted: 0,
      succeeded: 0,
      failed: 0,
      errorCodes: {},
    };
  }
  return stats;
}

describe("bot-bench replay", () => {
  test("replays a deterministic match", () => {
    const replay = buildReplay({
      p1Strategy: "greedy-legal",
      p2Strategy: "greedy-legal",
      p1Deck: "ef-starter",
      p2Deck: "ef-starter",
      matches: 1,
      seedBase: "replay-smoke",
      maxActions: 80,
    });

    const result = verifyReplay(replay);
    expect(result.matched).toBe(true);
    expect(result.divergences).toEqual([]);
  });

  test("reports action divergence", () => {
    const replay: BenchReplay = buildReplay({
      p1Strategy: "greedy-legal",
      p2Strategy: "greedy-legal",
      p1Deck: "ef-starter",
      p2Deck: "ef-starter",
      matches: 1,
      seedBase: "replay-diverge",
      maxActions: 80,
    });
    const first = replay.matches[0]?.actions[0];
    if (!first) throw new Error("expected at least one action");
    const mutated: BenchReplay = {
      ...replay,
      matches: [
        {
          ...replay.matches[0]!,
          actions: [
            { ...first, outcome: "sentinel-divergence" },
            ...replay.matches[0]!.actions.slice(1),
          ],
        },
      ],
    };

    const result = verifyReplay(mutated);
    expect(result.matched).toBe(false);
    expect(result.divergences.some((d) => d.field === "outcome")).toBe(true);
  });
});

describe("bot-bench regression classification", () => {
  test("parses fail policy", () => {
    expect(parseFailOn("max-actions,concede-failed")).toEqual(["max-actions", "concede-failed"]);
  });

  test("classifies configured termination failures", () => {
    const report: BenchReport = {
      version: 1,
      options: {
        p1Strategy: "greedy-legal",
        p2Strategy: "greedy-legal",
        p1Deck: "ef-starter",
        p2Deck: "ef-starter",
        matches: 1,
        seedBase: "regression",
        maxActions: 1,
      },
      summary: {
        matches: 1,
        p1WinRate: 0,
        p2WinRate: 0,
        drawRate: 1,
        avgTurns: 1,
        avgActions: 1,
        avgElapsedMs: 0,
        terminationDistribution: {
          "game-won": 0,
          "max-actions-exceeded": 1,
          "concede-failed": 0,
        },
        winReasonDistribution: {},
      },
      p1: { wins: 0, familyStats: emptyFamilyStats() },
      p2: { wins: 0, familyStats: emptyFamilyStats() },
      matches: [
        {
          matchId: 0,
          seed: "regression-0",
          termination: "max-actions-exceeded",
          winner: null,
          winReason: null,
          turnCount: 1,
          actionCount: 1,
          elapsedMs: 0,
        },
      ],
      createdAt: "2026-05-19T00:00:00.000Z",
    };

    const result = classifyRegressions(report, ["max-actions", "non-game-won"]);
    expect(result.passed).toBe(false);
    expect(result.findings.map((f) => f.kind)).toEqual(["max-actions", "non-game-won"]);
  });
});
