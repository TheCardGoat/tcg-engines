import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

describe("during-turn", () => {
  it("is true when whose: 'your' and the active player is the controller", () => {
    const ctx = createTestContext({ currentPlayer: PLAYER_ONE });
    const condition: Condition = { type: "during-turn", whose: "your" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("is false when whose: 'your' and the active player is the opponent", () => {
    const ctx = createTestContext({ currentPlayer: PLAYER_TWO });
    const condition: Condition = { type: "during-turn", whose: "your" };
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
