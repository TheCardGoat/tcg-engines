import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("opponent-count", () => {
  it("is false in a 1v1 game when comparing against 2 or more opponents", () => {
    const ctx = createTestContext({ currentPlayer: PLAYER_ONE });
    const condition: Condition = {
      type: "opponent-count",
      comparison: "greater-or-equal",
      value: 2,
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

  it("is true in a 1v1 game when comparing against 1 opponent", () => {
    const ctx = createTestContext({ currentPlayer: PLAYER_ONE });
    const condition: Condition = {
      type: "opponent-count",
      comparison: "greater-or-equal",
      value: 1,
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
});
