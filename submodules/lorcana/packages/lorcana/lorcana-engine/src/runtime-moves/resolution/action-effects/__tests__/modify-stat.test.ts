import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { ModifyStatEffect } from "@tcg/lorcana-types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolveModifyStatEffect } from "../modify-stat-effect";

const TGT = "tgt" as CardInstanceId;

describe("modify-stat", () => {
  it("registers a continuous stat-modifier entry for the target", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character", strength: 2, willpower: 3 } },
    });
    const effect: ModifyStatEffect = {
      type: "modify-stat",
      stat: "strength",
      modifier: 2,
      duration: "this-turn",
    };

    resolveModifyStatEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT], modifierByTarget: { [TGT]: 2 } as Record<CardInstanceId, number> },
    );

    const continuous = (ctx.G as { continuousEffects?: { instances: unknown[] } })
      .continuousEffects;
    expect(continuous?.instances.length ?? 0).toBeGreaterThan(0);
  });

  it("ignores unsupported stat names", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
    });
    const effect = {
      type: "modify-stat",
      stat: "cost",
      modifier: 2,
      duration: "this-turn",
    } as unknown as ModifyStatEffect;

    resolveModifyStatEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT], modifierByTarget: { [TGT]: 2 } as Record<CardInstanceId, number> },
    );

    const continuous = (ctx.G as { continuousEffects?: { instances: unknown[] } })
      .continuousEffects;
    expect(continuous?.instances.length ?? 0).toBe(0);
  });
});
