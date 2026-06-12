import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import type { VariableAmount } from "@tcg/lorcana-types";
import type { PlayCardExecutionContext } from "../../resolution/action-effects/types";
import { resolveVariableAmount } from "./resolve-variable-amount";

type TestCardDefinition = {
  id: string;
  cardType: "character" | "item" | "location" | "action";
  strength?: number;
  willpower?: number;
  lore?: number;
  cost?: number;
  classifications?: string[];
  name?: string;
};

const PLAYER_ONE = "player-one" as PlayerId;
const PLAYER_TWO = "player-two" as PlayerId;

function createTestContext(args?: {
  definitions?: Record<string, TestCardDefinition>;
  zoneCards?: Record<string, CardInstanceId[]>;
  cardMeta?: Record<string, Record<string, unknown>>;
  lore?: Partial<Record<PlayerId, number>>;
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
      getStrength: () => Number(definitions[cardId]?.strength ?? 0),
    }),
    require: (cardId: CardInstanceId) => ({
      definition: definitions[cardId],
      meta: cardMeta[cardId] ?? {},
      getStrength: () => Number(definitions[cardId]?.strength ?? 0),
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
        [PLAYER_ONE]: args?.lore?.[PLAYER_ONE] ?? 0,
        [PLAYER_TWO]: args?.lore?.[PLAYER_TWO] ?? 0,
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

describe("resolveVariableAmount", () => {
  it("resolves target-attribute in per-target mode", () => {
    const targetOne = "target-one" as CardInstanceId;
    const targetTwo = "target-two" as CardInstanceId;

    const ctx = createTestContext({
      cardMeta: {
        [targetOne]: { damage: 2 },
        [targetTwo]: { damage: 5 },
      },
    });

    const amount: VariableAmount = {
      type: "target-attribute",
      attribute: "damage",
    };

    const resolved = resolveVariableAmount(amount, {
      controllerId: PLAYER_ONE,
      ctx,
      targets: [targetOne, targetTwo],
    });

    expect(resolved.mode).toBe("per-target");
    expect(resolved.perTarget).toEqual({
      [targetOne]: 2,
      [targetTwo]: 5,
    });
  });

  it("supports filtered-count with excludeSelf and multiplier", () => {
    const source = "source" as CardInstanceId;
    const damagedOther = "damaged-other" as CardInstanceId;
    const readyOther = "ready-other" as CardInstanceId;

    const ctx = createTestContext({
      cardMeta: {
        [source]: { damage: 1 },
        [damagedOther]: { damage: 3 },
        [readyOther]: { damage: 0 },
      },
      definitions: {
        [source]: { id: "source", cardType: "character", strength: 1, willpower: 1 },
        [damagedOther]: { id: "damaged-other", cardType: "character", strength: 1, willpower: 1 },
        [readyOther]: { id: "ready-other", cardType: "character", strength: 1, willpower: 1 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source, damagedOther, readyOther],
      },
    });

    const amount: VariableAmount = {
      type: "filtered-count",
      excludeSelf: true,
      filters: [{ type: "status", status: "damaged" }],
      multiplier: 2,
      owner: "you",
      zones: ["play"],
    };

    const resolved = resolveVariableAmount(amount, {
      ctx,
      sourceId: source,
    });

    expect(resolved).toEqual({ mode: "aggregate", value: 2 });
  });

  it("supports classification-character-count with excludeSelf", () => {
    const source = "source" as CardInstanceId;
    const allyVillain = "ally-villain" as CardInstanceId;
    const allyHero = "ally-hero" as CardInstanceId;

    const ctx = createTestContext({
      definitions: {
        [source]: {
          id: "source",
          cardType: "character",
          classifications: ["Storyborn", "Villain"],
        },
        [allyVillain]: {
          id: "ally-villain",
          cardType: "character",
          classifications: ["Dreamborn", "Villain"],
        },
        [allyHero]: {
          id: "ally-hero",
          cardType: "character",
          classifications: ["Storyborn", "Hero"],
        },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source, allyVillain, allyHero],
      },
    });

    const amount: VariableAmount = {
      type: "classification-character-count",
      classification: "Villain",
      controller: "you",
      excludeSelf: true,
    };

    const resolved = resolveVariableAmount(amount, {
      controllerId: PLAYER_ONE,
      ctx,
      sourceId: source,
    });

    expect(resolved).toEqual({ mode: "aggregate", value: 1 });
  });

  it("resolves difference and invert semantics", () => {
    const ctx = createTestContext({
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: [
          "a" as CardInstanceId,
          "b" as CardInstanceId,
          "c" as CardInstanceId,
        ],
        [`hand:${PLAYER_TWO}`]: ["x" as CardInstanceId],
      },
    });

    const amount: VariableAmount = {
      type: "difference",
      left: { type: "cards-in-hand", controller: "you" },
      right: { type: "cards-in-hand", controller: "opponent" },
      invert: true,
    };

    const resolved = resolveVariableAmount(amount, {
      controllerId: PLAYER_ONE,
      ctx,
    });

    expect(resolved).toEqual({ mode: "aggregate", value: -2 });
  });

  it("resolves trigger-target-attribute from event snapshot", () => {
    const ctx = createTestContext();

    const amount: VariableAmount = {
      type: "trigger-target-attribute",
      attribute: "strength-before-banish",
    };

    const resolved = resolveVariableAmount(amount, {
      ctx,
      eventSnapshot: {
        strengthBeforeBanish: 6,
      },
    });

    expect(resolved).toEqual({ mode: "aggregate", value: 6 });
  });

  it("resolves damage-removed counters from the event snapshot", () => {
    const ctx = createTestContext();

    const amount: VariableAmount = {
      type: "for-each",
      counter: {
        type: "damage-removed",
      },
    };

    const resolved = resolveVariableAmount(amount, {
      ctx,
      eventSnapshot: {
        healedAmount: 3,
      },
    });

    expect(resolved).toEqual({ mode: "aggregate", value: 3 });
  });

  it("uses rules-effective 0 for negative strength and lore values", () => {
    const target = "negative-target" as CardInstanceId;
    const ctx = createTestContext({
      definitions: {
        [target]: {
          id: "negative-target",
          cardType: "character",
          strength: -1,
          lore: -2,
          willpower: 3,
        },
      },
      zoneCards: {
        [`play:${PLAYER_TWO}`]: [target],
      },
    });

    expect(
      resolveVariableAmount(
        {
          type: "strength-of",
          target: {
            selector: "all",
            count: "all",
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        {
          controllerId: PLAYER_ONE,
          ctx,
          targets: [target],
        },
      ),
    ).toEqual({
      mode: "per-target",
      perTarget: {
        [target]: 0,
      },
    });

    expect(
      resolveVariableAmount(
        {
          type: "lore-value-of",
          target: {
            selector: "all",
            count: "all",
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        {
          controllerId: PLAYER_ONE,
          ctx,
          targets: [target],
        },
      ),
    ).toEqual({
      mode: "per-target",
      perTarget: {
        [target]: 0,
      },
    });
  });

  it("applies clamp bounds", () => {
    const source = "source" as CardInstanceId;
    const ctx = createTestContext({
      cardMeta: {
        [source]: { damage: 7 },
      },
    });

    const amount: VariableAmount = {
      type: "clamp",
      max: 4,
      min: 2,
      value: {
        type: "source-attribute",
        attribute: "damage",
      },
    };

    const resolved = resolveVariableAmount(amount, {
      ctx,
      sourceId: source,
    });

    expect(resolved).toEqual({ mode: "aggregate", value: 4 });
  });

  it("resolves for-each exerted-characters for the controller", () => {
    const readyCharacter = "ready-character" as CardInstanceId;
    const exertedOne = "exerted-one" as CardInstanceId;
    const exertedTwo = "exerted-two" as CardInstanceId;
    const opponentExerted = "opponent-exerted" as CardInstanceId;

    const ctx = createTestContext({
      cardMeta: {
        [readyCharacter]: { state: "ready" },
        [exertedOne]: { state: "exerted" },
        [exertedTwo]: { state: "exerted" },
        [opponentExerted]: { state: "exerted" },
      },
      definitions: {
        [readyCharacter]: { id: "ready-character", cardType: "character" },
        [exertedOne]: { id: "exerted-one", cardType: "character" },
        [exertedTwo]: { id: "exerted-two", cardType: "character" },
        [opponentExerted]: { id: "opponent-exerted", cardType: "character" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [readyCharacter, exertedOne, exertedTwo],
        [`play:${PLAYER_TWO}`]: [opponentExerted],
      },
    });

    const amount: VariableAmount = {
      type: "for-each",
      counter: {
        controller: "you",
        type: "exerted-characters",
      },
    };

    const resolved = resolveVariableAmount(amount, {
      controllerId: PLAYER_ONE,
      ctx,
    });

    expect(resolved).toEqual({ mode: "aggregate", value: 2 });
  });
});
