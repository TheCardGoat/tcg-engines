import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

const condition: Condition = { type: "opponent-has-damaged-character" };

describe("opponent-has-damaged-character", () => {
  it("is true when an opposing character is damaged", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-two": ["foe"] },
      definitions: { foe: { id: "foe", cardType: "character" } },
      cardMeta: { foe: { damage: 2 } },
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

  it("is false when no opposing character is damaged", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-two": ["foe"] },
      definitions: { foe: { id: "foe", cardType: "character" } },
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
