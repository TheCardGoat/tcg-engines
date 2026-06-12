import { describe, expect, it } from "bun:test";
import type { MillEffect } from "@tcg/lorcana-types";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../../testing/unit-harness";
import { resolveMillEffect } from "../mill-effect";

describe("mill", () => {
  it("moves the top N cards of the opponent's deck to their discard", () => {
    const ctx = createTestContext({
      zoneCards: {
        "deck:player-two": ["a", "b", "c", "d"],
        "discard:player-two": [],
      },
    });
    const effect: MillEffect = { type: "mill", amount: 2, target: "OPPONENT" };

    resolveMillEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      millAmount: 2,
    });

    // mill slices from the top (last N of the array then reverses): "d", "c"
    expect(ctx.framework.zones.getCards({ zone: "discard", playerId: PLAYER_TWO })).toEqual([
      "d",
      "c",
    ] as never);
    expect(ctx.framework.zones.getCards({ zone: "deck", playerId: PLAYER_TWO })).toEqual([
      "a",
      "b",
    ] as never);
  });

  it("is a no-op when the amount is zero", () => {
    const ctx = createTestContext({
      zoneCards: { "deck:player-two": ["a"], "discard:player-two": [] },
    });
    const effect: MillEffect = { type: "mill", amount: 0, target: "OPPONENT" };

    resolveMillEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      millAmount: 0,
    });

    expect(ctx.framework.zones.getCards({ zone: "discard", playerId: PLAYER_TWO })).toEqual(
      [] as never,
    );
  });
});
