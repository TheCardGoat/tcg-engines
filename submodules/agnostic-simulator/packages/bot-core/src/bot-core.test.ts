import { describe, expect, test } from "vitest";

import {
  BOT_CORE_SCHEMA_VERSION,
  botCandidateManifestV1Schema,
  buildPairedSchedule,
  canonicalJson,
  classifyPromotion,
  createSeededBotRandom,
  createSemanticCycleDetector,
  pairedBootstrapConfidenceInterval,
  resolveCardAxisScore,
  stableBotHash,
  validateCardHeuristicProfile,
  type BotCardHeuristicProfileV1,
  type BotEvaluationSpecV1,
} from "./index.js";

const promotionSpec: BotEvaluationSpecV1 = {
  suiteId: "promotion",
  seedBase: "stable",
  minimumBlocks: 200,
  maximumBlocks: 2_000,
  batchSize: 100,
  confidenceLevel: 0.95,
  minimumMeanImprovement: 0.02,
  maximumCellRegression: 0.05,
};

describe("stable bot artifacts", () => {
  test("canonicalizes objects before hashing", () => {
    expect(canonicalJson({ b: 2, a: { d: 4, c: 3 } })).toBe('{"a":{"c":3,"d":4},"b":2}');
    expect(stableBotHash({ b: 2, a: 1 })).toBe(stableBotHash({ a: 1, b: 2 }));
  });

  test("validates candidate manifests at runtime", () => {
    const result = botCandidateManifestV1Schema.safeParse({
      schemaVersion: BOT_CORE_SCHEMA_VERSION,
      game: "gundam",
      candidateId: "tempo-v2",
      parentStrategyId: "tempo",
      informationPolicy: "public",
      hypothesis: "Prefer effective board value",
      engineRevision: "abc123",
      cardCatalogHash: "cards:123",
      adapterVersion: "1",
      changes: {},
      evaluation: promotionSpec,
    });
    expect(result.success).toBe(true);
  });

  test("provides one deterministic seeded random stream for all bot consumers", () => {
    const first = createSeededBotRandom("shared-seed");
    const second = createSeededBotRandom("shared-seed");
    const firstValues = Array.from({ length: 5 }, () => first());

    expect(Array.from({ length: 5 }, () => second())).toEqual(firstValues);
    expect(firstValues.every((value) => value >= 0 && value < 1)).toBe(true);
  });
});

describe("paired scheduling", () => {
  test("uses two mirror legs and four cross-deck legs without strategy-derived seeds", () => {
    const schedule = buildPairedSchedule({
      suiteId: "promotion",
      seedBase: "seed",
      deckPairs: [
        { id: "mirror", deckA: "a", deckB: "a" },
        { id: "cross", deckA: "a", deckB: "b" },
      ],
      blocksPerPair: 1,
    });
    expect(schedule.matches).toHaveLength(6);
    expect(schedule.matches.map((match) => match.seed).join(" ")).not.toContain("candidate");
    expect(schedule.hash).toBe(
      buildPairedSchedule({
        suiteId: "promotion",
        seedBase: "seed",
        deckPairs: [
          { id: "mirror", deckA: "a", deckB: "a" },
          { id: "cross", deckA: "a", deckB: "b" },
        ],
        blocksPerPair: 1,
      }).hash,
    );
  });
});

describe("deadlocks and promotion", () => {
  test("detects semantic repetition without state counters", () => {
    const detector = createSemanticCycleDetector({ repeatThreshold: 3 });
    expect(detector.observe("same").repeated).toBe(false);
    expect(detector.observe("other").repeated).toBe(false);
    expect(detector.observe("same").repeated).toBe(false);
    expect(detector.observe("same").repeated).toBe(true);
  });

  test("evaluates repetition after evicting the oldest fingerprint", () => {
    const detector = createSemanticCycleDetector({ repeatThreshold: 3, windowSize: 3 });
    detector.observe("same");
    detector.observe("other");
    detector.observe("same");

    expect(detector.observe("same")).toEqual({ repeated: false, count: 2 });
  });

  test("promotes only a practical statistically positive result", () => {
    const deltas = Array.from({ length: 200 }, (_, index) => (index % 4 === 0 ? -0.1 : 0.08));
    const confidenceInterval = pairedBootstrapConfidenceInterval({ blockDeltas: deltas });
    const result = classifyPromotion({
      spec: promotionSpec,
      blocks: deltas.length,
      meanPairedImprovement: deltas.reduce((sum, value) => sum + value, 0) / deltas.length,
      confidenceInterval,
      hardFailureCount: 0,
      cellRegressions: {},
    });
    expect(result.verdict).toBe("promote");
  });

  test("rejects automation failures regardless of win rate", () => {
    const result = classifyPromotion({
      spec: promotionSpec,
      blocks: 200,
      meanPairedImprovement: 0.25,
      confidenceInterval: { level: 0.95, lower: 0.2, upper: 0.3 },
      hardFailureCount: 1,
      cellRegressions: {},
    });
    expect(result.verdict).toBe("reject");
  });
});

describe("card profiles", () => {
  const profile: BotCardHeuristicProfileV1 = {
    schemaVersion: 1,
    cardId: "power-card",
    profileVersion: "1",
    source: "manual",
    axes: { play: 30, resource: -80 },
    tags: ["must-answer"],
    matchups: [{ opponentTags: ["aggro"], adjustments: { play: 20 }, rationale: "Stabilizer" }],
    rationale: ["High-impact stabilizer"],
  };

  test("combines bounded base and matchup adjustments", () => {
    expect(validateCardHeuristicProfile(profile)).toEqual([]);
    expect(resolveCardAxisScore({ profile, axis: "play", opponentTags: ["aggro"] })).toBe(50);
  });

  test("rejects non-finite base and matchup adjustments", () => {
    expect(
      validateCardHeuristicProfile({
        ...profile,
        axes: { play: Number.POSITIVE_INFINITY },
        matchups: [
          { opponentTags: ["aggro"], adjustments: { play: Number.NaN }, rationale: "bad" },
        ],
      }),
    ).toEqual(["play must be a finite number", "matchup play must be a finite number"]);
  });
});
