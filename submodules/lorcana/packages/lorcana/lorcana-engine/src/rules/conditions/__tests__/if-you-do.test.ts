import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const condition: Condition = { type: "if-you-do" };

describe("if-you-do", () => {
  it("is true when the prior effect in the snapshot performed", () => {
    const ctx = createTestContext();
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { lastEffectPerformed: true } },
      ),
    ).toBe(true);
  });

  it("is false when the prior effect did not perform", () => {
    const ctx = createTestContext();
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { lastEffectPerformed: false } },
      ),
    ).toBe(false);
  });

  it("is false when no eventSnapshot is provided", () => {
    const ctx = createTestContext();
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
