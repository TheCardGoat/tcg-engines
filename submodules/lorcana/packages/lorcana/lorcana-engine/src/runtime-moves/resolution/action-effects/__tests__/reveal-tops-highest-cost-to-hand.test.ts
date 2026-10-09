import { describe, expect, it, mock } from "bun:test";
import type { RevealTopsHighestCostToHandEffect } from "@tcg/lorcana-types";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../../testing/unit-harness";
import { resolveRevealTopsHighestCostToHandEffect } from "../reveal-tops-highest-cost-to-hand-effect";

describe("reveal-tops-highest-cost-to-hand", () => {
  it("routes the highest-cost revealed card to its player's hand and the rest to the bottom", () => {
    const log = mock(() => undefined);
    const ctx = createTestContext({
      log,
      zoneCards: {
        [`deck:${PLAYER_ONE}`]: ["p1-top"],
        [`deck:${PLAYER_TWO}`]: ["p2-top"],
      },
      definitions: {
        "p1-top": { id: "p1-top", cardType: "action", cost: 1, name: "Cheap" },
        "p2-top": { id: "p2-top", cardType: "action", cost: 7, name: "Pricey" },
      },
    });

    resolveRevealTopsHighestCostToHandEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      { type: "reveal-tops-highest-cost-to-hand" },
      {},
    );

    // Player two's 7-cost card is the sole winner: to hand.
    expect(ctx.framework.zones.getCards({ zone: "hand", playerId: PLAYER_TWO })).toEqual([
      "p2-top",
    ]);
    // Player one's 1-cost card goes to the bottom of their deck.
    expect(ctx.framework.zones.getCards({ zone: "deck", playerId: PLAYER_ONE })).toEqual([
      "p1-top",
    ]);
    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenCalledWith(
      expect.objectContaining({
        visibility: { mode: "PUBLIC" },
        defaultMessage: {
          key: "lorcana.outcome.revealedCardToHand",
          values: { playerId: PLAYER_ONE, targetPlayerId: PLAYER_TWO, revealedCardId: "p2-top" },
        },
      }),
    );
    expect(log).toHaveBeenCalledWith(
      expect.objectContaining({
        visibility: { mode: "PUBLIC" },
        defaultMessage: {
          key: "lorcana.effect.resolve.revealTopCard.autoBottom",
          values: { playerId: PLAYER_ONE, targetPlayerId: PLAYER_ONE, revealedCardId: "p1-top" },
        },
      }),
    );
  });

  it("routes every card tied for highest cost to its player's hand", () => {
    const ctx = createTestContext({
      zoneCards: {
        [`deck:${PLAYER_ONE}`]: ["p1-top"],
        [`deck:${PLAYER_TWO}`]: ["p2-top"],
      },
      definitions: {
        "p1-top": { id: "p1-top", cardType: "action", cost: 5, name: "Tie A" },
        "p2-top": { id: "p2-top", cardType: "action", cost: 5, name: "Tie B" },
      },
    });

    resolveRevealTopsHighestCostToHandEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      { type: "reveal-tops-highest-cost-to-hand" },
      {},
    );

    expect(ctx.framework.zones.getCards({ zone: "hand", playerId: PLAYER_ONE })).toEqual([
      "p1-top",
    ]);
    expect(ctx.framework.zones.getCards({ zone: "hand", playerId: PLAYER_TWO })).toEqual([
      "p2-top",
    ]);
  });

  it("handles a player with an empty deck (only the other player's card routes)", () => {
    const ctx = createTestContext({
      zoneCards: {
        [`deck:${PLAYER_TWO}`]: ["p2-top"],
      },
      definitions: {
        "p2-top": { id: "p2-top", cardType: "action", cost: 3, name: "Only" },
      },
    });

    resolveRevealTopsHighestCostToHandEffect(
      ctx,
      createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }),
      { type: "reveal-tops-highest-cost-to-hand" },
      {},
    );

    expect(ctx.framework.zones.getCards({ zone: "hand", playerId: PLAYER_TWO })).toEqual([
      "p2-top",
    ]);
  });
});
