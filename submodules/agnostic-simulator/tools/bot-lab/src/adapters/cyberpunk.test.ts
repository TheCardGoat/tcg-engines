import { describe, expect, it } from "vite-plus/test";
import { BOT_CORE_SCHEMA_VERSION, type BotCandidateManifestV1 } from "@tcg/bot-core";
import { cyberpunkBotLabAdapter } from "./cyberpunk";
import { createAuthoredBotLabDecks } from "../../../../../cyberpunk/tools/ai-runner/src/legal-decks.ts";

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
    const decks = createAuthoredBotLabDecks();
    expect(result.checks.find((check) => check.name === "legal-decks")?.detail).toBe(
      `${decks.length} decks`,
    );
    const pairs = cyberpunkBotLabAdapter.getPromotionDeckPairs("promotion");
    expect(pairs.length).toBe(decks.length + Math.floor(decks.length / 2));
    expect(pairs.filter((pair) => pair.deckA === pair.deckB).map((pair) => pair.deckA)).toEqual(
      decks.map((deck) => deck.id),
    );
    expect(
      pairs.every(
        (pair) => pair.deckA.startsWith("authored-") && pair.deckB.startsWith("authored-"),
      ),
    ).toBe(true);
  });

  it("reports the full-information default for both the alias and runtime", () => {
    expect(cyberpunkBotLabAdapter.getStrategyDescriptor("default")?.id).toBe("default");
    expect(cyberpunkBotLabAdapter.getCurrentDefaultStrategyId()).toBe("expert-oracle");
    expect(cyberpunkBotLabAdapter.getStrategyDescriptor("default")?.informationPolicy).toBe(
      "oracle",
    );
    expect(cyberpunkBotLabAdapter.getStrategyDescriptor("expert-oracle")?.productionEligible).toBe(
      true,
    );
  });

  it("plays an authored mirror match end to end", async () => {
    const manifest: BotCandidateManifestV1 = {
      schemaVersion: BOT_CORE_SCHEMA_VERSION,
      game: "cyberpunk",
      candidateId: "default",
      parentStrategyId: "default",
      informationPolicy: "oracle",
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
    expect(record.termination).toBe("rules-win");
    expect(record.turnCount).toBeGreaterThan(0);
  }, 60_000);
});
