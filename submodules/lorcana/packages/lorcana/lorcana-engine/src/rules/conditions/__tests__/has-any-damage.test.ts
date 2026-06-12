import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const condition: Condition = { type: "has-any-damage" };

describe("has-any-damage", () => {
  it("is true when the source card has at least one damage on it", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
      cardMeta: { src: { damage: 1 } },
    });
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("is false when the source card is undamaged", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
      cardMeta: { src: { damage: 0 } },
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
