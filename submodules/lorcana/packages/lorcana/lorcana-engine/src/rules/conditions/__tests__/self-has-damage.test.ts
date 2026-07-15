import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

// Alias of `has-any-damage` — both evaluate the source card's meta.damage.
const condition: Condition = { type: "self-has-damage" };

describe("self-has-damage", () => {
  it("is true when the source card has damage", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
      cardMeta: { src: { damage: 3 } },
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
