import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("at-location", () => {
  it("is true when the source card's atLocationId references an in-play location", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src", "loc"] },
      definitions: {
        loc: { id: "loc", cardType: "location", name: "Motunui" },
      },
      cardMeta: { src: { atLocationId: "loc" } },
    });
    const condition: Condition = { type: "at-location" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("filters by locationName when provided", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src", "loc"] },
      definitions: {
        loc: { id: "loc", cardType: "location", name: "Motunui" },
      },
      cardMeta: { src: { atLocationId: "loc" } },
    });
    const condition: Condition = { type: "at-location", locationName: "Maui's Hideaway" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(false);
  });

  it("is false when the source card is not at any location", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
    });
    const condition: Condition = { type: "at-location" };
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
