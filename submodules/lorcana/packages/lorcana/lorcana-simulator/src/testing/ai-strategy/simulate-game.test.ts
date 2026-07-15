import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "bun:test";
import { getLogger } from "@logtape/logtape";
import {
  BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
  deckAwareLoreRaceAutomatedActionStrategy,
  defaultLoreRaceAutomatedActionStrategy,
  legacyLoreRaceAutomatedActionStrategy,
  type AutomatedActionDecisionTrace,
  type AutomatedActionStrategy,
} from "@tcg/lorcana-engine";
import {
  DECK_FIXTURES,
  amberAmethystAggressive,
  steelSapphireAggressive,
  steelSapphireMidrange,
  type DeckFixture,
} from "../../lib/features/simulator-devtools/deck-fixtures/index.js";
import {
  buildRunComparisonConsoleOutput,
  buildStrategyLabReport,
  buildTriageDigestConsoleOutput,
  compareStrategyRuns,
  getStrategyArtifactRoot,
  loadPreviousRunSummary,
  parseStrategyLabFilter,
  replayMatchFromRunSummary,
  resolveStrategyBenchmarkPreset,
  resolveStrategyLabGameCount,
  resolveStrategyLabMatchMode,
  runQuickReplayCheck,
  runStrategyLab,
  simulateAutomatedDeckMatch,
  type StrategySuiteRunSummary,
} from "./strategy-suite.js";

const logger = getLogger(["lorcana-simulator", "strategy", "simulate-game-test"]);
const RUN_SLOW_STRATEGY_TESTS = !process.env.CI;
const RUN_STRATEGY_BATCH_BENCHMARK = process.env.RUN_STRATEGY_BATCH_BENCHMARK === "1";
const RUN_STRATEGY_HEAD_TO_HEAD_BENCHMARK = process.env.RUN_STRATEGY_HEAD_TO_HEAD_BENCHMARK === "1";
const RUN_STRATEGY_LAB = process.env.RUN_STRATEGY_LAB === "1";
const RUN_STRATEGY_BENCHMARK = process.env.RUN_STRATEGY_BENCHMARK === "1";
const STRATEGY_BENCHMARK_PRESET = resolveStrategyBenchmarkPreset(process.env.STRATEGY_PRESET);
const STRATEGY_LAB_TIMEOUT_MS =
  STRATEGY_BENCHMARK_PRESET === "promotion"
    ? 1_800_000
    : STRATEGY_BENCHMARK_PRESET === "candidate"
      ? 900_000
      : STRATEGY_BENCHMARK_PRESET === "quick"
        ? 300_000
        : RUN_STRATEGY_BENCHMARK
          ? 600_000
          : 180_000;

type StrategyBenchmarkDeck = {
  fixture: DeckFixture;
  id: string;
};

type StrategyBenchmarkPermutation = {
  playerOne: StrategyBenchmarkDeck;
  playerTwo: StrategyBenchmarkDeck;
  seed: string;
};

type StrategyBenchmarkMatchSummary = ReturnType<typeof simulateAutomatedDeckMatch>;

type StrategyBenchmarkDeckRecord = {
  averageMargin: number;
  deckId: string;
  games: number;
  winRate: number;
  wins: number;
};

type StrategyBenchmarkOrderedPairRecord = {
  averageMargin: number;
  games: number;
  orderedPair: string;
  winRate: number;
  wins: number;
};

type StrategyBenchmarkBatchSummary = {
  averageActions: number;
  averageLoreMargin: number;
  averageTurns: number;
  deckRecords: StrategyBenchmarkDeckRecord[];
  deadlockConcedes: number;
  endReasons: Record<string, number>;
  plannerFallbackCounts: Record<"concede" | "passTurn", number>;
  games: number;
  orderedPairRecords: StrategyBenchmarkOrderedPairRecord[];
  wins: Record<string, number>;
};

type StrategyBatchRunResult = {
  artifactRoot: string;
  matches: StrategyBenchmarkMatchSummary[];
  summary: StrategyBenchmarkBatchSummary;
};

type StrategyHeadToHeadResult = {
  artifactRoot: string;
  games: number;
  noWinnerGames: number;
  strategyDeadlockConcedes: Record<string, number>;
  strategyConcedeFallbacks: Record<string, number>;
  strategyWins: Record<string, number>;
};

type StrategyTraceSummary = Pick<AutomatedActionDecisionTrace, "fallbackTaken" | "strategyName">;

function createBenchmarkDecks(fixtures: readonly DeckFixture[]): StrategyBenchmarkDeck[] {
  return fixtures.map((fixture) => ({
    fixture,
    id: fixture.id,
  }));
}

function createBenchmarkPermutations(
  decks: readonly StrategyBenchmarkDeck[],
  count: number,
): StrategyBenchmarkPermutation[] {
  const orderedPairs = decks.flatMap((playerOne) =>
    decks
      .filter((playerTwo) => playerTwo.id !== playerOne.id)
      .map((playerTwo) => ({ playerOne, playerTwo })),
  );

  return Array.from({ length: count }, (_, index) => {
    const pair = orderedPairs[index % orderedPairs.length]!;
    const seedCycle = Math.floor(index / orderedPairs.length);

    return {
      playerOne: pair.playerOne,
      playerTwo: pair.playerTwo,
      seed: `strategy-benchmark:${pair.playerOne.id}:${pair.playerTwo.id}:${seedCycle}:${index}`,
    };
  });
}

function summarizeBenchmarkBatch(matches: readonly StrategyBenchmarkMatchSummary[]) {
  const totals = matches.reduce(
    (summary, match) => {
      const playerOneMargin = match.loreTotals.player_one - match.loreTotals.player_two;
      const orderedPair = `${match.playerOneDeckId}__vs__${match.playerTwoDeckId}`;

      summary.games += 1;
      summary.totalTurns += match.turns;
      summary.totalActions += match.actions;
      summary.totalLoreMargin += Math.abs(playerOneMargin);
      summary.deadlockConcedes += match.deadlockConcedeCount;
      summary.plannerFallbackCounts.concede += match.fallbackCounts.concede;
      summary.plannerFallbackCounts.passTurn += match.fallbackCounts.passTurn;
      summary.wins[match.winner ?? "no-winner"] =
        (summary.wins[match.winner ?? "no-winner"] ?? 0) + 1;
      summary.endReasons[match.gameEndReason ?? "unknown"] =
        (summary.endReasons[match.gameEndReason ?? "unknown"] ?? 0) + 1;

      const playerOneDeck = (summary.deckTotals[match.playerOneDeckId] ??= {
        games: 0,
        totalMargin: 0,
        wins: 0,
      });
      playerOneDeck.games += 1;
      playerOneDeck.totalMargin += playerOneMargin;
      if (match.winner === "player_one") {
        playerOneDeck.wins += 1;
      }

      const playerTwoDeck = (summary.deckTotals[match.playerTwoDeckId] ??= {
        games: 0,
        totalMargin: 0,
        wins: 0,
      });
      playerTwoDeck.games += 1;
      playerTwoDeck.totalMargin -= playerOneMargin;
      if (match.winner === "player_two") {
        playerTwoDeck.wins += 1;
      }

      const pairTotals = (summary.orderedPairTotals[orderedPair] ??= {
        games: 0,
        totalMargin: 0,
        wins: 0,
      });
      pairTotals.games += 1;
      pairTotals.totalMargin += playerOneMargin;
      if (match.winner === "player_one") {
        pairTotals.wins += 1;
      }

      return summary;
    },
    {
      deckTotals: {} as Record<string, { games: number; totalMargin: number; wins: number }>,
      deadlockConcedes: 0,
      endReasons: {} as Record<string, number>,
      games: 0,
      orderedPairTotals: {} as Record<string, { games: number; totalMargin: number; wins: number }>,
      plannerFallbackCounts: {
        concede: 0,
        passTurn: 0,
      },
      totalActions: 0,
      totalLoreMargin: 0,
      totalTurns: 0,
      wins: {} as Record<string, number>,
    },
  );

  const deckRecords = Object.entries(totals.deckTotals)
    .map(([deckId, record]) => ({
      averageMargin: Number((record.totalMargin / record.games).toFixed(2)),
      deckId,
      games: record.games,
      winRate: Number((record.wins / record.games).toFixed(2)),
      wins: record.wins,
    }))
    .sort(
      (left, right) =>
        left.winRate - right.winRate ||
        left.averageMargin - right.averageMargin ||
        left.deckId.localeCompare(right.deckId),
    );

  const orderedPairRecords = Object.entries(totals.orderedPairTotals)
    .map(([orderedPair, record]) => ({
      averageMargin: Number((record.totalMargin / record.games).toFixed(2)),
      games: record.games,
      orderedPair,
      winRate: Number((record.wins / record.games).toFixed(2)),
      wins: record.wins,
    }))
    .sort(
      (left, right) =>
        left.winRate - right.winRate ||
        left.averageMargin - right.averageMargin ||
        left.orderedPair.localeCompare(right.orderedPair),
    );

  return {
    averageActions: Number((totals.totalActions / totals.games).toFixed(2)),
    averageLoreMargin: Number((totals.totalLoreMargin / totals.games).toFixed(2)),
    averageTurns: Number((totals.totalTurns / totals.games).toFixed(2)),
    deckRecords,
    deadlockConcedes: totals.deadlockConcedes,
    endReasons: totals.endReasons,
    games: totals.games,
    orderedPairRecords,
    plannerFallbackCounts: totals.plannerFallbackCounts,
    wins: totals.wins,
  };
}

function resolveWinnerLabel(summary: {
  loreTotals?: Record<string, number>;
  playerOneDeckId: string;
  playerTwoDeckId: string;
  winner?: string;
}): string {
  if (summary.winner === "player_one") {
    return `P1 (${summary.playerOneDeckId})`;
  }

  if (summary.winner === "player_two") {
    return `P2 (${summary.playerTwoDeckId})`;
  }

  return summary.winner ?? "no-winner";
}

function resolveWinnerLore(summary: {
  loreTotals: Record<string, number>;
  winner?: string;
}): number | undefined {
  if (!summary.winner) {
    return undefined;
  }

  return summary.loreTotals[summary.winner];
}

function createPassThroughStrategy(name: string): AutomatedActionStrategy {
  return {
    name,
    summarizeCandidates(_context, candidates) {
      return candidates.map((candidate, index) => ({
        candidate,
        family: candidate.family,
        heuristics: [],
        stableKey: `${candidate.family}-${index}`,
      }));
    },
  };
}

function readStrategyNames(strategyDecisionsPath: string): string[] {
  return readFileSync(strategyDecisionsPath, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { strategyName: string })
    .map((entry) => entry.strategyName);
}

function readStrategyTraceSummaries(strategyDecisionsPath: string): StrategyTraceSummary[] {
  return readFileSync(strategyDecisionsPath, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as StrategyTraceSummary);
}

function createBenchmarkArtifactRoot(prefix: string): string {
  return mkdtempSync(join(tmpdir(), prefix));
}

function runBenchmarkBatch(args: {
  artifactPrefix: string;
  label: string;
  permutations: readonly StrategyBenchmarkPermutation[];
  strategy: AutomatedActionStrategy;
}): StrategyBatchRunResult {
  const artifactRoot = createBenchmarkArtifactRoot(args.artifactPrefix);
  const matches = args.permutations.map((permutation, index) =>
    simulateAutomatedDeckMatch({
      artifactRoot,
      matchId: `${args.label}-${index}-${permutation.playerOne.id}-vs-${permutation.playerTwo.id}`,
      playerOne: {
        ...permutation.playerOne,
        strategy: args.strategy,
      },
      playerTwo: {
        ...permutation.playerTwo,
        strategy: args.strategy,
      },
      seed: permutation.seed,
      turnLimit: 60,
    }),
  );

  return {
    artifactRoot,
    matches,
    summary: summarizeBenchmarkBatch(matches),
  };
}

function formatBenchmarkSummaryForLog(summary: StrategyBenchmarkBatchSummary) {
  return {
    averageActions: summary.averageActions,
    averageLoreMargin: summary.averageLoreMargin,
    averageTurns: summary.averageTurns,
    deckRecords: summary.deckRecords,
    deadlockConcedes: summary.deadlockConcedes,
    endReasons: summary.endReasons,
    games: summary.games,
    orderedPairRecords: summary.orderedPairRecords.slice(0, 5),
    plannerFallbackCounts: summary.plannerFallbackCounts,
    wins: summary.wins,
  };
}

function summarizeBatchDelta(args: {
  after: StrategyBenchmarkBatchSummary;
  before: StrategyBenchmarkBatchSummary;
}) {
  const beforeDecks = Object.fromEntries(
    args.before.deckRecords.map((record) => [record.deckId, record]),
  );

  return {
    averageActions: Number((args.after.averageActions - args.before.averageActions).toFixed(2)),
    averageLoreMargin: Number(
      (args.after.averageLoreMargin - args.before.averageLoreMargin).toFixed(2),
    ),
    averageTurns: Number((args.after.averageTurns - args.before.averageTurns).toFixed(2)),
    deckWinRateDelta: args.after.deckRecords.map((record) => ({
      deckId: record.deckId,
      winRateDelta: Number(
        (record.winRate - (beforeDecks[record.deckId]?.winRate ?? 0)).toFixed(2),
      ),
    })),
  };
}

function runMirroredHeadToHeadBenchmark(
  permutations: readonly StrategyBenchmarkPermutation[],
): StrategyHeadToHeadResult {
  const artifactRoot = createBenchmarkArtifactRoot("simulate-game-strategy-head-to-head-");
  const strategyWins: Record<string, number> = {
    [defaultLoreRaceAutomatedActionStrategy.name]: 0,
    [legacyLoreRaceAutomatedActionStrategy.name]: 0,
  };
  const strategyConcedeFallbacks: Record<string, number> = {
    [defaultLoreRaceAutomatedActionStrategy.name]: 0,
    [legacyLoreRaceAutomatedActionStrategy.name]: 0,
  };
  const strategyDeadlockConcedes: Record<string, number> = {
    [defaultLoreRaceAutomatedActionStrategy.name]: 0,
    [legacyLoreRaceAutomatedActionStrategy.name]: 0,
  };
  let noWinnerGames = 0;

  permutations.forEach((permutation, index) => {
    const games: Array<{
      defaultSeat: "player_one" | "player_two";
      summary: StrategyBenchmarkMatchSummary;
    }> = [
      {
        defaultSeat: "player_one",
        summary: simulateAutomatedDeckMatch({
          artifactRoot,
          matchId: `strategy-head-to-head-${index}-${permutation.playerOne.id}-vs-${permutation.playerTwo.id}-default-p1`,
          playerOne: {
            ...permutation.playerOne,
            strategy: defaultLoreRaceAutomatedActionStrategy,
          },
          playerTwo: {
            ...permutation.playerTwo,
            strategy: legacyLoreRaceAutomatedActionStrategy,
          },
          seed: `${permutation.seed}:default-p1`,
          turnLimit: 60,
        }),
      },
      {
        defaultSeat: "player_two",
        summary: simulateAutomatedDeckMatch({
          artifactRoot,
          matchId: `strategy-head-to-head-${index}-${permutation.playerOne.id}-vs-${permutation.playerTwo.id}-legacy-p1`,
          playerOne: {
            ...permutation.playerOne,
            strategy: legacyLoreRaceAutomatedActionStrategy,
          },
          playerTwo: {
            ...permutation.playerTwo,
            strategy: defaultLoreRaceAutomatedActionStrategy,
          },
          seed: `${permutation.seed}:legacy-p1`,
          turnLimit: 60,
        }),
      },
    ];

    for (const game of games) {
      if (!game.summary.winner) {
        noWinnerGames += 1;
      } else if (game.summary.winner === game.defaultSeat) {
        strategyWins[defaultLoreRaceAutomatedActionStrategy.name] += 1;
      } else {
        strategyWins[legacyLoreRaceAutomatedActionStrategy.name] += 1;
      }

      if (game.summary.deadlockConcedeCount > 0) {
        const deadlockStrategyName =
          game.defaultSeat === game.summary.winner
            ? legacyLoreRaceAutomatedActionStrategy.name
            : defaultLoreRaceAutomatedActionStrategy.name;
        strategyDeadlockConcedes[deadlockStrategyName] += game.summary.deadlockConcedeCount;
      }

      for (const trace of readStrategyTraceSummaries(
        game.summary.artifactPaths.strategyDecisions,
      )) {
        if (trace.fallbackTaken === "concede") {
          strategyConcedeFallbacks[trace.strategyName] =
            (strategyConcedeFallbacks[trace.strategyName] ?? 0) + 1;
        }
      }
    }
  });

  return {
    artifactRoot,
    games: permutations.length * 2,
    noWinnerGames,
    strategyDeadlockConcedes,
    strategyConcedeFallbacks,
    strategyWins,
  };
}

describe("strategy deck simulation convenience method", () => {
  it(
    "simulates a real deck matchup to a winner within 50 turns",
    () => {
      const summary = simulateAutomatedDeckMatch({
        includeGameLogTranscript: true,
        matchId: "amber-amethyst-aggressive-vs-steel-sapphire-midrange-turn-cap-50",
        playerOne: {
          fixture: amberAmethystAggressive,
          id: "amberAmethystAggressive",
        },
        playerTwo: {
          fixture: steelSapphireMidrange,
          id: "steelSapphireMidrange",
        },
        seed: "strategy-suite:amber-amethyst-aggressive-vs-steel-sapphire-midrange-turn-cap-50",
        turnLimit: 50,
      });

      logger.info(
        "Strategy simulation {matchId} finished with {winner} after {turns} turns and {actions} actions ({playerOneLore}-{playerTwoLore} lore)",
        {
          actions: summary.actions,
          matchId: summary.matchId,
          playerOneLore: summary.loreTotals.player_one,
          playerTwoLore: summary.loreTotals.player_two,
          turns: summary.turns,
          winner: resolveWinnerLabel(summary),
        },
      );

      for (const line of summary.gameLogTranscript ?? []) {
        logger.info("{line}", { line });
      }

      expect(summary.endReason).toBe("winner");
      expect(summary.gameEndReason).toBeDefined();
      expect(summary.winner).toBeDefined();
      if (summary.gameEndReason === "Reached 20 lore") {
        expect(resolveWinnerLore(summary)).toBeGreaterThanOrEqual(20);
      } else {
        expect(summary.gameEndReason).toContain("conceded");
      }
      expect(Array.isArray(summary.gameLogTranscript)).toBe(true);
      expect(summary.turns).toBeLessThanOrEqual(50);
    },
    { timeout: 20000 },
  );

  it(
    "does not deadlock when steel-sapphire-aggressive reaches the old stuck scenario",
    () => {
      const summary = simulateAutomatedDeckMatch({
        matchId: "steel-sapphire-aggressive-vs-amber-amethyst-aggressive-stuck-concede",
        playerOne: {
          fixture: steelSapphireAggressive,
          id: "steelSapphireAggressive",
        },
        playerTwo: {
          fixture: amberAmethystAggressive,
          id: "amberAmethystAggressive",
        },
        seed: "plan-probe:Steel Sapphire Aggressive:Amber Amethyst Aggressive:0",
        turnLimit: 60,
      });

      expect(summary.endReason).toBe("winner");
      expect(summary.deadlock).toBe(false);
      expect(summary.gameEndReason).toBeDefined();
      if (summary.gameEndReason === "Reached 20 lore") {
        expect(resolveWinnerLore(summary)).toBeGreaterThanOrEqual(20);
      } else {
        expect(summary.gameEndReason).toContain("conceded");
      }
      expect(summary.winner).toBeDefined();
    },
    { timeout: 20000 },
  );

  it.if(RUN_SLOW_STRATEGY_TESTS)(
    "uses the configured strategy for each player",
    () => {
      const artifactRoot = mkdtempSync(join(tmpdir(), "simulate-game-strategy-matchup-"));
      const playerOneStrategy = createPassThroughStrategy("player-one-test-strategy");
      const playerTwoStrategy = createPassThroughStrategy("player-two-test-strategy");

      try {
        const summary = simulateAutomatedDeckMatch({
          artifactRoot,
          matchId: "amber-amethyst-aggressive-vs-steel-sapphire-midrange-custom-strategies",
          playerOne: {
            fixture: amberAmethystAggressive,
            id: "amberAmethystAggressive",
            strategy: playerOneStrategy,
          },
          playerTwo: {
            fixture: steelSapphireMidrange,
            id: "steelSapphireMidrange",
            strategy: playerTwoStrategy,
          },
          seed: "strategy-suite:amber-amethyst-aggressive-vs-steel-sapphire-midrange-custom-strategies",
          turnLimit: 20,
        });

        const strategyNames = new Set(readStrategyNames(summary.artifactPaths.strategyDecisions));

        expect(summary.actions).toBeGreaterThan(0);
        expect(strategyNames).toContain(playerOneStrategy.name);
        expect(strategyNames).toContain(playerTwoStrategy.name);
      } finally {
        rmSync(artifactRoot, { force: true, recursive: true });
      }
    },
    { timeout: 20000 },
  );

  it.if(RUN_SLOW_STRATEGY_TESTS)(
    "falls back to the default strategy for players without an override",
    () => {
      const artifactRoot = mkdtempSync(join(tmpdir(), "simulate-game-strategy-default-"));
      const playerOneStrategy = createPassThroughStrategy("player-one-only-strategy");

      try {
        const summary = simulateAutomatedDeckMatch({
          artifactRoot,
          matchId: "amber-amethyst-aggressive-vs-steel-sapphire-midrange-mixed-strategies",
          playerOne: {
            fixture: amberAmethystAggressive,
            id: "amberAmethystAggressive",
            strategy: playerOneStrategy,
          },
          playerTwo: {
            fixture: steelSapphireMidrange,
            id: "steelSapphireMidrange",
          },
          seed: "strategy-suite:amber-amethyst-aggressive-vs-steel-sapphire-midrange-mixed-strategies",
          turnLimit: 20,
        });

        const strategyNames = new Set(readStrategyNames(summary.artifactPaths.strategyDecisions));

        expect(summary.actions).toBeGreaterThan(0);
        expect(strategyNames).toContain(playerOneStrategy.name);
        expect(strategyNames).toContain(deckAwareLoreRaceAutomatedActionStrategy.name);
      } finally {
        rmSync(artifactRoot, { force: true, recursive: true });
      }
    },
    { timeout: 20000 },
  );

  it.if(RUN_STRATEGY_BATCH_BENCHMARK)(
    "runs 100 deterministic permutations for legacy vs default strategy analysis",
    () => {
      const permutations = createBenchmarkPermutations(createBenchmarkDecks(DECK_FIXTURES), 100);
      const legacyBatch = runBenchmarkBatch({
        artifactPrefix: "simulate-game-strategy-benchmark-legacy-",
        label: "legacy",
        permutations,
        strategy: legacyLoreRaceAutomatedActionStrategy,
      });
      const defaultBatch = runBenchmarkBatch({
        artifactPrefix: "simulate-game-strategy-benchmark-default-",
        label: "default",
        permutations,
        strategy: defaultLoreRaceAutomatedActionStrategy,
      });

      logger.info("Strategy benchmark legacy artifacts {artifactRoot}", {
        artifactRoot: legacyBatch.artifactRoot,
      });
      logger.info("Strategy benchmark default artifacts {artifactRoot}", {
        artifactRoot: defaultBatch.artifactRoot,
      });
      logger.info("Strategy benchmark legacy summary {summary}", {
        summary: JSON.stringify(formatBenchmarkSummaryForLog(legacyBatch.summary)),
      });
      logger.info("Strategy benchmark default summary {summary}", {
        summary: JSON.stringify(formatBenchmarkSummaryForLog(defaultBatch.summary)),
      });
      logger.info("Strategy benchmark delta {summary}", {
        summary: JSON.stringify(
          summarizeBatchDelta({
            after: defaultBatch.summary,
            before: legacyBatch.summary,
          }),
        ),
      });

      expect(legacyBatch.matches).toHaveLength(100);
      expect(defaultBatch.matches).toHaveLength(100);
      expect(legacyBatch.matches.every((summary) => summary.endReason === "winner")).toBe(true);
      expect(defaultBatch.matches.every((summary) => summary.endReason === "winner")).toBe(true);
      expect(legacyBatch.matches.every((summary) => summary.gameEndReason)).toBe(true);
      expect(defaultBatch.matches.every((summary) => summary.gameEndReason)).toBe(true);
    },
    { timeout: 600000 },
  );

  it.if(RUN_STRATEGY_HEAD_TO_HEAD_BENCHMARK)(
    "runs a mirrored default-vs-legacy head-to-head benchmark on the same seeds",
    () => {
      const permutations = createBenchmarkPermutations(createBenchmarkDecks(DECK_FIXTURES), 100);
      const summary = runMirroredHeadToHeadBenchmark(permutations);

      logger.info("Strategy head-to-head artifacts {artifactRoot}", {
        artifactRoot: summary.artifactRoot,
      });
      logger.info("Strategy head-to-head summary {summary}", {
        summary: JSON.stringify({
          games: summary.games,
          noWinnerGames: summary.noWinnerGames,
          strategyDeadlockConcedes: summary.strategyDeadlockConcedes,
          strategyConcedeFallbacks: summary.strategyConcedeFallbacks,
          strategyWins: summary.strategyWins,
        }),
      });

      expect(summary.games).toBe(200);
      expect(summary.noWinnerGames).toBe(0);
    },
    { timeout: 600000 },
  );

  it.if(RUN_STRATEGY_LAB || RUN_STRATEGY_BENCHMARK)(
    "runs the opt-in strategy lab matrix with env-driven filters",
    () => {
      const { digest, report, summary } = runStrategyLab({
        deckIds: parseStrategyLabFilter(process.env.STRATEGY_DECKS),
        gameCount: resolveStrategyLabGameCount(
          process.env.STRATEGY_GAME_COUNT,
          RUN_STRATEGY_BENCHMARK ? 100 : 20,
        ),
        matchMode: process.env.STRATEGY_MATCH_MODE
          ? resolveStrategyLabMatchMode(process.env.STRATEGY_MATCH_MODE)
          : undefined,
        preset: STRATEGY_BENCHMARK_PRESET,
        strategyIds: parseStrategyLabFilter(process.env.STRATEGY_STRATEGIES),
      });
      const scorecard = report.scorecards[0];

      logger.info("Strategy lab summary {summary}", {
        summary: JSON.stringify({
          artifactRoot: summary.artifactRoot,
          games: summary.matches.length,
          headline: {
            candidate: scorecard?.candidateId ?? "none",
            blendedScore: scorecard?.score.blendedScore ?? 0,
            crossDeckScore: scorecard?.score.crossDeckScore ?? 0,
            mirrorScore: scorecard?.score.mirrorScore ?? 0,
            promotionGate: scorecard?.promotionGate.passed ?? false,
            worstMatchup: report.worstMatchups[0]?.label ?? "none",
          },
          metadata: {
            deckIds: summary.deckIds,
            mode: summary.mode,
            preset: summary.preset ?? "custom",
            strategyIds: summary.strategyIds,
          },
        }),
      });

      console.log(buildTriageDigestConsoleOutput(digest));

      const previousSummary = loadPreviousRunSummary(summary.artifactRoot);
      if (previousSummary) {
        const comparison = compareStrategyRuns(previousSummary, summary);
        console.log(buildRunComparisonConsoleOutput(comparison));
      }

      expect(summary.matches.length).toBeGreaterThan(0);
      expect(summary.matches.every((match) => match.playerOneStrategyId.length > 0)).toBe(true);
      expect(summary.matches.every((match) => match.playerTwoStrategyId.length > 0)).toBe(true);
      expect(report.strategyRecords.length).toBeGreaterThan(0);
      if (summary.strategyIds.includes(BOARD_CONTROL_LORE_RACE_STRATEGY_ID)) {
        expect(
          report.scorecards.some(
            (entry) => entry.candidateId === BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
          ),
        ).toBe(true);
      }
    },
    { timeout: STRATEGY_LAB_TIMEOUT_MS },
  );
});

const RUN_STRATEGY_QUICK_REPLAY = process.env.RUN_STRATEGY_QUICK_REPLAY === "1";

describe("strategy quick replay", () => {
  it.if(RUN_STRATEGY_QUICK_REPLAY)(
    "runs 20 quick replay mirror games on core decks",
    () => {
      const { summary } = runQuickReplayCheck();
      expect(summary.matches).toHaveLength(20);
      for (const match of summary.matches) {
        expect(match.endReason).toBe("winner");
      }
    },
    { timeout: 180_000 },
  );
});

const RUN_STRATEGY_REPLAY = process.env.RUN_STRATEGY_REPLAY === "1";
const STRATEGY_REPLAY_SUMMARY = process.env.STRATEGY_REPLAY_SUMMARY;
const STRATEGY_REPLAY_INDEX = Number(process.env.STRATEGY_REPLAY_INDEX ?? "0");

describe("strategy match replay", () => {
  it.if(RUN_STRATEGY_REPLAY)(
    "replays a specific match from a run summary",
    () => {
      const summaryPath =
        STRATEGY_REPLAY_SUMMARY ?? join(getStrategyArtifactRoot(), "run-summary.json");
      const rawSummary: StrategySuiteRunSummary = JSON.parse(readFileSync(summaryPath, "utf-8"));
      const result = replayMatchFromRunSummary(rawSummary, STRATEGY_REPLAY_INDEX);
      expect(result.endReason).toBe("winner");
    },
    { timeout: 60_000 },
  );
});
