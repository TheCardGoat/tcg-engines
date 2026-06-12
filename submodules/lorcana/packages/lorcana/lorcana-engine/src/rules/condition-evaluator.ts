import type { CardInstanceId, DeepReadonly, PlayerId } from "#core";
import type {
  Condition,
  ConditionComparison,
  ConditionComparisonOperator,
  ComparisonValue,
  LorcanaCardDefinition,
  TargetAggregateComparisonCondition,
  TargetQueryCondition,
  TurnMetricCondition,
  PlayContextCondition,
  ResourceCountCondition,
  HasItemCountCondition,
  HasLocationCountCondition,
} from "@tcg/lorcana-types";

/**
 * Authoritative list of condition discriminators handled by `evaluateCondition`'s
 * runtime switch below. Drives the per-variant test coverage enforcement in
 * `rules/conditions/__tests__/_coverage.test.ts`.
 *
 * When adding a new `case "<type>":` branch to `evaluateCondition`, add the
 * same discriminator here. The `satisfies` guard on `CONDITION_VARIANT_TYPE_CHECK`
 * below prevents typos: every entry must be assignable to `Condition["type"]`.
 *
 * See `packages/lorcana/lorcana-engine/AGENTS.md` → "How to add a condition".
 */
export const CONDITION_VARIANT_TYPES = [
  "and",
  "at-location",
  "banished-in-challenge-this-turn",
  "being-challenged",
  "comparison",
  "damage-comparison",
  "discarded-card-has-classification",
  "during-turn",
  "exerted",
  "first-turn-non-otp",
  "has-another-character",
  "has-any-damage",
  "has-card-under",
  "has-character-count",
  "has-character-with-classification",
  "has-character-with-keyword",
  "has-character-with-strength",
  "has-granted-ability",
  "has-item-count",
  "has-location-count",
  "has-location-in-play",
  "has-named-character",
  "has-named-item",
  "has-no-damage",
  "if",
  "if-you-do",
  "in-challenge",
  "inkwell-count",
  "is-exerted",
  "is-named",
  "lore",
  "no-damage",
  "not",
  "opponent-has-damaged-character",
  "or",
  "play-context",
  "put-card-under-any-this-turn",
  "put-card-under-self-this-turn",
  "resource-count",
  "returned-card-has-classification",
  "returned-card-is-named",
  "returned-card-is-princess",
  "revealed-is-card-type",
  "revealed-is-character-named",
  "revealed-matches-chosen-name",
  "revealed-matches-named",
  "self-has-damage",
  "stat-threshold",
  "strength",
  "target-aggregate-comparison",
  "target-query",
  "trigger-subject-had-card-under",
  "turn",
  "turn-metric",
  "used-shift",
  "willpower",
  "your-turn",
] as const;

export type ConditionVariantType = (typeof CONDITION_VARIANT_TYPES)[number];

// Note: this list mirrors the runtime `evaluateCondition` switch below. Some
// entries (e.g. `"strength"`, `"is-named"`, `"is-exerted"`) are legacy parser
// aliases without a matching `Condition` interface; keeping them as plain
// strings means we enforce test coverage at runtime rather than compile time.
// The coverage test in `rules/conditions/__tests__/_coverage.test.ts` verifies
// that every entry has a dedicated test file.
import type { LorcanaG, CardPlayedPayload, LorcanaMatchState } from "../types";
import type { ActionResolutionInput } from "../runtime-moves/resolution/action-effects/types";
import { cardHasName } from "../card-utils";
import {
  getEffectiveLore,
  getEffectiveStrength,
  getEffectiveWillpower,
  type DerivedStateContext,
} from "./derived-state";
import type { StaticEffectRegistry } from "./static-effect-registry";
import { compareOperator } from "./operator-utils";
import type { ZoneRuntimeState } from "../core/runtime/types";
import { normalizeSelectedTargets, resolveTargetQuery } from "../targeting/runtime";
import { didLastEffectPerform } from "../runtime-moves/resolution/action-effects/event-snapshot-utils";
import { getCombinedSelectionInput } from "../runtime-moves/resolution/action-effects/selection-state";
import { resolveTurnOwnerId } from "../core/runtime/turn-owner";

export interface PlayZoneCardTypeCache {
  charactersByPlayer: Map<PlayerId, CardInstanceId[]>;
  itemsByPlayer: Map<PlayerId, CardInstanceId[]>;
  locationsByPlayer: Map<PlayerId, CardInstanceId[]>;
  damagedCharacterCountByPlayer: Map<PlayerId, number>;
  exertedCharacterCountByPlayer: Map<PlayerId, number>;
}

export interface ConditionEvaluationContext {
  framework: {
    state: {
      priority: DeepReadonly<LorcanaMatchState["ctx"]["priority"]>;
      status: DeepReadonly<LorcanaMatchState["ctx"]["status"]>;
      _zonesPrivate?: DeepReadonly<ZoneRuntimeState["private"]>;
      playerIds: readonly PlayerId[];
      currentPlayer?: PlayerId;
    };
    zones: {
      getCards: (query: { zone: string; playerId: PlayerId }) => readonly string[];
      getCardZone?: (cardId: CardInstanceId) => string | undefined;
      getCardOwner?: (cardId: string) => string | undefined;
    };
  };
  cards: {
    getDefinition: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
    require: (cardId: CardInstanceId) => { meta?: Record<string, unknown> };
    get?: (cardId: CardInstanceId) => { definition?: LorcanaCardDefinition } | undefined;
  };
  G: DeepReadonly<LorcanaG>;
  playerId: PlayerId;
  sourceCardId?: CardInstanceId;
  getCardStrengthByInstanceId?: (cardId: CardInstanceId) => number;
  getCardWillpowerByInstanceId?: (cardId: CardInstanceId) => number;
  zoneTypeCache?: PlayZoneCardTypeCache;
  disableFilterRegistry?: boolean;

  // Optional action-specific context
  cardPlayed?: CardPlayedPayload;
  resolutionInput?: ActionResolutionInput;
  registry?: StaticEffectRegistry;
}

function buildDerivedStateFromConditionCtx(ctx: ConditionEvaluationContext): DerivedStateContext {
  return {
    ctx: {
      priority: ctx.framework.state.priority,
      status: ctx.framework.state.status,
      zones: ctx.framework.state._zonesPrivate
        ? { private: ctx.framework.state._zonesPrivate }
        : undefined,
    },
    G: ctx.G,
  };
}

const DEFAULT_EXISTS_COMPARISON: ConditionComparison = {
  operator: "gte",
  value: 1,
};

function resolveComparisonValue(value: ComparisonValue, ctx: ConditionEvaluationContext): number {
  switch (value.type) {
    case "constant":
      return value.value;
    case "lore":
      return ctx.G.lore[playerIdForScope(value.controller, ctx)] ?? 0;
    case "cards-in-hand":
      return countCardsInZoneForScope("hand", value.controller, ctx);
    case "cards-in-inkwell":
      return countCardsInZoneForScope("inkwell", value.controller, ctx);
    case "character-count":
      return countCardsOfTypeInPlayForScope("character", value.controller, ctx);
    case "item-count":
      return countCardsOfTypeInPlayForScope("item", value.controller, ctx);
    case "damage-on-self":
      return ctx.sourceCardId ? Number(ctx.cards.require(ctx.sourceCardId).meta?.damage ?? 0) : 0;
    case "strength-of-self": {
      if (!ctx.sourceCardId) {
        return 0;
      }
      const derivedState = buildDerivedStateFromConditionCtx(ctx);
      const definition = ctx.cards.getDefinition(ctx.sourceCardId);

      return getEffectiveStrength(
        definition,
        derivedState,
        ctx.sourceCardId,
        ctx.cards.getDefinition,
        ctx.registry,
      );
    }
  }
}

function playerIdForScope(
  controller: "you" | "opponent",
  ctx: ConditionEvaluationContext,
): PlayerId {
  if (controller === "you") {
    return ctx.playerId;
  }

  return (
    ctx.framework.state.playerIds.find((playerId) => playerId !== ctx.playerId) ?? ctx.playerId
  );
}

function countCardsInZoneForScope(
  zone: string,
  controller: "you" | "opponent",
  ctx: ConditionEvaluationContext,
): number {
  return ctx.framework.zones.getCards({
    zone,
    playerId: playerIdForScope(controller, ctx),
  }).length;
}

function countCardsOfTypeInPlayForScope(
  cardType: "character" | "item" | "location",
  controller: "you" | "opponent",
  ctx: ConditionEvaluationContext,
): number {
  return countCardsOfTypeInPlay(ctx, playerIdForScope(controller, ctx), cardType);
}

function getSelectedTargets(ctx: ConditionEvaluationContext): CardInstanceId[] {
  return ctx.resolutionInput
    ? (normalizeSelectedTargets(getCombinedSelectionInput(ctx.resolutionInput)) ?? [])
    : [];
}

function resolveScopedPlayerIds(
  scope: "you" | "opponent" | "any" | "active" | undefined,
  controllerId: PlayerId,
  allPlayers: readonly PlayerId[],
  activePlayerId?: PlayerId,
): PlayerId[] {
  switch (scope) {
    case "you":
      return [controllerId];
    case "opponent":
      return allPlayers.filter((playerId) => playerId !== controllerId);
    case "active":
      return activePlayerId ? [activePlayerId] : [controllerId];
    case "any":
    default:
      return [...allPlayers];
  }
}

function evaluateTargetQueryCondition(
  condition: TargetQueryCondition,
  ctx: ConditionEvaluationContext,
): boolean {
  // Create a pseudo cardPlayed if missing, using sourceCardId or a dummy
  const cardPlayed: CardPlayedPayload = ctx.cardPlayed ?? {
    cardId: ctx.sourceCardId ?? ("unknown" as CardInstanceId),
    playerId: ctx.playerId,
    cardType: "action", // Dummy
    costType: "free",
  };

  const result = resolveTargetQuery(ctx as any, cardPlayed, condition.query, {
    sourceCardId: ctx.sourceCardId ?? cardPlayed.cardId,
    selectedTargets: getSelectedTargets(ctx),
    eventSnapshot: ctx.resolutionInput?.eventSnapshot,
    strictUnknownFilters: true,
    controllerId: ctx.playerId,
  });

  const count = result.kind === "card" ? result.cardIds.length : result.playerIds.length;
  const comparison = condition.comparison ?? DEFAULT_EXISTS_COMPARISON;
  return compareOperator(count, comparison.operator, comparison.value);
}

function getCardNumericAttribute(
  ctx: ConditionEvaluationContext,
  cardId: CardInstanceId,
  attribute: TargetAggregateComparisonCondition["left"]["attribute"],
): number {
  const definition = ctx.cards.getDefinition(cardId);

  switch (attribute) {
    case "strength": {
      if (ctx.getCardStrengthByInstanceId) {
        return ctx.getCardStrengthByInstanceId(cardId);
      }
      return getEffectiveStrength(
        definition,
        buildDerivedStateFromConditionCtx(ctx),
        cardId,
        ctx.cards.getDefinition,
        ctx.registry,
      );
    }
    case "willpower":
      return getEffectiveWillpower(
        definition,
        buildDerivedStateFromConditionCtx(ctx),
        cardId,
        ctx.cards.getDefinition,
        ctx.registry,
      );
    case "cost":
      return Number(definition?.cost ?? 0);
    case "lore":
      return getEffectiveLore(
        definition,
        buildDerivedStateFromConditionCtx(ctx),
        cardId,
        ctx.cards.getDefinition,
        ctx.registry,
      );
    case "damage":
      return Number(ctx.cards.require(cardId).meta?.damage ?? 0);
    default:
      return 0;
  }
}

function reduceAggregate(
  values: number[],
  aggregate: TargetAggregateComparisonCondition["left"]["aggregate"],
): number | undefined {
  if (values.length === 0) {
    return undefined;
  }

  switch (aggregate ?? "max") {
    case "count":
      return values.length;
    case "min":
      return Math.min(...values);
    case "sum":
      return values.reduce((total, value) => total + value, 0);
    case "max":
    default:
      return Math.max(...values);
  }
}

function evaluateTargetAggregateComparisonCondition(
  condition: TargetAggregateComparisonCondition,
  ctx: ConditionEvaluationContext,
): boolean {
  const cardPlayed: CardPlayedPayload = ctx.cardPlayed ?? {
    cardId: ctx.sourceCardId ?? ("unknown" as CardInstanceId),
    playerId: ctx.playerId,
    cardType: "action",
    costType: "free",
  };

  const queryContext = {
    sourceCardId: ctx.sourceCardId ?? cardPlayed.cardId,
    selectedTargets: getSelectedTargets(ctx),
    eventSnapshot: ctx.resolutionInput?.eventSnapshot,
    strictUnknownFilters: true,
    controllerId: ctx.playerId,
  };

  const leftResult = resolveTargetQuery(ctx as any, cardPlayed, condition.left.query, queryContext);
  const rightResult = resolveTargetQuery(
    ctx as any,
    cardPlayed,
    condition.right.query,
    queryContext,
  );
  if (leftResult.kind !== "card" || rightResult.kind !== "card") {
    return false;
  }

  if (condition.requireLeftNonEmpty && leftResult.cardIds.length === 0) {
    return false;
  }

  if (rightResult.cardIds.length === 0 && condition.ifRightEmpty === "pass") {
    return !condition.requireLeftNonEmpty || leftResult.cardIds.length > 0;
  }

  const leftValues = leftResult.cardIds.map((cardId) =>
    getCardNumericAttribute(ctx, cardId, condition.left.attribute),
  );
  const rightValues = rightResult.cardIds.map((cardId) =>
    getCardNumericAttribute(ctx, cardId, condition.right.attribute),
  );

  const leftAggregate = reduceAggregate(leftValues, condition.left.aggregate);
  const rightAggregate = reduceAggregate(rightValues, condition.right.aggregate);

  if (leftAggregate === undefined || rightAggregate === undefined) {
    return false;
  }

  return compareOperator(leftAggregate, condition.comparison, rightAggregate);
}

function countCardsPlayedThisTurnMatching(
  ctx: ConditionEvaluationContext,
  predicate: (definition: LorcanaCardDefinition | undefined) => boolean,
  excludeSourceCardId?: CardInstanceId,
): number {
  const cardsPlayedThisTurn = ctx.G.turnMetadata?.cardsPlayedThisTurn ?? [];
  return cardsPlayedThisTurn.reduce((count, cardId) => {
    if (excludeSourceCardId && cardId === excludeSourceCardId) return count;
    return predicate(ctx.cards.getDefinition(cardId)) ? count + 1 : count;
  }, 0);
}

function resolveScopedPlayerCount(
  countsByPlayer: Record<PlayerId, number> | undefined,
  scope: "you" | "opponent" | "any" | undefined,
  controllerId: PlayerId,
  allPlayers: readonly PlayerId[],
): number {
  const counts = countsByPlayer ?? {};
  switch (scope ?? "you") {
    case "you":
      return counts[controllerId] ?? 0;
    case "opponent":
      return allPlayers
        .filter((playerId) => playerId !== controllerId)
        .reduce((total, playerId) => total + (counts[playerId] ?? 0), 0);
    case "any":
      return allPlayers.reduce((total, playerId) => total + (counts[playerId] ?? 0), 0);
    default:
      return 0;
  }
}

function evaluateTurnMetricCondition(
  condition: TurnMetricCondition,
  ctx: ConditionEvaluationContext,
): boolean {
  const comparison = condition.comparison ?? DEFAULT_EXISTS_COMPARISON;
  const controllerId = ctx.playerId;

  let value = 0;
  switch (condition.metric) {
    case "played-songs":
      value = countCardsPlayedThisTurnMatching(
        ctx,
        (definition) => definition?.cardType === "action" && definition?.actionSubtype === "song",
      );
      break;

    case "played-actions":
      value = countCardsPlayedThisTurnMatching(
        ctx,
        (definition) => definition?.cardType === "action",
      );
      break;

    case "played-character-with-classification":
      value = countCardsPlayedThisTurnMatching(
        ctx,
        (definition) =>
          definition?.cardType === "character" &&
          (typeof condition.classification !== "string" ||
            (Array.isArray(definition.classifications) &&
              (definition.classifications as readonly string[]).includes(
                condition.classification,
              ))),
        condition.excludeSource ? ctx.sourceCardId : undefined,
      );
      break;

    case "cards-inked":
      value =
        ctx.G.turnMetadata?.cardsPutIntoInkwellThisTurn?.length ??
        ctx.G.turnMetadata?.inkedThisTurn?.length ??
        0;
      break;

    case "challenges-by-player":
      value = resolveScopedPlayerCount(
        ctx.G.turnMetadata?.challengesByPlayerThisTurn,
        condition.playerScope,
        controllerId,
        ctx.framework.state.playerIds,
      );
      break;

    case "banished-characters": {
      const banished = ctx.G.turnMetadata?.banishedCharactersThisTurn ?? [];
      const targetName =
        typeof condition.name === "string" && condition.name.length > 0
          ? condition.name
          : undefined;
      const targetClassification =
        typeof condition.classification === "string" && condition.classification.length > 0
          ? condition.classification
          : undefined;
      const ownerScope = condition.ownerScope;
      const getCardOwner = ctx.framework.zones.getCardOwner;

      const hasDefinitionFilter = targetName !== undefined || targetClassification !== undefined;

      value = banished.reduce((count, cardId) => {
        const definition = ctx.cards.getDefinition(cardId);
        if (hasDefinitionFilter && !definition) {
          return count;
        }
        if (targetName && definition?.name !== targetName) {
          return count;
        }
        if (
          targetClassification &&
          !(definition?.classifications ?? []).includes(targetClassification)
        ) {
          return count;
        }
        if (ownerScope && ownerScope !== "any" && getCardOwner) {
          const ownerId = getCardOwner(cardId) as PlayerId | undefined;
          if (!ownerId) {
            return count;
          }
          if (ownerScope === "you" && ownerId !== controllerId) {
            return count;
          }
          if (ownerScope === "opponent" && ownerId === controllerId) {
            return count;
          }
        }
        return count + 1;
      }, 0);
      break;
    }

    case "damaged-characters-by-owner":
      value = resolveScopedPlayerCount(
        ctx.G.turnMetadata?.damagedCharactersByOwnerThisTurn,
        condition.ownerScope,
        controllerId,
        ctx.framework.state.playerIds,
      );
      break;

    case "damage-removed-by-player":
      value = resolveScopedPlayerCount(
        ctx.G.turnMetadata?.damageRemovedByPlayerThisTurn,
        condition.playerScope,
        controllerId,
        ctx.framework.state.playerIds,
      );
      break;

    case "discard-cards-left":
      value = ctx.G.turnMetadata?.discardCardsLeftThisTurn ?? 0;
      break;

    case "discard-cards-entered":
      value = resolveScopedPlayerCount(
        ctx.G.turnMetadata?.cardsPutIntoDiscardThisTurnByOwner,
        condition.ownerScope,
        controllerId,
        ctx.framework.state.playerIds,
      );
      break;

    case "quested-characters": {
      const questing = ctx.G.turnMetadata?.charactersQuesting ?? [];
      value = condition.excludeSource
        ? questing.filter((cardId) => cardId !== ctx.sourceCardId).length
        : questing.length;
      break;
    }

    case "played-cards":
      value = ctx.G.turnMetadata?.cardsPlayedThisTurn?.length ?? 0;
      break;

    case "cards-drawn-by-player":
      value = resolveScopedPlayerCount(
        ctx.G.turnMetadata?.cardsDrawnThisTurnByPlayer ?? {},
        condition.playerScope,
        controllerId,
        ctx.framework.state.playerIds,
      );
      break;

    default:
      value = 0;
      break;
  }

  return compareOperator(value, comparison.operator, comparison.value);
}

function evaluatePlayContextCondition(
  condition: PlayContextCondition,
  cardPlayed?: CardPlayedPayload,
  eventSnapshot?: ActionResolutionInput["eventSnapshot"],
): boolean {
  switch (condition.context) {
    case "used-shift": {
      const usedShift = cardPlayed?.usedShift ?? eventSnapshot?.playedCardUsedShift ?? false;
      if (!condition.comparison) {
        return usedShift === true;
      }
      return compareOperator(
        usedShift === true ? 1 : 0,
        condition.comparison.operator,
        condition.comparison.value,
      );
    }

    case "characters-sang-this-song": {
      const singerCount =
        (Array.isArray(cardPlayed?.singerIds) ? cardPlayed?.singerIds.length : undefined) ??
        eventSnapshot?.playedCardSingerCount ??
        0;
      const comparison = condition.comparison ?? DEFAULT_EXISTS_COMPARISON;
      return compareOperator(singerCount, comparison.operator, comparison.value);
    }

    default:
      return false;
  }
}

function countCardsOfTypeInPlay(
  ctx: ConditionEvaluationContext,
  playerId: PlayerId,
  expectedType: "character" | "item" | "location",
): number {
  if (ctx.zoneTypeCache) {
    const map =
      expectedType === "character"
        ? ctx.zoneTypeCache.charactersByPlayer
        : expectedType === "item"
          ? ctx.zoneTypeCache.itemsByPlayer
          : ctx.zoneTypeCache.locationsByPlayer;
    return map.get(playerId)?.length ?? 0;
  }
  return ctx.framework.zones
    .getCards({ zone: "play", playerId })
    .filter(
      (cardId) => ctx.cards.getDefinition(cardId as CardInstanceId)?.cardType === expectedType,
    ).length;
}

export interface DamagedCharactersContext {
  framework: {
    zones: {
      getCards: (query: { zone: string; playerId: PlayerId }) => readonly string[];
    };
  };
  cards: {
    getDefinition: (cardId: CardInstanceId) => { id: string; cardType?: string } | undefined;
    require: (cardId: CardInstanceId) => { meta?: Record<string, unknown> };
  };
}

export function countDamagedCharactersInPlay(
  ctx: DamagedCharactersContext,
  playerId: PlayerId,
  zoneTypeCache?: PlayZoneCardTypeCache,
): number {
  if (zoneTypeCache) {
    return zoneTypeCache.damagedCharacterCountByPlayer.get(playerId) ?? 0;
  }
  return ctx.framework.zones.getCards({ zone: "play", playerId }).filter((cardId) => {
    if (ctx.cards.getDefinition(cardId as CardInstanceId)?.cardType !== "character") {
      return false;
    }

    return Number(ctx.cards.require(cardId as CardInstanceId).meta?.damage ?? 0) > 0;
  }).length;
}

function countExertedCharactersInPlay(ctx: ConditionEvaluationContext, playerId: PlayerId): number {
  if (ctx.zoneTypeCache) {
    return ctx.zoneTypeCache.exertedCharacterCountByPlayer.get(playerId) ?? 0;
  }
  return ctx.framework.zones.getCards({ zone: "play", playerId }).filter((cardId) => {
    if (ctx.cards.getDefinition(cardId as CardInstanceId)?.cardType !== "character") {
      return false;
    }

    return ctx.cards.require(cardId as CardInstanceId).meta?.state === "exerted";
  }).length;
}

export function buildPlayZoneCardTypeCache(ctx: {
  framework: {
    zones: { getCards: (query: { zone: string; playerId: PlayerId }) => readonly string[] };
    state: { playerIds: readonly PlayerId[] };
  };
  cards: {
    getDefinition: (cardId: CardInstanceId) => { cardType?: string } | undefined;
    require: (cardId: CardInstanceId) => { meta?: Record<string, unknown> };
  };
}): PlayZoneCardTypeCache {
  const charactersByPlayer = new Map<PlayerId, CardInstanceId[]>();
  const itemsByPlayer = new Map<PlayerId, CardInstanceId[]>();
  const locationsByPlayer = new Map<PlayerId, CardInstanceId[]>();
  const damagedCharacterCountByPlayer = new Map<PlayerId, number>();
  const exertedCharacterCountByPlayer = new Map<PlayerId, number>();

  for (const playerId of ctx.framework.state.playerIds) {
    const chars: CardInstanceId[] = [];
    const items: CardInstanceId[] = [];
    const locs: CardInstanceId[] = [];
    let damagedCount = 0;
    let exertedCount = 0;

    for (const rawCardId of ctx.framework.zones.getCards({ zone: "play", playerId })) {
      const cardId = rawCardId as CardInstanceId;
      const cardType = ctx.cards.getDefinition(cardId)?.cardType;
      if (cardType === "character") {
        chars.push(cardId);
        const meta = ctx.cards.require(cardId).meta;
        if (Number(meta?.damage ?? 0) > 0) damagedCount++;
        if (meta?.state === "exerted") exertedCount++;
      } else if (cardType === "item") {
        items.push(cardId);
      } else if (cardType === "location") {
        locs.push(cardId);
      }
    }

    charactersByPlayer.set(playerId, chars);
    itemsByPlayer.set(playerId, items);
    locationsByPlayer.set(playerId, locs);
    damagedCharacterCountByPlayer.set(playerId, damagedCount);
    exertedCharacterCountByPlayer.set(playerId, exertedCount);
  }

  return {
    charactersByPlayer,
    itemsByPlayer,
    locationsByPlayer,
    damagedCharacterCountByPlayer,
    exertedCharacterCountByPlayer,
  };
}

function evaluateLegacyCardTypeCountCondition(
  condition: HasItemCountCondition | HasLocationCountCondition,
  ctx: ConditionEvaluationContext,
): boolean {
  const playerIds = resolveScopedPlayerIds(
    condition.controller,
    ctx.playerId,
    ctx.framework.state.playerIds,
    ctx.framework.state.currentPlayer,
  );
  const expectedType = condition.type === "has-item-count" ? "item" : "location";
  const value = playerIds.reduce(
    (total, playerId) => total + countCardsOfTypeInPlay(ctx, playerId, expectedType),
    0,
  );

  return compareOperator(value, condition.comparison, condition.count ?? 0);
}

function evaluateResourceCountCondition(
  condition: ResourceCountCondition,
  ctx: ConditionEvaluationContext,
): boolean {
  const playerIds = resolveScopedPlayerIds(
    condition.controller,
    ctx.playerId,
    ctx.framework.state.playerIds,
    ctx.framework.state.currentPlayer,
  );

  const value = (() => {
    switch (condition.what) {
      case "characters":
        return playerIds.reduce(
          (total, playerId) => total + countCardsOfTypeInPlay(ctx, playerId, "character"),
          0,
        );
      case "items":
        return playerIds.reduce(
          (total, playerId) => total + countCardsOfTypeInPlay(ctx, playerId, "item"),
          0,
        );
      case "locations":
        return playerIds.reduce(
          (total, playerId) => total + countCardsOfTypeInPlay(ctx, playerId, "location"),
          0,
        );
      case "cards-in-hand":
        return playerIds.reduce(
          (total, playerId) =>
            total + ctx.framework.zones.getCards({ zone: "hand", playerId }).length,
          0,
        );
      case "cards-in-inkwell":
        return playerIds.reduce(
          (total, playerId) =>
            total + ctx.framework.zones.getCards({ zone: "inkwell", playerId }).length,
          0,
        );
      case "cards-in-discard":
        return playerIds.reduce(
          (total, playerId) =>
            total + ctx.framework.zones.getCards({ zone: "discard", playerId }).length,
          0,
        );
      case "damaged-characters":
        return playerIds.reduce(
          (total, playerId) => total + countDamagedCharactersInPlay(ctx, playerId),
          0,
        );
      case "exerted-characters":
        return playerIds.reduce(
          (total, playerId) => total + countExertedCharactersInPlay(ctx, playerId),
          0,
        );
      case "damage-on-self":
        return ctx.sourceCardId ? Number(ctx.cards.require(ctx.sourceCardId).meta?.damage ?? 0) : 0;
      default:
        return 0;
    }
  })();

  return compareOperator(value, condition.comparison, condition.value);
}

function evaluateInChallengeCondition(
  condition: Extract<Condition, { type: "in-challenge" }>,
  ctx: ConditionEvaluationContext,
): boolean {
  if (!ctx.sourceCardId) return false;

  const challenge = ctx.G.challengeState;
  if (!challenge) return false;

  const isAttacker = challenge.attacker === ctx.sourceCardId;
  const isDefender = challenge.defender === ctx.sourceCardId;

  if (condition.role === "attacker" && !isAttacker) return false;
  if (condition.role === "defender" && !isDefender) return false;
  if (!condition.role && !isAttacker && !isDefender) return false;

  if (condition.againstDamaged) {
    const opposingCardId = isAttacker ? challenge.defender : challenge.attacker;
    const opposingDamage = Number(ctx.cards.require(opposingCardId).meta?.damage ?? 0);
    if (opposingDamage <= 0) return false;
  }

  if (!condition.againstCardType) return true;

  const opposingCardId = isAttacker ? challenge.defender : challenge.attacker;
  const opposingDefinition = ctx.cards.getDefinition(opposingCardId);
  return opposingDefinition?.cardType === condition.againstCardType;
}

function evaluateBanishedInChallengeCondition(
  condition: Extract<Condition, { type: "banished-in-challenge-this-turn" }>,
  ctx: ConditionEvaluationContext,
): boolean {
  const counts = ctx.G?.turnMetadata?.banishedCharactersInChallengeByOwnerThisTurn ?? {};

  if (condition.owner === "you") {
    return (counts[ctx.playerId] ?? 0) > 0;
  }

  if (condition.owner === "opponent") {
    return Object.entries(counts).some(
      ([playerId, count]) => playerId !== ctx.playerId && Number(count) > 0,
    );
  }

  return Object.values(counts).some((count) => Number(count) > 0);
}

function evaluateStaticTurnCondition(
  condition: Extract<Condition, { type: "turn" | "during-turn" | "your-turn" }>,
  ctx: ConditionEvaluationContext,
): boolean {
  const activePlayer = resolveTurnOwnerId(ctx.framework.state, ctx.G);
  if (!activePlayer) return false;

  switch (condition.type) {
    case "turn":
    case "during-turn":
      return condition.whose === "your"
        ? activePlayer === ctx.playerId
        : activePlayer !== ctx.playerId;

    case "your-turn":
      return activePlayer === ctx.playerId;

    default:
      return false;
  }
}

export function evaluateCondition(
  condition: Condition | undefined,
  ctx: ConditionEvaluationContext,
): boolean {
  if (!condition) {
    return true;
  }

  switch (condition.type) {
    case "and":
      return condition.conditions.every((sub) => evaluateCondition(sub, ctx));
    case "or":
      return condition.conditions.some((sub) => evaluateCondition(sub, ctx));
    case "not":
      return !evaluateCondition(condition.condition, ctx);

    case "target-query":
      return evaluateTargetQueryCondition(condition, ctx);

    case "target-aggregate-comparison":
      return evaluateTargetAggregateComparisonCondition(condition, ctx);

    case "turn-metric":
      return evaluateTurnMetricCondition(condition, ctx);

    case "play-context":
      return evaluatePlayContextCondition(
        condition,
        ctx.cardPlayed,
        ctx.resolutionInput?.eventSnapshot,
      );

    case "used-shift":
      return (
        ctx.cardPlayed?.usedShift === true ||
        ctx.resolutionInput?.eventSnapshot?.playedCardUsedShift === true
      );

    case "comparison":
      return compareOperator(
        resolveComparisonValue(condition.left, ctx),
        condition.comparison,
        resolveComparisonValue(condition.right, ctx),
      );

    case "resource-count":
      return evaluateResourceCountCondition(condition, ctx);

    case "has-item-count":
    case "has-location-count":
      return evaluateLegacyCardTypeCountCondition(condition, ctx);

    case "has-named-item": {
      const namedItemPlayerIds = resolveScopedPlayerIds(
        condition.controller,
        ctx.playerId,
        ctx.framework.state.playerIds,
        ctx.framework.state.currentPlayer,
      );
      return namedItemPlayerIds.some((playerId) => {
        const cardsInPlay = ctx.framework.zones.getCards({ zone: "play", playerId });
        return cardsInPlay.some((cardId) => {
          const def = ctx.cards.getDefinition(cardId as CardInstanceId);
          return def?.cardType === "item" && cardHasName(def, condition.name);
        });
      });
    }

    case "has-location-in-play": {
      const controller = condition.controller ?? "you";
      const playerIds = resolveScopedPlayerIds(
        controller,
        ctx.playerId,
        ctx.framework.state.playerIds,
        ctx.framework.state.currentPlayer,
      );
      return playerIds.some((playerId) => countCardsOfTypeInPlay(ctx, playerId, "location") > 0);
    }

    case "has-character-count": {
      // Map to target query to avoid duplication
      const query: TargetQueryCondition = {
        type: "target-query",
        query: {
          selector: "all",
          zones: ["play"],
          cardType: "character",
          owner: condition.controller,
          excludeSelf: condition.excludeSelf,
          filters: [
            condition.classification
              ? {
                  type: "classification",
                  classification: condition.classification,
                }
              : undefined,
            condition.keyword ? { type: "keyword", keyword: condition.keyword } : undefined,
          ].filter((f) => !!f) as any,
        },
        comparison: {
          operator: (typeof condition.comparison === "string"
            ? condition.comparison
            : "gte") as ConditionComparisonOperator,
          value: condition.count ?? 0,
        },
      };
      return evaluateTargetQueryCondition(query, ctx);
    }

    case "has-character-with-classification": {
      const query: TargetQueryCondition = {
        type: "target-query",
        query: {
          selector: "all",
          zones: ["play"],
          cardType: "character",
          owner: condition.controller,
          filters: [
            {
              type: "classification",
              classification: condition.classification,
            },
          ] as any,
        },
        comparison: { operator: "gte", value: 1 },
      };
      return evaluateTargetQueryCondition(query, ctx);
    }

    case "has-character-with-keyword": {
      const query: TargetQueryCondition = {
        type: "target-query",
        query: {
          selector: "all",
          zones: ["play"],
          cardType: "character",
          owner: condition.controller,
          filters: [{ type: "has-keyword", keyword: condition.keyword }] as any,
        },
        comparison: { operator: "gte", value: 1 },
      };
      return evaluateTargetQueryCondition(query, ctx);
    }

    case "has-named-character": {
      const query: TargetQueryCondition = {
        type: "target-query",
        query: {
          selector: "all",
          zones: ["play"],
          cardType: "character",
          owner: condition.controller,
          filters: [{ type: "name", name: condition.name }] as any,
        },
        comparison: { operator: "gte", value: 1 },
      };
      return evaluateTargetQueryCondition(query, ctx);
    }

    case "has-another-character": {
      // Check if the controller has another character in play besides self (sourceCardId),
      // optionally filtered by classification or name.
      const playCards = ctx.framework.zones.getCards({
        zone: "play",
        playerId: ctx.playerId,
      });
      return playCards.some((cardId) => {
        // Exclude self
        if (cardId === ctx.sourceCardId) {
          return false;
        }
        const definition = ctx.cards.getDefinition(cardId as CardInstanceId);
        if (!definition || definition.cardType !== "character") {
          return false;
        }
        // Optional classification filter
        if (condition.classification) {
          const classifications = (definition as { classifications?: string[] }).classifications;
          if (!Array.isArray(classifications)) {
            return false;
          }
          if (!classifications.includes(condition.classification)) {
            return false;
          }
        }
        // Optional name filter
        if (condition.name) {
          if (!cardHasName(definition, condition.name)) {
            return false;
          }
        }
        return true;
      });
    }

    case "first-turn-non-otp": {
      const otp = ctx.framework.state.status.otp as PlayerId | undefined;
      if (!otp) return false;
      if (otp === ctx.playerId) return false;
      const turnsCompleted = ctx.G.turnsCompletedByPlayer?.[ctx.playerId] ?? 0;
      return turnsCompleted === 0;
    }

    case "revealed-matches-chosen-name": {
      const revealedCardId = ctx.resolutionInput?.eventSnapshot?.revealedCardIds?.[0] as
        | CardInstanceId
        | undefined;
      const selectedTargets = normalizeSelectedTargets(ctx.resolutionInput?.targets) ?? [];
      const chosenCardId =
        (ctx.resolutionInput?.eventSnapshot?.chosenCardId as CardInstanceId | undefined) ??
        selectedTargets[0] ??
        ctx.sourceCardId;

      const revealedName = revealedCardId
        ? ctx.cards.getDefinition(revealedCardId)?.name
        : undefined;
      const chosenName = chosenCardId ? ctx.cards.getDefinition(chosenCardId)?.name : undefined;

      return (
        typeof revealedName === "string" &&
        revealedName.length > 0 &&
        typeof chosenName === "string" &&
        chosenName.length > 0 &&
        revealedCardId !== undefined &&
        chosenCardId !== undefined &&
        cardHasName(ctx.cards.getDefinition(revealedCardId)!, chosenName)
      );
    }

    case "revealed-matches-named": {
      const revealedCardId = ctx.resolutionInput?.eventSnapshot?.revealedCardIds?.[0] as
        | CardInstanceId
        | undefined;
      const namedCardName = ctx.resolutionInput?.eventSnapshot?.namedCardName?.trim();

      return (
        typeof namedCardName === "string" &&
        namedCardName.length > 0 &&
        revealedCardId !== undefined &&
        cardHasName(ctx.cards.getDefinition(revealedCardId)!, namedCardName)
      );
    }

    case "revealed-is-card-type": {
      const revealedIsCardTypeId = ctx.resolutionInput?.eventSnapshot?.revealedCardIds?.[0] as
        | CardInstanceId
        | undefined;
      if (!revealedIsCardTypeId) {
        return false;
      }
      const revealedCardTypeDef = ctx.cards.getDefinition(revealedIsCardTypeId);
      if (!revealedCardTypeDef) {
        return false;
      }
      const expectedCardTypes = Array.isArray(condition.cardType)
        ? condition.cardType
        : [condition.cardType];
      return (expectedCardTypes as readonly string[]).includes(revealedCardTypeDef.cardType);
    }

    case "revealed-is-character-named": {
      const revealedCardId = ctx.resolutionInput?.eventSnapshot?.revealedCardIds?.[0] as
        | CardInstanceId
        | undefined;
      if (!revealedCardId) {
        return false;
      }
      const revealedDef = ctx.cards.getDefinition(revealedCardId);
      if (!revealedDef || revealedDef.cardType !== "character") {
        return false;
      }
      const expectedName = "name" in condition ? (condition as { name?: string }).name : undefined;
      if (typeof expectedName !== "string") {
        return false;
      }
      return cardHasName(revealedDef, expectedName);
    }

    case "is-exerted":
    case "exerted": {
      const selectedTargets = normalizeSelectedTargets(ctx.resolutionInput?.targets) ?? [];
      const target = "target" in condition && condition.target ? condition.target : "SELF";
      const targetId = target === "SELF" ? ctx.sourceCardId : selectedTargets[0];
      if (!targetId) {
        return false;
      }
      return ctx.cards.require(targetId).meta?.state === "exerted";
    }

    case "if-you-do":
      return didLastEffectPerform(ctx.resolutionInput?.eventSnapshot);

    case "returned-card-is-named": {
      const returnedCardId = ctx.resolutionInput?.eventSnapshot?.lastReturnedFromDiscardCardId as
        | CardInstanceId
        | undefined;
      if (!returnedCardId) {
        return false;
      }
      const returnedCardDef = ctx.cards.getDefinition(returnedCardId);
      return typeof condition.name === "string" && returnedCardDef
        ? cardHasName(returnedCardDef, condition.name)
        : false;
    }

    case "in-challenge":
      return evaluateInChallengeCondition(condition, ctx);

    case "being-challenged": {
      if (!ctx.sourceCardId) return false;
      const challenge = ctx.G.challengeState;
      if (!challenge) return false;
      // "Challenged character" is the defender (opposing character or location being challenged).
      // The challenging character is not "being challenged" for text like "unless it's being challenged."
      return challenge.defender === ctx.sourceCardId;
    }

    case "banished-in-challenge-this-turn":
      return evaluateBanishedInChallengeCondition(condition, ctx);

    case "turn":
    case "during-turn":
    case "your-turn":
      return evaluateStaticTurnCondition(condition, ctx);

    case "no-damage":
    case "has-no-damage": {
      const targetId = ctx.sourceCardId;
      if (!targetId) {
        return false;
      }
      const damage = Number(ctx.cards.require(targetId).meta?.damage ?? 0);
      return damage === 0;
    }

    // NOTE: "has-any-damage" is intentionally treated as an alias of "self-has-damage".
    // Both conditions evaluate only against ctx.sourceCardId (the source card).
    case "has-any-damage":
    case "self-has-damage": {
      const targetId = ctx.sourceCardId;
      if (!targetId) {
        return false;
      }
      const damage = Number(ctx.cards.require(targetId).meta?.damage ?? 0);
      return damage > 0;
    }

    case "damage-comparison": {
      const targetId = ctx.sourceCardId;
      if (!targetId) {
        return false;
      }
      const damage = Number(ctx.cards.require(targetId).meta?.damage ?? 0);
      return compareOperator(damage, condition.comparison, condition.value);
    }

    case "opponent-has-damaged-character": {
      const opponentIds = ctx.framework.state.playerIds.filter(
        (playerId) => playerId !== ctx.playerId,
      );
      return opponentIds.some((playerId) => countDamagedCharactersInPlay(ctx, playerId) > 0);
    }

    case "has-card-under": {
      const targetId = ctx.sourceCardId;
      if (!targetId) {
        return false;
      }

      const cardsUnder = ctx.cards.require(targetId).meta?.cardsUnder;
      return Array.isArray(cardsUnder) && cardsUnder.length > 0;
    }

    case "trigger-subject-had-card-under": {
      const snapshotCount = ctx.resolutionInput?.eventSnapshot?.cardsUnderCountBeforeBanish;
      return typeof snapshotCount === "number" && snapshotCount > 0;
    }

    case "put-card-under-self-this-turn": {
      const targetId = ctx.sourceCardId;
      if (!targetId) {
        return false;
      }
      const cardsUnderThisTurn = ctx.G.turnMetadata?.cardsUnderThisTurn;
      if (!cardsUnderThisTurn) {
        return false;
      }
      const underCards = cardsUnderThisTurn[targetId];
      return Array.isArray(underCards) && underCards.length > 0;
    }

    case "put-card-under-any-this-turn": {
      const cardsUnderThisTurn = ctx.G?.turnMetadata?.cardsUnderThisTurn;
      if (!cardsUnderThisTurn) {
        return false;
      }
      const cardIndex = ctx.framework.state._zonesPrivate?.cardIndex;
      if (!cardIndex) {
        return false;
      }
      // Check if any card owned/controlled by the source card's controller had a card put under it
      const controllerId = ctx.playerId;
      for (const parentId of Object.keys(cardsUnderThisTurn)) {
        const underCards = cardsUnderThisTurn[parentId as CardInstanceId];
        if (!Array.isArray(underCards) || underCards.length === 0) {
          continue;
        }
        const parentEntry = cardIndex[parentId];
        if (!parentEntry) {
          continue;
        }
        const parentOwner = parentEntry.controllerID ?? parentEntry.ownerID;
        if (parentOwner !== controllerId) {
          continue;
        }
        // Only characters and locations qualify per the card text
        const parentDef = ctx.cards.getDefinition(parentId as CardInstanceId);
        if (parentDef?.cardType === "character" || parentDef?.cardType === "location") {
          return true;
        }
      }
      return false;
    }

    case "stat-threshold": {
      const targetId =
        condition.target === "SELF" || !condition.target ? ctx.sourceCardId : undefined;
      if (!targetId) {
        return false;
      }
      const derivedState = buildDerivedStateFromConditionCtx(ctx);
      const definition = ctx.cards.getDefinition(targetId);
      let statValue: number;
      switch (condition.stat) {
        case "strength":
          statValue = ctx.getCardStrengthByInstanceId
            ? ctx.getCardStrengthByInstanceId(targetId)
            : getEffectiveStrength(
                definition,
                derivedState,
                targetId,
                ctx.cards.getDefinition,
                ctx.registry,
              );
          break;
        case "lore":
          statValue = getEffectiveLore(
            definition,
            derivedState,
            targetId,
            ctx.cards.getDefinition,
            ctx.registry,
          );
          break;
        case "willpower":
          statValue = getEffectiveWillpower(
            definition,
            derivedState,
            targetId,
            ctx.cards.getDefinition,
            ctx.registry,
          );
          break;
        default:
          return false;
      }
      return compareOperator(statValue, condition.comparison, condition.value);
    }

    case "at-location": {
      const targetId = ctx.sourceCardId;
      if (!targetId) {
        return false;
      }
      const meta = ctx.cards.require(targetId).meta;
      const atLocationId = meta?.atLocationId;
      if (!atLocationId) {
        return false;
      }
      // Verify the location is still in play
      const locationZone = ctx.framework.zones.getCardZone?.(atLocationId as CardInstanceId);
      if (!locationZone || (locationZone !== "play" && !locationZone.startsWith("play:"))) {
        return false;
      }
      // If a specific location name is required, check it
      if (condition.locationName) {
        const locationDef = ctx.cards.getDefinition(atLocationId as CardInstanceId);
        return locationDef?.name === condition.locationName;
      }
      return true;
    }

    case "inkwell-count": {
      const inkwellCount = countCardsInZoneForScope("inkwell", condition.controller ?? "you", ctx);
      const threshold = condition.count ?? condition.minimum ?? 0;
      const comparison = condition.comparison ?? "greater-or-equal";
      return compareOperator(inkwellCount, comparison, threshold);
    }

    case "discarded-card-has-classification": {
      const discardedCardIds =
        (ctx.resolutionInput?.eventSnapshot?.discardedCardIds as
          | readonly CardInstanceId[]
          | undefined) ?? [];
      if (discardedCardIds.length === 0) {
        return false;
      }
      const expectedClassification = condition.classification.toLowerCase();
      const expectedCardType = condition.cardType ?? "character";
      return discardedCardIds.some((cardId) => {
        const definition = ctx.cards.getDefinition(cardId as CardInstanceId);
        if (!definition) {
          return false;
        }
        if (definition.cardType !== expectedCardType) {
          return false;
        }
        const classifications = (definition as { classifications?: unknown }).classifications;
        if (!Array.isArray(classifications)) {
          return false;
        }
        return (classifications as readonly string[]).some(
          (c) => c.toLowerCase() === expectedClassification,
        );
      });
    }

    case "has-character-with-strength": {
      const strengthController = condition.controller ?? "you";
      const strengthPlayerIds = resolveScopedPlayerIds(
        strengthController,
        ctx.playerId,
        ctx.framework.state.playerIds,
        ctx.framework.state.currentPlayer,
      );
      return strengthPlayerIds.some((playerId) => {
        const playCards = ctx.framework.zones.getCards({
          zone: "play",
          playerId,
        });
        return playCards.some((cardId) => {
          const definition = ctx.cards.getDefinition(cardId as CardInstanceId);
          if (!definition || definition.cardType !== "character") {
            return false;
          }
          const strength = ctx.getCardStrengthByInstanceId
            ? ctx.getCardStrengthByInstanceId(cardId as CardInstanceId)
            : getEffectiveStrength(
                definition,
                buildDerivedStateFromConditionCtx(ctx),
                cardId as CardInstanceId,
                ctx.cards.getDefinition,
                ctx.registry,
              );
          return compareOperator(strength, condition.comparison, condition.value);
        });
      });
    }

    case "is-named": {
      const selectedTargets = getSelectedTargets(ctx);
      return selectedTargets.some((cardId) => {
        const definition = ctx.cards.getDefinition(cardId as CardInstanceId);
        return definition ? cardHasName(definition, condition.name) : false;
      });
    }

    case "has-granted-ability": {
      const sourceCardId = ctx.sourceCardId;
      if (!sourceCardId) return false;

      const targetAbilityId = condition.abilityId;

      // Check temporary grants (e.g., Donald Duck's MONEY EVERYWHERE)
      const currentTurn = ctx.framework.state.status?.turn ?? 1;
      const meta = ctx.framework.state._zonesPrivate?.cardMeta?.[sourceCardId] as
        | {
            readonly temporaryAbilities?: Record<string, number>;
            readonly temporaryAbilityStarts?: Record<string, number>;
            readonly temporaryAbilityPayloads?: Record<string, { id?: string; type?: string }>;
          }
        | undefined;
      const temporaryAbilities = meta?.temporaryAbilities;
      if (temporaryAbilities) {
        for (const [abilityKey, expiryTurn] of Object.entries(temporaryAbilities)) {
          const startsAtTurn = meta?.temporaryAbilityStarts?.[abilityKey] ?? 1;
          if (
            typeof expiryTurn !== "number" ||
            !Number.isFinite(expiryTurn) ||
            currentTurn < startsAtTurn ||
            currentTurn > expiryTurn
          ) {
            continue;
          }
          const payload = meta?.temporaryAbilityPayloads?.[abilityKey];
          if (payload?.id === targetAbilityId || abilityKey === targetAbilityId) {
            return true;
          }
        }
      }

      // Check static grants (e.g., The Great Illuminary's STARTLING DISCOVERY)
      if (ctx.registry) {
        const staticGrants = (ctx.registry.byTarget.get(sourceCardId) ?? []).filter(
          (e: { kind: string }) =>
            e.kind === "grant-abilities-while-here" || e.kind === "grant-ability",
        );
        for (const entry of staticGrants) {
          const payload = entry.payload as { ability?: { id?: string } };
          if (payload?.ability?.id === targetAbilityId) {
            return true;
          }
        }
      }

      return false;
    }

    case "if":
      // Unsupported
      return false;

    case "returned-card-is-princess": {
      const selectedTargets = getSelectedTargets(ctx);
      return selectedTargets.some((cardId) => {
        const definition = ctx.cards.getDefinition(cardId as CardInstanceId);
        return (
          Array.isArray(definition?.classifications) &&
          (definition.classifications as readonly string[]).some(
            (c) => c.toLowerCase() === "princess",
          )
        );
      });
    }

    case "returned-card-has-classification": {
      const selectedTargets = getSelectedTargets(ctx);
      const expectedClassification = condition.classification.toLowerCase();
      return selectedTargets.some((cardId) => {
        const definition = ctx.cards.getDefinition(cardId as CardInstanceId);
        return (
          Array.isArray(definition?.classifications) &&
          (definition.classifications as readonly string[]).some(
            (c) => c.toLowerCase() === expectedClassification,
          )
        );
      });
    }

    default:
      return false;
  }
}
