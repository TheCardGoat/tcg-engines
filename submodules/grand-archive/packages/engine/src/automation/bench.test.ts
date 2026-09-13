import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../game/identity.ts";
import type { GrandArchiveAutomatedBenchReport } from "./bench.ts";
import { diffGrandArchiveAutomatedBenchReports, runGrandArchiveAutomatedBench } from "./bench.ts";
import { createGrandArchiveCatalogSmokeFixture } from "./catalog-smoke-fixture.ts";
import { passOnlyGrandArchiveStrategy } from "./bot-strategies.ts";

function report(
  label: string,
  matches: GrandArchiveAutomatedBenchReport["matches"],
): GrandArchiveAutomatedBenchReport {
  const finished = matches.filter((match) => match.termination === "finished").length;
  return {
    version: 1,
    label,
    summary: {
      matches: matches.length,
      finished,
      unfinished: matches.length - finished,
      matchesWithoutWinner: matches.filter((match) => match.winnerIds.length === 0).length,
      averageTurns: 0,
      averageActions: 0,
      terminations: {
        finished,
        "max-actions": matches.filter((match) => match.termination === "max-actions").length,
        stall: matches.filter((match) => match.termination === "stall").length,
        illegal: matches.filter((match) => match.termination === "illegal").length,
        "snapshot-refusal": matches.filter((match) => match.termination === "snapshot-refusal")
          .length,
        "engine-throw": matches.filter((match) => match.termination === "engine-throw").length,
      },
      winsByPlayerId: {},
    },
    matches,
    createdAt: "2026-08-25T00:00:00.000Z",
  };
}

describe("Grand Archive automated benchmark", () => {
  it("aggregates bounded self-play cases without retaining complete final states", () => {
    const first = createGrandArchiveCatalogSmokeFixture(1);
    const second = createGrandArchiveCatalogSmokeFixture(2);
    const result = runGrandArchiveAutomatedBench({
      label: "pass-only-baseline",
      cases: [
        {
          id: "seed-1",
          input: {
            ...first,
            maximumActions: 2,
            defaultStrategy: passOnlyGrandArchiveStrategy,
          },
        },
        {
          id: "seed-2",
          input: {
            ...second,
            maximumActions: 2,
            defaultStrategy: passOnlyGrandArchiveStrategy,
          },
        },
      ],
    });

    expect(result.summary).toMatchObject({
      matches: 2,
      finished: 0,
      unfinished: 2,
      terminations: { "max-actions": 2 },
    });
    expect(result.matches.map((match) => match.caseId)).toEqual(["seed-1", "seed-2"]);
    expect(result.matches.every((match) => !("finalState" in match))).toBe(true);
  });

  it("rejects duplicate case identities", () => {
    const fixture = createGrandArchiveCatalogSmokeFixture(3);
    expect(() =>
      runGrandArchiveAutomatedBench({
        label: "duplicates",
        cases: [
          { id: "same", input: { ...fixture, maximumActions: 1 } },
          { id: "same", input: { ...fixture, maximumActions: 1 } },
        ],
      }),
    ).toThrow("Duplicate Grand Archive benchmark case id");
  });

  it("creates lazy cases only when their match is executed", () => {
    const fixture = createGrandArchiveCatalogSmokeFixture(4);
    let calls = 0;
    const result = runGrandArchiveAutomatedBench({
      label: "lazy",
      cases: [
        {
          id: "lazy-seed",
          createInput: () => {
            calls += 1;
            return { ...fixture, maximumActions: 1 };
          },
        },
      ],
    });
    expect(calls).toBe(1);
    expect(result.matches).toHaveLength(1);
  });

  it("compares multiplayer winner sets and unfinished regressions on identical cases", () => {
    const p1 = grandArchivePlayerId("p1");
    const baseline = report("baseline", [
      {
        caseId: "same-seed",
        termination: "max-actions",
        winnerIds: [],
        turnCount: 2,
        actionCount: 20,
      },
    ]);
    const candidate = report("candidate", [
      {
        caseId: "same-seed",
        termination: "finished",
        winnerIds: [p1],
        turnCount: 2,
        actionCount: 18,
      },
    ]);

    expect(diffGrandArchiveAutomatedBenchReports(baseline, candidate, p1)).toMatchObject({
      changedWinnerSets: 1,
      gained: 1,
      lost: 0,
      unfinishedDelta: -1,
      verdict: "keep",
    });
    expect(diffGrandArchiveAutomatedBenchReports(candidate, baseline, p1)).toMatchObject({
      lost: 1,
      unfinishedDelta: 1,
      verdict: "reject",
    });
  });

  it("refuses to compare reports whose stable case identities differ", () => {
    const left = report("left", [
      {
        caseId: "seed-a",
        termination: "finished",
        winnerIds: [],
        turnCount: 1,
        actionCount: 1,
      },
    ]);
    const right = report("right", [
      {
        caseId: "seed-b",
        termination: "finished",
        winnerIds: [],
        turnCount: 1,
        actionCount: 1,
      },
    ]);
    expect(() => diffGrandArchiveAutomatedBenchReports(left, right)).toThrow("different case ids");
  });
});
