import type { MatchState } from "./types";
import type { MatchStaticResources } from "./static-resources";
import type { TargetDSL } from "@tcg/lorcana-types";
import { getLogger } from "@logtape/logtape";
import type { BaseCardDefinition, BaseCardMeta } from "./card-contracts";
import type { StateScopedValueCache } from "./state-scoped-value-cache";

const logger = getLogger(["core-engine", "card-runtime"]);

type CardPublicId = string;
type CardInstanceId = string;

export type { BaseCardDefinition, BaseCardMeta } from "./card-contracts";

export type StaticCard = BaseCardDefinition;

export interface RuntimeCardBase {
  instanceId: string;
  definitionId: string;
  ownerID: string;
  controllerID: string;
  zoneID?: string;
  zoneIndex?: number;
  meta: BaseCardMeta;
}

export interface RuntimeCardWithDefinitionBase extends RuntimeCardBase {
  definition: StaticCard;
}

export type RuntimeCard = RuntimeCardBase & Omit<{}, keyof RuntimeCardBase>;

export type RuntimeCardWithDefinition = RuntimeCardWithDefinitionBase &
  Omit<{}, keyof RuntimeCardWithDefinitionBase>;

export type AnyRuntimeCardWithDefinition = RuntimeCardWithDefinitionBase;

export interface RuntimeCardDeriveContext {
  cardId: CardInstanceId;
  card: RuntimeCardWithDefinitionBase;
  actorPlayerId?: string;
  state: MatchState;
  staticResources: MatchStaticResources;
  runtimeCardCache?: StateScopedValueCache<unknown>;
}

export type RuntimeCardDeriver = (context: RuntimeCardDeriveContext) => Record<string, unknown>;

export type RuntimeCardTargetQuery = {
  owner?: TargetDSL["owner"];
  zones?: readonly string[];
  selector?: TargetDSL["selector"];
  count?: TargetDSL["count"];
  cardTypes?: readonly string[];
  excludeSelf?: boolean;
  context?: { self?: boolean } & Record<string, unknown>;
  sourceCardId?: string;
} & Record<string, unknown>;

export interface CardQueryAPI {
  get(cardId: string): RuntimeCardWithDefinition | undefined;
  require(cardId: string): RuntimeCardWithDefinition;
  getDefinition(cardId: string): BaseCardDefinition | undefined;
  getDefinitionById(definitionId: string): BaseCardDefinition | undefined;
  getMeta(cardId: string): BaseCardMeta | undefined;
  inZone(zoneId: string): RuntimeCardWithDefinition[];
  queryTargetDsl?<TResult = RuntimeCardWithDefinition>(
    targetDsl: RuntimeCardTargetQuery,
    projector?: (card: RuntimeCardWithDefinition) => TResult,
  ): TResult[];
  queryRuntime<TResult = RuntimeCardWithDefinition>(
    targetDsl: RuntimeCardTargetQuery,
    projector?: (card: RuntimeCardWithDefinition) => TResult,
  ): TResult[];
}

interface CardQueryOptions {
  actorPlayerId?: string;
  deriveRuntimeCard: RuntimeCardDeriver;
  runtimeCardCache?: StateScopedValueCache<unknown>;
  cacheViews?: boolean;
}

export const cardQueryRuntimeInternalsSymbol = Symbol("cardQueryRuntimeInternals");

export interface CardQueryRuntimeInternals {
  actorPlayerId?: string;
  state: MatchState;
  staticResources: MatchStaticResources;
  runtimeCardCache?: StateScopedValueCache<unknown>;
  cacheViews: boolean;
}

export function getCardQueryRuntimeInternals(
  api: CardQueryAPI | undefined,
): CardQueryRuntimeInternals | undefined {
  if (!api) {
    return undefined;
  }

  return (api as CardQueryAPI & { [cardQueryRuntimeInternalsSymbol]?: CardQueryRuntimeInternals })[
    cardQueryRuntimeInternalsSymbol
  ];
}

export function createCardQueryAPI(
  state: MatchState,
  staticResources: MatchStaticResources,
  options: CardQueryOptions,
): CardQueryAPI {
  type RuntimeView = RuntimeCardWithDefinition;
  type RuntimeBaseView = RuntimeCardWithDefinitionBase;

  const zones = state.ctx.zones;
  const actorPlayerId = options?.actorPlayerId;
  const deriveRuntimeCard = options.deriveRuntimeCard;
  const cacheViews = options.cacheViews ?? true;
  // Auto-bust the per-API view cache whenever the underlying _stateID advances.
  // The cache is short-lived (one cardsApi instance), but defensively keying it on
  // _stateID ensures any future caller that reuses an API across a state mutation
  // observes fresh values instead of stale projections.
  const cardViewCache = new Map<CardInstanceId, RuntimeView>();
  let cardViewCacheStateID: number | undefined;

  const readCurrentStateID = (): number | undefined => {
    const candidate = (state.ctx as { _stateID?: unknown })._stateID;
    return typeof candidate === "number" && Number.isFinite(candidate) ? candidate : undefined;
  };

  const buildCardView = (cardId: CardInstanceId): RuntimeView => {
    if (cacheViews) {
      const currentStateID = readCurrentStateID();
      if (currentStateID !== cardViewCacheStateID) {
        cardViewCache.clear();
        cardViewCacheStateID = currentStateID;
      }
      const cached = cardViewCache.get(cardId);
      if (cached) {
        return cached;
      }
    }

    const instance = staticResources.instances.get(cardId);
    if (!instance) {
      logger.fatal(`CARD_INSTANCE_NOT_REGISTERED: ${cardId}`);
      throw new Error(`CARD_INSTANCE_NOT_REGISTERED: ${cardId}`);
    }

    const definition = staticResources.cards.get(instance.definitionId);
    if (definition === undefined) {
      logger.fatal(`CARD_DEFINITION_NOT_FOUND: ${instance.definitionId}`);
      throw new Error(
        `CARD_DEFINITION_NOT_FOUND: instance ${cardId} -> definition ${instance.definitionId}`,
      );
    }

    const indexEntry = zones.private.cardIndex[cardId];
    const meta = (zones.private.cardMeta[cardId] ?? {}) as BaseCardMeta;

    const baseCard: RuntimeBaseView = {
      instanceId: cardId,
      definitionId: instance.definitionId,
      definition,
      ownerID: indexEntry?.ownerID ?? instance.ownerID,
      controllerID: indexEntry?.controllerID ?? indexEntry?.ownerID ?? instance.ownerID,
      zoneID: indexEntry?.zoneKey,
      zoneIndex: indexEntry?.index,
      meta,
    };

    const derived = deriveRuntimeCard({
      cardId,
      card: baseCard,
      actorPlayerId,
      state,
      staticResources,
      runtimeCardCache: options.runtimeCardCache,
    });

    // Spread derived first, then baseCard so base fields always win
    // This prevents derivers from accidentally overriding core fields
    const runtimeView = {
      ...derived,
      ...baseCard,
    };

    if (cacheViews) {
      cardViewCache.set(cardId, runtimeView);
    }
    return runtimeView;
  };

  const normalizeOwner = (value: unknown): "you" | "opponent" | "any" => {
    if (value === undefined || value === null) {
      return "any";
    }

    if (value === "you" || value === "opponent" || value === "any") {
      return value;
    }
    // Throw for invalid values to fail fast and catch bugs early
    throw new Error(`Invalid owner value: ${String(value)}. Expected "you", "opponent", or "any".`);
  };

  const collectZoneIds = (targetDsl: RuntimeCardTargetQuery): string[] => {
    const zoneIds = Object.keys(zones.private.zoneCards);
    const requestedZones = Array.isArray(targetDsl.zones) ? targetDsl.zones : undefined;
    const selected: string[] = [];
    const seen = new Set<string>();

    const addZone = (zoneId: string) => {
      if (!zoneId || seen.has(zoneId) || !(zoneId in zones.private.zoneCards)) {
        return;
      }

      seen.add(zoneId);
      selected.push(zoneId);
    };

    if (!requestedZones || requestedZones.length === 0) {
      for (const zoneId of zoneIds) {
        addZone(zoneId);
      }
      return selected;
    }

    for (const requestedZone of requestedZones) {
      if (typeof requestedZone !== "string" || requestedZone.length === 0) {
        continue;
      }

      if (requestedZone.includes(":")) {
        addZone(requestedZone);
        continue;
      }

      addZone(requestedZone);
      const scopedPrefix = `${requestedZone}:`;
      for (const zoneId of zoneIds) {
        if (zoneId.startsWith(scopedPrefix)) {
          addZone(zoneId);
        }
      }
    }

    return selected;
  };

  const queryTargetDsl = <TResult = RuntimeView>(
    targetDsl: RuntimeCardTargetQuery,
    projector?: (card: RuntimeView) => TResult,
  ): TResult[] => {
    const owner = normalizeOwner(targetDsl.owner);
    if ((owner === "you" || owner === "opponent") && !actorPlayerId) {
      return [];
    }

    const sourceCardId =
      typeof targetDsl.sourceCardId === "string" && targetDsl.sourceCardId.length > 0
        ? targetDsl.sourceCardId
        : undefined;
    const includeOnlySelf = Boolean(
      targetDsl.context &&
      typeof targetDsl.context === "object" &&
      (targetDsl.context as { self?: unknown }).self === true &&
      sourceCardId,
    );
    const zoneIds = collectZoneIds(targetDsl);
    const seenCards = new Set<string>();
    const cards: RuntimeView[] = [];

    const requestedCardTypes = Array.isArray(targetDsl.cardTypes)
      ? targetDsl.cardTypes.filter((cardType): cardType is string => typeof cardType === "string")
      : typeof targetDsl.cardType === "string"
        ? [targetDsl.cardType]
        : [];
    const cardTypeSet = new Set(requestedCardTypes);
    const shouldExcludeSelf = targetDsl.excludeSelf === true && Boolean(sourceCardId);

    const pushIfEligible = (cardId: string) => {
      if (seenCards.has(cardId)) {
        return;
      }

      if (shouldExcludeSelf && sourceCardId && cardId === sourceCardId) {
        return;
      }

      const card = buildCardView(cardId);
      if (!card) {
        return;
      }

      if (owner === "you" && card.ownerID !== actorPlayerId) {
        return;
      }

      if (owner === "opponent" && card.ownerID === actorPlayerId) {
        return;
      }

      if (cardTypeSet.size > 0) {
        const definition = card.definition as { cardType?: unknown };
        if (typeof definition?.cardType !== "string" || !cardTypeSet.has(definition.cardType)) {
          return;
        }
      }

      seenCards.add(cardId);
      cards.push(card);
    };

    if (includeOnlySelf && sourceCardId) {
      pushIfEligible(sourceCardId);
    } else {
      for (const zoneId of zoneIds) {
        const cardIds = zones.private.zoneCards[zoneId] ?? [];
        for (const cardId of cardIds) {
          pushIfEligible(cardId);
        }
      }
    }

    if (!projector) {
      return cards as TResult[];
    }

    return cards.map((card) => projector(card));
  };

  const api = {
    get(cardId: CardInstanceId): RuntimeView | undefined {
      return buildCardView(cardId);
    },

    require(cardId: CardInstanceId): RuntimeView {
      const instance = staticResources.instances.get(cardId);
      if (!instance) {
        throw new Error(`CARD_INSTANCE_NOT_REGISTERED: ${cardId}`);
      }

      const definition = staticResources.cards.get(instance.definitionId);
      if (definition === undefined) {
        throw new Error(
          `CARD_DEFINITION_NOT_FOUND: instance ${cardId} -> definition ${instance.definitionId}`,
        );
      }

      const card = buildCardView(cardId);
      if (!card) {
        // Should be unreachable after checks above, but keep a deterministic error.
        throw new Error(`RUNTIME_CARD_RESOLUTION_FAILED: ${cardId}`);
      }

      return card;
    },

    getDefinition(cardId: CardInstanceId): BaseCardDefinition | undefined {
      const instance = staticResources.instances.get(cardId);
      if (!instance) {
        return undefined;
      }
      return staticResources.cards.get(instance.definitionId);
    },

    getDefinitionById(definitionId: CardPublicId): BaseCardDefinition | undefined {
      return staticResources.cards.get(definitionId);
    },

    getMeta(cardId: string): BaseCardMeta | undefined {
      return zones.private.cardMeta[cardId] as BaseCardMeta | undefined;
    },

    inZone(zoneId: string): RuntimeView[] {
      const cardIds = zones.private.zoneCards[zoneId] || [];
      const cards: RuntimeView[] = [];

      for (const cardId of cardIds) {
        const view = buildCardView(cardId);
        if (view) {
          cards.push(view);
        }
      }

      return cards;
    },

    queryTargetDsl,

    queryRuntime<TResult = RuntimeView>(
      targetDsl: RuntimeCardTargetQuery,
      projector?: (card: RuntimeView) => TResult,
    ): TResult[] {
      return queryTargetDsl(targetDsl, projector);
    },
  };

  (
    api as CardQueryAPI & {
      [cardQueryRuntimeInternalsSymbol]?: CardQueryRuntimeInternals;
    }
  )[cardQueryRuntimeInternalsSymbol] = {
    actorPlayerId,
    state,
    staticResources,
    runtimeCardCache: options.runtimeCardCache,
    cacheViews,
  };

  return api;
}
