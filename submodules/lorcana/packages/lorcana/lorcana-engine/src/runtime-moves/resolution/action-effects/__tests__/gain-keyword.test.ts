import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { GainKeywordEffect } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolveGainKeywordEffect } from "../gain-keyword-effect";

const TGT = "tgt" as CardInstanceId;

function readKeywords(
  ctx: PlayCardExecutionContext,
  id: CardInstanceId,
): Record<string, unknown> | undefined {
  const meta = ctx.cards.get(id)?.meta as
    | { temporaryKeywords?: Record<string, unknown> }
    | undefined;
  return meta?.temporaryKeywords;
}

describe("gain-keyword", () => {
  it("records a temporary Evasive grant on the chosen target", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
    });
    const effect = {
      type: "gain-keyword",
      keyword: "Evasive",
      duration: "next-turn",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as GainKeywordEffect;

    resolveGainKeywordEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT] },
    );

    const keywords = readKeywords(ctx, TGT);
    expect(keywords).toBeDefined();
    expect(Object.keys(keywords ?? {})).toContain("Evasive");
  });

  it("is a no-op when the keyword string is empty", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
    });
    const effect = {
      type: "gain-keyword",
      keyword: "",
      duration: "next-turn",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as GainKeywordEffect;

    resolveGainKeywordEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT] },
    );

    expect(readKeywords(ctx, TGT)).toBeUndefined();
  });
});
