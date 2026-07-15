import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const condition: Condition = { type: "previous-target-has-card-under" };
const TARGET = "target" as CardInstanceId;

describe("previous-target-has-card-under", () => {
  it("is true when the previously selected target has a card stacked under it", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src", "target"] },
      cardMeta: { target: { cardsUnder: ["under-1"] } },
    });

    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { targets: [TARGET] },
      ),
    ).toBe(true);
  });

  it("is false when the previously selected target has no cards under it", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src", "target"] },
      cardMeta: { target: { cardsUnder: [] } },
    });

    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { targets: [TARGET] },
      ),
    ).toBe(false);
  });
});
