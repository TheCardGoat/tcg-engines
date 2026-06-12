import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const S1 = "s1" as CardInstanceId;
const S2 = "s2" as CardInstanceId;

describe("play-context", () => {
  it("reads the singer count from cardPlayed.singerIds", () => {
    const ctx = createTestContext();
    const condition: Condition = {
      type: "play-context",
      context: "characters-sang-this-song",
      comparison: { operator: "gte", value: 2 },
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({
          cardId: "src",
          playerId: PLAYER_ONE,
          singerIds: [S1, S2],
        }),
        {},
      ),
    ).toBe(true);
  });

  it("is false when the singer count falls below the threshold", () => {
    const ctx = createTestContext();
    const condition: Condition = {
      type: "play-context",
      context: "characters-sang-this-song",
      comparison: { operator: "gte", value: 2 },
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({
          cardId: "src",
          playerId: PLAYER_ONE,
          singerIds: [S1],
        }),
        {},
      ),
    ).toBe(false);
  });
});
