import { describe, expect, it } from "vite-plus/test";

import { botCandidateManifestV1Schema } from "@tcg/bot-core/schemas";

import { gundamBotLabAdapter } from "./gundam.ts";
import { REGISTERED_DECKS } from "../../../../../gundam/tools/bot-bench/src/runtime.ts";

describe("Gundam BotLab adapter", () => {
  it("runs a real deterministic match in doctor", async () => {
    const result = await gundamBotLabAdapter.doctor();
    expect(result.ok).toBe(true);
    expect(result.checks.find((check) => check.name === "deterministic-match")).toMatchObject({
      ok: true,
    });
    expect(result.checks.find((check) => check.name === "deterministic-replay")).toMatchObject({
      ok: true,
    });
  });

  it("includes every tournament fixture in the promotion deck suite", () => {
    const pairs = gundamBotLabAdapter.getPromotionDeckPairs("promotion");
    for (let number = 1; number <= 10; number++) {
      const id = `topdecks-${String(number).padStart(2, "0")}`;
      expect(REGISTERED_DECKS[id as keyof typeof REGISTERED_DECKS]).toBeDefined();
      expect(pairs).toContainEqual({ id: `${id}-mirror`, deckA: id, deckB: id });
    }
  });

  it("uses every tournament fixture against a seeded shuffled opponent", () => {
    const pairs = gundamBotLabAdapter.getPromotionDeckPairs("topdecks-randomized");
    expect(pairs).toHaveLength(10);
    expect(new Set(pairs.map((pair) => pair.deckA))).toEqual(
      new Set(
        Array.from({ length: 10 }, (_, index) => `topdecks-${String(index + 1).padStart(2, "0")}`),
      ),
    );
    expect(new Set(pairs.map((pair) => pair.deckB))).toEqual(
      new Set(
        Array.from({ length: 10 }, (_, index) => `topdecks-${String(index + 1).padStart(2, "0")}`),
      ),
    );
    expect(pairs.every((pair) => pair.deckA !== pair.deckB)).toBe(true);
  });

  it("generates a current schema-valid candidate manifest", async () => {
    if (!gundamBotLabAdapter.train) throw new Error("Gundam trainer is missing");
    const manifest = await gundamBotLabAdapter.train({
      candidateId: "tempo",
      hypothesis: "Legality-aware tempo choices improve paired outcomes.",
      seed: "gundam-adapter-test",
      evaluation: { minimumBlocks: 2, maximumBlocks: 4, batchSize: 2 },
    });
    expect(botCandidateManifestV1Schema.parse(manifest)).toEqual(manifest);
    expect(manifest.engineRevision).toBe(gundamBotLabAdapter.getEngineRevision());
    expect(manifest.cardCatalogHash).toBe(gundamBotLabAdapter.getCardCatalogHash());
  });

  it("carries an explicitly requested randomized suite into the manifest", async () => {
    if (!gundamBotLabAdapter.train) throw new Error("Gundam trainer is missing");
    const manifest = await gundamBotLabAdapter.train({
      candidateId: "tempo",
      seed: "gundam-adapter-randomized-suite-test",
      evaluation: { suiteId: "topdecks-randomized" },
    });
    expect(manifest.evaluation.suiteId).toBe("topdecks-randomized");
  });

  it("rejects unknown deck-pair suites", () => {
    expect(() => gundamBotLabAdapter.getPromotionDeckPairs("topdecks-randomised")).toThrow(
      "Unknown Gundam BotLab suite",
    );
  });

  it("rejects unknown candidate ids", async () => {
    if (!gundamBotLabAdapter.train) throw new Error("Gundam trainer is missing");
    expect(() => gundamBotLabAdapter.train?.({ candidateId: "missing" })).toThrow(
      "Unknown or missing Gundam candidate strategy",
    );
  });
});
