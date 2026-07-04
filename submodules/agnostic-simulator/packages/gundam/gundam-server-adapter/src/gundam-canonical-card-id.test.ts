import { describe, expect, it } from "vite-plus/test";
import { gundamServerAdapter } from "./adapter.js";

describe("gundamServerAdapter.getCanonicalCardId", () => {
  it("resolves a known canonical card number to itself", () => {
    // st05GundamBarbatos4thForm001: cardNumber/id "ST05-001", canonicalId "ST05-001".
    expect(gundamServerAdapter.getCanonicalCardId("ST05-001")).toBe("ST05-001");
  });

  it("collapses a BETA duplicate card id onto the shared canonical id", () => {
    // betaArchangel015 keeps a separate record keyed by card.id "ST04-015_p2"
    // but shares the canonical id "ST04-015" with the retail printing. This is
    // the real canonicalization path, not just an identity pass-through.
    expect(gundamServerAdapter.getCanonicalCardId("ST04-015_p2")).toBe("ST04-015");
  });

  it("returns null for an unknown id", () => {
    expect(gundamServerAdapter.getCanonicalCardId("ZZ-NONEXISTENT-GUNDAM")).toBeNull();
  });
});
