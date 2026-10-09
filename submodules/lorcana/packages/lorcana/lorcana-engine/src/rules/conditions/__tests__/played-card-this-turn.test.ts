import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("played-card-this-turn", () => {
  it("is true when a character was played this turn", () => {
    const ctx = createTestContext({
      definitions: { "x-1": { id: "x-1", cardType: "character", name: "X" } },
      zoneCards: {},
    });
    ctx.G.turnMetadata.cardsPlayedThisTurn = ["x-1" as never];
    const condition: Condition = { type: "played-card-this-turn", cardType: "character" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "played-1", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("is false when the played card type differs", () => {
    const ctx = createTestContext({
      definitions: { "x-1": { id: "x-1", cardType: "item", name: "X" } },
      zoneCards: {},
    });
    ctx.G.turnMetadata.cardsPlayedThisTurn = ["x-1" as never];
    const condition: Condition = { type: "played-card-this-turn", cardType: "character" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "played-1", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(false);
  });
});
