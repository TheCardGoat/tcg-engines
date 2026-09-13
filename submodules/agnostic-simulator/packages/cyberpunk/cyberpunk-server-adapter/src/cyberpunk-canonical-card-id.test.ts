import { describe, expect, it } from "vite-plus/test";
import { cards, getMergedCyberpunkCards } from "@tcg/cyberpunk-cards";
import { cyberpunkServerAdapter } from "./adapter.js";

describe("cyberpunkServerAdapter.getCanonicalCardId", () => {
  it("resolves a merged card id to its stable canonical id", () => {
    // Authored card ids may be UUIDs, while deck and Atelier identities use the
    // stable canonical slug. This proves the adapter delegates to the shared
    // identity helper without hard-coding either representation.
    const canonical = getMergedCyberpunkCards()[0];
    expect(canonical).toBeDefined();
    expect(cyberpunkServerAdapter.getCanonicalCardId(canonical.id)).toBe(canonical.canonicalId);
  });

  it("returns null for an unknown id so callers can fall back to the raw publicId", () => {
    expect(cyberpunkServerAdapter.getCanonicalCardId("not-a-real-cyberpunk-id")).toBeNull();
  });

  it("recognizes canonical deck ids during Alpha validation", () => {
    const canonical = getMergedCyberpunkCards()[0];
    expect(canonical).toBeDefined();

    const result = cyberpunkServerAdapter.validateDeckForFormat("alpha", [
      { cardId: canonical!.canonicalId, quantity: 1 },
    ]);

    expect(result.rules).toContainEqual(
      expect.objectContaining({ kind: "card-pool", passed: true }),
    );
  });

  it("accepts an unambiguous accent-folded display slug from legacy deck rows", () => {
    const result = cyberpunkServerAdapter.validateDeckForFormat("alpha", [
      { cardId: "gilded-maton", quantity: 1 },
    ]);

    expect(result.rules).toContainEqual(
      expect.objectContaining({ kind: "card-pool", passed: true }),
    );
    expect(cyberpunkServerAdapter.getCardById("gilded-maton")?.label).toBe("Gilded Matón");
    expect(
      cyberpunkServerAdapter.metadata?.normalizeTemplate([{ cardId: "gilded-maton", quantity: 4 }]),
    ).toEqual([expect.objectContaining({ cardId: "gilded-maton" })]);
  });

  it("recognizes canonical deck ids during the shared playability preflight", () => {
    const canonical = getMergedCyberpunkCards()[0];
    expect(canonical).toBeDefined();

    expect(cyberpunkServerAdapter.getCardById(canonical!.canonicalId)).toEqual(
      expect.objectContaining({ publicId: canonical!.canonicalId }),
    );
  });

  it("reports validation issues with the submitted canonical deck id", () => {
    const canonical = getMergedCyberpunkCards().find((card) => card.type !== "legend");
    expect(canonical).toBeDefined();

    const result = cyberpunkServerAdapter.validateDeckForFormat("alpha", [
      { cardId: canonical!.canonicalId, quantity: 4 },
    ]);

    expect(result.rules).toContainEqual(
      expect.objectContaining({
        kind: "copy-limit",
        details: expect.objectContaining({ cardId: canonical!.canonicalId }),
      }),
    );
  });

  it.each(["alpha", "spoiler"] as const)("rejects cards from the %s set", (setCode) => {
    const previewCard = cards.find((card) => card.set.code === setCode);
    expect(previewCard).toBeDefined();

    const result = cyberpunkServerAdapter.validateDeckForFormat("alpha", [
      { cardId: previewCard!.id, quantity: 1 },
    ]);

    expect(result.valid).toBe(false);
    expect(result.rules).toContainEqual(
      expect.objectContaining({
        kind: "card-pool",
        passed: false,
        details: { cardIds: [previewCard!.id] },
      }),
    );
  });
});
