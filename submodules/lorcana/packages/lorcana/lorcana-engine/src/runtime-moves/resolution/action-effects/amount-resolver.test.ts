import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import type { CardPlayedPayload } from "../../../types";
import type { DynamicAmountEventSnapshot } from "../../../types/domain-events";
import type { PlayCardExecutionContext } from "./types";
import {
  resolveAggregateFieldAmount,
  resolveEffectDynamicFields,
  resolvePerTargetFieldAmounts,
} from "./amount-resolver";

type TestCardDefinition = {
  id: string;
  cardType: "character" | "item" | "location" | "action";
  strength?: number;
  willpower?: number;
  lore?: number;
  cost?: number;
};

const PLAYER_ONE = "player-one" as PlayerId;
const PLAYER_TWO = "player-two" as PlayerId;

function createTestContext(args?: {
  definitions?: Record<string, TestCardDefinition>;
  zoneCards?: Record<string, CardInstanceId[]>;
  cardMeta?: Record<string, Record<string, unknown>>;
  currentPlayer?: PlayerId;
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
  const getCards = ({ zone, playerId }: { zone: string; playerId: PlayerId }): CardInstanceId[] => [
    ...(zoneCards[`${zone}:${playerId}`] ?? []),
  ];
  const zonesApi = {
    getCards,
    getCardOwner: (cardId: CardInstanceId) => cardIndex[cardId]?.ownerID,
    getCardZone: (cardId: CardInstanceId) => cardIndex[cardId]?.zoneKey,
  };
  const runtimeCtx = {
    priority: { holder: currentPlayer },
    status: { turn: 1 },
    zones: {
      private: {
        cardIndex,
        cardMeta,
        zoneCards,
      },
    },
  };
  const cardsApi = {
    get: (cardId: CardInstanceId) => ({
      definition: definitions[cardId],
      meta: cardMeta[cardId] ?? {},
    }),
    require: (cardId: CardInstanceId) => ({
      definition: definitions[cardId],
      meta: cardMeta[cardId] ?? {},
    }),
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

function createCardPlayedPayload(cardId: CardInstanceId, playerId: PlayerId): CardPlayedPayload {
  return {
    cardId,
    cardType: "action",
    costType: "free",
    playerId,
  };
}

describe("amount-resolver", () => {
  it("resolves string amount 'all' into per-target values", () => {
    const targetOne = "target-one" as CardInstanceId;
    const targetTwo = "target-two" as CardInstanceId;
    const ctx = createTestContext({
      cardMeta: {
        [targetOne]: { damage: 2 },
        [targetTwo]: { damage: 5 },
      },
    });

    const resolvedDynamic = resolveEffectDynamicFields(
      {
        type: "remove-damage",
        amount: "all",
      },
      {
        cardPlayed: createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
        ctx,
      },
      [targetOne, targetTwo],
    );

    expect(resolvedDynamic.amount).toEqual({
      mode: "per-target",
      perTarget: {
        [targetOne]: 2,
        [targetTwo]: 5,
      },
    });
  });

  it("throws for legacy dynamic amount objects", () => {
    const ctx = createTestContext();

    expect(() =>
      resolveEffectDynamicFields(
        {
          type: "draw",
          amount: {
            dynamic: true,
            sourceAttribute: "damage",
          },
        },
        {
          cardPlayed: createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
          ctx,
        },
      ),
    ).toThrow("Legacy dynamic amount objects");
  });

  it("resolves aggregate amount strings from event snapshot", () => {
    const ctx = createTestContext();
    const eventSnapshot: DynamicAmountEventSnapshot = {
      triggerAmount: 4,
    };

    const resolvedDynamic = resolveEffectDynamicFields(
      {
        type: "draw",
        amount: "X",
      },
      {
        cardPlayed: createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
        ctx,
        eventSnapshot,
      },
    );

    expect(resolveAggregateFieldAmount(resolvedDynamic.amount)).toBe(4);
  });

  it("projects aggregate field values across all resolved targets", () => {
    const targetOne = "target-one" as CardInstanceId;
    const targetTwo = "target-two" as CardInstanceId;
    const ctx = createTestContext();

    const resolvedDynamic = resolveEffectDynamicFields(
      {
        type: "deal-damage",
        amount: 3,
      },
      {
        cardPlayed: createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
        ctx,
      },
      [targetOne, targetTwo],
    );

    expect(resolvePerTargetFieldAmounts(resolvedDynamic.amount, [targetOne, targetTwo])).toEqual({
      [targetOne]: 3,
      [targetTwo]: 3,
    });
  });

  it("accepts an up-to amount on a registered effect type", () => {
    const ctx = createTestContext();

    const resolvedDynamic = resolveEffectDynamicFields(
      {
        type: "remove-damage",
        amount: { type: "up-to", value: 3 },
      },
      {
        cardPlayed: createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
        ctx,
      },
    );

    expect(resolveAggregateFieldAmount(resolvedDynamic.amount)).toBe(3);
  });

  it("throws when an unregistered effect type carries an up-to amount", () => {
    const ctx = createTestContext();

    expect(() =>
      resolveEffectDynamicFields(
        {
          type: "deal-damage",
          amount: { type: "up-to", value: 3 },
        },
        {
          cardPlayed: createCardPlayedPayload("source" as CardInstanceId, PLAYER_ONE),
          ctx,
        },
      ),
    ).toThrow(/not registered for up-to amount semantics/);
  });
});
