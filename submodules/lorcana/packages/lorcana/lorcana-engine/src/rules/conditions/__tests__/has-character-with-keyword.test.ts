import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("has-character-with-keyword", () => {
  it("is true when a controlled character has the keyword via abilities", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["char"] },
      definitions: {
        char: {
          id: "char",
          cardType: "character",
          abilities: [{ type: "keyword", keyword: "Evasive" }],
        },
      },
    });
    const condition: Condition = {
      type: "has-character-with-keyword",
      keyword: "Evasive",
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

  it("is false when no controlled character has the keyword", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["char"] },
      definitions: {
        char: {
          id: "char",
          cardType: "character",
          abilities: [],
        },
      },
    });
    const condition: Condition = {
      type: "has-character-with-keyword",
      keyword: "Evasive",
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
