import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("has-character-count", () => {
  it("is true when the controller has at least N characters in play", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["a", "b", "c"] },
      definitions: {
        a: { id: "a", cardType: "character" },
        b: { id: "b", cardType: "character" },
        c: { id: "c", cardType: "character" },
      },
    });
    const condition: Condition = {
      type: "has-character-count",
      controller: "you",
      count: 3,
      comparison: "greater-or-equal",
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

  it("is false when the controller has fewer characters than the threshold", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["a"] },
      definitions: {
        a: { id: "a", cardType: "character" },
      },
    });
    const condition: Condition = {
      type: "has-character-count",
      controller: "you",
      count: 3,
      comparison: "greater-or-equal",
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
