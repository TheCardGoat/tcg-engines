import type { CardInstanceId, PlayerId } from "#core";
import type {
  CardFilter,
  CardSelectionFilter,
  ComparisonOperator,
  ReturnFromDiscardEffect,
} from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types/index";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { recordDiscardExitThisTurn } from "../../state/turn-metrics";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import { emitTriggeredLorcanaEvent } from "../../../triggered-abilities";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import { matchesCardFilterArray } from "./card-filter-match-utils";

type DiscardCardDefinition = {
  actionSubtype?: string;
  abilities?: {
    type?: string;
    keyword?: string;
  }[];
  cardType?: string;
  classifications?: string[];
  cost?: number;
  name?: string;
  strength?: number;
  willpower?: number;
  lore?: number;
};

function getKeywordFilter(
  filter: CardSelectionFilter | undefined,
  effect: ReturnFromDiscardEffect,
): string | undefined {
  // Handle untyped CardSelectionFilter format: { keyword: "Support" }
  if (
    filter &&
    typeof filter === "object" &&
    "keyword" in filter &&
    typeof filter.keyword === "string"
  ) {
    return filter.keyword;
  }

  // Handle typed CardFilter format: { type: "has-keyword", keyword: "Support" }
  const effectFilter = effect.filter;
  if (
    effectFilter &&
    typeof effectFilter === "object" &&
    !Array.isArray(effectFilter) &&
    "type" in effectFilter &&
    effectFilter.type === "has-keyword" &&
    "keyword" in effectFilter &&
    typeof effectFilter.keyword === "string"
  ) {
    return effectFilter.keyword;
  }

  return undefined;
}

function cardHasPrintedKeyword(cardDefinition: DiscardCardDefinition, keyword: string): boolean {
  return (
    Array.isArray(cardDefinition.abilities) &&
    cardDefinition.abilities.some(
      (ability) => ability.type === "keyword" && ability.keyword === keyword,
    )
  );
}

export function isReturnFromDiscardEffect(effect: unknown): effect is ReturnFromDiscardEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "return-from-discard"
  );
}

type DiscardCandidatesContext = Pick<PlayCardExecutionContext, "cards" | "framework">;

/**
 * Returns true if there is at least one card in the controller's discard
 * that satisfies the effect's filters. Used to decide whether to suppress
 * an optional triggered ability before it is queued.
 */
export function hasReturnFromDiscardCandidates(
  ctx: DiscardCandidatesContext,
  controllerId: PlayerId,
  effect: ReturnFromDiscardEffect,
  sourceCardId?: CardInstanceId,
): boolean {
  const discardCards = ctx.framework.zones.getCards({
    zone: "discard",
    playerId: controllerId,
  }) as CardInstanceId[];

  for (const cardId of discardCards) {
    if (matchesReturnFilter(ctx as PlayCardExecutionContext, cardId, effect, sourceCardId)) {
      return true;
    }
  }

  return false;
}

function resolveSelectedTargets(targets: ActionResolutionInput["targets"]): CardInstanceId[] {
  if (!targets) {
    return [];
  }

  if (Array.isArray(targets)) {
    return [
      ...new Set(targets.filter((target): target is CardInstanceId => typeof target === "string")),
    ];
  }

  return typeof targets === "string" ? [targets as CardInstanceId] : [];
}

function resolveReturnCount(effect: ReturnFromDiscardEffect): number {
  if (typeof effect.count !== "number" || !Number.isFinite(effect.count)) {
    return 1;
  }

  return Math.max(0, Math.floor(effect.count));
}

type NumericAttributeFilter = {
  type: "willpower-comparison" | "strength-comparison" | "lore-comparison" | "cost-comparison";
  comparison: ComparisonOperator;
  value: number;
};

function isNumericAttributeFilter(
  candidate: unknown,
  expectedType: NumericAttributeFilter["type"],
): candidate is NumericAttributeFilter {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }
  const record = candidate as {
    type?: unknown;
    comparison?: unknown;
    value?: unknown;
  };
  return (
    record.type === expectedType &&
    typeof record.comparison === "string" &&
    typeof record.value === "number"
  );
}

function comparatorMatches(
  actual: number,
  operator: ComparisonOperator,
  threshold: number,
): boolean {
  switch (operator) {
    case "equal":
      return actual === threshold;
    case "not-equal":
      return actual !== threshold;
    case "less":
    case "less-than":
      return actual < threshold;
    case "greater":
    case "greater-than":
    case "more-than":
      return actual > threshold;
    case "less-or-equal":
    case "or-less":
      return actual <= threshold;
    case "greater-or-equal":
    case "or-more":
      return actual >= threshold;
    default:
      return false;
  }
}

function getEffectFilterCandidates(effect: ReturnFromDiscardEffect): readonly unknown[] {
  const candidates: unknown[] = [];
  if (Array.isArray(effect.filter)) {
    candidates.push(...effect.filter);
  } else if (effect.filter !== undefined) {
    candidates.push(effect.filter);
  }
  if (effect.filters) {
    candidates.push(...effect.filters);
  }
  return candidates;
}

function findNumericFilter(
  effect: ReturnFromDiscardEffect,
  filterType: NumericAttributeFilter["type"],
): NumericAttributeFilter | undefined {
  for (const candidate of getEffectFilterCandidates(effect)) {
    if (isNumericAttributeFilter(candidate, filterType)) {
      return candidate;
    }
  }
  return undefined;
}

function matchesNumericFilter(
  effect: ReturnFromDiscardEffect,
  filterType: NumericAttributeFilter["type"],
  actual: number | undefined,
): boolean {
  const numericFilter = findNumericFilter(effect, filterType);
  if (!numericFilter) {
    return true;
  }
  if (actual === undefined || !Number.isFinite(actual)) {
    return false;
  }
  return comparatorMatches(actual, numericFilter.comparison, numericFilter.value);
}

function resolveCostComparisonMax(effect: ReturnFromDiscardEffect): number | undefined {
  const f = effect.filter;
  if (
    f &&
    typeof f === "object" &&
    !Array.isArray(f) &&
    "type" in f &&
    f.type === "cost-comparison" &&
    "comparison" in f &&
    "value" in f &&
    typeof f.value === "number"
  ) {
    const comparison = f.comparison as string;
    if (comparison === "less-or-equal" || comparison === "or-less") {
      return f.value as number;
    }
    if (comparison === "less-than") {
      return (f.value as number) - 1;
    }
  }
  return undefined;
}

function matchesCostRestriction(
  effect: ReturnFromDiscardEffect,
  cardCost: number | undefined,
): boolean {
  const restriction = effect.costRestriction;
  if (!restriction) {
    return true;
  }
  if (cardCost === undefined || !Number.isFinite(cardCost)) {
    return false;
  }
  switch (restriction.comparison) {
    case "less-or-equal":
      return cardCost <= restriction.value;
    case "greater-or-equal":
      return cardCost >= restriction.value;
    case "equal":
      return cardCost === restriction.value;
    default:
      return false;
  }
}

function matchesSourceFilter(
  effect: ReturnFromDiscardEffect,
  candidateId: CardInstanceId,
  sourceCardId: CardInstanceId | undefined,
): boolean {
  for (const candidate of getEffectFilterCandidates(effect)) {
    if (
      candidate &&
      typeof candidate === "object" &&
      "type" in candidate &&
      (candidate as { type?: unknown }).type === "source"
    ) {
      const ref = (candidate as { ref?: unknown }).ref;
      if (ref === "other") {
        // Exclude the source card itself. If we don't know the source, fail
        // closed for safety — better to skip than to allow self-return.
        if (sourceCardId === undefined || candidateId === sourceCardId) {
          return false;
        }
      } else if (ref === "self") {
        if (sourceCardId === undefined || candidateId !== sourceCardId) {
          return false;
        }
      }
      // "trigger-source" is a future expansion (event-based); ignore for now.
    }
  }
  return true;
}

function matchesReturnFilter(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  effect: ReturnFromDiscardEffect,
  sourceCardId?: CardInstanceId,
): boolean {
  const cardDefinition = ctx.cards.getDefinition(cardId) as DiscardCardDefinition | undefined;
  if (!cardDefinition) {
    return false;
  }

  if (!matchesSourceFilter(effect, cardId, sourceCardId)) {
    return false;
  }

  // Handle typed CardFilter format — both array form and single-object form.
  // e.g. [{ type: "has-classification", classification: "Robot" }] or
  //      { type: "has-classification", classification: "Pirate" }
  if (Array.isArray(effect.filter)) {
    if (!matchesCardFilterArray(effect.filter as CardFilter[], cardDefinition)) {
      return false;
    }
  } else if (
    effect.filter &&
    typeof effect.filter === "object" &&
    "type" in effect.filter &&
    typeof effect.filter.type === "string" &&
    // The source filter is handled above; it is not a CardFilter.
    (effect.filter as { type: string }).type !== "source"
  ) {
    if (!matchesCardFilterArray([effect.filter as CardFilter], cardDefinition)) {
      return false;
    }
  }

  const filter =
    effect.filter &&
    typeof effect.filter === "object" &&
    !Array.isArray(effect.filter) &&
    !("type" in effect.filter && typeof effect.filter.type === "string")
      ? (effect.filter as CardSelectionFilter)
      : undefined;
  const cardType = filter?.cardType ?? effect.cardType;
  const cardName = filter?.name ?? effect.cardName;

  if (cardType) {
    if (cardType === "song") {
      if (cardDefinition.cardType !== "action" || cardDefinition.actionSubtype !== "song") {
        return false;
      }
    } else if (cardDefinition.cardType !== cardType) {
      return false;
    }
  }

  const notCardType = filter?.notCardType;
  if (notCardType) {
    if (notCardType === "song") {
      if (cardDefinition.cardType === "action" && cardDefinition.actionSubtype === "song") {
        return false;
      }
    } else if (cardDefinition.cardType === notCardType) {
      return false;
    }
  }

  if (cardName && cardDefinition.name !== cardName) {
    return false;
  }

  if (
    typeof filter?.maxCost === "number" &&
    (!Number.isFinite(cardDefinition.cost) || Number(cardDefinition.cost) > filter.maxCost)
  ) {
    return false;
  }

  const costComparisonMax = resolveCostComparisonMax(effect);
  if (
    costComparisonMax !== undefined &&
    (!Number.isFinite(cardDefinition.cost) || Number(cardDefinition.cost) > costComparisonMax)
  ) {
    return false;
  }

  if (!matchesCostRestriction(effect, cardDefinition.cost)) {
    return false;
  }

  if (filter?.classification && !Array.isArray(cardDefinition.classifications)) {
    return false;
  }

  if (filter?.classification && !cardDefinition.classifications?.includes(filter.classification)) {
    return false;
  }

  const keywordFilter = getKeywordFilter(filter, effect);
  if (keywordFilter && !cardHasPrintedKeyword(cardDefinition, keywordFilter)) {
    return false;
  }

  if (!matchesNumericFilter(effect, "willpower-comparison", cardDefinition.willpower)) {
    return false;
  }
  if (!matchesNumericFilter(effect, "strength-comparison", cardDefinition.strength)) {
    return false;
  }
  if (!matchesNumericFilter(effect, "lore-comparison", cardDefinition.lore)) {
    return false;
  }

  return true;
}

function moveToDestination(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  playerId: PlayerId,
  destination: ReturnFromDiscardEffect["destination"] | undefined,
): void {
  const resolvedDestination = destination ?? "hand";
  switch (resolvedDestination) {
    case "top-of-deck":
      ctx.framework.zones.moveCard(cardId, { zone: "deck", playerId });
      ctx.cards.clearMeta(cardId);
      return;
    case "play":
      ctx.framework.zones.moveCard(cardId, { zone: "play", playerId });
      ctx.cards.clearMeta(cardId);
      return;
    case "hand":
    default:
      ctx.framework.zones.moveCard(cardId, { zone: "hand", playerId });
      ctx.cards.clearMeta(cardId);
  }
}

export function resolveReturnFromDiscardEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: ReturnFromDiscardEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const targetPlayerIds = resolveTargetPlayerIds(
    ctx,
    cardPlayed,
    effect.target ?? "CONTROLLER",
    resolutionInput.targets,
  );
  if (targetPlayerIds.length === 0) {
    return;
  }

  const returnCount = resolveReturnCount(effect);
  if (returnCount <= 0) {
    return;
  }

  const sourceCardId = cardPlayed.cardId;
  const candidateCards = targetPlayerIds.flatMap((playerId) =>
    (ctx.framework.zones.getCards({ zone: "discard", playerId }) as CardInstanceId[]).filter(
      (cardId) => matchesReturnFilter(ctx, cardId, effect, sourceCardId),
    ),
  );
  if (candidateCards.length === 0) {
    return;
  }

  const candidateSet = new Set(candidateCards);
  const selectedTargets = resolveSelectedTargets(resolutionInput.targets);

  const explicitMatches = selectedTargets.filter((cardId) => candidateSet.has(cardId));
  const maxCardsToReturn = Math.min(returnCount, candidateCards.length);
  if (selectedTargets.length > 0 && explicitMatches.length === 0) {
    return;
  }
  if (explicitMatches.length === 0) {
    // Fail closed when there is ambiguity and no explicit selection was made.
    if (selectedTargets.length === 0 && candidateCards.length > maxCardsToReturn) {
      return;
    }
  }

  const cardsToReturn =
    explicitMatches.length > 0
      ? explicitMatches.slice(0, maxCardsToReturn)
      : candidateCards.slice(0, maxCardsToReturn);

  for (const cardId of cardsToReturn) {
    const ownerId = ctx.framework.zones.getCardOwner(cardId) as PlayerId | undefined;
    const resolvedOwnerId = ownerId ?? cardPlayed.playerId;
    const destination = effect.destination ?? "hand";
    moveToDestination(ctx, cardId, resolvedOwnerId, effect.destination);

    // Record the returned card in the event snapshot so that subsequent
    // conditional effects (e.g. "if that character is named Tod") can inspect it.
    if (resolutionInput.eventSnapshot !== undefined) {
      resolutionInput.eventSnapshot.lastReturnedFromDiscardCardId = cardId;
    } else {
      resolutionInput.eventSnapshot = { lastReturnedFromDiscardCardId: cardId };
    }

    emitTriggeredLorcanaEvent(
      ctx,
      "cardLeftDiscard",
      { cardId, ownerId: resolvedOwnerId, toZone: destination ?? "hand" },
      {
        event: "leave-discard",
        playerId: resolvedOwnerId,
        subjectCardId: cardId,
        fromZone: "discard",
        toZone: destination ?? "hand",
      },
    );
  }

  recordDiscardExitThisTurn(ctx, cardsToReturn.length);
  markLastEffectPerformed(resolutionInput.eventSnapshot, cardsToReturn.length > 0);
}
