import { describe, expect, it } from "vite-plus/test";
import { onePieceServerAdapter } from "./adapter.js";

describe("onePieceServerAdapter.getCanonicalCardId", () => {
  it("is the identity function (ADR-9: canonicalId = id until reprint data exists)", () => {
    expect(onePieceServerAdapter.getCanonicalCardId("OP01-001")).toBe("OP01-001");
  });

  it("returns the raw publicId for unknown ids (identity, never null)", () => {
    // Per ADR-9, OP has no reprint data yet, so canonical resolution never
    // returns null — the raw publicId is the canonical id. Callers that
    // null-check will simply take the identity branch.
    expect(onePieceServerAdapter.getCanonicalCardId("not-a-real-op-id")).toBe("not-a-real-op-id");
  });
});
