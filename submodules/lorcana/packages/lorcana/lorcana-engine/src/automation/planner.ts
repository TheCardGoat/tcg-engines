import type {
  CommandResult,
  DeepReadonly,
  EngineMoveValidationResult,
  MatchRuntimeConfig,
  MatchStaticResources,
  CardInstanceId,
  PlayerId,
} from "#core";
import type { Effect, ScryDestination, ScryEffect } from "@tcg/lorcana-types";
import { buildValidationContext } from "../core/runtime/match-runtime.utils";
import { compareOperator } from "../rules/operator-utils";
import type { ChallengePreviewResult, PlayCardCostInput } from "../lorcana-engine-base";
import { lorcanaRuntimeConfig } from "../runtime-game";
import {
  getShiftRules,
  getSingTogetherThreshold,
  getSingerThresholdForInstance,
  isReadyAndNotDrying,
  isSongCard,
  resolveShiftTargetCandidates,
} from "../runtime-moves/rules/play-card-rules";
import {
  getGrantedActivatedAbilities,
  hasStaticChallengerFilteredRestriction,
  toStaticAbilityState,
} from "../runtime-moves/rules/static-ability-utils";
import { buildRegistryFromMatchState } from "../runtime-moves/rules/move-registry-cache";
import { getAppliedCostReductions } from "../rules/derived-state";
import { cardHasName } from "../card-utils";
import { analyzeEffectTargets } from "../targeting";
import { classifyEffectPolarity, classifyTargetedStepPolarity } from "./effect-polarity";
import type {
  ActivatedAbilityDefinition,
  BagEffectEntry,
  Classification,
  LorcanaCardDefinition,
  LorcanaMatchState,
  LorcanaProjectedBoardView,
  LorcanaProjectedCard,
  PendingActionEffect,
  ResolutionSelectionContext,
} from "../types";
import { isClassification } from "../types";

import { createAutomatedActionBoardSnapshot } from "./decision-trace";
import { buildAutomatedActionDeckPlanningMetadata } from "./deck-profile";
import { deckAwareLoreRaceAutomatedActionStrategy } from "./deck-aware-strategy";
import {
  type AutomatedActionTargetPriorityContext,
  scoreAutomatedActionTargets,
} from "./target-priority";
import {
  DEFAULT_AUTOMATED_ACTION_MAX_EXECUTION_FAILURES,
  DEFAULT_AUTOMATED_ACTION_SEARCH_CAPS,
  type AutomatedActionAuthoritativeHints,
  type AutomatedActionBlockedState,
  type AutomatedActionCandidate,
  type AutomatedActionCandidateSummary,
  type AutomatedActionCostSelections,
  type AutomatedActionDecisionTrace,
  type AutomatedActionDestinationSelection,
  type AutomatedActionDiagnostic,
  type AutomatedActionEnumerationOptions,
  type AutomatedActionEnumerationResult,
  type AutomatedActionExecutionAttempt,
  type AutomatedActionExecutionOptions,
  type AutomatedActionExecutionResult,
  type AutomatedActionFallback,
  type AutomatedActionFamily,
  type AutomatedActionPlanningContext,
  type AutomatedActionResolutionShape,
  type AutomatedActionResolutionVariant,
  type AutomatedActionSearchCaps,
  type AutomatedActionTargetId,
} from "./types";

type AutomatedActionPlannerAdapter = {
  actorId?: PlayerId;
  authoritativeHints?: AutomatedActionAuthoritativeHints;
  availableMoveIds: readonly string[];
  board: LorcanaProjectedBoardView;
  concede(actorId: PlayerId): CommandResult;
  createErrorResult(error: string, errorCode: string): CommandResult;
  createNoopResult(): CommandResult;
  executeCandidate(actorId: PlayerId, candidate: AutomatedActionCandidate): CommandResult;
  getDefinitionByInstanceId(cardId: CardInstanceId): LorcanaCardDefinition | undefined;
  passTurn(actorId: PlayerId): CommandResult;
  previewChallenge(
    attackerId: CardInstanceId,
    defenderId: CardInstanceId,
  ): ChallengePreviewResult | null;
  state: DeepReadonly<LorcanaMatchState>;
  staticResources: MatchStaticResources;
  validateCandidate(
    actorId: PlayerId,
    candidate: AutomatedActionCandidate,
  ): EngineMoveValidationResult;
};

type BagOrPendingEntry = {
  baseResolutionInput: {
    choiceIndex?: number;
    destinations?: AutomatedActionDestinationSelection[];
    eventSnapshot?: PendingActionEffect["resolutionInput"]["eventSnapshot"];
    namedCard?: string;
    resolveOptional?: boolean;
    selectionContext?: DeepReadonly<ResolutionSelectionContext>;
    targets?: readonly AutomatedActionTargetId[];
  };
  effect: Effect | undefined;
  sourceCardId: CardInstanceId;
};

type EffectInspectionNode = Effect & {
  choices?: Effect[];
  destinations?: Array<{ zone: string }>;
  effect?: Effect;
  effects?: Effect[];
  else?: Effect;
  falseEffect?: Effect;
  ifFalse?: Effect;
  ifTrue?: Effect;
  options?: Effect[];
  ordering?: string;
  steps?: Effect[];
  then?: Effect;
  trueEffect?: Effect;
};

type ActionAbilityDefinition = Extract<
  NonNullable<LorcanaCardDefinition["abilities"]>[number],
  { type: "action" }
>;
type ResolutionVariantPart = {
  choiceIndex?: number;
  destinations?: AutomatedActionDestinationSelection[];
  namedCard?: string;
  resolveOptional?: boolean;
  targets?: AutomatedActionTargetId[];
};

type PlannedAutomatedActions = {
  actorDeckSignature?: string;
  boardSnapshot: AutomatedActionDecisionTrace["boardSnapshot"];
  enumeration: AutomatedActionEnumerationResult;
  gameSegment?: string;
  informationPolicy: AutomatedActionDecisionTrace["informationPolicy"];
  opponentKnowledgeSource: AutomatedActionDecisionTrace["opponentKnowledgeSource"];
  orderedCandidateSummaries: AutomatedActionCandidateSummary[];
  phase?: string;
  step?: string | null;
  strategyName: string;
  turnNumber: number;
};

function mergeSearchCaps(
  caps: Partial<AutomatedActionSearchCaps> | undefined,
): AutomatedActionSearchCaps {
  return {
    ...DEFAULT_AUTOMATED_ACTION_SEARCH_CAPS,
    ...caps,
  };
}

function isMoveAvailable(
  adapter: AutomatedActionPlannerAdapter,
  moveId: AutomatedActionCandidate["family"],
): boolean {
  return adapter.availableMoveIds.includes(moveId);
}

function getPlayerZoneCardIds(
  board: LorcanaProjectedBoardView,
  playerId: PlayerId,
  zone: "hand" | "play" | "inkwell" | "discard",
): CardInstanceId[] {
  const playerBoard = board.players[playerId];
  if (!playerBoard) {
    return [];
  }

  const rawCards =
    zone === "hand"
      ? playerBoard.hand
      : zone === "play"
        ? playerBoard.play
        : zone === "inkwell"
          ? playerBoard.inkwell
          : playerBoard.discard;

  return rawCards.map((cardId) => String(cardId) as CardInstanceId);
}

function getProjectedCard(
  board: LorcanaProjectedBoardView,
  cardId: CardInstanceId,
): LorcanaProjectedCard | undefined {
  return board.cards[String(cardId)];
}

function getCardName(board: LorcanaProjectedBoardView, cardId: CardInstanceId): string {
  return getProjectedCard(board, cardId)?.fullName ?? String(cardId);
}

function getPrintedCost(board: LorcanaProjectedBoardView, cardId: CardInstanceId): number {
  return getProjectedCard(board, cardId)?.playCost ?? 0;
}

function getPrintedLore(board: LorcanaProjectedBoardView, cardId: CardInstanceId): number {
  return getProjectedCard(board, cardId)?.lore ?? 0;
}

function compareCardIds(
  board: LorcanaProjectedBoardView,
  left: CardInstanceId,
  right: CardInstanceId,
): number {
  const leftName = getCardName(board, left);
  const rightName = getCardName(board, right);
  const nameOrder = leftName.localeCompare(rightName);
  if (nameOrder !== 0) {
    return nameOrder;
  }

  return String(left).localeCompare(String(right));
}

function stableSortIds(
  board: LorcanaProjectedBoardView,
  ids: readonly CardInstanceId[],
): CardInstanceId[] {
  return [...ids].sort((left, right) => compareCardIds(board, left, right));
}

function compareTargetIds(
  board: LorcanaProjectedBoardView,
  left: AutomatedActionTargetId,
  right: AutomatedActionTargetId,
): number {
  const leftCard = board.cards[String(left)];
  const rightCard = board.cards[String(right)];

  if (leftCard && rightCard) {
    return compareCardIds(board, left as CardInstanceId, right as CardInstanceId);
  }

  return String(left).localeCompare(String(right));
}

function getAvailableInkForPlayer(board: LorcanaProjectedBoardView, playerId: PlayerId): number {
  return (board.players[playerId]?.inkwell ?? []).reduce((total, cardId) => {
    const card = getProjectedCard(board, String(cardId) as CardInstanceId);
    return card?.exerted === true ? total : total + 1;
  }, 0);
}

function getStandardCostReductionTolerance(
  adapter: AutomatedActionPlannerAdapter,
  actorId: PlayerId,
  cardDef: LorcanaCardDefinition,
  cardId: CardInstanceId,
): number {
  const projected = getProjectedCard(adapter.board, cardId);
  const registry = buildRegistryFromMatchState(adapter.state as LorcanaMatchState, (id) =>
    adapter.getDefinitionByInstanceId(id),
  );
  const application = getAppliedCostReductions({
    definition: cardDef,
    state: adapter.state as LorcanaMatchState,
    cardInstanceId: cardId,
    ownerID: projected?.ownerId ?? actorId,
    zoneID: projected?.zone ?? "hand",
    actorPlayerId: actorId,
    getDefinitionByInstanceId: (id) => adapter.getDefinitionByInstanceId(id),
    playMethod: "standard",
    registry,
  });

  return Math.max(0, application.reductionAmount);
}

function isPermanentCard(card: LorcanaProjectedCard | undefined): boolean {
  return (
    card?.cardType === "character" || card?.cardType === "item" || card?.cardType === "location"
  );
}

function getFutureDrawScore(
  board: LorcanaProjectedBoardView,
  actorId: PlayerId,
  cardId: CardInstanceId,
): number {
  const card = getProjectedCard(board, cardId);
  const cost = card?.playCost ?? 0;
  const lore = card?.lore ?? 0;
  const inkable = card?.canBePutInInkwell === true;
  const availableNextTurn =
    getAvailableInkForPlayer(board, actorId) +
    (board.players[actorId]?.canAddCardToInkwell === true ? 1 : 0);

  let score = 0;
  score += inkable ? 3 : -2;
  score += isPermanentCard(card) ? 1 : 0;
  score += lore * 2;
  score += cost <= 2 ? 3 : cost <= 4 ? 1 : -Math.min(3, cost - 4);
  score += cost <= availableNextTurn ? 2 : 0;
  return score;
}

function buildTargetPriorityContext(args: {
  adapter: AutomatedActionPlannerAdapter;
  analysisPlayerId: PlayerId;
}): AutomatedActionTargetPriorityContext {
  const deckMetadata = buildAutomatedActionDeckPlanningMetadata({
    actorId: args.analysisPlayerId,
    authoritativeHints: args.adapter.authoritativeHints,
    board: args.adapter.board,
    staticResources: args.adapter.staticResources,
  });

  return {
    actorId: args.analysisPlayerId,
    board: args.adapter.board,
    getCardDefinition: deckMetadata.getCardDefinition,
    getCardRoles: deckMetadata.getCardRoles,
    opponentId: deckMetadata.opponentId,
  };
}

function prioritizeTargetIds(args: {
  effect?: Effect;
  family: AutomatedActionFamily;
  priorityContext: AutomatedActionTargetPriorityContext;
  sourceCardId: CardInstanceId;
  targets: readonly AutomatedActionTargetId[];
}): AutomatedActionTargetId[] {
  const sourceDefinitionId = args.priorityContext.getCardDefinition(args.sourceCardId)?.id;
  const sourceRoles = args.priorityContext.getCardRoles(args.sourceCardId);
  const polarity = classifyTargetedStepPolarity(args.effect).polarity;
  const scoreByTargetId = new Map<AutomatedActionTargetId, number>();

  const getScore = (targetId: AutomatedActionTargetId): number => {
    const existingScore = scoreByTargetId.get(targetId);
    if (typeof existingScore === "number") {
      return existingScore;
    }

    const score = scoreAutomatedActionTargets({
      context: args.priorityContext,
      effectPolarity: polarity,
      family: args.family,
      sourceDefinitionId,
      sourceRoles,
      targets: [targetId],
    }).score;
    scoreByTargetId.set(targetId, score);
    return score;
  };

  return [...args.targets].sort((left, right) => {
    const scoreOrder = getScore(right) - getScore(left);
    if (scoreOrder !== 0) {
      return scoreOrder;
    }

    return compareTargetIds(args.priorityContext.board, left, right);
  });
}

function prioritizeTargetVariants(args: {
  effect?: Effect;
  family: AutomatedActionFamily;
  priorityContext: AutomatedActionTargetPriorityContext;
  sourceCardId: CardInstanceId;
  targetVariants: readonly AutomatedActionTargetId[][];
}): AutomatedActionTargetId[][] {
  const sourceDefinitionId = args.priorityContext.getCardDefinition(args.sourceCardId)?.id;
  const sourceRoles = args.priorityContext.getCardRoles(args.sourceCardId);
  const polarity = classifyTargetedStepPolarity(args.effect).polarity;
  const scoreByVariantKey = new Map<string, number>();

  const getScore = (targets: readonly AutomatedActionTargetId[]): number => {
    const key = targets.join("|");
    const existingScore = scoreByVariantKey.get(key);
    if (typeof existingScore === "number") {
      return existingScore;
    }

    const score = scoreAutomatedActionTargets({
      context: args.priorityContext,
      effectPolarity: polarity,
      family: args.family,
      sourceDefinitionId,
      sourceRoles,
      targets,
    }).score;
    scoreByVariantKey.set(key, score);
    return score;
  };

  return [...args.targetVariants].sort((left, right) => {
    const scoreOrder = getScore(right) - getScore(left);
    if (scoreOrder !== 0) {
      return scoreOrder;
    }

    const sharedLength = Math.min(left.length, right.length);
    for (let index = 0; index < sharedLength; index += 1) {
      const targetOrder = compareTargetIds(args.priorityContext.board, left[index]!, right[index]!);
      if (targetOrder !== 0) {
        return targetOrder;
      }
    }

    return left.length - right.length;
  });
}

function getAcquisitionScore(
  board: LorcanaProjectedBoardView,
  cardId: CardInstanceId,
  zone: string,
): number {
  const card = getProjectedCard(board, cardId);
  const cost = card?.playCost ?? 0;
  const lore = card?.lore ?? 0;
  const permanentBonus = isPermanentCard(card) ? 1 : 0;
  const inkableBonus = card?.canBePutInInkwell === true ? 1 : 0;

  if (zone === "play") {
    return cost * 4 + lore * 2 + permanentBonus;
  }

  if (zone === "hand") {
    return cost * 3 + lore * 2 + permanentBonus + inkableBonus;
  }

  return cost + lore + permanentBonus + inkableBonus;
}

function compareCardsByFutureDrawValue(
  board: LorcanaProjectedBoardView,
  actorId: PlayerId,
  left: CardInstanceId,
  right: CardInstanceId,
): number {
  const scoreDelta =
    getFutureDrawScore(board, actorId, right) - getFutureDrawScore(board, actorId, left);
  if (scoreDelta !== 0) {
    return scoreDelta;
  }

  return compareCardIds(board, left, right);
}

function compareCardsByAcquisitionValue(
  board: LorcanaProjectedBoardView,
  zone: string,
  left: CardInstanceId,
  right: CardInstanceId,
): number {
  const scoreDelta =
    getAcquisitionScore(board, right, zone) - getAcquisitionScore(board, left, zone);
  if (scoreDelta !== 0) {
    return scoreDelta;
  }

  return compareCardIds(board, left, right);
}

function countVisibleDefinitionsForPlayer(
  adapter: AutomatedActionPlannerAdapter,
  playerId: PlayerId,
): Map<string, number> {
  const counts = new Map<string, number>();
  const zones: Array<"hand" | "play" | "inkwell" | "discard"> = [
    "hand",
    "play",
    "inkwell",
    "discard",
  ];

  for (const zone of zones) {
    for (const cardId of getPlayerZoneCardIds(adapter.board, playerId, zone)) {
      const projectedCard = getProjectedCard(adapter.board, cardId);
      const definitionId = projectedCard?.definitionId;
      if (!definitionId) {
        continue;
      }

      counts.set(definitionId, (counts.get(definitionId) ?? 0) + 1);
    }
  }

  return counts;
}

function buildNamedCardCandidates(args: {
  adapter: AutomatedActionPlannerAdapter;
  analysisPlayerId: PlayerId;
  searchCaps: AutomatedActionSearchCaps;
}): string[] {
  const { adapter, analysisPlayerId, searchCaps } = args;
  const deckMetadata = buildAutomatedActionDeckPlanningMetadata({
    actorId: analysisPlayerId,
    authoritativeHints: adapter.authoritativeHints,
    board: adapter.board,
    staticResources: adapter.staticResources,
  });
  const deckProfile = deckMetadata.deckProfilesByPlayer[analysisPlayerId];
  if (!deckProfile) {
    return [];
  }

  const visibleDefinitionCounts = countVisibleDefinitionsForPlayer(adapter, analysisPlayerId);
  const candidateLimit = Math.max(1, Math.min(searchCaps.choiceIndices, 4));
  const rankedNames = deckProfile.cards
    .map((card) => ({
      cost: card.cost,
      fullName: card.fullName,
      lore: card.lore,
      remainingCopies: Math.max(
        0,
        card.count - (visibleDefinitionCounts.get(card.definitionId) ?? 0),
      ),
      totalCopies: card.count,
    }))
    .filter((card) => card.remainingCopies > 0)
    .sort((left, right) => {
      if (left.remainingCopies !== right.remainingCopies) {
        return right.remainingCopies - left.remainingCopies;
      }
      if (left.cost !== right.cost) {
        return right.cost - left.cost;
      }
      if (left.lore !== right.lore) {
        return right.lore - left.lore;
      }
      return left.fullName.localeCompare(right.fullName);
    })
    .slice(0, candidateLimit)
    .map((card) => card.fullName);

  if (rankedNames.length > 0) {
    return rankedNames;
  }

  return deckProfile.cards
    .slice()
    .sort((left, right) => {
      if (left.count !== right.count) {
        return right.count - left.count;
      }
      if (left.cost !== right.cost) {
        return right.cost - left.cost;
      }
      if (left.lore !== right.lore) {
        return right.lore - left.lore;
      }
      return left.fullName.localeCompare(right.fullName);
    })
    .slice(0, candidateLimit)
    .map((card) => card.fullName);
}

function normalizeScryFilters(filters: unknown): Record<string, unknown>[] {
  if (Array.isArray(filters)) {
    return filters.filter((entry): entry is Record<string, unknown> =>
      Boolean(entry && typeof entry === "object"),
    );
  }

  if (filters && typeof filters === "object") {
    return [filters as Record<string, unknown>];
  }

  return [];
}

function matchesScryFilter(
  adapter: AutomatedActionPlannerAdapter,
  cardId: CardInstanceId,
  filter: Record<string, unknown>,
): boolean {
  const definition = adapter.getDefinitionByInstanceId(cardId);
  if (!definition) {
    return false;
  }

  switch (String(filter.type ?? "")) {
    case "and": {
      const subFilters = Array.isArray(filter.filters)
        ? filter.filters.filter((entry): entry is Record<string, unknown> =>
            Boolean(entry && typeof entry === "object"),
          )
        : [];
      return subFilters.every((entry) => matchesScryFilter(adapter, cardId, entry));
    }
    case "or": {
      const subFilters = Array.isArray(filter.filters)
        ? filter.filters.filter((entry): entry is Record<string, unknown> =>
            Boolean(entry && typeof entry === "object"),
          )
        : [];
      return (
        subFilters.length === 0 ||
        subFilters.some((entry) => matchesScryFilter(adapter, cardId, entry))
      );
    }
    case "not": {
      const inner = filter.filter;
      return !(
        inner &&
        typeof inner === "object" &&
        matchesScryFilter(adapter, cardId, inner as Record<string, unknown>)
      );
    }
    case "card-type":
      return typeof filter.cardType === "string" && definition.cardType === filter.cardType;
    case "classification":
      return (
        isClassification(filter.classification) &&
        "classifications" in definition &&
        Array.isArray(definition.classifications) &&
        definition.classifications.includes(filter.classification as Classification)
      );
    case "song":
      return definition.cardType === "action" && definition.actionSubtype === "song";
    case "cost":
    case "cost-comparison": {
      const cardCost = typeof definition.cost === "number" ? definition.cost : 0;
      const threshold = typeof filter.value === "number" ? filter.value : Number(filter.value ?? 0);
      return compareOperator(cardCost, String(filter.comparison ?? "eq"), threshold);
    }
    default:
      return true;
  }
}

function cardMatchesScryDestination(
  adapter: AutomatedActionPlannerAdapter,
  cardId: CardInstanceId,
  destination: ScryDestination,
): boolean {
  const filters = normalizeScryFilters(destination.filters ?? destination.filter);
  return (
    filters.length === 0 || filters.every((filter) => matchesScryFilter(adapter, cardId, filter))
  );
}

/**
 * Returns true when the scry effect's target or chooser is a non-controller player.
 * In that case, the engine creates a pending effect for the other player and the
 * automation planner must not pre-plan destinations.
 */
function scryEffectDelegatesToOtherPlayer(scryEffect: ScryEffect): boolean {
  const CONTROLLER_ALIASES = new Set<string | undefined>([undefined, "CONTROLLER", "SELF"]);
  return (
    !CONTROLLER_ALIASES.has(scryEffect.target as string | undefined) ||
    !CONTROLLER_ALIASES.has(scryEffect.chooser as string | undefined)
  );
}

function findAutomatableScryEffect(effect: Effect | undefined): ScryEffect | undefined {
  if (!effect || typeof effect !== "object") {
    return undefined;
  }

  const node = effect as EffectInspectionNode;
  if (node.type === "scry" && Array.isArray(node.destinations) && node.destinations.length > 0) {
    return node as ScryEffect;
  }

  const nestedEffects: Array<Effect | undefined> = [
    node.effect,
    node.then,
    node.else,
    node.ifTrue,
    node.ifFalse,
    node.trueEffect,
    node.falseEffect,
    ...(node.effects ?? []),
    ...(node.steps ?? []),
    ...(node.options ?? []),
    ...(node.choices ?? []),
  ];

  for (const nestedEffect of nestedEffects) {
    const nestedScry = findAutomatableScryEffect(nestedEffect);
    if (nestedScry) {
      return nestedScry;
    }
  }

  return undefined;
}

function getScryLookedAtCardIds(args: {
  adapter: AutomatedActionPlannerAdapter;
  analysisPlayerId: PlayerId;
  baseResolutionInput?: BagOrPendingEntry["baseResolutionInput"];
  scryEffect: ScryEffect;
}): CardInstanceId[] {
  const { adapter, analysisPlayerId, baseResolutionInput, scryEffect } = args;
  const revealedCardIds = baseResolutionInput?.eventSnapshot?.revealedCardIds;
  if (Array.isArray(revealedCardIds) && revealedCardIds.length > 0) {
    return revealedCardIds.map((cardId) => String(cardId) as CardInstanceId);
  }

  const amount =
    typeof scryEffect.amount === "number" ? Math.max(0, Math.floor(scryEffect.amount)) : 0;
  if (amount === 0) {
    return [];
  }

  const context = buildReadContext(adapter, analysisPlayerId);
  const deckCards = context.framework.zones.getCards({
    zone: "deck",
    playerId: analysisPlayerId,
  }) as CardInstanceId[];

  return deckCards.slice(0, amount);
}

function buildScryDestinations(args: {
  adapter: AutomatedActionPlannerAdapter;
  analysisPlayerId: PlayerId;
  baseResolutionInput?: BagOrPendingEntry["baseResolutionInput"];
  scryEffect: ScryEffect;
}): AutomatedActionDestinationSelection[] | null {
  const { adapter, analysisPlayerId, baseResolutionInput, scryEffect } = args;
  if (baseResolutionInput?.destinations) {
    return baseResolutionInput.destinations.map((destination) => ({
      zone: destination.zone,
      cards: [...destination.cards],
    }));
  }

  const lookedAtCards = getScryLookedAtCardIds({
    adapter,
    analysisPlayerId,
    baseResolutionInput,
    scryEffect,
  });
  if (lookedAtCards.length === 0) {
    return [];
  }

  const destinationRules = Array.isArray(scryEffect.destinations) ? scryEffect.destinations : [];
  let remaining = [...lookedAtCards];
  const selections: AutomatedActionDestinationSelection[] = [];

  for (const destination of destinationRules) {
    const min = typeof destination.min === "number" ? Math.max(0, Math.floor(destination.min)) : 0;
    const max =
      typeof destination.max === "number" && Number.isFinite(destination.max)
        ? Math.max(0, Math.floor(destination.max))
        : destination.remainder === true
          ? remaining.length
          : remaining.length;
    const matchingCards = remaining.filter((cardId) =>
      cardMatchesScryDestination(adapter, cardId, destination),
    );
    const sortCards =
      destination.zone === "deck-top"
        ? (left: CardInstanceId, right: CardInstanceId) =>
            compareCardsByFutureDrawValue(adapter.board, analysisPlayerId, left, right)
        : destination.zone === "deck-bottom"
          ? (left: CardInstanceId, right: CardInstanceId) =>
              compareCardsByFutureDrawValue(adapter.board, analysisPlayerId, right, left)
          : (left: CardInstanceId, right: CardInstanceId) =>
              compareCardsByAcquisitionValue(adapter.board, destination.zone, left, right);

    let cards =
      destination.remainder === true
        ? [...remaining].sort(sortCards)
        : [...matchingCards].sort(sortCards).slice(0, max);

    if (
      destination.zone === "deck-top" &&
      destination.remainder !== true &&
      min === 0 &&
      cards.length === 1 &&
      (() => {
        const card = getProjectedCard(adapter.board, cards[0]!);
        const obviouslyWeakTopDeck =
          card?.canBePutInInkwell !== true && (card?.playCost ?? 0) >= 5 && (card?.lore ?? 0) <= 1;
        return (
          obviouslyWeakTopDeck || getFutureDrawScore(adapter.board, analysisPlayerId, cards[0]!) < 0
        );
      })()
    ) {
      cards = [];
    }

    if (cards.length < min) {
      return null;
    }

    selections.push({
      zone: destination.zone,
      cards,
    });

    if (cards.length > 0) {
      const selected = new Set(cards);
      remaining = remaining.filter((cardId) => !selected.has(cardId));
    }
  }

  return selections;
}

function getCandidateKey(candidate: AutomatedActionCandidate): string {
  switch (candidate.family) {
    case "chooseWhoGoesFirst":
      return `chooseWhoGoesFirst:${candidate.firstPlayerId}`;
    case "alterHand":
      return `alterHand:${candidate.plan}:${candidate.cardsToMulligan.join(",")}`;
    case "resolveBag":
      return `resolveBag:${candidate.bagId}:${candidate.choiceIndex ?? ""}:${candidate.namedCard ?? ""}:${candidate.resolveOptional ?? ""}:${candidate.targets?.join(",") ?? ""}:${candidate.destinations?.map((destination) => `${destination.zone}:${destination.cards.join(",")}`).join("|") ?? ""}`;
    case "resolveEffect":
      return `resolveEffect:${candidate.effectId}:${candidate.choiceIndex ?? ""}:${candidate.namedCard ?? ""}:${candidate.resolveOptional ?? ""}:${candidate.targets?.join(",") ?? ""}:${candidate.destinations?.map((destination) => `${destination.zone}:${destination.cards.join(",")}`).join("|") ?? ""}`;
    case "putCardIntoInkwell":
      return `putCardIntoInkwell:${candidate.cardId}`;
    case "playCard":
      return `playCard:${candidate.cardId}:${typeof candidate.cost === "object" ? JSON.stringify(candidate.cost) : candidate.cost}:${candidate.choiceIndex ?? ""}:${candidate.resolveOptional ?? ""}:${candidate.targets?.join(",") ?? ""}`;
    case "activateAbility":
      return `activateAbility:${candidate.cardId}:${candidate.abilityIndex}:${candidate.choiceIndex ?? ""}:${candidate.targets?.join(",") ?? ""}:${candidate.costs?.banishCharacters?.join(",") ?? ""}:${candidate.costs?.banishItems?.join(",") ?? ""}:${candidate.costs?.discardCards?.join(",") ?? ""}:${candidate.costs?.exertCharacters?.join(",") ?? ""}`;
    case "quest":
      return `quest:${candidate.cardId}`;
    case "challenge":
      return `challenge:${candidate.attackerId}:${candidate.defenderId}`;
    case "moveCharacterToLocation":
      return `moveCharacterToLocation:${candidate.characterId}:${candidate.locationId}`;
  }
}

function enumerateBoundedCombinations<T>(
  items: readonly T[],
  minLength: number,
  maxLength: number,
  cap: number,
): { combinations: T[][]; overflow: boolean } {
  const combinations: T[][] = [];
  const boundedMin = Math.max(0, minLength);
  const boundedMax = Math.max(boundedMin, Math.min(maxLength, items.length));
  let overflow = false;

  const visit = (startIndex: number, current: T[]): void => {
    if (overflow) {
      return;
    }

    if (current.length >= boundedMin && current.length <= boundedMax) {
      combinations.push([...current]);
      if (combinations.length > cap) {
        overflow = true;
        return;
      }
    }

    if (current.length === boundedMax) {
      return;
    }

    for (let index = startIndex; index < items.length; index += 1) {
      current.push(items[index]!);
      visit(index + 1, current);
      current.pop();
      if (overflow) {
        return;
      }
    }
  };

  visit(0, []);
  return {
    combinations: combinations.slice(0, cap),
    overflow,
  };
}

function cartesianProduct<T>(
  groups: readonly T[][],
  cap: number,
): { overflow: boolean; values: T[][] } {
  if (groups.length === 0) {
    return { overflow: false, values: [[]] };
  }

  const values: T[][] = [[]];
  for (const group of groups) {
    const next: T[][] = [];
    for (const prefix of values) {
      for (const value of group) {
        next.push([...prefix, value]);
        if (next.length > cap) {
          return { overflow: true, values: [] };
        }
      }
    }
    values.splice(0, values.length, ...next);
  }

  return { overflow: false, values };
}

function buildReadContext(adapter: AutomatedActionPlannerAdapter, actorId: PlayerId) {
  return buildValidationContext({
    state: adapter.state as LorcanaMatchState,
    playerId: actorId,
    input: { args: {} },
    config: lorcanaRuntimeConfig as unknown as MatchRuntimeConfig,
    staticResources: adapter.staticResources,
    gameEnded: adapter.board.status === "finished",
    validationMode: "preflight",
  });
}

function pushValidationDiagnostic(
  diagnostics: AutomatedActionDiagnostic[],
  candidate: AutomatedActionCandidate,
  validation: EngineMoveValidationResult,
): void {
  diagnostics.push({
    kind: "validation-reject",
    family: candidate.family,
    reason: validation.reason ?? "Candidate validation rejected the action",
    code: validation.code,
    candidate,
  });
}

function addValidatedCandidate(
  adapter: AutomatedActionPlannerAdapter,
  diagnostics: AutomatedActionDiagnostic[],
  actorId: PlayerId,
  candidates: AutomatedActionCandidate[],
  candidate: AutomatedActionCandidate,
): void {
  const validation = adapter.validateCandidate(actorId, candidate);
  if (!validation.valid) {
    pushValidationDiagnostic(diagnostics, candidate, validation);
    return;
  }

  candidates.push(candidate);
}

function inspectResolutionShape(effect: Effect | undefined): AutomatedActionResolutionShape {
  const shape: AutomatedActionResolutionShape = {
    choiceCount: 0,
    optionalCount: 0,
    requiresDestinations: false,
    requiresNamedCard: false,
    requiresOrderedTargets: false,
    usesAmountSelection: false,
  };

  const visit = (current: Effect | undefined): void => {
    if (!current) {
      return;
    }

    const node = current as EffectInspectionNode;
    switch (node.type) {
      case "optional":
        shape.optionalCount += 1;
        break;
      case "choice":
      case "or":
        shape.choiceCount += 1;
        shape.choiceOptionCount = Math.max(
          shape.choiceOptionCount ?? 0,
          node.options?.length ?? node.choices?.length ?? 0,
        );
        break;
      case "name-a-card":
        shape.requiresNamedCard = true;
        break;
      case "scry":
        if ((node.destinations?.length ?? 0) > 0) {
          shape.requiresDestinations = true;
        }
        break;
      case "put-on-bottom":
        if (node.ordering === "player-choice") {
          shape.requiresOrderedTargets = true;
        }
        break;
    }

    const nestedEffects: Array<Effect | undefined> = [
      node.effect,
      node.then,
      node.else,
      node.ifTrue,
      node.ifFalse,
      node.trueEffect,
      node.falseEffect,
      ...(node.effects ?? []),
      ...(node.steps ?? []),
      ...(node.options ?? []),
      ...(node.choices ?? []),
    ];
    for (const nestedEffect of nestedEffects) {
      visit(nestedEffect);
    }
  };

  visit(effect);
  return shape;
}

function selectZoneCards(
  board: LorcanaProjectedBoardView,
  ownerId: PlayerId,
  zone: "deck" | "hand" | "play" | "inkwell" | "discard",
): LorcanaProjectedCard[] {
  const playerBoard = board.players[ownerId];
  if (!playerBoard) {
    return [];
  }

  const zoneCards =
    zone === "deck"
      ? playerBoard.deckTop
        ? [playerBoard.deckTop]
        : []
      : zone === "hand"
        ? playerBoard.hand
        : zone === "play"
          ? playerBoard.play
          : zone === "inkwell"
            ? playerBoard.inkwell
            : playerBoard.discard;

  return zoneCards
    .map((cardId) => board.cards[String(cardId)])
    .filter((card): card is LorcanaProjectedCard => Boolean(card));
}

function resolveOrRequiredSelectionCount(count: unknown): number {
  if (typeof count === "number" && Number.isFinite(count)) {
    return Math.max(0, Math.floor(count));
  }

  return 1;
}

function getOrTargetPlayerIds(
  board: LorcanaProjectedBoardView,
  target: unknown,
  controllerId: PlayerId,
): PlayerId[] {
  switch (target) {
    case "OPPONENT":
    case "OPPONENTS":
    case "EACH_OPPONENT":
      return board.playerOrder.filter((playerId) => playerId !== controllerId);
    case "EACH_PLAYER":
    case "ALL_PLAYERS":
      return [...board.playerOrder];
    case "CONTROLLER":
    case "CURRENT_TURN":
    default:
      return [controllerId];
  }
}

function isProjectedOrOptionLegal(
  adapter: AutomatedActionPlannerAdapter,
  effect: Effect | undefined,
  controllerId: PlayerId,
  sourceCardId: CardInstanceId,
): boolean {
  if (!effect || typeof effect !== "object") {
    return false;
  }

  const effectRecord = effect as EffectInspectionNode;
  const effectType = effectRecord.type;

  if (effectType === "sequence") {
    const nestedEffects = Array.isArray(effectRecord.steps)
      ? effectRecord.steps
      : Array.isArray(effectRecord.effects)
        ? effectRecord.effects
        : [];
    const firstNestedEffect = nestedEffects[0] as Effect | undefined;
    return firstNestedEffect
      ? isProjectedOrOptionLegal(adapter, firstNestedEffect, controllerId, sourceCardId)
      : false;
  }

  if (effectType === "discard") {
    const requiredCount =
      effectRecord.amount === "all" ? 1 : resolveOrRequiredSelectionCount(effectRecord.amount);
    const filter =
      effectRecord.filter && typeof effectRecord.filter === "object"
        ? (effectRecord.filter as Record<string, unknown>)
        : undefined;
    const sourceZone =
      effectRecord.from === "deck" ||
      effectRecord.from === "hand" ||
      effectRecord.from === "play" ||
      effectRecord.from === "discard" ||
      effectRecord.from === "inkwell"
        ? effectRecord.from
        : "hand";

    return getOrTargetPlayerIds(adapter.board, effectRecord.target, controllerId).every(
      (playerId) => {
        const candidates = selectZoneCards(adapter.board, playerId, sourceZone).filter((card) => {
          const definition = adapter.getDefinitionByInstanceId(card.id as CardInstanceId);
          if (!definition) {
            return false;
          }

          const cardType = typeof filter?.cardType === "string" ? filter.cardType : undefined;
          const notCardType =
            typeof filter?.notCardType === "string" ? filter.notCardType : undefined;
          const classification =
            typeof filter?.classification === "string" ? filter.classification : undefined;
          const maxCost = typeof filter?.maxCost === "number" ? filter.maxCost : undefined;

          if (cardType && definition.cardType !== cardType) {
            return false;
          }
          if (notCardType && definition.cardType === notCardType) {
            return false;
          }
          if (
            classification &&
            !(
              ("classifications" in definition ? definition.classifications : undefined) ?? []
            ).some((candidateClassification: string) => candidateClassification === classification)
          ) {
            return false;
          }
          if (typeof maxCost === "number" && typeof definition.cost === "number") {
            return definition.cost <= maxCost;
          }

          return true;
        });

        return candidates.length >= requiredCount;
      },
    );
  }

  if (effectType === "return-to-hand") {
    const target =
      effectRecord.target && typeof effectRecord.target === "object"
        ? (effectRecord.target as Record<string, unknown>)
        : undefined;
    if (!target || target.selector !== "chosen") {
      return false;
    }

    const requiredCount = resolveOrRequiredSelectionCount(target.count);
    const owner =
      target.owner === "you" || target.owner === "opponent" || target.owner === "any"
        ? target.owner
        : "any";
    const playerIds =
      owner === "you"
        ? [controllerId]
        : owner === "opponent"
          ? adapter.board.playerOrder.filter((playerId) => playerId !== controllerId)
          : adapter.board.playerOrder;
    const cardTypes = Array.isArray(target.cardTypes)
      ? target.cardTypes.filter((cardType): cardType is string => typeof cardType === "string")
      : [];
    const excludeSelf = target.excludeSelf === true;

    const candidates = playerIds
      .flatMap((playerId) => selectZoneCards(adapter.board, playerId, "play"))
      .filter((card) => !excludeSelf || String(card.id) !== sourceCardId)
      .filter((card) => {
        const definition = adapter.getDefinitionByInstanceId(card.id as CardInstanceId);
        return !!definition && (cardTypes.length === 0 || cardTypes.includes(definition.cardType));
      });

    return candidates.length >= requiredCount;
  }

  if (effectType === "banish") {
    if (effectRecord.target !== "SELF") {
      return false;
    }

    const zone = getProjectedCard(adapter.board, sourceCardId)?.zone;
    return zone === "play" || zone === "limbo";
  }

  return true;
}

function getForcedChoiceIndex(args: {
  adapter: AutomatedActionPlannerAdapter;
  analysisPlayerId: PlayerId;
  effect: Effect | undefined;
  sourceCardId: CardInstanceId;
}): number | undefined {
  const { adapter, analysisPlayerId, effect, sourceCardId } = args;
  if (!effect || typeof effect !== "object") {
    return undefined;
  }

  const effectRecord = effect as EffectInspectionNode;
  if (effectRecord.type !== "or") {
    return undefined;
  }

  const options = Array.isArray(effectRecord.options)
    ? effectRecord.options
    : Array.isArray(effectRecord.choices)
      ? effectRecord.choices
      : [];
  if (options.length === 0) {
    return undefined;
  }

  const legalIndices = options.flatMap((option, index) =>
    isProjectedOrOptionLegal(adapter, option as Effect, analysisPlayerId, sourceCardId)
      ? [index]
      : [],
  );

  return legalIndices.length === 1 ? legalIndices[0] : undefined;
}

function buildTargetVariants(args: {
  adapter: AutomatedActionPlannerAdapter;
  analysisPlayerId: PlayerId;
  baseTargets?: readonly AutomatedActionTargetId[];
  selectionContext?: DeepReadonly<ResolutionSelectionContext>;
  diagnostics: AutomatedActionDiagnostic[];
  effect: Effect | undefined;
  family: AutomatedActionCandidate["family"];
  sourceCardId: CardInstanceId;
  searchCaps: AutomatedActionSearchCaps;
}): AutomatedActionTargetId[][] | null {
  const {
    adapter,
    analysisPlayerId,
    baseTargets,
    selectionContext,
    diagnostics,
    effect,
    family,
    sourceCardId,
    searchCaps,
  } = args;
  if ((baseTargets?.length ?? 0) > 0) {
    return [[...(baseTargets ?? [])]];
  }
  if (!effect) {
    return [[]];
  }

  if (selectionContext?.kind === "choice-selection") {
    return [[]];
  }

  if (
    selectionContext?.kind === "target-selection" ||
    selectionContext?.kind === "discard-choice"
  ) {
    const rawPool = [
      ...selectionContext.cardCandidateIds.map(
        (cardId) => String(cardId) as AutomatedActionTargetId,
      ),
      ...selectionContext.playerCandidateIds.map(
        (playerId) => String(playerId) as AutomatedActionTargetId,
      ),
    ];
    const priorityContext = buildTargetPriorityContext({
      adapter,
      analysisPlayerId,
    });
    const pool =
      rawPool.length > searchCaps.targetPool
        ? prioritizeTargetIds({
            effect,
            family,
            priorityContext,
            sourceCardId,
            targets: rawPool,
          }).slice(0, searchCaps.targetPool)
        : rawPool;
    if (rawPool.length > searchCaps.targetPool) {
      diagnostics.push({
        kind: "overflow-skip",
        family,
        reason: "Target pool exceeded the search cap; keeping the highest-priority targets",
        cap: searchCaps.targetPool,
        actual: rawPool.length,
        sourceCardId,
      });
    }

    const minSelections = selectionContext.minSelections;
    const { combinations, overflow } = enumerateBoundedCombinations(
      pool,
      minSelections,
      Math.max(minSelections, selectionContext.maxSelections),
      Number.MAX_SAFE_INTEGER,
    );
    if (overflow) {
      diagnostics.push({
        kind: "overflow-skip",
        family,
        reason: "Target combinations exceeded the enumeration cap; some variants will be dropped",
        cap: searchCaps.targetCombinationsPerFamily,
        actual: combinations.length + 1,
        sourceCardId,
      });
    }

    const prioritizedCombinations = prioritizeTargetVariants({
      effect,
      family,
      priorityContext,
      sourceCardId,
      targetVariants: combinations,
    });
    if (prioritizedCombinations.length > searchCaps.targetCombinationsPerFamily) {
      diagnostics.push({
        kind: "overflow-skip",
        family,
        reason:
          "Target combinations exceeded the search cap; keeping the highest-priority variants",
        cap: searchCaps.targetCombinationsPerFamily,
        actual: prioritizedCombinations.length,
        sourceCardId,
      });
    }
    const boundedCombinations = prioritizedCombinations.slice(
      0,
      searchCaps.targetCombinationsPerFamily,
    );

    if (pool.length === 0 || boundedCombinations.length > 0) {
      return boundedCombinations.length > 0 ? boundedCombinations : [[]];
    }
  }

  const readContext = buildReadContext(adapter, analysisPlayerId);
  const analysis = analyzeEffectTargets(
    effect,
    analysisPlayerId,
    readContext as unknown as Parameters<typeof analyzeEffectTargets>[2],
    sourceCardId,
  );
  if (!analysis.requiresExplicitSelection) {
    return [[]];
  }

  const rawPool = [
    ...analysis.cardCandidates.map((cardId) => String(cardId) as AutomatedActionTargetId),
    ...analysis.playerCandidates.map((playerId) => String(playerId) as AutomatedActionTargetId),
  ];
  if (analysis.requiresExplicitSelection && rawPool.length === 0) {
    // For card play and ability activation, skip this candidate entirely — the AI should
    // not play a card or activate an ability when there are no valid targets. For bag/pending
    // resolution, an empty-target submission triggers the engine's auto-reject/fizzle path.
    if (family === "playCard" || family === "activateAbility") {
      return null;
    }
    return [[]];
  }
  const priorityContext = buildTargetPriorityContext({
    adapter,
    analysisPlayerId,
  });
  const pool =
    rawPool.length > searchCaps.targetPool
      ? prioritizeTargetIds({
          effect,
          family,
          priorityContext,
          sourceCardId,
          targets: rawPool,
        }).slice(0, searchCaps.targetPool)
      : rawPool;
  if (rawPool.length > searchCaps.targetPool) {
    diagnostics.push({
      kind: "overflow-skip",
      family,
      reason: "Target pool exceeded the search cap; keeping the highest-priority targets",
      cap: searchCaps.targetPool,
      actual: rawPool.length,
      sourceCardId,
    });
  }

  const minSelections = Math.max(
    analysis.minSelections,
    analysis.allowsDeferredResolutionWithoutInitialSelection ? 0 : 1,
  );
  const { combinations, overflow } = enumerateBoundedCombinations(
    pool,
    minSelections,
    Math.max(minSelections, analysis.maxSelections),
    Number.MAX_SAFE_INTEGER,
  );
  if (overflow) {
    diagnostics.push({
      kind: "overflow-skip",
      family,
      reason:
        "Target combinations exceeded the enumeration cap; keeping the highest-priority variants",
      cap: searchCaps.targetCombinationsPerFamily,
      actual: searchCaps.targetCombinationsPerFamily + 1,
      sourceCardId,
    });
  }
  const prioritizedCombinations = prioritizeTargetVariants({
    effect,
    family,
    priorityContext,
    sourceCardId,
    targetVariants: combinations,
  });
  if (prioritizedCombinations.length > searchCaps.targetCombinationsPerFamily) {
    diagnostics.push({
      kind: "overflow-skip",
      family,
      reason: "Target combinations exceeded the search cap; keeping the highest-priority variants",
      cap: searchCaps.targetCombinationsPerFamily,
      actual: prioritizedCombinations.length,
      sourceCardId,
    });
  }
  const boundedCombinations = prioritizedCombinations.slice(
    0,
    searchCaps.targetCombinationsPerFamily,
  );

  // Pool has cards but fewer than minSelections (e.g. move-damage needs 2 targets but only 1 char exists).
  // Return [[]] so the parent optional-wrapping logic can generate a "decline" variant instead of producing
  // zero candidates and causing the AI to freeze.
  if (analysis.requiresExplicitSelection && boundedCombinations.length === 0) {
    return [[]];
  }

  if (
    analysis.allowsDeferredResolutionWithoutInitialSelection &&
    !boundedCombinations.some((combination) => combination.length === 0)
  ) {
    boundedCombinations.unshift([]);
  }

  return boundedCombinations;
}

function expandOrderedTargetVariants(args: {
  analysisPlayerId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  diagnostics: AutomatedActionDiagnostic[];
  effectId?: string;
  family: AutomatedActionCandidate["family"];
  bagId?: string;
  searchCaps: AutomatedActionSearchCaps;
  sourceCardId: CardInstanceId;
  targetVariants: AutomatedActionTargetId[][];
}): AutomatedActionTargetId[][] | null {
  const {
    adapter,
    analysisPlayerId,
    diagnostics,
    effectId,
    family,
    bagId,
    searchCaps,
    sourceCardId,
    targetVariants,
  } = args;
  const orderedVariants: AutomatedActionTargetId[][] = [];
  const priorityContext = buildTargetPriorityContext({
    adapter,
    analysisPlayerId,
  });

  const pushPermutation = (targets: AutomatedActionTargetId[]): boolean => {
    if (orderedVariants.length >= searchCaps.targetCombinationsPerFamily) {
      diagnostics.push({
        kind: "overflow-skip",
        family,
        reason: "Ordered target permutations exceed the configured automation search cap",
        cap: searchCaps.targetCombinationsPerFamily,
        actual: searchCaps.targetCombinationsPerFamily + 1,
        sourceCardId,
        bagId,
        effectId,
      });
      return false;
    }

    orderedVariants.push(targets);
    return true;
  };

  const enumeratePermutations = (
    remaining: readonly AutomatedActionTargetId[],
    current: AutomatedActionTargetId[],
  ): boolean => {
    if (remaining.length === 0) {
      return pushPermutation(current);
    }

    const prioritizedRemaining = prioritizeTargetIds({
      family,
      priorityContext,
      sourceCardId,
      targets: remaining,
    });

    for (let index = 0; index < prioritizedRemaining.length; index += 1) {
      const next = prioritizedRemaining[index];
      if (!next) {
        continue;
      }

      const nextRemaining = remaining.filter(
        (targetId) => targetId !== next,
      ) as AutomatedActionTargetId[];
      if (!enumeratePermutations(nextRemaining, [...current, next])) {
        return false;
      }
    }

    return true;
  };

  for (const variant of targetVariants) {
    if (variant.length <= 1) {
      if (!pushPermutation([...variant])) {
        return null;
      }
      continue;
    }

    if (!enumeratePermutations(variant, [])) {
      return null;
    }
  }

  return orderedVariants;
}

function buildResolutionVariants(args: {
  adapter: AutomatedActionPlannerAdapter;
  analysisPlayerId: PlayerId;
  bagId?: string;
  baseResolutionInput?: BagOrPendingEntry["baseResolutionInput"];
  diagnostics: AutomatedActionDiagnostic[];
  effect: Effect | undefined;
  effectId?: string;
  family: AutomatedActionCandidate["family"];
  pendingKind?: PendingActionEffect["kind"];
  searchCaps: AutomatedActionSearchCaps;
  sourceCardId: CardInstanceId;
}): AutomatedActionResolutionVariant[] | null {
  const {
    adapter,
    analysisPlayerId,
    bagId,
    baseResolutionInput,
    diagnostics,
    effect,
    effectId,
    family,
    pendingKind,
    searchCaps,
    sourceCardId,
  } = args;
  if (!effect) {
    return [{}];
  }

  const shape = inspectResolutionShape(effect);
  const namedCardValues =
    typeof baseResolutionInput?.namedCard === "string" &&
    baseResolutionInput.namedCard.trim().length > 0
      ? [baseResolutionInput.namedCard.trim()]
      : pendingKind === "name-card-selection"
        ? buildNamedCardCandidates({
            adapter,
            analysisPlayerId,
            searchCaps,
          })
        : [undefined];
  if (
    shape.requiresNamedCard &&
    pendingKind === "name-card-selection" &&
    namedCardValues.length === 0
  ) {
    diagnostics.push({
      kind: "unsupported-shape",
      family,
      reason: "Name-a-card resolutions are outside the v1 automation support matrix",
      sourceCardId,
      bagId,
      effectId,
    });
    return null;
  }
  const rawScryEffect = findAutomatableScryEffect(effect);
  // When the scry targets a non-controller player's deck (e.g. target: "EACH_OPPONENT")
  // or is chosen by a non-controller player (e.g. chooser: "OPPONENT"), the engine will
  // create a pending effect for that player. The planner must not pre-plan destinations
  // during bag/play enumeration: it would read the wrong deck and bypass the pending
  // effect for the opponent.
  //
  // However, when the family is "resolveEffect", the delegation has already happened:
  // the engine created a pending effect for the opponent, and the opponent's planner is
  // now resolving it. In that case, the scry destinations should be planned normally
  // from the opponent's perspective (analysisPlayerId is already set to the opponent).
  const scryDelegatesToOtherPlayer =
    rawScryEffect != null &&
    family !== "resolveEffect" &&
    scryEffectDelegatesToOtherPlayer(rawScryEffect);
  const scryEffect = scryDelegatesToOtherPlayer ? undefined : rawScryEffect;
  if (shape.requiresDestinations && !scryEffect && !scryDelegatesToOtherPlayer) {
    diagnostics.push({
      kind: "unsupported-shape",
      family,
      reason: "Ordered destination selection is outside the v1 automation support matrix",
      sourceCardId,
      bagId,
      effectId,
    });
    return null;
  }
  if (shape.usesAmountSelection) {
    diagnostics.push({
      kind: "unsupported-shape",
      family,
      reason: "Amount selection is outside the v1 automation support matrix",
      sourceCardId,
      bagId,
      effectId,
    });
    return null;
  }
  if (shape.choiceCount > 1 || shape.optionalCount > 1) {
    diagnostics.push({
      kind: "unsupported-shape",
      family,
      reason: "Nested branching exceeds the v1 automation support matrix",
      sourceCardId,
      bagId,
      effectId,
    });
    return null;
  }

  const targetVariants = buildTargetVariants({
    adapter,
    analysisPlayerId,
    baseTargets: baseResolutionInput?.targets,
    selectionContext: baseResolutionInput?.selectionContext,
    diagnostics,
    effect,
    family,
    sourceCardId,
    searchCaps,
  });
  if (!targetVariants) {
    return null;
  }
  const orderedTargetVariants = shape.requiresOrderedTargets
    ? expandOrderedTargetVariants({
        adapter,
        analysisPlayerId,
        diagnostics,
        effectId,
        family,
        bagId,
        searchCaps,
        sourceCardId,
        targetVariants,
      })
    : targetVariants;
  if (!orderedTargetVariants) {
    return null;
  }

  const forcedChoiceIndex =
    typeof baseResolutionInput?.choiceIndex === "number"
      ? undefined
      : getForcedChoiceIndex({
          adapter,
          analysisPlayerId,
          effect,
          sourceCardId,
        });

  const choiceValues =
    typeof baseResolutionInput?.choiceIndex === "number"
      ? [baseResolutionInput.choiceIndex]
      : typeof forcedChoiceIndex === "number"
        ? [forcedChoiceIndex]
        : pendingKind === "choice-selection" || shape.choiceCount > 0
          ? (() => {
              const optionCount = shape.choiceOptionCount ?? 0;
              if (optionCount > searchCaps.choiceIndices) {
                diagnostics.push({
                  kind: "overflow-skip",
                  family,
                  reason: "Choice branches exceed the configured automation search cap",
                  cap: searchCaps.choiceIndices,
                  actual: optionCount,
                  sourceCardId,
                  bagId,
                  effectId,
                });
                return null;
              }

              return Array.from({ length: optionCount }, (_, index) => index);
            })()
          : [undefined];
  if (!choiceValues) {
    return null;
  }

  const optionalValues =
    typeof baseResolutionInput?.resolveOptional === "boolean"
      ? [baseResolutionInput.resolveOptional]
      : pendingKind === "optional-selection" || shape.optionalCount > 0
        ? [false, true]
        : [undefined];

  const groups = cartesianProduct<ResolutionVariantPart>(
    [
      orderedTargetVariants.map((targets) => ({ targets })),
      choiceValues.map((choiceIndex) => ({ choiceIndex })),
      namedCardValues.map((namedCard) => ({ namedCard })),
      optionalValues.map((resolveOptional) => ({ resolveOptional })),
    ],
    searchCaps.targetCombinationsPerFamily *
      Math.max(1, choiceValues.length) *
      Math.max(1, namedCardValues.length),
  );
  if (groups.overflow) {
    diagnostics.push({
      kind: "overflow-skip",
      family,
      reason: "Resolution variants exceeded the search cap; keeping the first combinations",
      cap:
        searchCaps.targetCombinationsPerFamily *
        Math.max(1, choiceValues.length) *
        Math.max(1, namedCardValues.length),
      actual:
        searchCaps.targetCombinationsPerFamily *
          Math.max(1, choiceValues.length) *
          Math.max(1, namedCardValues.length) +
        1,
      sourceCardId,
      bagId,
      effectId,
    });
  }

  const plannedScryDestinations =
    scryEffect &&
    buildScryDestinations({
      adapter,
      analysisPlayerId,
      baseResolutionInput,
      scryEffect,
    });
  if (scryEffect && !plannedScryDestinations) {
    diagnostics.push({
      kind: "unsupported-shape",
      family,
      reason: "Scry destinations could not be resolved within the automation support matrix",
      sourceCardId,
      bagId,
      effectId,
    });
    return null;
  }

  return groups.values
    .map((group) =>
      group.reduce<AutomatedActionResolutionVariant>(
        (current, next) => ({
          ...current,
          ...(next.choiceIndex !== undefined ? { choiceIndex: next.choiceIndex } : {}),
          ...(typeof next.namedCard === "string" ? { namedCard: next.namedCard } : {}),
          ...(typeof next.resolveOptional === "boolean"
            ? { resolveOptional: next.resolveOptional }
            : {}),
          ...(next.targets && next.targets.length > 0 ? { targets: next.targets } : {}),
        }),
        {},
      ),
    )
    .map((variant) =>
      plannedScryDestinations && variant.resolveOptional !== false
        ? {
            ...variant,
            destinations: plannedScryDestinations.map((destination) => ({
              zone: destination.zone,
              cards: [...destination.cards],
            })),
          }
        : variant,
    );
}

function extractBagEntry(entry: DeepReadonly<BagEffectEntry>): BagOrPendingEntry {
  return {
    baseResolutionInput: {
      choiceIndex: entry.resolutionInput.choiceIndex,
      destinations: Array.isArray(entry.resolutionInput.destinations)
        ? entry.resolutionInput.destinations.map((destination) => ({
            zone: destination.zone,
            cards: Array.isArray(destination.cards)
              ? destination.cards.map((cardId: CardInstanceId) => String(cardId) as CardInstanceId)
              : [String(destination.cards) as CardInstanceId],
          }))
        : undefined,
      eventSnapshot: entry.resolutionInput.eventSnapshot,
      namedCard: entry.resolutionInput.namedCard,
      resolveOptional: entry.resolutionInput.resolveOptional,
      targets: Array.isArray(entry.resolutionInput.targets)
        ? [...entry.resolutionInput.targets]
        : typeof entry.resolutionInput.targets === "string"
          ? [entry.resolutionInput.targets]
          : undefined,
    },
    effect: entry.effect as Effect | undefined,
    sourceCardId: entry.sourceId,
  };
}

function extractPendingEntry(entry: DeepReadonly<PendingActionEffect>): BagOrPendingEntry {
  return {
    baseResolutionInput: {
      choiceIndex: entry.resolutionInput.choiceIndex,
      destinations: Array.isArray(entry.resolutionInput.destinations)
        ? entry.resolutionInput.destinations.map((destination) => ({
            zone: destination.zone,
            cards: Array.isArray(destination.cards)
              ? destination.cards.map((cardId: CardInstanceId) => String(cardId) as CardInstanceId)
              : [String(destination.cards) as CardInstanceId],
          }))
        : undefined,
      eventSnapshot: entry.resolutionInput.eventSnapshot,
      namedCard: entry.resolutionInput.namedCard,
      resolveOptional: entry.resolutionInput.resolveOptional,
      selectionContext: entry.selectionContext,
      targets: Array.isArray(entry.resolutionInput.targets)
        ? [...entry.resolutionInput.targets]
        : typeof entry.resolutionInput.targets === "string"
          ? [entry.resolutionInput.targets]
          : undefined,
    },
    effect: entry.effect as Effect | undefined,
    sourceCardId: entry.sourceCardId,
  };
}

function getActorCharactersInPlay(
  adapter: AutomatedActionPlannerAdapter,
  actorId: PlayerId,
): CardInstanceId[] {
  return stableSortIds(
    adapter.board,
    getPlayerZoneCardIds(adapter.board, actorId, "play").filter((cardId) => {
      const definition = adapter.getDefinitionByInstanceId(cardId);
      return definition?.cardType === "character";
    }),
  );
}

function getActorLocationsInPlay(
  adapter: AutomatedActionPlannerAdapter,
  actorId: PlayerId,
): CardInstanceId[] {
  return stableSortIds(
    adapter.board,
    getPlayerZoneCardIds(adapter.board, actorId, "play").filter((cardId) => {
      const definition = adapter.getDefinitionByInstanceId(cardId);
      return definition?.cardType === "location";
    }),
  );
}

function enumerateChooseWhoGoesFirstCandidates(args: {
  actorId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  diagnostics: AutomatedActionDiagnostic[];
  candidates: AutomatedActionCandidate[];
}): void {
  const { actorId, adapter, diagnostics, candidates } = args;
  if (!isMoveAvailable(adapter, "chooseWhoGoesFirst")) {
    return;
  }
  if (adapter.board.choosingFirstPlayer !== actorId) {
    return;
  }

  for (const playerId of adapter.board.playerOrder) {
    addValidatedCandidate(adapter, diagnostics, actorId, candidates, {
      family: "chooseWhoGoesFirst",
      firstPlayerId: playerId,
    });
  }
}

function enumerateAlterHandCandidates(args: {
  actorId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  diagnostics: AutomatedActionDiagnostic[];
  candidates: AutomatedActionCandidate[];
}): void {
  const { actorId, adapter, diagnostics, candidates } = args;
  if (!isMoveAvailable(adapter, "alterHand")) {
    return;
  }
  if (!adapter.board.pendingMulligan.includes(actorId)) {
    return;
  }

  const hand = stableSortIds(adapter.board, getPlayerZoneCardIds(adapter.board, actorId, "hand"));
  const handWithDefinitions = hand.map((cardId) => ({
    cardId,
    cost: getPrintedCost(adapter.board, cardId),
    inkable: getProjectedCard(adapter.board, cardId)?.canBePutInInkwell === true,
  }));

  const structuralMulligan = new Set<CardInstanceId>(
    handWithDefinitions
      .filter((entry) => !entry.inkable || entry.cost >= 5)
      .map((entry) => entry.cardId),
  );
  const preferredKeepers = [...handWithDefinitions].sort((left, right) => {
    if (left.inkable !== right.inkable) {
      return left.inkable ? -1 : 1;
    }
    if (left.cost <= 2 !== right.cost <= 2) {
      return left.cost <= 2 ? -1 : 1;
    }
    if (left.cost !== right.cost) {
      return left.cost - right.cost;
    }
    return compareCardIds(adapter.board, left.cardId, right.cardId);
  });

  for (const keeper of preferredKeepers) {
    if (hand.length - structuralMulligan.size >= 2 || structuralMulligan.size === 0) {
      break;
    }
    if (!structuralMulligan.has(keeper.cardId)) {
      continue;
    }
    structuralMulligan.delete(keeper.cardId);
  }

  const candidateMap = new Map<string, AutomatedActionCandidate>();
  const candidateList: Extract<AutomatedActionCandidate, { family: "alterHand" }>[] = [
    {
      family: "alterHand",
      cardsToMulligan: [],
      plan: "keep-all",
    },
    {
      family: "alterHand",
      cardsToMulligan: stableSortIds(adapter.board, [...structuralMulligan]),
      plan: "structural-mulligan",
    },
    {
      family: "alterHand",
      cardsToMulligan: [...hand],
      plan: "full-mulligan",
    },
  ];

  for (const candidate of candidateList) {
    const key = candidate.cardsToMulligan.join(",");
    if (!candidateMap.has(key)) {
      candidateMap.set(key, candidate);
    }
  }

  for (const candidate of candidateMap.values()) {
    addValidatedCandidate(adapter, diagnostics, actorId, candidates, candidate);
  }
}

function getBagEntriesForActor(
  adapter: AutomatedActionPlannerAdapter,
  actorId: PlayerId,
): readonly DeepReadonly<BagEffectEntry>[] {
  if (adapter.authoritativeHints) {
    return adapter.authoritativeHints.bagItems.filter((entry) => entry.controllerId === actorId);
  }

  return adapter.board.bagEffects
    .filter((entry) => entry.controllerId === actorId)
    .map((entry) => entry.payload as DeepReadonly<BagEffectEntry>);
}

function enumerateResolveBagCandidates(args: {
  actorId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  diagnostics: AutomatedActionDiagnostic[];
  candidates: AutomatedActionCandidate[];
  searchCaps: AutomatedActionSearchCaps;
}): void {
  const { actorId, adapter, diagnostics, candidates, searchCaps } = args;
  if (!isMoveAvailable(adapter, "resolveBag")) {
    return;
  }

  const bagEntries = getBagEntriesForActor(adapter, actorId);
  if (bagEntries.length === 0) {
    return;
  }

  for (const bagEntry of bagEntries) {
    const extracted = extractBagEntry(bagEntry);
    const variants = buildResolutionVariants({
      adapter,
      analysisPlayerId: bagEntry.controllerId,
      bagId: bagEntry.id,
      baseResolutionInput: extracted.baseResolutionInput,
      diagnostics,
      effect: extracted.effect,
      family: "resolveBag",
      searchCaps,
      sourceCardId: extracted.sourceCardId,
    });
    if (!variants) {
      continue;
    }

    for (const variant of variants) {
      addValidatedCandidate(adapter, diagnostics, actorId, candidates, {
        family: "resolveBag",
        bagId: bagEntry.id,
        ...(typeof variant.choiceIndex === "number" ? { choiceIndex: variant.choiceIndex } : {}),
        ...(variant.destinations ? { destinations: variant.destinations } : {}),
        ...(typeof variant.namedCard === "string" ? { namedCard: variant.namedCard } : {}),
        ...(typeof variant.resolveOptional === "boolean"
          ? { resolveOptional: variant.resolveOptional }
          : {}),
        ...(variant.targets && variant.targets.length > 0 ? { targets: variant.targets } : {}),
      });
    }
  }
}

function getPendingEffectsForActor(
  adapter: AutomatedActionPlannerAdapter,
  actorId: PlayerId,
): readonly DeepReadonly<PendingActionEffect>[] {
  const pendingEffects =
    adapter.authoritativeHints?.pendingEffects ?? adapter.state.G.pendingEffects;
  const pendingChoice = adapter.state.ctx.priority.pendingChoice;

  if (pendingChoice?.type === "action-effect") {
    // Find the pending effect where THIS actor is the chooser (regardless of who triggered the
    // effect). This handles "OPPONENT" chooser effects (e.g. Hades) where pendingChoice.playerID
    // is the controller (P1) but the chooser is the opponent (P2).
    const matchingEffect = pendingEffects.find(
      (entry) => entry.id === pendingChoice.requestID && entry.chooserId === actorId,
    );
    return matchingEffect ? [matchingEffect] : [];
  }

  return pendingEffects.filter((entry) => entry.chooserId === actorId);
}

function enumerateResolveEffectCandidates(args: {
  actorId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  diagnostics: AutomatedActionDiagnostic[];
  candidates: AutomatedActionCandidate[];
  searchCaps: AutomatedActionSearchCaps;
}): void {
  const { actorId, adapter, diagnostics, candidates, searchCaps } = args;
  if (!isMoveAvailable(adapter, "resolveEffect")) {
    return;
  }

  const pendingEffects = getPendingEffectsForActor(adapter, actorId);
  if (pendingEffects.length === 0) {
    return;
  }

  for (const pendingEffect of pendingEffects) {
    const extracted = extractPendingEntry(pendingEffect);
    const variants = buildResolutionVariants({
      adapter,
      analysisPlayerId:
        pendingEffect.kind === "name-card-selection" ? actorId : pendingEffect.controllerId,
      baseResolutionInput: extracted.baseResolutionInput,
      diagnostics,
      effect: extracted.effect,
      effectId: pendingEffect.id,
      family: "resolveEffect",
      pendingKind: pendingEffect.kind,
      searchCaps,
      sourceCardId: extracted.sourceCardId,
    });
    if (!variants) {
      continue;
    }

    for (const variant of variants) {
      addValidatedCandidate(adapter, diagnostics, actorId, candidates, {
        family: "resolveEffect",
        effectId: pendingEffect.id,
        ...(typeof variant.choiceIndex === "number" ? { choiceIndex: variant.choiceIndex } : {}),
        ...(variant.destinations ? { destinations: variant.destinations } : {}),
        ...(typeof variant.namedCard === "string" ? { namedCard: variant.namedCard } : {}),
        ...(typeof variant.resolveOptional === "boolean"
          ? { resolveOptional: variant.resolveOptional }
          : {}),
        ...(variant.targets && variant.targets.length > 0 ? { targets: variant.targets } : {}),
      });
    }
  }
}

function enumeratePutInkCandidates(args: {
  actorId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  diagnostics: AutomatedActionDiagnostic[];
  candidates: AutomatedActionCandidate[];
}): void {
  const { actorId, adapter, diagnostics, candidates } = args;
  if (!isMoveAvailable(adapter, "putCardIntoInkwell")) {
    return;
  }

  for (const cardId of stableSortIds(
    adapter.board,
    getPlayerZoneCardIds(adapter.board, actorId, "hand").filter(
      (candidateId) => getProjectedCard(adapter.board, candidateId)?.canBePutInInkwell === true,
    ),
  )) {
    addValidatedCandidate(adapter, diagnostics, actorId, candidates, {
      family: "putCardIntoInkwell",
      cardId,
    });
  }
}

function enumeratePlayCostModes(args: {
  actorId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  cardDef: LorcanaCardDefinition;
  cardId: CardInstanceId;
  searchCaps: AutomatedActionSearchCaps;
  diagnostics: AutomatedActionDiagnostic[];
  standardCostReductionTolerance: number;
}): PlayCardCostInput[] {
  const {
    actorId,
    adapter,
    cardDef,
    cardId,
    searchCaps,
    diagnostics,
    standardCostReductionTolerance,
  } = args;
  // The projection computes playCost without `playMethod`, so it will not
  // reflect standard-only cost reducers. Use the actual applicable reduction
  // amount as tolerance so large reducers are still sent to engine validation.
  // The `free` validation path uses `playMethod: undefined`, so the projected
  // playCost is exact for that check; emit `free` only when the projection says
  // the cost is already zero.
  const projectedPlayCost = getProjectedCard(adapter.board, cardId)?.playCost ?? cardDef.cost;
  const availableInk = getAvailableInkForPlayer(adapter.board, actorId);
  const costModes: PlayCardCostInput[] = [];
  if (projectedPlayCost <= availableInk + standardCostReductionTolerance) {
    costModes.push("standard");
  }
  if (projectedPlayCost === 0) {
    costModes.push("free");
  }
  const readContext = buildReadContext(adapter, actorId);
  const readyCharacters = getActorCharactersInPlay(adapter, actorId).filter((characterId) => {
    const meta = readContext.cards.require(characterId).meta;
    return isReadyAndNotDrying(meta);
  });

  const shiftRules = getShiftRules(cardDef);
  if (shiftRules?.unsupportedReason) {
    diagnostics.push({
      kind: "unsupported-shape",
      family: "playCard",
      reason: shiftRules.unsupportedReason,
      sourceCardId: cardId,
    });
  } else if (shiftRules) {
    const shiftCandidates = resolveShiftTargetCandidates(
      shiftRules,
      readyCharacters,
      (candidateId) => adapter.getDefinitionByInstanceId(candidateId),
    );
    for (const shiftTarget of stableSortIds(adapter.board, shiftCandidates)) {
      costModes.push({ cost: "shift", shiftTarget });
    }
  }

  if (isSongCard(cardDef)) {
    for (const singer of readyCharacters) {
      const threshold = getSingerThresholdForInstance({
        framework: readContext.framework,
        singerId: singer,
        singerDef: adapter.getDefinitionByInstanceId(singer),
        getDefinitionByInstanceId: (candidateId) => adapter.getDefinitionByInstanceId(candidateId),
      });
      if (threshold !== null && threshold >= cardDef.cost) {
        costModes.push({ cost: "sing", singer });
      }
    }

    const singTogetherThreshold = getSingTogetherThreshold(cardDef);
    if (singTogetherThreshold !== null) {
      const singerThresholds = readyCharacters
        .map((singerId) => ({
          singerId,
          threshold:
            getSingerThresholdForInstance({
              framework: readContext.framework,
              singerId,
              singerDef: adapter.getDefinitionByInstanceId(singerId),
              getDefinitionByInstanceId: (candidateId) =>
                adapter.getDefinitionByInstanceId(candidateId),
            }) ?? 0,
        }))
        .filter((entry) => entry.threshold > 0);
      const { combinations, overflow } = enumerateBoundedCombinations(
        singerThresholds,
        1,
        singerThresholds.length,
        searchCaps.singerCombinations,
      );
      if (overflow) {
        diagnostics.push({
          kind: "overflow-skip",
          family: "playCard",
          reason:
            "Singer combinations exceeded the automation search cap; keeping the first combinations",
          cap: searchCaps.singerCombinations,
          actual: searchCaps.singerCombinations + 1,
          sourceCardId: cardId,
        });
      }
      for (const combination of combinations) {
        const totalThreshold = combination.reduce((sum, entry) => sum + entry.threshold, 0);
        if (totalThreshold >= singTogetherThreshold) {
          costModes.push({
            cost: "singTogether",
            singers: stableSortIds(
              adapter.board,
              combination.map((entry) => entry.singerId),
            ),
          });
        }
      }
    }
  }

  return costModes;
}

function enumeratePlayCardCandidates(args: {
  actorId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  diagnostics: AutomatedActionDiagnostic[];
  candidates: AutomatedActionCandidate[];
  searchCaps: AutomatedActionSearchCaps;
}): void {
  const { actorId, adapter, diagnostics, candidates, searchCaps } = args;
  if (!isMoveAvailable(adapter, "playCard")) {
    return;
  }

  for (const cardId of stableSortIds(
    adapter.board,
    getPlayerZoneCardIds(adapter.board, actorId, "hand"),
  )) {
    const cardDef = adapter.getDefinitionByInstanceId(cardId);
    if (!cardDef) {
      diagnostics.push({
        kind: "unsupported-shape",
        family: "playCard",
        reason: "Card definition could not be resolved for automation planning",
        sourceCardId: cardId,
      });
      continue;
    }

    const actionAbilities = (cardDef.abilities ?? []).filter(
      (ability): ability is ActionAbilityDefinition => ability.type === "action",
    );
    if (actionAbilities.length > 1) {
      diagnostics.push({
        kind: "unsupported-shape",
        family: "playCard",
        reason:
          "Multiple action abilities on a single play are outside the v1 automation support matrix",
        sourceCardId: cardId,
      });
      continue;
    }
    const resolutionVariants = buildResolutionVariants({
      adapter,
      analysisPlayerId: actorId,
      diagnostics,
      effect: actionAbilities[0]?.effect as Effect | undefined,
      family: "playCard",
      searchCaps,
      sourceCardId: cardId,
    });
    if (!resolutionVariants) {
      continue;
    }

    const costModes = enumeratePlayCostModes({
      actorId,
      adapter,
      cardDef,
      cardId,
      searchCaps,
      diagnostics,
      standardCostReductionTolerance: getStandardCostReductionTolerance(
        adapter,
        actorId,
        cardDef,
        cardId,
      ),
    });
    for (const cost of costModes) {
      for (const variant of resolutionVariants) {
        addValidatedCandidate(adapter, diagnostics, actorId, candidates, {
          family: "playCard",
          cardId,
          cost,
          ...(typeof variant.choiceIndex === "number" ? { choiceIndex: variant.choiceIndex } : {}),
          ...(typeof variant.resolveOptional === "boolean"
            ? { resolveOptional: variant.resolveOptional }
            : {}),
          ...(variant.targets && variant.targets.length > 0 ? { targets: variant.targets } : {}),
        });
      }
    }
  }
}

function getActivatedAbilitiesForCard(
  adapter: AutomatedActionPlannerAdapter,
  cardId: CardInstanceId,
): Array<{ ability: ActivatedAbilityDefinition; abilityIndex: number }> {
  const definition = adapter.getDefinitionByInstanceId(cardId);
  if (!definition) {
    return [];
  }

  const printedAbilities = (definition.abilities ?? []).filter(
    (ability): ability is ActivatedAbilityDefinition => ability.type === "activated",
  );
  const registry = buildRegistryFromMatchState(adapter.state as LorcanaMatchState, (id) =>
    adapter.getDefinitionByInstanceId(id),
  );
  const grantedAbilities = getGrantedActivatedAbilities({
    state: toStaticAbilityState(adapter.state as LorcanaMatchState),
    cardId,
    getDefinitionByInstanceId: (candidateId) => adapter.getDefinitionByInstanceId(candidateId),
    registry,
  }).map((entry) => entry.ability);

  return [...printedAbilities, ...grantedAbilities].map((ability, abilityIndex) => ({
    ability,
    abilityIndex,
  }));
}

function matchesDiscardCostRequirements(
  definition: LorcanaCardDefinition | undefined,
  ability: ActivatedAbilityDefinition,
): boolean {
  if (!definition) {
    return false;
  }

  const discardCardType =
    ability.cost?.discardCardType ??
    (typeof ability.cost?.discard === "object" ? ability.cost.discard.cardType : undefined);
  if (discardCardType === "song") {
    if (definition.cardType !== "action" || definition.actionSubtype !== "song") {
      return false;
    }
  } else if (
    discardCardType === "character" ||
    discardCardType === "item" ||
    discardCardType === "location" ||
    discardCardType === "action"
  ) {
    if (definition.cardType !== discardCardType) {
      return false;
    }
  }

  const discardCardName = ability.cost?.discardCardName;
  if (typeof discardCardName === "string" && discardCardName.length > 0) {
    return cardHasName(definition, discardCardName);
  }

  return true;
}

function getRequiredDiscardCardCostCount(ability: ActivatedAbilityDefinition): number {
  const directCount =
    typeof ability.cost?.discardCards === "number"
      ? ability.cost.discardCards
      : typeof ability.cost?.discardCard === "number"
        ? ability.cost.discardCard
        : typeof ability.cost?.discard === "object" &&
            typeof ability.cost.discard.amount === "number"
          ? ability.cost.discard.amount
          : 0;
  return Number.isFinite(directCount) && directCount > 0 ? Math.floor(directCount) : 0;
}

function buildAbilityCostSelectionGroups(args: {
  actorId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  ability: ActivatedAbilityDefinition;
  cardId: CardInstanceId;
  diagnostics: AutomatedActionDiagnostic[];
  searchCaps: AutomatedActionSearchCaps;
}): AutomatedActionCostSelections[] | null {
  const { actorId, adapter, ability, cardId, diagnostics, searchCaps } = args;
  const actorCharacters = getActorCharactersInPlay(adapter, actorId);
  const actorPlayCards = stableSortIds(
    adapter.board,
    getPlayerZoneCardIds(adapter.board, actorId, "play"),
  );
  const actorHand = stableSortIds(
    adapter.board,
    getPlayerZoneCardIds(adapter.board, actorId, "hand"),
  );
  const requiredExertCharacters =
    typeof ability.cost?.exertCharacters === "number"
      ? Math.max(0, Math.floor(ability.cost.exertCharacters))
      : ability.cost?.exertCharacter
        ? 1
        : 0;
  const requiredBanishItems =
    typeof ability.cost?.banishItem === "number"
      ? Math.max(0, Math.floor(ability.cost.banishItem))
      : ability.cost?.banishItem
        ? 1
        : 0;
  const requiredBanishCharacters = ability.cost?.banishCharacter ? 1 : 0;
  const requiredDiscardCards = getRequiredDiscardCardCostCount(ability);

  const exertCandidatePool = actorCharacters.filter(
    (characterId) => !(ability.cost?.exert === true && characterId === cardId),
  );
  const banishItemPool = actorPlayCards.filter(
    (candidateId) => adapter.getDefinitionByInstanceId(candidateId)?.cardType === "item",
  );
  const banishCharacterPool = actorCharacters.filter(
    (candidateId) => !(ability.cost?.banishCharacterTarget === "another" && candidateId === cardId),
  );
  const discardPool = actorHand.filter((candidateId) =>
    matchesDiscardCostRequirements(adapter.getDefinitionByInstanceId(candidateId), ability),
  );

  const selectionGroups: AutomatedActionCostSelections[][] = [];

  const pushSelectionGroup = (
    family: "activateAbility",
    count: number,
    pool: readonly CardInstanceId[],
    apply: (ids: CardInstanceId[]) => AutomatedActionCostSelections,
  ): boolean => {
    if (count === 0) {
      selectionGroups.push([{}]);
      return true;
    }
    if (pool.length > searchCaps.targetPool) {
      diagnostics.push({
        kind: "overflow-skip",
        family,
        reason: "Ability cost pool exceeds the configured automation search cap",
        cap: searchCaps.targetPool,
        actual: pool.length,
        sourceCardId: cardId,
      });
      return false;
    }

    const { combinations, overflow } = enumerateBoundedCombinations(
      pool,
      count,
      count,
      searchCaps.targetCombinationsPerFamily,
    );
    if (overflow) {
      diagnostics.push({
        kind: "overflow-skip",
        family,
        reason:
          "Ability cost combinations exceeded the configured automation search cap; keeping the first combinations",
        cap: searchCaps.targetCombinationsPerFamily,
        actual: searchCaps.targetCombinationsPerFamily + 1,
        sourceCardId: cardId,
      });
    }
    selectionGroups.push(
      combinations.map((combination) => apply(stableSortIds(adapter.board, combination))),
    );
    return true;
  };

  if (
    !pushSelectionGroup("activateAbility", requiredExertCharacters, exertCandidatePool, (ids) => ({
      exertCharacters: ids,
    })) ||
    !pushSelectionGroup("activateAbility", requiredBanishItems, banishItemPool, (ids) => ({
      banishItems: ids,
    })) ||
    !pushSelectionGroup(
      "activateAbility",
      requiredBanishCharacters,
      banishCharacterPool,
      (ids) => ({
        banishCharacters: ids,
      }),
    ) ||
    !pushSelectionGroup("activateAbility", requiredDiscardCards, discardPool, (ids) => ({
      discardCards: ids,
    }))
  ) {
    return null;
  }

  const product = cartesianProduct(selectionGroups, searchCaps.targetCombinationsPerFamily);
  if (product.overflow) {
    diagnostics.push({
      kind: "overflow-skip",
      family: "activateAbility",
      reason: "Ability cost selections exceeded the search cap; keeping the first combinations",
      cap: searchCaps.targetCombinationsPerFamily,
      actual: searchCaps.targetCombinationsPerFamily + 1,
      sourceCardId: cardId,
    });
  }

  return product.values.map((parts) =>
    parts.reduce<AutomatedActionCostSelections>(
      (current, next) => ({
        ...current,
        ...(next.banishCharacters ? { banishCharacters: next.banishCharacters } : {}),
        ...(next.banishItems ? { banishItems: next.banishItems } : {}),
        ...(next.discardCards ? { discardCards: next.discardCards } : {}),
        ...(next.exertCharacters ? { exertCharacters: next.exertCharacters } : {}),
      }),
      {},
    ),
  );
}

function enumerateActivateAbilityCandidates(args: {
  actorId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  diagnostics: AutomatedActionDiagnostic[];
  candidates: AutomatedActionCandidate[];
  searchCaps: AutomatedActionSearchCaps;
}): void {
  const { actorId, adapter, diagnostics, candidates, searchCaps } = args;
  if (!isMoveAvailable(adapter, "activateAbility")) {
    return;
  }

  for (const cardId of getActorCharactersInPlay(adapter, actorId).concat(
    stableSortIds(
      adapter.board,
      getPlayerZoneCardIds(adapter.board, actorId, "play").filter((candidateId) => {
        const definition = adapter.getDefinitionByInstanceId(candidateId);
        return definition?.cardType === "item" || definition?.cardType === "location";
      }),
    ),
  )) {
    for (const { ability, abilityIndex } of getActivatedAbilitiesForCard(adapter, cardId)) {
      const costSelections = buildAbilityCostSelectionGroups({
        actorId,
        adapter,
        ability,
        cardId,
        diagnostics,
        searchCaps,
      });
      if (!costSelections) {
        continue;
      }

      const resolutionVariants = buildResolutionVariants({
        adapter,
        analysisPlayerId: actorId,
        diagnostics,
        effect: ability.effect as Effect | undefined,
        family: "activateAbility",
        searchCaps,
        sourceCardId: cardId,
      });
      if (!resolutionVariants) {
        continue;
      }

      for (const costSelection of costSelections) {
        for (const variant of resolutionVariants) {
          addValidatedCandidate(adapter, diagnostics, actorId, candidates, {
            family: "activateAbility",
            cardId,
            abilityIndex,
            ...(typeof variant.choiceIndex === "number"
              ? { choiceIndex: variant.choiceIndex }
              : {}),
            ...(variant.targets && variant.targets.length > 0 ? { targets: variant.targets } : {}),
            ...(Object.keys(costSelection).length > 0 ? { costs: costSelection } : {}),
          });
        }
      }
    }
  }
}

function enumerateQuestCandidates(args: {
  actorId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  diagnostics: AutomatedActionDiagnostic[];
  candidates: AutomatedActionCandidate[];
}): void {
  const { actorId, adapter, diagnostics, candidates } = args;
  if (!isMoveAvailable(adapter, "quest")) {
    return;
  }

  for (const cardId of getActorCharactersInPlay(adapter, actorId)) {
    // Skip exerted characters — they cannot quest in any scenario. Skip
    // drying characters unless they have a legal exception: the
    // `QuestWhileDrying` keyword (projected `keywords` aggregates base +
    // static keyword grants from other cards) or a self-static
    // `can-quest-turn-played` restriction on the card definition. Any other
    // drying-quester exception would still be caught by engine validation.
    const projected = getProjectedCard(adapter.board, cardId);
    if (projected?.exerted === true) {
      continue;
    }
    if (projected?.drying === true) {
      const keywords = projected.keywords ?? [];
      const allowed =
        keywords.includes("QuestWhileDrying") ||
        definitionHasSelfStaticCanQuestTurnPlayed(adapter.getDefinitionByInstanceId(cardId));
      if (!allowed) {
        continue;
      }
    }
    addValidatedCandidate(adapter, diagnostics, actorId, candidates, {
      family: "quest",
      cardId,
    });
  }
}

function definitionHasSelfStaticCanQuestTurnPlayed(
  definition: LorcanaCardDefinition | undefined,
): boolean {
  if (!definition) {
    return false;
  }
  for (const ability of definition.abilities ?? []) {
    if (ability.type !== "static") {
      continue;
    }
    const effect = ability.effect as {
      type?: string;
      restriction?: string;
      target?: string;
    };
    if (
      effect?.type === "restriction" &&
      effect.restriction === "can-quest-turn-played" &&
      (effect.target === undefined || effect.target === "SELF")
    ) {
      return true;
    }
  }
  return false;
}

function definitionHasSelfStaticChallengeReadyGrant(
  definition: LorcanaCardDefinition | undefined,
): boolean {
  if (!definition) {
    return false;
  }
  for (const ability of definition.abilities ?? []) {
    if (ability.type !== "static") {
      continue;
    }
    const effect = ability.effect as { type?: string; target?: string; ability?: unknown };
    if (effect?.type !== "grant-ability") {
      continue;
    }
    if (effect.target !== undefined && effect.target !== "SELF") {
      continue;
    }
    const granted = effect.ability;
    const grantedType =
      typeof granted === "string"
        ? granted
        : granted && typeof granted === "object" && !Array.isArray(granted)
          ? (granted as { type?: string }).type
          : undefined;
    if (grantedType === "can-challenge-ready") {
      return true;
    }
  }
  return false;
}

function actorHasAnyChallengeReadyGrant(
  adapter: AutomatedActionPlannerAdapter,
  actorId: PlayerId,
): boolean {
  for (const cardId of getActorCharactersInPlay(adapter, actorId)) {
    const projected = getProjectedCard(adapter.board, cardId);
    if (
      projected?.temporaryAbilities &&
      Object.prototype.hasOwnProperty.call(projected.temporaryAbilities, "can-challenge-ready")
    ) {
      return true;
    }
    if (definitionHasSelfStaticChallengeReadyGrant(adapter.getDefinitionByInstanceId(cardId))) {
      return true;
    }
  }
  return false;
}

function isDefenderUnchallengeableForAttacker(
  adapter: AutomatedActionPlannerAdapter,
  defenderId: CardInstanceId,
  attackerId: CardInstanceId,
): boolean {
  const projected = getProjectedCard(adapter.board, defenderId);
  if (
    projected?.temporaryRestrictions &&
    Object.prototype.hasOwnProperty.call(projected.temporaryRestrictions, "cant-be-challenged")
  ) {
    return true;
  }

  return hasStaticChallengerFilteredRestriction({
    state: toStaticAbilityState(adapter.state as LorcanaMatchState),
    cardId: defenderId,
    attackerId,
    getDefinitionByInstanceId: (candidateId) => adapter.getDefinitionByInstanceId(candidateId),
  });
}

function enumerateChallengeCandidates(args: {
  actorId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  diagnostics: AutomatedActionDiagnostic[];
  candidates: AutomatedActionCandidate[];
}): void {
  const { actorId, adapter, diagnostics, candidates } = args;
  if (!isMoveAvailable(adapter, "challenge")) {
    return;
  }

  // Skip exerted attackers — they cannot challenge. Skip drying attackers
  // that don't have Rush. The projected `hasRush` already aggregates base
  // keyword, temporary grants, and static grants from other cards, so this
  // is exact for the Rush exception that `hasRushForChallenge` enforces in
  // challenge-rules.ts. Any other drying-attacker exception would still be
  // caught by the engine validator and produce a diagnostic.
  const attackers = getActorCharactersInPlay(adapter, actorId).filter((cardId) => {
    const projected = getProjectedCard(adapter.board, cardId);
    if (projected?.exerted === true) {
      return false;
    }
    if (projected?.drying === true && projected?.hasRush !== true) {
      return false;
    }
    return true;
  });
  // Defenders include exerted characters and any location. Ready character
  // defenders are normally illegal; only attackers with a `can-challenge-ready`
  // grant (temporary or self-static) may challenge them. If no actor character
  // carries such a grant, ready character defenders can be safely filtered.
  const actorCanChallengeReady = actorHasAnyChallengeReadyGrant(adapter, actorId);
  const defenders = stableSortIds(
    adapter.board,
    adapter.board.playerOrder
      .filter((playerId) => playerId !== actorId)
      .flatMap((playerId) => getPlayerZoneCardIds(adapter.board, playerId, "play"))
      .filter((cardId) => {
        const definition = adapter.getDefinitionByInstanceId(cardId);
        if (definition?.cardType === "location") {
          return true;
        }
        if (definition?.cardType !== "character") {
          return false;
        }
        if (actorCanChallengeReady) {
          return true;
        }
        const projected = getProjectedCard(adapter.board, cardId);
        return projected?.exerted === true;
      }),
  );

  // Evasive defenders can only be challenged by attackers that have Evasive
  // or Alert (engine rule: `canChallengeEvasive` in challenge-rules.ts).
  // The projection's `keywords` already aggregates base + temporary +
  // static keyword grants, so this filter is exact.
  const attackerCanChallengeEvasive = new Map<CardInstanceId, boolean>();
  for (const attackerId of attackers) {
    const projected = getProjectedCard(adapter.board, attackerId);
    const keywords = projected?.keywords ?? [];
    attackerCanChallengeEvasive.set(
      attackerId,
      keywords.includes("Evasive") || keywords.includes("Alert"),
    );
  }

  // Bodyguard "must be challenged if able": when an opposing player has an
  // exerted Bodyguard character that this attacker could legally challenge,
  // every non-Bodyguard character belonging to that owner becomes an illegal
  // target. Locations are not gated by Bodyguard. The check is per-attacker
  // because Evasive filters which Bodyguards count for that attacker (engine:
  // `getBodyguardCandidatesForOwner` in challenge-rules.ts).
  const defenderInfo = new Map<
    CardInstanceId,
    {
      ownerId: PlayerId;
      cardType: "character" | "location";
      hasEvasive: boolean;
      hasBodyguard: boolean;
      exerted: boolean;
    }
  >();
  const bodyguardsByOwner = new Map<
    PlayerId,
    Array<{ cardId: CardInstanceId; hasEvasive: boolean }>
  >();
  for (const playerId of adapter.board.playerOrder) {
    if (playerId === actorId) {
      continue;
    }
    for (const cardId of getPlayerZoneCardIds(adapter.board, playerId, "play")) {
      const definition = adapter.getDefinitionByInstanceId(cardId);
      if (definition?.cardType !== "character" && definition?.cardType !== "location") {
        continue;
      }
      const projected = getProjectedCard(adapter.board, cardId);
      const keywords = projected?.keywords ?? [];
      const info = {
        ownerId: playerId,
        cardType: definition.cardType,
        hasEvasive: projected?.hasEvasive === true,
        hasBodyguard: keywords.includes("Bodyguard"),
        exerted: projected?.exerted === true,
      };
      defenderInfo.set(cardId, info);
      if (info.cardType === "character" && info.hasBodyguard && info.exerted) {
        let list = bodyguardsByOwner.get(playerId);
        if (!list) {
          list = [];
          bodyguardsByOwner.set(playerId, list);
        }
        list.push({ cardId, hasEvasive: info.hasEvasive });
      }
    }
  }

  for (const attackerId of attackers) {
    const canChallengeEvasive = attackerCanChallengeEvasive.get(attackerId) === true;
    const ownersWithMandatoryBodyguard = new Set<PlayerId>();
    for (const [ownerId, list] of bodyguardsByOwner) {
      if (
        list.some(
          (bg) =>
            (canChallengeEvasive || !bg.hasEvasive) &&
            !isDefenderUnchallengeableForAttacker(adapter, bg.cardId, attackerId),
        )
      ) {
        ownersWithMandatoryBodyguard.add(ownerId);
      }
    }

    for (const defenderId of defenders) {
      const info = defenderInfo.get(defenderId);
      if (!info) {
        continue;
      }
      if (isDefenderUnchallengeableForAttacker(adapter, defenderId, attackerId)) {
        continue;
      }
      if (!canChallengeEvasive && info.hasEvasive) {
        continue;
      }
      if (
        info.cardType === "character" &&
        !info.hasBodyguard &&
        ownersWithMandatoryBodyguard.has(info.ownerId)
      ) {
        continue;
      }
      addValidatedCandidate(adapter, diagnostics, actorId, candidates, {
        family: "challenge",
        attackerId,
        defenderId,
        preview: adapter.previewChallenge(attackerId, defenderId),
      });
    }
  }
}

function enumerateMoveCharacterToLocationCandidates(args: {
  actorId: PlayerId;
  adapter: AutomatedActionPlannerAdapter;
  diagnostics: AutomatedActionDiagnostic[];
  candidates: AutomatedActionCandidate[];
}): void {
  const { actorId, adapter, diagnostics, candidates } = args;
  if (!isMoveAvailable(adapter, "moveCharacterToLocation")) {
    return;
  }

  const characters = getActorCharactersInPlay(adapter, actorId);
  const locations = getActorLocationsInPlay(adapter, actorId);

  for (const characterId of characters) {
    for (const locationId of locations) {
      addValidatedCandidate(adapter, diagnostics, actorId, candidates, {
        family: "moveCharacterToLocation",
        characterId,
        locationId,
      });
    }
  }
}

function summarizeDiagnostics(result: {
  actorId?: PlayerId;
  candidates: AutomatedActionCandidate[];
  diagnostics: AutomatedActionDiagnostic[];
}): AutomatedActionEnumerationResult {
  return {
    actorId: result.actorId,
    candidates: result.candidates,
    diagnostics: result.diagnostics,
    unsupportedSkips: result.diagnostics.filter(
      (diagnostic) =>
        diagnostic.kind === "unsupported-shape" || diagnostic.kind === "overflow-skip",
    ),
    validationSkips: result.diagnostics.filter(
      (
        diagnostic,
      ): diagnostic is Extract<AutomatedActionDiagnostic, { kind: "validation-reject" }> =>
        diagnostic.kind === "validation-reject",
    ),
  };
}

function createBasicCandidateSummary(
  candidate: AutomatedActionCandidate,
): AutomatedActionCandidateSummary {
  return {
    candidate,
    family: candidate.family,
    heuristics: [],
    stableKey: getCandidateKey(candidate),
  };
}

function createTraceFromPlan(args: {
  blocked?: AutomatedActionBlockedState;
  executionAttempts?: AutomatedActionExecutionAttempt[];
  fallbackTaken?: AutomatedActionFallback;
  finalResult?: CommandResult;
  kind: AutomatedActionDecisionTrace["kind"];
  plan: PlannedAutomatedActions;
  selectedCandidate?: AutomatedActionCandidate;
}): AutomatedActionDecisionTrace {
  const {
    blocked,
    executionAttempts = [],
    fallbackTaken,
    finalResult,
    kind,
    plan,
    selectedCandidate,
  } = args;
  const selectedSummary = plan.orderedCandidateSummaries.find(
    (summary) => summary.candidate === selectedCandidate,
  );

  return {
    actorId: plan.enumeration.actorId,
    ...(plan.actorDeckSignature ? { actorDeckSignature: plan.actorDeckSignature } : {}),
    boardSnapshot: plan.boardSnapshot,
    ...(blocked ? { blocked } : {}),
    diagnostics: plan.enumeration.diagnostics,
    executionAttempts: executionAttempts.map(({ candidate, result }) => ({
      candidate:
        plan.orderedCandidateSummaries.find((summary) => summary.candidate === candidate) ??
        createBasicCandidateSummary(candidate),
      ...(result.success
        ? { stateId: result.stateID }
        : {
            error: result.error,
            errorCode: result.errorCode,
            stateId: result.currentStateID,
          }),
      success: result.success,
    })),
    ...(fallbackTaken ? { fallbackTaken } : {}),
    ...(finalResult
      ? {
          finalResult: finalResult.success
            ? {
                stateId: finalResult.stateID,
                success: true,
              }
            : {
                error: finalResult.error,
                errorCode: finalResult.errorCode,
                stateId: finalResult.currentStateID,
                success: false,
              },
        }
      : {}),
    gameSegment: plan.gameSegment,
    ...(plan.informationPolicy ? { informationPolicy: plan.informationPolicy } : {}),
    kind,
    ...(plan.opponentKnowledgeSource
      ? { opponentKnowledgeSource: plan.opponentKnowledgeSource }
      : {}),
    orderedCandidates: plan.orderedCandidateSummaries,
    phase: plan.phase,
    ...(selectedSummary ? { selectedCandidate: selectedSummary } : {}),
    step: plan.step,
    strategyName: plan.strategyName,
    turnNumber: plan.turnNumber,
    unsupportedSkips: plan.enumeration.unsupportedSkips,
    validationSkips: plan.enumeration.validationSkips,
  };
}

function buildStrategyFallbackChain(strategy: AutomatedActionExecutionOptions["strategy"]) {
  void strategy;
  return [];
}

function planAutomatedActions(
  adapter: AutomatedActionPlannerAdapter,
  options: AutomatedActionEnumerationOptions = {},
  seedDiagnostics: AutomatedActionDiagnostic[] = [],
): PlannedAutomatedActions {
  const diagnostics = [...seedDiagnostics];
  const actorId = adapter.actorId;
  const strategy = options.strategy ?? deckAwareLoreRaceAutomatedActionStrategy;
  const informationPolicy = strategy.informationPolicy ?? "oracle";
  const boardSnapshot = createAutomatedActionBoardSnapshot({
    board: adapter.board,
    state: adapter.state,
  });

  if (!actorId) {
    diagnostics.push({
      kind: "actor-resolution",
      source: "unresolved",
      reason: "Unable to resolve an actor for automated action planning",
    });
    return {
      boardSnapshot,
      enumeration: summarizeDiagnostics({ actorId, candidates: [], diagnostics }),
      gameSegment: adapter.board.gameSegment,
      informationPolicy,
      opponentKnowledgeSource: "none",
      orderedCandidateSummaries: [],
      phase: adapter.board.phase,
      step: adapter.board.step,
      strategyName: strategy.name,
      turnNumber: adapter.board.turnNumber,
    };
  }

  const planningContext: AutomatedActionPlanningContext = {
    actorId,
    authoritativeHints: adapter.authoritativeHints,
    board: adapter.board,
    ...buildAutomatedActionDeckPlanningMetadata({
      actorId,
      authoritativeHints: adapter.authoritativeHints,
      board: adapter.board,
      informationPolicy,
      staticResources: adapter.staticResources,
    }),
    diagnostics: {
      push(diagnostic) {
        diagnostics.push(diagnostic);
      },
    },
    gameSegment: adapter.board.gameSegment,
    phase: adapter.board.phase,
    step: adapter.board.step,
    turnNumber: adapter.board.turnNumber,
  };
  const searchCaps = mergeSearchCaps(options.searchCaps);
  const candidates: AutomatedActionCandidate[] = [];

  enumerateChooseWhoGoesFirstCandidates({ actorId, adapter, diagnostics, candidates });
  enumerateAlterHandCandidates({ actorId, adapter, diagnostics, candidates });
  enumerateResolveBagCandidates({ actorId, adapter, diagnostics, candidates, searchCaps });
  enumerateResolveEffectCandidates({ actorId, adapter, diagnostics, candidates, searchCaps });
  enumerateQuestCandidates({ actorId, adapter, diagnostics, candidates });
  enumeratePlayCardCandidates({ actorId, adapter, diagnostics, candidates, searchCaps });
  enumerateActivateAbilityCandidates({ actorId, adapter, diagnostics, candidates, searchCaps });
  enumeratePutInkCandidates({ actorId, adapter, diagnostics, candidates });
  enumerateMoveCharacterToLocationCandidates({ actorId, adapter, diagnostics, candidates });
  enumerateChallengeCandidates({ actorId, adapter, diagnostics, candidates });

  const uniqueCandidates = [
    ...new Map(candidates.map((candidate) => [getCandidateKey(candidate), candidate])).values(),
  ];
  const orderedCandidateSummaries =
    strategy.summarizeCandidates(planningContext, uniqueCandidates) ??
    uniqueCandidates.map((candidate) => createBasicCandidateSummary(candidate));

  return {
    actorDeckSignature: planningContext.actorDeckProfile?.signature,
    boardSnapshot,
    enumeration: summarizeDiagnostics({
      actorId,
      candidates: orderedCandidateSummaries.map(({ candidate }) => candidate),
      diagnostics,
    }),
    gameSegment: adapter.board.gameSegment,
    informationPolicy: planningContext.informationPolicy,
    opponentKnowledgeSource: planningContext.opponentKnowledgeSource,
    orderedCandidateSummaries,
    phase: adapter.board.phase,
    step: adapter.board.step,
    strategyName: strategy.name,
    turnNumber: adapter.board.turnNumber,
  };
}

export function enumerateAutomatedActionsWithAdapter(
  adapter: AutomatedActionPlannerAdapter,
  options: AutomatedActionEnumerationOptions = {},
  seedDiagnostics: AutomatedActionDiagnostic[] = [],
): AutomatedActionEnumerationResult {
  const plan = planAutomatedActions(adapter, options, seedDiagnostics);
  options.traceSink?.push(
    createTraceFromPlan({
      kind: "enumeration",
      plan,
    }),
  );
  return plan.enumeration;
}

export function takeAutomatedActionWithAdapter(
  adapter: AutomatedActionPlannerAdapter,
  options: AutomatedActionExecutionOptions = {},
  seedDiagnostics: AutomatedActionDiagnostic[] = [],
): AutomatedActionExecutionResult {
  let plan = planAutomatedActions(adapter, options, seedDiagnostics);
  let enumeration = plan.enumeration;
  const actorId = enumeration.actorId;
  if (!actorId) {
    const result = {
      actorId,
      blocked: undefined,
      diagnostics: enumeration.diagnostics,
      executionAttempts: [],
      finalResult: adapter.createErrorResult(
        "Unable to resolve an actor for automated action execution",
        "AUTOMATED_ACTION_ACTOR_UNRESOLVED",
      ),
      orderedCandidates: enumeration.candidates,
      unsupportedSkips: enumeration.unsupportedSkips,
      validationSkips: enumeration.validationSkips,
    };

    options.traceSink?.push(
      createTraceFromPlan({
        blocked: result.blocked,
        finalResult: result.finalResult,
        kind: "execution",
        plan,
      }),
    );

    return result;
  }

  const executionAttempts: AutomatedActionExecutionAttempt[] = [];
  const failureBudget =
    options.maxExecutionFailures ?? DEFAULT_AUTOMATED_ACTION_MAX_EXECUTION_FAILURES;
  const attemptedCandidateKeys = new Set<string>();
  let failures = 0;
  let blocked: AutomatedActionBlockedState | undefined;
  let selectedCandidate: AutomatedActionCandidate | undefined;
  let finalResult = adapter.createErrorResult(
    "No automated action candidates were available",
    "AUTOMATED_ACTION_NO_CANDIDATES",
  );

  const executePlan = (currentPlan: PlannedAutomatedActions): boolean => {
    plan = currentPlan;
    enumeration = currentPlan.enumeration;

    for (const candidate of currentPlan.enumeration.candidates) {
      const candidateKey = getCandidateKey(candidate);
      if (attemptedCandidateKeys.has(candidateKey)) {
        continue;
      }

      attemptedCandidateKeys.add(candidateKey);
      const result = adapter.executeCandidate(actorId, candidate);
      executionAttempts.push({ candidate, result });
      if (result.success) {
        selectedCandidate = candidate;
        finalResult = result;
        return true;
      }

      finalResult = result;
      failures += 1;
      if (failures >= failureBudget) {
        return true;
      }
    }

    return false;
  };

  executePlan(plan);

  if (!selectedCandidate && executionAttempts.length > 0 && failures < failureBudget) {
    for (const strategy of buildStrategyFallbackChain(options.strategy)) {
      const fallbackPlan = planAutomatedActions(adapter, { ...options, strategy }, seedDiagnostics);
      const attemptsBeforeStrategy = executionAttempts.length;
      if (executePlan(fallbackPlan)) {
        break;
      }

      if (executionAttempts.length === attemptsBeforeStrategy) {
        continue;
      }
    }
  }

  let fallbackTaken: AutomatedActionFallback | undefined;
  if (!selectedCandidate) {
    const passResult = adapter.passTurn(actorId);
    if (passResult.success) {
      fallbackTaken = "passTurn";
      finalResult = passResult;
    } else {
      blocked = {
        reason: executionAttempts.length > 0 ? "execution-failures" : "no-candidates",
        passTurnError: passResult.error,
        passTurnErrorCode: passResult.errorCode,
      };
      finalResult = adapter.createNoopResult();
    }
  }

  const result = {
    actorId,
    blocked,
    diagnostics: enumeration.diagnostics,
    executionAttempts,
    fallbackTaken,
    finalResult,
    orderedCandidates: enumeration.candidates,
    selectedCandidate,
    unsupportedSkips: enumeration.unsupportedSkips,
    validationSkips: enumeration.validationSkips,
  };

  options.traceSink?.push(
    createTraceFromPlan({
      blocked,
      executionAttempts,
      fallbackTaken,
      finalResult,
      kind: "execution",
      plan,
      selectedCandidate,
    }),
  );

  return result;
}
