import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import type { CardPlayedPayload } from "../../../types";
import type { PlayCardExecutionContext } from "./types";
import { resolveReturnRandomFromInkwellEffect } from "./return-random-from-inkwell-effect";

const PLAYER_ONE = "player-one" as PlayerId;
const PLAYER_TWO = "player-two" as PlayerId;

function createCardPlayedPayload(cardId: CardInstanceId, playerId: PlayerId): CardPlayedPayload {
  return {
    cardId,
    cardType: "action",
    costType: "free",
    playerId,
  };
}

function createContext(args: {
  zoneCards: Record<string, CardInstanceId[]>;
  shuffle?: (cards: CardInstanceId[]) => CardInstanceId[];
}) {
  const zoneCards = args.zoneCards;
  const cardIndex: Record<string, { ownerID: PlayerId; zoneKey: string }> = {};

  for (const [zoneKey, cards] of Object.entries(zoneCards)) {
    const [, ownerSegment] = zoneKey.split(":");
    const ownerId = (ownerSegment ?? PLAYER_ONE) as PlayerId;
    for (const cardId of cards) {
      cardIndex[cardId] = {
        ownerID: ownerId,
        zoneKey,
      };
    }
  }

  const moveCalls: Array<{ cardId: CardInstanceId; zone: string; playerId: PlayerId }> = [];
  const ctx = {
    G: {
      pendingEffects: [],
    },
    playerId: PLAYER_ONE,
    cards: {
      require: (cardId: CardInstanceId) => ({
        definition: { id: cardId, cardType: "action" },
        meta: {},
      }),
      getDefinition: () => ({ cardType: "action" }),
    },
    framework: {
      random: {
        shuffle: (cards: CardInstanceId[]) => args.shuffle?.(cards) ?? cards,
      },
      state: {
        currentPlayer: PLAYER_ONE,
        playerIds: [PLAYER_ONE, PLAYER_TWO],
        ctx: {
          priority: { holder: PLAYER_ONE },
          status: { turn: 1 },
          zones: {
            private: {
              cardIndex,
              cardMeta: {},
              zoneCards,
            },
          },
        },
      },
      zones: {
        getCards: ({ zone, playerId }: { zone: string; playerId: PlayerId }) => [
          ...(zoneCards[`${zone}:${playerId}`] ?? []),
        ],
        moveCard: (cardId: CardInstanceId, to: { zone: string; playerId: PlayerId }) => {
          moveCalls.push({
            cardId,
            playerId: to.playerId,
            zone: to.zone,
          });

          const currentZoneKey = cardIndex[cardId]?.zoneKey;
          if (currentZoneKey) {
            zoneCards[currentZoneKey] = (zoneCards[currentZoneKey] ?? []).filter(
              (existingId) => existingId !== cardId,
            );
          }

          const nextZoneKey = `${to.zone}:${to.playerId}`;
          zoneCards[nextZoneKey] = [...(zoneCards[nextZoneKey] ?? []), cardId];
          cardIndex[cardId] = {
            ownerID: to.playerId,
            zoneKey: nextZoneKey,
          };
        },
      },
    },
  } as unknown as PlayCardExecutionContext;

  return { ctx, moveCalls, zoneCards };
}

describe("return-random-from-inkwell effect", () => {
  it("returns a fixed number of random inkwell cards to the targeted player's hand", () => {
    const cardA = "ink-a" as CardInstanceId;
    const cardB = "ink-b" as CardInstanceId;
    const cardC = "ink-c" as CardInstanceId;
    const { ctx, moveCalls, zoneCards } = createContext({
      zoneCards: {
        [`inkwell:${PLAYER_ONE}`]: [cardA, cardB, cardC],
        [`hand:${PLAYER_ONE}`]: [],
      },
      shuffle: (cards) => [...cards].reverse(),
    });

    resolveReturnRandomFromInkwellEffect(
      ctx,
      createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
      {
        type: "return-random-from-inkwell",
        count: 2,
      },
      {},
      {
        returnCount: 2,
      },
    );

    expect(moveCalls).toEqual([
      { cardId: cardC, zone: "hand", playerId: PLAYER_ONE },
      { cardId: cardB, zone: "hand", playerId: PLAYER_ONE },
    ]);
    expect(zoneCards[`inkwell:${PLAYER_ONE}`]).toEqual([cardA]);
    expect(zoneCards[`hand:${PLAYER_ONE}`]).toEqual([cardC, cardB]);
  });

  it("trims each player's inkwell independently when configured with leave", () => {
    const { ctx, moveCalls, zoneCards } = createContext({
      zoneCards: {
        [`inkwell:${PLAYER_ONE}`]: [
          "p1-a" as CardInstanceId,
          "p1-b" as CardInstanceId,
          "p1-c" as CardInstanceId,
          "p1-d" as CardInstanceId,
        ],
        [`inkwell:${PLAYER_TWO}`]: [
          "p2-a" as CardInstanceId,
          "p2-b" as CardInstanceId,
          "p2-c" as CardInstanceId,
          "p2-d" as CardInstanceId,
          "p2-e" as CardInstanceId,
        ],
        [`hand:${PLAYER_ONE}`]: [],
        [`hand:${PLAYER_TWO}`]: [],
      },
      shuffle: (cards) => [...cards].reverse(),
    });

    resolveReturnRandomFromInkwellEffect(
      ctx,
      createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
      {
        type: "return-random-from-inkwell",
        target: "EACH_PLAYER",
        leave: 3,
      },
      {},
    );

    expect(moveCalls).toEqual([
      { cardId: "p1-d", zone: "hand", playerId: PLAYER_ONE },
      { cardId: "p2-e", zone: "hand", playerId: PLAYER_TWO },
      { cardId: "p2-d", zone: "hand", playerId: PLAYER_TWO },
    ]);
    expect(zoneCards[`inkwell:${PLAYER_ONE}`]).toHaveLength(3);
    expect(zoneCards[`inkwell:${PLAYER_TWO}`]).toHaveLength(3);
    expect(zoneCards[`hand:${PLAYER_ONE}`]).toEqual(["p1-d"]);
    expect(zoneCards[`hand:${PLAYER_TWO}`]).toEqual(["p2-e", "p2-d"]);
  });
});
