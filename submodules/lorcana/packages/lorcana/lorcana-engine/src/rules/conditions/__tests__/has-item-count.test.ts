import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("has-item-count", () => {
  it("is true when the controller has enough items in play", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["item1"] },
      definitions: { item1: { id: "item1", cardType: "item" } },
    });
    const condition: Condition = {
      type: "has-item-count",
      controller: "you",
      comparison: "greater-or-equal",
      count: 1,
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("is false when the item count falls short", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [] },
    });
    const condition: Condition = {
      type: "has-item-count",
      controller: "you",
      comparison: "greater-or-equal",
      count: 1,
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(false);
  });
});
