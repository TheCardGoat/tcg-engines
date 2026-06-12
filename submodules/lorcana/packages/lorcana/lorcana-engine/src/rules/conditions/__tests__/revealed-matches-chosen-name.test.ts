import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const CHOSEN = "chosen" as CardInstanceId;
const REV = "rev" as CardInstanceId;
const condition: Condition = { type: "revealed-matches-chosen-name" };

describe("revealed-matches-chosen-name", () => {
  it("is true when the revealed card shares a name with the chosen card", () => {
    const ctx = createTestContext({
      definitions: {
        chosen: { id: "chosen", cardType: "character", name: "Elsa" },
        rev: { id: "rev", cardType: "character", name: "Elsa" },
      },
    });
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {
          targets: [CHOSEN],
          eventSnapshot: { revealedCardIds: [REV] },
        },
      ),
    ).toBe(true);
  });

  it("is false when the names diverge", () => {
    const ctx = createTestContext({
      definitions: {
        chosen: { id: "chosen", cardType: "character", name: "Elsa" },
        rev: { id: "rev", cardType: "character", name: "Olaf" },
      },
    });
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {
          targets: [CHOSEN],
          eventSnapshot: { revealedCardIds: [REV] },
        },
      ),
    ).toBe(false);
  });
});
