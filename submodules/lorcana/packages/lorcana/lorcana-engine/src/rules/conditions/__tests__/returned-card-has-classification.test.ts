import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const TARGET = "target" as CardInstanceId;

describe("returned-card-has-classification", () => {
  it("is true when a returned card has the specified classification", () => {
    const ctx = createTestContext({
      definitions: {
        target: { id: "target", cardType: "character", classifications: ["Princess"] },
      },
    });
    const condition: Condition = {
      type: "returned-card-has-classification",
      classification: "Princess",
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { targets: [TARGET] },
      ),
    ).toBe(true);
  });

  it("is false when a returned card does not have the specified classification", () => {
    const ctx = createTestContext({
      definitions: {
        target: { id: "target", cardType: "character", classifications: ["Hero"] },
      },
    });
    const condition: Condition = {
      type: "returned-card-has-classification",
      classification: "Princess",
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { targets: [TARGET] },
      ),
    ).toBe(false);
  });

  it("is false when there are no selected targets", () => {
    const ctx = createTestContext({
      definitions: {
        target: { id: "target", cardType: "character", classifications: ["Princess"] },
      },
    });
    const condition: Condition = {
      type: "returned-card-has-classification",
      classification: "Princess",
    };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { targets: [] },
      ),
    ).toBe(false);
  });
});
