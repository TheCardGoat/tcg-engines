import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

describe("turn", () => {
  it("matches when whose: 'your' and the active player owns the turn", () => {
    const ctx = createTestContext({ currentPlayer: PLAYER_ONE });
    const condition: Condition = { type: "turn", whose: "your" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("does not match when whose: 'your' and the opponent owns the turn", () => {
    const ctx = createTestContext({ currentPlayer: PLAYER_TWO });
    const condition: Condition = { type: "turn", whose: "your" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(false);
  });

  it("matches opposing turns when whose: 'opponent'", () => {
    const ctx = createTestContext({ currentPlayer: PLAYER_TWO });
    const condition: Condition = { type: "turn", whose: "opponent" };
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
