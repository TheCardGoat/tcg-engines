import { describe, expect, it } from "bun:test";
import type { GainLoreEffect } from "@tcg/lorcana-types";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../../testing/unit-harness";
import { resolveGainLoreEffect } from "../gain-lore-effect";

describe("gain-lore", () => {
  it("adds the resolved amount to the controlling player's lore total", () => {
    const ctx = createTestContext({ lore: { [PLAYER_ONE]: 2 } });
    const effect: GainLoreEffect = { type: "gain-lore", amount: 3, target: "CONTROLLER" };

    resolveGainLoreEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      gainAmount: 3,
    });

    expect(ctx.G.lore[PLAYER_ONE]).toBe(5);
  });

  it("is a no-op when the resolved amount is missing or non-positive", () => {
    const ctx = createTestContext({ lore: { [PLAYER_ONE]: 7 } });
    const effect: GainLoreEffect = { type: "gain-lore", amount: 0, target: "CONTROLLER" };

    resolveGainLoreEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      gainAmount: 0,
    });

    expect(ctx.G.lore[PLAYER_ONE]).toBe(7);
  });

  it("grants lore to each opponent when target is EACH_OPPONENT", () => {
    const ctx = createTestContext({
      lore: { [PLAYER_ONE]: 0, [PLAYER_TWO]: 4 },
    });
    const effect: GainLoreEffect = { type: "gain-lore", amount: 1, target: "EACH_OPPONENT" };

    resolveGainLoreEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      gainAmount: 1,
    });

    expect(ctx.G.lore[PLAYER_ONE]).toBe(0);
    expect(ctx.G.lore[PLAYER_TWO]).toBe(5);
  });
});
