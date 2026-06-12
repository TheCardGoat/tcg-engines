import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { ExertEffect } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolveExertEffect } from "../exert-effect";

const TGT = "tgt" as CardInstanceId;

function readState(ctx: PlayCardExecutionContext, id: CardInstanceId): string | undefined {
  return (ctx.cards.get(id)?.meta as { state?: string } | undefined)?.state;
}

describe("exert", () => {
  it("sets state: 'exerted' on the chosen target", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
      cardMeta: { tgt: { state: "ready" } },
    });
    const effect = {
      type: "exert",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as ExertEffect;

    resolveExertEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      targets: [TGT],
    });

    expect(readState(ctx, TGT)).toBe("exerted");
  });

  it("skips targets that are already exerted", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
      cardMeta: { tgt: { state: "exerted" } },
    });
    const effect = {
      type: "exert",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as ExertEffect;

    resolveExertEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      targets: [TGT],
    });

    expect(readState(ctx, TGT)).toBe("exerted");
  });
});
