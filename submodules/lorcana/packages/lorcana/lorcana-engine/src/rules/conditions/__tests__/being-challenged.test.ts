import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const condition: Condition = { type: "being-challenged" };

describe("being-challenged", () => {
  it("is true when the source card is the defender in the current challenge", () => {
    const ctx = createTestContext();
    (ctx.G as { challengeState?: { attacker: string; defender: string } }).challengeState = {
      attacker: "attacker",
      defender: "src",
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

  it("is false when the source card is the attacker", () => {
    const ctx = createTestContext();
    (ctx.G as { challengeState?: { attacker: string; defender: string } }).challengeState = {
      attacker: "src",
      defender: "defender",
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

  it("is false when no challenge is in progress", () => {
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
