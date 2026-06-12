import type {
  CardInstanceId,
  MoveEnumerationContext,
  MoveExecutionContext,
  MoveInput,
  MoveValidationContext,
  PlayerId,
} from "#core";
import type { LorcanaCard, LorcanaCardDefinition } from "@tcg/lorcana-types";
import type {
  LorcanaTargetDSL,
  LorcanaPlayerFilter,
  LorcanaPlayerTarget,
} from "@tcg/lorcana-types/targeting";
import { normalizeLorcanaTarget } from "@tcg/lorcana-types/targeting";
import type { CardPlayedPayload, LorcanaG } from "../../types";
import type { DynamicAmountEventSnapshot } from "../../types/domain-events";
import { cardHasName, hasKeyword } from "../../card-utils";
import { compareOperator } from "../../rules/operator-utils";
import {
  createProjectionState,
  getEffectiveLore,
  getEffectiveStrength,
  getEffectiveWillpower,
  type DerivedStateContext,
} from "../../rules/derived-state";
import { getOrBuildMoveRegistry } from "../../runtime-moves/rules/move-registry-cache";
import { hasTemporaryKeyword } from "../../runtime-moves/effects/temporary-effects";
import { getEffectsForCard } from "../../rules/static-effect-registry";
import { resolveTurnOwnerId } from "../../core/runtime/turn-owner";

type FilterRecord = Record<string, unknown>;

type FilterCarrier = {
  filter?: unknown;
  filters?: unknown;
};

export type QueryResolutionContext = {
  controllerId?: PlayerId;
  sourceCardId?: CardInstanceId;
  selectedTargets?: CardInstanceId[];
  eventSnapshot?: DynamicAmountEventSnapshot;
  strictUnknownFilters?: boolean;
  extraPredicate?: (cardId: CardInstanceId) => boolean;
  /**
   * When true, the Ward candidate filter is skipped for the `chosen` selector.
   *
   * Used when the target is being resolved as a damage *source* (e.g.
   * `move-damage`'s `from` endpoint) where damage is being *removed* from
   * the character, not *dealt* to it. Ward only prevents damage from being
   * dealt TO a character; it should not prevent damage from being removed
   * FROM one.
   */
  skipWardExclusion?: boolean;
};

export type TargetDescriptor = FilterCarrier & {
  selector?: string;
  count?: unknown;
  owner?: string;
  zones?: string[];
  cardTypes?: string[];
  cardType?: string;
  reference?: string;
  excludeSelf?: boolean;
  excludeTriggerSubject?: boolean;
  requireDifferentTargets?: boolean;
  /**
   * Optional cap on the sum of selected targets' ink costs.
   *
   * When present, {@link resolveEffectTargets} drops trailing selections whose
   * cumulative cost would exceed the budget, keeping the largest legal prefix
   * of the chooser's selection.
   */
  totalCostBudget?: number;
  /**
   * Optional cap on the sum of selected targets' base Strength.
   *
   * When present, {@link resolveEffectTargets} drops trailing selections whose
   * cumulative Strength would exceed the budget, keeping the largest legal
   * prefix of the chooser's selection.
   */
  totalStrengthBudget?: number;
};

export type PlayerTargetDescriptor = FilterCarrier & {
  selector?: string;
  count?: unknown;
};

export type ResolvedTargetQuery =
  | { kind: "card"; cardIds: CardInstanceId[] }
  | { kind: "player"; playerIds: PlayerId[] };

export type TargetSelectionInput =
  | CardInstanceId
  | PlayerId
  | readonly (CardInstanceId | PlayerId)[]
  | undefined;

type EffectTargetValidationContext = Pick<
  MoveValidationContext<MoveInput>,
  "G" | "playerId" | "framework" | "cards"
>;

type EffectTargetEnumerationContext = Pick<
  MoveEnumerationContext,
  "G" | "playerId" | "framework" | "cards"
>;

type EffectTargetReadonlyContext = Pick<EffectTargetValidationContext, "framework" | "cards"> &
  Partial<Pick<EffectTargetValidationContext, "G" | "playerId">>;

type EffectTargetExecutionContext = Pick<
  MoveExecutionContext<MoveInput>,
  "G" | "playerId" | "framework" | "cards"
>;

type EffectTargetRuntimeContext =
  | EffectTargetReadonlyContext
  | EffectTargetValidationContext
  | EffectTargetEnumerationContext
  | EffectTargetExecutionContext;

function getCardZoneKey(
  ctx: EffectTargetRuntimeContext,
  cardId: CardInstanceId,
): string | undefined {
  const directZoneKey = ctx.framework.zones.getCardZone?.(cardId);
  if (typeof directZoneKey === "string") {
    return directZoneKey;
  }

  const indexedZoneKey = ctx.framework.state._zonesPrivate?.cardIndex?.[cardId]?.zoneKey;
  return typeof indexedZoneKey === "string" ? indexedZoneKey : undefined;
}

function normalizeFilterOperator(filter: FilterRecord, fallback = "equal"): string {
  return String(filter.comparison ?? filter.operator ?? filter.op ?? fallback);
}

function normalizeFilterValue(filter: FilterRecord, fallback = 0): number {
  return Number(filter.value ?? filter.amount ?? fallback);
}

function getComparableParentTargetId(options?: {
  selectedTargets?: CardInstanceId[];
}): CardInstanceId | undefined {
  return options?.selectedTargets?.[0];
}

function isAwaitingParentTargetComparison(
  filter: FilterRecord,
  options?: {
    selectedTargets?: CardInstanceId[];
  },
): boolean {
  return (
    filter.compareWithParentsTarget === true &&
    filter.value === "target" &&
    !getComparableParentTargetId(options)
  );
}

function isCardStillInPlay(ctx: EffectTargetRuntimeContext, cardId: CardInstanceId): boolean {
  const zoneKey = ctx.framework.zones.getCardZone(cardId);
  return typeof zoneKey === "string" && (zoneKey === "play" || zoneKey.startsWith("play:"));
}

function getDerivedState(ctx: EffectTargetRuntimeContext): DerivedStateContext {
  return createProjectionState(ctx.framework.state, ctx.G);
}

function resolveParentTargetComparisonValue(
  ctx: EffectTargetRuntimeContext,
  filter: FilterRecord,
  options?: {
    eventSnapshot?: DynamicAmountEventSnapshot;
    selectedTargets?: CardInstanceId[];
  },
): number | undefined {
  const parentTargetId = getComparableParentTargetId(options);
  if (!parentTargetId) {
    return undefined;
  }

  const parentDefinition = getCardDefinition(ctx, parentTargetId);
  if (!parentDefinition) {
    return undefined;
  }

  const registry = getOrBuildMoveRegistry(
    ctx as import("../../runtime-moves/rules/move-registry-cache").MoveRegistryCtx,
  );
  switch (normalizeFilterType(filter)) {
    case "strength":
    case "strength-comparison":
      if (isCardStillInPlay(ctx, parentTargetId)) {
        return getEffectiveStrength(
          ctx.cards.getDefinition(parentTargetId) as any,
          getDerivedState(ctx),
          parentTargetId,
          (id) => ctx.cards.getDefinition(id) as any,
          registry,
        );
      }
      if (typeof options?.eventSnapshot?.strengthBeforeBanish === "number") {
        return options.eventSnapshot.strengthBeforeBanish;
      }
      return Number(parentDefinition.strength ?? 0);
    case "willpower":
    case "willpower-comparison":
      return Number(parentDefinition.willpower ?? 0);
    case "cost":
    case "cost-comparison":
      return Number(parentDefinition.cost ?? 0);
    case "lore":
    case "lore-value":
    case "lore-comparison":
      return isCardStillInPlay(ctx, parentTargetId)
        ? getEffectiveLore(
            ctx.cards.getDefinition(parentTargetId) as any,
            getDerivedState(ctx),
            parentTargetId,
            (id) => ctx.cards.getDefinition(id) as any,
            registry,
          )
        : Number(parentDefinition.lore ?? 0);
    default:
      return undefined;
  }
}

function normalizeFilterType(filter: FilterRecord): string {
  const baseType = String(filter.type ?? "");
  if (baseType !== "status") {
    return baseType;
  }

  return typeof filter.status === "string" ? filter.status : baseType;
}

export function normalizeTargetDescriptor(target: unknown): TargetDescriptor | undefined {
  if (!target) {
    return undefined;
  }

  if (target === "chosen-for-effect") {
    return {
      selector: "chosen",
      count: 1,
      reference: "selected-first",
    };
  }

  if (typeof target === "object" && target !== null && !Array.isArray(target)) {
    const targetRecord = target as Record<string, unknown>;
    const reference =
      typeof targetRecord.ref === "string"
        ? targetRecord.ref
        : typeof targetRecord.reference === "string"
          ? targetRecord.reference
          : undefined;
    if (reference) {
      return {
        selector: typeof targetRecord.selector === "string" ? targetRecord.selector : "all",
        count: targetRecord.count ?? "all",
        owner: typeof targetRecord.owner === "string" ? targetRecord.owner : undefined,
        zones: Array.isArray(targetRecord.zones)
          ? targetRecord.zones.filter((zone): zone is string => typeof zone === "string")
          : undefined,
        cardTypes: Array.isArray(targetRecord.cardTypes)
          ? targetRecord.cardTypes.filter(
              (cardType): cardType is string => typeof cardType === "string",
            )
          : undefined,
        cardType: typeof targetRecord.cardType === "string" ? targetRecord.cardType : undefined,
        reference,
        filter: targetRecord.filter,
        filters: targetRecord.filters,
        excludeSelf: targetRecord.excludeSelf === true,
        requireDifferentTargets: targetRecord.requireDifferentTargets === true,
        totalCostBudget:
          typeof targetRecord.totalCostBudget === "number" &&
          Number.isFinite(targetRecord.totalCostBudget)
            ? targetRecord.totalCostBudget
            : undefined,
        totalStrengthBudget:
          typeof targetRecord.totalStrengthBudget === "number" &&
          Number.isFinite(targetRecord.totalStrengthBudget)
            ? targetRecord.totalStrengthBudget
            : undefined,
      };
    }
  }

  const normalized = normalizeLorcanaTarget(target as LorcanaTargetDSL);
  if (!normalized || isPlayerTargetDescriptor(normalized)) {
    return undefined;
  }

  // Copy budget fields that may not be propagated by older normalizeLorcanaTarget versions.
  const descriptor = normalized as TargetDescriptor;
  const rawTarget = target as Record<string, unknown>;
  if (
    descriptor.totalCostBudget === undefined &&
    typeof rawTarget.totalCostBudget === "number" &&
    Number.isFinite(rawTarget.totalCostBudget)
  ) {
    descriptor.totalCostBudget = rawTarget.totalCostBudget as number;
  }
  if (
    descriptor.totalStrengthBudget === undefined &&
    typeof rawTarget.totalStrengthBudget === "number" &&
    Number.isFinite(rawTarget.totalStrengthBudget)
  ) {
    descriptor.totalStrengthBudget = rawTarget.totalStrengthBudget as number;
  }
  return descriptor;
}

export function isPlayerTargetDescriptor(target: unknown): target is PlayerTargetDescriptor {
  if (typeof target !== "object" || target === null || Array.isArray(target)) {
    return false;
  }

  const descriptor = target as Record<string, unknown>;
  const selector = descriptor.selector;

  if (
    selector !== "you" &&
    selector !== "opponent" &&
    selector !== "each-opponent" &&
    selector !== "each-player" &&
    selector !== "chosen" &&
    selector !== "challenging-player"
  ) {
    return false;
  }

  return (
    descriptor.reference === undefined &&
    descriptor.owner === undefined &&
    descriptor.cardType === undefined &&
    descriptor.cardTypes === undefined &&
    descriptor.zones === undefined
  );
}

export function resolveCurrentTurnPlayerId(ctx: EffectTargetRuntimeContext): PlayerId | undefined {
  return resolveTurnOwnerId(ctx.framework.state, ctx.G);
}

export function normalizeSelectedTargets(
  targets: TargetSelectionInput,
): CardInstanceId[] | undefined {
  if (!targets) {
    return undefined;
  }
  if (Array.isArray(targets)) {
    return targets
      .filter((target) => typeof target === "string")
      .map((target) => target as CardInstanceId);
  }
  return typeof targets === "string" ? [targets as CardInstanceId] : undefined;
}

export function resolveSelectedPlayerIds(
  playerIds: readonly PlayerId[],
  targets: TargetSelectionInput,
): PlayerId[] | undefined {
  if (!targets) {
    return undefined;
  }

  const rawTargets = Array.isArray(targets) ? targets : [targets];
  const resolved = rawTargets
    .map((target) => playerIds.find((playerId) => playerId === (target as string)))
    .filter((playerId): playerId is PlayerId => playerId !== undefined);

  return resolved.length > 0 ? [...new Set(resolved)] : undefined;
}

export function resolveOwnerPlayerIds(
  owner: string | undefined,
  controllerId: PlayerId,
  playerIds: readonly PlayerId[],
): PlayerId[] {
  switch (owner) {
    case "you":
      return [controllerId];
    case "opponent":
      return playerIds.filter((playerId) => playerId !== controllerId);
    case "any":
    default:
      return [...playerIds];
  }
}

export function getTargetFilters(descriptor: FilterCarrier): FilterRecord[] {
  const filters: FilterRecord[] = [];
  if (Array.isArray(descriptor.filter)) {
    for (const filter of descriptor.filter) {
      if (filter && typeof filter === "object") {
        filters.push(filter as FilterRecord);
      }
    }
  } else if (descriptor.filter && typeof descriptor.filter === "object") {
    filters.push(descriptor.filter as FilterRecord);
  }
  if (Array.isArray(descriptor.filters)) {
    for (const filter of descriptor.filters) {
      if (filter && typeof filter === "object") {
        filters.push(filter as FilterRecord);
      }
    }
  } else if (descriptor.filters && typeof descriptor.filters === "object") {
    filters.push(descriptor.filters as FilterRecord);
  }
  return filters;
}

function getCardDefinition(
  ctx: EffectTargetRuntimeContext,
  cardId: CardInstanceId,
): LorcanaCardDefinition | undefined {
  const runtimeDefinition = ctx.cards.get?.(cardId)?.definition;
  if (
    runtimeDefinition &&
    typeof runtimeDefinition === "object" &&
    !Array.isArray(runtimeDefinition)
  ) {
    return runtimeDefinition as unknown as LorcanaCardDefinition;
  }

  const definition = ctx.cards.getDefinition(cardId);
  return definition && typeof definition === "object" && !Array.isArray(definition)
    ? (definition as unknown as LorcanaCardDefinition)
    : undefined;
}

export function resolveCardParentId(
  ctx: EffectTargetRuntimeContext,
  cardId: CardInstanceId,
): CardInstanceId | undefined {
  const directParent = ctx.cards.require(cardId).meta?.stackParentId as CardInstanceId | undefined;
  if (directParent) {
    return directParent;
  }

  const playerIds = ctx.framework.state.playerIds;
  for (const playerId of playerIds) {
    const playCards = ctx.framework.zones.getCards({
      zone: "play",
      playerId,
    }) as CardInstanceId[];
    for (const playCardId of playCards) {
      const cardsUnder = ctx.cards.require(playCardId).meta?.cardsUnder;
      if (Array.isArray(cardsUnder) && cardsUnder.includes(cardId)) {
        return playCardId;
      }
    }
  }

  return undefined;
}

function resolveReferenceCandidates(
  cardPlayed: CardPlayedPayload | undefined,
  descriptor: TargetDescriptor,
  queryContext: QueryResolutionContext | undefined,
  G?: {
    challengeState?: { attacker?: CardInstanceId; defender?: CardInstanceId };
  },
): CardInstanceId[] {
  const reference = descriptor.reference;
  if (!reference) {
    return [];
  }

  const selectedTargets = queryContext?.selectedTargets ?? [];
  const revealedCards =
    (queryContext?.eventSnapshot?.revealedCardIds as CardInstanceId[] | undefined) ?? [];
  const chosenCardId = queryContext?.eventSnapshot?.chosenCardId as CardInstanceId | undefined;
  const sourceCardId = queryContext?.sourceCardId ?? cardPlayed?.cardId;
  const triggerSubjectCardId = queryContext?.eventSnapshot?.subjectCardId as
    | CardInstanceId
    | undefined;
  const triggerSourceCardId = queryContext?.eventSnapshot?.triggerSourceCardId as
    | CardInstanceId
    | undefined;
  const triggerAttackerId = queryContext?.eventSnapshot?.attackerId as CardInstanceId | undefined;
  const triggerDefenderId = queryContext?.eventSnapshot?.defenderId as CardInstanceId | undefined;
  const triggerDestinationZone = queryContext?.eventSnapshot?.toZone;
  const triggerDestinationCardId =
    typeof triggerDestinationZone === "string" && triggerDestinationZone.startsWith("location:")
      ? (triggerDestinationZone.slice("location:".length) as CardInstanceId)
      : undefined;

  switch (reference) {
    case "source":
    case "self":
      return sourceCardId ? [sourceCardId] : [];
    case "trigger-subject":
      return triggerSubjectCardId ? [triggerSubjectCardId] : [];
    case "trigger-destination":
      return triggerDestinationCardId ? [triggerDestinationCardId] : [];
    case "trigger-source":
      return triggerSourceCardId ? [triggerSourceCardId] : [];
    case "attacker":
      return triggerAttackerId
        ? [triggerAttackerId]
        : G?.challengeState?.attacker
          ? [G.challengeState.attacker]
          : [];
    case "defender":
      return triggerDefenderId
        ? [triggerDefenderId]
        : G?.challengeState?.defender
          ? [G.challengeState.defender]
          : [];
    case "previous-target":
      return selectedTargets.length > 0 ? [selectedTargets[selectedTargets.length - 1]!] : [];
    case "selected-first":
      return selectedTargets.length > 0 ? [selectedTargets[0]!] : [];
    case "selected-all":
      return [...selectedTargets];
    case "revealed-first":
      return revealedCards.length > 0 ? [revealedCards[0]!] : [];
    case "revealed-all":
      return [...revealedCards];
    case "chosen-or-source":
      return chosenCardId ? [chosenCardId] : sourceCardId ? [sourceCardId] : [];
    case "singers":
      return Array.isArray(cardPlayed?.singerIds) ? [...cardPlayed.singerIds] : [];
    default:
      return [];
  }
}

export function passesFilter(
  ctx: EffectTargetRuntimeContext,
  cardId: CardInstanceId,
  filter: FilterRecord,
  controllerId: PlayerId,
  options?: {
    eventSnapshot?: DynamicAmountEventSnapshot;
    selectedTargets?: CardInstanceId[];
    sourceCardId?: CardInstanceId;
    strictUnknownFilters?: boolean;
  },
): boolean {
  const strictUnknownFilters = options?.strictUnknownFilters === true;
  const disableFilterRegistry =
    (ctx as { disableFilterRegistry?: boolean }).disableFilterRegistry === true;
  const getStrengthByInstanceId = (
    ctx as {
      getCardStrengthByInstanceId?: (cardId: CardInstanceId) => number;
    }
  ).getCardStrengthByInstanceId;
  const getWillpowerByInstanceId = (
    ctx as {
      getCardWillpowerByInstanceId?: (cardId: CardInstanceId) => number;
    }
  ).getCardWillpowerByInstanceId;
  let filterRegistry: ReturnType<typeof getOrBuildMoveRegistry> | undefined;
  const getFilterRegistry = () => {
    if (disableFilterRegistry) {
      return undefined;
    }
    filterRegistry ??= getOrBuildMoveRegistry(
      ctx as import("../../runtime-moves/rules/move-registry-cache").MoveRegistryCtx,
    );
    return filterRegistry;
  };
  const sourceCardId = options?.sourceCardId;
  const filterType = normalizeFilterType(filter);
  const cardMeta = ctx.cards.require(cardId).meta;
  const damage = Number(cardMeta?.damage ?? 0);
  const cardDefinition = getCardDefinition(ctx, cardId);
  const chosenCardId = options?.eventSnapshot?.chosenCardId as CardInstanceId | undefined;
  const chosenDefinition = chosenCardId ? getCardDefinition(ctx, chosenCardId) : undefined;

  if (filter.sameNameAsSource === true) {
    const sourceDefinition = sourceCardId ? getCardDefinition(ctx, sourceCardId) : undefined;
    if (
      !sourceDefinition?.name ||
      !cardDefinition ||
      cardDefinition.name !== sourceDefinition.name
    ) {
      return false;
    }
  }

  if (filter.sameNameAsChosenCard === true) {
    if (
      !chosenDefinition?.name ||
      !cardDefinition ||
      cardDefinition.name !== chosenDefinition.name
    ) {
      return false;
    }
  }

  if (filter.sameInstanceAsSource === true && sourceCardId && cardId !== sourceCardId) {
    return false;
  }

  if (filter.excludeChosenCard === true && chosenCardId && cardId === chosenCardId) {
    return false;
  }

  switch (filterType) {
    case "and": {
      const filters = Array.isArray(filter.filters) ? filter.filters : [];
      return filters.every(
        (entry) =>
          entry &&
          typeof entry === "object" &&
          passesFilter(ctx, cardId, entry as FilterRecord, controllerId, options),
      );
    }

    case "or": {
      const filters = Array.isArray(filter.filters) ? filter.filters : [];
      return filters.some(
        (entry) =>
          entry &&
          typeof entry === "object" &&
          passesFilter(ctx, cardId, entry as FilterRecord, controllerId, options),
      );
    }

    case "not": {
      if (!filter.filter || typeof filter.filter !== "object") {
        return strictUnknownFilters ? false : true;
      }
      return !passesFilter(ctx, cardId, filter.filter as FilterRecord, controllerId, options);
    }

    case "damaged":
      return damage > 0;
    case "undamaged":
      return damage <= 0;
    case "exerted":
      return cardMeta?.state === "exerted";
    case "ready":
      return cardMeta?.state !== "exerted";

    case "owner": {
      const owner = String(filter.owner ?? "any");
      const cardOwner = ctx.framework.zones.getCardOwner(cardId) as PlayerId | undefined;
      if (!cardOwner) {
        return false;
      }
      if (owner === "you") {
        return cardOwner === controllerId;
      }
      if (owner === "opponent") {
        return cardOwner !== controllerId;
      }
      return true;
    }

    case "challenged-this-turn": {
      const challengedCharacters = ctx.G?.turnMetadata?.challengedCharactersThisTurn ?? [];
      return challengedCharacters.includes(cardId);
    }

    case "challenge-role": {
      const role = String(filter.role ?? "");
      const challengeState = ctx.G?.challengeState;
      if (!challengeState) {
        return false;
      }

      if (role === "attacker") {
        return cardId === challengeState.attacker;
      }

      if (role === "defender") {
        return cardId === challengeState.defender;
      }

      return false;
    }

    case "card-type": {
      const expectedType = String(filter.cardType ?? filter.value ?? "");
      const actualCardType = cardDefinition?.cardType;
      if (expectedType === "song") {
        return actualCardType === "action" && (cardDefinition as any)?.actionSubtype === "song";
      }
      return typeof actualCardType === "string" && expectedType.length > 0
        ? actualCardType === expectedType
        : expectedType.length === 0;
    }

    case "classification":
    case "has-classification": {
      const classification = String(filter.classification ?? "");
      const classifications = cardDefinition?.classifications;
      return (
        classification.length > 0 &&
        Array.isArray(classifications) &&
        classifications.some((value) => value === classification)
      );
    }

    case "has-keyword": {
      const keyword = String(filter.keyword ?? "");
      if (keyword.length === 0) {
        return true;
      }

      const currentTurn = ctx.framework.state.status?.turn ?? 1;
      const hasStaticKeyword = cardDefinition
        ? hasKeyword(cardDefinition as never, keyword)
        : false;
      const hasTemporary = hasTemporaryKeyword(
        ctx.cards.require(cardId).meta,
        currentTurn,
        keyword,
      );
      if (hasStaticKeyword || hasTemporary) {
        return true;
      }
      const filterReg = getFilterRegistry();
      if (filterReg) {
        const hasGrantedKeyword = getEffectsForCard(filterReg, cardId, "gain-keyword").some(
          (e) => e.payload.keyword === keyword,
        );
        if (hasGrantedKeyword) {
          return true;
        }
      }
      return false;
    }

    case "name": {
      if (typeof filter.name === "string") {
        return cardDefinition ? cardHasName(cardDefinition, filter.name) : false;
      }
      if (typeof filter.equals === "string") {
        return cardDefinition ? cardHasName(cardDefinition, filter.equals) : false;
      }
      if (typeof filter.contains === "string") {
        const cardName = typeof cardDefinition?.name === "string" ? cardDefinition.name : "";
        const normalizedCardName = cardName.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
        const normalizedContains = filter.contains
          .normalize("NFD")
          .replace(/\p{M}/gu, "")
          .toLowerCase();
        return normalizedCardName.includes(normalizedContains);
      }
      return true;
    }

    case "has-name": {
      const expectedName = String(filter.name ?? "");
      return expectedName.length > 0 && cardDefinition
        ? cardHasName(cardDefinition, expectedName)
        : true;
    }

    case "named-card": {
      const namedCardName = options?.eventSnapshot?.namedCardName?.trim();
      return (
        typeof namedCardName === "string" &&
        namedCardName.length > 0 &&
        cardDefinition !== undefined &&
        cardHasName(cardDefinition, namedCardName)
      );
    }

    case "cost":
    case "cost-comparison": {
      if (isAwaitingParentTargetComparison(filter, options)) {
        return true;
      }
      const operator = normalizeFilterOperator(filter);
      const value =
        filter.compareWithParentsTarget === true && filter.value === "target"
          ? resolveParentTargetComparisonValue(ctx, filter, options)
          : normalizeFilterValue(filter);
      if (typeof value !== "number" || !Number.isFinite(value)) {
        return false;
      }
      const cost = Number(cardDefinition?.cost ?? 0);
      return compareOperator(cost, operator, value);
    }

    case "strength":
    case "strength-comparison": {
      if (isAwaitingParentTargetComparison(filter, options)) {
        return true;
      }
      const operator = normalizeFilterOperator(filter);
      let value: number | undefined;

      if (filter.value === "source" && sourceCardId) {
        if (typeof options?.eventSnapshot?.strengthBeforeBanish === "number") {
          value = options.eventSnapshot.strengthBeforeBanish;
        } else if (disableFilterRegistry && getStrengthByInstanceId) {
          value = getStrengthByInstanceId(sourceCardId);
        } else {
          const sourceDef = getCardDefinition(ctx, sourceCardId);
          if (isCardStillInPlay(ctx, sourceCardId)) {
            value = getEffectiveStrength(
              ctx.cards.getDefinition(sourceCardId) as any,
              getDerivedState(ctx),
              sourceCardId,
              (id) => ctx.cards.getDefinition(id) as any,
              getFilterRegistry(),
            );
          } else {
            value = Number(sourceDef?.strength ?? 0);
          }
        }
      } else {
        value =
          filter.compareWithParentsTarget === true && filter.value === "target"
            ? resolveParentTargetComparisonValue(ctx, filter, options)
            : normalizeFilterValue(filter);
      }

      if (typeof value !== "number" || !Number.isFinite(value)) {
        return false;
      }
      const strength = getEffectiveStrength(
        cardDefinition as any,
        getDerivedState(ctx),
        cardId,
        (id) => ctx.cards.getDefinition(id) as any,
        disableFilterRegistry ? undefined : getFilterRegistry(),
      );
      const effectiveStrength =
        disableFilterRegistry && getStrengthByInstanceId
          ? getStrengthByInstanceId(cardId)
          : strength;
      return compareOperator(effectiveStrength, operator, value);
    }

    case "willpower":
    case "willpower-comparison": {
      if (isAwaitingParentTargetComparison(filter, options)) {
        return true;
      }
      const operator = normalizeFilterOperator(filter);
      const value =
        filter.compareWithParentsTarget === true && filter.value === "target"
          ? resolveParentTargetComparisonValue(ctx, filter, options)
          : normalizeFilterValue(filter);
      if (typeof value !== "number" || !Number.isFinite(value)) {
        return false;
      }
      const willpower = getEffectiveWillpower(
        cardDefinition as any,
        getDerivedState(ctx),
        cardId,
        (id) => ctx.cards.getDefinition(id) as any,
        disableFilterRegistry ? undefined : getFilterRegistry(),
      );
      const effectiveWillpower =
        disableFilterRegistry && getWillpowerByInstanceId
          ? getWillpowerByInstanceId(cardId)
          : willpower;
      return compareOperator(effectiveWillpower, operator, value);
    }

    case "lore":
    case "lore-value":
    case "lore-comparison": {
      if (isAwaitingParentTargetComparison(filter, options)) {
        return true;
      }
      const operator = normalizeFilterOperator(filter);
      const value =
        filter.compareWithParentsTarget === true && filter.value === "target"
          ? resolveParentTargetComparisonValue(ctx, filter, options)
          : normalizeFilterValue(filter);
      if (typeof value !== "number" || !Number.isFinite(value)) {
        return false;
      }
      const loreValue = getEffectiveLore(
        cardDefinition as any,
        getDerivedState(ctx),
        cardId,
        (id) => ctx.cards.getDefinition(id) as any,
        getFilterRegistry(),
      );
      return compareOperator(loreValue, operator, value);
    }

    case "zone": {
      const expectedZone = String(filter.zone ?? "");
      const zoneKey = ctx.framework.zones.getCardZone(cardId);
      if (typeof zoneKey !== "string" || expectedZone.length === 0) {
        return true;
      }
      return zoneKey === expectedZone || zoneKey.startsWith(`${expectedZone}:`);
    }

    case "at-location": {
      const atLocationId = ctx.cards.require(cardId).meta?.atLocationId as
        | CardInstanceId
        | undefined;
      if (!atLocationId) {
        return false;
      }

      const locationName = filter.location ?? filter.locationName;
      if (typeof locationName !== "string" || locationName.length === 0) {
        return true;
      }

      const locationDefinition = getCardDefinition(ctx, atLocationId);
      return locationDefinition?.name === locationName;
    }

    case "same-location-as-source": {
      if (!sourceCardId) {
        return false;
      }

      const sourceDefinition = getCardDefinition(ctx, sourceCardId);
      const sourceMetaLocationId = ctx.cards.require(sourceCardId).meta?.atLocationId as
        | CardInstanceId
        | undefined;
      const sourceLocationId =
        sourceMetaLocationId ??
        (sourceDefinition?.cardType === "location" ? sourceCardId : undefined);
      const targetLocationId = ctx.cards.require(cardId).meta?.atLocationId as
        | CardInstanceId
        | undefined;
      if (sourceLocationId && targetLocationId && sourceLocationId === targetLocationId) {
        return true;
      }

      // When a location is banished, characters are evacuated (atLocationId cleared)
      // before condition evaluation. Use the snapshot to check if the character
      // was at the source location before banishment.
      const charsSnapshot = options?.eventSnapshot?.charactersAtSourceLocationBeforeBanish;
      if (sourceLocationId && !targetLocationId && Array.isArray(charsSnapshot)) {
        return charsSnapshot.includes(cardId);
      }

      return false;
    }

    case "cards-under": {
      const operator = normalizeFilterOperator(filter, "greater-or-equal");
      const value = normalizeFilterValue(filter, 1);
      const cardsUnder = ctx.cards.require(cardId).meta?.cardsUnder;
      const count = Array.isArray(cardsUnder) ? cardsUnder.length : 0;
      return compareOperator(count, operator, value);
    }

    case "under-parent": {
      const parentId = resolveCardParentId(ctx, cardId);
      if (!parentId) {
        return false;
      }

      const parentOwner = ctx.framework.zones.getCardOwner(parentId) as PlayerId | undefined;
      const owner = String(filter.owner ?? "any");
      if (owner === "you" && parentOwner !== controllerId) {
        return false;
      }
      if (owner === "opponent" && (!parentOwner || parentOwner === controllerId)) {
        return false;
      }

      const expectedCardTypes = Array.isArray(filter.cardTypes)
        ? filter.cardTypes.filter((cardType): cardType is string => typeof cardType === "string")
        : [];
      if (expectedCardTypes.length === 0) {
        return true;
      }

      const parentDefinition = getCardDefinition(ctx, parentId);
      return Boolean(
        typeof parentDefinition?.cardType === "string" &&
        expectedCardTypes.includes(parentDefinition.cardType),
      );
    }

    case "ink-type": {
      const expectedInkType = String(filter.inkType ?? "");
      const inkTypes = cardDefinition?.inkType;
      return (
        expectedInkType.length > 0 &&
        Array.isArray(inkTypes) &&
        inkTypes.some((value) => value === expectedInkType)
      );
    }

    case "attribute": {
      const attribute = String(filter.attribute ?? "");
      if (attribute === "inkwell") {
        // AttributeBooleanFilter: { type: "attribute", attribute: "inkwell", value: boolean }
        // Matches cards that are inkable (can be placed in inkwell)
        const expectedValue = filter.value === true;
        const isInkable = Boolean((cardDefinition as { inkable?: boolean } | undefined)?.inkable);
        return isInkable === expectedValue;
      }
      // Numeric attributes
      if (
        attribute === "cost" ||
        attribute === "strength" ||
        attribute === "willpower" ||
        attribute === "lore"
      ) {
        const operator = normalizeFilterOperator(filter);
        const value = normalizeFilterValue(filter);
        if (typeof value !== "number" || !Number.isFinite(value)) {
          return false;
        }
        const attrValue = Number(
          (cardDefinition as Record<string, unknown> | undefined)?.[attribute] ?? 0,
        );
        return compareOperator(attrValue, operator, value);
      }
      // String attributes
      if (attribute === "name" || attribute === "title") {
        const attrValue = String(
          (cardDefinition as Record<string, unknown> | undefined)?.[attribute] ?? "",
        );
        const comparison = String(filter.comparison ?? "equals");
        const expectedStr = String(filter.value ?? "");
        if (comparison === "equals") {
          return attrValue === expectedStr;
        }
        if (comparison === "contains") {
          return attrValue.includes(expectedStr);
        }
        return false;
      }
      return !strictUnknownFilters;
    }

    case "source": {
      const ref = String(filter.ref ?? "");
      if (ref === "other") {
        return !sourceCardId || cardId !== sourceCardId;
      }
      if (ref === "self") {
        return !!sourceCardId && cardId === sourceCardId;
      }
      if (ref === "trigger-source") {
        const triggerSource = options?.eventSnapshot?.triggerSourceCardId as
          | CardInstanceId
          | undefined;
        return !!triggerSource && cardId === triggerSource;
      }
      return !strictUnknownFilters;
    }

    default:
      return !strictUnknownFilters;
  }
}

function passesPlayerFilter(
  ctx: EffectTargetRuntimeContext,
  playerId: PlayerId,
  filter: FilterRecord,
  strictUnknownFilters: boolean,
  queryContext?: QueryResolutionContext,
): boolean {
  const sourceCardId = queryContext?.sourceCardId;

  const filterType = String(filter.type ?? "");

  const getPlayerZoneCount = (zone: string): number => {
    const cards = ctx.framework.zones.getCards({
      zone: zone as "deck" | "hand" | "play" | "discard" | "inkwell" | "limbo",
      playerId,
    }) as CardInstanceId[];

    if (zone !== "hand" || !sourceCardId || !cards.includes(sourceCardId)) {
      return cards.length;
    }

    return Math.max(0, cards.length - 1);
  };

  switch (filterType) {
    case "and": {
      const filters = Array.isArray(filter.filters) ? filter.filters : [];
      return filters.every(
        (entry) =>
          entry &&
          typeof entry === "object" &&
          passesPlayerFilter(
            ctx,
            playerId,
            entry as FilterRecord,
            strictUnknownFilters,
            queryContext,
          ),
      );
    }

    case "or": {
      const filters = Array.isArray(filter.filters) ? filter.filters : [];
      return filters.some(
        (entry) =>
          entry &&
          typeof entry === "object" &&
          passesPlayerFilter(
            ctx,
            playerId,
            entry as FilterRecord,
            strictUnknownFilters,
            queryContext,
          ),
      );
    }

    case "not": {
      if (!filter.filter || typeof filter.filter !== "object") {
        return strictUnknownFilters ? false : true;
      }
      return !passesPlayerFilter(
        ctx,
        playerId,
        filter.filter as FilterRecord,
        strictUnknownFilters,
        queryContext,
      );
    }

    case "lore": {
      const operator = normalizeFilterOperator(filter);
      const value = normalizeFilterValue(filter);
      const lore = Number(ctx.G?.lore?.[playerId] ?? 0);
      return compareOperator(lore, operator, value);
    }

    case "current-turn-player": {
      const currentTurnPlayerId = resolveCurrentTurnPlayerId(ctx);
      const expected = filter.value === undefined ? true : filter.value === true;
      return expected ? currentTurnPlayerId === playerId : currentTurnPlayerId !== playerId;
    }

    case "zone-count-rank": {
      const zone = String(filter.zone ?? "");
      if (zone.length === 0) {
        return strictUnknownFilters ? false : true;
      }

      const rank = String(filter.rank ?? "highest");
      const ties = String(filter.ties ?? "all");
      const minCount = Number.isFinite(Number(filter.minCount)) ? Number(filter.minCount) : 0;
      if (rank !== "highest" || ties !== "all") {
        return strictUnknownFilters ? false : true;
      }

      const allCounts = ctx.framework.state.playerIds.map((candidatePlayerId) => {
        const cards = ctx.framework.zones.getCards({
          zone: zone as "deck" | "hand" | "play" | "discard" | "inkwell" | "limbo",
          playerId: candidatePlayerId,
        }) as CardInstanceId[];
        if (zone === "hand" && sourceCardId && cards.includes(sourceCardId)) {
          return Math.max(0, cards.length - 1);
        }

        return cards.length;
      });
      const highestCount = allCounts.length > 0 ? Math.max(...allCounts) : 0;
      const playerCount = getPlayerZoneCount(zone);
      return highestCount >= minCount && playerCount === highestCount;
    }

    default:
      return !strictUnknownFilters;
  }
}

function isCardPlayedPayload(value: unknown): value is CardPlayedPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.cardId === "string" && typeof record.playerId === "string";
}

function resolveCandidateTargetsInternal(
  ctx: EffectTargetRuntimeContext,
  cardPlayed: CardPlayedPayload | undefined,
  descriptor: TargetDescriptor | undefined,
  queryContext?: QueryResolutionContext,
): CardInstanceId[] {
  if (!descriptor) {
    return [];
  }

  const controllerId = queryContext?.controllerId ?? cardPlayed?.playerId;
  if (!controllerId) {
    return [];
  }

  const zones = descriptor.zones?.length ? descriptor.zones : ["play"];
  const ownerPlayerIds = resolveOwnerPlayerIds(
    descriptor.owner,
    controllerId,
    ctx.framework.state.playerIds,
  );
  const candidates = new Set<CardInstanceId>();

  if (typeof descriptor.reference === "string") {
    for (const cardId of resolveReferenceCandidates(cardPlayed, descriptor, queryContext, ctx.G)) {
      if (typeof cardId === "string" && getCardZoneKey(ctx, cardId) !== undefined) {
        candidates.add(cardId);
      }
    }
  } else if (descriptor.selector === "self" && !descriptor.zones?.length) {
    // When targeting SELF without explicit zone constraints, the source card may be in any zone
    // (e.g., already in discard after being banished). Add it directly, bypassing zone filtering.
    const selfCardId = queryContext?.sourceCardId ?? cardPlayed?.cardId;
    if (selfCardId && getCardZoneKey(ctx, selfCardId) !== undefined) {
      candidates.add(selfCardId);
    }
  } else {
    for (const zone of zones) {
      for (const playerId of ownerPlayerIds) {
        const zoneCards = ctx.framework.zones.getCards({
          zone: zone as "deck" | "hand" | "play" | "discard" | "inkwell" | "limbo",
          playerId,
        }) as CardInstanceId[];
        for (const cardId of zoneCards) {
          candidates.add(cardId);
        }
      }
    }
  }

  const cardTypeFilters: string[] =
    descriptor.cardTypes ?? (descriptor.cardType ? [descriptor.cardType] : []);
  let resolvedCandidates = [...candidates];
  if (descriptor.zones?.length && typeof descriptor.reference === "string") {
    resolvedCandidates = resolvedCandidates.filter((cardId) => {
      const zoneKey = getCardZoneKey(ctx, cardId);
      if (typeof zoneKey !== "string" || zoneKey.length === 0) {
        return false;
      }

      return descriptor.zones?.includes(zoneKey.split(":")[0]!);
    });
  }
  if (queryContext?.sourceCardId && zones.includes("hand")) {
    resolvedCandidates = resolvedCandidates.filter(
      (cardId) => cardId !== queryContext.sourceCardId,
    );
  }
  // "card" is a wildcard meaning "any card type" — skip type filtering when present
  const hasWildcardCardType = cardTypeFilters.includes("card");
  if (cardTypeFilters.length > 0 && !hasWildcardCardType) {
    resolvedCandidates = resolvedCandidates.filter((cardId) => {
      const definition = getCardDefinition(ctx, cardId);
      if (typeof definition?.cardType !== "string") {
        return false;
      }
      for (const expectedType of cardTypeFilters) {
        // "song" is an action subtype, not a standalone card type
        if (
          expectedType === "song" &&
          definition.cardType === "action" &&
          (definition as { actionSubtype?: string }).actionSubtype === "song"
        ) {
          return true;
        }
        if (definition.cardType === expectedType) {
          return true;
        }
      }
      return false;
    });
  }

  const filters = getTargetFilters(descriptor);
  if (filters.length > 0) {
    resolvedCandidates = resolvedCandidates.filter((cardId) =>
      filters.every((filter) =>
        passesFilter(ctx, cardId, filter, controllerId, {
          eventSnapshot: queryContext?.eventSnapshot,
          selectedTargets: queryContext?.selectedTargets,
          sourceCardId: queryContext?.sourceCardId ?? cardPlayed?.cardId,
          strictUnknownFilters: queryContext?.strictUnknownFilters,
        }),
      ),
    );
  }

  if (descriptor.selector === "chosen" && !queryContext?.skipWardExclusion) {
    const choosingPlayerId = (ctx.playerId ??
      ctx.framework.state.currentPlayer ??
      ctx.framework.state.priority.holder ??
      controllerId) as PlayerId;
    const currentTurn = ctx.framework.state.status?.turn ?? 1;
    resolvedCandidates = resolvedCandidates.filter((cardId) => {
      const ownerId = ctx.framework.zones.getCardOwner(cardId) as PlayerId | undefined;
      if (!ownerId || ownerId === choosingPlayerId) {
        return true;
      }

      const zoneType = ctx.framework.zones.getCardZone(cardId)?.split(":")[0];
      const cardDefinition = getCardDefinition(ctx, cardId);
      const isCharacterOrItem =
        cardDefinition?.cardType === "character" || cardDefinition?.cardType === "item";

      if (!isCharacterOrItem || zoneType !== "play") {
        return true;
      }

      const hasStaticWard = cardDefinition ? hasKeyword(cardDefinition as never, "Ward") : false;
      const hasTemporaryWard = hasTemporaryKeyword(
        ctx.cards.require(cardId).meta,
        currentTurn,
        "Ward",
      );
      let hasGrantedWard = false;
      if (!hasStaticWard && !hasTemporaryWard) {
        const registry = getOrBuildMoveRegistry(
          ctx as import("../../runtime-moves/rules/move-registry-cache").MoveRegistryCtx,
        );
        hasGrantedWard = getEffectsForCard(registry, cardId, "gain-keyword").some(
          (e) => e.payload.keyword === "Ward",
        );
      }

      return !(hasStaticWard || hasTemporaryWard || hasGrantedWard);
    });
  }

  if (descriptor.excludeSelf && queryContext?.sourceCardId) {
    resolvedCandidates = resolvedCandidates.filter(
      (cardId) => cardId !== queryContext.sourceCardId,
    );
  }

  // When requireDifferentTargets is set and earlier sequence steps have
  // recorded their targets in previouslyTargetedCardIds, exclude those cards
  // from the candidate pool. This prevents a staged optional step (e.g. Three
  // Arrows step 2) from allowing the player to pick the same character that
  // was targeted in step 1.
  if (
    descriptor.requireDifferentTargets === true &&
    queryContext?.eventSnapshot?.previouslyTargetedCardIds?.length
  ) {
    const excluded = new Set(queryContext.eventSnapshot.previouslyTargetedCardIds);
    resolvedCandidates = resolvedCandidates.filter((cardId) => !excluded.has(cardId));
  }

  if (descriptor.excludeTriggerSubject) {
    const eventSnapshot = queryContext?.eventSnapshot;
    // For deal-damage events in a challenge, exclude the defender (the card that was damaged).
    // For other events, exclude the subjectCardId.
    const subjectId = (eventSnapshot?.defenderId ?? eventSnapshot?.subjectCardId) as
      | CardInstanceId
      | undefined;
    if (subjectId) {
      resolvedCandidates = resolvedCandidates.filter((cardId) => cardId !== subjectId);
    }
  }

  if (queryContext?.extraPredicate) {
    resolvedCandidates = resolvedCandidates.filter((cardId) =>
      queryContext.extraPredicate?.(cardId),
    );
  }

  return resolvedCandidates;
}

export function resolveCandidateTargets(
  ctx: EffectTargetRuntimeContext,
  descriptor: TargetDescriptor | undefined,
  queryContext?: QueryResolutionContext,
): CardInstanceId[];
export function resolveCandidateTargets(
  ctx: EffectTargetRuntimeContext,
  cardPlayed: CardPlayedPayload,
  descriptor: TargetDescriptor | undefined,
  queryContext?: QueryResolutionContext,
): CardInstanceId[];
export function resolveCandidateTargets(
  ctx: EffectTargetRuntimeContext,
  cardPlayedOrDescriptor: CardPlayedPayload | TargetDescriptor | undefined,
  descriptorOrQueryContext?: TargetDescriptor | QueryResolutionContext,
  maybeQueryContext?: QueryResolutionContext,
): CardInstanceId[] {
  if (isCardPlayedPayload(cardPlayedOrDescriptor)) {
    return resolveCandidateTargetsInternal(
      ctx,
      cardPlayedOrDescriptor,
      descriptorOrQueryContext as TargetDescriptor | undefined,
      maybeQueryContext,
    );
  }

  return resolveCandidateTargetsInternal(
    ctx,
    undefined,
    cardPlayedOrDescriptor as TargetDescriptor | undefined,
    descriptorOrQueryContext as QueryResolutionContext | undefined,
  );
}

export function resolvePlayerTargets(
  ctx: EffectTargetRuntimeContext,
  cardPlayed: CardPlayedPayload,
  descriptor: PlayerTargetDescriptor,
  queryContext?: QueryResolutionContext,
): PlayerId[] {
  const selector = descriptor.selector ?? "you";
  const controllerId = queryContext?.controllerId ?? cardPlayed.playerId;
  const opponents = ctx.framework.state.playerIds.filter((playerId) => playerId !== controllerId);

  let candidates: PlayerId[];
  switch (selector) {
    case "you":
      candidates = [controllerId];
      break;
    case "opponent":
      candidates = opponents.length > 0 ? [opponents[0]!] : [];
      break;
    case "each-opponent":
      candidates = [...opponents];
      break;
    case "each-player":
      candidates = [...ctx.framework.state.playerIds];
      break;
    case "chosen":
      candidates = queryContext?.strictUnknownFilters ? [] : [...ctx.framework.state.playerIds];
      break;
    case "challenging-player": {
      const attackerCardId = queryContext?.eventSnapshot?.attackerId as CardInstanceId | undefined;
      if (attackerCardId) {
        const attackerOwner = ctx.framework.zones.getCardOwner(attackerCardId) as
          | PlayerId
          | undefined;
        candidates = attackerOwner ? [attackerOwner] : [];
      } else {
        candidates = [];
      }
      break;
    }
    default:
      candidates = [];
      break;
  }

  const strictUnknownFilters = queryContext?.strictUnknownFilters === true;
  const filters = getTargetFilters(descriptor);
  if (filters.length > 0) {
    candidates = candidates.filter((playerId) =>
      filters.every((filter) =>
        passesPlayerFilter(ctx, playerId, filter, strictUnknownFilters, queryContext),
      ),
    );
  }

  if (selector === "chosen") {
    const selectedPlayerIds = resolveSelectedPlayerIds(
      ctx.framework.state.playerIds,
      queryContext?.selectedTargets,
    );
    if (selectedPlayerIds?.length) {
      const allowed = new Set(candidates);
      candidates = selectedPlayerIds.filter((playerId) => allowed.has(playerId));
    }
  }

  if (typeof descriptor.count === "number" && Number.isFinite(descriptor.count)) {
    return candidates.slice(0, Math.max(0, descriptor.count));
  }

  return candidates;
}

export function resolveTargetQuery(
  ctx: EffectTargetRuntimeContext,
  cardPlayed: CardPlayedPayload,
  target: LorcanaTargetDSL,
  queryContext?: QueryResolutionContext,
): ResolvedTargetQuery {
  if (isPlayerTargetDescriptor(target)) {
    return {
      kind: "player",
      playerIds: resolvePlayerTargets(ctx, cardPlayed, target, queryContext),
    };
  }

  return {
    kind: "card",
    cardIds: resolveCandidateTargets(
      ctx,
      cardPlayed,
      normalizeTargetDescriptor(target),
      queryContext,
    ),
  };
}

export function resolveTargetBounds(
  count: unknown,
  selector: string | undefined,
): {
  min: number;
  max: number;
} {
  if (count === "all") {
    return { min: 0, max: Number.POSITIVE_INFINITY };
  }

  if (typeof count === "number" && Number.isFinite(count)) {
    return { min: count, max: count };
  }

  if (count && typeof count === "object") {
    const countRecord = count as Record<string, unknown>;
    if (typeof countRecord.exactly === "number") {
      return { min: countRecord.exactly, max: countRecord.exactly };
    }
    if (typeof countRecord.upTo === "number") {
      return { min: 0, max: countRecord.upTo };
    }
    if (typeof countRecord.atLeast === "number") {
      return { min: countRecord.atLeast, max: Number.POSITIVE_INFINITY };
    }
    if (
      Array.isArray(countRecord.between) &&
      typeof countRecord.between[0] === "number" &&
      typeof countRecord.between[1] === "number"
    ) {
      return { min: countRecord.between[0], max: countRecord.between[1] };
    }
  }

  if (selector === "all" || selector === "each") {
    return { min: 0, max: Number.POSITIVE_INFINITY };
  }

  return { min: 1, max: 1 };
}

export function selectTargets(
  candidates: CardInstanceId[],
  descriptor: TargetDescriptor | undefined,
  selectedTargets: CardInstanceId[] | undefined,
  options?: { sourceCardId?: CardInstanceId },
): CardInstanceId[] {
  if (typeof descriptor?.reference === "string") {
    return candidates;
  }

  const selector = descriptor?.selector ?? "chosen";
  const { max } = resolveTargetBounds(descriptor?.count, selector);
  const uniqueSelected = selectedTargets ? [...new Set(selectedTargets)] : [];
  const selectedPool =
    descriptor?.requireDifferentTargets === true && uniqueSelected.length > 1
      ? uniqueSelected.slice(1)
      : uniqueSelected;

  if (typeof descriptor?.reference === "string") {
    return Number.isFinite(max) && candidates.length > max ? candidates.slice(0, max) : candidates;
  }

  if (selector === "self") {
    return options?.sourceCardId && candidates.includes(options.sourceCardId)
      ? [options.sourceCardId]
      : [];
  }

  if (selector === "chosen" && selectedPool.length === 0) {
    return [];
  }

  if (selector === "all" || selector === "each") {
    return candidates;
  }

  let resolvedSelection: CardInstanceId[];
  if (selectedPool.length > 0) {
    resolvedSelection = selectedPool.filter((target) => candidates.includes(target));
  } else {
    resolvedSelection = candidates.length > 0 ? [candidates[0]!] : [];
  }

  if (Number.isFinite(max) && resolvedSelection.length > max) {
    return resolvedSelection.slice(0, max);
  }

  return resolvedSelection;
}

export function resolveTargetPlayerIds(
  ctx: EffectTargetRuntimeContext,
  target: unknown,
  options?: {
    controllerId?: PlayerId;
    selectedPlayerIds?: readonly PlayerId[];
    sourceCardId?: CardInstanceId;
    eventSnapshot?: DynamicAmountEventSnapshot;
  },
): PlayerId[] {
  const normalized = normalizeLorcanaTarget(target);
  if (!normalized || !isPlayerTargetDescriptor(normalized)) {
    return [];
  }

  const controllerId =
    options?.controllerId ??
    ((ctx.framework.state.currentPlayer ?? ctx.framework.state.priority.holder) as
      | PlayerId
      | undefined);
  if (!controllerId) {
    return [];
  }

  const playerIds = [...ctx.framework.state.playerIds];
  const selectedPlayerIds = options?.selectedPlayerIds;
  const queryContext: QueryResolutionContext = {
    controllerId,
    sourceCardId: options?.sourceCardId,
    selectedTargets: selectedPlayerIds as CardInstanceId[] | undefined,
    eventSnapshot: options?.eventSnapshot,
  };

  const pseudoCardPlayed: CardPlayedPayload = {
    playerId: controllerId,
    cardId: "__player-target-source__" as CardInstanceId,
    cardType: "action",
    costType: "free",
  };

  const resolved = resolvePlayerTargets(
    ctx,
    pseudoCardPlayed,
    normalized as LorcanaPlayerTarget,
    queryContext,
  );

  return resolved.filter((playerId) => playerIds.includes(playerId));
}

export function resolveEffectTargets(
  ctx: EffectTargetRuntimeContext,
  cardPlayed: CardPlayedPayload,
  effectTarget: unknown,
  selectedTargetsInput: TargetSelectionInput,
  eventSnapshot?: DynamicAmountEventSnapshot,
  queryContextOverride?: Partial<Pick<QueryResolutionContext, "skipWardExclusion">>,
): CardInstanceId[] | undefined {
  const descriptor = normalizeTargetDescriptor(effectTarget);
  if (!descriptor) {
    return undefined;
  }

  const selectedTargets = normalizeSelectedTargets(selectedTargetsInput);
  const candidates = resolveCandidateTargets(ctx, cardPlayed, descriptor, {
    eventSnapshot,
    selectedTargets,
    sourceCardId: cardPlayed.cardId,
    ...queryContextOverride,
  });
  const selected = selectTargets(candidates, descriptor, selectedTargets, {
    sourceCardId: cardPlayed.cardId,
  });

  const afterCostBudget = applyTotalCostBudget(ctx, selected, descriptor);
  return applyTotalStrengthBudget(ctx, afterCostBudget, descriptor);
}

/**
 * Enforce `descriptor.totalCostBudget` by keeping the longest legal prefix of
 * the chooser's selection whose cumulative ink cost stays within the budget.
 *
 * Trailing selections that would push the running total over the cap are
 * dropped. When no budget is configured, the selection is returned as-is.
 */
function applyTotalCostBudget(
  ctx: EffectTargetRuntimeContext,
  selected: CardInstanceId[],
  descriptor: TargetDescriptor,
): CardInstanceId[] {
  const budget = descriptor.totalCostBudget;
  if (typeof budget !== "number" || !Number.isFinite(budget) || selected.length === 0) {
    return selected;
  }

  const accepted: CardInstanceId[] = [];
  let spent = 0;
  for (const cardId of selected) {
    const definition = getCardDefinition(ctx, cardId);
    const cost =
      typeof definition?.cost === "number" && Number.isFinite(definition.cost)
        ? definition.cost
        : 0;
    if (spent + cost > budget) {
      break;
    }
    accepted.push(cardId);
    spent += cost;
  }
  return accepted;
}

/**
 * Enforce `descriptor.totalStrengthBudget` by keeping the longest legal prefix
 * of the chooser's selection whose cumulative effective Strength stays within
 * the budget. Used by effects like "banish any number of chosen opposing
 * characters with total {S} N or less" (e.g. The Leviathan, Guardian of
 * Atlantis).
 *
 * Per Lorcana rules ("when totalling opposing {S}, modifiers count, and a
 * current {S} below 0 is treated as 0"), this consults each card's CURRENT
 * effective strength via `getEffectiveStrength` rather than the printed
 * `definition.strength`. Reading the printed value alone would reject
 * legitimate selections when targets have +S/-S modifiers in play (player
 * report 2026-05-06: "Leviathan selected 4 targets to banish but only 2 of
 * the 4 were banished. The strength of the characters was not above 10.").
 *
 * Trailing selections that would push the running total over the cap are
 * dropped. When no budget is configured, the selection is returned as-is.
 */
function applyTotalStrengthBudget(
  ctx: EffectTargetRuntimeContext,
  selected: CardInstanceId[],
  descriptor: TargetDescriptor,
): CardInstanceId[] {
  const budget = descriptor.totalStrengthBudget;
  if (typeof budget !== "number" || !Number.isFinite(budget) || selected.length === 0) {
    return selected;
  }

  const derivedState = getDerivedState(ctx);
  const registry = getOrBuildMoveRegistry(
    ctx as import("../../runtime-moves/rules/move-registry-cache").MoveRegistryCtx,
  );
  const accepted: CardInstanceId[] = [];
  let spent = 0;
  for (const cardId of selected) {
    const definition = getCardDefinition(ctx, cardId);
    // Effective strength clamps negatives to 0 (`clampCharacteristicForRules`).
    const strength = getEffectiveStrength(
      definition as any,
      derivedState,
      cardId,
      (id) => ctx.cards.getDefinition(id) as any,
      registry,
    );
    if (spent + strength > budget) {
      break;
    }
    accepted.push(cardId);
    spent += strength;
  }
  return accepted;
}
