import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("has-character-with-strength", () => {
  it("is true when a controlled character matches the strength comparison", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["char"] },
      definitions: {
        char: { id: "char", cardType: "character", strength: 5, willpower: 3 },
      },
    });
    const condition: Condition = {
      type: "has-character-with-strength",
      controller: "you",
      comparison: "greater-or-equal",
      value: 5,
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

  it("is false when no controlled character meets the threshold", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["char"] },
      definitions: {
        char: { id: "char", cardType: "character", strength: 1, willpower: 3 },
      },
    });
    const condition: Condition = {
      type: "has-character-with-strength",
      controller: "you",
      comparison: "greater-or-equal",
      value: 5,
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
