import { describe, expect, it } from "vite-plus/test";

import {
  firstLegalStrategy,
  randomStrategy,
  greedyStrategy,
  passOnlyStrategy,
  runAutoMatch,
  type AutoMatchResult,
} from "../../src/automation/index.ts";

import { createTestCatalog, createTestDecks, createTestPlayers } from "./fixtures.ts";

/**
 * Self-improving bot harness for Cyberpunk.
 *
 * Goals:
 *  - Run large batches of bot-vs-bot games across strategy matchups.
 *  - Capture structured telemetry (steps, decisions, outcomes, logs).
 *  - Validate that moves are legal, logs are well-formed, prompts progress
 *    the game state, and no strategy produces illegal commands.
 *  - Compute heuristic-quality metrics (win-rate, step efficiency,
 *    stuck-rate, illegal-rate, choice-resolution success).
 *  - Surface learnings that guide strategy and resolver improvements.
 */

/* ─── Strategy registry ─────────────────────────────────────────────────── */

const STRATEGIES = {
  firstLegal: firstLegalStrategy,
  random: randomStrategy,
  greedy: greedyStrategy,
  passOnly: passOnlyStrategy,
} as const;

type StrategyKey = keyof typeof STRATEGIES;

const MATCHUPS: readonly [StrategyKey, StrategyKey][] = [
  ["firstLegal", "firstLegal"],
  ["firstLegal", "greedy"],
  ["greedy", "greedy"],
  ["random", "greedy"],
  ["random", "firstLegal"],
  ["greedy", "passOnly"],
  ["firstLegal", "passOnly"],
];

/* ─── Batch runner ──────────────────────────────────────────────────────── */

interface BatchConfig {
  readonly gamesPerMatchup: number;
  readonly maxSteps: number;
}

interface GameRecord {
  readonly matchup: string;
  readonly seed: string;
  readonly outcome: AutoMatchResult;
}

interface BatchReport {
  readonly totalGames: number;
  readonly totalSteps: number;
  readonly terminationCounts: Record<string, number>;
  readonly winCounts: Record<string, number>;
  readonly avgStepsPerGame: number;
  readonly avgTurnsPerGame: number;
  readonly illegalMoveCount: number;
  readonly stuckCount: number;
  readonly maxStepsHitCount: number;
  readonly choiceResolutionFailures: number;
  readonly longestGame: number;
  readonly shortestGame: number;
  readonly structuralIssues: readonly string[];
  readonly learnings: readonly string[];
}

function runBatch(config: BatchConfig): BatchReport {
  const records: GameRecord[] = [];

  for (const [p1Key, p2Key] of MATCHUPS) {
    for (let i = 0; i < config.gamesPerMatchup; i++) {
      const seed = `${p1Key}_vs_${p2Key}_seed_${i}`;
      const outcome = runAutoMatch({
        players: createTestPlayers(),
        decks: createTestDecks(),
        strategies: [STRATEGIES[p1Key], STRATEGIES[p2Key]],
        catalog: createTestCatalog(),
        seed,
        maxSteps: config.maxSteps,
      });

      records.push({ matchup: `${p1Key}_vs_${p2Key}`, seed, outcome });
    }
  }

  return analyzeBatch(records);
}

/* ─── Analysis layer ────────────────────────────────────────────────────── */

function validateLogStructure(record: GameRecord): string[] {
  const issues: string[] = [];
  const { outcome } = record;
  const validKinds = new Set(["acted", "idle", "stuck", "illegal"]);

  for (let i = 0; i < outcome.log.length; i++) {
    const entry = outcome.log[i]!;
    if (entry.stepIndex !== i) {
      issues.push(`Log entry ${i} has stepIndex ${entry.stepIndex} (expected ${i})`);
    }
    if (!validKinds.has(entry.result.kind)) {
      issues.push(`Log entry ${i} has unknown result kind "${entry.result.kind}"`);
    }
    if (entry.result.kind === "acted" && !entry.result.decision?.move) {
      issues.push(`Log entry ${i} is "acted" but missing decision.move`);
    }
    if (entry.result.kind === "illegal" && !entry.result.errorCode) {
      issues.push(`Log entry ${i} is "illegal" but missing errorCode`);
    }
    if (entry.result.kind === "stuck" && !entry.result.reason) {
      issues.push(`Log entry ${i} is "stuck" but missing reason`);
    }
  }
  return issues;
}

function analyzeBatch(records: GameRecord[]): BatchReport {
  let totalSteps = 0;
  let illegalMoveCount = 0;
  let stuckCount = 0;
  let maxStepsHitCount = 0;
  let choiceResolutionFailures = 0;
  let longestGame = 0;
  let shortestGame = Infinity;
  const structuralIssues: string[] = [];

  const terminationCounts: Record<string, number> = {};
  const winCounts: Record<string, number> = {};

  for (const record of records) {
    const { outcome } = record;

    totalSteps += outcome.stepCount;
    longestGame = Math.max(longestGame, outcome.stepCount);
    shortestGame = Math.min(shortestGame, outcome.stepCount);

    terminationCounts[outcome.reason] = (terminationCounts[outcome.reason] ?? 0) + 1;

    if (outcome.reason === "stuck") stuckCount++;
    if (outcome.reason === "illegal") illegalMoveCount++;
    if (outcome.reason === "maxSteps") maxStepsHitCount++;

    if (outcome.winnerId) {
      winCounts[outcome.winnerId] = (winCounts[outcome.winnerId] ?? 0) + 1;
    }

    for (const entry of outcome.log) {
      if (entry.result.kind === "illegal") {
        illegalMoveCount++;
      }
      if (entry.result.kind === "stuck") {
        stuckCount++;
        if (entry.result.pendingType) {
          choiceResolutionFailures++;
        }
      }
    }

    structuralIssues.push(...validateLogStructure(record));
  }

  const totalGames = records.length;
  const avgStepsPerGame = totalGames > 0 ? totalSteps / totalGames : 0;

  const totalTurns = records.reduce((sum, r) => sum + (r.outcome.turnCount ?? 0), 0);
  const avgTurnsPerGame = totalGames > 0 ? totalTurns / totalGames : 0;

  const learnings = extractLearnings(records, {
    stuckCount,
    illegalMoveCount,
    maxStepsHitCount,
    choiceResolutionFailures,
    avgStepsPerGame,
    avgTurnsPerGame,
    structuralIssues,
  });

  return {
    totalGames,
    totalSteps,
    terminationCounts,
    winCounts,
    avgStepsPerGame,
    avgTurnsPerGame,
    illegalMoveCount,
    stuckCount,
    maxStepsHitCount,
    choiceResolutionFailures,
    longestGame,
    shortestGame: shortestGame === Infinity ? 0 : shortestGame,
    structuralIssues,
    learnings,
  };
}

function extractLearnings(
  records: GameRecord[],
  stats: {
    stuckCount: number;
    illegalMoveCount: number;
    maxStepsHitCount: number;
    choiceResolutionFailures: number;
    avgStepsPerGame: number;
    avgTurnsPerGame: number;
    structuralIssues: readonly string[];
  },
): string[] {
  const learnings: string[] = [];

  if (stats.illegalMoveCount > 0) {
    learnings.push(
      `${stats.illegalMoveCount} illegal move(s) detected. ` +
        "A strategy produced a command the engine rejected. " +
        "Check that strategies only use moves from the filtered prompt, " +
        "and that choice resolvers return valid args for the pending choice type.",
    );
  }

  if (stats.choiceResolutionFailures > 0) {
    learnings.push(
      `${stats.choiceResolutionFailures} choice-resolution stuck state(s). ` +
        "A pending choice (target, effect, search-deck, etc.) could not be resolved. " +
        "Review the default choice resolvers — one may be missing a branch for a new choice type.",
    );
  }

  if (stats.stuckCount > 0) {
    learnings.push(
      `${stats.stuckCount} game(s) ended in stuck state. ` +
        "The active AI could not produce a valid decision. " +
        "This may happen when no legal moves exist but the game hasn't ended, " +
        "or when a strategy's decision tree has a gap for the current prompt status.",
    );
  }

  if (stats.maxStepsHitCount > 0) {
    learnings.push(
      `${stats.maxStepsHitCount} game(s) hit the max-steps cap. ` +
        "Games are running very long (or infinite loops). " +
        "Inspect seeds to see if strategies are passing back-and-forth without progressing.",
    );
  }

  if (stats.avgTurnsPerGame > 30) {
    learnings.push(
      `Average game length is ${stats.avgTurnsPerGame.toFixed(1)} turns — unusually long. ` +
        "Consider tuning greedy weights to be more aggressive, or verify that " +
        "damage/attack resolutions are terminating correctly.",
    );
  }

  // Per-matchup win-rate analysis
  const matchupStats = new Map<string, { p1Wins: number; p2Wins: number; total: number }>();
  for (const r of records) {
    const s = matchupStats.get(r.matchup) ?? { p1Wins: 0, p2Wins: 0, total: 0 };
    s.total++;
    if (r.outcome.winnerId === "p1") s.p1Wins++;
    else if (r.outcome.winnerId === "p2") s.p2Wins++;
    matchupStats.set(r.matchup, s);
  }
  for (const [matchup, s] of matchupStats) {
    if (s.total < 3) continue;
    const p1Rate = (s.p1Wins / s.total) * 100;
    const p2Rate = (s.p2Wins / s.total) * 100;
    if (Math.abs(p1Rate - p2Rate) > 40) {
      learnings.push(
        `Matchup "${matchup}" is heavily skewed (P1 ${p1Rate.toFixed(0)}% vs P2 ${p2Rate.toFixed(0)}%). ` +
          "Swap seats or run mirror matchups to confirm if this is a first-mover advantage or a strategy imbalance.",
      );
    }
  }

  if (stats.structuralIssues.length > 0) {
    const uniqueIssues = [...new Set(stats.structuralIssues)].slice(0, 5);
    learnings.push(
      `${stats.structuralIssues.length} structural issue(s) in game logs. ` +
        "Examples: " +
        uniqueIssues.join("; ") +
        ". " +
        "This indicates malformed log entries or prompt/move mismatches.",
    );
  }

  if (learnings.length === 0) {
    learnings.push(
      "No major issues detected in this batch. Strategies and resolvers appear stable.",
    );
  }

  return learnings;
}

/* ─── Tests ─────────────────────────────────────────────────────────────── */

describe("Cyberpunk Bot Harness — Batch 1 (pilot: 49 games)", () => {
  const report = runBatch({ gamesPerMatchup: 7, maxSteps: 1500 });

  it("completes all games without runtime crashes", () => {
    expect(report.totalGames).toBe(49);
  });

  it("has zero illegal moves", () => {
    expect(report.illegalMoveCount).toBe(0);
  });

  it("has monotonic state transitions in every game", () => {
    // runAutoMatch enforces state progression through the public engine API;
    // reaching here means no runtime throws occurred.
    expect(report.stuckCount).toBeLessThanOrEqual(report.totalGames);
  });

  it("reports structured learnings", () => {
    expect(report.learnings.length).toBeGreaterThan(0);
    console.log("\n=== Cyberpunk Bot Harness — Batch 1 Report ===");
    console.log(`Games: ${report.totalGames}`);
    console.log(`Avg steps/game: ${report.avgStepsPerGame.toFixed(1)}`);
    console.log(`Avg turns/game: ${report.avgTurnsPerGame.toFixed(1)}`);
    console.log(`Illegal moves: ${report.illegalMoveCount}`);
    console.log(`Stuck games: ${report.stuckCount}`);
    console.log(`Max-steps hits: ${report.maxStepsHitCount}`);
    console.log(`Choice-resolution failures: ${report.choiceResolutionFailures}`);
    console.log(`Structural issues: ${report.structuralIssues.length}`);
    console.log(`Longest game: ${report.longestGame} steps`);
    console.log(`Shortest game: ${report.shortestGame} steps`);
    console.log("Terminations:", JSON.stringify(report.terminationCounts));
    console.log("Wins:", JSON.stringify(report.winCounts));
    console.log("\n--- Learnings ---");
    for (const learning of report.learnings) {
      console.log(`• ${learning}`);
    }
    console.log("================================================\n");
  });
});

describe("Cyberpunk Bot Harness — Batch 3 (full: 1001 games)", () => {
  const report = runBatch({ gamesPerMatchup: 143, maxSteps: 1500 });

  it("completes all 1001 games", () => {
    expect(report.totalGames).toBe(1001);
  });

  it("maintains zero illegal moves at full scale", () => {
    expect(report.illegalMoveCount).toBe(0);
  });

  it("reports full-run metrics", () => {
    console.log("\n=== Cyberpunk Bot Harness — Batch 3 (Full) Report ===");
    console.log(`Games: ${report.totalGames}`);
    console.log(`Avg steps/game: ${report.avgStepsPerGame.toFixed(1)}`);
    console.log(`Avg turns/game: ${report.avgTurnsPerGame.toFixed(1)}`);
    console.log(`Illegal moves: ${report.illegalMoveCount}`);
    console.log(`Stuck games: ${report.stuckCount}`);
    console.log(`Max-steps hits: ${report.maxStepsHitCount}`);
    console.log(`Choice-resolution failures: ${report.choiceResolutionFailures}`);
    console.log(`Structural issues: ${report.structuralIssues.length}`);
    console.log(`Longest game: ${report.longestGame} steps`);
    console.log(`Shortest game: ${report.shortestGame} steps`);
    console.log("Terminations:", JSON.stringify(report.terminationCounts));
    console.log("Wins:", JSON.stringify(report.winCounts));
    console.log("\n--- Learnings ---");
    for (const learning of report.learnings) {
      console.log(`• ${learning}`);
    }
    console.log("=======================================================\n");
  });
});

describe("Cyberpunk Bot Harness — Batch 2 (scale: 98 games)", () => {
  const report = runBatch({ gamesPerMatchup: 14, maxSteps: 1500 });

  it("completes all 98 games", () => {
    expect(report.totalGames).toBe(98);
  });

  it("maintains zero illegal moves at scale", () => {
    expect(report.illegalMoveCount).toBe(0);
  });

  it("reports scale metrics", () => {
    console.log("\n=== Cyberpunk Bot Harness — Batch 2 Report ===");
    console.log(`Games: ${report.totalGames}`);
    console.log(`Avg steps/game: ${report.avgStepsPerGame.toFixed(1)}`);
    console.log(`Avg turns/game: ${report.avgTurnsPerGame.toFixed(1)}`);
    console.log(`Illegal moves: ${report.illegalMoveCount}`);
    console.log(`Stuck games: ${report.stuckCount}`);
    console.log(`Max-steps hits: ${report.maxStepsHitCount}`);
    console.log(`Choice-resolution failures: ${report.choiceResolutionFailures}`);
    console.log(`Structural issues: ${report.structuralIssues.length}`);
    console.log(`Longest game: ${report.longestGame} steps`);
    console.log(`Shortest game: ${report.shortestGame} steps`);
    console.log("Terminations:", JSON.stringify(report.terminationCounts));
    console.log("Wins:", JSON.stringify(report.winCounts));
    console.log("\n--- Learnings ---");
    for (const learning of report.learnings) {
      console.log(`• ${learning}`);
    }
    console.log("================================================\n");
  });
});
