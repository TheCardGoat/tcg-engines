import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const condition: Condition = { type: "trigger-subject-had-card-under" };

describe("trigger-subject-had-card-under", () => {
  it("is true when the event snapshot reports cards were under before banish", () => {
    const ctx = createTestContext();
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { cardsUnderCountBeforeBanish: 2 } },
      ),
    ).toBe(true);
  });

  it("is false when the count is zero or missing", () => {
    const ctx = createTestContext();
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { cardsUnderCountBeforeBanish: 0 } },
      ),
    ).toBe(false);
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
