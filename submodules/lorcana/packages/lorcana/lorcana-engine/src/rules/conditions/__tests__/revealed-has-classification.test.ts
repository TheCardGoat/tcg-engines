import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const REV = "rev" as CardInstanceId;

describe("revealed-has-classification", () => {
  it("is true when the revealed card has the given classification", () => {
    const ctx = createTestContext({
      definitions: {
        rev: {
          id: "rev",
          cardType: "character",
          name: "Winnie the Pooh",
          classifications: ["Storyborn", "Hero", "Hunny"],
        },
      },
    });
    const condition: Condition = { type: "revealed-has-classification", classification: "Hunny" };

    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { revealedCardIds: [REV] } },
      ),
    ).toBe(true);
  });

  it("is false when the revealed card does not have the given classification", () => {
    const ctx = createTestContext({
      definitions: {
        rev: {
          id: "rev",
          cardType: "character",
          name: "Winnie the Pooh",
          classifications: ["Storyborn", "Hero"],
        },
      },
    });
    const condition: Condition = { type: "revealed-has-classification", classification: "Hunny" };

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
