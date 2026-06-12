import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { RestrictionEffect } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolveRestrictionEffect } from "../restriction-effect";

const TGT = "tgt" as CardInstanceId;

function readRestrictions(
  ctx: PlayCardExecutionContext,
  id: CardInstanceId,
): Record<string, unknown> | undefined {
  const card = ctx.cards.get(id);
  const meta = card?.meta as { temporaryRestrictions?: Record<string, unknown> } | undefined;
  return meta?.temporaryRestrictions;
}

describe("restriction", () => {
  it("records a temporary restriction on the chosen target", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
    });
    const effect = {
      type: "restriction",
      restriction: "cant-challenge",
      duration: "next-turn",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as RestrictionEffect;

    resolveRestrictionEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT] },
    );

    const restrictions = readRestrictions(ctx, TGT);
    expect(restrictions).toBeDefined();
    expect(Object.keys(restrictions ?? {})).toContain("cant-challenge");
  });

  it("is a no-op when the restriction string is empty", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
    });
    const effect = {
      type: "restriction",
      restriction: "",
      duration: "next-turn",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as RestrictionEffect;

    resolveRestrictionEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      effect,
      { targets: [TGT] },
    );

    expect(readRestrictions(ctx, TGT)).toBeUndefined();
  });
});
