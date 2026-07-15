import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import {
  attackRivalOnlyStrategy,
  createMonteCarloStrategy,
  firstLegalStrategy,
  getSafeAutomatedActionStrategyOption,
  greedyStrategy,
  mctsGreedyStrategy,
  mctsStrategy,
  randomStrategy,
  runAutoMatch,
  tacticalStrategy,
  type AIStrategy,
  type AutoMatchResult,
} from "@tcg/cyberpunk-engine";
import type { CardCatalog, DeckList } from "@tcg/cyberpunk-engine";
import { createTestCatalog, createTestDecks, createTestPlayers } from "./test-catalog.ts";
import { createRealCatalog, createRealDecks } from "./real-catalog.ts";
import {
  createLegalDeckPool,
  createStructuredCatalog,
  deckListFromGenerated,
  summarizeDeckCoverage,
  type DeckCoverageSummary,
  type DeckSource,
  type GeneratedDeck,
} from "./legal-decks.ts";

export type StrategyName =
  | "default"
  | "first-legal"
  | "attack-rival-only"
  | "random"
  | "greedy"
  | "monte-carlo"
  | "monte-carlo-greedy"
  | "mcts"
  | "mcts-greedy"
  | "tactical";

const STRATEGIES: Record<StrategyName, AIStrategy> = {
  default: getSafeAutomatedActionStrategyOption().strategy,
  "first-legal": firstLegalStrategy,
  "attack-rival-only": attackRivalOnlyStrategy,
  random: randomStrategy,
  greedy: greedyStrategy,
  "monte-carlo": createMonteCarloStrategy({
    rolloutsPerAction: 1,
    maxRolloutSteps: 10,
  }),
  "monte-carlo-greedy": createMonteCarloStrategy({
    rolloutsPerAction: 1,
    maxRolloutSteps: 10,
    rolloutStrategy: greedyStrategy,
  }),
  mcts: mctsStrategy,
  "mcts-greedy": mctsGreedyStrategy,
  tactical: tacticalStrategy,
};

export interface SearchStrategyOptions {
  monteCarloRollouts?: number;
  monteCarloRolloutSteps?: number;
}

export function lookupStrategy(name: string, opts: SearchStrategyOptions = {}): AIStrategy {
  const s = lookupSearchStrategy(name, opts) ?? STRATEGIES[name as StrategyName];
  if (!s)
    throw new Error(
      `Unknown strategy: ${name}. Pick one of: ${Object.keys(STRATEGIES).join(", ")}`,
    );
  return s;
}

function lookupSearchStrategy(name: string, opts: SearchStrategyOptions): AIStrategy | undefined {
  const rolloutsPerAction = opts.monteCarloRollouts ?? 1;
  const maxRolloutSteps = opts.monteCarloRolloutSteps ?? 10;
  if (name === "monte-carlo") {
    return createMonteCarloStrategy({ rolloutsPerAction, maxRolloutSteps });
  }
  if (name === "monte-carlo-greedy") {
    return createMonteCarloStrategy({
      rolloutsPerAction,
      maxRolloutSteps,
      rolloutStrategy: greedyStrategy,
    });
  }
  return undefined;
}

export interface BatchOptions {
  strategyA: string;
  strategyB: string;
  matches: number;
  seed: string;
  maxSteps?: number;
  /** Use real `@tcg/cyberpunk-cards` decks instead of the hand-rolled fixture. */
  realCards?: boolean;
  deckSource?: DeckSource;
  deckLimit?: number;
  deckPairLimit?: number;
  monteCarloRollouts?: number;
  monteCarloRolloutSteps?: number;
}

export interface DeckPairMetadata {
  deckAId: string;
  deckBId: string;
  deckAArchetype: string;
  deckBArchetype: string;
  deckACardSlugs: string[];
  deckBCardSlugs: string[];
}

export interface MatchFailureMetadata extends DeckPairMetadata {
  strategyA: string;
  strategyB: string;
  seed: string;
  reason: AutoMatchResult["reason"];
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
  firstFailingMatch?: AutoMatchResult & { seed: string; failure: MatchFailureMetadata };
  /** First match overall, captured for verbose dumps when nothing failed. */
  firstMatch?: AutoMatchResult & { seed: string; failure: MatchFailureMetadata };
  deckCoverage?: DeckCoverageSummary;
  deckCount: number;
  deckPairCount: number;
}

interface RunnerDeckPair {
  a: GeneratedDeck;
  b: GeneratedDeck;
  decks: [DeckList, DeckList];
}

export function runBatch(opts: BatchOptions): BatchSummary {
  const aStrategy = lookupStrategy(opts.strategyA, opts);
  const bStrategy = lookupStrategy(opts.strategyB, opts);

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
      repeatedState: 0,
      maxSteps: 0,
    },
    illegalCount: 0,
    averageTurnCount: 0,
    averageStepCount: 0,
    deckCount: 0,
    deckPairCount: 0,
  };

  let totalTurns = 0;
  let totalSteps = 0;

  const deckSetup = createDeckSetup(opts);
  summary.deckCoverage = deckSetup.coverage;
  summary.deckCount = deckSetup.deckCount;
  summary.deckPairCount = deckSetup.pairs.length;
  summary.matches = opts.matches * deckSetup.pairs.length;

  let ordinal = 0;
  for (const pair of deckSetup.pairs) {
    for (let i = 0; i < opts.matches; i++) {
      const matchSeed = matchSeedFor(opts, pair, i);
      const result = runAutoMatch({
        players: createTestPlayers(),
        decks: pair.decks,
        strategies: [aStrategy, bStrategy],
        catalog: deckSetup.catalog,
        seed: matchSeed,
        maxSteps: opts.maxSteps,
      });
      const failure = failureMetadata(opts, pair, matchSeed, result.reason);

      if (ordinal === 0) summary.firstMatch = { ...result, seed: matchSeed, failure };

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

      if (
        !summary.firstFailingMatch &&
        (matchHadIllegal ||
          result.reason === "stuck" ||
          result.reason === "repeatedState" ||
          result.reason === "maxSteps")
      ) {
        summary.firstFailingMatch = { ...result, seed: matchSeed, failure };
      }
      ordinal++;
    }
  }

  summary.averageTurnCount = summary.matches === 0 ? 0 : totalTurns / summary.matches;
  summary.averageStepCount = summary.matches === 0 ? 0 : totalSteps / summary.matches;
  return summary;
}

function matchSeedFor(opts: BatchOptions, pair: RunnerDeckPair, matchIndex: number): string {
  const source = normalizeDeckSource(opts);
  if (source === "test" || source === "real-single") return `${opts.seed}/match-${matchIndex}`;
  return `${opts.seed}/${pair.a.id}-vs-${pair.b.id}/match-${matchIndex}`;
}

export interface TournamentOptions {
  strategies: string[];
  matches: number;
  seed: string;
  maxSteps?: number;
  realCards?: boolean;
  deckSource?: DeckSource;
  deckLimit?: number;
  deckPairLimit?: number;
  monteCarloRollouts?: number;
  monteCarloRolloutSteps?: number;
  /**
   * Reuse the same deck-pair/match seeds for every strategy cell. This makes
   * tournament output useful for heuristic comparison because every strategy
   * sees the same shuffled games instead of a strategy-name-specific seed set.
   */
  pairedSeeds?: boolean;
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
  /** Aggregate wins by seat. Useful for spotting first-player bias in a matrix. */
  totalWinsBySeat: Record<"p1" | "p2", number>;
  totalMatches: number;
  totalIllegal: number;
  averageTurnCount: number;
  averageStepCount: number;
  reasonCounts: Record<AutoMatchResult["reason"], number>;
  firstFailingMatch?: BatchSummary["firstFailingMatch"];
  deckCoverage?: DeckCoverageSummary;
  deckCount: number;
  deckPairCount: number;
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
  const totalWinsBySeat: Record<"p1" | "p2", number> = { p1: 0, p2: 0 };

  let totalMatches = 0;
  let totalIllegal = 0;
  let totalTurns = 0;
  let totalSteps = 0;
  let firstFailingMatch: BatchSummary["firstFailingMatch"];
  let deckCoverage: DeckCoverageSummary | undefined;
  let deckCount = 0;
  let deckPairCount = 0;
  const reasonCounts: Record<AutoMatchResult["reason"], number> = {
    winCondition: 0,
    concede: 0,
    deckOut: 0,
    stuck: 0,
    illegal: 0,
    repeatedState: 0,
    maxSteps: 0,
  };

  for (const a of opts.strategies) {
    for (const b of opts.strategies) {
      const summary = runBatch({
        strategyA: a,
        strategyB: b,
        matches: opts.matches,
        seed: opts.pairedSeeds ? opts.seed : `${opts.seed}/${a}-vs-${b}`,
        maxSteps: opts.maxSteps,
        realCards: opts.realCards,
        deckSource: opts.deckSource,
        deckLimit: opts.deckLimit,
        deckPairLimit: opts.deckPairLimit,
        monteCarloRollouts: opts.monteCarloRollouts,
        monteCarloRolloutSteps: opts.monteCarloRolloutSteps,
      });
      cells.push({ strategyA: a, strategyB: b, summary });
      totalWinsByStrategy[a] = (totalWinsByStrategy[a] ?? 0) + (summary.perPlayerWins["p1"] ?? 0);
      totalWinsByStrategy[b] = (totalWinsByStrategy[b] ?? 0) + (summary.perPlayerWins["p2"] ?? 0);
      totalWinsBySeat.p1 += summary.perPlayerWins["p1"] ?? 0;
      totalWinsBySeat.p2 += summary.perPlayerWins["p2"] ?? 0;
      totalMatches += summary.matches;
      totalIllegal += summary.illegalCount;
      totalTurns += summary.averageTurnCount * summary.matches;
      totalSteps += summary.averageStepCount * summary.matches;
      if (!firstFailingMatch && summary.firstFailingMatch)
        firstFailingMatch = summary.firstFailingMatch;
      deckCoverage ??= summary.deckCoverage;
      deckCount = summary.deckCount;
      deckPairCount = summary.deckPairCount;
      for (const reason of Object.keys(reasonCounts) as Array<keyof typeof reasonCounts>) {
        reasonCounts[reason] += summary.reasonCounts[reason] ?? 0;
      }
    }
  }

  return {
    options: opts,
    cells,
    totalWinsByStrategy,
    totalWinsBySeat,
    totalMatches,
    totalIllegal,
    averageTurnCount: totalMatches === 0 ? 0 : totalTurns / totalMatches,
    averageStepCount: totalMatches === 0 ? 0 : totalSteps / totalMatches,
    reasonCounts,
    firstFailingMatch,
    deckCoverage,
    deckCount,
    deckPairCount,
  };
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
      repeatedState: 0,
      maxSteps: 0,
    },
    illegalCount: 0,
    averageTurnCount: 0,
    averageStepCount: 0,
    deckCount: 0,
    deckPairCount: 0,
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
    merged.deckCoverage ??= part.deckCoverage;
    merged.deckCount = part.deckCount;
    merged.deckPairCount = part.deckPairCount;
  }
  merged.averageTurnCount = merged.matches === 0 ? 0 : totalTurns / merged.matches;
  merged.averageStepCount = merged.matches === 0 ? 0 : totalSteps / merged.matches;
  return merged;
}

function createDeckSetup(opts: BatchOptions): {
  catalog: CardCatalog;
  pairs: RunnerDeckPair[];
  coverage?: DeckCoverageSummary;
  deckCount: number;
} {
  const source = normalizeDeckSource(opts);
  if (source === "test") {
    const fixture = createTestDecks()[0];
    const deckA: GeneratedDeck = {
      id: "test",
      archetype: "test",
      legends: fixture.legends,
      mainDeck: fixture.mainDeck,
      coveredSlugs: [...new Set(fixture.mainDeck)].sort(),
    };
    return {
      catalog: createTestCatalog(),
      pairs: [{ a: deckA, b: deckA, decks: createTestDecks() }],
      deckCount: 1,
    };
  }
  if (source === "real-single") {
    const fixture = createRealDecks()[0];
    const deckA: GeneratedDeck = {
      id: "real-single",
      archetype: "real-single",
      legends: fixture.legends,
      mainDeck: fixture.mainDeck,
      coveredSlugs: [...new Set(fixture.mainDeck)].sort(),
    };
    return {
      catalog: createRealCatalog(),
      pairs: [{ a: deckA, b: deckA, decks: createRealDecks() }],
      deckCount: 1,
    };
  }

  const pool = createLegalDeckPool(source);
  const selectedDecks = pool.decks.slice(0, opts.deckLimit ?? pool.decks.length);
  const pairs: RunnerDeckPair[] = [];
  for (const a of selectedDecks) {
    for (const b of selectedDecks) {
      pairs.push({ a, b, decks: [deckListFromGenerated(a, "p1"), deckListFromGenerated(b, "p2")] });
    }
  }
  const selectedPairs = pairs.slice(0, opts.deckPairLimit ?? pairs.length);
  const coveredDecks = new Map<string, GeneratedDeck>();
  for (const pair of selectedPairs) {
    coveredDecks.set(pair.a.id, pair.a);
    coveredDecks.set(pair.b.id, pair.b);
  }
  return {
    catalog: createStructuredCatalog(),
    pairs: selectedPairs,
    coverage: summarizeDeckCoverage([...coveredDecks.values()]),
    deckCount: selectedDecks.length,
  };
}

function normalizeDeckSource(opts: BatchOptions): DeckSource {
  if (opts.deckSource) return opts.deckSource;
  return opts.realCards ? "real-single" : "test";
}

function failureMetadata(
  opts: BatchOptions,
  pair: RunnerDeckPair,
  seed: string,
  reason: AutoMatchResult["reason"],
): MatchFailureMetadata {
  return {
    strategyA: opts.strategyA,
    strategyB: opts.strategyB,
    seed,
    reason,
    deckAId: pair.a.id,
    deckBId: pair.b.id,
    deckAArchetype: pair.a.archetype,
    deckBArchetype: pair.b.archetype,
    deckACardSlugs: pair.a.mainDeck,
    deckBCardSlugs: pair.b.mainDeck,
  };
}
