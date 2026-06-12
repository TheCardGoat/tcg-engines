import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import { resolveDiscardEffect } from "./discard-effect";
import type { PlayCardExecutionContext } from "./types";

const PLAYER_ONE = "player-one" as PlayerId;
const PLAYER_TWO = "player-two" as PlayerId;

function createTestContext(args?: {
  definitions?: Record<string, Record<string, unknown>>;
  zoneCards?: Record<string, CardInstanceId[]>;
}): {
  ctx: PlayCardExecutionContext;
  state: {
    zoneCards: Record<string, CardInstanceId[]>;
  };
} {
  const definitions = args?.definitions ?? {};
  const zoneCards = args?.zoneCards ?? {};
  const cardIndex: Record<string, { ownerID: PlayerId; zoneKey: string }> = {};

  for (const [zoneKey, cards] of Object.entries(zoneCards)) {
    const [, ownerSegment] = zoneKey.split(":");
    const ownerId = (ownerSegment ?? PLAYER_ONE) as PlayerId;
    for (const cardId of cards) {
      cardIndex[cardId] = { ownerID: ownerId, zoneKey };
    }
  }

  const moveCard = (cardId: CardInstanceId, destination: { zone: string; playerId: PlayerId }) => {
    const currentZoneKey = cardIndex[cardId]?.zoneKey;
    if (currentZoneKey) {
      zoneCards[currentZoneKey] = (zoneCards[currentZoneKey] ?? []).filter(
        (entry) => entry !== cardId,
      );
    }

    const nextZoneKey = `${destination.zone}:${destination.playerId}`;
    zoneCards[nextZoneKey] = [...(zoneCards[nextZoneKey] ?? []), cardId];
    cardIndex[cardId] = {
      ownerID: cardIndex[cardId]?.ownerID ?? destination.playerId,
      zoneKey: nextZoneKey,
    };
  };

  const cardsApi = {
    getDefinition: (cardId: CardInstanceId) => definitions[cardId],
    require: (cardId: CardInstanceId) => ({
      definition: definitions[cardId],
      meta: {},
    }),
  };
  const randomApi = {
    random: () => Math.random(),
    shuffle: <T>(array: T[]): T[] => {
      const shuffled = [...array];

      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
      }

      return shuffled;
    },
  };

  return {
    ctx: {
      G: {
        lore: {
          [PLAYER_ONE]: 0,
          [PLAYER_TWO]: 0,
        },
        pendingEffects: [],
      },
      playerId: PLAYER_ONE,
      cards: cardsApi,
      framework: {
        cards: cardsApi,
        events: {
          emit: () => {},
        },
        random: randomApi,
        state: {
          playerIds: [PLAYER_ONE, PLAYER_TWO],
          currentPlayer: PLAYER_ONE,
          priority: {
            holder: PLAYER_ONE,
          },
          _zonesPrivate: {
            cardIndex,
          },
        },
        zones: {
          getCards: ({ zone, playerId }: { zone: string; playerId: PlayerId }) => [
            ...(zoneCards[`${zone}:${playerId}`] ?? []),
          ],
          getCardOwner: (cardId: string) => cardIndex[cardId]?.ownerID,
          moveCard,
        },
      },
    } as unknown as PlayCardExecutionContext,
    state: {
      zoneCards,
    },
  };
}

describe("discard-effect", () => {
  it("discards the only valid card when random discard has a single candidate", () => {
    const source = "source" as CardInstanceId;
    const onlyCard = "only-card" as CardInstanceId;
    const { ctx, state } = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [onlyCard]: { id: "only-card", cardType: "action" },
      },
      zoneCards: {
        [`hand:${PLAYER_TWO}`]: [onlyCard],
      },
    });

    resolveDiscardEffect(
      ctx,
      {
        cardId: source,
        cardType: "action",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      {
        type: "discard",
        amount: 1,
        random: true,
        target: "OPPONENT",
      },
      {},
      {},
    );

    expect(state.zoneCards[`hand:${PLAYER_TWO}`]).toEqual([]);
    expect(state.zoneCards[`discard:${PLAYER_TWO}`]).toEqual([onlyCard]);
  });

  it("samples randomly from multiple valid cards instead of always taking the first candidate", () => {
    const originalRandom = Math.random;
    Math.random = () => 0;

    try {
      const source = "source" as CardInstanceId;
      const firstCard = "first-card" as CardInstanceId;
      const secondCard = "second-card" as CardInstanceId;
      const thirdCard = "third-card" as CardInstanceId;
      const { ctx, state } = createTestContext({
        definitions: {
          [source]: { id: "source", cardType: "action" },
          [firstCard]: { id: "first-card", cardType: "action" },
          [secondCard]: { id: "second-card", cardType: "action" },
          [thirdCard]: { id: "third-card", cardType: "action" },
        },
        zoneCards: {
          [`hand:${PLAYER_TWO}`]: [firstCard, secondCard, thirdCard],
        },
      });

      resolveDiscardEffect(
        ctx,
        {
          cardId: source,
          cardType: "action",
          costType: "free",
          playerId: PLAYER_ONE,
        },
        {
          type: "discard",
          amount: 1,
          random: true,
          target: "OPPONENT",
        },
        {},
        {},
      );

      expect(state.zoneCards[`discard:${PLAYER_TWO}`]).toEqual([secondCard]);
      expect(state.zoneCards[`hand:${PLAYER_TWO}`]).toEqual([firstCard, thirdCard]);
    } finally {
      Math.random = originalRandom;
    }
  });

  it("resolves CARD_OWNER random discard from the selected card owner", () => {
    const source = "source" as CardInstanceId;
    const selectedCard = "selected-card" as CardInstanceId;
    const ownedHandCard = "owned-hand-card" as CardInstanceId;
    const { ctx, state } = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [selectedCard]: { id: "selected-card", cardType: "character" },
        [ownedHandCard]: { id: "owned-hand-card", cardType: "action" },
      },
      zoneCards: {
        [`play:${PLAYER_TWO}`]: [selectedCard],
        [`hand:${PLAYER_TWO}`]: [ownedHandCard],
      },
    });

    resolveDiscardEffect(
      ctx,
      {
        cardId: source,
        cardType: "action",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      {
        type: "discard",
        amount: 1,
        random: true,
        target: "CARD_OWNER",
      },
      {
        targets: [selectedCard],
      },
      {
        selectedTargets: [selectedCard],
      },
    );

    expect(state.zoneCards[`discard:${PLAYER_TWO}`]).toEqual([ownedHandCard]);
    expect(state.zoneCards[`hand:${PLAYER_TWO}`]).toEqual([]);
  });

  it("keeps chosen discard semantics ahead of random discard semantics", () => {
    const source = "source" as CardInstanceId;
    const firstCard = "first-card" as CardInstanceId;
    const secondCard = "second-card" as CardInstanceId;
    const { ctx, state } = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [firstCard]: { id: "first-card", cardType: "action" },
        [secondCard]: { id: "second-card", cardType: "action" },
      },
      zoneCards: {
        [`hand:${PLAYER_TWO}`]: [firstCard, secondCard],
      },
    });

    resolveDiscardEffect(
      ctx,
      {
        cardId: source,
        cardType: "action",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      {
        type: "discard",
        amount: 1,
        chosen: true,
        random: true,
        target: "OPPONENT",
      },
      {
        targets: [secondCard],
      },
      {
        selectedTargets: [secondCard],
      },
    );

    expect(ctx.G.pendingEffects).toEqual([
      expect.objectContaining({
        kind: "discard-choice",
        chooserId: PLAYER_TWO,
      }),
    ]);
    expect(state.zoneCards[`discard:${PLAYER_TWO}`]).toBeUndefined();
    expect(state.zoneCards[`hand:${PLAYER_TWO}`]).toEqual([firstCard, secondCard]);
  });

  it("resolves CARD_OWNER random discard via eventSnapshot.chosenCardId when selectedTargets is empty", () => {
    // Reproduces the Yzma "BACK TO WORK" gap:
    // Step 1: return-to-hand writes resolvedTargets[0] into eventSnapshot.chosenCardId.
    // Step 2: discard with target: "CARD_OWNER" — selectedTargets is empty because no card was
    //         passed as an explicit selection target (the card was resolved from the event snapshot
    //         ref, not from currentTargets). The discard must fall back to chosenCardId to find the owner.
    const source = "source" as CardInstanceId;
    const returnedCard = "returned-card" as CardInstanceId;
    const ownedHandCard = "owned-hand-card" as CardInstanceId;
    const { ctx, state } = createTestContext({
      definitions: {
        [source]: { id: "source", cardType: "character" },
        [returnedCard]: { id: "returned-card", cardType: "character" },
        [ownedHandCard]: { id: "owned-hand-card", cardType: "character" },
      },
      zoneCards: {
        // returnedCard has already been moved to hand by the prior step
        [`hand:${PLAYER_TWO}`]: [returnedCard, ownedHandCard],
      },
    });

    resolveDiscardEffect(
      ctx,
      {
        cardId: source,
        cardType: "character",
        costType: "standard",
        playerId: PLAYER_ONE,
      },
      {
        type: "discard",
        amount: 1,
        random: true,
        target: "CARD_OWNER",
      },
      // No explicit targets — simulates the second step of a sequence where step 1 used ref: "trigger-source"
      {
        eventSnapshot: {
          // Written by return-to-hand after resolving the trigger-source ref
          chosenCardId: returnedCard,
        },
      },
      {},
    );

    // One of the two hand cards should have been discarded (owner is PLAYER_TWO)
    const discarded = state.zoneCards[`discard:${PLAYER_TWO}`] ?? [];
    expect(discarded).toHaveLength(1);
    const remaining = state.zoneCards[`hand:${PLAYER_TWO}`] ?? [];
    expect(remaining).toHaveLength(1);
  });
});
