import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

describe("resource-count", () => {
  it("compares the controller's cards-in-hand count against the operator", () => {
    const ctx = createTestContext({
      zoneCards: {
        "hand:player-one": ["a", "b", "c"],
        "hand:player-two": ["x"],
      },
    });
    const atLeastThreeInHand: Condition = {
      type: "resource-count",
      controller: "you",
      what: "cards-in-hand",
      comparison: "greater-or-equal",
      value: 3,
    };
    expect(
      evaluateActionCondition(
        atLeastThreeInHand,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("supports the 'opponent' controller scope", () => {
    const ctx = createTestContext({
      zoneCards: {
        "hand:player-one": ["a", "b", "c"],
        "hand:player-two": ["x"],
      },
    });
    const opponentHasOne: Condition = {
      type: "resource-count",
      controller: "opponent",
      what: "cards-in-hand",
      comparison: "equal",
      value: 1,
    };
    expect(
      evaluateActionCondition(
        opponentHasOne,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });
});
