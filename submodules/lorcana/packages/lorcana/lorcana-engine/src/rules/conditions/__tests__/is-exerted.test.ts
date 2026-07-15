import { describe, expect, it } from "bun:test";
import type { Condition } from "@tcg/lorcana-types";
import { evaluateActionCondition } from "../../../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";

// is-exerted is an alias of `exerted` — same runtime branch, different
// discriminator kept for parser-compatibility.
const condition: Condition = { type: "is-exerted" };

describe("is-exerted", () => {
  it("is true when the source card meta.state is 'exerted'", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
      cardMeta: { src: { state: "exerted" } },
    });
    expect(
      evaluateActionCondition(
        condition,
        ctx,
        createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
        {},
      ),
    ).toBe(true);
  });

  it("is false when the source card is ready", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": ["src"] },
      cardMeta: { src: { state: "ready" } },
    });
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
