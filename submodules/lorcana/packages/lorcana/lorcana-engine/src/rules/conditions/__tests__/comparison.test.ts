import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

describe("comparison", () => {
  it("compares the controller's lore against the opponent's lore", () => {
    const ctx = createTestContext({
      lore: { [PLAYER_ONE]: 7, [PLAYER_TWO]: 4 },
    });
    const condition: Condition = {
      type: "comparison",
      left: { type: "lore", controller: "you" },
      right: { type: "lore", controller: "opponent" },
      comparison: "greater",
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

  it("is false when the comparison does not hold", () => {
    const ctx = createTestContext({
      lore: { [PLAYER_ONE]: 2, [PLAYER_TWO]: 6 },
    });
    const condition: Condition = {
      type: "comparison",
      left: { type: "lore", controller: "you" },
      right: { type: "lore", controller: "opponent" },
      comparison: "greater",
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
