import { describe, expect, test } from "vitest";

import {
  BOT_CORE_SCHEMA_VERSION,
  stableBotHash,
  type BotCandidateManifestV1,
  type BotMatchRecordV1,
  type BotPromotionRecordV1,
  type BotStrategyDescriptorV1,
} from "@tcg/bot-core";

import type { BotLabAdapter, BotLabMatchInput } from "./adapter.ts";
import { evaluateCandidate } from "./evaluate.ts";
import { planPromotion } from "./promote.ts";

const publicStrategy = (id: string): BotStrategyDescriptorV1 => ({
  schemaVersion: BOT_CORE_SCHEMA_VERSION,
  game: "test",
  id,
  label: id,
  strategyVersion: "1",
  informationPolicy: "public",
  cardProfileVersion: "1",
  productionEligible: true,
});

const manifest: BotCandidateManifestV1 = {
  schemaVersion: BOT_CORE_SCHEMA_VERSION,
  game: "test",
  candidateId: "candidate",
  parentStrategyId: "baseline",
  informationPolicy: "public",
  hypothesis: "Always wins in the fake adapter",
  engineRevision: "engine-1",
  cardCatalogHash: "cards-1",
  adapterVersion: "1",
  changes: {},
  evaluation: {
    suiteId: "promotion",
    seedBase: "stable",
    minimumBlocks: 2,
    maximumBlocks: 4,
    batchSize: 2,
    confidenceLevel: 0.95,
    minimumMeanImprovement: 0.02,
    maximumCellRegression: 0.05,
  },
};

function fakeAdapter(
  termination: BotMatchRecordV1["termination"] = "rules-win",
  deckPairCount = 1,
): BotLabAdapter {
  return {
    game: "test",
    adapterVersion: "1",
    getEngineRevision: () => "engine-1",
    getCardCatalogHash: () => "cards-1",
    getCurrentDefaultStrategyId: () => "baseline",
    getStrategyDescriptor: (id) => (id === "baseline" ? publicStrategy(id) : undefined),
    getCandidateDescriptor: (candidate) => publicStrategy(candidate.candidateId),
    getPromotionDeckPairs: () =>
      Array.from({ length: deckPairCount }, (_, index) => ({
        id: `mirror-${index}`,
        deckA: "deck",
        deckB: "deck",
      })),
    runMatch: ({ scheduledMatch }: BotLabMatchInput) => ({
      blockId: scheduledMatch.blockId,
      legId: scheduledMatch.legId,
      seed: scheduledMatch.seed,
      candidateSeat: scheduledMatch.p1Controller === "candidate" ? "p1" : "p2",
      candidateDeckId: "deck",
      baselineDeckId: "deck",
      winner: "candidate",
      termination,
      turnCount: 3,
      actionCount: 8,
      finalStateHash: stableBotHash(scheduledMatch),
    }),
    replayMatch: (record) => record,
    planPromotion: (record: BotPromotionRecordV1) => [
      { path: "/tmp/test-promotion.json", content: JSON.stringify(record) },
    ],
    doctor: () => ({ ok: true, checks: [] }),
  };
}

describe("unified evaluation", () => {
  test("runs one paired report and emits a promotable record", async () => {
    const adapter = fakeAdapter();
    const report = await evaluateCandidate({ adapter, manifest });
    expect(report.verdict).toBe("promote");
    expect(report.summary.blocks).toBe(2);
    expect(report.summary.matches).toBe(4);
    expect(() => planPromotion({ adapter, report })).toThrow("at least 200 paired blocks");
  });

  test("creates a production record only from a complete self-consistent report", async () => {
    const adapter = fakeAdapter();
    const productionManifest: BotCandidateManifestV1 = {
      ...manifest,
      evaluation: {
        ...manifest.evaluation,
        minimumBlocks: 200,
        maximumBlocks: 200,
        batchSize: 200,
      },
    };
    const report = await evaluateCandidate({ adapter, manifest: productionManifest });
    const promotion = planPromotion({ adapter, report });

    expect(promotion.record.blocks).toBe(200);
    expect(promotion.record.matches).toBe(400);
    expect(promotion.record.strategyConfig).toEqual({});

    const tampered = {
      ...report,
      matches: [{ ...report.matches[0]!, seed: "tampered" }, ...report.matches.slice(1)],
    };
    expect(() => planPromotion({ adapter, report: tampered })).toThrow("does not match schedule");
  });

  test("applies evaluation batches to total blocks across the deck matrix", async () => {
    const adapter = fakeAdapter("rules-win", 9);
    const productionManifest: BotCandidateManifestV1 = {
      ...manifest,
      evaluation: {
        ...manifest.evaluation,
        minimumBlocks: 200,
        maximumBlocks: 200,
        batchSize: 100,
      },
    };

    const report = await evaluateCandidate({ adapter, manifest: productionManifest });

    expect(report.verdict).toBe("promote");
    expect(report.summary.blocks).toBe(207);
    expect(report.summary.matches).toBe(414);
  });

  test("rejects a test-only candidate even when the report says promote", async () => {
    const adapter = fakeAdapter();
    const report = await evaluateCandidate({ adapter, manifest });
    expect(() =>
      planPromotion({
        adapter,
        report: { ...report, candidate: { ...report.candidate, productionEligible: false } },
      }),
    ).toThrow("Test-only strategies cannot be promoted");
  });

  test("rejects a winning run that terminated through automation failure", async () => {
    const report = await evaluateCandidate({
      adapter: fakeAdapter("automation-concession"),
      manifest,
    });
    expect(report.verdict).toBe("reject");
    expect(report.summary.hardFailureCount).toBeGreaterThan(0);
  });

  test("rejects accidental public-versus-oracle comparison", async () => {
    const adapter = fakeAdapter();
    adapter.getCandidateDescriptor = () => ({
      ...publicStrategy("candidate"),
      informationPolicy: "oracle",
    });
    await expect(evaluateCandidate({ adapter, manifest })).rejects.toThrow(
      "matching information policies",
    );
  });
});
