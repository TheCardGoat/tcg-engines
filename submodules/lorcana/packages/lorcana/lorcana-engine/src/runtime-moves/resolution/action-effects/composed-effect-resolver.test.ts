import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import type { CardPlayedPayload } from "../../../types";
import type { PlayCardExecutionContext } from "./types";
import { resolveActionEffect } from "./composed-effect-resolver";

type TestCardDefinition = {
  id: string;
  cardType: "character" | "item" | "location" | "action";
  name?: string;
  strength?: number;
  willpower?: number;
  lore?: number;
  cost?: number;
  abilities?: Array<Record<string, unknown>>;
};

type DrawCall = {
  from: { zone: string; playerId: PlayerId };
  to: { zone: string; playerId: PlayerId };
  count: number;
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

function createResolverTestContext(args?: {
  definitions?: Record<string, TestCardDefinition>;
  zoneCards?: Record<string, CardInstanceId[]>;
  cardMeta?: Record<string, Record<string, unknown>>;
}): {
  ctx: PlayCardExecutionContext;
  state: {
    cardMeta: Record<string, Record<string, unknown>>;
    drawCalls: DrawCall[];
    revealCalls: CardInstanceId[][];
    moveCalls: Array<{ cardId: CardInstanceId; zone: string; playerId: PlayerId }>;
  };
} {
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

  const drawCalls: DrawCall[] = [];
  const revealCalls: CardInstanceId[][] = [];
  const moveCalls: Array<{ cardId: CardInstanceId; zone: string; playerId: PlayerId }> = [];

  const getCards = ({ zone, playerId }: { zone: string; playerId: PlayerId }): CardInstanceId[] => {
    return [...(zoneCards[`${zone}:${playerId}`] ?? [])];
  };
  const runtimeCtx = {
    priority: { holder: PLAYER_ONE },
    status: { turn: 1 },
    zones: {
      private: {
        cardIndex,
        cardMeta,
        zoneCards,
      },
    },
  };
  const zonesApi = {
    drawCards: (payload: DrawCall) => {
      drawCalls.push(payload);
    },
    getCards,
    reveal: (cards: CardInstanceId[]) => {
      revealCalls.push([...cards]);
    },
    moveCard: (cardId: CardInstanceId, to: { playerId: PlayerId; zone: string }) => {
      moveCalls.push({
        cardId,
        playerId: to.playerId,
        zone: to.zone,
      });
    },
    shuffle: () => {},
    getCardOwner: (cardId: CardInstanceId) => cardIndex[cardId]?.ownerID,
    getCardController: (cardId: CardInstanceId) => cardIndex[cardId]?.ownerID,
    getCardZone: (cardId: CardInstanceId) => cardIndex[cardId]?.zoneKey,
  };
  const cardsApi = {
    get: (cardId: CardInstanceId) => {
      const definition = definitions[cardId];
      if (!definition) {
        return undefined;
      }
      return {
        definition,
        meta: cardMeta[cardId] ?? {},
        getStrength: () => definition.strength ?? 0,
        getWillpower: () => definition.willpower ?? 0,
      };
    },
    require: (cardId: CardInstanceId) => {
      const definition = definitions[cardId];
      if (!definition) {
        throw new Error(`Missing card ${String(cardId)}`);
      }
      return {
        definition,
        meta: cardMeta[cardId] ?? {},
        getStrength: () => definition.strength ?? 0,
        getWillpower: () => definition.willpower ?? 0,
      };
    },
    getDefinition: (cardId: CardInstanceId) => definitions[cardId],
    getMeta: (cardId: CardInstanceId) => cardMeta[cardId],
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

  const ctx = {
    G: {
      lore: {
        [PLAYER_ONE]: 0,
        [PLAYER_TWO]: 0,
      },
      pendingEffects: [],
      turnMetadata: {
        cardsPlayedThisTurn: [],
      },
    },
    playerId: PLAYER_ONE,

    cards: cardsApi,
    framework: {
      cards: cardsApi,
      events: {
        emit: () => {},
      },
      state: {
        priority: runtimeCtx.priority as never,
        status: runtimeCtx.status as never,
        _zonesPrivate: runtimeCtx.zones?.private as never,
        playerIds: [PLAYER_ONE, PLAYER_TWO],
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
      time: {
        getRemainingTime: () => 0,
      },
      zones: zonesApi as never,
    },
    events: {},
  } as unknown as PlayCardExecutionContext;

  return {
    ctx,
    state: {
      cardMeta,
      drawCalls,
      revealCalls,
      moveCalls,
    },
  };
}

describe("resolveActionEffect", () => {
  it("applies dispatcher-resolved per-target amounts for deal-damage", () => {
    const source = "source" as CardInstanceId;
    const targetOne = "target-one" as CardInstanceId;
    const targetTwo = "target-two" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [targetOne]: { id: "target-one", cardType: "character", strength: 2, willpower: 10 },
        [targetTwo]: { id: "target-two", cardType: "character", strength: 4, willpower: 10 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [targetOne, targetTwo],
      },
      cardMeta: {
        [targetOne]: { damage: 0 },
        [targetTwo]: { damage: 0 },
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "deal-damage",
        amount: "TARGET_STRENGTH",
        target: "YOUR_CHARACTERS",
      },
      {},
    );

    expect(state.cardMeta[targetOne]?.damage).toBe(2);
    expect(state.cardMeta[targetTwo]?.damage).toBe(4);
  });

  it("defaults draw amount to 1 when amount is unresolved", () => {
    const source = "source" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "draw",
        target: "CONTROLLER",
      },
      {},
    );

    expect(state.drawCalls).toHaveLength(1);
    expect(state.drawCalls[0]?.count).toBe(1);
  });

  it("mills the top cards of the opponent's deck", () => {
    const source = "source" as CardInstanceId;
    const opponentBottomCard = "opponent-bottom-card" as CardInstanceId;
    const opponentTopCard = "opponent-top-card" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [opponentBottomCard]: { id: "opponent-bottom-card", cardType: "action" },
        [opponentTopCard]: { id: "opponent-top-card", cardType: "action" },
      },
      zoneCards: {
        [`deck:${PLAYER_TWO}`]: [opponentBottomCard, opponentTopCard],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "mill",
        amount: 2,
        target: "OPPONENT",
      },
      {},
    );

    expect(state.moveCalls).toEqual([
      { cardId: opponentTopCard, playerId: PLAYER_TWO, zone: "discard" },
      { cardId: opponentBottomCard, playerId: PLAYER_TWO, zone: "discard" },
    ]);
  });

  it("mills the chosen player's deck", () => {
    const source = "source" as CardInstanceId;
    const chosenCard = "chosen-card" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [chosenCard]: { id: "chosen-card", cardType: "action" },
      },
      zoneCards: {
        [`deck:${PLAYER_TWO}`]: [chosenCard],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "mill",
        amount: 1,
        target: "CHOSEN_PLAYER",
      },
      {
        targets: [PLAYER_TWO],
      },
    );

    expect(state.moveCalls).toEqual([
      { cardId: chosenCard, playerId: PLAYER_TWO, zone: "discard" },
    ]);
  });

  it("mills only available cards when the deck is smaller than the amount", () => {
    const source = "source" as CardInstanceId;
    const bottomCard = "bottom-card" as CardInstanceId;
    const topCard = "top-card" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [bottomCard]: { id: "bottom-card", cardType: "action" },
        [topCard]: { id: "top-card", cardType: "action" },
      },
      zoneCards: {
        [`deck:${PLAYER_ONE}`]: [bottomCard, topCard],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "mill",
        amount: 5,
        target: "CONTROLLER",
      },
      {},
    );

    expect(state.moveCalls).toEqual([
      { cardId: topCard, playerId: PLAYER_ONE, zone: "discard" },
      { cardId: bottomCard, playerId: PLAYER_ONE, zone: "discard" },
    ]);
  });

  it("applies gain-lore to the controller by default", () => {
    const source = "source" as CardInstanceId;
    const { ctx } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "gain-lore",
        amount: 2,
      },
      {},
    );

    expect(ctx.G.lore[PLAYER_ONE]).toBe(2);
    expect(ctx.G.lore[PLAYER_TWO]).toBe(0);
  });

  it("is a no-op for scry when no amount resolves", () => {
    const source = "source" as CardInstanceId;
    const cardOne = "card-one" as CardInstanceId;
    const cardTwo = "card-two" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [cardOne]: { id: "card-one", cardType: "action" },
        [cardTwo]: { id: "card-two", cardType: "action" },
      },
      zoneCards: {
        [`deck:${PLAYER_ONE}`]: [cardOne, cardTwo],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "scry",
        destinations: [{ zone: "deck-top", remainder: true }],
      },
      {},
    );

    expect(state.revealCalls).toHaveLength(0);
    expect(state.moveCalls).toHaveLength(0);
  });

  it("applies lose-lore to an opponent and clamps at zero", () => {
    const source = "source" as CardInstanceId;
    const { ctx } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
      },
    });

    ctx.G.lore[PLAYER_TWO] = 2;

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "lose-lore",
        amount: 5,
        target: "OPPONENT",
      },
      {},
    );

    expect(ctx.G.lore[PLAYER_TWO]).toBe(0);
  });

  it("resolves for-each with damage-on-target counters and maximum cap", () => {
    const source = "source" as CardInstanceId;
    const target = "target" as CardInstanceId;
    const { ctx } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [target]: { id: "target", cardType: "character", strength: 4, willpower: 8 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [target],
      },
      cardMeta: {
        [target]: { damage: 5 },
      },
    });

    ctx.G.lore[PLAYER_TWO] = 10;

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "for-each",
        counter: { type: "damage-on-target" },
        maximum: 4,
        target: "CHOSEN_CHARACTER_OF_YOURS",
        effect: {
          type: "lose-lore",
          amount: 1,
          target: "OPPONENT",
        },
      },
      {
        targets: [target],
      },
    );

    expect(ctx.G.lore[PLAYER_TWO]).toBe(6);
  });

  it("lets a later conditional read whether the previous effect resolved", () => {
    const source = "source" as CardInstanceId;
    const target = "target" as CardInstanceId;
    const { ctx } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [target]: { id: "target", cardType: "character", strength: 2, willpower: 4 },
      },
      zoneCards: {
        [`play:${PLAYER_TWO}`]: [target],
      },
      cardMeta: {
        [target]: { damage: 0 },
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "gain-lore",
              amount: 2,
            },
          },
        ],
      },
      {},
    );

    expect(ctx.G.lore[PLAYER_ONE]).toBe(2);
  });

  it("auto-resolves ordered put-on-bottom effects when the target is all matching cards", () => {
    const source = "source" as CardInstanceId;
    const firstTarget = "first-target" as CardInstanceId;
    const secondTarget = "second-target" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [firstTarget]: { id: "first-target", cardType: "character", strength: 2, willpower: 3 },
        [secondTarget]: {
          id: "second-target",
          cardType: "character",
          strength: 2,
          willpower: 3,
        },
      },
      zoneCards: {
        [`play:${PLAYER_TWO}`]: [firstTarget, secondTarget],
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "put-on-bottom",
        ordering: "player-choice",
        orderBy: "controller",
        target: {
          selector: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      {},
    );

    expect(result.status).toBe("resolved");
    expect(ctx.G.pendingEffects).toHaveLength(0);
    expect(state.moveCalls).toEqual([
      { cardId: secondTarget, zone: "deck", playerId: PLAYER_TWO },
      { cardId: firstTarget, zone: "deck", playerId: PLAYER_TWO },
    ]);
  });

  it("preserves the provided bottom-first order for ordered put-on-bottom effects", () => {
    const source = "source" as CardInstanceId;
    const firstTarget = "first-target" as CardInstanceId;
    const secondTarget = "second-target" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [firstTarget]: { id: "first-target", cardType: "character", strength: 2, willpower: 3 },
        [secondTarget]: {
          id: "second-target",
          cardType: "character",
          strength: 2,
          willpower: 3,
        },
      },
      zoneCards: {
        [`play:${PLAYER_TWO}`]: [firstTarget, secondTarget],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "put-on-bottom",
        ordering: "player-choice",
        orderBy: "controller",
        target: {
          selector: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      {
        targets: [secondTarget, firstTarget],
      },
    );

    expect(state.moveCalls).toEqual([
      { cardId: firstTarget, zone: "deck", playerId: PLAYER_TWO },
      { cardId: secondTarget, zone: "deck", playerId: PLAYER_TWO },
    ]);
  });

  it("suspends name-a-card effects until a name is provided and stores the chosen name", () => {
    const source = "source" as CardInstanceId;
    const { ctx } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
      },
    });

    const suspended = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "name-a-card",
      },
      {},
    );

    expect(suspended.status).toBe("suspended");
    expect(ctx.framework.state.priority.pendingChoice?.type).toBe("action-effect");
    expect(ctx.G.pendingEffects).toHaveLength(1);
    expect(ctx.G.pendingEffects?.[0]).toMatchObject({
      kind: "name-card-selection",
    });
    expect(ctx.G.pendingEffects?.[0]?.selectionContext).toMatchObject({
      origin: "pending-effect",
      requestId: ctx.G.pendingEffects?.[0]?.id,
      kind: "name-card-selection",
      sourceCardId: source,
      chooserId: PLAYER_ONE,
      submitField: "namedCard",
      searchMode: "lorcana-catalog",
      currentSelection: {},
    });

    const resolutionInput = {
      eventSnapshot: {},
      namedCard: "Pete",
    };
    const resumed = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "name-a-card",
      },
      resolutionInput,
    );

    expect(resumed.status).toBe("resolved");
    expect(resolutionInput.eventSnapshot).toMatchObject({
      lastEffectPerformed: true,
      namedCardName: "Pete",
    });
  });

  it("suspends opponent-chosen target effects with an opponent-scoped selection context", () => {
    const source = "source" as CardInstanceId;
    const opposingTarget = "opposing-target" as CardInstanceId;
    const { ctx } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [opposingTarget]: {
          id: "opposing-target",
          cardType: "character",
          strength: 2,
          willpower: 3,
        },
      },
      zoneCards: {
        [`play:${PLAYER_TWO}`]: [opposingTarget],
      },
    });

    const suspended = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "exert",
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      {},
    );

    expect(suspended.status).toBe("suspended");
    expect(ctx.framework.state.priority.pendingChoice).toMatchObject({
      type: "action-effect",
      playerID: PLAYER_TWO,
    });
    expect(ctx.G.pendingEffects).toHaveLength(1);
    expect(ctx.G.pendingEffects?.[0]).toMatchObject({
      chooserId: PLAYER_TWO,
      kind: "target-selection",
    });

    const selectionContext = ctx.G.pendingEffects?.[0]?.selectionContext;
    expect(selectionContext).toMatchObject({
      origin: "pending-effect",
      requestId: ctx.G.pendingEffects?.[0]?.id,
      kind: "target-selection",
      sourceCardId: source,
      chooserId: PLAYER_TWO,
      submitField: "targets",
      currentSelection: {},
      cardCandidateIds: [opposingTarget],
      playerCandidateIds: [],
      allowedZones: ["play"],
      minSelections: 1,
      maxSelections: 1,
      ordered: false,
    });
    if (!selectionContext || selectionContext.kind !== "target-selection") {
      throw new Error("Expected a target-selection context");
    }
    expect(selectionContext.targetDsl).toEqual([
      {
        selector: "chosen",
        count: 1,
        owner: "opponent",
        zones: ["play"],
        cardTypes: ["character"],
        excludeSelf: false,
      },
    ]);
  });

  it("does not let the controller preselect a target for an opponent-chosen effect", () => {
    const source = "source" as CardInstanceId;
    const opposingTarget = "opposing-target" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [opposingTarget]: {
          id: "opposing-target",
          cardType: "character",
          strength: 2,
          willpower: 3,
        },
      },
      zoneCards: {
        [`play:${PLAYER_TWO}`]: [opposingTarget],
      },
    });

    const suspended = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "exert",
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      { targets: [opposingTarget] },
    );

    expect(suspended.status).toBe("suspended");
    expect(state.cardMeta[opposingTarget]?.state).toBeUndefined();
    expect(ctx.G.pendingEffects?.[0]).toMatchObject({
      chooserId: PLAYER_TWO,
      kind: "target-selection",
    });
    const selectionContext = ctx.G.pendingEffects?.[0]?.selectionContext;
    expect(selectionContext).toMatchObject({
      currentSelection: {},
      cardCandidateIds: [opposingTarget],
    });
  });

  it("does not suspend when repeated chosen descriptors reuse the same selected target", () => {
    const source = "source" as CardInstanceId;
    const target = "target" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [target]: { id: "target", cardType: "character", strength: 3, willpower: 5 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [target],
      },
      cardMeta: {
        [target]: { damage: 1, exerted: true },
      },
    });

    const resolved = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: { type: "up-to", value: 3 },
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              excludeSelf: false,
            },
          },
          {
            type: "ready",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
      {
        targets: [target],
      },
    );

    expect(resolved.status).toBe("resolved");
    expect(ctx.framework.state.priority.pendingChoice).toBeUndefined();
    expect(ctx.G.pendingEffects).toHaveLength(0);
    expect(state.cardMeta[target]?.damage).toBe(0);
  });

  it("does not suspend later chosen-target consumers when the chosen target lives in prior sequence context", () => {
    const source = "source" as CardInstanceId;
    const target = "target" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [target]: { id: "target", cardType: "character", strength: 3, willpower: 5 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [target],
      },
      cardMeta: {
        [target]: { damage: 1, exerted: true },
      },
    });

    const resolved = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "sequence",
            steps: [
              {
                type: "remove-damage",
                amount: { type: "up-to", value: 3 },
                target: {
                  selector: "chosen",
                  count: 1,
                  owner: "any",
                  zones: ["play"],
                  cardTypes: ["character"],
                },
              },
              {
                type: "ready",
                target: "CHOSEN_CHARACTER",
              },
            ],
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            duration: "this-turn",
            target: { ref: "previous-target" },
          },
        ],
      },
      {
        targets: [target],
      },
      {
        allowPromptForExistingChosenTargets: true,
      },
    );

    if (resolved.status === "suspended") {
      throw new Error(
        JSON.stringify(
          {
            pendingKind: resolved.pendingEffect.kind,
            pendingEffect: resolved.pendingEffect.effect,
            selectionContext: resolved.pendingEffect.selectionContext,
          },
          null,
          2,
        ),
      );
    }

    expect(resolved.status).toBe("resolved");
    expect(ctx.framework.state.priority.pendingChoice).toBeUndefined();
    expect(ctx.G.pendingEffects).toHaveLength(0);
    expect(state.cardMeta[target]?.damage).toBe(0);
    expect(state.cardMeta[target]?.temporaryRestrictions).toEqual(
      expect.objectContaining({
        "cant-quest": 1,
      }),
    );
  });

  it("puts chosen hand cards on top of the deck in the provided order", () => {
    const source = "source" as CardInstanceId;
    const deckBase = "deck-base" as CardInstanceId;
    const handOne = "hand-one" as CardInstanceId;
    const handTwo = "hand-two" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [deckBase]: { id: "deck-base", cardType: "action" },
        [handOne]: { id: "hand-one", cardType: "action" },
        [handTwo]: { id: "hand-two", cardType: "action" },
      },
      zoneCards: {
        [`deck:${PLAYER_ONE}`]: [deckBase],
        [`hand:${PLAYER_ONE}`]: [handOne, handTwo],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "put-on-top",
        source: {
          selector: "chosen",
          count: { exactly: 2 },
          owner: "you",
          zones: ["hand"],
        },
      },
      {
        targets: [handTwo, handOne],
        eventSnapshot: {},
      },
    );

    expect(state.moveCalls).toEqual([
      { cardId: handTwo, zone: "deck", playerId: PLAYER_ONE },
      { cardId: handOne, zone: "deck", playerId: PLAYER_ONE },
    ]);
  });

  it("draws for the selected card owner when the effect targets CARD_OWNER", () => {
    const source = "source" as CardInstanceId;
    const selectedCard = "selected-card" as CardInstanceId;
    const deckOne = "deck-one" as CardInstanceId;
    const deckTwo = "deck-two" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [selectedCard]: { id: "selected-card", cardType: "character" },
        [deckOne]: { id: "deck-one", cardType: "action" },
        [deckTwo]: { id: "deck-two", cardType: "action" },
      },
      zoneCards: {
        [`play:${PLAYER_TWO}`]: [selectedCard],
        [`deck:${PLAYER_TWO}`]: [deckOne, deckTwo],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "draw",
        amount: 2,
        target: "CARD_OWNER",
      },
      {
        targets: [selectedCard],
      },
    );

    expect(state.drawCalls).toEqual([
      {
        from: { zone: "deck", playerId: PLAYER_TWO },
        to: { zone: "hand", playerId: PLAYER_TWO },
        count: 2,
      },
    ]);
  });

  it("keeps the chosen card context for a later CARD_OWNER step in a sequence", () => {
    const source = "source" as CardInstanceId;
    const selectedCard = "selected-card" as CardInstanceId;
    const deckOne = "deck-one" as CardInstanceId;
    const deckTwo = "deck-two" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [selectedCard]: { id: "selected-card", cardType: "character" },
        [deckOne]: { id: "deck-one", cardType: "action" },
        [deckTwo]: { id: "deck-two", cardType: "action" },
      },
      zoneCards: {
        [`play:${PLAYER_TWO}`]: [selectedCard],
        [`deck:${PLAYER_TWO}`]: [deckOne, deckTwo],
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "shuffle-into-deck",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "draw",
            amount: 2,
            target: "CARD_OWNER",
          },
        ],
      },
      {
        targets: [selectedCard],
      },
    );

    expect(result.status).toBe("resolved");
    expect(state.drawCalls).toEqual([
      {
        from: { zone: "deck", playerId: PLAYER_TWO },
        to: { zone: "hand", playerId: PLAYER_TWO },
        count: 2,
      },
    ]);
  });

  it("propagates healedAmount through a sequence even when resolution starts without an event snapshot", () => {
    const source = "source" as CardInstanceId;
    const target = "target" as CardInstanceId;
    const deckOne = "deck-one" as CardInstanceId;
    const deckTwo = "deck-two" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [target]: { id: "target", cardType: "character", willpower: 5 },
        [deckOne]: { id: "deck-one", cardType: "action" },
        [deckTwo]: { id: "deck-two", cardType: "action" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [target],
        [`deck:${PLAYER_ONE}`]: [deckOne, deckTwo],
      },
      cardMeta: {
        [target]: { damage: 2 },
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: { type: "up-to", value: 3 },
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "draw",
            amount: "DAMAGE_REMOVED",
            target: "CONTROLLER",
          },
        ],
      },
      {
        targets: [target],
      },
    );

    expect(result.status).toBe("resolved");
    expect(state.cardMeta[target]?.damage).toBe(0);
    expect(state.drawCalls).toEqual([
      {
        from: { zone: "deck", playerId: PLAYER_ONE },
        to: { zone: "hand", playerId: PLAYER_ONE },
        count: 2,
      },
    ]);
  });

  it("defaults up-to remove-damage to the maximum legal amount when no amount is provided", () => {
    const source = "source" as CardInstanceId;
    const target = "target" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [target]: { id: "target", cardType: "character", willpower: 5 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [target],
      },
      cardMeta: {
        [target]: { damage: 2 },
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "remove-damage",
        amount: { type: "up-to", value: 3 },
        target: "CHOSEN_CHARACTER",
      },
      {
        targets: [target],
      },
    );

    expect(result.status).toBe("resolved");
    expect(state.cardMeta[target]?.damage).toBe(0);
  });

  it("preserves an explicit zero amount for up-to remove-damage", () => {
    const source = "source" as CardInstanceId;
    const target = "target" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [target]: { id: "target", cardType: "character", willpower: 5 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [target],
      },
      cardMeta: {
        [target]: { damage: 2 },
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "remove-damage",
        amount: { type: "up-to", value: 3 },
        target: "CHOSEN_CHARACTER",
      },
      {
        targets: [target],
        amount: 0,
      },
    );

    expect(result.status).toBe("resolved");
    expect(state.cardMeta[target]?.damage).toBe(2);
  });

  it("keeps if-you-do false when the previous effect has no valid targets", () => {
    const source = "source" as CardInstanceId;
    const { ctx } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "gain-lore",
              amount: 2,
            },
          },
        ],
      },
      {},
    );

    expect(ctx.G.lore[PLAYER_ONE]).toBe(0);
  });

  it("continues to later independent sequence steps when a targeted step has no valid targets", () => {
    const source = "source" as CardInstanceId;
    const drawnCard = "drawn-card" as CardInstanceId;
    const wardedOpponent = "warded-opponent" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [drawnCard]: { id: "drawn-card", cardType: "action" },
        [wardedOpponent]: {
          id: "warded-opponent",
          cardType: "character",
          strength: 2,
          willpower: 4,
          abilities: [{ type: "keyword", keyword: "Ward", text: "Ward" }],
        },
      },
      zoneCards: {
        [`deck:${PLAYER_ONE}`]: [drawnCard],
        [`play:${PLAYER_TWO}`]: [wardedOpponent],
      },
      cardMeta: {
        [wardedOpponent]: { damage: 0 },
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            amount: 2,
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      { eventSnapshot: {} },
    );

    expect(result.status).toBe("resolved");
    expect(ctx.G.pendingEffects).toHaveLength(0);
    expect(state.cardMeta[wardedOpponent]?.damage).toBe(0);
    expect(state.drawCalls).toHaveLength(1);
    expect(state.drawCalls[0]?.count).toBe(1);
  });

  it("keeps if-you-do false when return-to-hand fails before a play-card continuation", () => {
    const source = "source" as CardInstanceId;
    const missingTarget = "missing-target" as CardInstanceId;
    const handCharacter = "hand-character" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [missingTarget]: { id: "missing-target", cardType: "character", cost: 2, willpower: 3 },
        [handCharacter]: { id: "hand-character", cardType: "character", cost: 2, willpower: 3 },
      },
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: [handCharacter],
        [`discard:${PLAYER_ONE}`]: [missingTarget],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "play-card",
              from: "hand",
              cardType: "character",
              cost: "free",
            },
          },
        ],
      },
      {
        targets: [missingTarget, handCharacter],
      },
    );

    expect(state.moveCalls).toEqual([]);
  });

  it("does not auto-play from hand when a follow-up play-card selection is omitted", () => {
    const source = "source" as CardInstanceId;
    const returnedTarget = "returned-target" as CardInstanceId;
    const handCharacter = "hand-character" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [returnedTarget]: { id: "returned-target", cardType: "character", cost: 2, willpower: 3 },
        [handCharacter]: { id: "hand-character", cardType: "character", cost: 2, willpower: 3 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [returnedTarget],
        [`hand:${PLAYER_ONE}`]: [handCharacter],
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "play-card",
              from: "hand",
              cardType: "character",
              cost: "free",
              filter: {
                maxCost: "chosen-card-cost",
                excludeChosenCard: true,
              },
            },
          },
        ],
      },
      {
        targets: [returnedTarget],
      },
    );

    expect(result.status).toBe("suspended");
    expect(state.moveCalls).toEqual([
      { cardId: returnedTarget, playerId: PLAYER_ONE, zone: "hand" },
    ]);
    if (result.status === "suspended") {
      const sel = result.pendingEffect.selectionContext;
      expect(sel?.kind === "target-selection" ? sel.allowedZones : undefined).toEqual(["hand"]);
    }
  });

  it("checks the chooser's hand before auto-declining an opponent-chosen play-card optional", () => {
    const source = "source" as CardInstanceId;
    const opponentHandCharacter = "opponent-hand-character" as CardInstanceId;
    const { ctx } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [opponentHandCharacter]: {
          id: "opponent-hand-character",
          cardType: "character",
          cost: 2,
          willpower: 3,
        },
      },
      zoneCards: {
        [`hand:${PLAYER_TWO}`]: [opponentHandCharacter],
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "optional",
        chooser: "OPPONENT",
        effect: {
          type: "play-card",
          from: "hand",
          cardType: "character",
          cost: "free",
        },
      },
      {},
    );

    expect(result.status).toBe("suspended");
    if (result.status === "suspended") {
      expect(result.pendingEffect.kind).toBe("optional-selection");
      expect(result.pendingEffect.chooserId).toBe(PLAYER_TWO);
    }
  });

  it("clears stale chooserPlayerId when a nested optional returns to the controller", () => {
    const source = "source" as CardInstanceId;
    const controllerDiscardCharacter = "controller-discard-character" as CardInstanceId;
    const staleChooserDiscardCharacter = "stale-chooser-discard-character" as CardInstanceId;
    const { ctx } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [controllerDiscardCharacter]: {
          id: "controller-discard-character",
          cardType: "character",
          cost: 2,
          willpower: 3,
        },
        [staleChooserDiscardCharacter]: {
          id: "stale-chooser-discard-character",
          cardType: "character",
          cost: 2,
          willpower: 3,
        },
      },
      zoneCards: {
        [`discard:${PLAYER_ONE}`]: [controllerDiscardCharacter],
        [`discard:${PLAYER_TWO}`]: [staleChooserDiscardCharacter],
      },
    });
    (ctx as { playerId: PlayerId }).playerId = PLAYER_TWO;

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          from: "discard",
          cardType: "character",
          cost: "free",
        },
      },
      { chooserPlayerId: PLAYER_TWO },
    );

    expect(result.status).toBe("suspended");
    if (result.status === "suspended") {
      const sel = result.pendingEffect.selectionContext;
      expect(sel?.kind === "target-selection" ? sel.cardCandidateIds : undefined).toEqual([
        controllerDiscardCharacter,
      ]);
    }
  });

  it("deterministically plays a same-name card when multiple matching copies exist", () => {
    const source = "source" as CardInstanceId;
    const chosenCard = "chosen-card" as CardInstanceId;
    const copyA = "copy-a" as CardInstanceId;
    const copyB = "copy-b" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [chosenCard]: { id: "chosen-card", cardType: "character", name: "Floodborn Friend" },
        [copyA]: { id: "copy-a", cardType: "character", name: "Floodborn Friend", cost: 2 },
        [copyB]: { id: "copy-b", cardType: "character", name: "Floodborn Friend", cost: 2 },
      },
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: [copyA, copyB],
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "play-card",
        from: "hand",
        cardType: "character",
        cost: "free",
        filter: {
          sameNameAsChosenCard: true,
        },
      },
      {
        eventSnapshot: {
          chosenCardId: chosenCard,
        },
      },
    );

    expect(result.status).toBe("resolved");
    expect(state.moveCalls).toEqual([{ cardId: copyB, playerId: PLAYER_ONE, zone: "play" }]);
  });

  it("restores event snapshot after if-you-do play-card so chosen-card-cost offset uses the banished card (Retro Evolution Device)", () => {
    const source = "source" as CardInstanceId;
    const sacrifice = "sacrifice" as CardInstanceId;
    const followUp = "follow-up" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [sacrifice]: { id: "sacrifice", cardType: "character", cost: 4, willpower: 3 },
        [followUp]: { id: "follow-up", cardType: "character", cost: 6, willpower: 3 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [sacrifice],
        [`hand:${PLAYER_ONE}`]: [followUp],
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: "CHOSEN_CHARACTER_OF_YOURS",
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "play-card",
              from: "hand",
              cardType: "character",
              cost: "free",
              filter: {
                maxCost: {
                  type: "chosen-card-cost",
                  offset: 2,
                },
              },
            },
          },
        ],
      },
      {
        targets: [sacrifice, followUp],
      },
    );

    expect(result.status).toBe("resolved");
    expect(state.moveCalls).toEqual([
      { cardId: sacrifice, playerId: PLAYER_ONE, zone: "discard" },
      { cardId: followUp, playerId: PLAYER_ONE, zone: "play" },
    ]);
  });

  it("keeps if-you-do false when the first damage effect deals zero damage", () => {
    const source = "source" as CardInstanceId;
    const preventedTarget = "prevented-target" as CardInstanceId;
    const followUpTarget = "follow-up-target" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [preventedTarget]: {
          id: "prevented-target",
          cardType: "character",
          strength: 2,
          willpower: 4,
        },
        [followUpTarget]: {
          id: "follow-up-target",
          cardType: "character",
          strength: 2,
          willpower: 4,
        },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [preventedTarget],
        [`play:${PLAYER_TWO}`]: [followUpTarget],
      },
      cardMeta: {
        [preventedTarget]: {
          damage: 0,
          temporaryKeywords: { Resist: 1 },
          temporaryKeywordStarts: { Resist: 1 },
          temporaryKeywordValues: { Resist: 2 },
        },
        [followUpTarget]: { damage: 0 },
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            amount: 2,
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "deal-damage",
              amount: 2,
              target: {
                selector: "chosen",
                count: 1,
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        ],
      },
      {
        targets: [preventedTarget, followUpTarget],
      },
    );

    expect(state.cardMeta[preventedTarget]?.damage).toBe(0);
    expect(state.cardMeta[followUpTarget]?.damage).toBe(0);
  });

  it("resolves the selected branch when both or branches are legal", () => {
    const source = "source" as CardInstanceId;
    const handCard = "hand-card" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "character", strength: 3, willpower: 3 },
        [handCard]: { id: "hand-card", cardType: "action", cost: 1 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source],
        [`hand:${PLAYER_ONE}`]: [handCard],
      },
    });

    const result = resolveActionEffect(
      ctx,
      {
        cardId: source,
        cardType: "character",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      {
        type: "or",
        options: [
          {
            type: "discard",
            amount: 1,
            chosen: true,
            from: "hand",
            target: "CONTROLLER",
          },
          {
            type: "banish",
            target: "SELF",
          },
        ],
      },
      {
        choiceIndex: 0,
        targets: [handCard],
      },
    );

    expect(result.status).toBe("resolved");
    expect(state.moveCalls).toEqual([{ cardId: handCard, playerId: PLAYER_ONE, zone: "discard" }]);
  });

  it("keeps discard-all choice branches legal when the target hand is empty", () => {
    const source = "source" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action", cost: 7 },
      },
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: [],
        [`deck:${PLAYER_ONE}`]: [
          "draw-one" as CardInstanceId,
          "draw-two" as CardInstanceId,
          "draw-three" as CardInstanceId,
        ],
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "choice",
        options: [
          {
            type: "sequence",
            steps: [
              { type: "discard", amount: "all", target: "CONTROLLER" },
              { type: "draw", amount: 3, target: "CONTROLLER" },
            ],
          },
        ],
      },
      {
        choiceIndex: 0,
      },
    );

    expect(result.status).toBe("resolved");
    expect(state.moveCalls).toEqual([]);
    expect(state.drawCalls).toEqual([
      {
        from: { zone: "deck", playerId: PLAYER_ONE },
        to: { zone: "hand", playerId: PLAYER_ONE },
        count: 3,
      },
    ]);
  });

  it("forces the only legal or branch when the selected branch is illegal", () => {
    const source = "source" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "character", strength: 3, willpower: 3 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source],
      },
    });

    const result = resolveActionEffect(
      ctx,
      {
        cardId: source,
        cardType: "character",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      {
        type: "or",
        options: [
          {
            type: "discard",
            amount: 1,
            chosen: true,
            from: "hand",
            target: "CONTROLLER",
          },
          {
            type: "banish",
            target: "SELF",
          },
        ],
      },
      {
        choiceIndex: 0,
        eventSnapshot: {},
      },
    );

    expect(result.status).toBe("resolved");
    expect(state.moveCalls).toEqual([{ cardId: source, playerId: PLAYER_ONE, zone: "discard" }]);
  });

  it("rejects a chosen banish branch when submitted targets are incomplete for the required count", () => {
    const source = "source" as CardInstanceId;
    const targetOne = "target-one" as CardInstanceId;
    const targetTwo = "target-two" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "character", strength: 3, willpower: 3 },
        [targetOne]: { id: "target-one", cardType: "character", strength: 2, willpower: 2 },
        [targetTwo]: { id: "target-two", cardType: "character", strength: 2, willpower: 2 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source],
        [`play:${PLAYER_TWO}`]: [targetOne, targetTwo],
      },
    });

    const result = resolveActionEffect(
      ctx,
      {
        cardId: source,
        cardType: "character",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      {
        type: "or",
        options: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 2,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "banish",
            target: "SELF",
          },
        ],
      },
      {
        choiceIndex: 0,
        targets: [targetOne],
        eventSnapshot: {},
      },
    );

    expect(result.status).toBe("resolved");
    expect(state.moveCalls).toEqual([{ cardId: source, playerId: PLAYER_ONE, zone: "discard" }]);
  });

  it("rejects a chosen banish branch when submitted targets repeat the same card", () => {
    const source = "source" as CardInstanceId;
    const targetOne = "target-one" as CardInstanceId;
    const targetTwo = "target-two" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "character", strength: 3, willpower: 3 },
        [targetOne]: { id: "target-one", cardType: "character", strength: 2, willpower: 2 },
        [targetTwo]: { id: "target-two", cardType: "character", strength: 2, willpower: 2 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source],
        [`play:${PLAYER_TWO}`]: [targetOne, targetTwo],
      },
    });

    const result = resolveActionEffect(
      ctx,
      {
        cardId: source,
        cardType: "character",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      {
        type: "or",
        options: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 2,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "banish",
            target: "SELF",
          },
        ],
      },
      {
        choiceIndex: 0,
        targets: [targetOne, targetOne],
        eventSnapshot: {},
      },
    );

    expect(result.status).toBe("resolved");
    expect(state.moveCalls).toEqual([{ cardId: source, playerId: PLAYER_ONE, zone: "discard" }]);
  });

  it("uses event snapshot exclusions when checking chosen banish branch legality", () => {
    const source = "source" as CardInstanceId;
    const triggerSubject = "trigger-subject" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "character", strength: 3, willpower: 3 },
        [triggerSubject]: {
          id: "trigger-subject",
          cardType: "character",
          strength: 2,
          willpower: 2,
        },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [source],
        [`play:${PLAYER_TWO}`]: [triggerSubject],
      },
    });

    const result = resolveActionEffect(
      ctx,
      {
        cardId: source,
        cardType: "character",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      {
        type: "or",
        options: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
              excludeTriggerSubject: true,
            },
          },
          {
            type: "banish",
            target: "SELF",
          },
        ],
      },
      {
        choiceIndex: 0,
        eventSnapshot: { subjectCardId: triggerSubject },
      },
    );

    expect(result.status).toBe("resolved");
    expect(state.moveCalls).toEqual([{ cardId: source, playerId: PLAYER_ONE, zone: "discard" }]);
  });

  it("treats or as a no-op when no branch is legal", () => {
    const source = "source" as CardInstanceId;
    const { ctx } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "character", strength: 3, willpower: 3 },
      },
      zoneCards: {
        [`discard:${PLAYER_ONE}`]: [source],
      },
    });
    const eventSnapshot: { lastEffectPerformed?: boolean } = {};

    const result = resolveActionEffect(
      ctx,
      {
        cardId: source,
        cardType: "character",
        costType: "free",
        playerId: PLAYER_ONE,
      },
      {
        type: "or",
        options: [
          {
            type: "discard",
            amount: 1,
            chosen: true,
            from: "hand",
            target: "CONTROLLER",
          },
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              excludeSelf: true,
            },
          },
        ],
      },
      {
        choiceIndex: 0,
        eventSnapshot,
      },
    );

    expect(result.status).toBe("resolved");
    expect(eventSnapshot.lastEffectPerformed).toBe(false);
  });

  it("reads move-damage from/to slots directly when a slotted input is provided", () => {
    const source = "source" as CardInstanceId;
    const donor = "donor" as CardInstanceId;
    const dest = "dest" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [donor]: { id: "donor", cardType: "character", strength: 2, willpower: 5 },
        [dest]: { id: "dest", cardType: "character", strength: 1, willpower: 5 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [donor, dest],
      },
      cardMeta: {
        [donor]: { damage: 3 },
        [dest]: { damage: 0 },
      },
    });

    const resolved = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "move-damage",
        from: {
          selector: "chosen",
          count: 1,
          owner: "self",
          zones: ["play"],
          cardTypes: ["character"],
        },
        to: {
          selector: "chosen",
          count: 1,
          owner: "self",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      {
        slottedTargets: {
          kind: "move-damage",
          from: [donor],
          to: [dest],
        },
        // Flat mirror kept for generic consumers (required by the move-entry
        // boundary that always populates this).
        targets: [donor, dest],
      },
      { allowPromptForExistingChosenTargets: true },
    );

    expect(resolved.status).toBe("resolved");
    // Damage moved from donor to dest using the slot keys rather than
    // positional ordering.
    expect(state.cardMeta[donor]?.damage).toBe(0);
    expect(state.cardMeta[dest]?.damage).toBe(3);
  });

  it("moves all damage onto the prior sequence target when move-damage uses previous-target", () => {
    const source = "source" as CardInstanceId;
    const donor = "donor" as CardInstanceId;
    const dest = "dest" as CardInstanceId;
    const { ctx, state } = createResolverTestContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [donor]: { id: "donor", cardType: "character", strength: 2, willpower: 5 },
        [dest]: { id: "dest", cardType: "character", strength: 1, willpower: 5 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [donor],
        [`play:${PLAYER_TWO}`]: [dest],
      },
      cardMeta: {
        [donor]: { damage: 2 },
        [dest]: { damage: 0 },
      },
    });

    const resolved = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "move-damage",
            from: "ALL_CHARACTERS",
            to: { ref: "previous-target" },
          },
        ],
      },
      { targets: [dest] },
      { allowPromptForExistingChosenTargets: true },
    );

    expect(resolved.status).toBe("resolved");
    expect(state.cardMeta[donor]?.damage).toBe(0);
    expect(state.cardMeta[dest]?.damage).toBe(2);
    expect(state.cardMeta[dest]?.state).toBe("exerted");
  });
});
