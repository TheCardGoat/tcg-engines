import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { LoseKeywordEffect } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolveLoseKeywordEffect } from "../lose-keyword-effect";

const TGT = "tgt" as CardInstanceId;

function readLostKeywords(
  ctx: PlayCardExecutionContext,
  id: CardInstanceId,
): Record<string, unknown> | undefined {
  const meta = ctx.cards.get(id)?.meta as
    | { temporaryLostKeywords?: Record<string, unknown> }
    | undefined;
  return meta?.temporaryLostKeywords;
}

describe("lose-keyword", () => {
  it("records a temporary keyword-loss entry on the chosen target", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
    });
    const effect = {
      type: "lose-keyword",
      keyword: "Evasive",
      duration: "next-turn",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as LoseKeywordEffect;

    resolveLoseKeywordEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT] },
    );

    const lost = readLostKeywords(ctx, TGT);
    expect(lost).toBeDefined();
    expect(Object.keys(lost ?? {})).toContain("Evasive");
  });

  it("is a no-op when the keyword is blank", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
    });
    const effect = {
      type: "lose-keyword",
      keyword: "",
      duration: "next-turn",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as LoseKeywordEffect;

    resolveLoseKeywordEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT] },
    );

    expect(readLostKeywords(ctx, TGT)).toBeUndefined();
  });
});
