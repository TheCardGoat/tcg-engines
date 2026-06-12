import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("target-aggregate-comparison", () => {
  it("compares the max strength of your board against the opposing max strength", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["hero"] },
      definitions: {
        hero: { id: "hero", cardType: "character", strength: 4, willpower: 3 },
      },
    });
    const condition: Condition = {
      type: "target-aggregate-comparison",
      left: {
        query: { selector: "all", owner: "you", zones: ["play"], cardType: "character" },
        attribute: "strength",
        aggregate: "max",
      },
      right: {
        query: { selector: "all", owner: "opponent", zones: ["play"], cardType: "character" },
        attribute: "strength",
        aggregate: "max",
      },
      comparison: "gt",
      requireLeftNonEmpty: true,
      ifRightEmpty: "pass",
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

  it("is false when requireLeftNonEmpty is set and the left side is empty", () => {
    const ctx = createTestContext();
    const condition: Condition = {
      type: "target-aggregate-comparison",
      left: {
        query: { selector: "all", owner: "you", zones: ["play"], cardType: "character" },
        attribute: "strength",
        aggregate: "max",
      },
      right: {
        query: { selector: "all", owner: "opponent", zones: ["play"], cardType: "character" },
        attribute: "strength",
        aggregate: "max",
      },
      comparison: "gt",
      requireLeftNonEmpty: true,
      ifRightEmpty: "pass",
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
