import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const REV = "rev" as CardInstanceId;

describe("revealed-is-character-named", () => {
  it("is true when the revealed card is a character with the given name", () => {
    const ctx = createTestContext({
      zoneCards: { "deck:player-one": [REV] },
      definitions: {
        rev: { id: "rev", cardType: "character", name: "Simba" },
      },
    });
    const condition: Condition = { type: "revealed-is-character-named", name: "Simba" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { revealedCardIds: [REV] } },
      ),
    ).toBe(true);
  });

  it("is false when the revealed card is a non-character", () => {
    const ctx = createTestContext({
      definitions: {
        rev: { id: "rev", cardType: "action", name: "Simba" },
      },
    });
    const condition: Condition = { type: "revealed-is-character-named", name: "Simba" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { revealedCardIds: [REV] } },
      ),
    ).toBe(false);
  });
});
