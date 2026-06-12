import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { PutDamageEffect } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolvePutDamageEffect } from "../put-damage-effect";

const TGT = "tgt" as CardInstanceId;

function readDamage(ctx: PlayCardExecutionContext, id: CardInstanceId): number | undefined {
  const card = ctx.cards.get(id);
  return (card?.meta as { damage?: number } | undefined)?.damage;
}

describe("put-damage", () => {
  it("adds damage counters to the target by the per-target amount", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character", willpower: 5 } },
      cardMeta: { tgt: { damage: 0 } },
    });
    const effect = {
      type: "put-damage",
      amount: 1,
      target: { selector: "chosen", cardType: "character" },
    } as unknown as PutDamageEffect;

    resolvePutDamageEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      targets: [TGT],
      amountByTarget: { [TGT]: 2 } as Record<CardInstanceId, number>,
    });

    expect(readDamage(ctx, TGT)).toBe(2);
  });
});
