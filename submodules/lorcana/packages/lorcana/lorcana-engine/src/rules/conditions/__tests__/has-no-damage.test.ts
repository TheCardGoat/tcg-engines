import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

// Alias of `no-damage` — same runtime branch, different discriminator.
const condition: Condition = { type: "has-no-damage" };

describe("has-no-damage", () => {
  it("is true when the source card has zero damage", () => {
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

  it("is false when the source card has damage", () => {
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
    ).toBe(false);
  });
});
