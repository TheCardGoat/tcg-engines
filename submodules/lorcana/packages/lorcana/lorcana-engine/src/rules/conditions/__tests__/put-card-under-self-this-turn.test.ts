import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const condition: Condition = { type: "put-card-under-self-this-turn" };

describe("put-card-under-self-this-turn", () => {
  it("is true when the turn metadata lists a card placed under the source this turn", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
    });
    (ctx.G.turnMetadata as { cardsUnderThisTurn?: Record<string, string[]> }).cardsUnderThisTurn = {
      src: ["under-1"],
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

  it("is false when no entry has been recorded for the source card", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
    });
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(false);
  });

  it("does not throw when G is missing (static-ability projection path)", () => {
    // Regression: Willie THE FOOD OF GENEROSITY condition crashed client/static
    // projection with "Cannot read properties of undefined (reading 'turnMetadata')"
    // when ConditionEvaluationContext.G was absent.
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
    });
    // Simulate partial projection / static-ability contexts that omit G.
    (ctx as { G?: unknown }).G = undefined;

    expect(() =>
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).not.toThrow();
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
