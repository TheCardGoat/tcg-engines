import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("has-named-item", () => {
  it("is true when the controller has an item in play with the given name", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["item"] },
      definitions: { item: { id: "item", cardType: "item", name: "Magic Mirror" } },
    });
    const condition: Condition = {
      type: "has-named-item",
      name: "Magic Mirror",
      controller: "you",
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

  it("is false when no matching item is in play", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["item"] },
      definitions: { item: { id: "item", cardType: "item", name: "Magic Mirror" } },
    });
    const condition: Condition = {
      type: "has-named-item",
      name: "Enchanted Rose",
      controller: "you",
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
