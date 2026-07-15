import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const condition: Condition = { type: "no-damage" };

describe("no-damage", () => {
  it("is true when the source card has zero damage on it", () => {
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
    ).toBe(true);
  });

  it("is false once the source card has taken damage", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
      cardMeta: { src: { damage: 2 } },
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
