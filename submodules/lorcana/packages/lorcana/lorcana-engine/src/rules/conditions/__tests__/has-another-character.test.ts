import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const condition: Condition = { type: "has-another-character" };

describe("has-another-character", () => {
  it("is true when the controller has another character besides the source", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src", "ally"] },
      definitions: {
        src: { id: "src", cardType: "character" },
        ally: { id: "ally", cardType: "character" },
      },
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

  it("is false when only the source character is in play", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
      definitions: {
        src: { id: "src", cardType: "character" },
      },
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
