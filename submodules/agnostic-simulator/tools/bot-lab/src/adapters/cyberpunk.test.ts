import { describe, expect, it } from "vite-plus/test";
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

  it("keeps the explicit default baseline distinct from the promoted runtime default", () => {
    expect(cyberpunkBotLabAdapter.getStrategyDescriptor("default")?.id).toBe("default");
    expect(cyberpunkBotLabAdapter.getCurrentDefaultStrategyId()).toBe("tactical");
  });
});
