import { describe, expect, test } from "vite-plus/test";
import {
  DEFAULT_GREEDY_WEIGHTS,
  createGreedyStrategy,
  randomStrategy,
  runAutoMatch,
  type GreedyWeights,
} from "@tcg/cyberpunk-engine";
import { trainGreedy } from "../src/train.ts";
import { createTestCatalog, createTestDecks, createTestPlayers } from "../src/test-catalog.ts";

const silent = () => {};

describe("createGreedyStrategy", () => {
  test("default weights reproduce baseline greedy behaviour", () => {
    // Smoke: build twice and play against random — both should win the same
    // small batch from the same seed, since they share the default weights.
    const a = createGreedyStrategy();
    const b = createGreedyStrategy(DEFAULT_GREEDY_WEIGHTS);
    const catalog = createTestCatalog();
    const decks = createTestDecks();
    const seed = "default-equiv";
    const ra = runAutoMatch({
      players: createTestPlayers(),
      decks,
      strategies: [a, randomStrategy],
      catalog,
      seed,
    });
    const rb = runAutoMatch({
      players: createTestPlayers(),
      decks,
      strategies: [b, randomStrategy],
      catalog,
      seed,
    });
    expect(ra.winnerId).toBe(rb.winnerId);
    expect(ra.turnCount).toBe(rb.turnCount);
  });

  test("custom weights are reflected in the strategy", () => {
    // Pathological weights: never want to mulligan; never want to fight unit.
    const weights: GreedyWeights = {
      ...DEFAULT_GREEDY_WEIGHTS,
      mulliganMinCheapCards: 0,
      mulliganMinSellable: 0,
      fightMinMargin: 1000,
    };
    const s = createGreedyStrategy(weights, "no-mull-no-fight");
    expect(s.name).toBe("no-mull-no-fight");
    // The strategy still produces a valid game when paired with anything.
    const result = runAutoMatch({
      players: createTestPlayers(),
      decks: createTestDecks(),
      strategies: [s, randomStrategy],
      catalog: createTestCatalog(),
      seed: "custom-weights",
    });
    expect(result.reason).not.toBe("illegal");
    expect(result.reason).not.toBe("stuck");
  });
});

describe("trainGreedy", () => {
  test("yields a non-worse result than baseline", () => {
    // Tiny budget to keep the test fast. Hill-climb only ever *replaces* the
    // current best with something that strictly improves the win-rate against
    // a fixed eval batch, so the post-condition is best ≥ baseline.
    const result = trainGreedy({
      opponent: "random",
      matchesPerEval: 4,
      iterations: 4,
      seed: "test-train",
      log: silent,
    });
    expect(result.bestWinRate).toBeGreaterThanOrEqual(result.baselineWinRate);
    expect(result.steps.length).toBe(4);
  });

  test("greedy mirror surfaces real improvement signal", () => {
    // Against itself the baseline is ~50%, so mutations have headroom both
    // ways. With a fixed seed, the same accepted iteration is deterministic.
    const result = trainGreedy({
      opponent: "greedy",
      matchesPerEval: 6,
      iterations: 5,
      seed: "test-train-mirror",
      log: silent,
    });
    expect(result.bestWinRate).toBeGreaterThanOrEqual(result.baselineWinRate);
    // Accepted candidates must each strictly improve over the prior best.
    let prev = result.baselineWinRate;
    for (const step of result.steps) {
      if (step.accepted) {
        expect(step.winRate).toBeGreaterThan(prev);
        prev = step.winRate;
      }
    }
  });
});
