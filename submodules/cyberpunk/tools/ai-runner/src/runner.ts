import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import {
  firstLegalStrategy,
  greedyStrategy,
  mctsGreedyStrategy,
  mctsStrategy,
  monteCarloGreedyStrategy,
  monteCarloStrategy,
  randomStrategy,
  runAutoMatch,
  type AIStrategy,
  type AutoMatchResult,
} from "@tcg/cyberpunk-engine";
import { createTestCatalog, createTestDecks, createTestPlayers } from "./test-catalog.ts";
import { createRealCatalog, createRealDecks } from "./real-catalog.ts";

export type StrategyName =
  | "first-legal"
  | "random"
  | "greedy"
  | "monte-carlo"
  | "monte-carlo-greedy"
  | "mcts"
  | "mcts-greedy";

const STRATEGIES: Record<StrategyName, AIStrategy> = {
  "first-legal": firstLegalStrategy,
  random: randomStrategy,
  greedy: greedyStrategy,
  "monte-carlo": monteCarloStrategy,
  "monte-carlo-greedy": monteCarloGreedyStrategy,
  mcts: mctsStrategy,
  "mcts-greedy": mctsGreedyStrategy,
};

export function lookupStrategy(name: string): AIStrategy {
  const s = STRATEGIES[name as StrategyName];
  if (!s)
    throw new Error(
      `Unknown strategy: ${name}. Pick one of: ${Object.keys(STRATEGIES).join(", ")}`,
    );
  return s;
}

export interface BatchOptions {
  strategyA: string;
  strategyB: string;
  matches: number;
  seed: string;
  maxSteps?: number;
  /** Use real `@tcg/cyberpunk-cards` decks instead of the hand-rolled fixture. */
  realCards?: boolean;
}

export interface BatchSummary {
  matches: number;
  options: BatchOptions;
  /** Wins keyed by player id (`p1` / `p2`), not by strategy name. */
  perPlayerWins: Record<string, number>;
  draws: number;
  reasonCounts: Record<AutoMatchResult["reason"], number>;
  illegalCount: number;
  averageTurnCount: number;
  averageStepCount: number;
  /** First match whose result is illegal/stuck, captured for `--verbose` debugging. */
  firstFailingMatch?: AutoMatchResult & { seed: string };
  /** First match overall, captured for verbose dumps when nothing failed. */
  firstMatch?: AutoMatchResult & { seed: string };
}

export function runBatch(opts: BatchOptions): BatchSummary {
  const aStrategy = lookupStrategy(opts.strategyA);
  const bStrategy = lookupStrategy(opts.strategyB);

  const summary: BatchSummary = {
    matches: opts.matches,
    options: opts,
    perPlayerWins: { p1: 0, p2: 0 },
    draws: 0,
    reasonCounts: {
      winCondition: 0,
      concede: 0,
      deckOut: 0,
      stuck: 0,
      illegal: 0,
      maxSteps: 0,
    },
    illegalCount: 0,
    averageTurnCount: 0,
    averageStepCount: 0,
  };

  let totalTurns = 0;
  let totalSteps = 0;

  const catalog = opts.realCards ? createRealCatalog() : createTestCatalog();
  // Hoist the deck list out of the match loop — it's deterministic and
  // identical across matches in a batch (deck content doesn't depend on
  // match seed). Building once avoids re-sorting structuredCards N times.
  // `runAutoMatch` shuffles internally, so the same `decks` value is safe
  // to reuse across matches.
  const decks = opts.realCards ? createRealDecks() : createTestDecks();

  for (let i = 0; i < opts.matches; i++) {
    const matchSeed = `${opts.seed}/match-${i}`;
    const result = runAutoMatch({
      players: createTestPlayers(),
      decks,
      strategies: [aStrategy, bStrategy],
      catalog,
      seed: matchSeed,
      maxSteps: opts.maxSteps,
    });

    if (i === 0) summary.firstMatch = { ...result, seed: matchSeed };

    summary.reasonCounts[result.reason] += 1;
    if (result.winnerId) {
      summary.perPlayerWins[result.winnerId] = (summary.perPlayerWins[result.winnerId] ?? 0) + 1;
    } else {
      summary.draws += 1;
    }

    totalTurns += result.turnCount;
    totalSteps += result.stepCount;

    let matchHadIllegal = false;
    for (const entry of result.log) {
      if (entry.result.kind === "illegal") {
        summary.illegalCount += 1;
        matchHadIllegal = true;
      }
    }

    if (!summary.firstFailingMatch && (matchHadIllegal || result.reason === "stuck")) {
      summary.firstFailingMatch = { ...result, seed: matchSeed };
    }
  }

  summary.averageTurnCount = opts.matches === 0 ? 0 : totalTurns / opts.matches;
  summary.averageStepCount = opts.matches === 0 ? 0 : totalSteps / opts.matches;
  return summary;
}

export interface TournamentOptions {
  strategies: string[];
  matches: number;
  seed: string;
  maxSteps?: number;
  realCards?: boolean;
}

export interface TournamentCell {
  strategyA: string;
  strategyB: string;
  summary: BatchSummary;
}

export interface TournamentSummary {
  options: TournamentOptions;
  cells: TournamentCell[];
  /** Aggregate wins per strategy across every match it played, on either side. */
  totalWinsByStrategy: Record<string, number>;
  totalMatches: number;
  totalIllegal: number;
}

/**
 * Round-robin every strategy against every other strategy (including mirror
 * matchups) for `matches` games per pairing. Useful for ranking strategies
 * against the full pool in a single command.
 */
export function runTournament(opts: TournamentOptions): TournamentSummary {
  const cells: TournamentCell[] = [];
  const totalWinsByStrategy: Record<string, number> = {};
  for (const s of opts.strategies) totalWinsByStrategy[s] = 0;

  let totalMatches = 0;
  let totalIllegal = 0;

  for (const a of opts.strategies) {
    for (const b of opts.strategies) {
      const summary = runBatch({
        strategyA: a,
        strategyB: b,
        matches: opts.matches,
        seed: `${opts.seed}/${a}-vs-${b}`,
        maxSteps: opts.maxSteps,
        realCards: opts.realCards,
      });
      cells.push({ strategyA: a, strategyB: b, summary });
      totalWinsByStrategy[a] = (totalWinsByStrategy[a] ?? 0) + (summary.perPlayerWins["p1"] ?? 0);
      totalWinsByStrategy[b] = (totalWinsByStrategy[b] ?? 0) + (summary.perPlayerWins["p2"] ?? 0);
      totalMatches += summary.matches;
      totalIllegal += summary.illegalCount;
    }
  }

  return { options: opts, cells, totalWinsByStrategy, totalMatches, totalIllegal };
}

export function listStrategies(): string[] {
  return Object.keys(STRATEGIES);
}

/**
 * Run a batch across `workerCount` worker threads, splitting the match count
 * evenly between them and merging the resulting summaries. Each worker gets
 * a distinct seed prefix so results stay deterministic and reproducible.
 *
 * Falls back to a single in-process `runBatch` when `workerCount <= 1` or
 * when the requested matches don't justify the spawn overhead (< 2 per
 * worker) — there's no point spinning up threads to run one match each.
 */
export async function runBatchParallel(
  opts: BatchOptions,
  workerCount: number,
): Promise<BatchSummary> {
  if (workerCount <= 1 || opts.matches < workerCount * 2) {
    return runBatch(opts);
  }

  const chunks = splitMatches(opts.matches, workerCount);
  const results = await Promise.all(
    chunks.map((chunkMatches, idx) =>
      runBatchInWorker({
        ...opts,
        matches: chunkMatches,
        seed: `${opts.seed}/w${idx}`,
      }),
    ),
  );
  return mergeBatchSummaries(opts, results);
}

function splitMatches(total: number, parts: number): number[] {
  const base = Math.floor(total / parts);
  const remainder = total - base * parts;
  return Array.from({ length: parts }, (_, i) => base + (i < remainder ? 1 : 0));
}

function runBatchInWorker(opts: BatchOptions): Promise<BatchSummary> {
  const workerUrl = new URL("./worker.ts", import.meta.url);
  if (workerUrl.protocol !== "file:") {
    return Promise.resolve(runBatch(opts));
  }
  return new Promise((resolve, reject) => {
    const worker = new Worker(fileURLToPath(workerUrl), {
      workerData: opts,
      execArgv: ["--experimental-transform-types"],
    });
    worker.on("message", (summary: BatchSummary) => resolve(summary));
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
    });
  });
}

function mergeBatchSummaries(opts: BatchOptions, parts: BatchSummary[]): BatchSummary {
  const merged: BatchSummary = {
    matches: 0,
    options: opts,
    perPlayerWins: { p1: 0, p2: 0 },
    draws: 0,
    reasonCounts: {
      winCondition: 0,
      concede: 0,
      deckOut: 0,
      stuck: 0,
      illegal: 0,
      maxSteps: 0,
    },
    illegalCount: 0,
    averageTurnCount: 0,
    averageStepCount: 0,
  };
  let totalTurns = 0;
  let totalSteps = 0;
  for (const part of parts) {
    merged.matches += part.matches;
    for (const [pid, wins] of Object.entries(part.perPlayerWins)) {
      merged.perPlayerWins[pid] = (merged.perPlayerWins[pid] ?? 0) + wins;
    }
    merged.draws += part.draws;
    for (const reason of Object.keys(merged.reasonCounts) as Array<
      keyof typeof merged.reasonCounts
    >) {
      merged.reasonCounts[reason] += part.reasonCounts[reason] ?? 0;
    }
    merged.illegalCount += part.illegalCount;
    totalTurns += part.averageTurnCount * part.matches;
    totalSteps += part.averageStepCount * part.matches;
    if (!merged.firstFailingMatch && part.firstFailingMatch) {
      merged.firstFailingMatch = part.firstFailingMatch;
    }
    if (!merged.firstMatch && part.firstMatch) {
      merged.firstMatch = part.firstMatch;
    }
  }
  merged.averageTurnCount = merged.matches === 0 ? 0 : totalTurns / merged.matches;
  merged.averageStepCount = merged.matches === 0 ? 0 : totalSteps / merged.matches;
  return merged;
}
