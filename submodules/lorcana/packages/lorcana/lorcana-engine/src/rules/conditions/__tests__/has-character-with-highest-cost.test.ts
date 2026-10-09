import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

describe("has-character-with-highest-cost", () => {
  it("is true when your character ties the highest cost in play", () => {
    const ctx = createTestContext({
      definitions: {
        "mine-9": { id: "mine-9", cardType: "character", name: "Mine", cost: 9 },
        "opp-9": { id: "opp-9", cardType: "character", name: "Theirs", cost: 9 },
      },
      zoneCards: { [`play:${PLAYER_ONE}`]: ["mine-9"], [`play:${PLAYER_TWO}`]: ["opp-9"] },
    });
    const condition: Condition = { type: "has-character-with-highest-cost" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "mine-9", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("is false when the opponent owns the sole highest-cost character", () => {
    const ctx = createTestContext({
      definitions: {
        "mine-1": { id: "mine-1", cardType: "character", name: "Mine", cost: 1 },
        "opp-9": { id: "opp-9", cardType: "character", name: "Theirs", cost: 9 },
      },
      zoneCards: { [`play:${PLAYER_ONE}`]: ["mine-1"], [`play:${PLAYER_TWO}`]: ["opp-9"] },
    });
    const condition: Condition = { type: "has-character-with-highest-cost" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "mine-1", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(false);
  });
});
