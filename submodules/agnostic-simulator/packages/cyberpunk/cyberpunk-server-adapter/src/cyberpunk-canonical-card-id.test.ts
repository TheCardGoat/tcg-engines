import { describe, expect, it } from "vite-plus/test";
import { getMergedCyberpunkCards } from "@tcg/cyberpunk-cards";
import { cyberpunkServerAdapter } from "./adapter.js";

describe("cyberpunkServerAdapter.getCanonicalCardId", () => {
  it("resolves a known canonical id to itself (delegates to the atelier helper)", () => {
    // The merged card pool is keyed by canonical id, so a merged card's id is
    // a fixed point of the canonicalization. This proves the adapter delegates
    // to getCyberpunkCanonicalForCardId without hard-coding a fragile UUID.
    const canonical = getMergedCyberpunkCards()[0];
    expect(canonical).toBeDefined();
    expect(cyberpunkServerAdapter.getCanonicalCardId(canonical.id)).toBe(canonical.id);
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
});
