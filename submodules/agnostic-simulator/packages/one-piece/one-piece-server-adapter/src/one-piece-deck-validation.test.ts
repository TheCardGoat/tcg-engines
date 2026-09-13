import { validateDeckForFormat } from "@tcg/op-cards";
import { describe, expect, it } from "vite-plus/test";
import { onePieceServerAdapter } from "./adapter.js";

// The deck-construction rule set (5-1-2 family) is owned and tested by
// @tcg/op-cards; this suite only proves the adapter delegates to it.
describe("onePieceServerAdapter.validateDeckForFormat", () => {
  it("returns the game package's validation result verbatim", () => {
    const deck = [
      { cardId: "ST01-001", quantity: 1 },
      { cardId: "ST01-002", quantity: 4 },
    ];

    expect(onePieceServerAdapter.validateDeckForFormat("standard", deck)).toEqual(
      validateDeckForFormat("standard", deck),
    );
  });

  it("propagates the unknown-format error", () => {
    expect(() => onePieceServerAdapter.validateDeckForFormat("infinity", [])).toThrow(
      "Unknown One Piece format: infinity",
    );
  });

  it("rejects unknown card ids instead of counting them toward a legal deck", () => {
    const result = onePieceServerAdapter.validateDeckForFormat("standard", [
      { cardId: "ST01-001", quantity: 1 },
      { cardId: "unknown-card", quantity: 49 },
    ]);

    expect(result.valid).toBe(false);
    expect(result.rules).toContainEqual(
      expect.objectContaining({
        kind: "card-pool",
        passed: false,
        details: [{ cardId: "unknown-card", quantity: 49 }],
      }),
    );
  });
});
