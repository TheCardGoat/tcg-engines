import { describe, expect, it } from "bun:test";
import type { DrawEffect } from "@tcg/lorcana-types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolveDrawEffect } from "../draw-effect";

describe("draw", () => {
  it("moves the requested number of cards from the deck top into the hand", () => {
    const ctx = createTestContext({
      zoneCards: {
        "deck:player-one": ["d1", "d2", "d3", "d4"],
        "hand:player-one": [],
      },
    });
    const effect: DrawEffect = { type: "draw", amount: 2 };

    resolveDrawEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      drawAmount: 2,
    });

    expect(ctx.framework.zones.getCards({ zone: "hand", playerId: PLAYER_ONE })).toEqual([
      "d1",
      "d2",
    ] as never);
    expect(ctx.framework.zones.getCards({ zone: "deck", playerId: PLAYER_ONE })).toEqual([
      "d3",
      "d4",
    ] as never);
  });

  it("is a no-op when the resolved amount is zero", () => {
    const ctx = createTestContext({
      zoneCards: { "deck:player-one": ["d1"], "hand:player-one": [] },
    });
    const effect: DrawEffect = { type: "draw", amount: 0 };

    resolveDrawEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      drawAmount: 0,
    });

    expect(ctx.framework.zones.getCards({ zone: "hand", playerId: PLAYER_ONE })).toEqual(
      [] as never,
    );
  });
});
