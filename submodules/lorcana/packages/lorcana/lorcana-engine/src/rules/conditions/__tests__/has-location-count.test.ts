import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("has-location-count", () => {
  it("is true when the controller's location count meets the threshold", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["loc1", "loc2"] },
      definitions: {
        loc1: { id: "loc1", cardType: "location" },
        loc2: { id: "loc2", cardType: "location" },
      },
    });
    const condition: Condition = {
      type: "has-location-count",
      controller: "you",
      comparison: "greater-or-equal",
      count: 2,
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

  it("is false when the count falls short", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["loc1"] },
      definitions: { loc1: { id: "loc1", cardType: "location" } },
    });
    const condition: Condition = {
      type: "has-location-count",
      controller: "you",
      comparison: "greater-or-equal",
      count: 2,
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
