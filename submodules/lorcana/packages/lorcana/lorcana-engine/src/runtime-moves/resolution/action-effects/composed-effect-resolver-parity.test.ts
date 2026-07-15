import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import type { CardPlayedPayload, LorcanaCard } from "../../../types";
import { flushTriggeredEventsToBag, queueTriggeredEvent } from "../../effects/triggered-abilities";
import type { PlayCardExecutionContext } from "./types";
import { resolveActionEffect } from "./composed-effect-resolver";
import { resolveDiscardEffect } from "./discard-effect";

type TestCardDefinition = {
  id: string;
  actionSubtype?: string;
  abilities?: LorcanaCard["abilities"];
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

function createResolverContext(args?: {
  definitions?: Record<string, TestCardDefinition>;
  zoneCards?: Record<string, CardInstanceId[]>;
  cardMeta?: Record<string, Record<string, unknown>>;
}): {
  ctx: PlayCardExecutionContext;
  state: {
    cardMeta: Record<string, Record<string, unknown>>;
    revealCalls: Array<{
      cardIds: CardInstanceId[];
      visibleTo: "all" | PlayerId[];
    }>;
    zoneCards: Record<string, CardInstanceId[]>;
  };
} {
  const definitions = args?.definitions ?? {};
  const zoneCards: Record<string, CardInstanceId[]> = Object.fromEntries(
    Object.entries(args?.zoneCards ?? {}).map(([zoneKey, cards]) => [zoneKey, [...cards]]),
  );
  const cardMeta: Record<string, Record<string, unknown>> = {
    ...args?.cardMeta,
  };
  const revealCalls: Array<{
    cardIds: CardInstanceId[];
    visibleTo: "all" | PlayerId[];
  }> = [];

  const cardIndex: Record<string, { controllerID: PlayerId; ownerID: PlayerId; zoneKey: string }> =
    {};
  for (const [zoneKey, cards] of Object.entries(zoneCards)) {
    const [, ownerSegment] = zoneKey.split(":");
    const ownerId = (ownerSegment ?? PLAYER_ONE) as PlayerId;
    for (const cardId of cards) {
      cardIndex[cardId] = { controllerID: ownerId, ownerID: ownerId, zoneKey };
    }
  }

  const getZoneKey = (zone: string, playerId: PlayerId) => `${zone}:${playerId}`;
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
    getCards: ({ zone, playerId }: { zone: string; playerId: PlayerId }) => {
      return [...(zoneCards[getZoneKey(zone, playerId)] ?? [])];
    },
    moveCard: (
      cardId: CardInstanceId,
      to: { zone: string; playerId: PlayerId },
      options?: { index?: number },
    ) => {
      const currentZoneKey = cardIndex[cardId]?.zoneKey;
      if (currentZoneKey && zoneCards[currentZoneKey]) {
        zoneCards[currentZoneKey] = zoneCards[currentZoneKey].filter((id) => id !== cardId);
      }

      const targetZoneKey = getZoneKey(to.zone, to.playerId);
      const targetCards = zoneCards[targetZoneKey] ?? [];
      const nextTargetCards = [...targetCards];
      if (typeof options?.index === "number") {
        const index = Math.max(0, Math.min(options.index, nextTargetCards.length));
        nextTargetCards.splice(index, 0, cardId);
      } else {
        nextTargetCards.push(cardId);
      }

      zoneCards[targetZoneKey] = nextTargetCards;
      cardIndex[cardId] = {
        controllerID: to.playerId,
        ownerID: to.playerId,
        zoneKey: targetZoneKey,
      };
    },
    reveal: (cardIds: CardInstanceId[], visibleTo: "all" | PlayerId[]) => {
      revealCalls.push({
        cardIds: [...cardIds],
        visibleTo: Array.isArray(visibleTo) ? [...visibleTo] : visibleTo,
      });
    },
    shuffle: () => {},
    drawCards: () => {},
    getCardOwner: (cardId: CardInstanceId) => cardIndex[cardId]?.ownerID,
    getCardController: (cardId: CardInstanceId) => cardIndex[cardId]?.controllerID,
    getCardZone: (cardId: CardInstanceId) => cardIndex[cardId]?.zoneKey,
  };
  const cardsApi = {
    get: (cardId: CardInstanceId) => ({
      definition: definitions[cardId],
      meta: cardMeta[cardId] ?? {},
      getStrength: () => Number(definitions[cardId]?.strength ?? 0),
      getWillpower: () => Number(definitions[cardId]?.willpower ?? 0),
    }),
    require: (cardId: CardInstanceId) => ({
      definition: definitions[cardId],
      meta: cardMeta[cardId] ?? {},
      getStrength: () => Number(definitions[cardId]?.strength ?? 0),
      getWillpower: () => Number(definitions[cardId]?.willpower ?? 0),
    }),
    getDefinition: (cardId: CardInstanceId) => definitions[cardId],
    patchMeta: (cardId: CardInstanceId, nextMeta: Record<string, unknown>) => {
      cardMeta[cardId] = {
        ...cardMeta[cardId],
        ...nextMeta,
      };
    },
    setMeta: (cardId: CardInstanceId, nextMeta: Record<string, unknown>) => {
      cardMeta[cardId] = {
        ...nextMeta,
      };
    },
    getMeta: (cardId: CardInstanceId) => cardMeta[cardId],
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
        charactersQuesting: [],
        inkedThisTurn: [],
        shiftPlayedThisTurn: [],
      },
    },
    playerId: PLAYER_ONE,

    cards: cardsApi,
    framework: {
      cards: cardsApi,
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
      events: {
        emit: () => {},
      },
      log: () => {},
      zones: zonesApi as never,
    },
    events: {
      emit: () => {},
    },
  } as unknown as PlayCardExecutionContext;

  return {
    ctx,
    state: {
      cardMeta,
      revealCalls,
      zoneCards,
    },
  };
}

describe("resolveActionEffect parity", () => {
  it("resolves ready effects", () => {
    const source = "source" as CardInstanceId;
    const target = "target" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [target]: { id: "target", cardType: "character" },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [target],
      },
      cardMeta: {
        [target]: { state: "exerted" },
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "ready",
        target: "CHOSEN_CHARACTER_OF_YOURS",
      },
      {
        targets: [target],
      },
    );

    expect(state.cardMeta[target]?.state).toBe("ready");
  });

  it("resolves structured target-query conditions", () => {
    const source = "source" as CardInstanceId;
    const handOne = "hand-1" as CardInstanceId;
    const handTwo = "hand-2" as CardInstanceId;
    const handThree = "hand-3" as CardInstanceId;
    const { ctx } = createResolverContext({
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

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "conditional",
        condition: {
          type: "target-query",
          query: {
            selector: "all",
            owner: "you",
            zones: ["hand"],
          },
          comparison: {
            operator: "gte",
            value: 3,
          },
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
        else: {
          type: "lose-lore",
          amount: 1,
        },
      },
      {},
    );

    expect(ctx.G.lore[PLAYER_ONE]).toBe(2);
  });

  it("treats missing current-turn player as an unmet action condition", () => {
    const source = "source" as CardInstanceId;
    const { ctx } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
      },
    });

    (ctx as { currentPlayer?: PlayerId }).currentPlayer = undefined;
    (ctx.framework.state as { currentPlayer?: PlayerId }).currentPlayer = undefined;
    (ctx.framework.state.priority as { holder?: PlayerId }).holder = undefined;

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "conditional",
        condition: {
          type: "target-query",
          query: {
            selector: "you",
            filters: [
              {
                type: "current-turn-player",
                value: true,
              },
            ],
          },
          comparison: {
            operator: "gte",
            value: 1,
          },
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
        else: {
          type: "gain-lore",
          amount: 1,
        },
      },
      {},
    );

    expect(ctx.G.lore[PLAYER_ONE]).toBe(1);
  });

  it("resolves supported play-card free path", () => {
    const source = "source" as CardInstanceId;
    const characterToPlay = "character-to-play" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [characterToPlay]: {
          id: "character-to-play",
          cardType: "character",
          strength: 3,
          willpower: 3,
        },
      },
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: [characterToPlay],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "play-card",
        from: "hand",
        cost: "free",
      },
      {
        targets: [characterToPlay],
      },
    );

    expect(state.zoneCards[`play:${PLAYER_ONE}`]).toContain(characterToPlay);
    expect(state.cardMeta[characterToPlay]?.isDrying).toBe(true);
  });

  it("applies play-card card constraints before fallback selection", () => {
    const source = "source" as CardInstanceId;
    const cheapCharacter = "cheap-character" as CardInstanceId;
    const expensiveCharacter = "expensive-character" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [cheapCharacter]: {
          id: "cheap-character",
          cardType: "character",
          cost: 2,
          strength: 2,
          willpower: 2,
        },
        [expensiveCharacter]: {
          id: "expensive-character",
          cardType: "character",
          cost: 6,
          strength: 6,
          willpower: 6,
        },
      },
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: [cheapCharacter, expensiveCharacter],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "play-card",
        from: "hand",
        cost: "free",
        cardType: "character",
        filter: {
          maxCost: 2,
        },
      },
      {},
    );

    expect(state.zoneCards[`play:${PLAYER_ONE}`]).toEqual([cheapCharacter]);
    expect(state.zoneCards[`hand:${PLAYER_ONE}`]).toEqual([expensiveCharacter]);
  });

  it("does not fall back to another discard card when an explicit target has changed zones", () => {
    const source = "source" as CardInstanceId;
    const exactSong = "exact-song" as CardInstanceId;
    const otherSong = "other-song" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [exactSong]: {
          id: "exact-song",
          cardType: "action",
          actionSubtype: "song",
          name: "I2I",
        },
        [otherSong]: {
          id: "other-song",
          cardType: "action",
          actionSubtype: "song",
          name: "I2I",
        },
      },
      zoneCards: {
        [`discard:${PLAYER_ONE}`]: [otherSong],
        [`deck:${PLAYER_ONE}`]: [exactSong],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "play-card",
        from: "discard",
        cost: "free",
        filter: {
          cardType: "song",
        },
      },
      {
        targets: [exactSong],
      },
    );

    expect(state.zoneCards[`play:${PLAYER_ONE}`] ?? []).toEqual([]);
    expect(state.zoneCards[`discard:${PLAYER_ONE}`]).toEqual([otherSong]);
    expect(state.zoneCards[`deck:${PLAYER_ONE}`]).toEqual([exactSong]);
  });

  it("suspends play-card from discard when multiple characters qualify and no target is chosen", () => {
    const source = "source" as CardInstanceId;
    const charA = "char-a" as CardInstanceId;
    const charB = "char-b" as CardInstanceId;
    const { ctx } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [charA]: { id: "char-a", cardType: "character", cost: 1, strength: 1, willpower: 1 },
        [charB]: { id: "char-b", cardType: "character", cost: 2, strength: 2, willpower: 2 },
      },
      zoneCards: {
        [`discard:${PLAYER_ONE}`]: [charA, charB],
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "play-card",
        from: "discard",
        cost: "free",
        cardType: "character",
      },
      {},
    );

    expect(result.status).toBe("suspended");
    if (result.status === "suspended") {
      const sel = result.pendingEffect.selectionContext;
      expect(sel?.kind === "target-selection" ? sel.allowedZones : undefined).toEqual(["discard"]);
    }
  });

  it("resolves play-card from discard when multiple characters qualify and an explicit target is chosen", () => {
    const source = "source" as CardInstanceId;
    const charA = "char-a" as CardInstanceId;
    const charB = "char-b" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [charA]: { id: "char-a", cardType: "character", cost: 1, strength: 1, willpower: 1 },
        [charB]: { id: "char-b", cardType: "character", cost: 2, strength: 2, willpower: 2 },
      },
      zoneCards: {
        [`discard:${PLAYER_ONE}`]: [charA, charB],
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "play-card",
        from: "discard",
        cost: "free",
        cardType: "character",
      },
      { targets: [charA] },
    );

    expect(result.status).not.toBe("suspended");
    expect(state.zoneCards[`play:${PLAYER_ONE}`]).toContain(charA);
    expect(state.zoneCards[`discard:${PLAYER_ONE}`]).toEqual([charB]);
  });

  it("suspends play-card from discard when exactly ONE character qualifies and no target is chosen", () => {
    const source = "source" as CardInstanceId;
    const charA = "char-a" as CardInstanceId;
    const { ctx } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [charA]: { id: "char-a", cardType: "character", cost: 1, strength: 1, willpower: 1 },
      },
      zoneCards: {
        [`discard:${PLAYER_ONE}`]: [charA],
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "play-card",
        from: "discard",
        cost: "free",
        cardType: "character",
      },
      {},
    );

    expect(result.status).toBe("suspended");
    if (result.status === "suspended") {
      const sel = result.pendingEffect.selectionContext;
      expect(sel?.kind === "target-selection" ? sel.allowedZones : undefined).toEqual(["discard"]);
      expect(sel?.kind === "target-selection" ? sel.cardCandidateIds : undefined).toEqual([charA]);
    }
  });

  it("resolves play-card from discard when exactly ONE character qualifies and an explicit target is chosen", () => {
    const source = "source" as CardInstanceId;
    const charA = "char-a" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [charA]: { id: "char-a", cardType: "character", cost: 1, strength: 1, willpower: 1 },
      },
      zoneCards: {
        [`discard:${PLAYER_ONE}`]: [charA],
      },
    });

    const result = resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "play-card",
        from: "discard",
        cost: "free",
        cardType: "character",
      },
      { targets: [charA] },
    );

    expect(result.status).not.toBe("suspended");
    expect(state.zoneCards[`play:${PLAYER_ONE}`]).toContain(charA);
    expect(state.zoneCards[`discard:${PLAYER_ONE}`]).toEqual([]);
  });

  it("batches replayed action play events until every targeted player card is in play", () => {
    const source = "source" as CardInstanceId;
    const replayedAction = "replayed-action" as CardInstanceId;
    const opponentWatcher = "opponent-watcher" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [replayedAction]: { id: "replayed-action", cardType: "action" },
        [opponentWatcher]: {
          id: "opponent-watcher",
          cardType: "character",
          cost: 2,
          lore: 1,
          strength: 2,
          willpower: 2,
          abilities: [
            {
              type: "triggered",
              trigger: {
                event: "play",
                on: {
                  controller: "opponent",
                  cardType: "action",
                },
                timing: "whenever",
              },
              effect: {
                type: "gain-lore",
                amount: 1,
                target: "CONTROLLER",
              },
            },
          ],
        },
      },
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: [replayedAction],
        [`hand:${PLAYER_TWO}`]: [opponentWatcher],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "play-card",
        from: "hand",
        cost: "free",
        target: "EACH_PLAYER",
      },
      {},
    );

    expect(state.zoneCards[`discard:${PLAYER_ONE}`]).toEqual([replayedAction]);
    expect(state.zoneCards[`play:${PLAYER_TWO}`]).toEqual([opponentWatcher]);
    expect(ctx.G.triggeredAbilities?.bag.items).toHaveLength(1);
    expect(ctx.G.triggeredAbilities?.bag.items[0]?.sourceId).toBe(opponentWatcher);
  });

  it("keeps replayed actions out of discard while their resolution is suspended", () => {
    const source = "source" as CardInstanceId;
    const replayedAction = "replayed-action" as CardInstanceId;
    const discardTarget = "discard-target" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [replayedAction]: {
          id: "replayed-action",
          cardType: "action",
          abilities: [
            {
              type: "action",
              effect: {
                type: "discard",
                chosen: true,
                target: "OPPONENT",
              },
            },
          ],
        },
        [discardTarget]: {
          id: "discard-target",
          cardType: "character",
          strength: 1,
          willpower: 1,
        },
      },
      zoneCards: {
        [`discard:${PLAYER_ONE}`]: [replayedAction],
        [`hand:${PLAYER_TWO}`]: [discardTarget],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "play-card",
        from: "discard",
        cost: "free",
        cardType: "action",
      },
      {
        targets: [replayedAction],
      },
    );

    expect(state.zoneCards[`discard:${PLAYER_ONE}`]).toEqual([]);
    expect(state.zoneCards[`limbo:${PLAYER_ONE}`]).toEqual([replayedAction]);
    expect(ctx.framework.state.priority.pendingChoice?.type).toBe("action-effect");
    expect(ctx.G.pendingEffects).toHaveLength(1);
  });

  it("queues one discard trigger event per discarded card", () => {
    const source = "source" as CardInstanceId;
    const discardOne = "discard-one" as CardInstanceId;
    const discardTwo = "discard-two" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [discardOne]: { id: "discard-one", cardType: "character" },
        [discardTwo]: { id: "discard-two", cardType: "character" },
      },
      zoneCards: {
        [`hand:${PLAYER_ONE}`]: [discardOne, discardTwo],
      },
    });

    resolveDiscardEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "discard",
        target: "CONTROLLER",
      },
      {
        targets: [discardOne, discardTwo],
      },
      {
        discardAmount: 2,
        selectedTargets: [discardOne, discardTwo],
      },
    );

    expect(state.zoneCards[`hand:${PLAYER_ONE}`]).toEqual([]);
    expect(state.zoneCards[`discard:${PLAYER_ONE}`]).toEqual([discardOne, discardTwo]);
    expect(ctx.G.triggeredAbilities?.pendingEvents).toHaveLength(2);
    expect(ctx.G.triggeredAbilities?.pendingEvents.map((event) => event.subjectCardId)).toEqual([
      discardOne,
      discardTwo,
    ]);
    expect(
      ctx.G.triggeredAbilities?.pendingEvents.every(
        (event) => event.eventSnapshot?.triggerAmount === 2,
      ),
    ).toBe(true);
  });

  it("ignores missing subject cards for CHARACTERS_HERE trigger matching", () => {
    const location = "location" as CardInstanceId;
    const missingSubject = "missing-subject" as CardInstanceId;
    const { ctx } = createResolverContext({
      definitions: {
        [location]: {
          id: "location",
          cardType: "location",
          abilities: [
            {
              type: "triggered",
              trigger: {
                event: "play",
                on: "CHARACTERS_HERE",
                timing: "whenever",
              },
              effect: {
                type: "gain-lore",
                amount: 1,
                target: "CONTROLLER",
              },
            },
          ],
        },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [location],
      },
    });

    queueTriggeredEvent(ctx, {
      event: "play",
      playerId: PLAYER_ONE,
      subjectCardId: missingSubject,
    });

    expect(() => flushTriggeredEventsToBag(ctx)).not.toThrow();
    expect(ctx.G.triggeredAbilities?.bag.items ?? []).toEqual([]);
  });

  it("reveals top cards to all players for reveal-top-card effects", () => {
    const source = "source" as CardInstanceId;
    const deckBottom = "deck-bottom" as CardInstanceId;
    const deckTop = "deck-top" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [deckBottom]: { id: "deck-bottom", cardType: "action" },
        [deckTop]: { id: "deck-top", cardType: "action" },
      },
      zoneCards: {
        [`deck:${PLAYER_ONE}`]: [deckBottom, deckTop],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "reveal-top-card",
        target: "CONTROLLER",
      },
      {},
    );

    expect(state.revealCalls).toHaveLength(1);
    expect(state.revealCalls[0]?.cardIds).toEqual([deckTop]);
    expect(state.revealCalls[0]?.visibleTo).toBe("all");
  });

  it("fails closed for unresolved chosen-player targets", () => {
    const source = "source" as CardInstanceId;
    const deckTop = "deck-top" as CardInstanceId;
    const { ctx } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [deckTop]: { id: "deck-top", cardType: "action" },
      },
      zoneCards: {
        [`deck:${PLAYER_ONE}`]: [deckTop],
      },
    });

    expect(() =>
      resolveActionEffect(
        ctx,
        createCardPlayedPayload(source, PLAYER_ONE),
        {
          type: "reveal-top-card",
          target: "CHOSEN_PLAYER",
        },
        {},
      ),
    ).not.toThrow();
  });

  it("propagates chosen-player targets into sequenced reveal-hand and discard effects", () => {
    const source = "source" as CardInstanceId;
    const nonCharacter = "non-character" as CardInstanceId;
    const character = "character" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [nonCharacter]: { id: "non-character", cardType: "action" },
        [character]: { id: "character", cardType: "character" },
      },
      zoneCards: {
        [`hand:${PLAYER_TWO}`]: [nonCharacter, character],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "CHOSEN_PLAYER",
          },
          {
            type: "discard",
            amount: 1,
            target: "CHOSEN_PLAYER",
            chosen: true,
            chosenBy: "you",
            from: "hand",
            filter: {
              notCardType: "character",
            },
          },
        ],
      },
      {
        targets: [PLAYER_TWO],
      },
    );

    expect(state.revealCalls).toEqual([
      {
        cardIds: [nonCharacter, character],
        visibleTo: "all",
      },
    ]);
    expect(state.cardMeta[nonCharacter]?.revealed).toBe(true);
    expect(state.cardMeta[character]?.revealed).toBe(true);
    expect(ctx.framework.state.priority.pendingChoice?.type).toBe("action-effect");
    expect(ctx.G.pendingEffects).toHaveLength(1);
  });

  it("does not queue a discard choice when the chosen player's hand has no eligible discard", () => {
    const source = "source" as CardInstanceId;
    const onlyCharacter = "only-character" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [onlyCharacter]: { id: "only-character", cardType: "character" },
      },
      zoneCards: {
        [`hand:${PLAYER_TWO}`]: [onlyCharacter],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "CHOSEN_PLAYER",
          },
          {
            type: "discard",
            amount: 1,
            target: "CHOSEN_PLAYER",
            chosen: true,
            chosenBy: "you",
            from: "hand",
            filter: {
              notCardType: "character",
            },
          },
        ],
      },
      {
        targets: [PLAYER_TWO],
      },
    );

    expect(state.revealCalls).toHaveLength(1);
    expect(ctx.framework.state.priority.pendingChoice).toBeUndefined();
    expect(ctx.G.pendingEffects).toHaveLength(0);
    expect(state.zoneCards[`hand:${PLAYER_TWO}`]).toEqual([onlyCharacter]);
  });

  it("fails closed for ambiguous return-from-discard without explicit targets", () => {
    const source = "source" as CardInstanceId;
    const discardOne = "discard-one" as CardInstanceId;
    const discardTwo = "discard-two" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [discardOne]: { id: "discard-one", cardType: "action" },
        [discardTwo]: { id: "discard-two", cardType: "action" },
      },
      zoneCards: {
        [`discard:${PLAYER_ONE}`]: [discardOne, discardTwo],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "return-from-discard",
        count: 1,
        target: "CONTROLLER",
      },
      {},
    );

    expect(state.zoneCards[`discard:${PLAYER_ONE}`]).toEqual([discardOne, discardTwo]);
    expect(state.zoneCards[`hand:${PLAYER_ONE}`] ?? []).toEqual([]);
  });

  it("returns selected discard cards when explicit return-from-discard targets are provided", () => {
    const source = "source" as CardInstanceId;
    const discardOne = "discard-one" as CardInstanceId;
    const discardTwo = "discard-two" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [discardOne]: { id: "discard-one", cardType: "action" },
        [discardTwo]: { id: "discard-two", cardType: "action" },
      },
      zoneCards: {
        [`discard:${PLAYER_ONE}`]: [discardOne, discardTwo],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "return-from-discard",
        count: 1,
        target: "CONTROLLER",
      },
      { targets: [discardTwo] },
    );

    expect(state.zoneCards[`discard:${PLAYER_ONE}`]).toEqual([discardOne]);
    expect(state.zoneCards[`hand:${PLAYER_ONE}`]).toEqual([discardTwo]);
  });

  it("fails closed when explicit return-from-discard targets are invalid", () => {
    const source = "source" as CardInstanceId;
    const discardOne = "discard-one" as CardInstanceId;
    const discardTwo = "discard-two" as CardInstanceId;
    const notInDiscard = "not-in-discard" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [discardOne]: { id: "discard-one", cardType: "action" },
        [discardTwo]: { id: "discard-two", cardType: "action" },
        [notInDiscard]: { id: "not-in-discard", cardType: "action" },
      },
      zoneCards: {
        [`discard:${PLAYER_ONE}`]: [discardOne, discardTwo],
        [`hand:${PLAYER_ONE}`]: [notInDiscard],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "return-from-discard",
        count: 1,
        target: "CONTROLLER",
      },
      { targets: [notInDiscard] },
    );

    expect(state.zoneCards[`discard:${PLAYER_ONE}`]).toEqual([discardOne, discardTwo]);
    expect(state.zoneCards[`hand:${PLAYER_ONE}`]).toEqual([notInDiscard]);
  });

  it("applies temporary cant-quest restrictions", () => {
    const source = "source" as CardInstanceId;
    const target = "target" as CardInstanceId;
    const { ctx, state } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
        [target]: { id: "target", cardType: "character", cost: 2 },
      },
      zoneCards: {
        [`play:${PLAYER_ONE}`]: [target],
      },
    });

    resolveActionEffect(
      ctx,
      createCardPlayedPayload(source, PLAYER_ONE),
      {
        type: "restriction",
        restriction: "cant-quest",
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
      { targets: [target] },
    );

    expect(state.cardMeta[target]?.temporaryRestrictions).toEqual(
      expect.objectContaining({
        "cant-quest": 1,
      }),
    );
  });

  it("fails fast for unsupported player-targeted restriction effects", () => {
    const source = "source" as CardInstanceId;
    const { ctx } = createResolverContext({
      definitions: {
        [source]: { id: "source", cardType: "action" },
      },
    });

    expect(() =>
      resolveActionEffect(
        ctx,
        createCardPlayedPayload(source, PLAYER_ONE),
        {
          type: "restriction",
          restriction: "cant-play-actions",
          target: "OPPONENT",
          duration: "this-turn",
        },
        {},
      ),
    ).toThrow();
  });
});
