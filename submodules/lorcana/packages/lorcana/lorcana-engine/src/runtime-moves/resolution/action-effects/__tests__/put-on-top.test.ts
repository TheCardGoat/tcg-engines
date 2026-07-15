import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { PutOnTopEffect } from "@tcg/lorcana-types";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../../testing/unit-harness";
import { resolvePutOnTopEffect } from "../put-on-top-effect";

const REV = "rev" as CardInstanceId;
const D1 = "d1" as CardInstanceId;
const D2 = "d2" as CardInstanceId;

describe("put-on-top", () => {
  it("moves revealed cards to the top of the controller's deck", () => {
    const ctx = createTestContext({
      zoneCards: {
        "limbo:player-one": [REV],
        "deck:player-one": [D1, D2],
      },
    });
    const effect: PutOnTopEffect = { type: "put-on-top", source: "revealed" };

    resolvePutOnTopEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      eventSnapshot: { revealedCardIds: [REV] },
    });

    const deck = ctx.framework.zones.getCards({ zone: "deck", playerId: PLAYER_ONE });
    expect(deck).toContain(REV);
  });

  it("is a no-op when no source cards are available", () => {
    const ctx = createTestContext({
      zoneCards: { "deck:player-one": [D1] },
    });
    const effect: PutOnTopEffect = { type: "put-on-top", source: "revealed" };

    resolvePutOnTopEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      eventSnapshot: { revealedCardIds: [] },
    });

    expect(ctx.framework.zones.getCards({ zone: "deck", playerId: PLAYER_ONE })).toEqual([D1]);
  });
});
