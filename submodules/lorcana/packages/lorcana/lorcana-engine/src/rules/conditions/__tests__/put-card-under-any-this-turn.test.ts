import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const condition: Condition = { type: "put-card-under-any-this-turn" };

describe("put-card-under-any-this-turn", () => {
  it("is true when any character or location controlled by the source's controller received a card under it", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src", "parent"] },
      definitions: {
        src: { id: "src", cardType: "character" },
        parent: { id: "parent", cardType: "character" },
      },
    });
    (ctx.G.turnMetadata as { cardsUnderThisTurn?: Record<string, string[]> }).cardsUnderThisTurn = {
      parent: ["under-1"],
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

  it("is false when no such entries exist", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
      definitions: { src: { id: "src", cardType: "character" } },
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
});
