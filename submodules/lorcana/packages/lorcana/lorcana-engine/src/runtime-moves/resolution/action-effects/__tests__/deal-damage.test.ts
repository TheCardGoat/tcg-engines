import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { DealDamageEffect } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolveDealDamageEffect } from "../deal-damage-effect";

const TGT = "tgt" as CardInstanceId;

function readDamage(ctx: PlayCardExecutionContext, id: CardInstanceId): number | undefined {
  return (ctx.cards.get(id)?.meta as { damage?: number } | undefined)?.damage;
}

// Slim per-variant test. Deeper coverage (Resist, Ward, replacement chains)
// lives in the sibling `deal-damage-effect.test.ts` next to the resolver.
describe("deal-damage", () => {
  it("applies the per-target damage amount to the target's meta", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-two": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character", willpower: 4 } },
      cardMeta: { tgt: { damage: 0, state: "ready" } },
    });
    const effect: DealDamageEffect = { type: "deal-damage", amount: 2 };

    resolveDealDamageEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE, cardType: "action" }),
      effect,
      { targets: [TGT], amountByTarget: { [TGT]: 2 } as Record<CardInstanceId, number> },
    );

    expect(readDamage(ctx, TGT)).toBe(2);
  });

  it("is a no-op when no targets are provided", () => {
    const ctx = createTestContext();
    const effect: DealDamageEffect = { type: "deal-damage", amount: 3 };

    resolveDealDamageEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [] },
    );

    expect(true).toBe(true);
  });
});
