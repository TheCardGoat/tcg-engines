import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const DISC = "disc" as CardInstanceId;

describe("discarded-card-has-classification", () => {
  it("is true when a discarded character carries the classification", () => {
    const ctx = createTestContext({
      definitions: {
        disc: { id: "disc", cardType: "character", classifications: ["Villain"] },
      },
    });
    const condition: Condition = {
      type: "discarded-card-has-classification",
      classification: "Villain",
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { discardedCardIds: [DISC] } },
      ),
    ).toBe(true);
  });

  it("is false when no discarded card matches the classification", () => {
    const ctx = createTestContext({
      definitions: {
        disc: { id: "disc", cardType: "character", classifications: ["Hero"] },
      },
    });
    const condition: Condition = {
      type: "discarded-card-has-classification",
      classification: "Villain",
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { discardedCardIds: [DISC] } },
      ),
    ).toBe(false);
  });
});
