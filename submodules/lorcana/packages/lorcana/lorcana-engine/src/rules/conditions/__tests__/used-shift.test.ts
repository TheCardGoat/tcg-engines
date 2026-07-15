import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const condition: Condition = { type: "used-shift" };

describe("used-shift", () => {
  it("is true when cardPlayed.usedShift is set", () => {
    const ctx = createTestContext();
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE, usedShift: true }),
        {},
      ),
    ).toBe(true);
  });

  it("is true when resolutionInput.eventSnapshot reports the played card used shift", () => {
    const ctx = createTestContext();
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { eventSnapshot: { playedCardUsedShift: true } },
      ),
    ).toBe(true);
  });

  it("is false when neither signal is set", () => {
    const ctx = createTestContext();
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
