import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("inkwell-count", () => {
  it("is true when the controller has enough ink cards in the inkwell", () => {
    const ctx = createTestContext({
      zoneCards: {
        "inkwell:player-one": ["ink1", "ink2", "ink3"],
      },
    });
    const condition: Condition = {
      type: "inkwell-count",
      controller: "you",
      count: 3,
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

  it("is false when the inkwell is below the threshold", () => {
    const ctx = createTestContext({
      zoneCards: {
        "inkwell:player-one": ["ink1"],
      },
    });
    const condition: Condition = {
      type: "inkwell-count",
      controller: "you",
      count: 3,
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
