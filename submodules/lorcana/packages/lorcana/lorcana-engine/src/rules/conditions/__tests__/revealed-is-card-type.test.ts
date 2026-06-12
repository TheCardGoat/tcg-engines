import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const REV = "rev" as CardInstanceId;

describe("revealed-is-card-type", () => {
  it("is true when the revealed card matches the specified type", () => {
    const ctx = createTestContext({
      zoneCards: { "deck:player-one": [REV] },
      definitions: {
        rev: { id: "rev", cardType: "character", name: "Simba" },
      },
    });
    const condition: Condition = { type: "revealed-is-card-type", cardType: "character" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { revealedCardIds: [REV] } },
      ),
    ).toBe(true);
  });

  it("is false when the revealed card does not match the specified type", () => {
    const ctx = createTestContext({
      definitions: {
        rev: { id: "rev", cardType: "action", name: "Play Card" },
      },
    });
    const condition: Condition = { type: "revealed-is-card-type", cardType: "character" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { revealedCardIds: [REV] } },
      ),
    ).toBe(false);
  });

  it("is false when no card is revealed", () => {
    const ctx = createTestContext({
      definitions: {
        rev: { id: "rev", cardType: "character", name: "Simba" },
      },
    });
    const condition: Condition = { type: "revealed-is-card-type", cardType: "character" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: {} },
      ),
    ).toBe(false);
  });
});
