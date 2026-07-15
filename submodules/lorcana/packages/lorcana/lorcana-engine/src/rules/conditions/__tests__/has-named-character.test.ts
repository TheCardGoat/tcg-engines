import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("has-named-character", () => {
  it("is true when the controller has a character in play with the given name", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["char"] },
      definitions: { char: { id: "char", cardType: "character", name: "Mickey Mouse" } },
    });
    const condition: Condition = {
      type: "has-named-character",
      name: "Mickey Mouse",
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

  it("is false when no matching character is in play", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["char"] },
      definitions: { char: { id: "char", cardType: "character", name: "Mickey Mouse" } },
    });
    const condition: Condition = {
      type: "has-named-character",
      name: "Ariel",
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
