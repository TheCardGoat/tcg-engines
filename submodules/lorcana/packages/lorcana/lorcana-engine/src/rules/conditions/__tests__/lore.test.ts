import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

// Legacy parser discriminator — runtime evaluator returns false. Real lore
// comparisons use `comparison` with the `lore` ComparisonValue variant, or
// the dedicated `resource-count` and `lore-comparison` conditions.
describe("lore", () => {
  it("falls through to the default branch and returns false", () => {
    const ctx = createTestContext();
    const condition = { type: "lore" } as unknown as Condition;
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
