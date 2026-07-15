import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";

const condition: Condition = { type: "first-turn-non-otp" };

describe("first-turn-non-otp", () => {
  it("is true for the non-OTP player during their very first completed turn", () => {
    const ctx = createTestContext({ otp: PLAYER_ONE, currentPlayer: PLAYER_TWO });
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_TWO }),
        {},
      ),
    ).toBe(true);
  });

  it("is false after the non-OTP player has already completed a turn", () => {
    const ctx = createTestContext({ otp: PLAYER_ONE, currentPlayer: PLAYER_TWO });
    ctx.G.turnsCompletedByPlayer[PLAYER_TWO] = 1;
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_TWO }),
        {},
      ),
    ).toBe(false);
  });

  it("is false for the OTP player themselves", () => {
    const ctx = createTestContext({ otp: PLAYER_ONE, currentPlayer: PLAYER_ONE });
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(false);
  });
});
