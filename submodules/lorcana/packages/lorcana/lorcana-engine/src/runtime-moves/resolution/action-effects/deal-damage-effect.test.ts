import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import { addTemporaryKeyword } from "../../effects/temporary-effects";
import { resolveDealDamageEffect, resolvePutDamageLikeEffect } from "./deal-damage-effect";
import type { PlayCardExecutionContext } from "./types";

const PLAYER_ONE = "player-one" as PlayerId;

function createTestContext(args?: {
  turn?: number;
  definitions?: Record<string, Record<string, unknown>>;
  cardMeta?: Record<string, Record<string, unknown>>;
  zoneCards?: Record<string, CardInstanceId[]>;
}): PlayCardExecutionContext {
  const definitions = args?.definitions ?? {};
  const cardMeta = args?.cardMeta ?? {};
  const zoneCards = args?.zoneCards ?? {};
  const cardIndex: Record<string, { ownerID: PlayerId; controllerID: PlayerId; zoneKey: string }> =
    {};

  for (const [zoneKey, cards] of Object.entries(zoneCards)) {
    const [, ownerSegment] = zoneKey.split(":");
    const ownerId = (ownerSegment ?? PLAYER_ONE) as PlayerId;
    for (const cardId of cards) {
      cardIndex[cardId] = { ownerID: ownerId, controllerID: ownerId, zoneKey };
    }
  }

  const cardsApi = {
    get: (cardId: CardInstanceId) => ({
      definition: definitions[cardId],
      meta: cardMeta[cardId] ?? {},
      ownerID: cardIndex[cardId]?.ownerID ?? PLAYER_ONE,
      controllerID: cardIndex[cardId]?.ownerID ?? PLAYER_ONE,
      zoneID: cardIndex[cardId]?.zoneKey,
    }),
    require: (cardId: CardInstanceId) => ({
      definition: definitions[cardId],
      meta: cardMeta[cardId] ?? {},
      ownerID: cardIndex[cardId]?.ownerID ?? PLAYER_ONE,
      controllerID: cardIndex[cardId]?.ownerID ?? PLAYER_ONE,
      zoneID: cardIndex[cardId]?.zoneKey,
    }),
    getDefinition: (cardId: CardInstanceId) => definitions[cardId],
    getMeta: (cardId: CardInstanceId | string) => cardMeta[String(cardId)] ?? {},
    setMeta: (cardId: CardInstanceId | string, nextMeta: Record<string, unknown>) => {
      cardMeta[String(cardId)] = nextMeta;
    },
    patchMeta: (cardId: CardInstanceId, nextMeta: Record<string, unknown>) => {
      cardMeta[cardId] = { ...cardMeta[cardId], ...nextMeta };
    },
    clearMeta: (cardId: CardInstanceId | string) => {
      delete cardMeta[String(cardId)];
    },
  };

  return {
    G: {
      lore: {
        [PLAYER_ONE]: 0,
      },
      pendingEffects: [],
    },
    playerId: PLAYER_ONE,

    cards: cardsApi,
    framework: {
      cards: cardsApi,
      events: {
        emit: () => undefined,
      },
      zones: {
        moveCard: (
          cardId: CardInstanceId | string,
          destination: { zone: string; playerId?: PlayerId },
        ) => {
          const currentEntry = cardIndex[String(cardId)];
          if (currentEntry) {
            currentEntry.zoneKey = `${destination.zone}:${destination.playerId ?? PLAYER_ONE}`;
          }
        },
        getCardOwner: (cardId: string) => cardIndex[cardId]?.ownerID,
        getCardController: (cardId: string) => cardIndex[cardId]?.controllerID,
        getCardZone: (cardId: string) => cardIndex[cardId]?.zoneKey,
      },
      state: {
        status: { turn: args?.turn ?? 1 },
        priority: {
          holder: PLAYER_ONE,
        },
        _zonesPrivate: {
          cardIndex,
          zoneCards,
          cardMeta,
        },
      },
    },
  } as unknown as PlayCardExecutionContext;
}

describe("deal-damage-effect", () => {
  it("reduces direct damage by temporary Resist on locations", () => {
    const locationId = "location" as CardInstanceId;
    const sourceId = "source" as CardInstanceId;
    const ctx = createTestContext({
      turn: 1,
      definitions: {
        [locationId]: {
          id: "location",
          cardType: "location",
          willpower: 7,
          abilities: [],
        },
      },
      cardMeta: {
        [locationId]: addTemporaryKeyword(
          { damage: 0, state: "ready" } as never,
          "Resist",
          2,
          2,
          1,
        ) as unknown as Record<string, unknown>,
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [locationId],
      },
    });

    resolveDealDamageEffect(
      ctx,
      {
        cardId: sourceId,
        cardType: "action",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      { type: "deal-damage", amount: 4 },
      {
        targets: [locationId],
        amountByTarget: {
          [locationId]: 4,
        },
      },
    );

    expect(ctx.cards.require(locationId).meta.damage).toBe(2);
  });

  it("reduces direct damage by stacked static and temporary Resist", () => {
    const sourceId = "source" as CardInstanceId;
    const targetId = "target" as CardInstanceId;
    const auraId = "aura" as CardInstanceId;
    const ctx = createTestContext({
      turn: 1,
      definitions: {
        [targetId]: {
          id: "target",
          cardType: "character",
          strength: 2,
          willpower: 5,
          abilities: [{ type: "keyword", keyword: "Resist", value: 1 }],
        },
        [auraId]: {
          id: "aura",
          cardType: "character",
          strength: 1,
          willpower: 3,
          abilities: [
            {
              type: "static",
              effect: {
                type: "gain-keyword",
                keyword: "Resist",
                value: 1,
                target: {
                  selector: "all",
                  owner: "you",
                  zones: ["play"],
                  cardTypes: ["character"],
                  excludeSelf: true,
                },
              },
            },
          ],
        },
      },
      cardMeta: {
        [targetId]: addTemporaryKeyword(
          { damage: 0, state: "ready" } as never,
          "Resist",
          2,
          1,
          1,
        ) as unknown as Record<string, unknown>,
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [targetId, auraId],
      },
    });

    resolveDealDamageEffect(
      ctx,
      {
        cardId: sourceId,
        cardType: "action",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      { type: "deal-damage", amount: 3 },
      {
        targets: [targetId],
        amountByTarget: {
          [targetId]: 3,
        },
      },
    );

    expect(ctx.cards.require(targetId).meta.damage).toBe(0);
  });

  it("stops reducing damage after the temporary Resist expires", () => {
    const locationId = "location" as CardInstanceId;
    const sourceId = "source" as CardInstanceId;
    const ctx = createTestContext({
      turn: 3,
      definitions: {
        [locationId]: {
          id: "location",
          cardType: "location",
          willpower: 7,
          abilities: [],
        },
      },
      cardMeta: {
        [locationId]: addTemporaryKeyword(
          { damage: 0, state: "ready" } as never,
          "Resist",
          2,
          2,
          1,
        ) as unknown as Record<string, unknown>,
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [locationId],
      },
    });

    resolveDealDamageEffect(
      ctx,
      {
        cardId: sourceId,
        cardType: "action",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      { type: "deal-damage", amount: 4 },
      {
        targets: [locationId],
        amountByTarget: {
          [locationId]: 4,
        },
      },
    );

    expect(ctx.cards.require(locationId).meta.damage).toBe(4);
  });

  it("captures the target's location in the banish trigger snapshot for lethal damage", () => {
    const locationId = "location" as CardInstanceId;
    const characterId = "character" as CardInstanceId;
    const sourceId = "source" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [characterId]: {
          id: "character",
          cardType: "character",
          strength: 1,
          willpower: 2,
          abilities: [],
        },
      },
      cardMeta: {
        [characterId]: {
          damage: 0,
          atLocationId: locationId,
        },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [characterId],
      },
    });

    resolveDealDamageEffect(
      ctx,
      {
        cardId: sourceId,
        cardType: "action",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      { type: "deal-damage", amount: 2 },
      {
        targets: [characterId],
        amountByTarget: {
          [characterId]: 2,
        },
      },
    );

    expect(ctx.G.triggeredAbilities?.pendingEvents).toHaveLength(3);
    // First event: "damage" trigger for the lethal damage dealt
    expect(ctx.G.triggeredAbilities?.pendingEvents[0]?.event).toBe("damage");
    // Second event: "deal-damage" trigger for the source dealing damage
    expect(ctx.G.triggeredAbilities?.pendingEvents[1]?.event).toBe("deal-damage");
    // Third event: "banish" trigger for the card being banished
    const banishEvent = ctx.G.triggeredAbilities?.pendingEvents[2];
    expect(banishEvent?.event).toBe("banish");
    expect(banishEvent?.eventSnapshot?.subjectAtLocationId).toBe(locationId);
  });

  it("does not apply Resist when damage is put onto a card", () => {
    const sourceId = "source" as CardInstanceId;
    const targetId = "target" as CardInstanceId;
    const ctx = createTestContext({
      turn: 1,
      definitions: {
        [targetId]: {
          id: "target",
          cardType: "character",
          strength: 2,
          willpower: 5,
          abilities: [{ type: "keyword", keyword: "Resist", value: 1 }],
        },
      },
      cardMeta: {
        [targetId]: addTemporaryKeyword(
          { damage: 0, state: "ready" } as never,
          "Resist",
          2,
          2,
          1,
        ) as unknown as Record<string, unknown>,
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [targetId],
      },
    });

    resolvePutDamageLikeEffect(
      ctx,
      {
        cardId: sourceId,
        cardType: "action",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      {
        targets: [targetId],
        amountByTarget: {
          [targetId]: 1,
        },
      },
    );

    expect(ctx.cards.require(targetId).meta.damage).toBe(1);
    expect(ctx.G.triggeredAbilities?.pendingEvents).toHaveLength(1);
    expect(ctx.G.triggeredAbilities?.pendingEvents[0]?.event).toBe("damage");
  });
});
