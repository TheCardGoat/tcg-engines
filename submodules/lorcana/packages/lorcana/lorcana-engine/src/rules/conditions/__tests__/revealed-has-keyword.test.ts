import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

describe("revealed-has-keyword", () => {
  it("matches a keyword on the revealed card", () => {
    const ctx = createTestContext({
      definitions: {
        "played-1": { id: "played-1", cardType: "character", name: "Revealer" },
        "revealed-1": {
          id: "revealed-1",
          cardType: "character",
          name: "Singer Card",
          abilities: [{ keyword: "Singer" }],
        },
      },
      zoneCards: { [`deck:${PLAYER_ONE}`]: ["revealed-1"] },
    });
    const condition: Condition = { type: "revealed-has-keyword", keyword: "Singer" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "played-1", playerId: PLAYER_ONE }),
        { eventSnapshot: { revealedCardIds: ["revealed-1" as never] } },
      ),
    ).toBe(true);
  });

  it("is false when the revealed card lacks the keyword", () => {
    const ctx = createTestContext({
      definitions: {
        "played-1": { id: "played-1", cardType: "character", name: "Revealer" },
        "revealed-1": { id: "revealed-1", cardType: "character", name: "Plain Card" },
      },
      zoneCards: { [`deck:${PLAYER_ONE}`]: ["revealed-1"] },
    });
    const condition: Condition = { type: "revealed-has-keyword", keyword: "Singer" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "played-1", playerId: PLAYER_ONE }),
        { eventSnapshot: { revealedCardIds: ["revealed-1" as never] } },
      ),
    ).toBe(false);
  });
});
