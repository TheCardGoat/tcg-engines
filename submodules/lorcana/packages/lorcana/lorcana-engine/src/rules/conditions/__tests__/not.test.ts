import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

describe("not", () => {
  it("inverts a child condition that would otherwise be true", () => {
    const ctx = createTestContext({ currentPlayer: PLAYER_ONE });
    const condition: Condition = {
      type: "not",
      condition: { type: "your-turn" },
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

  it("inverts a child condition that would otherwise be false", () => {
    const ctx = createTestContext({ currentPlayer: PLAYER_TWO });
    const condition: Condition = {
      type: "not",
      condition: { type: "your-turn" },
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
