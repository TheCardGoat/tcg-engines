import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("has-location-in-play", () => {
  it("is true when the controller has a location in play", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["loc"] },
      definitions: { loc: { id: "loc", cardType: "location" } },
    });
    const condition: Condition = { type: "has-location-in-play", controller: "you" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("is false when the controller has no locations in play", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["char"] },
      definitions: { char: { id: "char", cardType: "character" } },
    });
    const condition: Condition = { type: "has-location-in-play", controller: "you" };
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
