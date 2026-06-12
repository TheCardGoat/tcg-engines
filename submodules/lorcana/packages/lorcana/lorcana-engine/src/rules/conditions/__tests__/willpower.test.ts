import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

// Legacy parser discriminator — same story as `strength`. Runtime evaluator
// returns false; real willpower checks go through `stat-threshold` or
// `comparison` with the `willpower` ComparisonValue variant.
describe("willpower", () => {
  it("falls through to the default branch and returns false", () => {
    const ctx = createTestContext();
    const condition = { type: "willpower" } as unknown as Condition;
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
