import { describe, expect, it } from "vitest";
import { registerFabCardDefinition } from "@tcg/flesh-and-blood-engine/catalog";
import { STRUCTURED_CARDS_BY_CANONICAL_ID } from "./generated/card-registry.generated.ts";

describe("authored trigger catalog admission", () => {
  it("contains only explicit, event-specific trigger programs", async () => {
    const cards = STRUCTURED_CARDS_BY_CANONICAL_ID;
    expect(cards.size).toBeGreaterThan(0);
    for (const card of cards.values()) {
      expect(() => registerFabCardDefinition(card), card.canonicalId).not.toThrow();
    }
  });
});
