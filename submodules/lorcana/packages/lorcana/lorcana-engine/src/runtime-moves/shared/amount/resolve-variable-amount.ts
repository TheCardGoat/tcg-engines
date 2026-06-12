import type { CardInstanceId, PlayerId } from "#core";
import type {
  AmountString,
  CardFilter,
  CharacterTarget,
  TargetZone,
  VariableAmount,
  VariableAmountOperand,
} from "@tcg/lorcana-types";
import type { DynamicAmountEventSnapshot } from "../../../types/domain-events";
import type { CardPlayedPayload } from "../../../types";
import type { PlayCardExecutionContext } from "../../resolution/action-effects/types";
import {
  clampCharacteristicForRules,
  createProjectionState,
  getEffectiveLore,
  getEffectiveStrength,
  type DerivedStateContext,
} from "../../../rules/derived-state";
import { getOrBuildMoveRegistry } from "../../rules/move-registry-cache";
import {
  normalizeTargetDescriptor,
  passesFilter,
  resolveCandidateTargets,
  selectTargets,
} from "../../../targeting/runtime";

export type AmountEvaluationMode = "aggregate" | "per-target";

export type ResolvedTargetAmountMap = Record<CardInstanceId, number>;

export interface ResolvedVariableAmount {
  mode: AmountEvaluationMode;
  value?: number;
  perTarget?: ResolvedTargetAmountMap;
}

export interface VariableAmountResolutionContext {
  ctx: PlayCardExecutionContext;
  sourceId?: CardInstanceId;
  controllerId?: PlayerId;
  targets?: CardInstanceId[];
  cardPlayed?: CardPlayedPayload;
  eventSnapshot?: DynamicAmountEventSnapshot;
}

type CountScope = {
  owner?: "you" | "opponent" | "any";
  zones?: readonly TargetZone[];
  cardType?: "character" | "item" | "location" | "action";
  cardTypes?: readonly ("character" | "item" | "location" | "action")[];
};

const ALL_PLAY_ZONES: TargetZone[] = ["play"];

function getDerivedState(context: VariableAmountResolutionContext): DerivedStateContext {
  return createProjectionState(context.ctx.framework.state, context.ctx.G);
}

function getControllerId(context: VariableAmountResolutionContext): PlayerId | undefined {
  if (context.controllerId) {
    return context.controllerId;
  }

  if (context.sourceId) {
    const owner = context.ctx.framework.zones.getCardOwner(context.sourceId);
    if (typeof owner === "string" && owner.length > 0) {
      return owner as PlayerId;
    }
  }

  const fallback =
    context.ctx.framework.state.currentPlayer ?? context.ctx.framework.state.priority.holder;
  return typeof fallback === "string" && fallback.length > 0 ? (fallback as PlayerId) : undefined;
}

function sanitizeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function getPublicZoneCount(
  context: VariableAmountResolutionContext,
  zone: TargetZone,
  playerId: PlayerId,
): number {
  return sanitizeNumber(context.ctx.framework.zones.getCardCount({ zone, playerId }));
}

function getCardDamage(context: VariableAmountResolutionContext, cardId: CardInstanceId): number {
  return sanitizeNumber(context.ctx.cards.require(cardId).meta?.damage);
}

function getCardCost(context: VariableAmountResolutionContext, cardId: CardInstanceId): number {
  const definition = context.ctx.cards.getDefinition(cardId) as { cost?: unknown } | undefined;
  return sanitizeNumber(definition?.cost);
}

function getCardLoreValue(
  context: VariableAmountResolutionContext,
  cardId: CardInstanceId,
): number {
  return getEffectiveLore(
    context.ctx.cards.getDefinition(cardId) as any,
    getDerivedState(context),
    cardId,
    (id) => context.ctx.cards.getDefinition(id) as any,
    getOrBuildMoveRegistry(context.ctx),
  );
}

function getCardStrength(context: VariableAmountResolutionContext, cardId: CardInstanceId): number {
  return getEffectiveStrength(
    context.ctx.cards.getDefinition(cardId) as any,
    getDerivedState(context),
    cardId,
    (id) => context.ctx.cards.getDefinition(id) as any,
    getOrBuildMoveRegistry(context.ctx),
  );
}

function getCardsUnderCount(
  context: VariableAmountResolutionContext,
  cardId: CardInstanceId,
): number {
  const cardsUnder = context.ctx.cards.require(cardId).meta?.cardsUnder;
  return Array.isArray(cardsUnder) ? cardsUnder.length : 0;
}

function resolveOwnerPlayerIds(
  context: VariableAmountResolutionContext,
  owner: "you" | "opponent" | "any" | undefined,
): PlayerId[] {
  const controllerId = getControllerId(context);
  if (!controllerId) {
    return [];
  }

  const allPlayers = [...context.ctx.framework.state.playerIds];
  switch (owner) {
    case "you":
      return [controllerId];
    case "opponent":
      return allPlayers.filter((playerId) => playerId !== controllerId);
    case "any":
    default:
      return allPlayers;
  }
}

function listCardsInScope(
  context: VariableAmountResolutionContext,
  scope: CountScope,
  filters: readonly CardFilter[] = [],
): CardInstanceId[] {
  const zones = scope.zones && scope.zones.length > 0 ? scope.zones : ALL_PLAY_ZONES;
  const owners = resolveOwnerPlayerIds(context, scope.owner ?? "any");
  const controllerId = getControllerId(context);
  const typeFilter = scope.cardTypes ?? (scope.cardType ? [scope.cardType] : []);
  const cards = new Set<CardInstanceId>();

  for (const zone of zones) {
    for (const ownerId of owners) {
      const zoneCards = context.ctx.framework.zones.getCards({
        zone: zone as "deck" | "hand" | "play" | "discard" | "inkwell" | "limbo",
        playerId: ownerId,
      }) as CardInstanceId[];
      for (const cardId of zoneCards) {
        cards.add(cardId);
      }
    }
  }

  let candidates = [...cards];
  if (typeFilter.length > 0) {
    candidates = candidates.filter((cardId) => {
      const definition = context.ctx.cards.getDefinition(cardId) as
        | { cardType?: string }
        | undefined;
      return Boolean(definition?.cardType && typeFilter.includes(definition.cardType as never));
    });
  }

  if (!controllerId || filters.length === 0) {
    return candidates;
  }

  return candidates.filter((cardId) =>
    filters.every((filter) =>
      passesFilter(
        context.ctx,
        cardId,
        filter as unknown as Record<string, unknown>,
        controllerId,
        {
          eventSnapshot: context.eventSnapshot,
          sourceCardId: context.sourceId,
          selectedTargets: context.targets,
        },
      ),
    ),
  );
}

function resolveOpponentScopedValue(
  context: VariableAmountResolutionContext,
  valueByPlayer: (playerId: PlayerId) => number,
  controller: "you" | "opponent" | "opponents",
): number {
  const controllerId = getControllerId(context);
  if (!controllerId) {
    return 0;
  }

  if (controller === "you") {
    return valueByPlayer(controllerId);
  }

  const opponents = context.ctx.framework.state.playerIds.filter(
    (playerId) => playerId !== controllerId,
  );
  if (controller === "opponent") {
    const firstOpponent = opponents[0];
    return firstOpponent ? valueByPlayer(firstOpponent as PlayerId) : 0;
  }

  return opponents.reduce((sum, playerId) => sum + valueByPlayer(playerId as PlayerId), 0);
}

function createSyntheticCardPlayedPayload(
  context: VariableAmountResolutionContext,
): CardPlayedPayload | undefined {
  const controllerId = getControllerId(context);
  if (!controllerId) {
    return undefined;
  }

  return {
    cardId: (context.sourceId ?? "dynamic-source") as CardInstanceId,
    cardType: "action",
    costType: "free",
    playerId: controllerId,
  };
}

function resolveDslTargets(
  context: VariableAmountResolutionContext,
  target: CharacterTarget,
  fallbackToProvidedTargets: boolean,
): CardInstanceId[] {
  const descriptor = normalizeTargetDescriptor(target);
  if (!descriptor) {
    return fallbackToProvidedTargets ? [...(context.targets ?? [])] : [];
  }

  const cardPlayed = createSyntheticCardPlayedPayload(context);
  if (!cardPlayed) {
    return [];
  }

  const sourceCardId = context.sourceId ?? cardPlayed.cardId;
  const candidates = resolveCandidateTargets(context.ctx, cardPlayed, descriptor, {
    selectedTargets: context.targets,
    sourceCardId,
  });
  return selectTargets(candidates, descriptor, context.targets, { sourceCardId });
}

function resolveTargetLocationLore(
  context: VariableAmountResolutionContext,
  targetId: CardInstanceId | undefined,
): number {
  if (!targetId) {
    return 0;
  }

  const targetDefinition = context.ctx.cards.getDefinition(targetId) as
    | ({ cardType?: string } & Record<string, unknown>)
    | undefined;
  if (targetDefinition?.cardType === "location") {
    return getCardLoreValue(context, targetId);
  }

  const locationId = context.ctx.cards.require(targetId).meta?.atLocationId as
    | CardInstanceId
    | undefined;
  return locationId ? getCardLoreValue(context, locationId) : 0;
}

function resolveTargetAttribute(
  context: VariableAmountResolutionContext,
  attribute: "strength" | "lore" | "damage" | "cost",
  targetId: CardInstanceId | undefined,
): number {
  if (!targetId) {
    return 0;
  }

  switch (attribute) {
    case "strength":
      return getCardStrength(context, targetId);
    case "lore":
      return getCardLoreValue(context, targetId);
    case "damage":
      return getCardDamage(context, targetId);
    case "cost":
      return getCardCost(context, targetId);
    default:
      return 0;
  }
}

function resolveSourceAttribute(
  context: VariableAmountResolutionContext,
  attribute:
    | "strength"
    | "lore"
    | "damage"
    | "chars-at-location"
    | "cards-under-them"
    | "location-lore",
): number {
  const sourceId = context.sourceId;
  if (!sourceId) {
    return 0;
  }

  switch (attribute) {
    case "strength":
      return getCardStrength(context, sourceId);
    case "lore":
      return getCardLoreValue(context, sourceId);
    case "damage":
      return getCardDamage(context, sourceId);
    case "cards-under-them":
      return getCardsUnderCount(context, sourceId);
    case "location-lore": {
      const locationId = context.ctx.cards.require(sourceId).meta?.atLocationId as
        | CardInstanceId
        | undefined;
      return locationId ? getCardLoreValue(context, locationId) : 0;
    }
    case "chars-at-location": {
      const sourceDef = context.ctx.cards.getDefinition(sourceId) as
        | { cardType?: string }
        | undefined;
      const sourceMeta = context.ctx.cards.require(sourceId).meta ?? {};
      const locationId =
        sourceDef?.cardType === "location"
          ? sourceId
          : (sourceMeta.atLocationId as CardInstanceId | undefined);
      if (!locationId) {
        return 0;
      }

      const allPlayCards = listCardsInScope(context, {
        owner: "any",
        zones: ["play"],
      });

      return allPlayCards.filter((cardId) => {
        const definition = context.ctx.cards.getDefinition(cardId) as
          | { cardType?: string }
          | undefined;
        if (definition?.cardType !== "character") {
          return false;
        }
        const meta = context.ctx.cards.require(cardId).meta ?? {};
        return (meta.atLocationId as CardInstanceId | undefined) === locationId;
      }).length;
    }
    default:
      return 0;
  }
}

/**
 * Returns true when the amount's target is a fixed card reference (e.g. { ref: "previous-target" })
 * rather than the dynamically-resolved effect targets.
 *
 * Fixed-ref amounts should be computed as aggregate values (a single number) because the
 * "source" of the value is a specific referenced card, not each effect target individually.
 * This prevents per-target keying mismatches when the source card != the effect target card.
 */
function hasFixedTargetRef(amount: VariableAmount): boolean {
  const record = amount as Record<string, unknown>;
  const target = record.target;
  if (!target || typeof target !== "object" || Array.isArray(target)) {
    return false;
  }
  const targetRecord = target as Record<string, unknown>;
  return typeof targetRecord.ref === "string" || typeof targetRecord.reference === "string";
}

function referencesTarget(amount: VariableAmount): boolean {
  switch (amount.type) {
    case "target-attribute":
    case "target-location-attribute":
    case "damage-on-target":
      return true;
    case "difference":
      return operandReferencesTarget(amount.left) || operandReferencesTarget(amount.right);
    case "clamp":
      return (
        operandReferencesTarget(amount.value) ||
        operandReferencesTarget(amount.max) ||
        operandReferencesTarget(amount.min)
      );
    case "for-each":
      return (
        operandReferencesTarget(amount.count) || forEachCounterReferencesTarget(amount.counter)
      );
    case "strength-of":
    case "willpower-of":
    case "lore-value-of":
    case "cost-of":
      return true;
    default:
      return false;
  }
}

function forEachCounterReferencesTarget(counter: unknown): boolean {
  if (!counter || typeof counter !== "object") {
    return false;
  }

  const counterRecord = counter as Record<string, unknown>;
  return counterRecord.type === "damage-on-target";
}

function operandReferencesTarget(value: VariableAmountOperand | undefined): boolean {
  if (typeof value === "number" || value === undefined) {
    return false;
  }
  return referencesTarget(value);
}

function resolveOperand(
  operand: VariableAmountOperand,
  context: VariableAmountResolutionContext,
  targetId?: CardInstanceId,
): number {
  if (typeof operand === "number") {
    return operand;
  }

  return evaluateAggregate(operand, context, targetId);
}

function resolveForEachCounter(
  context: VariableAmountResolutionContext,
  counter: unknown,
  targetId?: CardInstanceId,
): number {
  if (typeof counter === "string") {
    switch (counter) {
      case "characters":
        return resolveOpponentScopedValue(
          context,
          (playerId) =>
            context.ctx.framework.zones.getCards({ zone: "play", playerId }).filter((cardId) => {
              const definition = context.ctx.cards.getDefinition(cardId) as
                | { cardType?: string }
                | undefined;
              return definition?.cardType === "character";
            }).length,
          "you",
        );
      case "damaged-characters":
        return listCardsInScope(context, { owner: "you", zones: ["play"], cardType: "character" }, [
          { type: "status", status: "damaged" },
        ]).length;
      case "items":
        return listCardsInScope(context, {
          owner: "you",
          zones: ["play"],
          cardType: "item",
        }).length;
      case "locations":
        return listCardsInScope(context, {
          owner: "you",
          zones: ["play"],
          cardType: "location",
        }).length;
      case "cards-in-hand":
        return resolveOpponentScopedValue(
          context,
          (playerId) => context.ctx.framework.zones.getCards({ zone: "hand", playerId }).length,
          "you",
        );
      case "cards-in-discard":
        return resolveOpponentScopedValue(
          context,
          (playerId) => context.ctx.framework.zones.getCards({ zone: "discard", playerId }).length,
          "you",
        );
      case "damage-on-self":
        return context.sourceId ? getCardDamage(context, context.sourceId) : 0;
      case "damage-on-target":
        return targetId ? getCardDamage(context, targetId) : 0;
      case "damage-removed":
        return sanitizeNumber(context.eventSnapshot?.healedAmount);
      case "cards-under-self":
        return context.sourceId ? getCardsUnderCount(context, context.sourceId) : 0;
      case "exerted-characters":
        return listCardsInScope(context, { owner: "you", zones: ["play"], cardType: "character" }, [
          { type: "exerted" },
        ]).length;
      case "characters-that-sang":
        return Array.isArray(context.cardPlayed?.singerIds)
          ? context.cardPlayed.singerIds.length
          : 0;
      default:
        return 0;
    }
  }

  if (!counter || typeof counter !== "object") {
    return 0;
  }

  const counterRecord = counter as Record<string, unknown>;
  const counterType = counterRecord.type;
  if (typeof counterType !== "string") {
    return 0;
  }

  switch (counterType) {
    case "damaged-characters":
      return listCardsInScope(
        context,
        {
          owner: (counterRecord.controller as "you" | "opponent" | "any" | undefined) ?? "you",
          zones: ["play"],
          cardType: "character",
        },
        [{ type: "status", status: "damaged" }],
      ).length;
    case "cards-in-hand":
      return resolveOpponentScopedValue(
        context,
        (playerId) => context.ctx.framework.zones.getCards({ zone: "hand", playerId }).length,
        (counterRecord.controller as "you" | "opponent" | "opponents" | undefined) ?? "you",
      );
    case "cards-in-discard":
      return resolveOpponentScopedValue(
        context,
        (playerId) => context.ctx.framework.zones.getCards({ zone: "discard", playerId }).length,
        (counterRecord.controller as "you" | "opponent" | "opponents" | undefined) ?? "you",
      );
    case "damage-on-self":
      return context.sourceId ? getCardDamage(context, context.sourceId) : 0;
    case "damage-on-target":
      return targetId ? getCardDamage(context, targetId) : 0;
    case "damage-removed":
      return sanitizeNumber(context.eventSnapshot?.healedAmount);
    case "cards-under-self":
      return context.sourceId ? getCardsUnderCount(context, context.sourceId) : 0;
    case "exerted-characters":
      return listCardsInScope(
        context,
        {
          owner: (counterRecord.controller as "you" | "opponent" | "any" | undefined) ?? "you",
          zones: ["play"],
          cardType: "character",
        },
        [{ type: "exerted" }],
      ).length;
    case "characters-that-sang":
      return Array.isArray(context.cardPlayed?.singerIds) ? context.cardPlayed.singerIds.length : 0;
    case "cards-in-inkwell-over-limit": {
      const limit =
        typeof counterRecord.limit === "number" && Number.isFinite(counterRecord.limit)
          ? Math.max(0, Math.floor(counterRecord.limit))
          : 0;
      return resolveOpponentScopedValue(
        context,
        (playerId) => {
          const inkwellCount = context.ctx.framework.zones.getCards({
            zone: "inkwell",
            playerId,
          }).length;
          return Math.max(0, inkwellCount - limit);
        },
        (counterRecord.controller as "you" | "opponent" | "opponents" | undefined) ?? "you",
      );
    }
    case "lore-lost":
      return sanitizeNumber(context.eventSnapshot?.triggerAmount);
    case "banished-this-way":
      return sanitizeNumber(context.eventSnapshot?.triggerAmount);
    case "last-effect-target-count":
      return sanitizeNumber(
        context.eventSnapshot?.lastEffectTargetCount ?? context.eventSnapshot?.triggerAmount,
      );
    case "target-query": {
      const query = counterRecord.query;
      if (!query || typeof query !== "object") {
        return 0;
      }

      return resolveCandidateTargets(
        context.ctx as Parameters<typeof resolveCandidateTargets>[0],
        {
          selector:
            typeof (query as { selector?: unknown }).selector === "string"
              ? ((query as { selector: string }).selector as "all" | "chosen" | "self")
              : "all",
          count:
            typeof (query as { selector?: unknown }).selector === "string" &&
            (query as { selector: string }).selector !== "all"
              ? 1
              : "all",
          owner:
            typeof (query as { owner?: unknown }).owner === "string"
              ? (query as { owner: string }).owner
              : "any",
          zones: Array.isArray((query as { zones?: unknown[] }).zones)
            ? ((query as { zones: string[] }).zones as string[])
            : ["play"],
          cardType:
            typeof (query as { cardType?: unknown }).cardType === "string"
              ? (query as { cardType: string }).cardType
              : undefined,
          filters: Array.isArray((query as { filters?: unknown[] }).filters)
            ? (query as { filters: unknown[] }).filters
            : undefined,
        },
        {
          controllerId: context.controllerId,
          sourceCardId: context.sourceId,
          selectedTargets: targetId ? [targetId] : undefined,
          eventSnapshot: context.eventSnapshot,
          strictUnknownFilters: true,
        },
      ).length;
    }
    default:
      return 0;
  }
}

function evaluateAggregate(
  amount: VariableAmount,
  context: VariableAmountResolutionContext,
  targetId?: CardInstanceId,
): number {
  switch (amount.type) {
    case "target-attribute":
      return resolveTargetAttribute(context, amount.attribute, targetId);

    case "source-attribute":
      return resolveSourceAttribute(context, amount.attribute);

    case "trigger-target-attribute":
      if (amount.attribute === "strength-before-banish") {
        return clampCharacteristicForRules(
          sanitizeNumber(context.eventSnapshot?.strengthBeforeBanish),
        );
      }
      if (amount.attribute === "cards-under-count-before-banish") {
        return sanitizeNumber(context.eventSnapshot?.cardsUnderCountBeforeBanish);
      }
      return 0;

    case "target-location-attribute":
      if (amount.attribute === "lore") {
        return resolveTargetLocationLore(context, targetId);
      }
      return 0;

    case "filtered-count": {
      const count = listCardsInScope(
        context,
        {
          owner: amount.owner,
          zones: amount.zones,
          cardType: amount.cardType,
          cardTypes: amount.cardTypes,
        },
        amount.filters,
      ).filter(
        (cardId) => !(amount.excludeSelf && context.sourceId && cardId === context.sourceId),
      ).length;

      const multiplier =
        typeof amount.multiplier === "number" && Number.isFinite(amount.multiplier)
          ? amount.multiplier
          : 1;
      return count * multiplier;
    }

    case "difference": {
      const left = resolveOperand(amount.left, context, targetId);
      const right = resolveOperand(amount.right, context, targetId);
      return amount.invert ? right - left : left - right;
    }

    case "reducer": {
      if (amount.reducer !== "damage") {
        return 0;
      }

      return listCardsInScope(
        context,
        {
          owner: amount.owner,
          zones: amount.zones,
          cardType: amount.cardType,
          cardTypes: amount.cardTypes,
        },
        amount.filters,
      )
        .filter(
          (cardId) => !(amount.excludeSelf && context.sourceId && cardId === context.sourceId),
        )
        .reduce((sum, cardId) => sum + getCardDamage(context, cardId), 0);
    }

    case "clamp": {
      const value = resolveOperand(amount.value, context, targetId);
      const max = resolveOperand(amount.max, context, targetId);
      const min = amount.min === undefined ? 0 : resolveOperand(amount.min, context, targetId);
      const boundedMax = Math.max(min, max);
      return Math.max(min, Math.min(value, boundedMax));
    }

    case "trigger-amount":
      return sanitizeNumber(context.eventSnapshot?.triggerAmount);

    case "damage-on-target":
      return targetId ? getCardDamage(context, targetId) : 0;

    case "damage-on-self":
      return context.sourceId ? getCardDamage(context, context.sourceId) : 0;

    case "cards-in-hand": {
      const count = resolveOpponentScopedValue(
        context,
        (playerId) => {
          const visibleCards = context.ctx.framework.zones.getCards({
            zone: "hand",
            playerId,
          });
          return visibleCards.length > 0
            ? visibleCards.length
            : getPublicZoneCount(context, "hand", playerId);
        },
        amount.controller,
      );
      const modifier =
        typeof amount.modifier === "number" && Number.isFinite(amount.modifier)
          ? amount.modifier
          : 1;
      return count * modifier;
    }

    case "characters-in-play":
      return resolveOpponentScopedValue(
        context,
        (playerId) =>
          context.ctx.framework.zones.getCards({ zone: "play", playerId }).filter((cardId) => {
            const definition = context.ctx.cards.getDefinition(cardId) as
              | { cardType?: string }
              | undefined;
            return definition?.cardType === "character";
          }).length,
        amount.controller,
      );

    case "items-in-play":
      return resolveOpponentScopedValue(
        context,
        (playerId) =>
          context.ctx.framework.zones.getCards({ zone: "play", playerId }).filter((cardId) => {
            const definition = context.ctx.cards.getDefinition(cardId) as
              | { cardType?: string }
              | undefined;
            return definition?.cardType === "item";
          }).length,
        amount.controller,
      );

    case "cards-in-discard":
      return resolveOpponentScopedValue(
        context,
        (playerId) => context.ctx.framework.zones.getCards({ zone: "discard", playerId }).length,
        amount.controller,
      );

    case "lore":
      return resolveOpponentScopedValue(
        context,
        (playerId) => sanitizeNumber(context.ctx.G.lore[playerId]),
        amount.controller,
      );

    case "strength-of": {
      const descriptor = normalizeTargetDescriptor(amount.target);
      const scopedTargets = resolveDslTargets(context, amount.target, true);
      const preferScoped = descriptor?.reference !== undefined || descriptor?.selector === "self";
      const resolvedTarget = preferScoped
        ? (scopedTargets[0] ?? targetId)
        : (targetId ?? scopedTargets[0]);
      return resolvedTarget ? getCardStrength(context, resolvedTarget) : 0;
    }

    case "willpower-of": {
      const descriptor = normalizeTargetDescriptor(amount.target);
      const scopedTargets = resolveDslTargets(context, amount.target, true);
      const preferScoped = descriptor?.reference !== undefined || descriptor?.selector === "self";
      const resolvedTarget = preferScoped
        ? (scopedTargets[0] ?? targetId)
        : (targetId ?? scopedTargets[0]);
      const runtimeCard = resolvedTarget
        ? (context.ctx.cards.require(resolvedTarget) as { willpower?: number } | undefined)
        : undefined;
      if (runtimeCard?.willpower !== undefined) {
        return sanitizeNumber(runtimeCard.willpower);
      }

      if (!resolvedTarget) {
        return 0;
      }

      const definition = context.ctx.cards.getDefinition(resolvedTarget) as
        | { willpower?: unknown }
        | undefined;
      return sanitizeNumber(definition?.willpower);
    }

    case "lore-value-of": {
      const descriptor = normalizeTargetDescriptor(amount.target);
      const scopedTargets = resolveDslTargets(context, amount.target, true);
      const preferScoped = descriptor?.reference !== undefined || descriptor?.selector === "self";
      const resolvedTarget = preferScoped
        ? (scopedTargets[0] ?? targetId)
        : (targetId ?? scopedTargets[0]);
      return resolvedTarget ? getCardLoreValue(context, resolvedTarget) : 0;
    }

    case "cost-of": {
      const descriptor = normalizeTargetDescriptor(amount.target);
      const cardPlayed = createSyntheticCardPlayedPayload(context);
      if (!descriptor || !cardPlayed) {
        return 0;
      }

      const candidates = resolveCandidateTargets(context.ctx, cardPlayed, descriptor);
      const selected = selectTargets(candidates, descriptor, context.targets);
      const resolvedTarget = targetId ?? selected[0];
      return resolvedTarget ? getCardCost(context, resolvedTarget) : 0;
    }

    case "cards-under-self":
      return context.sourceId ? getCardsUnderCount(context, context.sourceId) : 0;

    case "classification-character-count":
      return resolveOpponentScopedValue(
        context,
        (playerId) =>
          context.ctx.framework.zones
            .getCards({ zone: "play", playerId })
            .filter(
              (cardId) => !(amount.excludeSelf && context.sourceId && cardId === context.sourceId),
            )
            .filter((cardId) => {
              const definition = context.ctx.cards.getDefinition(cardId) as
                | { cardType?: string; classifications?: unknown }
                | undefined;
              if (definition?.cardType !== "character") {
                return false;
              }

              const classifications = definition.classifications;
              return (
                Array.isArray(classifications) &&
                classifications.some((classification) => classification === amount.classification)
              );
            }).length,
        amount.controller,
      );

    case "name-character-count":
      return resolveOpponentScopedValue(
        context,
        (playerId) =>
          context.ctx.framework.zones
            .getCards({ zone: "play", playerId })
            .filter(
              (cardId) => !(amount.excludeSelf && context.sourceId && cardId === context.sourceId),
            )
            .filter((cardId) => {
              const definition = context.ctx.cards.getDefinition(cardId) as
                | { cardType?: string; name?: unknown }
                | undefined;
              return definition?.cardType === "character" && definition?.name === amount.name;
            }).length,
        amount.controller,
      );

    case "locations-in-play":
      return resolveOpponentScopedValue(
        context,
        (playerId) =>
          context.ctx.framework.zones.getCards({ zone: "play", playerId }).filter((cardId) => {
            const definition = context.ctx.cards.getDefinition(cardId) as
              | { cardType?: string }
              | undefined;
            return definition?.cardType === "location";
          }).length,
        amount.controller,
      );

    case "for-each": {
      const counter = resolveForEachCounter(context, amount.counter, targetId);
      const countValue =
        amount.count === undefined
          ? 1
          : resolveOperand(amount.count as VariableAmountOperand, context, targetId);
      const modifier =
        typeof amount.modifier === "number" && Number.isFinite(amount.modifier)
          ? amount.modifier
          : 1;
      return counter * countValue * modifier;
    }

    case "count": {
      const what = typeof amount.what === "string" ? amount.what : "";
      const controller =
        amount.controller === "opponent" || amount.controller === "opponents"
          ? amount.controller
          : "you";

      switch (what) {
        case "cards-in-hand":
          return resolveOpponentScopedValue(
            context,
            (playerId) => context.ctx.framework.zones.getCards({ zone: "hand", playerId }).length,
            controller,
          );
        case "cards-in-discard":
          return resolveOpponentScopedValue(
            context,
            (playerId) =>
              context.ctx.framework.zones.getCards({
                zone: "discard",
                playerId,
              }).length,
            controller,
          );
        case "characters":
        case "characters-in-play":
          return resolveOpponentScopedValue(
            context,
            (playerId) =>
              context.ctx.framework.zones.getCards({ zone: "play", playerId }).filter((cardId) => {
                const definition = context.ctx.cards.getDefinition(cardId) as
                  | { cardType?: string }
                  | undefined;
                return definition?.cardType === "character";
              }).length,
            controller,
          );
        default:
          return 0;
      }
    }

    case "VARIABLE":
      return 0;

    case "lore-lost":
      return sanitizeNumber(context.eventSnapshot?.triggerAmount);

    case "stat": {
      const stat = typeof amount.stat === "string" ? amount.stat : "";
      if (stat === "strength") {
        return context.sourceId ? getCardStrength(context, context.sourceId) : 0;
      }
      if (stat === "lore") {
        return context.sourceId ? getCardLoreValue(context, context.sourceId) : 0;
      }
      if (stat === "damage") {
        return context.sourceId ? getCardDamage(context, context.sourceId) : 0;
      }
      if (stat === "cost") {
        return context.sourceId ? getCardCost(context, context.sourceId) : 0;
      }
      return 0;
    }

    default:
      return 0;
  }
}

function isVariableAmountLike(value: unknown): value is VariableAmount {
  return typeof value === "object" && value !== null && "type" in value;
}

export function doesAmountReferenceTarget(amount: VariableAmount): boolean {
  return referencesTarget(amount);
}

export function resolveVariableAmount(
  amount: VariableAmount,
  context: VariableAmountResolutionContext,
): ResolvedVariableAmount {
  if (
    referencesTarget(amount) &&
    !hasFixedTargetRef(amount) &&
    Array.isArray(context.targets) &&
    context.targets.length > 0
  ) {
    const perTarget: ResolvedTargetAmountMap = {};
    for (const targetId of context.targets) {
      perTarget[targetId] = evaluateAggregate(amount, context, targetId);
    }

    return {
      mode: "per-target",
      perTarget,
    };
  }

  return {
    mode: "aggregate",
    value: evaluateAggregate(amount, context),
  };
}

export function resolveAmountString(
  amount: AmountString,
  context: VariableAmountResolutionContext,
): ResolvedVariableAmount | undefined {
  switch (amount) {
    case "DISCARDED_COUNT":
      return {
        mode: "aggregate",
        value: Array.isArray(context.targets) ? context.targets.length : 0,
      };
    case "DISCARDED_CARD_LORE": {
      const discardedIds = context.eventSnapshot?.discardedCardIds;
      if (!discardedIds || discardedIds.length === 0) {
        return { mode: "aggregate", value: 0 };
      }
      const firstDiscardedId = discardedIds[0]!;
      const definition = context.ctx.cards.getDefinition(firstDiscardedId) as
        | { lore?: unknown }
        | undefined;
      return { mode: "aggregate", value: sanitizeNumber(definition?.lore) };
    }
    case "DAMAGE_DEALT":
      return {
        mode: "aggregate",
        value: sanitizeNumber(context.eventSnapshot?.damageDealt),
      };
    case "DRAWN_COUNT":
      return {
        mode: "aggregate",
        value: sanitizeNumber(context.eventSnapshot?.drawnCount),
      };
    case "DAMAGE_REMOVED":
      return {
        mode: "aggregate",
        value: sanitizeNumber(context.eventSnapshot?.healedAmount),
      };
    case "X":
      return {
        mode: "aggregate",
        value: sanitizeNumber(context.eventSnapshot?.triggerAmount),
      };
    case "TARGET_STRENGTH": {
      if (!context.targets || context.targets.length === 0) {
        return { mode: "aggregate", value: 0 };
      }

      const perTarget: ResolvedTargetAmountMap = {};
      for (const targetId of context.targets) {
        perTarget[targetId] = getCardStrength(context, targetId);
      }
      return { mode: "per-target", perTarget };
    }
    case "TARGET_COST": {
      if (!context.targets || context.targets.length === 0) {
        return { mode: "aggregate", value: 0 };
      }

      const perTarget: ResolvedTargetAmountMap = {};
      for (const targetId of context.targets) {
        perTarget[targetId] = getCardCost(context, targetId);
      }
      return { mode: "per-target", perTarget };
    }
    case "TARGET_WILLPOWER": {
      if (!context.targets || context.targets.length === 0) {
        return { mode: "aggregate", value: 0 };
      }

      const perTarget: ResolvedTargetAmountMap = {};
      for (const targetId of context.targets) {
        const runtimeCard = context.ctx.cards.require(targetId) as
          | { willpower?: number }
          | undefined;
        if (runtimeCard?.willpower !== undefined) {
          perTarget[targetId] = sanitizeNumber(runtimeCard.willpower);
          continue;
        }

        const definition = context.ctx.cards.getDefinition(targetId) as
          | { willpower?: unknown }
          | undefined;
        perTarget[targetId] = sanitizeNumber(definition?.willpower);
      }
      return { mode: "per-target", perTarget };
    }
    default:
      return undefined;
  }
}

export function resolveAmountOperand(
  operand: VariableAmountOperand,
  context: VariableAmountResolutionContext,
): number {
  if (typeof operand === "number") {
    return operand;
  }

  const resolved = resolveVariableAmount(operand, context);
  if (resolved.mode === "aggregate") {
    return sanitizeNumber(resolved.value);
  }

  return Object.values(resolved.perTarget ?? {}).reduce(
    (sum, value) => sum + sanitizeNumber(value),
    0,
  );
}

export function getTargetAmount(
  resolved: ResolvedVariableAmount | undefined,
  targetId: CardInstanceId,
): number | undefined {
  if (!resolved) {
    return undefined;
  }

  if (resolved.mode === "aggregate") {
    return resolved.value;
  }

  return resolved.perTarget?.[targetId];
}

export function isVariableAmountObject(value: unknown): value is VariableAmount {
  return isVariableAmountLike(value);
}
