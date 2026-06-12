import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { ReadyEffect } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolveReadyEffect } from "../ready-effect";

const TGT = "tgt" as CardInstanceId;

function readState(ctx: PlayCardExecutionContext, id: CardInstanceId): string | undefined {
  const card = ctx.cards.get(id);
  return (card?.meta as { state?: string } | undefined)?.state;
}

describe("ready", () => {
  it("flips an exerted chosen target back to the ready state", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
      cardMeta: { tgt: { state: "exerted" } },
    });
    const effect = {
      type: "ready",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as ReadyEffect;

    resolveReadyEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      targets: [TGT],
    });

    expect(readState(ctx, TGT)).toBe("ready");
  });

  it("does nothing when the selection is empty", () => {
    const ctx = createTestContext({
      zoneCards: { "play:player-one": [TGT] },
      definitions: { tgt: { id: "tgt", cardType: "character" } },
      cardMeta: { tgt: { state: "exerted" } },
    });
    const effect = {
      type: "ready",
      target: { selector: "chosen", cardType: "character" },
    } as unknown as ReadyEffect;

    resolveReadyEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {});

    expect(readState(ctx, TGT)).toBe("exerted");
  });
});
