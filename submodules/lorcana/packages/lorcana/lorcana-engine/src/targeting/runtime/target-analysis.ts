import { getLogger } from "@logtape/logtape";
import type { CardInstanceId, MoveInput, PlayerId, RuntimeValidationResult } from "#core";
import type { LorcanaCard, LorcanaCardTarget, LorcanaTargetDSL } from "@tcg/lorcana-types";
import type { MoveEnumerationContext, MoveValidationContext } from "#core";
import type { LorcanaG } from "../../types";
import type { DynamicAmountEventSnapshot } from "../../types/domain-events";
import { hasKeyword } from "../../card-utils";
import { normalizeTargetDescriptor, resolveCandidateTargets } from "./target-resolver";
import type { TargetDescriptor } from "./target-resolver";
import { flattenSlottedTargets, isSlottedTargetInput } from "../slotted-targets";

type DiscardTargetSourceZone = "deck" | "hand" | "play" | "discard" | "inkwell";
type ActionSelectionZone = "deck" | "hand" | "play" | "discard" | "inkwell" | "limbo";

type RemoveDamageTargetDescriptor = {
  owner: "you" | "opponent" | "any";
  cardTypes?: readonly string[];
  filter?: TargetDescriptor["filter"];
  filters?: TargetDescriptor["filters"];
  excludeSelf?: boolean;
};

type ReturnToHandTargetDescriptor = {
  owner: "you" | "opponent" | "any";
  cardTypes?: readonly string[];
  filter?: TargetDescriptor["filter"];
  filters?: TargetDescriptor["filters"];
  excludeSelf?: boolean;
};

type ReturnFromDiscardTargetDescriptor = {
  owner: "you" | "opponent" | "any";
  count: number;
  actionSubtypes?: readonly string[];
  cardName?: string;
  cardTypes?: readonly string[];
  filter?: {
    maxCost?: number;
    classification?: string;
    keyword?: string;
  };
  excludeSelf?: boolean;
};

type DiscardTargetDescriptor = {
  owner: "you" | "opponent" | "any";
  sourceZone: DiscardTargetSourceZone;
  minAmount: number;
  maxAmount: number;
  filter?: {
    cardType?: string;
    notCardType?: string;
    maxCost?: number;
    classification?: string;
  };
};

type PlayCardSelectionDescriptor = {
  owner: "you" | "opponent" | "any";
  sourceZone: "deck" | "hand" | "discard" | "inkwell";
  sourceZones?: readonly ("deck" | "hand" | "discard" | "inkwell")[];
  cardType?: LorcanaCard["cardType"] | "song" | "floodborn";
  filter?: {
    cardType?: LorcanaCard["cardType"] | "song" | "floodborn";
    maxCost?: number;
    classification?: string;
    name?: string;
    sameNameAsSource?: boolean;
    sameNameAsChosenCard?: boolean;
  };
};

type ActionTargetCardDefinition = {
  actionSubtype?: string | null;
  cardType?: string;
  name?: string;
  classifications?: string[];
  cost?: number;
};

function isTargetOwner(value: unknown): value is "you" | "opponent" | "any" {
  return value === "you" || value === "opponent" || value === "any";
}

type ActionTargetRuntimeContext = Pick<
  MoveValidationContext<MoveInput> | MoveEnumerationContext,
  "framework" | "cards"
> & {
  args?: unknown;
};

type TargetAnalysisOptions = {
  includeDeferredChosenSelections?: boolean;
  /**
   * Event snapshot for the trigger/context in which this effect is being
   * resolved. Required for `excludeTriggerSubject: true` descriptors to filter
   * the correct card out of the candidate pool (e.g. the challenge defender on
   * a `deal-damage` trigger). When omitted, descriptors relying on
   * trigger-subject exclusion silently fall through, leaving the subject as a
   * legal candidate.
   */
  eventSnapshot?: DynamicAmountEventSnapshot;
};

export type TargetAnalysis = {
  targetDsl: LorcanaTargetDSL[];
  cardCandidates: CardInstanceId[];
  playerCandidates: PlayerId[];
  allowedZones: ActionSelectionZone[];
  minSelections: number;
  maxSelections: number;
  /**
   * The printed maximum from the card descriptor (e.g. `upTo: 2`) before
   * clamping to the current candidate count. Shown in UI copy so "up to N"
   * prompts always reflect the card text, even when fewer candidates exist.
   * Optional for test fixtures — production paths in `analyzeEffectTargets`
   * always populate it; callers that omit it fall back to `maxSelections`.
   */
  declaredMaxSelections?: number;
  requiresExplicitSelection: boolean;
  allowsDeferredResolutionWithoutInitialSelection: boolean;
  // True when the effect has multiple independent "chosen" descriptors (e.g. a sequence with two
  // separate "chosen" steps). In that case the same card may appear more than once in the target
  // list because each slot is an independent selection (Lorcana rule 6.1.3).
  allowDuplicateTargets: boolean;
};

export type NormalizedTargetSelection = {
  cardIds: CardInstanceId[];
  playerIds: PlayerId[];
};

type TargetValidationSuccess = {
  valid: true;
  selection: NormalizedTargetSelection;
};

type TargetValidationFailure = Extract<RuntimeValidationResult, { valid: false }>;

type TargetValidationResult = TargetValidationSuccess | TargetValidationFailure;
type TargetSelectionRestrictionContext = {
  currentPlayer: PlayerId;
  ctx: ActionTargetRuntimeContext;
};

const logger = getLogger(["lorcana-engine", "target-analysis"]);

function getCardDefinition(
  ctx: ActionTargetRuntimeContext,
  cardId: string,
): LorcanaCard | undefined {
  const definition = ctx.cards.getDefinition(cardId) as LorcanaCard | undefined;
  if (definition) {
    return definition;
  }

  const cardsApi = ctx.cards as {
    require?: (cardId: string) => { definition?: LorcanaCard };
  };

  try {
    return cardsApi.require?.(cardId)?.definition;
  } catch {
    return undefined;
  }
}

function getCardZone(ctx: ActionTargetRuntimeContext, cardId: CardInstanceId): string | undefined {
  const zoneKey = ctx.framework.state._zonesPrivate?.cardIndex?.[cardId]?.zoneKey;
  if (typeof zoneKey !== "string") {
    return undefined;
  }

  return zoneKey.split(":")[0];
}

function getCardControllerId(
  ctx: ActionTargetRuntimeContext,
  cardId: CardInstanceId,
): PlayerId | undefined {
  return ctx.framework.state._zonesPrivate?.cardIndex?.[cardId]?.controllerID as
    | PlayerId
    | undefined;
}

function getForcedEffectTargetCandidates(args: {
  analysis: TargetAnalysis;
  context: TargetSelectionRestrictionContext;
}): Map<PlayerId, Set<CardInstanceId>> {
  const { analysis, context } = args;
  const forcedTargetsByController = new Map<PlayerId, Set<CardInstanceId>>();

  for (const candidateId of analysis.cardCandidates) {
    if (getCardZone(context.ctx, candidateId) !== "play") {
      continue;
    }

    const candidateDefinition = getCardDefinition(context.ctx, candidateId);
    if (candidateDefinition?.cardType !== "character") {
      continue;
    }

    const controllerId = getCardControllerId(context.ctx, candidateId);
    if (!controllerId || controllerId === context.currentPlayer) {
      continue;
    }

    const hasDoYourWorstRestriction = (candidateDefinition.abilities ?? []).some(
      (ability) =>
        ability.type === "static" &&
        ability.effect.type === "restriction" &&
        ability.effect.target === "SELF" &&
        ability.effect.restriction === "must-be-chosen-for-effects",
    );
    if (!hasDoYourWorstRestriction) {
      continue;
    }

    const forcedTargets = forcedTargetsByController.get(controllerId) ?? new Set<CardInstanceId>();
    forcedTargets.add(candidateId);
    forcedTargetsByController.set(controllerId, forcedTargets);
  }

  return forcedTargetsByController;
}

function validateForcedEffectTargetSelection(args: {
  analysis: TargetAnalysis;
  selection: NormalizedTargetSelection;
  context?: TargetSelectionRestrictionContext;
}): TargetValidationFailure | undefined {
  const { analysis, selection, context } = args;
  if (!context || selection.cardIds.length === 0 || analysis.cardCandidates.length === 0) {
    return undefined;
  }

  const forcedTargetsByController = getForcedEffectTargetCandidates({
    analysis,
    context,
  });
  if (forcedTargetsByController.size === 0) {
    return undefined;
  }

  for (const selectedCardId of selection.cardIds) {
    if (getCardZone(context.ctx, selectedCardId) !== "play") {
      continue;
    }

    const selectedDefinition = getCardDefinition(context.ctx, selectedCardId);
    if (selectedDefinition?.cardType !== "character") {
      continue;
    }

    const controllerId = getCardControllerId(context.ctx, selectedCardId);
    if (!controllerId) {
      continue;
    }

    const forcedTargets = forcedTargetsByController.get(controllerId);
    if (!forcedTargets || forcedTargets.has(selectedCardId)) {
      continue;
    }

    return {
      valid: false,
      error: "A different character must be chosen for this action or ability if able",
      errorCode: "TARGET_DO_YOUR_WORST_RESTRICTION",
    };
  }

  return undefined;
}

function normalizeTargetOwner(target: unknown): "you" | "opponent" | "any" {
  if (target && typeof target === "object" && !Array.isArray(target)) {
    const owner = (target as Record<string, unknown>).owner;
    if (isTargetOwner(owner)) {
      return owner;
    }
  }

  switch (target) {
    case "OPPONENT":
    case "OPPONENTS":
    case "EACH_OPPONENT":
    // CHALLENGING_PLAYER is always the opponent of the triggered ability's controller
    // (the challenged card's controller). From the perspective of target candidate
    // generation, cards in the challenging player's hand belong to the opponent.
    case "CHALLENGING_PLAYER":
      return "opponent";
    case "EACH_PLAYER":
    case "ALL_PLAYERS":
      return "any";
    case "CONTROLLER":
    case "CURRENT_TURN":
    default:
      return "you";
  }
}

function appendTargetFilter(target: LorcanaCardTarget, filter: unknown): LorcanaCardTarget {
  if (!filter || typeof filter !== "object" || Array.isArray(filter)) {
    return target;
  }

  const normalizedFilters = Array.isArray(target.filters) ? [...target.filters] : [];
  normalizedFilters.push(filter as NonNullable<LorcanaCardTarget["filters"]>[number]);
  return {
    ...target,
    filters: normalizedFilters,
  };
}

function canonicalizeTargetSignatureValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => canonicalizeTargetSignatureValue(entry));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const record = value as Record<string, unknown>;
  const canonicalRecord: Record<string, unknown> = {};
  for (const key of Object.keys(record).sort()) {
    const entry = record[key];
    if (entry === undefined || entry === false) {
      continue;
    }
    canonicalRecord[key] = canonicalizeTargetSignatureValue(entry);
  }

  return canonicalRecord;
}

function dedupeChosenCardTargetDescriptors(
  descriptors: readonly LorcanaCardTarget[],
): LorcanaCardTarget[] {
  const uniqueDescriptors = new Map<string, LorcanaCardTarget>();

  for (const descriptor of descriptors) {
    const signature = JSON.stringify(canonicalizeTargetSignatureValue(descriptor));
    if (!uniqueDescriptors.has(signature)) {
      uniqueDescriptors.set(signature, descriptor);
    }
  }

  return [...uniqueDescriptors.values()];
}

function buildReturnFromDiscardTargetDsl(
  descriptor: ReturnFromDiscardTargetDescriptor,
): LorcanaCardTarget {
  let target: LorcanaCardTarget = {
    selector: "chosen",
    count: 1,
    owner: descriptor.owner,
    zones: ["discard"],
    cardTypes: descriptor.cardTypes ? [...descriptor.cardTypes] : undefined,
  };

  if (descriptor.cardName) {
    target = appendTargetFilter(target, {
      type: "name",
      name: descriptor.cardName,
    });
  }
  if (descriptor.filter?.maxCost !== undefined) {
    target = appendTargetFilter(target, {
      type: "cost",
      comparison: "lte",
      value: descriptor.filter.maxCost,
    });
  }
  if (descriptor.filter?.classification) {
    target = appendTargetFilter(target, {
      type: "classification",
      classification: descriptor.filter.classification,
    });
  }
  if (descriptor.filter?.keyword) {
    target = appendTargetFilter(target, {
      type: "keyword",
      keyword: descriptor.filter.keyword,
    });
  }

  return target;
}

function buildDiscardTargetDsl(descriptor: DiscardTargetDescriptor): LorcanaCardTarget {
  let target: LorcanaCardTarget = {
    selector: "chosen",
    count:
      descriptor.minAmount === descriptor.maxAmount
        ? descriptor.minAmount
        : { between: [descriptor.minAmount, descriptor.maxAmount] },
    owner: descriptor.owner,
    zones: [descriptor.sourceZone],
  };

  if (descriptor.filter?.cardType) {
    target = {
      ...target,
      cardType: descriptor.filter.cardType as LorcanaCardTarget["cardType"],
    };
  }
  if (descriptor.filter?.notCardType) {
    target = appendTargetFilter(target, {
      type: "card-type",
      cardType: descriptor.filter.notCardType,
      comparison: "ne",
    });
  }
  if (descriptor.filter?.maxCost !== undefined) {
    target = appendTargetFilter(target, {
      type: "cost",
      comparison: "lte",
      value: descriptor.filter.maxCost,
    });
  }
  if (descriptor.filter?.classification) {
    target = appendTargetFilter(target, {
      type: "classification",
      classification: descriptor.filter.classification,
    });
  }

  return target;
}

function buildPlayCardSelectionTargetDsl(
  descriptor: PlayCardSelectionDescriptor,
): LorcanaCardTarget {
  const zones = descriptor.sourceZones ?? [descriptor.sourceZone];
  let target: LorcanaCardTarget = {
    selector: "chosen",
    count: 1,
    owner: descriptor.owner,
    zones: zones as LorcanaCardTarget["zones"],
  };

  const cardType = descriptor.cardType ?? descriptor.filter?.cardType;
  if (cardType && cardType !== "song" && cardType !== "floodborn") {
    target = {
      ...target,
      cardType: cardType as LorcanaCardTarget["cardType"],
    };
  }
  if (cardType === "song") {
    target = {
      ...target,
      cardType: "action",
    };
    target = appendTargetFilter(target, {
      type: "subtype",
      subtype: "song",
    });
  }
  if (cardType === "floodborn") {
    target = appendTargetFilter(target, {
      type: "floodborn",
      value: true,
    });
  }
  if (descriptor.filter?.maxCost !== undefined) {
    target = appendTargetFilter(target, {
      type: "cost",
      comparison: "lte",
      value: descriptor.filter.maxCost,
    });
  }
  if (descriptor.filter?.classification) {
    target = appendTargetFilter(target, {
      type: "classification",
      classification: descriptor.filter.classification,
    });
  }
  if (descriptor.filter?.name) {
    target = appendTargetFilter(target, {
      type: "name",
      name: descriptor.filter.name,
    });
  }

  return target;
}

function normalizeMoveDamageParticipantOwner(target: unknown): "you" | "opponent" | "any" {
  if (target === "CHOSEN_OPPOSING_CHARACTER" || target === "CHOSEN_OPPONENT_CHARACTER") {
    return "opponent";
  }
  if (typeof target === "string" && target.startsWith("CHOSEN_")) {
    return "any";
  }
  return normalizeTargetOwner(target);
}

function collectRemoveDamageTargetDescriptors(effect: unknown): RemoveDamageTargetDescriptor[] {
  if (!effect || typeof effect !== "object") {
    return [];
  }

  const effectRecord = effect as Record<string, unknown>;
  if (effectRecord.type === "remove-damage") {
    const targetRecord =
      effectRecord.target && typeof effectRecord.target === "object"
        ? (effectRecord.target as Record<string, unknown>)
        : undefined;
    return [
      {
        owner: normalizeTargetOwner(effectRecord.target),
        cardTypes: ["character", "location"],
        filter: targetRecord?.filter,
        filters: targetRecord?.filters,
      },
    ];
  }

  if (effectRecord.type === "move-damage") {
    // When move-damage has one endpoint fixed to SELF and the other endpoint
    // is a chosen target, the SELF endpoint is not a picker — it is fixed to
    // the source card. The chosen-side picker must also exclude SELF, since
    // moving damage from/to the same card is a no-op the resolver silently
    // skips (would surface in the UI as an unconfirmable picker). See triage
    // 2026-05-11 #13 (Luisa Madrigal — Confident Climber).
    //
    // Edge case (both endpoints SELF): no chooser candidates contributed at
    // all. Intentional — no card prints "move damage from this character to
    // this character" because the result is always a no-op. If a future
    // card does, the resolver's source-equals-destination guard already
    // produces a clean no-op execution, so leaving the candidate list empty
    // here is safe: the bag/pending-effect drains without prompting.
    const fromIsSelf = effectRecord.from === "SELF";
    const toIsSelf = effectRecord.to === "SELF";
    const fromRecord =
      effectRecord.from && typeof effectRecord.from === "object"
        ? (effectRecord.from as Record<string, unknown>)
        : undefined;
    const toRecord =
      effectRecord.to && typeof effectRecord.to === "object"
        ? (effectRecord.to as Record<string, unknown>)
        : undefined;
    const descriptors: RemoveDamageTargetDescriptor[] = [];
    if (effectRecord.from !== undefined && !fromIsSelf) {
      descriptors.push({
        owner: normalizeMoveDamageParticipantOwner(effectRecord.from),
        cardTypes: ["character"],
        filter: fromRecord?.filter,
        filters: fromRecord?.filters,
        ...(fromRecord?.excludeSelf === true || toIsSelf ? { excludeSelf: true } : {}),
      });
    }
    if (effectRecord.to !== undefined && !toIsSelf) {
      descriptors.push({
        owner: normalizeMoveDamageParticipantOwner(effectRecord.to),
        cardTypes: ["character"],
        filter: toRecord?.filter,
        filters: toRecord?.filters,
        ...(toRecord?.excludeSelf === true || fromIsSelf ? { excludeSelf: true } : {}),
      });
    }
    return descriptors;
  }

  const nestedEffects = [
    effectRecord.effect,
    ...(Array.isArray(effectRecord.effects) ? effectRecord.effects : []),
    ...(Array.isArray(effectRecord.steps) ? effectRecord.steps : []),
    ...(Array.isArray(effectRecord.options) ? effectRecord.options : []),
    ...(Array.isArray(effectRecord.choices) ? effectRecord.choices : []),
    effectRecord.trueEffect,
    effectRecord.falseEffect,
    effectRecord.ifTrue,
    effectRecord.ifFalse,
    effectRecord.then,
    effectRecord.else,
  ];

  return nestedEffects.flatMap((nestedEffect) =>
    collectRemoveDamageTargetDescriptors(nestedEffect),
  );
}

function collectReturnToHandTargetDescriptors(effect: unknown): ReturnToHandTargetDescriptor[] {
  if (!effect || typeof effect !== "object") {
    return [];
  }

  const effectRecord = effect as Record<string, unknown>;
  if (effectRecord.type === "return-to-hand") {
    const normalizedTarget = normalizeTargetDescriptor(effectRecord.target);
    return normalizedTarget
      ? [
          {
            owner: (normalizedTarget.owner ?? "any") as "you" | "opponent" | "any",
            cardTypes: normalizedTarget.cardTypes,
            filter: normalizedTarget.filter,
            filters: normalizedTarget.filters,
            excludeSelf: normalizedTarget.excludeSelf,
          },
        ]
      : [];
  }

  const nestedEffects = [
    effectRecord.effect,
    ...(Array.isArray(effectRecord.effects) ? effectRecord.effects : []),
    ...(Array.isArray(effectRecord.steps) ? effectRecord.steps : []),
    ...(Array.isArray(effectRecord.options) ? effectRecord.options : []),
    ...(Array.isArray(effectRecord.choices) ? effectRecord.choices : []),
    effectRecord.trueEffect,
    effectRecord.falseEffect,
    effectRecord.ifTrue,
    effectRecord.ifFalse,
    effectRecord.then,
    effectRecord.else,
  ];

  return nestedEffects.flatMap((nestedEffect) =>
    collectReturnToHandTargetDescriptors(nestedEffect),
  );
}

function normalizeReturnFromDiscardTargetDescriptor(
  effect: Record<string, unknown>,
): ReturnFromDiscardTargetDescriptor | undefined {
  const owner = normalizeTargetOwner(effect.target);
  const count =
    typeof effect.count === "number" && Number.isFinite(effect.count) && effect.count > 0
      ? effect.count
      : 1;
  const rawFilter =
    effect.filter && typeof effect.filter === "object" && !Array.isArray(effect.filter)
      ? (effect.filter as Record<string, unknown>)
      : undefined;
  const cardName =
    typeof effect.cardName === "string"
      ? effect.cardName
      : typeof rawFilter?.name === "string"
        ? rawFilter.name
        : undefined;
  const cardType = typeof rawFilter?.cardType === "string" ? rawFilter.cardType : effect.cardType;

  if (cardType !== undefined && typeof cardType !== "string") {
    return undefined;
  }

  const maxCost =
    typeof rawFilter?.maxCost === "number" && Number.isFinite(rawFilter.maxCost)
      ? rawFilter.maxCost
      : undefined;
  const classification =
    typeof rawFilter?.classification === "string" ? rawFilter.classification : undefined;
  const keyword = typeof rawFilter?.keyword === "string" ? rawFilter.keyword : undefined;
  const excludeSelf = rawFilter?.type === "source" && rawFilter.ref === "other";

  if (cardType === "song") {
    return {
      owner,
      count,
      actionSubtypes: ["song"],
      cardName,
      cardTypes: ["action"],
      filter:
        maxCost !== undefined || classification !== undefined || keyword !== undefined
          ? { maxCost, classification, keyword }
          : undefined,
      excludeSelf,
    };
  }

  return {
    owner,
    count,
    cardName,
    cardTypes: typeof cardType === "string" ? [cardType] : undefined,
    filter:
      maxCost !== undefined || classification !== undefined || keyword !== undefined
        ? { maxCost, classification, keyword }
        : undefined,
    excludeSelf,
  };
}

function collectReturnFromDiscardTargetDescriptors(
  effect: unknown,
): ReturnFromDiscardTargetDescriptor[] {
  if (!effect || typeof effect !== "object") {
    return [];
  }

  const effectRecord = effect as Record<string, unknown>;
  if (effectRecord.type === "return-from-discard") {
    const descriptor = normalizeReturnFromDiscardTargetDescriptor(effectRecord);
    return descriptor ? [descriptor] : [];
  }

  if (
    effectRecord.type === "put-under" &&
    effectRecord.source === "discard" &&
    effectRecord.under === "self"
  ) {
    const cardType = typeof effectRecord.cardType === "string" ? effectRecord.cardType : undefined;
    const descriptor: ReturnFromDiscardTargetDescriptor = {
      owner: "you",
      count: 1,
      cardTypes: cardType ? [cardType] : undefined,
    };
    return [descriptor];
  }

  const nestedEffects = [
    effectRecord.effect,
    ...(Array.isArray(effectRecord.effects) ? effectRecord.effects : []),
    ...(Array.isArray(effectRecord.steps) ? effectRecord.steps : []),
    ...(Array.isArray(effectRecord.options) ? effectRecord.options : []),
    ...(Array.isArray(effectRecord.choices) ? effectRecord.choices : []),
    effectRecord.trueEffect,
    effectRecord.falseEffect,
    effectRecord.ifTrue,
    effectRecord.ifFalse,
    effectRecord.then,
    effectRecord.else,
  ];

  return nestedEffects.flatMap((nestedEffect) =>
    collectReturnFromDiscardTargetDescriptors(nestedEffect),
  );
}

function normalizeDiscardTargetSourceZone(value: unknown): DiscardTargetSourceZone {
  switch (value) {
    case "deck":
    case "hand":
    case "play":
    case "discard":
    case "inkwell":
      return value;
    default:
      return "hand";
  }
}

function normalizeDiscardTargetDescriptor(
  effect: Record<string, unknown>,
): DiscardTargetDescriptor {
  const owner = normalizeTargetOwner(effect.target);
  const sourceZone = normalizeDiscardTargetSourceZone(effect.from);
  const isComputedAmount =
    effect.amount !== null && typeof effect.amount === "object" && !Array.isArray(effect.amount);
  const amount = isComputedAmount
    ? 1 // placeholder; actual value resolved at execution time
    : typeof effect.amount === "number" && Number.isFinite(effect.amount) && effect.amount > 0
      ? Math.floor(effect.amount)
      : 1;
  const anyNumberChosen = effect.chosen === true && effect.amount === "DISCARDED_COUNT";

  const rawFilter =
    effect.filter && typeof effect.filter === "object" && !Array.isArray(effect.filter)
      ? (effect.filter as Record<string, unknown>)
      : undefined;
  const normalizedFilter = rawFilter
    ? {
        cardType: typeof rawFilter.cardType === "string" ? rawFilter.cardType : undefined,
        notCardType: typeof rawFilter.notCardType === "string" ? rawFilter.notCardType : undefined,
        maxCost:
          typeof rawFilter.maxCost === "number" && Number.isFinite(rawFilter.maxCost)
            ? rawFilter.maxCost
            : undefined,
        classification:
          typeof rawFilter.classification === "string" ? rawFilter.classification : undefined,
      }
    : undefined;

  return {
    owner,
    sourceZone,
    minAmount: anyNumberChosen || isComputedAmount ? 0 : amount,
    maxAmount: anyNumberChosen || isComputedAmount ? Number.MAX_SAFE_INTEGER : amount,
    ...(normalizedFilter ? { filter: normalizedFilter } : {}),
  };
}

function collectDiscardTargetDescriptors(effect: unknown): DiscardTargetDescriptor[] {
  if (!effect || typeof effect !== "object") {
    return [];
  }

  const effectRecord = effect as Record<string, unknown>;
  if (effectRecord.type === "discard") {
    // Random discards do not require explicit player selection — skip them.
    if (effectRecord.random === true) {
      return [];
    }
    // "Discard all" automatically discards every matching card — no explicit
    // target selection is needed from the player.
    if (effectRecord.amount === "all") {
      return [];
    }
    return [normalizeDiscardTargetDescriptor(effectRecord)];
  }

  const nestedEffects = [
    effectRecord.effect,
    ...(Array.isArray(effectRecord.effects) ? effectRecord.effects : []),
    ...(Array.isArray(effectRecord.steps) ? effectRecord.steps : []),
    ...(Array.isArray(effectRecord.options) ? effectRecord.options : []),
    ...(Array.isArray(effectRecord.choices) ? effectRecord.choices : []),
    effectRecord.trueEffect,
    effectRecord.falseEffect,
    effectRecord.ifTrue,
    effectRecord.ifFalse,
    effectRecord.then,
    effectRecord.else,
  ];

  return nestedEffects.flatMap((nestedEffect) => collectDiscardTargetDescriptors(nestedEffect));
}

function collectInkwellSourceTargetDescriptors(effect: unknown): DiscardTargetDescriptor[] {
  if (!effect || typeof effect !== "object") {
    return [];
  }

  const effectRecord = effect as Record<string, unknown>;
  if (effectRecord.type === "put-into-inkwell") {
    const source = effectRecord.source;
    if (source === "hand" || source === "discard" || source === "deck") {
      return [
        {
          owner:
            effectRecord.target === "CHOSEN_PLAYER"
              ? "any"
              : normalizeTargetOwner(effectRecord.target),
          sourceZone: source,
          minAmount: 1,
          maxAmount: 1,
          filter:
            typeof effectRecord.cardType === "string"
              ? { cardType: effectRecord.cardType }
              : undefined,
        },
      ];
    }
  }

  const nestedEffects = [
    effectRecord.effect,
    ...(Array.isArray(effectRecord.effects) ? effectRecord.effects : []),
    ...(Array.isArray(effectRecord.steps) ? effectRecord.steps : []),
    ...(Array.isArray(effectRecord.options) ? effectRecord.options : []),
    ...(Array.isArray(effectRecord.choices) ? effectRecord.choices : []),
    effectRecord.trueEffect,
    effectRecord.falseEffect,
    effectRecord.ifTrue,
    effectRecord.ifFalse,
    effectRecord.then,
    effectRecord.else,
  ];

  return nestedEffects.flatMap((nestedEffect) =>
    collectInkwellSourceTargetDescriptors(nestedEffect),
  );
}

function normalizePlayCardSelectionDescriptor(
  effect: unknown,
): PlayCardSelectionDescriptor | undefined {
  if (!effect || typeof effect !== "object" || Array.isArray(effect)) {
    return undefined;
  }

  const effectRecord = effect as Record<string, unknown>;
  if (effectRecord.type !== "play-card") {
    return undefined;
  }

  const from = effectRecord.from;
  const validSingleZones = ["deck", "hand", "discard", "inkwell"] as const;
  type SingleZone = (typeof validSingleZones)[number];

  let sourceZone: SingleZone | undefined;
  let sourceZones: readonly SingleZone[] | undefined;

  if (Array.isArray(from)) {
    const normalizedZones = from.filter((z): z is SingleZone =>
      (validSingleZones as readonly unknown[]).includes(z),
    );
    if (normalizedZones.length === 0) {
      return undefined;
    }
    sourceZones = normalizedZones;
    sourceZone = normalizedZones[0];
  } else if (from === "deck" || from === "hand" || from === "discard" || from === "inkwell") {
    sourceZone = from;
  } else {
    return undefined;
  }

  const target = effectRecord.target;
  const owner =
    target === "OPPONENT" || target === "EACH_OPPONENT"
      ? "opponent"
      : target === "CHOSEN_PLAYER" || target === "EACH_PLAYER" || target === "ALL_PLAYERS"
        ? "any"
        : "you";
  const filter =
    effectRecord.filter &&
    typeof effectRecord.filter === "object" &&
    !Array.isArray(effectRecord.filter)
      ? (effectRecord.filter as PlayCardSelectionDescriptor["filter"])
      : undefined;
  const cardType =
    effectRecord.cardType === "character" ||
    effectRecord.cardType === "item" ||
    effectRecord.cardType === "location" ||
    effectRecord.cardType === "action" ||
    effectRecord.cardType === "song" ||
    effectRecord.cardType === "floodborn"
      ? (effectRecord.cardType as PlayCardSelectionDescriptor["cardType"])
      : undefined;

  return {
    owner,
    sourceZone,
    ...(sourceZones ? { sourceZones } : {}),
    cardType,
    filter,
  };
}

/**
 * Returns true if the effect (or any nested effect) is a play-card effect that uses the
 * "shift" or "either" play method, requiring a secondary in-play shift-target selection.
 * For "either" the descriptor is injected as optional so a hand-only selection is also legal.
 */
function hasPlayCardShiftMethod(effect: unknown): boolean {
  if (!effect || typeof effect !== "object" || Array.isArray(effect)) {
    return false;
  }
  const effectRecord = effect as Record<string, unknown>;
  if (
    effectRecord.type === "play-card" &&
    (effectRecord.playMethod === "shift" || effectRecord.playMethod === "either")
  ) {
    return true;
  }
  const nestedEffects: unknown[] = [
    effectRecord.effect,
    ...(Array.isArray(effectRecord.options) ? effectRecord.options : []),
    ...(Array.isArray(effectRecord.choices) ? effectRecord.choices : []),
    ...(Array.isArray(effectRecord.effects) ? effectRecord.effects : []),
    ...(Array.isArray(effectRecord.steps) ? effectRecord.steps : []),
    effectRecord.trueEffect,
    effectRecord.falseEffect,
    effectRecord.ifTrue,
    effectRecord.ifFalse,
    effectRecord.then,
    effectRecord.else,
  ];
  return nestedEffects.some((nested) => hasPlayCardShiftMethod(nested));
}

/**
 * Returns true if the effect (or any nested effect) is a play-card effect that uses the
 * "either" play method (player chooses standard or shift at resolution time).
 */
function hasPlayCardEitherMethod(effect: unknown): boolean {
  if (!effect || typeof effect !== "object" || Array.isArray(effect)) {
    return false;
  }
  const effectRecord = effect as Record<string, unknown>;
  if (effectRecord.type === "play-card" && effectRecord.playMethod === "either") {
    return true;
  }
  const nestedEffects: unknown[] = [
    effectRecord.effect,
    ...(Array.isArray(effectRecord.options) ? effectRecord.options : []),
    ...(Array.isArray(effectRecord.choices) ? effectRecord.choices : []),
    ...(Array.isArray(effectRecord.effects) ? effectRecord.effects : []),
    ...(Array.isArray(effectRecord.steps) ? effectRecord.steps : []),
    effectRecord.trueEffect,
    effectRecord.falseEffect,
    effectRecord.ifTrue,
    effectRecord.ifFalse,
    effectRecord.then,
    effectRecord.else,
  ];
  return nestedEffects.some((nested) => hasPlayCardEitherMethod(nested));
}

function collectPlayCardSelectionDescriptors(effect: unknown): PlayCardSelectionDescriptor[] {
  if (!effect || typeof effect !== "object") {
    return [];
  }

  const effectRecord = effect as Record<string, unknown>;
  const normalized = normalizePlayCardSelectionDescriptor(effect);
  const nestedEffects = [
    effectRecord.effect,
    ...(Array.isArray(effectRecord.options) ? effectRecord.options : []),
    ...(Array.isArray(effectRecord.choices) ? effectRecord.choices : []),
    ...(Array.isArray(effectRecord.effects) ? effectRecord.effects : []),
    ...(Array.isArray(effectRecord.steps) ? effectRecord.steps : []),
    effectRecord.trueEffect,
    effectRecord.falseEffect,
    effectRecord.ifTrue,
    effectRecord.ifFalse,
    effectRecord.then,
    effectRecord.else,
  ];

  return [
    ...(normalized ? [normalized] : []),
    ...nestedEffects.flatMap((nestedEffect) => collectPlayCardSelectionDescriptors(nestedEffect)),
  ];
}

function collectChosenCardTargetDescriptors(
  effect: unknown,
  options?: TargetAnalysisOptions,
): LorcanaCardTarget[] {
  if (!effect || typeof effect !== "object") {
    return [];
  }

  const effectRecord = effect as Record<string, unknown>;
  const descriptors: LorcanaCardTarget[] = [];
  const defersTargetSelection =
    options?.includeDeferredChosenSelections === true
      ? false
      : effectRecord.chosenBy === "opponent" || effectRecord.chosenBy === "TARGET";
  const normalizedTarget =
    effectRecord.target === "chosen-for-effect" ||
    (typeof effectRecord.target === "object" &&
      effectRecord.target !== null &&
      ("ref" in effectRecord.target || "reference" in effectRecord.target))
      ? undefined
      : normalizeTargetDescriptor(effectRecord.target);
  if (!defersTargetSelection && normalizedTarget?.selector === "chosen") {
    descriptors.push(normalizedTarget as LorcanaCardTarget);
  }
  const moveCharacterTarget =
    typeof effectRecord.character === "object" &&
    effectRecord.character !== null &&
    ("ref" in effectRecord.character || "reference" in effectRecord.character)
      ? undefined
      : normalizeTargetDescriptor(effectRecord.character);
  if (moveCharacterTarget?.selector === "chosen") {
    descriptors.push(moveCharacterTarget as LorcanaCardTarget);
  }
  const moveLocationTarget =
    typeof effectRecord.location === "object" &&
    effectRecord.location !== null &&
    ("ref" in effectRecord.location || "reference" in effectRecord.location)
      ? undefined
      : normalizeTargetDescriptor(effectRecord.location);
  if (moveLocationTarget?.selector === "chosen") {
    descriptors.push(moveLocationTarget as LorcanaCardTarget);
  }
  // For move-damage, when one endpoint is SELF, the other endpoint must
  // exclude the source card from its candidate pool. Otherwise the picker
  // surfaces the source card itself as a chosen candidate but selecting it
  // produces a no-op (the resolver skips `source === destination`), leaving
  // the player unable to confirm a meaningful selection. See triage
  // 2026-05-11 #13 (Luisa Madrigal — Confident Climber).
  const isMoveDamage = effectRecord.type === "move-damage";
  const moveDamageToIsSelf = isMoveDamage && effectRecord.to === "SELF";
  const moveDamageFromIsSelf = isMoveDamage && effectRecord.from === "SELF";
  const moveDamageSourceTarget =
    typeof effectRecord.from === "object" &&
    effectRecord.from !== null &&
    ("ref" in effectRecord.from || "reference" in effectRecord.from)
      ? undefined
      : normalizeTargetDescriptor(effectRecord.from);
  if (moveDamageSourceTarget?.selector === "chosen") {
    const finalSourceTarget = moveDamageToIsSelf
      ? ({ ...moveDamageSourceTarget, excludeSelf: true } as LorcanaCardTarget)
      : (moveDamageSourceTarget as LorcanaCardTarget);
    descriptors.push(finalSourceTarget);
  }
  const moveDamageDestinationTarget =
    typeof effectRecord.to === "object" &&
    effectRecord.to !== null &&
    ("ref" in effectRecord.to || "reference" in effectRecord.to)
      ? undefined
      : normalizeTargetDescriptor(effectRecord.to);
  if (moveDamageDestinationTarget?.selector === "chosen") {
    const finalDestinationTarget = moveDamageFromIsSelf
      ? ({ ...moveDamageDestinationTarget, excludeSelf: true } as LorcanaCardTarget)
      : (moveDamageDestinationTarget as LorcanaCardTarget);
    descriptors.push(finalDestinationTarget);
  }
  const sourceTarget =
    typeof effectRecord.source === "object" &&
    effectRecord.source !== null &&
    ("ref" in effectRecord.source || "reference" in effectRecord.source)
      ? undefined
      : normalizeTargetDescriptor(effectRecord.source);
  if (sourceTarget?.selector === "chosen") {
    descriptors.push(sourceTarget as LorcanaCardTarget);
  }
  const putUnderTarget =
    typeof effectRecord.under === "object" &&
    effectRecord.under !== null &&
    ("ref" in effectRecord.under || "reference" in effectRecord.under)
      ? undefined
      : normalizeTargetDescriptor(effectRecord.under);
  if (putUnderTarget?.selector === "chosen") {
    descriptors.push(putUnderTarget as LorcanaCardTarget);
  }
  const underTarget =
    typeof effectRecord.underTarget === "object" &&
    effectRecord.underTarget !== null &&
    ("ref" in effectRecord.underTarget || "reference" in effectRecord.underTarget)
      ? undefined
      : normalizeTargetDescriptor(effectRecord.underTarget);
  if (underTarget?.selector === "chosen") {
    descriptors.push(underTarget as LorcanaCardTarget);
  }

  // Check amount.target for variable amounts that reference a chosen card
  // (e.g. lore-value-of, strength-of, willpower-of, cost-of with CHOSEN_* targets)
  const amount = effectRecord.amount;
  if (amount && typeof amount === "object" && !Array.isArray(amount)) {
    const amountRecord = amount as Record<string, unknown>;
    if (amountRecord.target !== undefined) {
      const amountTarget = normalizeTargetDescriptor(amountRecord.target);
      if (amountTarget?.selector === "chosen") {
        descriptors.push(amountTarget as LorcanaCardTarget);
      }
    }
  }

  const nestedEffects = [
    effectRecord.effect,
    ...(Array.isArray(effectRecord.effects) ? effectRecord.effects : []),
    ...(Array.isArray(effectRecord.steps) ? effectRecord.steps : []),
    ...(Array.isArray(effectRecord.options) ? effectRecord.options : []),
    ...(Array.isArray(effectRecord.choices) ? effectRecord.choices : []),
    effectRecord.trueEffect,
    effectRecord.falseEffect,
    effectRecord.ifTrue,
    effectRecord.ifFalse,
    effectRecord.then,
    effectRecord.else,
  ];

  return [
    ...descriptors,
    ...nestedEffects.flatMap((nestedEffect) =>
      collectChosenCardTargetDescriptors(nestedEffect, options),
    ),
  ];
}

function hasChosenPlayerTarget(effect: unknown): boolean {
  if (!effect || typeof effect !== "object") {
    return false;
  }

  const effectRecord = effect as Record<string, unknown>;
  if (effectRecord.target === "CHOSEN_PLAYER" || effectRecord.chooser === "CHOSEN_PLAYER") {
    return true;
  }

  const nestedCandidates = [
    effectRecord.effect,
    ...(Array.isArray(effectRecord.effects) ? effectRecord.effects : []),
    ...(Array.isArray(effectRecord.steps) ? effectRecord.steps : []),
    ...(Array.isArray(effectRecord.options) ? effectRecord.options : []),
    ...(Array.isArray(effectRecord.choices) ? effectRecord.choices : []),
    effectRecord.trueEffect,
    effectRecord.falseEffect,
    effectRecord.ifTrue,
    effectRecord.ifFalse,
    effectRecord.then,
    effectRecord.else,
  ];

  return nestedCandidates.some((candidate) => hasChosenPlayerTarget(candidate));
}

function resolveActionTargetCandidates(
  targetDescriptors: RemoveDamageTargetDescriptor[],
  playerId: PlayerId,
  ctx: ActionTargetRuntimeContext,
  sourceCardId?: CardInstanceId,
): CardInstanceId[] {
  if (targetDescriptors.length === 0) {
    return [];
  }

  const candidates = new Set<CardInstanceId>();
  for (const targetDescriptor of targetDescriptors) {
    const descriptor = normalizeTargetDescriptor({
      // `selector: "chosen"` so target-resolver applies the Ward (and other
      // chosen-target restriction) filter to opposing characters. These
      // descriptors back move-damage / remove-damage / return-to-hand prompts
      // where the chooser is picking a single character — Ward must exclude
      // opposing Ward'd cards from the candidate pool. Using "all" here would
      // leak Ward'd opposing chars into `cardCandidates`, the validation pass
      // would accept the selection, and the resolver would silently no-op when
      // the chosen-target path filters them out at execution time. Replay
      // mgPNpagigao72B9Hc9_xf2x turn 13 is the canonical repro: Belle's
      // ENHANCED HEALING accepted a Ward'd destination and applied no patches.
      selector: "chosen",
      count: "all",
      owner: targetDescriptor.owner,
      zones: ["play"],
      cardTypes: targetDescriptor.cardTypes,
      filter: targetDescriptor.filter,
      filters: targetDescriptor.filters,
      excludeSelf: targetDescriptor.excludeSelf,
    });
    const resolved = resolveCandidateTargets(ctx, descriptor, {
      controllerId: playerId,
      sourceCardId,
    });
    for (const cardId of resolved) {
      candidates.add(cardId as CardInstanceId);
    }
  }

  return [...candidates];
}

function resolveActionDiscardTargetCandidates(
  targetDescriptors: ReturnFromDiscardTargetDescriptor[],
  playerId: PlayerId,
  ctx: ActionTargetRuntimeContext,
  sourceCardId?: CardInstanceId,
): CardInstanceId[] {
  if (targetDescriptors.length === 0) {
    return [];
  }

  const candidates = new Set<CardInstanceId>();
  for (const targetDescriptor of targetDescriptors) {
    const descriptor = normalizeTargetDescriptor({
      selector: "all",
      count: "all",
      owner: targetDescriptor.owner,
      zones: ["discard"],
      cardTypes: targetDescriptor.cardTypes,
    });
    const resolved = resolveCandidateTargets(ctx, descriptor, {
      controllerId: playerId,
      extraPredicate: (cardId) => {
        if (targetDescriptor.excludeSelf === true && cardId === sourceCardId) {
          return false;
        }
        const definition = getCardDefinition(ctx, cardId) as ActionTargetCardDefinition | undefined;
        if (
          targetDescriptor.actionSubtypes?.length &&
          (!definition?.actionSubtype ||
            !targetDescriptor.actionSubtypes.includes(definition.actionSubtype))
        ) {
          return false;
        }
        if (targetDescriptor.cardName && definition?.name !== targetDescriptor.cardName) {
          return false;
        }
        if (
          targetDescriptor.filter?.maxCost !== undefined &&
          (typeof definition?.cost !== "number" ||
            definition.cost > targetDescriptor.filter.maxCost)
        ) {
          return false;
        }
        if (
          targetDescriptor.filter?.classification &&
          !definition?.classifications?.includes(targetDescriptor.filter.classification)
        ) {
          return false;
        }
        if (
          targetDescriptor.filter?.keyword &&
          (!definition || !hasKeyword(definition as LorcanaCard, targetDescriptor.filter.keyword))
        ) {
          return false;
        }
        return true;
      },
    });
    for (const cardId of resolved) {
      candidates.add(cardId as CardInstanceId);
    }
  }

  return [...candidates];
}

function resolveActionDiscardSelectionCandidates(
  targetDescriptors: DiscardTargetDescriptor[],
  playerId: PlayerId,
  playerIds: readonly PlayerId[],
  ctx: ActionTargetRuntimeContext,
  sourceCardId?: CardInstanceId,
): CardInstanceId[] {
  if (targetDescriptors.length === 0) {
    return [];
  }

  const candidates = new Set<CardInstanceId>();
  for (const targetDescriptor of targetDescriptors) {
    const owners =
      targetDescriptor.owner === "you"
        ? [playerId]
        : targetDescriptor.owner === "opponent"
          ? playerIds.filter((candidatePlayerId) => candidatePlayerId !== playerId)
          : [...playerIds];

    for (const ownerId of owners) {
      const sourceCards = ctx.framework.zones.getCards({
        zone: targetDescriptor.sourceZone,
        playerId: ownerId,
      }) as CardInstanceId[];
      for (const cardId of sourceCards) {
        if (targetDescriptor.sourceZone === "hand" && cardId === sourceCardId) {
          continue;
        }
        const definition = getCardDefinition(ctx, cardId) as
          | {
              cardType?: string;
              classifications?: string[];
              cost?: number;
            }
          | undefined;

        if (
          typeof targetDescriptor.filter?.cardType === "string" &&
          definition?.cardType !== targetDescriptor.filter.cardType
        ) {
          continue;
        }
        if (
          typeof targetDescriptor.filter?.notCardType === "string" &&
          definition?.cardType === targetDescriptor.filter.notCardType
        ) {
          continue;
        }
        if (typeof targetDescriptor.filter?.maxCost === "number") {
          const cost = Number(definition?.cost ?? 0);
          if (!Number.isFinite(cost) || cost > targetDescriptor.filter.maxCost) {
            continue;
          }
        }
        if (typeof targetDescriptor.filter?.classification === "string") {
          const classifications = definition?.classifications ?? [];
          if (!classifications.includes(targetDescriptor.filter.classification)) {
            continue;
          }
        }

        candidates.add(cardId as CardInstanceId);
      }
    }
  }

  return [...candidates];
}

function resolveActionChosenTargetCandidates(
  targetDescriptors: LorcanaCardTarget[],
  playerId: PlayerId,
  ctx: ActionTargetRuntimeContext,
  sourceCardId?: CardInstanceId,
  eventSnapshot?: DynamicAmountEventSnapshot,
): CardInstanceId[] {
  if (targetDescriptors.length === 0) {
    return [];
  }

  const candidates = new Set<CardInstanceId>();
  for (const descriptor of targetDescriptors) {
    const resolved = resolveCandidateTargets(ctx, descriptor, {
      controllerId: playerId,
      sourceCardId,
      eventSnapshot,
    });
    for (const cardId of resolved) {
      candidates.add(cardId as CardInstanceId);
    }
  }

  return [...candidates];
}

function matchesPlayCardSelectionTypeConstraint(
  definition: ActionTargetCardDefinition,
  expectedType: PlayCardSelectionDescriptor["cardType"] | undefined,
): boolean {
  if (!expectedType) {
    return true;
  }

  if (expectedType === "song") {
    return definition.cardType === "action" && definition.actionSubtype === "song";
  }

  if (expectedType === "floodborn") {
    return (definition.classifications ?? []).includes("Floodborn");
  }

  return definition.cardType === expectedType;
}

function matchesPlayCardSelectionCriteria(
  definition: ActionTargetCardDefinition,
  descriptor: PlayCardSelectionDescriptor,
  sourceDefinition?: ActionTargetCardDefinition,
  chosenDefinition?: ActionTargetCardDefinition,
): boolean {
  if (!matchesPlayCardSelectionTypeConstraint(definition, descriptor.cardType)) {
    return false;
  }

  const filter = descriptor.filter;
  if (!filter) {
    return true;
  }

  if (!matchesPlayCardSelectionTypeConstraint(definition, filter.cardType)) {
    return false;
  }

  if (typeof filter.maxCost === "number") {
    const cost = Number(definition.cost ?? Number.NaN);
    if (!Number.isFinite(cost) || cost > filter.maxCost) {
      return false;
    }
  }

  if (
    typeof filter.classification === "string" &&
    !(definition.classifications ?? []).includes(filter.classification)
  ) {
    return false;
  }

  if (typeof filter.name === "string" && definition.name !== filter.name) {
    return false;
  }

  if (filter.sameNameAsSource === true) {
    if (!sourceDefinition?.name || definition.name !== sourceDefinition.name) {
      return false;
    }
  }

  if (filter.sameNameAsChosenCard === true) {
    if (chosenDefinition?.name && definition.name !== chosenDefinition.name) {
      return false;
    }
  }

  return true;
}

function extractRequestedChosenCardId(ctx: ActionTargetRuntimeContext): CardInstanceId | undefined {
  const args = ctx.args as { costs?: { banishCharacters?: string[] } } | undefined;
  const banishCharacters = args?.costs?.banishCharacters;
  if (!Array.isArray(banishCharacters) || typeof banishCharacters[0] !== "string") {
    return undefined;
  }

  return banishCharacters[0] as CardInstanceId;
}

function resolveActionPlayCardSelectionCandidates(
  targetDescriptors: PlayCardSelectionDescriptor[],
  playerId: PlayerId,
  ctx: ActionTargetRuntimeContext,
  sourceCardId?: CardInstanceId,
): CardInstanceId[] {
  if (targetDescriptors.length === 0) {
    return [];
  }

  const playerIds = (ctx.framework.state.playerIds ?? []) as PlayerId[];
  const candidates = new Set<CardInstanceId>();
  const sourceDefinition = sourceCardId ? getCardDefinition(ctx, sourceCardId) : undefined;
  const chosenCardId = extractRequestedChosenCardId(ctx);
  const chosenDefinition = chosenCardId ? getCardDefinition(ctx, chosenCardId) : undefined;

  for (const targetDescriptor of targetDescriptors) {
    const sourcePlayerIds =
      targetDescriptor.owner === "opponent"
        ? playerIds.filter((candidateId) => candidateId !== playerId)
        : targetDescriptor.owner === "any"
          ? playerIds
          : [playerId];

    const zonesToSearch = targetDescriptor.sourceZones ?? [targetDescriptor.sourceZone];

    for (const sourcePlayerId of sourcePlayerIds) {
      for (const zone of zonesToSearch) {
        const zoneCards = ctx.framework.zones.getCards({
          zone,
          playerId: sourcePlayerId,
        }) as CardInstanceId[];

        for (const cardId of zoneCards) {
          const definition = getCardDefinition(ctx, cardId);
          if (!definition) {
            continue;
          }
          if (
            !matchesPlayCardSelectionCriteria(
              definition,
              targetDescriptor,
              sourceDefinition,
              chosenDefinition,
            )
          ) {
            continue;
          }
          candidates.add(cardId as CardInstanceId);
        }
      }
    }
  }

  return [...candidates];
}

function descriptorMinSelections(descriptor: { count?: unknown }, fallback = 1): number {
  const count = descriptor.count;
  if (typeof count === "number" && Number.isFinite(count)) {
    return Math.max(0, count);
  }
  if (count === "all") {
    return 0;
  }
  if (count && typeof count === "object") {
    const countRecord = count as Record<string, unknown>;
    if (typeof countRecord.exactly === "number") {
      return Math.max(0, countRecord.exactly);
    }
    if (typeof countRecord.upTo === "number") {
      return 0;
    }
    if (typeof countRecord.atLeast === "number") {
      return Math.max(0, countRecord.atLeast);
    }
    if (
      Array.isArray(countRecord.between) &&
      typeof countRecord.between[0] === "number" &&
      typeof countRecord.between[1] === "number"
    ) {
      return Math.max(0, countRecord.between[0]);
    }
  }
  return fallback;
}

function descriptorMaxSelections(
  descriptor: { count?: unknown },
  candidateCount: number,
  fallback = 1,
): number {
  const count = descriptor.count;
  if (typeof count === "number" && Number.isFinite(count)) {
    return Math.max(0, count);
  }
  if (count === "all") {
    return candidateCount;
  }
  if (count && typeof count === "object") {
    const countRecord = count as Record<string, unknown>;
    if (typeof countRecord.exactly === "number") {
      return Math.max(0, countRecord.exactly);
    }
    if (typeof countRecord.upTo === "number") {
      return Math.max(0, countRecord.upTo);
    }
    if (typeof countRecord.atLeast === "number") {
      return candidateCount;
    }
    if (
      Array.isArray(countRecord.between) &&
      typeof countRecord.between[0] === "number" &&
      typeof countRecord.between[1] === "number"
    ) {
      return Math.max(0, countRecord.between[1]);
    }
  }
  return fallback;
}

export function analyzeEffectTargets(
  effect: unknown,
  playerId: PlayerId,
  ctx: ActionTargetRuntimeContext,
  sourceCardId?: CardInstanceId,
  options?: TargetAnalysisOptions,
): TargetAnalysis {
  const removeDamageTargetDescriptors = collectRemoveDamageTargetDescriptors(effect);
  const returnToHandTargetDescriptors = collectReturnToHandTargetDescriptors(effect);
  const returnFromDiscardTargetDescriptors = collectReturnFromDiscardTargetDescriptors(effect);
  const discardTargetDescriptors = collectDiscardTargetDescriptors(effect);
  const inkwellSourceTargetDescriptors = collectInkwellSourceTargetDescriptors(effect);
  const hasDeferredHandDiscardSelection = discardTargetDescriptors.some(
    (descriptor) => descriptor.sourceZone === "hand",
  );
  const baseChosenCardTargetDescriptors = collectChosenCardTargetDescriptors(effect, options);
  // For play-card effects with playMethod: "shift" or "either", inject a secondary target
  // descriptor so that an in-play character (the shift target) is accepted as a valid selection.
  // For "either" the descriptor is optional (count: { upTo: 1 }) so the player may decline the
  // shift base and fall through to a standard play.
  const playCardEitherMode = hasPlayCardEitherMethod(effect);
  const shiftTargetDescriptor = hasPlayCardShiftMethod(effect)
    ? (normalizeTargetDescriptor({
        selector: "chosen",
        count: playCardEitherMode ? { upTo: 1 } : 1,
        owner: "you",
        zones: ["play"],
        cardTypes: ["character"],
      }) as LorcanaCardTarget)
    : undefined;
  const chosenCardTargetDescriptors = dedupeChosenCardTargetDescriptors(
    shiftTargetDescriptor
      ? [...baseChosenCardTargetDescriptors, shiftTargetDescriptor]
      : baseChosenCardTargetDescriptors,
  );
  const playCardSelectionDescriptors = collectPlayCardSelectionDescriptors(effect);
  const chosenPlayerTarget = hasChosenPlayerTarget(effect);
  const targetDsl = [
    ...chosenCardTargetDescriptors,
    ...returnFromDiscardTargetDescriptors.map((descriptor) =>
      buildReturnFromDiscardTargetDsl(descriptor),
    ),
    ...discardTargetDescriptors.map((descriptor) => buildDiscardTargetDsl(descriptor)),
    ...inkwellSourceTargetDescriptors.map((descriptor) => buildDiscardTargetDsl(descriptor)),
    ...playCardSelectionDescriptors.map((descriptor) =>
      buildPlayCardSelectionTargetDsl(descriptor),
    ),
    ...(chosenPlayerTarget ? [{ selector: "chosen", count: 1 } satisfies LorcanaTargetDSL] : []),
  ];

  const playCandidates = resolveActionTargetCandidates(
    [...removeDamageTargetDescriptors, ...returnToHandTargetDescriptors],
    playerId,
    ctx,
    sourceCardId,
  );
  const chosenTargetCandidates = resolveActionChosenTargetCandidates(
    chosenCardTargetDescriptors,
    playerId,
    ctx,
    sourceCardId,
    options?.eventSnapshot,
  );
  const discardCandidates = resolveActionDiscardTargetCandidates(
    returnFromDiscardTargetDescriptors,
    playerId,
    ctx,
    sourceCardId,
  );
  const discardSelectionCandidates = resolveActionDiscardSelectionCandidates(
    discardTargetDescriptors,
    playerId,
    ctx.framework.state.playerIds,
    ctx,
    sourceCardId,
  );
  const inkwellSourceCandidates = resolveActionDiscardSelectionCandidates(
    inkwellSourceTargetDescriptors,
    playerId,
    ctx.framework.state.playerIds,
    ctx,
    sourceCardId,
  );
  const playCardSelectionCandidates = resolveActionPlayCardSelectionCandidates(
    playCardSelectionDescriptors,
    playerId,
    ctx,
    sourceCardId,
  );
  const playerCandidates = chosenPlayerTarget ? [...ctx.framework.state.playerIds] : [];

  const cardCandidates = [
    ...new Set([
      ...playCandidates,
      ...chosenTargetCandidates,
      ...discardCandidates,
      ...discardSelectionCandidates,
      ...inkwellSourceCandidates,
      ...playCardSelectionCandidates,
    ]),
  ];

  const allowedZones = new Set<ActionSelectionZone>();
  if (removeDamageTargetDescriptors.length > 0) {
    allowedZones.add("play");
  }
  if (returnFromDiscardTargetDescriptors.length > 0) {
    allowedZones.add("discard");
  }
  if (discardTargetDescriptors.length > 0) {
    for (const descriptor of discardTargetDescriptors) {
      allowedZones.add(descriptor.sourceZone);
    }
  }
  if (inkwellSourceTargetDescriptors.length > 0) {
    for (const descriptor of inkwellSourceTargetDescriptors) {
      allowedZones.add(descriptor.sourceZone);
    }
  }
  for (const descriptor of chosenCardTargetDescriptors) {
    for (const zone of descriptor.zones ?? []) {
      if (
        zone === "deck" ||
        zone === "hand" ||
        zone === "play" ||
        zone === "discard" ||
        zone === "inkwell" ||
        zone === "limbo"
      ) {
        allowedZones.add(zone);
      }
    }
  }
  for (const descriptor of playCardSelectionDescriptors) {
    const zones = descriptor.sourceZones ?? [descriptor.sourceZone];
    for (const zone of zones) {
      allowedZones.add(zone);
    }
  }

  const explicitDescriptorCount =
    chosenCardTargetDescriptors.length +
    returnFromDiscardTargetDescriptors.length +
    discardTargetDescriptors.length +
    inkwellSourceTargetDescriptors.length +
    playCardSelectionDescriptors.length +
    (chosenPlayerTarget ? 1 : 0);

  const minSelections =
    chosenCardTargetDescriptors.reduce(
      (total, descriptor) => total + descriptorMinSelections(descriptor),
      0,
    ) +
    returnFromDiscardTargetDescriptors.length +
    discardTargetDescriptors.reduce((total, descriptor) => total + descriptor.minAmount, 0) +
    inkwellSourceTargetDescriptors.reduce((total, descriptor) => total + descriptor.minAmount, 0) +
    playCardSelectionDescriptors.length +
    (chosenPlayerTarget ? 1 : 0);

  const maxSelections =
    chosenCardTargetDescriptors.reduce(
      (total, descriptor) => total + descriptorMaxSelections(descriptor, cardCandidates.length),
      0,
    ) +
    returnFromDiscardTargetDescriptors.reduce(
      (total, descriptor) =>
        total +
        Math.min(
          descriptor.count,
          resolveActionDiscardTargetCandidates([descriptor], playerId, ctx, sourceCardId).length,
        ),
      0,
    ) +
    discardTargetDescriptors.reduce(
      (total, descriptor) =>
        total +
        Math.min(
          descriptor.maxAmount,
          resolveActionDiscardSelectionCandidates(
            [descriptor],
            playerId,
            ctx.framework.state.playerIds,
            ctx,
            sourceCardId,
          ).length,
        ),
      0,
    ) +
    inkwellSourceTargetDescriptors.reduce(
      (total, descriptor) =>
        total +
        Math.min(
          descriptor.maxAmount,
          resolveActionDiscardSelectionCandidates(
            [descriptor],
            playerId,
            ctx.framework.state.playerIds,
            ctx,
            sourceCardId,
          ).length,
        ),
      0,
    ) +
    playCardSelectionDescriptors.length +
    (chosenPlayerTarget ? 1 : 0);

  return {
    targetDsl,
    cardCandidates,
    playerCandidates,
    allowedZones: [...allowedZones],
    minSelections: explicitDescriptorCount > 0 ? Math.max(0, minSelections) : 0,
    maxSelections:
      explicitDescriptorCount > 0
        ? Math.max(1, Math.min(cardCandidates.length + playerCandidates.length, maxSelections))
        : 0,
    declaredMaxSelections: explicitDescriptorCount > 0 ? Math.max(1, maxSelections) : 0,
    requiresExplicitSelection: explicitDescriptorCount > 0,
    allowsDeferredResolutionWithoutInitialSelection: hasDeferredHandDiscardSelection,
    // Multiple independent chosen descriptors means each slot is its own selection —
    // the same card may legally appear in more than one slot (rule 6.1.3).
    // However, if any descriptor has requireDifferentTargets, duplicates are still forbidden.
    allowDuplicateTargets:
      chosenCardTargetDescriptors.length > 1 &&
      !chosenCardTargetDescriptors.some((d) => d.requireDifferentTargets === true),
  };
}

export function validateAndNormalizeTargetSelection(
  targets: unknown,
  analysis: TargetAnalysis,
  context?: TargetSelectionRestrictionContext,
): TargetValidationResult {
  const rawTargets = isSlottedTargetInput(targets)
    ? [...flattenSlottedTargets(targets)]
    : Array.isArray(targets)
      ? targets
      : targets !== undefined
        ? [targets]
        : [];
  const cardCandidateSet = new Set(analysis.cardCandidates);
  const playerCandidateSet = new Set(analysis.playerCandidates);
  const cardIds: CardInstanceId[] = [];
  const playerIds: PlayerId[] = [];
  const seen = new Set<string>();

  for (const target of rawTargets) {
    if (typeof target !== "string" || target.length === 0) {
      return {
        valid: false,
        error: "Targets must contain valid string identifiers",
        errorCode: "INVALID_ACTION_TARGETS",
      };
    }

    if (!analysis.allowDuplicateTargets && seen.has(target)) {
      return {
        valid: false,
        error: "Targets must be unique",
        errorCode: "DUPLICATE_TARGETS",
      };
    }
    seen.add(target);

    if (cardCandidateSet.has(target as CardInstanceId)) {
      cardIds.push(target as CardInstanceId);
      continue;
    }

    if (playerCandidateSet.has(target as PlayerId)) {
      playerIds.push(target as PlayerId);
      continue;
    }

    return {
      valid: false,
      error: `Target ${target} is not a legal target`,
      errorCode: "INVALID_ACTION_TARGET",
    };
  }

  const totalSelections = cardIds.length + playerIds.length;
  if (analysis.minSelections > 0 && totalSelections < analysis.minSelections) {
    return {
      valid: false,
      error:
        analysis.minSelections === 1
          ? "At least 1 target must be selected"
          : `At least ${analysis.minSelections} targets must be selected`,
      errorCode: "TOO_FEW_TARGETS",
    };
  }

  if (analysis.maxSelections > 0 && totalSelections > analysis.maxSelections) {
    return {
      valid: false,
      error: "Too many targets selected",
      errorCode: "TOO_MANY_TARGETS",
    };
  }

  const forcedTargetValidation = validateForcedEffectTargetSelection({
    analysis,
    selection: {
      cardIds,
      playerIds,
    },
    context,
  });
  if (forcedTargetValidation) {
    return forcedTargetValidation;
  }

  return {
    valid: true,
    selection: {
      cardIds,
      playerIds,
    },
  };
}

export function flattenNormalizedTargetSelection(
  selection: NormalizedTargetSelection,
): Array<CardInstanceId | PlayerId> | undefined {
  const targets = [...selection.cardIds, ...selection.playerIds];
  return targets.length > 0 ? targets : undefined;
}

/** Labels for effect-resolution slots (not printed ability costs). */
export type ActivateAbilityEffectResolutionSlotKind =
  | "effectBanishCharacter"
  | "effectPlayCardFromHand"
  | "effectChosenCard";

export type ActivateAbilityEffectResolutionSlot = {
  kind: ActivateAbilityEffectResolutionSlotKind;
  cardCandidates: CardInstanceId[];
  minSelections: number;
  maxSelections: number;
};

function walkActivateAbilityResolutionSlotKinds(
  effect: unknown,
): ActivateAbilityEffectResolutionSlotKind[] {
  const kinds: ActivateAbilityEffectResolutionSlotKind[] = [];
  const visit = (e: unknown): void => {
    if (!e || typeof e !== "object") {
      return;
    }
    const r = e as Record<string, unknown>;
    const t = r.type;
    if (t === "sequence") {
      const steps = r.steps;
      if (Array.isArray(steps)) {
        for (const step of steps) {
          visit(step);
        }
      }
      return;
    }
    if (t === "conditional") {
      visit(r.then);
      visit(r.else);
      return;
    }
    if (t === "optional") {
      visit(r.effect);
      return;
    }
    if (t === "choice" || t === "or") {
      const opts = r.options ?? r.choices;
      if (Array.isArray(opts)) {
        for (const o of opts) {
          visit(o);
        }
      }
      return;
    }
    if (t === "for-each") {
      visit(r.effect);
      return;
    }
    if (t === "banish") {
      kinds.push("effectBanishCharacter");
      return;
    }
    if (t === "play-card") {
      kinds.push("effectPlayCardFromHand");
      return;
    }
  };
  visit(effect);
  return kinds;
}

/**
 * Per-slot legal cards and labels for activated ability **effect** targeting (not `ability.cost` card payments).
 * Order matches merged `targets[]` passed to `resolveActionEffect` for that ability.
 */
export function analyzeActivateAbilityEffectResolutionSlots(
  effect: unknown,
  playerId: PlayerId,
  ctx: ActionTargetRuntimeContext,
  sourceCardId?: CardInstanceId,
): ActivateAbilityEffectResolutionSlot[] {
  const chosen = dedupeChosenCardTargetDescriptors(collectChosenCardTargetDescriptors(effect));
  const playDescriptors = collectPlayCardSelectionDescriptors(effect);
  const walked = walkActivateAbilityResolutionSlotKinds(effect);
  const slotCount = chosen.length + playDescriptors.length;

  let kinds: ActivateAbilityEffectResolutionSlotKind[];
  if (walked.length === slotCount && slotCount > 0) {
    kinds = walked;
  } else {
    kinds = [
      ...chosen.map((): ActivateAbilityEffectResolutionSlotKind => "effectChosenCard"),
      ...playDescriptors.map(
        (): ActivateAbilityEffectResolutionSlotKind => "effectPlayCardFromHand",
      ),
    ];
  }

  const slots: ActivateAbilityEffectResolutionSlot[] = [];
  let kindIndex = 0;

  for (const desc of chosen) {
    const normalized = normalizeTargetDescriptor(desc);
    const cardCandidates = normalized
      ? (resolveCandidateTargets(ctx, normalized, {
          controllerId: playerId,
          sourceCardId,
        }) as CardInstanceId[])
      : [];
    const minSelections = descriptorMinSelections(desc);
    const maxSelections = descriptorMaxSelections(desc, cardCandidates.length);
    slots.push({
      kind: kinds[kindIndex] ?? "effectChosenCard",
      cardCandidates,
      minSelections,
      maxSelections,
    });
    kindIndex += 1;
  }

  for (const playDesc of playDescriptors) {
    const cardCandidates = resolveActionPlayCardSelectionCandidates(
      [playDesc],
      playerId,
      ctx,
      sourceCardId,
    );
    const dsl = buildPlayCardSelectionTargetDsl(playDesc);
    const minSelections = descriptorMinSelections(dsl);
    const maxSelections = descriptorMaxSelections(dsl, cardCandidates.length);
    slots.push({
      kind: kinds[kindIndex] ?? "effectPlayCardFromHand",
      cardCandidates,
      minSelections,
      maxSelections,
    });
    kindIndex += 1;
  }

  return slots;
}

export type ActivateAbilityEffectSelectionsInput = {
  /**
   * One card id per effect-resolution slot (same order as `analyzeActivateAbilityEffectResolutionSlots`).
   * When set with the correct length, used as the sole source for merged `targets`.
   */
  effectSlotCardIds?: readonly CardInstanceId[];
  /**
   * Convenience for banish-then-play lines (e.g. Retro Evolution Device). Ignored when `effectSlotCardIds`
   * is provided with full length.
   */
  effectBanishCharacterIds?: readonly CardInstanceId[];
  effectPlayCardFromHandIds?: readonly CardInstanceId[];
};

/**
 * Builds ordered `targets` from structured effect selections.
 */
export function mergeActivateAbilityEffectSelectionsToTargets(
  slotKinds: readonly ActivateAbilityEffectResolutionSlotKind[],
  selections: ActivateAbilityEffectSelectionsInput,
): CardInstanceId[] | undefined {
  if (
    Array.isArray(selections.effectSlotCardIds) &&
    selections.effectSlotCardIds.length === slotKinds.length &&
    slotKinds.length > 0
  ) {
    return [...(selections.effectSlotCardIds as CardInstanceId[])];
  }

  const banish = selections.effectBanishCharacterIds ?? [];
  const play = selections.effectPlayCardFromHandIds ?? [];
  let bi = 0;
  let pi = 0;
  const merged: CardInstanceId[] = [];

  for (const kind of slotKinds) {
    if (kind === "effectBanishCharacter") {
      const id = banish[bi];
      bi += 1;
      if (typeof id === "string" && id.length > 0) {
        merged.push(id as CardInstanceId);
      }
    } else if (kind === "effectPlayCardFromHand") {
      const id = play[pi];
      pi += 1;
      if (typeof id === "string" && id.length > 0) {
        merged.push(id as CardInstanceId);
      }
    } else {
      return undefined;
    }
  }

  if (merged.length !== slotKinds.length || merged.length === 0) {
    return undefined;
  }

  return merged;
}
