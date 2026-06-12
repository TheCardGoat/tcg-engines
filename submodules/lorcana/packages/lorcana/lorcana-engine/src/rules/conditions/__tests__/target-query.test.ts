import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("target-query", () => {
  it("is true when the controller has at least the queried number of cards in a zone", () => {
    const ctx = createTestContext({
      zoneCards: { "hand:player-one": ["a", "b", "c"] },
      definitions: {
        a: { id: "a", cardType: "action" },
        b: { id: "b", cardType: "action" },
        c: { id: "c", cardType: "action" },
      },
    });
    const condition: Condition = {
      type: "target-query",
      query: {
        selector: "all",
        owner: "you",
        zones: ["hand"],
      },
      comparison: { operator: "gte", value: 3 },
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("is false when the match count falls below the threshold", () => {
    const ctx = createTestContext({
      zoneCards: { "hand:player-one": ["a"] },
      definitions: { a: { id: "a", cardType: "action" } },
    });
    const condition: Condition = {
      type: "target-query",
      query: {
        selector: "all",
        owner: "you",
        zones: ["hand"],
      },
      comparison: { operator: "gte", value: 3 },
    };
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
