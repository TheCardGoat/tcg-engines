import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("stat-threshold", () => {
  it("is true when the source card's strength meets the threshold", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
      definitions: { src: { id: "src", cardType: "character", strength: 4, willpower: 3 } },
    });
    const condition: Condition = {
      type: "stat-threshold",
      target: "SELF",
      stat: "strength",
      comparison: "greater",
      value: 3,
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE, cardType: "character" }),
        {},
      ),
    ).toBe(true);
  });

  it("is false when the comparison fails", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
      definitions: { src: { id: "src", cardType: "character", strength: 2, willpower: 3 } },
    });
    const condition: Condition = {
      type: "stat-threshold",
      target: "SELF",
      stat: "strength",
      comparison: "greater",
      value: 3,
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE, cardType: "character" }),
        {},
      ),
    ).toBe(false);
  });
});
