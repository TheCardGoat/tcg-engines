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
});
