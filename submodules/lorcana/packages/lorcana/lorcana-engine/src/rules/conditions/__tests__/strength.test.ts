import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

// `strength` is a legacy parser discriminator; the runtime evaluator falls
// through the default branch and returns false. Real strength checks flow
// through `stat-threshold` or `target-aggregate-comparison` / `comparison`
// (using the `strength` ComparisonValue variant) today.
describe("strength", () => {
  it("falls through to the default branch and returns false", () => {
    const ctx = createTestContext();
    const condition = { type: "strength" } as unknown as Condition;
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
