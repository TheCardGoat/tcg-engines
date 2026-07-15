import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const RETURNED = "returned" as CardInstanceId;

describe("returned-card-is-named", () => {
  it("is true when the card returned from discard matches the name", () => {
    const ctx = createTestContext({
      definitions: {
        returned: { id: "returned", cardType: "character", name: "Mulan" },
      },
    });
    const condition: Condition = { type: "returned-card-is-named", name: "Mulan" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { lastReturnedFromDiscardCardId: RETURNED } },
      ),
    ).toBe(true);
  });

  it("is false when the names don't match", () => {
    const ctx = createTestContext({
      definitions: {
        returned: { id: "returned", cardType: "character", name: "Mulan" },
      },
    });
    const condition: Condition = { type: "returned-card-is-named", name: "Shang" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { lastReturnedFromDiscardCardId: RETURNED } },
      ),
    ).toBe(false);
  });
});
