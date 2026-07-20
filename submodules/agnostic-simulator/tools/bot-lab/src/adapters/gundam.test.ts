import { describe, expect, it } from "vite-plus/test";

import { botCandidateManifestV1Schema } from "@tcg/bot-core/schemas";

import { gundamBotLabAdapter } from "./gundam.ts";

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

  it("rejects unknown candidate ids", async () => {
    if (!gundamBotLabAdapter.train) throw new Error("Gundam trainer is missing");
    expect(() => gundamBotLabAdapter.train?.({ candidateId: "missing" })).toThrow(
      "Unknown or missing Gundam candidate strategy",
    );
  });
});
