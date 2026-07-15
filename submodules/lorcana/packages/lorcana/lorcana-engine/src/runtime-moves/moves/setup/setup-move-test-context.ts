import type {
  BaseCardDefinition,
  CardQueryAPI,
  DeepReadonly,
  MatchState,
  PlayerId,
  RuntimeCardWithDefinition,
  RuntimeCardTargetQuery,
  TimeQueryAPI,
  ZoneQueryAPI,
} from "#core";
import { buildZoneRegistry } from "../../../core/runtime/zone-registry";
import { lorcanaRuntimeZones } from "../../../zones";

export type ValidationContextFor<TMove> = TMove extends {
  validate?: (context: infer TContext) => unknown;
}
  ? TContext
  : never;

export type EnumerateContextFor<TMove> = TMove extends {
  enumerate?: (context: infer TContext) => unknown;
}
  ? TContext
  : never;

type ValidationContextShape = {
  args: unknown;
  playerId: PlayerId;
};

type EnumerateContextShape = {
  playerId: PlayerId;
};

type ContextBuilderOptions = {
  state: DeepReadonly<MatchState>;
  playerIds: readonly PlayerId[];
  playerId?: PlayerId;
};

type ZoneRef = {
  zone: string;
  playerId?: string;
};

type TestCardDefinition = {
  id: string;
  canonicalId: string;
  name: string;
};

const TEST_TIME_QUERY_API: TimeQueryAPI = {
  getRemainingTime: () => 0,
};

function createCardQueryAPI(
  state: DeepReadonly<MatchState>,
  actorPlayerId?: PlayerId,
): CardQueryAPI {
  const getZoneIdsForQuery = (targetDsl: { zones?: readonly string[] }): string[] => {
    const allZoneIds = Object.keys(state.ctx.zones.private.zoneCards);
    const requestedZones = Array.isArray(targetDsl.zones) ? targetDsl.zones : undefined;
    if (!requestedZones || requestedZones.length === 0) {
      return allZoneIds;
    }

    const selected: string[] = [];
    const seen = new Set<string>();
    const add = (zoneId: string) => {
      if (!(zoneId in state.ctx.zones.private.zoneCards) || seen.has(zoneId)) {
        return;
      }
      seen.add(zoneId);
      selected.push(zoneId);
    };

    for (const requestedZone of requestedZones) {
      if (typeof requestedZone !== "string" || requestedZone.length === 0) {
        continue;
      }

      if (requestedZone.includes(":")) {
        add(requestedZone);
        continue;
      }

      add(requestedZone);
      const scopedPrefix = `${requestedZone}:`;
      for (const zoneId of allZoneIds) {
        if (zoneId.startsWith(scopedPrefix)) {
          add(zoneId);
        }
      }
    }

    return selected;
  };

  const getZoneCards = (zoneId: string): RuntimeCardWithDefinition[] => {
    const cardIds = state.ctx.zones.private.zoneCards[zoneId] ?? [];
    return cardIds.map((cardId) => createRuntimeCardView(state, cardId));
  };

  const api = {
    get: (cardId: string) => {
      const entry = state.ctx.zones.private.cardIndex[cardId];
      if (!entry) {
        return undefined;
      }
      return createRuntimeCardView(state, cardId);
    },
    require: (cardId: string) => {
      const card = state.ctx.zones.private.cardIndex[cardId]
        ? createRuntimeCardView(state, cardId)
        : undefined;
      if (!card) {
        throw new Error(`Card ${cardId} is unavailable in setup move test context`);
      }
      return card;
    },
    getDefinition: () => undefined,
    getDefinitionById: () => undefined,
    inZone: (zoneId: string) => getZoneCards(zoneId),
    queryRuntime: <TResult = RuntimeCardWithDefinition>(
      targetDsl: RuntimeCardTargetQuery,
      projector?: (card: RuntimeCardWithDefinition) => TResult,
    ): TResult[] => {
      const owner = targetDsl.owner ?? "any";
      const zoneIds = getZoneIdsForQuery(targetDsl);
      const seenCards = new Set<string>();
      const cards: RuntimeCardWithDefinition[] = [];

      for (const zoneId of zoneIds) {
        for (const card of getZoneCards(zoneId)) {
          if (seenCards.has(card.instanceId)) {
            continue;
          }

          if (owner === "you" && (!actorPlayerId || card.ownerID !== actorPlayerId)) {
            continue;
          }

          if (owner === "opponent" && (!actorPlayerId || card.ownerID === actorPlayerId)) {
            continue;
          }

          seenCards.add(card.instanceId);
          cards.push(card);
        }
      }

      if (!projector) {
        return cards as unknown as TResult[];
      }
      return cards.map((card) => projector(card));
    },
  };

  return api as unknown as CardQueryAPI;
}

function resolveZoneId(
  state: DeepReadonly<MatchState>,
  zoneRegistry: ReturnType<typeof buildZoneRegistry>,
  zoneRef: ZoneRef,
): string {
  if (zoneRef.zone.includes(":")) {
    return zoneRef.zone;
  }

  if (zoneRef.playerId) {
    const scopedZoneId = `${zoneRef.zone}:${zoneRef.playerId}`;
    if (scopedZoneId in state.ctx.zones.private.zoneCards || scopedZoneId in zoneRegistry) {
      return scopedZoneId;
    }
  }

  return zoneRef.zone;
}

function createRuntimeCardView(
  state: DeepReadonly<MatchState>,
  cardId: string,
): RuntimeCardWithDefinition {
  const cardIndex = state.ctx.zones.private.cardIndex[cardId];
  return {
    instanceId: cardId,
    definitionId: cardId,
    definition: {
      id: cardId,
      canonicalId: cardId,
      name: cardId,
    } as unknown as BaseCardDefinition,
    ownerID: cardIndex?.ownerID ?? "unknown",
    controllerID: cardIndex?.controllerID ?? cardIndex?.ownerID ?? "unknown",
    zoneID: cardIndex?.zoneKey,
    zoneIndex: cardIndex?.index,
    meta: state.ctx.zones.private.cardMeta[cardId] ?? {},
  };
}

function createZoneQueryAPI(state: DeepReadonly<MatchState>): ZoneQueryAPI {
  const zoneRegistry = buildZoneRegistry(lorcanaRuntimeZones, state.ctx.playerIds);
  const getCards = (zoneRef: ZoneRef): string[] => {
    const zoneId = resolveZoneId(state, zoneRegistry, zoneRef);
    return [...(state.ctx.zones.private.zoneCards[zoneId] ?? [])];
  };

  return {
    search: (zoneRef, predicate) =>
      getCards(zoneRef).filter((cardId) => predicate(createRuntimeCardView(state, cardId))),
    searchAndPick: (zoneRef, count, predicate) => {
      const cards = getCards(zoneRef);
      if (!predicate) {
        return cards.slice(0, count);
      }
      return cards
        .filter((cardId) => predicate(createRuntimeCardView(state, cardId)))
        .slice(0, count);
    },
    lookAt: (zoneRef, count) => getCards(zoneRef).slice(0, count),
    lookAtTop: (zoneRef, count) => getCards(zoneRef).slice(-count),
    lookAtBottom: (zoneRef, count) => getCards(zoneRef).slice(0, count),
    getCards,
    getCardCount: (zoneRef) => getCards(zoneRef).length,
    getTopCard: (zoneRef) => {
      const cards = getCards(zoneRef);
      return cards[cards.length - 1];
    },
    getBottomCard: (zoneRef) => {
      const cards = getCards(zoneRef);
      return cards[0];
    },
    getCardZone: (cardId) => state.ctx.zones.private.cardIndex[cardId]?.zoneKey,
    getCardOwner: (cardId) => state.ctx.zones.private.cardIndex[cardId]?.ownerID,
    getCardController: (cardId) => state.ctx.zones.private.cardIndex[cardId]?.controllerID,
    isOrdered: (zoneRef) => {
      const zoneId = resolveZoneId(state, zoneRegistry, zoneRef);
      return zoneRegistry[zoneId]?.ordered ?? true;
    },
    isOwnerScoped: (zoneRef) => {
      const zoneId = resolveZoneId(state, zoneRegistry, zoneRef);
      return zoneRegistry[zoneId]?.ownerScoped ?? false;
    },
    getVisibility: (zoneRef) => {
      const zoneId = resolveZoneId(state, zoneRegistry, zoneRef);
      return zoneRegistry[zoneId]?.visibility ?? "private";
    },
  };
}

function createBaseMoveContext({ state, playerIds, playerId }: ContextBuilderOptions) {
  const fallbackPlayerId = playerIds[0];
  const resolvedPlayerId = playerId ?? fallbackPlayerId;

  if (!resolvedPlayerId) {
    throw new Error("setup move test context requires at least one player id");
  }

  const zoneApi = createZoneQueryAPI(state);
  const cardsApi = createCardQueryAPI(state, resolvedPlayerId);
  const frameworkState = {
    priority: state.ctx.priority,
    status: state.ctx.status,
    _zonesPrivate: state.ctx.zones.private,
    playerIds: [...playerIds],
    turn: state.ctx.status.turn,
    phase: state.ctx.status.phase,
    step: state.ctx.status.step,
    gameSegment: state.ctx.status.gameSegment,
    currentPlayer: state.ctx.priority.holder as PlayerId | undefined,
    stateID: state.ctx._stateID,
    matchID: state.ctx.matchID,
    gameID: state.ctx.gameID,
    gameEnded: state.ctx.status.gameEnded,
  };

  return {
    G: state.G,
    playerId: resolvedPlayerId,
    framework: {
      cards: cardsApi,
      state: frameworkState,
      time: TEST_TIME_QUERY_API,
      zones: zoneApi,
    },
  };
}

export function createSetupValidationContext<TContext extends ValidationContextShape>({
  state,
  playerIds,
  args,
  playerId,
  overrides,
}: ContextBuilderOptions & {
  args: TContext["args"];
  overrides?: Partial<TContext>;
}): TContext {
  return {
    ...createBaseMoveContext({ state, playerIds, playerId }),
    input: { args },
    args,
    params: args,
    ...overrides,
  } as unknown as TContext;
}

export function createSetupEnumerateContext<TContext extends EnumerateContextShape>({
  state,
  playerIds,
  playerId,
  overrides,
}: ContextBuilderOptions & {
  playerId: TContext["playerId"];
  overrides?: Partial<TContext>;
}): TContext {
  return {
    ...createBaseMoveContext({ state, playerIds, playerId }),
    ...overrides,
  } as unknown as TContext;
}
