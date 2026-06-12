import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

describe("has-granted-ability", () => {
  it("is true when a temporary grant matches the ability id and is still live", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
      cardMeta: {
        src: {
          temporaryAbilities: { "SHINY-GIFT": 3 },
          temporaryAbilityStarts: { "SHINY-GIFT": 1 },
          temporaryAbilityPayloads: { "SHINY-GIFT": { id: "SHINY-GIFT", type: "activated" } },
        },
      },
      turn: 2,
    });
    const condition: Condition = {
      type: "has-granted-ability",
      abilityId: "SHINY-GIFT",
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

  it("is false when the ability id does not match any grant", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
    });
    const condition: Condition = {
      type: "has-granted-ability",
      abilityId: "SHINY-GIFT",
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
