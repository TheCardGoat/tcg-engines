import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("in-challenge", () => {
  it("is true when the source card is the attacker", () => {
    const ctx = createTestContext();
    (ctx.G as { challengeState?: { attacker: string; defender: string } }).challengeState = {
      attacker: "src",
      defender: "d",
    };
    const condition: Condition = { type: "in-challenge" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("respects the role: 'defender' filter", () => {
    const ctx = createTestContext();
    (ctx.G as { challengeState?: { attacker: string; defender: string } }).challengeState = {
      attacker: "src",
      defender: "d",
    };
    const asDefender: Condition = { type: "in-challenge", role: "defender" };
    expect(
      evaluateActionCondition(
        asDefender,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(false);
  });

  it("is false when no challenge is in progress", () => {
    const ctx = createTestContext();
    const condition: Condition = { type: "in-challenge" };
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
