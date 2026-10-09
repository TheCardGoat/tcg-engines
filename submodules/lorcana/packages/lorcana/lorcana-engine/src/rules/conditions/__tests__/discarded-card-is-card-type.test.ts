import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

describe("discarded-card-is-card-type", () => {
  it("matches a discarded card of the given type via the resolution snapshot", () => {
    const ctx = createTestContext({
      definitions: {
        "played-1": { id: "played-1", cardType: "character", name: "Player" },
        "disc-1": { id: "disc-1", cardType: "location", name: "Discarded Location" },
      },
      zoneCards: { [`discard:${PLAYER_ONE}`]: ["disc-1"] },
    });
    const condition: Condition = { type: "discarded-card-is-card-type", cardType: "location" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "played-1", playerId: PLAYER_ONE }),
        { eventSnapshot: { discardedCardIds: ["disc-1" as never] } },
      ),
    ).toBe(true);
  });

  it("is false when no discarded card matches the type", () => {
    const ctx = createTestContext({
      definitions: {
        "played-1": { id: "played-1", cardType: "character", name: "Player" },
        "disc-1": { id: "disc-1", cardType: "action", name: "Discarded Action" },
      },
      zoneCards: { [`discard:${PLAYER_ONE}`]: ["disc-1"] },
    });
    const condition: Condition = { type: "discarded-card-is-card-type", cardType: "location" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "played-1", playerId: PLAYER_ONE }),
        { eventSnapshot: { discardedCardIds: ["disc-1" as never] } },
      ),
    ).toBe(false);
  });
});
