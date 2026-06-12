import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const REV = "rev" as CardInstanceId;
const condition: Condition = { type: "revealed-matches-named" };

describe("revealed-matches-named", () => {
  it("is true when the revealed card's name matches the previously named card", () => {
    const ctx = createTestContext({
      definitions: {
        rev: { id: "rev", cardType: "character", name: "Ariel" },
      },
    });
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { revealedCardIds: [REV], namedCardName: "Ariel" } },
      ),
    ).toBe(true);
  });

  it("is false when the names disagree", () => {
    const ctx = createTestContext({
      definitions: {
        rev: { id: "rev", cardType: "character", name: "Ariel" },
      },
    });
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { revealedCardIds: [REV], namedCardName: "Flounder" } },
      ),
    ).toBe(false);
  });
});
