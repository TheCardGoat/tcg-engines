import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

describe("and", () => {
  it("is true when every child condition is true", () => {
    const ctx = createTestContext({ currentPlayer: PLAYER_ONE });
    const condition: Condition = {
      type: "and",
      conditions: [{ type: "your-turn" }, { type: "not", condition: { type: "used-shift" } }],
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

  it("is false when any child condition is false", () => {
    const ctx = createTestContext({ currentPlayer: PLAYER_TWO });
    const condition: Condition = {
      type: "and",
      conditions: [{ type: "your-turn" }, { type: "your-turn" }],
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
