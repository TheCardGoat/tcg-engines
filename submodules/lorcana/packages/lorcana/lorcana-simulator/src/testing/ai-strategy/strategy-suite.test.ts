import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "bun:test";
import {
  AGGRESSIVE_BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
  BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID,
  BEST_DECK_AWARE_ORACLE_LORE_RACE_STRATEGY_ID,
  BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
  CHALLENGE_ONLY_TEST_STRATEGY_ID,
  DECK_AWARE_LORE_RACE_STRATEGY_ID,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  QUEST_ONLY_TEST_STRATEGY_ID,
  type PlayerId,
} from "@tcg/lorcana-engine";
import { DECK_FIXTURES } from "../../lib/features/simulator-devtools/deck-fixtures/index.js";
import {
  buildStrategyLabMatchDefinitions,
  buildStrategyLabReport,
  parseStrategyLabFilter,
  resolveStrategyBenchmarkPreset,
  resolveStrategyBenchmarkPresetConfig,
  resolveStrategyLabGameCount,
  resolveStrategyLabMatchMode,
  runStrategyLab,
  type StrategyMatchSummary,
  type StrategySuiteRunSummary,
} from "./strategy-suite.js";
import { getStrategyCandidateManifests } from "./strategy-iteration.js";

function resolveWinnerId(player: "player_one" | "player_two"): PlayerId {
  return player as PlayerId;
}

function createMatchSummary(
  overrides: Partial<StrategyMatchSummary> & Pick<StrategyMatchSummary, "matchId">,
): StrategyMatchSummary {
  return {
    actions: 10,
    artifactPaths: {
      gameRuntime: `/tmp/${overrides.matchId}/game-runtime.jsonl`,
      strategyDecisions: `/tmp/${overrides.matchId}/strategy-decisions.jsonl`,
    },
    challengeOverQuestCount: 0,
    deadlock: false,
    deadlockConcedeCount: 0,
    diagnosticCounts: {
      actorResolution: 0,
      total: 0,
      unsupported: 0,
      validation: 0,
    },
    endReason: "winner",
    fallbackCounts: {
      concede: 0,
      passTurn: 0,
    },
    loreTotals: {
      player_one: 20,
      player_two: 10,
    },
    outcome: "winner",
    playerOneDeckId: "deck-a",
    playerOneStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    playerTwoDeckId: "deck-b",
    playerTwoStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
    seed: `seed:${overrides.matchId}`,
    turns: 5,
    winner: resolveWinnerId("player_one"),
    ...overrides,
  } as StrategyMatchSummary;
}

function createSyntheticSummary(): StrategySuiteRunSummary {
  return {
    artifactRoot: "/tmp/strategy-report",
    baselineStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    candidateManifests: [],
    deckIds: ["deck-a", "deck-b"],
    gameCount: 2,
    gameCounts: {
      crossDeck: 2,
      mirror: 2,
    },
    generatedAt: "2026-03-19T12:00:00.000Z",
    matches: [
      createMatchSummary({
        actions: 12,
        artifactPaths: {
          gameRuntime: "/tmp/mirror-1/game-runtime.jsonl",
          strategyDecisions: "/tmp/mirror-1/strategy-decisions.jsonl",
        },
        diagnosticCounts: {
          actorResolution: 1,
          total: 2,
          unsupported: 0,
          validation: 1,
        },
        fallbackCounts: {
          concede: 0,
          passTurn: 1,
        },
        loreTotals: {
          player_one: 10,
          player_two: 20,
        },
        matchId: "mirror-1",
        playerOneDeckId: "deck-a",
        playerOneStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
        playerTwoDeckId: "deck-a",
        playerTwoStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
        turns: 6,
        winner: resolveWinnerId("player_two"),
      }),
      createMatchSummary({
        actions: 8,
        artifactPaths: {
          gameRuntime: "/tmp/cross-1/game-runtime.jsonl",
          strategyDecisions: "/tmp/cross-1/strategy-decisions.jsonl",
        },
        diagnosticCounts: {
          actorResolution: 0,
          total: 1,
          unsupported: 1,
          validation: 0,
        },
        loreTotals: {
          player_one: 15,
          player_two: 20,
        },
        matchId: "cross-1",
        playerOneDeckId: "deck-a",
        playerOneStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
        playerTwoDeckId: "deck-b",
        playerTwoStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
        turns: 4,
        winner: resolveWinnerId("player_two"),
      }),
      createMatchSummary({
        actions: 14,
        artifactPaths: {
          gameRuntime: "/tmp/cross-2/game-runtime.jsonl",
          strategyDecisions: "/tmp/cross-2/strategy-decisions.jsonl",
        },
        deadlock: true,
        deadlockConcedeCount: 1,
        diagnosticCounts: {
          actorResolution: 2,
          total: 3,
          unsupported: 0,
          validation: 1,
        },
        endReason: "repeated-state-deadlock",
        fallbackCounts: {
          concede: 1,
          passTurn: 0,
        },
        loreTotals: {
          player_one: 12,
          player_two: 12,
        },
        matchId: "cross-2",
        outcome: "terminated",
        playerOneDeckId: "deck-b",
        playerOneStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
        playerTwoDeckId: "deck-a",
        playerTwoStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
        turns: 7,
        winner: undefined,
      }),
      createMatchSummary({
        actions: 6,
        artifactPaths: {
          gameRuntime: "/tmp/mirror-same-1/game-runtime.jsonl",
          strategyDecisions: "/tmp/mirror-same-1/strategy-decisions.jsonl",
        },
        matchId: "mirror-same-1",
        playerOneDeckId: "deck-b",
        playerOneStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
        playerTwoDeckId: "deck-b",
        playerTwoStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
        turns: 3,
        winner: resolveWinnerId("player_one"),
      }),
    ],
    mode: "both",
    strategyIds: [BOARD_CONTROL_LORE_RACE_STRATEGY_ID, DEFAULT_AUTOMATED_ACTION_STRATEGY_ID],
  };
}

function writeDecisionLog(
  path: string,
  entries: readonly {
    diagnostics?: Array<{ kind: string }>;
    fallbackTaken?: "concede" | "passTurn";
    matchId: string;
    orderedFamilies: string[];
    selectedFamily?: string;
  }[],
): void {
  writeFileSync(
    path,
    entries
      .map((entry) =>
        JSON.stringify({
          actorId: "player_one",
          boardSnapshot: {
            bagCount: 0,
            boardCounts: {
              player_one: 1,
              player_two: 1,
            },
            handCounts: {
              player_one: 1,
              player_two: 1,
            },
            inkCounts: {
              player_one: 1,
              player_two: 1,
            },
            loreTotals: {
              player_one: 0,
              player_two: 0,
            },
            pendingEffectCount: 0,
            stateFingerprint: "test",
          },
          diagnostics: entry.diagnostics ?? [],
          executionAttempts: [],
          fallbackTaken: entry.fallbackTaken,
          kind: "execution",
          matchId: entry.matchId,
          moveNumber: 1,
          orderedCandidates: entry.orderedFamilies.map((family, index) => ({
            candidate: {
              family,
            },
            family,
            heuristics: [],
            stableKey: `${family}-${index}`,
          })),
          playerOneDeckId: "deck-a",
          playerOneStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
          playerTwoDeckId: "deck-b",
          playerTwoStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
          seed: `seed:${entry.matchId}`,
          selectedCandidate: entry.selectedFamily
            ? {
                candidate: {
                  family: entry.selectedFamily,
                },
                family: entry.selectedFamily,
                heuristics: [],
                stableKey: `${entry.selectedFamily}-selected`,
              }
            : undefined,
          strategyName: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
          turnNumber: 1,
          unsupportedSkips: [],
          validationSkips: [],
        }),
      )
      .join("\n"),
    "utf8",
  );
}

const createdDirs: string[] = [];

afterEach(() => {
  for (const dir of createdDirs.splice(0)) {
    rmSync(dir, { force: true, recursive: true });
  }
});

describe("strategy lab match definitions", () => {
  it("builds mirrored head-to-head definitions for a filtered deck", () => {
    const deck = DECK_FIXTURES[0];
    if (!deck) {
      throw new Error("Expected at least one deck fixture.");
    }

    const matches = buildStrategyLabMatchDefinitions({
      deckIds: [deck.id],
      gameCount: 1,
      matchMode: "mirror",
      strategyIds: [DEFAULT_AUTOMATED_ACTION_STRATEGY_ID, BOARD_CONTROL_LORE_RACE_STRATEGY_ID],
    });

    expect(matches).toHaveLength(2);
    expect(matches.every((match) => match.playerOne.id === deck.id)).toBe(true);
    expect(matches.every((match) => match.playerTwo.id === deck.id)).toBe(true);
    expect(new Set(matches.map((match) => match.playerOne.strategyId)).size).toBe(2);
  });

  it("builds cross-deck definitions with a shared strategy per matchup", () => {
    const [firstDeck, secondDeck] = DECK_FIXTURES;
    if (!firstDeck || !secondDeck) {
      throw new Error("Expected at least two deck fixtures.");
    }

    const matches = buildStrategyLabMatchDefinitions({
      deckIds: [firstDeck.id, secondDeck.id],
      gameCount: 1,
      matchMode: "cross-deck",
      strategyIds: [DEFAULT_AUTOMATED_ACTION_STRATEGY_ID],
    });

    expect(matches).toHaveLength(2);
    expect(matches.map((match) => `${match.playerOne.id}->${match.playerTwo.id}`)).toEqual([
      `${firstDeck.id}->${secondDeck.id}`,
      `${secondDeck.id}->${firstDeck.id}`,
    ]);
    expect(
      matches.every((match) => match.playerOne.strategyId === DEFAULT_AUTOMATED_ACTION_STRATEGY_ID),
    ).toBe(true);
    expect(
      matches.every((match) => match.playerTwo.strategyId === DEFAULT_AUTOMATED_ACTION_STRATEGY_ID),
    ).toBe(true);
  });

  it("resolves preset match counts with separate mirror and cross-deck ladders", () => {
    const config = resolveStrategyBenchmarkPresetConfig("candidate");
    const matches = buildStrategyLabMatchDefinitions({
      deckIds: DECK_FIXTURES.slice(0, 2).map((fixture) => fixture.id),
      preset: "candidate",
      strategyIds: [DEFAULT_AUTOMATED_ACTION_STRATEGY_ID, BOARD_CONTROL_LORE_RACE_STRATEGY_ID],
    });

    expect(config.mirrorGameCount).toBe(2);
    expect(config.crossDeckGameCount).toBe(2);
    expect(matches.filter((match) => match.playerOne.id === match.playerTwo.id)).toHaveLength(16);
    expect(matches.filter((match) => match.playerOne.id !== match.playerTwo.id)).toHaveLength(8);
  });

  it("accepts the aggressive board-control strategy id in lab match generation", () => {
    const deck = DECK_FIXTURES[0];
    if (!deck) {
      throw new Error("Expected at least one deck fixture.");
    }

    const matches = buildStrategyLabMatchDefinitions({
      deckIds: [deck.id],
      gameCount: 1,
      matchMode: "mirror",
      strategyIds: [
        DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
        AGGRESSIVE_BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
      ],
    });

    expect(matches).toHaveLength(2);
    expect(
      matches.some(
        (match) =>
          match.playerOne.strategyId === AGGRESSIVE_BOARD_CONTROL_LORE_RACE_STRATEGY_ID ||
          match.playerTwo.strategyId === AGGRESSIVE_BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
      ),
    ).toBe(true);
  });

  it("excludes test-only strategies from default lab generation", () => {
    const deck = DECK_FIXTURES[0];
    if (!deck) {
      throw new Error("Expected at least one deck fixture.");
    }

    const matches = buildStrategyLabMatchDefinitions({
      deckIds: [deck.id],
      gameCount: 1,
      matchMode: "mirror",
    });

    const strategyIds = new Set(
      matches.flatMap((match) => [match.playerOne.strategyId, match.playerTwo.strategyId]),
    );

    expect(strategyIds.has(QUEST_ONLY_TEST_STRATEGY_ID)).toBe(false);
    expect(strategyIds.has(CHALLENGE_ONLY_TEST_STRATEGY_ID)).toBe(false);
  });

  it("includes test-only strategies when explicitly requested by id", () => {
    const deck = DECK_FIXTURES[0];
    if (!deck) {
      throw new Error("Expected at least one deck fixture.");
    }

    const matches = buildStrategyLabMatchDefinitions({
      deckIds: [deck.id],
      gameCount: 1,
      matchMode: "mirror",
      strategyIds: [QUEST_ONLY_TEST_STRATEGY_ID, CHALLENGE_ONLY_TEST_STRATEGY_ID],
    });

    expect(matches).toHaveLength(2);
    expect(
      new Set(matches.flatMap((match) => [match.playerOne.strategyId, match.playerTwo.strategyId])),
    ).toEqual(new Set([QUEST_ONLY_TEST_STRATEGY_ID, CHALLENGE_ONLY_TEST_STRATEGY_ID]));
  });
});

describe("strategy candidate manifests", () => {
  it("exposes the aggressive board-control candidate manifest", () => {
    const manifests = getStrategyCandidateManifests([
      BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
      DECK_AWARE_LORE_RACE_STRATEGY_ID,
      AGGRESSIVE_BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
    ]);

    expect(manifests.map((manifest) => manifest.candidateId)).toEqual([
      BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
      AGGRESSIVE_BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
    ]);
    expect(manifests[0]?.parentStrategyId).toBe(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID);
    expect(manifests[1]?.parentStrategyId).toBe(BOARD_CONTROL_LORE_RACE_STRATEGY_ID);
  });
});

describe("strategy lab report builder", () => {
  it("aggregates overall counts and separates mirror, cross-deck, and mirror-same-strategy records", () => {
    const report = buildStrategyLabReport(createSyntheticSummary());

    expect(report.overall.games).toBe(4);
    expect(report.overall.averageTurns).toBe(5);
    expect(report.overall.averageActions).toBe(10);
    expect(report.overall.deadlockGames).toBe(1);
    expect(report.overall.deadlockConcedeCount).toBe(1);
    expect(report.overall.fallbackCounts).toEqual({
      concede: 1,
      passTurn: 1,
    });
    expect(report.matchClassifications).toEqual({
      "cross-deck": 2,
      mirror: 1,
      "mirror-same-strategy": 1,
    });
    expect(report.mirror.deckRecords.map((record) => record.classification)).toEqual([
      "mirror",
      "mirror-same-strategy",
    ]);
    expect(report.crossDeck.orderedPairRecords).toHaveLength(2);
    expect(report.scorecards[0]).toMatchObject({
      baselineStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
      candidateId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
      status: "candidate",
    });
    expect(report.scorecards[0]?.score).toMatchObject({
      blendedScore: 0.34,
      crossDeckScore: 0,
      deadlockFallbackPenalty: 1,
      diagnosticPenalty: 0.6,
      mirrorScore: 1,
      signalDiagnostics: 3,
    });
    expect(report.scorecards[0]?.promotionGate.passed).toBe(false);
  });

  it("ranks worst matchups deterministically and preserves inspect-next artifact paths", () => {
    const report = buildStrategyLabReport(createSyntheticSummary());

    expect(report.worstMatchups[0]).toMatchObject({
      deckId: "deck-a",
      label: "board-control-lore-race on deck-a vs board-control-lore-race on deck-b",
      strategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
      winRate: 0,
    });
    expect(report.inspectNext[0]).toEqual({
      artifactPaths: {
        gameRuntime: "/tmp/cross-2/game-runtime.jsonl",
        strategyDecisions: "/tmp/cross-2/strategy-decisions.jsonl",
      },
      classification: "cross-deck",
      deckId: "deck-a",
      matchId: "cross-2",
      opponentDeckId: "deck-b",
      opponentStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
      reason:
        "deadlocks 1, deadlock concedes 1; fallbacks concede 1, pass 0; diagnostics total 3, actor 2, validation 1, unsupported 0",
      strategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
    });
  });

  it("builds a bounded triage backlog from traced decision patterns", () => {
    const artifactRoot = mkdtempSync(join(tmpdir(), "strategy-lab-triage-"));
    createdDirs.push(artifactRoot);

    const overInkingPath = join(artifactRoot, "over-inking.jsonl");
    const challengePath = join(artifactRoot, "missed-challenge.jsonl");
    writeDecisionLog(overInkingPath, [
      {
        matchId: "triage-1",
        orderedFamilies: ["playCard", "putCardIntoInkwell"],
        selectedFamily: "putCardIntoInkwell",
      },
      {
        fallbackTaken: "passTurn",
        matchId: "triage-1",
        orderedFamilies: ["passTurn"],
      },
    ]);
    writeDecisionLog(challengePath, [
      {
        matchId: "triage-2",
        orderedFamilies: ["challenge", "quest"],
        selectedFamily: "quest",
      },
      {
        diagnostics: [{ kind: "actor-resolution" }],
        matchId: "triage-2",
        orderedFamilies: ["activateAbility"],
        selectedFamily: "activateAbility",
      },
    ]);

    const report = buildStrategyLabReport({
      ...createSyntheticSummary(),
      artifactRoot,
      matches: [
        createMatchSummary({
          artifactPaths: {
            gameRuntime: join(artifactRoot, "triage-1-runtime.jsonl"),
            strategyDecisions: overInkingPath,
          },
          matchId: "triage-1",
          playerOneDeckId: "deck-a",
          playerOneStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
          playerTwoDeckId: "deck-b",
          playerTwoStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
          winner: resolveWinnerId("player_two"),
        }),
        createMatchSummary({
          artifactPaths: {
            gameRuntime: join(artifactRoot, "triage-2-runtime.jsonl"),
            strategyDecisions: challengePath,
          },
          diagnosticCounts: {
            actorResolution: 1,
            total: 1,
            unsupported: 0,
            validation: 0,
          },
          matchId: "triage-2",
          playerOneDeckId: "deck-b",
          playerOneStrategyId: BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
          playerTwoDeckId: "deck-a",
          playerTwoStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
          winner: resolveWinnerId("player_two"),
        }),
      ],
    });

    expect(report.triage.categories.map((category) => category.category)).toEqual([
      "bad-ability-timing",
      "fallback-churn",
      "missed-challenge",
      "over-inking",
    ]);
    expect(report.triage.categories[0]?.recommendations[0]?.matchId).toBe("triage-2");
    expect(report.triage.categories[3]?.recommendations[0]?.matchId).toBe("triage-1");
  });
});

describe("strategy lab artifact writing", () => {
  it(
    "writes raw and derived report files for a filtered lab run",
    () => {
      const deck = DECK_FIXTURES[0];
      if (!deck) {
        throw new Error("Expected at least one deck fixture.");
      }

      const artifactRoot = mkdtempSync(join(tmpdir(), "strategy-lab-report-"));
      createdDirs.push(artifactRoot);

      const { summary } = runStrategyLab({
        artifactRoot,
        deckIds: [deck.id],
        gameCount: 1,
        matchMode: "mirror",
        strategyIds: [DEFAULT_AUTOMATED_ACTION_STRATEGY_ID, BOARD_CONTROL_LORE_RACE_STRATEGY_ID],
      });

      const runSummaryPath = join(summary.artifactRoot, "run-summary.json");
      const benchmarkJsonPath = join(summary.artifactRoot, "benchmark-summary.json");
      const benchmarkMarkdownPath = join(summary.artifactRoot, "benchmark-summary.md");
      const matchupWeightJsonPath = join(summary.artifactRoot, "matchup-weight-report.json");
      const matchupWeightMarkdownPath = join(summary.artifactRoot, "matchup-weight-report.md");
      const triageDigestPath = join(summary.artifactRoot, "triage-digest.md");

      expect(existsSync(runSummaryPath)).toBe(true);
      expect(existsSync(benchmarkJsonPath)).toBe(true);
      expect(existsSync(benchmarkMarkdownPath)).toBe(true);
      expect(existsSync(matchupWeightJsonPath)).toBe(true);
      expect(existsSync(matchupWeightMarkdownPath)).toBe(true);
      expect(existsSync(triageDigestPath)).toBe(true);

      const persistedReport = JSON.parse(readFileSync(benchmarkJsonPath, "utf8"));
      const persistedMarkdown = readFileSync(benchmarkMarkdownPath, "utf8");
      const persistedMatchupWeightReport = JSON.parse(readFileSync(matchupWeightJsonPath, "utf8"));
      const persistedMatchupWeightMarkdown = readFileSync(matchupWeightMarkdownPath, "utf8");

      expect(summary.deckIds).toEqual([deck.id]);
      expect(summary.gameCount).toBe(1);
      expect(summary.gameCounts).toEqual({
        crossDeck: 1,
        mirror: 1,
      });
      expect(summary.mode).toBe("mirror");
      expect(summary.strategyIds).toEqual([
        BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
        DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
      ]);
      expect(persistedReport.deckIds).toEqual([deck.id]);
      expect(persistedReport.scorecards[0]?.candidateId).toBe(BOARD_CONTROL_LORE_RACE_STRATEGY_ID);
      expect(persistedReport.baselineStrategyId).toBe(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID);
      expect(persistedReport.mode).toBe("mirror");
      expect(persistedReport.gameCount).toBe(1);
      expect(persistedMarkdown).toContain("# Strategy Lab Benchmark Summary");
      expect(persistedMarkdown).toContain("## Candidate Scorecards");
      expect(persistedMarkdown).toContain("## Top Strategies");
      expect(persistedMatchupWeightReport.strategies).toEqual([]);
      expect(persistedMatchupWeightMarkdown).toContain("# Matchup Weight Report");
    },
    { timeout: 20000 },
  );

  it(
    "writes non-empty matchup weight reports for the best-ai candidate strategies",
    () => {
      const deck = DECK_FIXTURES[0];
      if (!deck) {
        throw new Error("Expected at least one deck fixture.");
      }

      const artifactRoot = mkdtempSync(join(tmpdir(), "strategy-lab-best-ai-report-"));
      createdDirs.push(artifactRoot);

      const { summary } = runStrategyLab({
        artifactRoot,
        deckIds: [deck.id],
        gameCount: 1,
        includeSameStrategyMirrors: true,
        matchMode: "mirror",
        strategyIds: [
          BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID,
          BEST_DECK_AWARE_ORACLE_LORE_RACE_STRATEGY_ID,
        ],
      });
      const matchupWeightJsonPath = join(summary.artifactRoot, "matchup-weight-report.json");
      const matchupWeightMarkdownPath = join(summary.artifactRoot, "matchup-weight-report.md");
      const persistedMatchupWeightReport = JSON.parse(readFileSync(matchupWeightJsonPath, "utf8"));
      const persistedMatchupWeightMarkdown = readFileSync(matchupWeightMarkdownPath, "utf8");

      expect(summary.strategyIds).toEqual([
        BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID,
        BEST_DECK_AWARE_ORACLE_LORE_RACE_STRATEGY_ID,
      ]);
      expect(persistedMatchupWeightReport.strategies).toHaveLength(2);
      expect(persistedMatchupWeightReport.strategies[0]?.matchups).toHaveLength(64);
      expect(
        persistedMatchupWeightReport.strategies.some(
          (strategy: { strategyId: string }) =>
            strategy.strategyId === BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID,
        ),
      ).toBe(true);
      expect(persistedMatchupWeightMarkdown).toContain(BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID);
      expect(persistedMatchupWeightMarkdown).toContain(
        BEST_DECK_AWARE_ORACLE_LORE_RACE_STRATEGY_ID,
      );
      expect(persistedMatchupWeightMarkdown).toContain("Grab Your Bow");
    },
    { timeout: 20000 },
  );
});

describe("strategy lab environment helpers", () => {
  it("parses comma-separated filters", () => {
    expect(parseStrategyLabFilter(" deck-a,deck-b ,, deck-c ")).toEqual([
      "deck-a",
      "deck-b",
      "deck-c",
    ]);
  });

  it("defaults invalid values for mode and game count", () => {
    expect(resolveStrategyLabMatchMode("invalid")).toBe("both");
    expect(resolveStrategyLabGameCount("invalid", 7)).toBe(7);
  });

  it("parses preset values and ignores invalid ones", () => {
    expect(resolveStrategyBenchmarkPreset("quick")).toBe("quick");
    expect(resolveStrategyBenchmarkPreset("candidate")).toBe("candidate");
    expect(resolveStrategyBenchmarkPreset("invalid")).toBeUndefined();
  });
});
