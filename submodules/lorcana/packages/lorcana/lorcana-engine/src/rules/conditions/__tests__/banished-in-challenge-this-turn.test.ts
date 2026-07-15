import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

describe("banished-in-challenge-this-turn", () => {
  it("is true when the controller has banished characters in a challenge this turn", () => {
    const ctx = createTestContext();
    (
      ctx.G.turnMetadata as {
        banishedCharactersInChallengeByOwnerThisTurn?: Record<string, number>;
      }
    ).banishedCharactersInChallengeByOwnerThisTurn = { [PLAYER_ONE]: 1 };
    const condition: Condition = {
      type: "banished-in-challenge-this-turn",
      owner: "you",
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

  it("is false when no matching banishes happened", () => {
    const ctx = createTestContext();
    const condition: Condition = {
      type: "banished-in-challenge-this-turn",
      owner: "you",
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(false);
  });

  it("detects opposing banishes when owner: 'opponent'", () => {
    const ctx = createTestContext();
    (
      ctx.G.turnMetadata as {
        banishedCharactersInChallengeByOwnerThisTurn?: Record<string, number>;
      }
    ).banishedCharactersInChallengeByOwnerThisTurn = { [PLAYER_TWO]: 2 };
    const condition: Condition = {
      type: "banished-in-challenge-this-turn",
      owner: "opponent",
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
