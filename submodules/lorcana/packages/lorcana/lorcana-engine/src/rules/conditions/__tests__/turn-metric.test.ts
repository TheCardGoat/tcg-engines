import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

describe("turn-metric", () => {
  it("reads the challenges-by-player metric scoped to the controller", () => {
    const ctx = createTestContext();
    ctx.G.turnMetadata.challengesByPlayerThisTurn[PLAYER_ONE] = 2;
    const condition: Condition = {
      type: "turn-metric",
      metric: "challenges-by-player",
      playerScope: "you",
      comparison: { operator: "gte", value: 2 },
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("checks the damaged-characters-by-owner metric scoped to the opponent", () => {
    const ctx = createTestContext();
    ctx.G.turnMetadata.damagedCharactersByOwnerThisTurn[PLAYER_TWO] = 1;
    const condition: Condition = {
      type: "turn-metric",
      metric: "damaged-characters-by-owner",
      ownerScope: "opponent",
      comparison: { operator: "gte", value: 1 },
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });
});
