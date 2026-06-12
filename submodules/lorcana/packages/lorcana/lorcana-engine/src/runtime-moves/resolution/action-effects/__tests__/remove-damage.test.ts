import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { RemoveDamageEffect } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolveRemoveDamageEffect } from "../remove-damage-effect";

const TGT = "tgt" as CardInstanceId;

function readDamage(ctx: PlayCardExecutionContext, id: CardInstanceId): number | undefined {
  const card = ctx.cards.get(id);
  return (card?.meta as { damage?: number } | undefined)?.damage;
}

describe("remove-damage", () => {
  it("heals up to the per-target amount, capped at the current damage", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
      cardMeta: { tgt: { damage: 3 } },
    });
    const effect: RemoveDamageEffect = { type: "remove-damage", amount: 2 };

    resolveRemoveDamageEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT], amountByTarget: { [TGT]: 2 } as Record<CardInstanceId, number> },
    );

    expect(readDamage(ctx, TGT)).toBe(1);
  });

  it("will not reduce damage below zero", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
      cardMeta: { tgt: { damage: 1 } },
    });
    const effect: RemoveDamageEffect = { type: "remove-damage", amount: 5 };

    resolveRemoveDamageEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT], amountByTarget: { [TGT]: 5 } as Record<CardInstanceId, number> },
    );

    expect(readDamage(ctx, TGT)).toBe(0);
  });
});
