import { describe, expect, it } from "vite-plus/test";
import { BOT_CORE_SCHEMA_VERSION, type BotCandidateManifestV1 } from "@tcg/bot-core";
import { cyberpunkBotLabAdapter } from "./cyberpunk";

describe("cyberpunk bot-lab adapter", () => {
  it("uses a varied legal real-card deck matrix for promotion", () => {
    const pairs = cyberpunkBotLabAdapter.getPromotionDeckPairs("promotion");

    expect(pairs.length).toBeGreaterThan(1);
    expect(new Set(pairs.flatMap((pair) => [pair.deckA, pair.deckB])).size).toBeGreaterThan(1);
    expect(pairs.every((pair) => pair.deckA !== "test-deck" && pair.deckB !== "test-deck")).toBe(
      true,
    );
  });

  it("reports the real catalog and legal deck pool as healthy", async () => {
    const result = await cyberpunkBotLabAdapter.doctor();

    expect(result.ok).toBe(true);
    expect(result.checks.find((check) => check.name === "real-catalog")?.ok).toBe(true);
    expect(result.checks.find((check) => check.name === "legal-decks")?.ok).toBe(true);
  });

  it("evaluates over the authored archetype deck pool", async () => {
    const result = await cyberpunkBotLabAdapter.doctor();

    expect(result.checks.find((check) => check.name === "legal-decks")?.detail).toBe("10 decks");
    const pairs = cyberpunkBotLabAdapter.getPromotionDeckPairs("promotion");
    // 10 authored mirror pairs + 5 adjacent cross pairings.
    expect(pairs.length).toBe(15);
    expect(
      pairs.every(
        (pair) => pair.deckA.startsWith("authored-") && pair.deckB.startsWith("authored-"),
      ),
    ).toBe(true);
  });

  it("keeps the explicit default baseline distinct from the promoted runtime default", () => {
    expect(cyberpunkBotLabAdapter.getStrategyDescriptor("default")?.id).toBe("default");
    expect(cyberpunkBotLabAdapter.getCurrentDefaultStrategyId()).toBe("tactical");
  });

  it("plays an authored mirror match end to end", async () => {
    const manifest: BotCandidateManifestV1 = {
      schemaVersion: BOT_CORE_SCHEMA_VERSION,
      game: "cyberpunk",
      candidateId: "default",
      parentStrategyId: "default",
      informationPolicy: "public",
      hypothesis: "Authored-pool mirror smoke",
      engineRevision: cyberpunkBotLabAdapter.getEngineRevision(),
      cardCatalogHash: cyberpunkBotLabAdapter.getCardCatalogHash(),
      adapterVersion: cyberpunkBotLabAdapter.adapterVersion,
      changes: {},
      evaluation: {
        suiteId: "promotion",
        seedBase: "smoke",
        minimumBlocks: 1,
        maximumBlocks: 1,
        batchSize: 1,
        confidenceLevel: 0.95,
        minimumMeanImprovement: 0,
        maximumCellRegression: 1,
      },
    };
    const record = await cyberpunkBotLabAdapter.runMatch({
      scheduledMatch: {
        blockId: "block-0",
        pairId: "authored-overwatch-recharge-control-mirror",
        legId: "a-seat-1",
        seed: "authored-smoke-1",
        p1Controller: "candidate",
        p2Controller: "baseline",
        p1DeckId: "authored-overwatch-recharge-control",
        p2DeckId: "authored-overwatch-recharge-control",
      },
      candidateManifest: manifest,
      baselineStrategyId: "default",
    });

    expect(record.candidateDeckId).toBe("authored-overwatch-recharge-control");
    expect(record.termination).not.toBe("illegal-command");
    expect(record.turnCount).toBeGreaterThan(0);
  });
});
