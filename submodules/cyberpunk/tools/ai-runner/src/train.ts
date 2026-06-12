import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import {
  DEFAULT_GREEDY_WEIGHTS,
  createGreedyStrategy,
  runAutoMatch,
  type AIStrategy,
  type GreedyWeights,
} from "@tcg/cyberpunk-engine";
import { lookupStrategy } from "./runner.ts";
import { createRealCatalog, createRealDecks } from "./real-catalog.ts";
import { createTestCatalog, createTestDecks, createTestPlayers } from "./test-catalog.ts";

/**
 * Self-improving harness for the greedy strategy. Runs a hill-climbing
 * search over `GreedyWeights`: at each iteration we mutate the current
 * best, evaluate the candidate against a fixed baseline opponent over
 * `matchesPerEval` games, and accept the candidate if it wins more.
 *
 * Why hill climbing (not gradient descent / CMA-ES)? Win-rate is a noisy,
 * non-differentiable function of integer thresholds plus discrete
 * priority permutations. Hill climbing with mutate-and-test is the
 * cheapest method that handles both kinds of parameter in one loop, and
 * the same harness is the foundation if we later swap in a fancier
 * search (just replace `mutate`).
 *
 * Determinism: every evaluation uses a fixed seed prefix so the same
 * weight vector is graded against the same matches. Run-to-run noise
 * comes only from the mutation choice (driven by `rng`).
 */
export interface TrainOptions {
  /** Baseline opponent strategy. Candidate is always greedy with mutated weights. */
  opponent: string;
  /** Matches played per candidate evaluation. Higher = lower noise, slower. */
  matchesPerEval: number;
  /** Total candidate evaluations to perform. */
  iterations: number;
  /** Seed used as the matchmaking seed prefix (kept stable across iterations). */
  seed: string;
  /** Hard cap on per-match decision steps. */
  maxSteps?: number;
  /** Initial weights. Defaults to `DEFAULT_GREEDY_WEIGHTS`. */
  initialWeights?: GreedyWeights;
  /** Use real `@tcg/cyberpunk-cards` decks instead of the test fixture. */
  realCards?: boolean;
  /** Mutation RNG seed. Defaults to `seed`. */
  mutationSeed?: string;
  /** Optional path to write the best weights JSON. */
  outputPath?: string;
  /** Optional logger; defaults to `console.log`. */
  log?: (msg: string) => void;
}

export interface TrainStep {
  iteration: number;
  candidate: GreedyWeights;
  wins: number;
  matches: number;
  winRate: number;
  accepted: boolean;
}

export interface TrainResult {
  bestWeights: GreedyWeights;
  bestWinRate: number;
  baselineWinRate: number;
  steps: TrainStep[];
}

/**
 * Mulberry32 PRNG seeded by an FNV-1a hash of the string seed. Deterministic
 * and dependency-free — matches the engine's own approach for stable seeds.
 */
function makeRng(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SCALAR_KEYS = [
  "ownNearWinThreshold",
  "rivalNearWinThreshold",
  "mulliganMinCheapCards",
  "mulliganCheapCostThreshold",
  "mulliganMinSellable",
  "fightMinMargin",
] as const satisfies ReadonlyArray<keyof GreedyWeights>;

const SCALAR_BOUNDS: Record<(typeof SCALAR_KEYS)[number], { min: number; max: number }> = {
  ownNearWinThreshold: { min: 1, max: 6 },
  rivalNearWinThreshold: { min: 1, max: 6 },
  mulliganMinCheapCards: { min: 0, max: 6 },
  mulliganCheapCostThreshold: { min: 0, max: 5 },
  mulliganMinSellable: { min: 0, max: 6 },
  fightMinMargin: { min: -2, max: 4 },
};

const PRIORITY_KEYS = [
  "defaultPriority",
  "ownNearWinPriority",
  "rivalNearWinPriority",
] as const satisfies ReadonlyArray<keyof GreedyWeights>;

function cloneWeights(w: GreedyWeights): GreedyWeights {
  return {
    ...w,
    defaultPriority: { ...w.defaultPriority },
    ownNearWinPriority: { ...w.ownNearWinPriority },
    rivalNearWinPriority: { ...w.rivalNearWinPriority },
  };
}

/**
 * Mutate one scalar OR swap two priorities in one of the three priority maps.
 * The two-kinds-of-mutation design is why scalar+permutation tuning works in
 * one loop: every iteration is one atomic change.
 */
function mutate(weights: GreedyWeights, rng: () => number): GreedyWeights {
  const next = cloneWeights(weights);
  if (rng() < 0.5) {
    const key = SCALAR_KEYS[Math.floor(rng() * SCALAR_KEYS.length)]!;
    const { min, max } = SCALAR_BOUNDS[key];
    const delta = rng() < 0.5 ? -1 : 1;
    const v = Math.max(min, Math.min(max, (next[key] as number) + delta));
    (next[key] as number) = v;
  } else {
    const mapKey = PRIORITY_KEYS[Math.floor(rng() * PRIORITY_KEYS.length)]!;
    const map = next[mapKey] as Partial<Record<string, number>>;
    const keys = Object.keys(map);
    if (keys.length >= 2) {
      const i = Math.floor(rng() * keys.length);
      let j = Math.floor(rng() * keys.length);
      if (j === i) j = (j + 1) % keys.length;
      const a = keys[i]!;
      const b = keys[j]!;
      const tmp = map[a]!;
      map[a] = map[b]!;
      map[b] = tmp;
    }
  }
  return next;
}

/**
 * Evaluate a candidate vs the baseline opponent. The candidate always sits
 * on the `p1` seat — `runBatch` reports wins per seat — so the win count
 * goes straight into the fitness signal.
 *
 * Every candidate is evaluated against the same seed batch so the accept/reject
 * decision compares weight quality instead of match-pairing noise.
 */
function evaluateWeights(
  candidate: GreedyWeights,
  opponent: AIStrategy,
  opts: TrainOptions,
  iteration: number,
): { wins: number; matches: number; winRate: number } {
  const candidateStrategy = createGreedyStrategy(candidate, `greedy-trained-${iteration}`);
  // Bypass the string-based runner registry so each evaluation can use an
  // in-memory strategy instance with candidate-specific weights.
  const summary = runBatchWithStrategies({
    a: candidateStrategy,
    b: opponent,
    matches: opts.matchesPerEval,
    seed: opts.seed,
    maxSteps: opts.maxSteps,
    realCards: opts.realCards ?? false,
  });
  const wins = summary.perPlayerWins["p1"] ?? 0;
  return {
    wins,
    matches: summary.matches,
    winRate: summary.matches === 0 ? 0 : wins / summary.matches,
  };
}

/**
 * Direct strategies-pair runner: the public `runBatch` looks strategies up by
 * name, but we need to pass an in-memory instance. We re-implement the loop
 * by leaning on the catalog/decks/players factories.
 */
function runBatchWithStrategies(args: {
  a: AIStrategy;
  b: AIStrategy;
  matches: number;
  seed: string;
  maxSteps?: number;
  realCards: boolean;
}): { matches: number; perPlayerWins: Record<string, number> } {
  const catalog = args.realCards ? createRealCatalog() : createTestCatalog();
  const decks = args.realCards ? createRealDecks() : createTestDecks();
  const perPlayerWins: Record<string, number> = { p1: 0, p2: 0 };
  for (let i = 0; i < args.matches; i++) {
    const result = runAutoMatch({
      players: createTestPlayers(),
      decks,
      strategies: [args.a, args.b],
      catalog,
      seed: `${args.seed}/match-${i}`,
      maxSteps: args.maxSteps,
    });
    if (result.winnerId) {
      perPlayerWins[result.winnerId] = (perPlayerWins[result.winnerId] ?? 0) + 1;
    }
  }
  return { matches: args.matches, perPlayerWins };
}

export function trainGreedy(opts: TrainOptions): TrainResult {
  const log = opts.log ?? ((m: string) => console.log(m));
  const opponent = lookupStrategy(opts.opponent);
  const rng = makeRng(opts.mutationSeed ?? opts.seed);

  let best = cloneWeights(opts.initialWeights ?? DEFAULT_GREEDY_WEIGHTS);
  const baseline = evaluateWeights(best, opponent, opts, 0);
  let bestWinRate = baseline.winRate;
  log(
    `[train] baseline vs ${opts.opponent}: ${baseline.wins}/${baseline.matches} (${(
      baseline.winRate * 100
    ).toFixed(1)}%)`,
  );

  const steps: TrainStep[] = [];

  for (let i = 1; i <= opts.iterations; i++) {
    const candidate = mutate(best, rng);
    const score = evaluateWeights(candidate, opponent, opts, i);
    const accepted = score.winRate > bestWinRate;
    steps.push({
      iteration: i,
      candidate,
      wins: score.wins,
      matches: score.matches,
      winRate: score.winRate,
      accepted,
    });
    if (accepted) {
      best = candidate;
      bestWinRate = score.winRate;
      log(
        `[train] iter ${i}: ${score.wins}/${score.matches} (${(score.winRate * 100).toFixed(
          1,
        )}%) ✓ accepted`,
      );
    } else {
      log(
        `[train] iter ${i}: ${score.wins}/${score.matches} (${(score.winRate * 100).toFixed(
          1,
        )}%) ✗ rejected (best ${(bestWinRate * 100).toFixed(1)}%)`,
      );
    }
  }

  if (opts.outputPath) {
    mkdirSync(dirname(opts.outputPath), { recursive: true });
    writeFileSync(
      opts.outputPath,
      JSON.stringify(
        {
          bestWeights: best,
          bestWinRate,
          baselineWinRate: baseline.winRate,
          opponent: opts.opponent,
          matchesPerEval: opts.matchesPerEval,
          iterations: opts.iterations,
          seed: opts.seed,
        },
        null,
        2,
      ),
    );
    log(`[train] wrote ${opts.outputPath}`);
  }

  return {
    bestWeights: best,
    bestWinRate,
    baselineWinRate: baseline.winRate,
    steps,
  };
}
