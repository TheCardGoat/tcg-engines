import { describe, expect, it } from "bun:test";
import type { AdditionalInkwellEffect } from "@tcg/lorcana-types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolveAdditionalInkwellEffect } from "../additional-inkwell-effect";

describe("additional-inkwell", () => {
  it("increments turnMetadata.additionalInkwellActions by the specified amount", () => {
    const ctx = createTestContext();
    const effect: AdditionalInkwellEffect = { type: "additional-inkwell", amount: 2 };

    resolveAdditionalInkwellEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
    );

    expect(ctx.G.turnMetadata.additionalInkwellActions).toBe(2);
  });

  it("defaults to 1 when the amount is missing", () => {
    const ctx = createTestContext();
    const effect = { type: "additional-inkwell" } as AdditionalInkwellEffect;

    resolveAdditionalInkwellEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
    );

    expect(ctx.G.turnMetadata.additionalInkwellActions).toBe(1);
  });
});
