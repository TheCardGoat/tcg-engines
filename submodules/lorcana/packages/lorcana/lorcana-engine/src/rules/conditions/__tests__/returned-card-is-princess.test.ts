import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const TARGET = "target" as CardInstanceId;
const condition: Condition = { type: "returned-card-is-princess" };

describe("returned-card-is-princess", () => {
  it("is true when a selected target has the Princess classification", () => {
    const ctx = createTestContext({
      definitions: {
        target: {
          id: "target",
          cardType: "character",
          classifications: ["Princess", "Hero"],
        },
      },
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

  it("is false when no selected target is a Princess", () => {
    const ctx = createTestContext({
      definitions: {
        target: { id: "target", cardType: "character", classifications: ["Hero"] },
      },
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
