import { describe, expect, it } from "bun:test";
import type { LoseLoreEffect } from "@tcg/lorcana-types";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../../testing/unit-harness";
import { resolveLoseLoreEffect } from "../lose-lore-effect";

describe("lose-lore", () => {
  it("decrements the default opponent's lore by the resolved amount", () => {
    const ctx = createTestContext({
      lore: { [PLAYER_ONE]: 3, [PLAYER_TWO]: 5 },
    });
    const effect: LoseLoreEffect = { type: "lose-lore", amount: 2 };

    resolveLoseLoreEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      loseAmount: 2,
    });

    expect(ctx.G.lore[PLAYER_TWO]).toBe(3);
    expect(ctx.G.lore[PLAYER_ONE]).toBe(3);
  });

  it("is a no-op when the resolved amount is zero", () => {
    const ctx = createTestContext({
      lore: { [PLAYER_ONE]: 3, [PLAYER_TWO]: 5 },
    });
    const effect: LoseLoreEffect = { type: "lose-lore", amount: 0 };

    resolveLoseLoreEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      loseAmount: 0,
    });

    expect(ctx.G.lore[PLAYER_TWO]).toBe(5);
    expect(ctx.G.lore[PLAYER_ONE]).toBe(3);
  });
});
