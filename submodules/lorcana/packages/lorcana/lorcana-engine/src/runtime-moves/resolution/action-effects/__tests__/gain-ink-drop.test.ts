import { describe, expect, it } from "bun:test";
import type { GainInkDropEffect } from "@tcg/lorcana-types";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../../testing/unit-harness";
import { resolveGainInkDropEffect } from "../gain-ink-drop-effect";

describe("gain-ink-drop", () => {
  it("adds the resolved amount to the controlling player's ink drops", () => {
    const ctx = createTestContext({ inkDrops: { [PLAYER_ONE]: 1 } });
    const effect: GainInkDropEffect = { type: "gain-ink-drop", amount: 2, target: "CONTROLLER" };

    resolveGainInkDropEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      {
        gainAmount: 2,
      },
    );

    expect(ctx.G.inkDrops[PLAYER_ONE]).toBe(3);
  });

  it("is a no-op when the resolved amount is missing or non-positive", () => {
    const ctx = createTestContext({ inkDrops: { [PLAYER_ONE]: 5 } });
    const effect: GainInkDropEffect = { type: "gain-ink-drop", amount: 0, target: "CONTROLLER" };

    resolveGainInkDropEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      {
        gainAmount: 0,
      },
    );

    expect(ctx.G.inkDrops[PLAYER_ONE]).toBe(5);
  });

  it("gives an ink drop to every player when target is EACH_PLAYER", () => {
    const ctx = createTestContext({});
    const effect: GainInkDropEffect = { type: "gain-ink-drop", amount: 1, target: "EACH_PLAYER" };

    resolveGainInkDropEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      {
        gainAmount: 1,
      },
    );

    expect(ctx.G.inkDrops[PLAYER_ONE]).toBe(1);
    expect(ctx.G.inkDrops[PLAYER_TWO]).toBe(1);
  });

  it("gives an ink drop to each opponent when target is EACH_OPPONENT", () => {
    const ctx = createTestContext({});
    const effect: GainInkDropEffect = { type: "gain-ink-drop", amount: 1, target: "EACH_OPPONENT" };

    resolveGainInkDropEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      {
        gainAmount: 1,
      },
    );

    expect(ctx.G.inkDrops[PLAYER_ONE]).toBe(0);
    expect(ctx.G.inkDrops[PLAYER_TWO]).toBe(1);
  });

  it("records the per-turn gain metric for 'got an ink drop this turn' conditions", () => {
    const ctx = createTestContext({});
    const effect: GainInkDropEffect = { type: "gain-ink-drop", amount: 2, target: "CONTROLLER" };

    resolveGainInkDropEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      {
        gainAmount: 2,
      },
    );

    expect(ctx.G.turnMetadata.inkDropsGainedThisTurn[PLAYER_ONE]).toBe(2);
  });
});
