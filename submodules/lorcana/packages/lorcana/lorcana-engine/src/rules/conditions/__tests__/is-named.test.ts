import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

const TARGET = "target" as CardInstanceId;

describe("is-named", () => {
  it("is true when a selected target matches the given name", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TARGET] },
      definitions: { target: { id: "target", cardType: "character", name: "Ariel" } },
    });
    const condition: Condition = { type: "is-named", name: "Ariel" };
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        { targets: [TARGET] },
      ),
    ).toBe(true);
  });

  it("is false when no selected target matches", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TARGET] },
      definitions: { target: { id: "target", cardType: "character", name: "Ariel" } },
    });
    const condition: Condition = { type: "is-named", name: "Moana" };
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
