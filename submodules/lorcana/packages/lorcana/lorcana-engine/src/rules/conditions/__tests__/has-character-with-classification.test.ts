import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("has-character-with-classification", () => {
  it("is true when the controller has a character with the classification", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["char"] },
      definitions: {
        char: {
          id: "char",
          cardType: "character",
          classifications: ["Princess"],
        },
      },
    });
    const condition: Condition = {
      type: "has-character-with-classification",
      classification: "Princess",
      controller: "you",
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

  it("is false when no character has the classification", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["char"] },
      definitions: {
        char: {
          id: "char",
          cardType: "character",
          classifications: ["Hero"],
        },
      },
    });
    const condition: Condition = {
      type: "has-character-with-classification",
      classification: "Villain",
      controller: "you",
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
});
