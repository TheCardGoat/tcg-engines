import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import type { CardPlayedPayload } from "../../../../types";
import type { PlayCardExecutionContext } from "../types";
import { resolveScryEffect } from "../scry-effect";

const PLAYER_ONE = "player-one" as PlayerId;

function createCardPlayedPayload(cardId: CardInstanceId, playerId: PlayerId): CardPlayedPayload {
  return {
    cardId,
    cardType: "action",
    costType: "free",
    playerId,
  };
}

function createScryTestContext(args: { zoneCards: Record<string, CardInstanceId[]> }): {
  ctx: PlayCardExecutionContext;
  emittedEvents: Array<{ kind: string; customType: string; data: Record<string, unknown> }>;
} {
  const zoneCards = args.zoneCards;
  const cardIndex: Record<string, { ownerID: PlayerId; zoneKey: string }> = {};

  for (const [zoneKey, cards] of Object.entries(zoneCards)) {
    const [, ownerSegment] = zoneKey.split(":");
    const owner = (ownerSegment ?? PLAYER_ONE) as PlayerId;
    for (const cardId of cards) {
      cardIndex[cardId] = { ownerID: owner, zoneKey };
    }
  }

  const emittedEvents: Array<{ kind: string; customType: string; data: Record<string, unknown> }> =
    [];

  const zonesApi = {
    drawCards: () => {},
    getCards: ({ zone, playerId }: { zone: string; playerId: PlayerId }): CardInstanceId[] => {
      return [...(zoneCards[`${zone}:${playerId}`] ?? [])];
    },
    reveal: (cards: CardInstanceId[]) => {
      void cards;
      return "reveal-id";
    },
    moveCard: (cardId: CardInstanceId, to: { playerId: PlayerId; zone: string }) => {
      const fromZone = cardIndex[cardId]?.zoneKey;
      if (fromZone && zoneCards[fromZone]) {
        zoneCards[fromZone] = zoneCards[fromZone]!.filter((id) => id !== cardId);
      }
      const toZoneKey = `${to.zone}:${to.playerId}`;
      zoneCards[toZoneKey] = [...(zoneCards[toZoneKey] ?? []), cardId];
      cardIndex[cardId] = { ownerID: to.playerId, zoneKey: toZoneKey };
    },
    shuffle: () => {},
    getCardOwner: (cardId: CardInstanceId) => cardIndex[cardId]?.ownerID,
    getCardController: (cardId: CardInstanceId) => cardIndex[cardId]?.ownerID,
    getCardZone: (cardId: CardInstanceId) => cardIndex[cardId]?.zoneKey,
    clearReveal: () => {},
  };

  const cardsApi = {
    get: () => undefined,
    require: () => ({ definition: {}, meta: {} }),
    getDefinition: () => undefined,
    getMeta: () => ({}),
    patchMeta: () => {},
    setMeta: () => {},
    clearMeta: () => {},
    entriesMeta: () => [],
  };

  const ctx = {
    G: {
      lore: { [PLAYER_ONE]: 0 },
      pendingEffects: [],
      turnMetadata: {
        cardsPlayedThisTurn: [],
        charactersQuesting: [],
        inkedThisTurn: [],
        cardsPutIntoInkwellThisTurn: [],
        additionalInkwellActions: 0,
        shiftPlayedThisTurn: [],
        challengesByPlayerThisTurn: {},
        damagedCharactersByOwnerThisTurn: {},
        damageRemovedByPlayerThisTurn: {},
      },
      triggeredAbilities: { bag: { items: [] }, pendingEvents: [] },
    },
    playerId: PLAYER_ONE,
    cards: cardsApi,
    framework: {
      cards: cardsApi,
      events: {
        emit: (event: Record<string, unknown>) => {
          emittedEvents.push({
            kind: String(event.kind),
            customType: String(event.customType),
            data: (event.data as Record<string, unknown>) ?? {},
          });
        },
      },
      log: () => {},
      state: {
        priority: { holder: PLAYER_ONE },
        status: { turn: 1 },
        _zonesPrivate: { zoneCards, cardIndex },
        playerIds: [PLAYER_ONE],
        turn: 1,
        currentPlayer: PLAYER_ONE,
        phase: undefined,
        step: undefined,
        gameSegment: undefined,
        stateID: 0,
        matchID: "test-match",
        gameID: "test-game",
        gameEnded: false,
      },
      time: { getRemainingTime: () => 0 },
      zones: zonesApi as never,
    },
    events: {},
  } as unknown as PlayCardExecutionContext;

  return { ctx, emittedEvents };
}

describe("scry", () => {
  it("emits cardInked as private when routing a deck card to inkwell facedown", () => {
    const lookedAtCard = "looked-at-card" as CardInstanceId;
    const { ctx, emittedEvents } = createScryTestContext({
      zoneCards: {
        [`deck:${PLAYER_ONE}`]: [lookedAtCard],
      },
    });

    resolveScryEffect(
      ctx,
      createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
      {
        type: "scry",
        amount: 1,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "inkwell",
            min: 1,
            max: 1,
            facedown: true,
          },
        ],
      },
      {
        scryAmount: 1,
        destinations: [{ zone: "inkwell", cards: [lookedAtCard] }],
      },
    );

    const cardInkedEvent = emittedEvents.find((e) => e.customType === "cardInked");
    expect(cardInkedEvent).toBeDefined();
    expect(cardInkedEvent?.data.private).toBe(true);
  });

  it("emits cardInked as public when routing a deck card to inkwell face-up", () => {
    const lookedAtCard = "looked-at-card" as CardInstanceId;
    const { ctx, emittedEvents } = createScryTestContext({
      zoneCards: {
        [`deck:${PLAYER_ONE}`]: [lookedAtCard],
      },
    });

    resolveScryEffect(
      ctx,
      createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
      {
        type: "scry",
        amount: 1,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "inkwell",
            min: 1,
            max: 1,
            facedown: false,
          },
        ],
      },
      {
        scryAmount: 1,
        destinations: [{ zone: "inkwell", cards: [lookedAtCard] }],
      },
    );

    const cardInkedEvent = emittedEvents.find((e) => e.customType === "cardInked");
    expect(cardInkedEvent).toBeDefined();
    expect(cardInkedEvent?.data.private).toBe(false);
  });
});
