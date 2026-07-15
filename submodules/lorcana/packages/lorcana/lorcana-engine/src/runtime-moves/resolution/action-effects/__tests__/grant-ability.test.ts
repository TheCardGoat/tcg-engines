import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { GrantAbilityEffect } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolveGrantAbilityEffect } from "../grant-ability-effect";

const TGT = "tgt" as CardInstanceId;

function readAbilities(
  ctx: PlayCardExecutionContext,
  id: CardInstanceId,
): Record<string, unknown> | undefined {
  const meta = ctx.cards.get(id)?.meta as
    | { temporaryAbilities?: Record<string, unknown> }
    | undefined;
  return meta?.temporaryAbilities;
}

describe("grant-ability", () => {
  it("records a temporary ability grant on the chosen target", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
    });
    const effect = {
      type: "grant-ability",
      ability: { id: "SHINY-GIFT", type: "activated" },
      duration: "next-turn",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as GrantAbilityEffect;

    resolveGrantAbilityEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT] },
    );

    const abilities = readAbilities(ctx, TGT);
    expect(abilities).toBeDefined();
    expect(Object.keys(abilities ?? {})).toContain("SHINY-GIFT");
  });

  it("is a no-op when no ability id can be derived", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
    });
    const effect = {
      type: "grant-ability",
      ability: "",
      duration: "next-turn",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as GrantAbilityEffect;

    resolveGrantAbilityEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT] },
    );

    expect(readAbilities(ctx, TGT)).toBeUndefined();
  });
});
