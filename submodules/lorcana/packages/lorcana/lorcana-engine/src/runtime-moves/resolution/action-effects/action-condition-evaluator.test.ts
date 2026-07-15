import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import type { Condition } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { PlayCardExecutionContext } from "./types";
import { evaluateActionCondition } from "./action-condition-evaluator";

type TestCardDefinition = {
  id: string;
  actionSubtype?: string;
  cardType: "character" | "item" | "location" | "action";
  classifications?: string[];
  cost?: number;
  lore?: number;
  name?: string;
  strength?: number;
  willpower?: number;
};

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

function createContext(args?: {
  definitions?: Record<string, TestCardDefinition>;
  zoneCards?: Record<string, CardInstanceId[]>;
  cardMeta?: Record<string, Record<string, unknown>>;
  currentPlayer?: PlayerId;
  otp?: PlayerId;
}): PlayCardExecutionContext {
  const definitions = args?.definitions ?? {};
  const zoneCards = args?.zoneCards ?? {};
  const cardMeta = args?.cardMeta ?? {};
  const cardIndex: Record<string, { ownerID: PlayerId; zoneKey: string }> = {};

  for (const [zoneKey, cards] of Object.entries(zoneCards)) {
    const [, ownerSegment] = zoneKey.split(":");
    const owner = (ownerSegment ?? PLAYER_ONE) as PlayerId;
    for (const cardId of cards) {
      cardIndex[cardId] = { ownerID: owner, zoneKey };
    }
  }

  const currentPlayer = args?.currentPlayer ?? PLAYER_ONE;
  const zonesApi = {
    getCards: ({ zone, playerId }: { zone: string; playerId: PlayerId }) => [
      ...(zoneCards[`${zone}:${playerId}`] ?? []),
    ],
    getCardOwner: (cardId: CardInstanceId) => cardIndex[cardId]?.ownerID,
    getCardZone: (cardId: CardInstanceId) => cardIndex[cardId]?.zoneKey,
  };
  const runtimeCtx = {
    priority: { holder: currentPlayer },
    status: { otp: args?.otp, turn: 1 },
    zones: {
      private: {
        cardIndex,
        cardMeta,
        zoneCards,
      },
    },
  };
  const cardsApi = {
    get: (cardId: CardInstanceId) => {
      const definition = definitions[cardId];
      return {
        definition,
        meta: cardMeta[cardId] ?? {},
        getStrength: () => Number(definition?.strength ?? 0),
        getWillpower: () => Number(definition?.willpower ?? 0),
      };
    },
    require: (cardId: CardInstanceId) => {
      const card = {
        definition: definitions[cardId],
        meta: cardMeta[cardId] ?? {},
        getStrength: () => Number(definitions[cardId]?.strength ?? 0),
        getWillpower: () => Number(definitions[cardId]?.willpower ?? 0),
      };
      return card;
    },
    getDefinition: (cardId: CardInstanceId) => definitions[cardId],
    patchMeta: (cardId: CardInstanceId, nextMeta: Record<string, unknown>) => {
      cardMeta[cardId] = {
        ...cardMeta[cardId],
        ...nextMeta,
      };
    },
    setMeta: (cardId: CardInstanceId, nextMeta: Record<string, unknown>) => {
      cardMeta[cardId] = { ...nextMeta };
    },
    clearMeta: (cardId: CardInstanceId) => {
      delete cardMeta[cardId];
    },
    entriesMeta: () => Object.entries(cardMeta),
  };

  return {
    G: {
      lore: {
        [PLAYER_ONE]: 0,
        [PLAYER_TWO]: 0,
      },
      turnsCompletedByPlayer: {
        [PLAYER_ONE]: 0,
        [PLAYER_TWO]: 0,
      },
      turnMetadata: {
        cardsPlayedThisTurn: [],
        charactersQuesting: [],
        inkedThisTurn: [],
        shiftPlayedThisTurn: [],
        challengesByPlayerThisTurn: {},
        damagedCharactersByOwnerThisTurn: {},
        damageRemovedByPlayerThisTurn: {},
        banishedCharactersThisTurn: [],
        discardCardsLeftThisTurn: 0,
        cardsPutIntoDiscardThisTurnByOwner: {},
      },
    },
    playerId: currentPlayer,

    cards: cardsApi,
    framework: {
      cards: cardsApi,
      state: {
        priority: runtimeCtx.priority as never,
        status: runtimeCtx.status as never,
        _zonesPrivate: runtimeCtx.zones?.private as never,
        playerIds: [PLAYER_ONE, PLAYER_TWO],
        turn: 1,
        currentPlayer,
        phase: undefined,
        step: undefined,
        gameSegment: undefined,
        stateID: 0,
        matchID: "test-match",
        gameID: "test-game",
        gameEnded: false,
      },
      time: {
        getRemainingTime: () => 0,
      },
      zones: zonesApi as never,
    },
  } as unknown as PlayCardExecutionContext;
}

describe("action-condition-evaluator", () => {
  it("evaluates target-query conditions", () => {
    const source = "source" as CardInstanceId;
    const handOne = "hand-1" as CardInstanceId;
    const handTwo = "hand-2" as CardInstanceId;
    const handThree = "hand-3" as CardInstanceId;

    const ctx = createContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [handOne]: { id: "hand-1", cardType: "action" },
        [handTwo]: { id: "hand-2", cardType: "action" },
        [handThree]: { id: "hand-3", cardType: "action" },
      },
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: [handOne, handTwo, handThree],
      },
    });

    const condition: Condition = {
      type: "target-query",
      query: {
        selector: "all",
        owner: "you",
        zones: ["hand"],
      },
      comparison: { operator: "gte", value: 3 },
    };

    expect(
      evaluateActionCondition(condition, ctx, createCardPlayedPayload(source, PLAYER_ONE), {}),
    ).toBe(true);
  });

  it("evaluates target-aggregate-comparison with empty opposing board", () => {
    const source = "source" as CardInstanceId;
    const myCharacter = "my-character" as CardInstanceId;
    const ctx = createContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [myCharacter]: { id: "my-character", cardType: "character", strength: 4 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [myCharacter],
      },
    });

    const condition: Condition = {
      type: "target-aggregate-comparison",
      left: {
        query: { selector: "all", owner: "you", zones: ["play"], cardType: "character" },
        attribute: "strength",
        aggregate: "max",
      },
      right: {
        query: { selector: "all", owner: "opponent", zones: ["play"], cardType: "character" },
        attribute: "strength",
        aggregate: "max",
      },
      comparison: "gt",
      requireLeftNonEmpty: true,
      ifRightEmpty: "pass",
    };

    expect(
      evaluateActionCondition(condition, ctx, createCardPlayedPayload(source, PLAYER_ONE), {}),
    ).toBe(true);
  });

  it("evaluates migrated previously-unsupported turn metrics", () => {
    const source = "source" as CardInstanceId;
    const ctx = createContext({
      definitions: {
        [source]: { id: "source", cardType: "character" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source],
      },
      cardMeta: {
        [source]: { state: "exerted" },
      },
    });

    ctx.G.turnMetadata.challengesByPlayerThisTurn[PLAYER_ONE] = 0;
    ctx.G.turnMetadata.banishedCharactersThisTurn = ["banished-character" as CardInstanceId];
    ctx.G.turnMetadata.damagedCharactersByOwnerThisTurn[PLAYER_TWO] = 1;
    ctx.G.turnMetadata.discardCardsLeftThisTurn = 1;

    const challengedNone: Condition = {
      type: "turn-metric",
      metric: "challenges-by-player",
      playerScope: "you",
      comparison: { operator: "eq", value: 0 },
    };
    const banished: Condition = {
      type: "turn-metric",
      metric: "banished-characters",
      comparison: { operator: "gte", value: 1 },
    };
    const opposingDamaged: Condition = {
      type: "turn-metric",
      metric: "damaged-characters-by-owner",
      ownerScope: "opponent",
      comparison: { operator: "gte", value: 1 },
    };
    const discardLeft: Condition = {
      type: "turn-metric",
      metric: "discard-cards-left",
      comparison: { operator: "gte", value: 1 },
    };

    expect(
      evaluateActionCondition(challengedNone, ctx, createCardPlayedPayload(source, PLAYER_ONE), {}),
    ).toBe(true);
    expect(
      evaluateActionCondition(banished, ctx, createCardPlayedPayload(source, PLAYER_ONE), {}),
    ).toBe(true);
    expect(
      evaluateActionCondition(
        opposingDamaged,
        ctx,
        createCardPlayedPayload(source, PLAYER_ONE),
        {},
      ),
    ).toBe(true);
    expect(
      evaluateActionCondition(discardLeft, ctx, createCardPlayedPayload(source, PLAYER_ONE), {}),
    ).toBe(true);
  });

  it("evaluates first-turn-non-otp condition", () => {
    const source = "source" as CardInstanceId;
    const ctx = createContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
      },
      otp: PLAYER_ONE,
      currentPlayer: PLAYER_TWO,
    });

    ctx.G.turnsCompletedByPlayer[PLAYER_TWO] = 0;

    expect(
      evaluateActionCondition(
        { type: "first-turn-non-otp" },
        ctx,
        createCardPlayedPayload(source, PLAYER_TWO),
        {},
      ),
    ).toBe(true);
  });

  it("evaluates play-context singer count and logical composition", () => {
    const source = "source" as CardInstanceId;
    const ctx = createContext({
      definitions: {
        [source]: { id: "source", cardType: "character" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source],
      },
      cardMeta: {
        [source]: { state: "exerted" },
      },
    });
    ctx.G.turnMetadata.challengesByPlayerThisTurn[PLAYER_ONE] = 0;

    const singerCondition: Condition = {
      type: "play-context",
      context: "characters-sang-this-song",
      comparison: { operator: "gte", value: 2 },
    };

    const exertedAndNoChallenge: Condition = {
      type: "and",
      conditions: [
        {
          type: "target-query",
          query: {
            selector: "all",
            reference: "source",
            filters: [{ type: "exerted" }],
          },
          comparison: { operator: "gte", value: 1 },
        },
        {
          type: "turn-metric",
          metric: "challenges-by-player",
          playerScope: "you",
          comparison: { operator: "eq", value: 0 },
        },
      ],
    };

    expect(
      evaluateActionCondition(
        singerCondition,
        ctx,
        {
          ...createCardPlayedPayload(source, PLAYER_ONE),
          singerIds: ["s1" as CardInstanceId, "s2" as CardInstanceId],
        },
        {},
      ),
    ).toBe(true);

    expect(
      evaluateActionCondition(
        exertedAndNoChallenge,
        ctx,
        createCardPlayedPayload(source, PLAYER_ONE),
        {},
      ),
    ).toBe(true);
  });

  it("evaluates resource-count conditions for cards in hand", () => {
    const source = "source" as CardInstanceId;
    const handOne = "hand-1" as CardInstanceId;
    const handTwo = "hand-2" as CardInstanceId;
    const handThree = "hand-3" as CardInstanceId;
    const ctx = createContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [handOne]: { id: "hand-1", cardType: "action" },
        [handTwo]: { id: "hand-2", cardType: "action" },
        [handThree]: { id: "hand-3", cardType: "action" },
      },
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: [handOne, handTwo],
        [`hand:${PLAYER_TWO}`]: [handThree],
      },
    });

    expect(
      evaluateActionCondition(
        {
          type: "resource-count",
          controller: "you",
          what: "cards-in-hand",
          comparison: "greater-or-equal",
          value: 2,
        },
        ctx,
        createCardPlayedPayload(source, PLAYER_ONE),
        {},
      ),
    ).toBe(true);

    expect(
      evaluateActionCondition(
        {
          type: "resource-count",
          controller: "opponent",
          what: "cards-in-hand",
          comparison: "equal",
          value: 1,
        },
        ctx,
        createCardPlayedPayload(source, PLAYER_ONE),
        {},
      ),
    ).toBe(true);
  });

  it("evaluates has-item-count and has-location-count conditions", () => {
    const source = "source" as CardInstanceId;
    const myItem = "my-item" as CardInstanceId;
    const myLocation = "my-location" as CardInstanceId;
    const opponentLocation = "opponent-location" as CardInstanceId;
    const ctx = createContext({
      definitions: {
        [source]: { id: "source", cardType: "character" },
        [myItem]: { id: "my-item", cardType: "item" },
        [myLocation]: { id: "my-location", cardType: "location" },
        [opponentLocation]: { id: "opponent-location", cardType: "location" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source, myItem, myLocation],
        [`play:${PLAYER_TWO}`]: [opponentLocation],
      },
    });

    expect(
      evaluateActionCondition(
        {
          type: "has-item-count",
          controller: "you",
          comparison: "greater-or-equal",
          count: 1,
        },
        ctx,
        createCardPlayedPayload(source, PLAYER_ONE),
        {},
      ),
    ).toBe(true);

    expect(
      evaluateActionCondition(
        {
          type: "has-location-count",
          controller: "you",
          comparison: "greater-or-equal",
          count: 2,
        },
        ctx,
        createCardPlayedPayload(source, PLAYER_ONE),
        {},
      ),
    ).toBe(false);

    expect(
      evaluateActionCondition(
        {
          type: "has-location-count",
          controller: "opponent",
          comparison: "equal",
          count: 1,
        },
        ctx,
        createCardPlayedPayload(source, PLAYER_ONE),
        {},
      ),
    ).toBe(true);
  });

  it("evaluates if-you-do from the prior effect outcome in the event snapshot", () => {
    const source = "source" as CardInstanceId;
    const ctx = createContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
      },
    });

    expect(
      evaluateActionCondition(
        { type: "if-you-do" },
        ctx,
        createCardPlayedPayload(source, PLAYER_ONE),
        {
          eventSnapshot: { lastEffectPerformed: true },
        },
      ),
    ).toBe(true);

    expect(
      evaluateActionCondition(
        { type: "if-you-do" },
        ctx,
        createCardPlayedPayload(source, PLAYER_ONE),
        {
          eventSnapshot: { lastEffectPerformed: false },
        },
      ),
    ).toBe(false);
  });
});
