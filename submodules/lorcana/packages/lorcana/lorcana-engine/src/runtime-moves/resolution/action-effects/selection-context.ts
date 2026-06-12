import type { CardInstanceId, PlayerId } from "#core";
import type { CardRuntimeReadAPI, DeepReadonly, FrameworkReadAPI } from "../../../core/runtime";
import type {
  AmountExpr,
  CardFilter,
  Condition,
  LorcanaCard,
  LorcanaCardDefinition,
  MoveDamageEffect,
  ScryCardOrdering,
} from "@tcg/lorcana-types";
import type { CardPlayedPayload, LorcanaG, PendingActionResolutionInput } from "../../../types";
import type {
  ChoiceResolutionSelectionContext,
  NameCardResolutionSelectionContext,
  OptionalResolutionSelectionContext,
  ResolutionSelectionContext,
  ResolutionSelectionCurrentSelection,
  ResolutionSelectionDestination,
  ResolutionSelectionOption,
  ScryResolutionSelectionContext,
  TargetResolutionSelectionContext,
} from "../../../types";
import type { SearchDeckEffect } from "@tcg/lorcana-types";
import { matchesSearchFilter } from "./search-deck-effect";
import { matchesCardFilterArray } from "./card-filter-match-utils";
import { analyzeEffectTargets } from "../../../targeting/runtime";
import {
  analyzeTargetSelectionAvailabilityFromAnalysis,
  normalizeSelectedTargets,
  resolveCandidateTargets,
  normalizeTargetDescriptor,
  resolveEffectTargets,
  resolveSelectedPlayerIds,
  resolveTargetPlayerIds,
} from "../../../targeting/runtime";
import { evaluateActionCondition } from "./action-condition-evaluator";
import {
  effectTargetUsesSelectionContext,
  getEffectTargetSelectionInput,
  getCombinedSelectionInput,
  getContextSelectionTargets,
  getCurrentSelectionInput,
} from "./selection-state";
import type { SlottedTargetKind } from "../../../targeting/slotted-targets";
import { hasBodyguard, hasMayEnterPlayExertedOption } from "../../../card-utils";
import { getShiftRules, resolveShiftTargetCandidates } from "../../rules/play-card-rules";

type MoveDamageEndpoint = NonNullable<MoveDamageEffect["from"] | MoveDamageEffect["to"]>;
type MoveDamageRefValue = Extract<MoveDamageEndpoint, { ref: string }>["ref"];
type MoveDamageReferenceValue = NonNullable<
  Extract<MoveDamageEndpoint, { reference?: unknown }>["reference"]
>;

const SELF_REF_VALUES: readonly MoveDamageRefValue[] = ["self"];
const SELF_REFERENCE_VALUES: readonly MoveDamageReferenceValue[] = ["source"];

export type ResolutionSelectionRuntimeContext = {
  G?: DeepReadonly<LorcanaG>;
  playerId?: PlayerId;
  framework: FrameworkReadAPI;
  cards: CardRuntimeReadAPI;
};

type ResolutionSelectionBuildBase = {
  origin: "pending-effect" | "bag";
  requestId: string;
  sourceCardId: CardInstanceId;
  chooserId: PlayerId;
  cardPlayed: CardPlayedPayload;
  resolutionInput: PendingActionResolutionInput;
  ctx: ResolutionSelectionRuntimeContext;
};

type ResolutionSelectionBuildArgs = ResolutionSelectionBuildBase & {
  effect: unknown;
  condition?: Condition;
  legalChoiceIndices?: number[];
  originatesFromOptional?: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function getRecordString(record: Record<string, unknown> | null, key: string): string | undefined {
  const value = record?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function getRecordNumber(record: Record<string, unknown> | null, key: string): number | undefined {
  const value = record?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getStringArray(record: Record<string, unknown> | null, key: string): string[] {
  const value = record?.[key];
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0)
    : [];
}

function normalizeCardFilters(value: unknown): CardFilter[] {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is CardFilter =>
      Boolean(entry && typeof entry === "object" && !Array.isArray(entry)),
    );
  }

  if (value && typeof value === "object") {
    return [value as CardFilter];
  }

  return [];
}

function getOptionalBoolean(record: Record<string, unknown>, key: string): boolean | undefined {
  const value = record[key];
  return typeof value === "boolean" ? value : undefined;
}

function getOptionalString<T extends string>(
  record: Record<string, unknown>,
  key: string,
): T | undefined {
  const value = record[key];
  return typeof value === "string" && value.length > 0 ? (value as T) : undefined;
}

function getOptionalAmountExpr(
  record: Record<string, unknown>,
  key: string,
): AmountExpr | undefined {
  const value = record[key];
  if (typeof value === "number") {
    return value;
  }

  return value && typeof value === "object" ? (value as AmountExpr) : undefined;
}

function normalizeCurrentSelection(
  resolutionInput: PendingActionResolutionInput,
): ResolutionSelectionCurrentSelection {
  const currentSelection: ResolutionSelectionCurrentSelection = {};
  const currentTargets = getCurrentSelectionInput(resolutionInput);

  if (typeof currentTargets === "string") {
    currentSelection.targets = [currentTargets];
  } else if (Array.isArray(currentTargets) && currentTargets.length > 0) {
    currentSelection.targets = currentTargets.filter(
      (target): target is CardInstanceId | PlayerId =>
        typeof target === "string" && target.length > 0,
    );
  }

  if (
    typeof resolutionInput.amount === "number" &&
    Number.isFinite(resolutionInput.amount) &&
    resolutionInput.amount >= 0
  ) {
    currentSelection.amount = Math.floor(resolutionInput.amount);
  }

  if (
    typeof resolutionInput.choiceIndex === "number" &&
    Number.isInteger(resolutionInput.choiceIndex)
  ) {
    currentSelection.choiceIndex = resolutionInput.choiceIndex;
  }

  if (typeof resolutionInput.resolveOptional === "boolean") {
    currentSelection.resolveOptional = resolutionInput.resolveOptional;
  }

  if (typeof resolutionInput.enterPlayExerted === "boolean") {
    currentSelection.enterPlayExerted = resolutionInput.enterPlayExerted;
  }

  if (
    typeof resolutionInput.namedCard === "string" &&
    resolutionInput.namedCard.trim().length > 0
  ) {
    currentSelection.namedCard = resolutionInput.namedCard.trim();
  }

  if (Array.isArray(resolutionInput.destinations) && resolutionInput.destinations.length > 0) {
    currentSelection.destinations = resolutionInput.destinations.reduce<
      ResolutionSelectionDestination[]
    >((destinations, destination) => {
      if (!destination || typeof destination.zone !== "string" || destination.zone.length === 0) {
        return destinations;
      }

      const cards = Array.isArray(destination.cards)
        ? destination.cards.filter(
            (cardId): cardId is CardInstanceId => typeof cardId === "string" && cardId.length > 0,
          )
        : typeof destination.cards === "string" && destination.cards.length > 0
          ? [destination.cards]
          : [];
      if (cards.length === 0) {
        return destinations;
      }

      destinations.push({
        zone: destination.zone,
        cards,
      });
      return destinations;
    }, []);
  }

  return currentSelection;
}

function resolveDefaultTargetChooserId(
  ctx: ResolutionSelectionRuntimeContext,
  cardPlayed: CardPlayedPayload,
  effect: Record<string, unknown>,
  resolutionInput: PendingActionResolutionInput,
  parentChooser?: PlayerId,
): PlayerId {
  const chosenBy = effect.chosenBy;
  if (chosenBy === "you") {
    return cardPlayed.playerId;
  }

  if (chosenBy === "opponent") {
    return (
      ctx.framework.state.playerIds.find((playerId) => playerId !== cardPlayed.playerId) ??
      cardPlayed.playerId
    );
  }

  if (chosenBy === "TARGET") {
    const selectedTargets =
      normalizeSelectedTargets(getCombinedSelectionInput(resolutionInput)) ?? [];
    const selectedPlayer = ctx.framework.state.playerIds.find((playerId) =>
      selectedTargets.some((target) => String(target) === String(playerId)),
    );
    if (selectedPlayer) {
      return selectedPlayer;
    }

    const selectedCardOwner = selectedTargets
      .map((target) => ctx.framework.zones.getCardOwner(target))
      .find((ownerId): ownerId is PlayerId => typeof ownerId === "string" && ownerId.length > 0);
    if (selectedCardOwner) {
      return selectedCardOwner;
    }
  }

  // If no explicit chosenBy, derive the chooser from the effect's player target,
  // but only for effect types where `target` semantically identifies the player
  // who performs the action (e.g. "the challenging player chooses and discards").
  // Movement effects like put-into-inkwell, move-to-hand, deal-damage use
  // `target` for destination/recipient — not chooser — so the inference must
  // not apply (Hades — Infernal Schemer regression: the controller of the
  // played card chooses the opposing character; target=OPPONENT only describes
  // whose inkwell receives it).
  const TARGET_IS_CHOOSER_EFFECT_TYPES = new Set(["discard", "reveal-hand"]);
  const effectType = typeof effect.type === "string" ? effect.type : undefined;
  const target = effect.target;
  if (target && effectType && TARGET_IS_CHOOSER_EFFECT_TYPES.has(effectType)) {
    const targetPlayers = resolveTargetPlayerIds(ctx, target, {
      controllerId: cardPlayed.playerId,
      sourceCardId: cardPlayed.cardId as CardInstanceId,
      eventSnapshot: resolutionInput.eventSnapshot,
    });
    if (targetPlayers.length === 1) {
      return targetPlayers[0]!;
    }
  }

  // Prefer an explicit chooser inherited from an outer optional wrapper (e.g.
  // Leviathan's "IT'S A MACHINE!" banish is wrapped by an optional with
  // chooser: CONTROLLER). Without this, ctx.playerId (the board-projection
  // viewer) would be used, assigning the prompt to the wrong player.
  return parentChooser ?? ctx.playerId ?? cardPlayed.playerId;
}

function resolveChoiceChooserId(
  ctx: ResolutionSelectionRuntimeContext,
  cardPlayed: CardPlayedPayload,
  effect: Record<string, unknown>,
  resolutionInput: PendingActionResolutionInput,
): PlayerId {
  if (effect.chooser) {
    const selectedTargets =
      normalizeSelectedTargets(getCombinedSelectionInput(resolutionInput)) ?? [];

    if (effect.chooser === "CHOSEN_PLAYER") {
      return (
        resolveSelectedPlayerIds(
          ctx.framework.state.playerIds,
          getCombinedSelectionInput(resolutionInput),
        )?.[0] ?? cardPlayed.playerId
      );
    }

    if (effect.chooser === "CARD_OWNER") {
      return (
        selectedTargets
          .map((target) => ctx.framework.zones.getCardOwner(target))
          .find(
            (ownerId): ownerId is PlayerId => typeof ownerId === "string" && ownerId.length > 0,
          ) ?? cardPlayed.playerId
      );
    }

    return (
      resolveTargetPlayerIds(ctx, effect.chooser, {
        controllerId: cardPlayed.playerId,
        sourceCardId: cardPlayed.cardId,
        selectedPlayerIds: resolveSelectedPlayerIds(
          ctx.framework.state.playerIds,
          getCombinedSelectionInput(resolutionInput),
        ),
        eventSnapshot: resolutionInput.eventSnapshot,
      })[0] ?? cardPlayed.playerId
    );
  }

  if (effect.chosenBy === "opponent") {
    return (
      ctx.framework.state.playerIds.find((playerId) => playerId !== cardPlayed.playerId) ??
      cardPlayed.playerId
    );
  }

  if (effect.chosenBy === "TARGET") {
    const selectedTargets =
      normalizeSelectedTargets(getCombinedSelectionInput(resolutionInput)) ?? [];
    const selectedPlayer = ctx.framework.state.playerIds.find((playerId) =>
      selectedTargets.some((target) => String(target) === String(playerId)),
    );
    if (selectedPlayer) {
      return selectedPlayer;
    }

    const selectedCardOwner = selectedTargets
      .map((target) => ctx.framework.zones.getCardOwner(target))
      .find((ownerId): ownerId is PlayerId => typeof ownerId === "string" && ownerId.length > 0);
    if (selectedCardOwner) {
      return selectedCardOwner;
    }
  }

  return cardPlayed.playerId;
}

function resolveOptionalChooserId(
  ctx: ResolutionSelectionRuntimeContext,
  cardPlayed: CardPlayedPayload,
  effect: Record<string, unknown>,
  resolutionInput: PendingActionResolutionInput,
): PlayerId {
  if (!effect.chooser) {
    return cardPlayed.playerId;
  }

  const selectedTargets =
    normalizeSelectedTargets(getCombinedSelectionInput(resolutionInput)) ?? [];

  if (effect.chooser === "CHOSEN_PLAYER") {
    return (
      resolveSelectedPlayerIds(
        ctx.framework.state.playerIds,
        getCombinedSelectionInput(resolutionInput),
      )?.[0] ?? cardPlayed.playerId
    );
  }

  if (effect.chooser === "CARD_OWNER") {
    return (
      selectedTargets
        .map((target) => ctx.framework.zones.getCardOwner(target))
        .find(
          (ownerId): ownerId is PlayerId => typeof ownerId === "string" && ownerId.length > 0,
        ) ?? cardPlayed.playerId
    );
  }

  return (
    resolveTargetPlayerIds(ctx, effect.chooser, {
      controllerId: cardPlayed.playerId,
      sourceCardId: cardPlayed.cardId,
      selectedPlayerIds: resolveSelectedPlayerIds(
        ctx.framework.state.playerIds,
        getCombinedSelectionInput(resolutionInput),
      ),
      eventSnapshot: resolutionInput.eventSnapshot,
    })[0] ?? cardPlayed.playerId
  );
}

function buildChosenPlayerTargetSelectionContext(
  args: ResolutionSelectionBuildBase & {
    chooserId?: PlayerId;
    originatesFromOptional?: boolean;
    canDeclineSelection?: boolean;
  },
): TargetResolutionSelectionContext {
  return {
    origin: args.origin,
    requestId: args.requestId,
    kind: "target-selection",
    sourceCardId: args.sourceCardId,
    chooserId: args.chooserId ?? args.cardPlayed.playerId,
    currentSelection: normalizeCurrentSelection(args.resolutionInput),
    submitField: "targets",
    originatesFromOptional: args.originatesFromOptional,
    canDeclineSelection: args.canDeclineSelection,
    targetDsl: [{ selector: "chosen", count: 1 }],
    cardCandidateIds: [],
    playerCandidateIds: [...args.ctx.framework.state.playerIds],
    allowedZones: [],
    minSelections: 1,
    maxSelections: 1,
    ordered: false,
    autoRejected: false,
  };
}

function buildChoiceOptions(
  effect: Record<string, unknown>,
  legalChoiceIndices?: number[],
): ResolutionSelectionOption[] {
  const rawOptions = Array.isArray(effect.options)
    ? effect.options
    : Array.isArray(effect.choices)
      ? effect.choices
      : [];
  const optionLabels = Array.isArray(effect.optionLabels)
    ? effect.optionLabels.filter(
        (label): label is string => typeof label === "string" && label.trim().length > 0,
      )
    : [];
  const legalChoiceSet = legalChoiceIndices ? new Set(legalChoiceIndices) : null;

  return rawOptions.map((option, index) => ({
    index,
    label: optionLabels[index] ?? deriveChoiceOptionLabel(option) ?? `Option ${index + 1}`,
    legal: legalChoiceSet ? legalChoiceSet.has(index) : true,
  }));
}

function deriveChoiceOptionLabel(option: unknown): string | undefined {
  const effect = asRecord(option);
  if (!effect) {
    return undefined;
  }

  const explicitText = getRecordString(effect, "text");
  if (explicitText) {
    return explicitText;
  }

  switch (effect.type) {
    case "sequence": {
      const steps = Array.isArray(effect.steps)
        ? effect.steps
        : Array.isArray(effect.effects)
          ? effect.effects
          : [];
      const labels = steps
        .map((step) => deriveChoiceOptionLabel(step))
        .filter((label): label is string => typeof label === "string" && label.length > 0);
      return labels.length > 0 ? labels.join(" ") : undefined;
    }
    case "draw": {
      const amount = typeof effect.amount === "number" ? effect.amount : 1;
      return amount === 1 ? "Draw a card." : `Draw ${amount} cards.`;
    }
    case "deal-damage": {
      const amount = typeof effect.amount === "number" ? effect.amount : undefined;
      return typeof amount === "number"
        ? `Deal ${amount} damage to chosen character.`
        : "Deal damage to chosen character.";
    }
    case "banish":
      return "Banish chosen card.";
    case "ready":
      return "Ready chosen card.";
    case "discard": {
      const amount = typeof effect.amount === "number" ? effect.amount : 1;
      return amount === 1 ? "Discard a card." : `Discard ${amount} cards.`;
    }
    case "remove-damage": {
      const amount = resolveLabelAmount(effect.amount);
      return amount ? `Remove up to ${amount} damage.` : "Remove damage.";
    }
    case "return-to-hand":
      return "Return chosen card to hand.";
    case "put-on-bottom":
      return "Put chosen card on the bottom of their deck.";
    case "gain-lore": {
      const amount = typeof effect.amount === "number" ? effect.amount : undefined;
      return typeof amount === "number" ? `Gain ${amount} lore.` : "Gain lore.";
    }
    case "conditional": {
      const thenLabel = deriveChoiceOptionLabel(effect.then);
      const elseLabel = deriveChoiceOptionLabel(effect.else);
      if (thenLabel && elseLabel) {
        return `${thenLabel} Otherwise, ${elseLabel}`;
      }
      return thenLabel ?? elseLabel;
    }
    case "modify-stat": {
      const stat = getRecordString(effect, "stat");
      const modifier = typeof effect.modifier === "number" ? effect.modifier : undefined;
      if (!stat || typeof modifier !== "number") {
        return undefined;
      }

      const sign = modifier > 0 ? "+" : "";
      return `Chosen character gets ${sign}${modifier} ${stat}.`;
    }
    case "gain-keyword": {
      const keyword = getRecordString(effect, "keyword");
      return keyword ? `Chosen character gains ${keyword}.` : undefined;
    }
    default:
      return undefined;
  }
}

function resolveLabelAmount(amount: unknown): number | undefined {
  if (typeof amount === "number") {
    return amount;
  }

  const amountRecord = asRecord(amount);
  const value = amountRecord?.value;
  return typeof value === "number" ? value : undefined;
}

function buildChoiceSelectionContext(
  args: ResolutionSelectionBuildBase & {
    effect: Record<string, unknown>;
    legalChoiceIndices?: number[];
  },
): ChoiceResolutionSelectionContext {
  const currentSelection = normalizeCurrentSelection(args.resolutionInput);
  if (!currentSelection.targets || currentSelection.targets.length === 0) {
    const contextTargets = getContextSelectionTargets(args.resolutionInput);
    if (contextTargets.length > 0) {
      currentSelection.targets = [...contextTargets];
    }
  }

  return {
    origin: args.origin,
    requestId: args.requestId,
    kind: "choice-selection",
    sourceCardId: args.sourceCardId,
    chooserId: args.chooserId,
    currentSelection,
    submitField: "choiceIndex",
    options: buildChoiceOptions(args.effect, args.legalChoiceIndices),
  };
}

function deriveLegalChoiceIndices(
  args: ResolutionSelectionBuildBase,
  options: readonly unknown[],
): number[] {
  return options.flatMap((option, index) => {
    const optionRecord = asRecord(option);
    let effectiveOption = option;
    if (optionRecord?.type === "conditional") {
      const conditionMet = evaluateActionCondition(
        optionRecord.condition as never,
        args.ctx as never,
        args.cardPlayed,
        args.resolutionInput,
      );
      effectiveOption = conditionMet
        ? (optionRecord.then ?? optionRecord.effect ?? optionRecord.ifTrue)
        : (optionRecord.else ?? optionRecord.ifFalse);
      if (!effectiveOption) {
        return [];
      }
    }
    if (
      optionRecord?.type === "discard" &&
      optionRecord.chosen === true &&
      typeof optionRecord.target === "string"
    ) {
      const targetPlayerIds = resolveTargetPlayerIds(args.ctx, optionRecord.target, {
        controllerId: args.cardPlayed.playerId,
        sourceCardId: args.sourceCardId,
        eventSnapshot: args.resolutionInput.eventSnapshot,
      });
      const sourceZone = getRecordString(optionRecord, "from") ?? "hand";
      const amount =
        typeof optionRecord.amount === "number" && Number.isFinite(optionRecord.amount)
          ? Math.max(0, Math.floor(optionRecord.amount))
          : 1;
      const canDiscard =
        amount > 0 &&
        targetPlayerIds.length > 0 &&
        targetPlayerIds.every(
          (playerId) =>
            args.ctx.framework.zones.getCards({
              zone: sourceZone,
              playerId,
            }).length >= amount,
        );
      return canDiscard ? [index] : [];
    }

    const optionContext = buildImmediateSelectionContext({
      ...args,
      effect: effectiveOption,
    });
    if (optionContext?.kind === "target-selection" || optionContext?.kind === "discard-choice") {
      const candidateCount =
        optionContext.cardCandidateIds.length + optionContext.playerCandidateIds.length;
      return candidateCount >= optionContext.minSelections ? [index] : [];
    }
    return [index];
  });
}

function buildOptionalSelectionContext(
  args: ResolutionSelectionBuildBase,
): OptionalResolutionSelectionContext {
  return {
    origin: args.origin,
    requestId: args.requestId,
    kind: "optional-selection",
    sourceCardId: args.sourceCardId,
    chooserId: args.chooserId,
    currentSelection: normalizeCurrentSelection(args.resolutionInput),
    submitField: "resolveOptional",
    acceptLabel: "Yes",
    rejectLabel: "No",
  };
}

function buildNameCardSelectionContext(
  args: ResolutionSelectionBuildBase,
): NameCardResolutionSelectionContext {
  return {
    origin: args.origin,
    requestId: args.requestId,
    kind: "name-card-selection",
    sourceCardId: args.sourceCardId,
    chooserId: args.chooserId,
    currentSelection: normalizeCurrentSelection(args.resolutionInput),
    submitField: "namedCard",
    searchMode: "lorcana-catalog",
  };
}

function buildScrySelectionContext(
  args: ResolutionSelectionBuildBase & {
    effect: Record<string, unknown>;
  },
): ScryResolutionSelectionContext | undefined {
  const eventSnapshot = asRecord(args.resolutionInput.eventSnapshot ?? null);
  const revealedCardIds = getStringArray(eventSnapshot, "revealedCardIds") as CardInstanceId[];
  const amount =
    getRecordNumber(args.effect, "amount") ??
    (revealedCardIds.length > 0 ? revealedCardIds.length : undefined);
  const destinations = Array.isArray(args.effect.destinations)
    ? args.effect.destinations
        .map((destination) => asRecord(destination))
        .filter((destination): destination is Record<string, unknown> => destination !== null)
    : [];

  if (revealedCardIds.length === 0 || !amount || destinations.length === 0) {
    return undefined;
  }

  const revealedCards = revealedCardIds.map((cardId) => {
    const definition = args.ctx.cards.getDefinition(cardId);
    const label =
      definition?.name && typeof definition.name === "string"
        ? `${definition.name}${definition.version ? ` - ${definition.version}` : ""}`
        : cardId;

    return {
      cardId,
      label,
      cardType: definition?.cardType,
      actionSubtype:
        definition?.cardType === "action" ? (definition.actionSubtype ?? undefined) : undefined,
      cost: typeof definition?.cost === "number" ? definition.cost : undefined,
      classifications:
        definition?.cardType === "character" && Array.isArray(definition.classifications)
          ? [...definition.classifications]
          : undefined,
    };
  });

  return {
    origin: args.origin,
    requestId: args.requestId,
    kind: "scry-selection",
    sourceCardId: args.sourceCardId,
    chooserId: args.chooserId,
    currentSelection: normalizeCurrentSelection(args.resolutionInput),
    submitField: "destinations",
    amount,
    revealedCardIds,
    revealedCards,
    destinationRules: destinations.map((destination, index) => ({
      id: `${args.requestId}:${destination.zone ?? "destination"}:${index}`,
      zone: String(destination.zone),
      min: getRecordNumber(destination, "min") ?? 0,
      max: getRecordNumber(destination, "max") ?? null,
      remainder: destination.remainder === true,
      label: getRecordString(destination, "label"),
      filters: normalizeCardFilters(destination.filters ?? destination.filter),
      playFilters: normalizeCardFilters(destination.playFilters ?? destination.playFilter),
      ordering: getOptionalString<ScryCardOrdering>(destination, "ordering"),
      reveal: destination.reveal === true,
      exclusiveGroup: getRecordString(destination, "exclusiveGroup"),
      cost: getOptionalString<"free" | "reduced">(destination, "cost"),
      reducedBy: getOptionalAmountExpr(destination, "reducedBy"),
      entersExerted: getOptionalBoolean(destination, "entersExerted"),
      grantsRush: getOptionalBoolean(destination, "grantsRush"),
      banishAtEndOfTurn: getOptionalBoolean(destination, "banishAtEndOfTurn"),
      exerted: getOptionalBoolean(destination, "exerted"),
      facedown: getOptionalBoolean(destination, "facedown"),
    })),
  };
}

function buildSearchDeckSelectionContext(
  args: ResolutionSelectionBuildBase & { originatesFromOptional?: boolean },
  effectRecord: Record<string, unknown>,
): TargetResolutionSelectionContext | undefined {
  const currentSelection = normalizeCurrentSelection(args.resolutionInput);
  const currentTargets = currentSelection.targets ?? [];

  // If target already provided, no selection needed
  if (currentTargets.length > 0) {
    return undefined;
  }

  const deckCards = args.ctx.framework.zones.getCards({
    zone: "deck",
    playerId: args.cardPlayed.playerId,
  }) as CardInstanceId[];

  const candidates = deckCards.filter((cardId) =>
    matchesSearchFilter(
      args.ctx as Parameters<typeof matchesSearchFilter>[0],
      cardId,
      effectRecord as unknown as SearchDeckEffect,
    ),
  );

  // 0 or 1 candidate: auto-resolve (no selection needed)
  if (candidates.length <= 1) {
    return undefined;
  }

  return {
    origin: args.origin,
    requestId: args.requestId,
    kind: "target-selection",
    sourceCardId: args.sourceCardId,
    chooserId: args.chooserId,
    currentSelection,
    submitField: "targets",
    originatesFromOptional: args.originatesFromOptional,
    targetDsl: [],
    cardCandidateIds: candidates,
    playerCandidateIds: [],
    allowedZones: ["deck"],
    minSelections: 1,
    maxSelections: 1,
    ordered: false,
    autoRejected: false,
  };
}

function buildGenericTargetSelectionContext(
  args: ResolutionSelectionBuildBase & {
    effect: unknown;
    kind: "target-selection" | "discard-choice";
    ordered?: boolean;
    originatesFromOptional?: boolean;
    canDeclineSelection?: boolean;
  },
): TargetResolutionSelectionContext | undefined {
  const chooserScopedCtx: ResolutionSelectionRuntimeContext = {
    ...args.ctx,
    playerId: args.chooserId,
  };
  const effectRecord = asRecord(args.effect);
  const analysis = analyzeEffectTargets(
    args.effect,
    args.cardPlayed.playerId,
    chooserScopedCtx,
    args.sourceCardId,
    {
      includeDeferredChosenSelections: true,
      eventSnapshot: args.resolutionInput.eventSnapshot,
    },
  );
  const fullCurrentSelection = normalizeCurrentSelection(args.resolutionInput);
  const currentSelection: ResolutionSelectionCurrentSelection = {
    ...fullCurrentSelection,
  };
  if (!currentSelection.targets || currentSelection.targets.length === 0) {
    delete currentSelection.targets;
  }
  const currentTargetCount = currentSelection.targets?.length ?? 0;
  const effectTarget = effectRecord?.target;
  const effectTargetRequiresSelection = effectTargetUsesSelectionContext(effectTarget);
  const effectTargetSelection = getEffectTargetSelectionInput(effectTarget, args.resolutionInput);
  const runtimeCardCandidates =
    effectTarget !== undefined && effectTargetRequiresSelection
      ? resolveCandidateTargets(
          chooserScopedCtx,
          args.cardPlayed,
          normalizeTargetDescriptor(effectTarget),
          {
            controllerId: args.cardPlayed.playerId,
            sourceCardId: args.sourceCardId,
            selectedTargets: normalizeSelectedTargets(effectTargetSelection),
            eventSnapshot: args.resolutionInput.eventSnapshot,
          },
        )
      : analysis.cardCandidates;
  const runtimePlayerCandidates =
    effectTarget !== undefined && effectTargetRequiresSelection
      ? resolveTargetPlayerIds(chooserScopedCtx, effectTarget, {
          controllerId: args.cardPlayed.playerId,
          sourceCardId: args.sourceCardId,
          selectedPlayerIds: resolveSelectedPlayerIds(
            chooserScopedCtx.framework.state.playerIds,
            effectTargetSelection,
          ),
          eventSnapshot: args.resolutionInput.eventSnapshot,
        })
      : analysis.playerCandidates;
  const resolvedContextCardTargets =
    effectTarget !== undefined && effectTargetRequiresSelection
      ? (resolveEffectTargets(
          chooserScopedCtx,
          args.cardPlayed,
          effectTarget,
          effectTargetSelection,
          args.resolutionInput.eventSnapshot,
        ) ?? [])
      : [];
  const resolvedContextPlayerTargets =
    effectTarget !== undefined && effectTargetRequiresSelection
      ? resolveTargetPlayerIds(chooserScopedCtx, effectTarget, {
          controllerId: args.cardPlayed.playerId,
          sourceCardId: args.sourceCardId,
          selectedPlayerIds: resolveSelectedPlayerIds(
            chooserScopedCtx.framework.state.playerIds,
            effectTargetSelection,
          ),
          eventSnapshot: args.resolutionInput.eventSnapshot,
        })
      : [];
  const cardCandidates = [...new Set(runtimeCardCandidates)];
  const playerCandidates = [...new Set(runtimePlayerCandidates)];
  const availability = analyzeTargetSelectionAvailabilityFromAnalysis(args.effect, analysis);
  const candidateCount = cardCandidates.length + playerCandidates.length;
  const hasCandidates = candidateCount > 0;
  const allowEmptyResolution =
    availability.shouldAutoRejectForNoValidTargets &&
    !availability.allowsExplicitEmptyTargetSelection &&
    !availability.canSatisfyRequiredSelection &&
    !hasCandidates;
  if (allowEmptyResolution && args.resolutionInput.targetSelectionResolved) {
    return undefined;
  }
  if (
    currentTargetCount === 0 &&
    effectTargetRequiresSelection &&
    (resolvedContextCardTargets.length > 0 || resolvedContextPlayerTargets.length > 0)
  ) {
    return undefined;
  }
  if (!analysis.requiresExplicitSelection) {
    return undefined;
  }
  if (!hasCandidates && !allowEmptyResolution) {
    return undefined;
  }
  const maxSelections = analysis.allowDuplicateTargets
    ? analysis.maxSelections
    : Math.min(analysis.maxSelections, candidateCount);
  const minSelections = allowEmptyResolution ? 0 : Math.min(analysis.minSelections, maxSelections);
  const requiredSelectionCount = minSelections;
  const hasEnoughSelections = currentTargetCount >= requiredSelectionCount;
  if (
    !allowEmptyResolution &&
    hasEnoughSelections &&
    currentTargetCount >= analysis.maxSelections
  ) {
    return undefined;
  }

  const expectedSlottedKind = deriveSlottedKind(effectRecord);
  const autoResolvedSlots = expectedSlottedKind
    ? deriveAutoResolvedSlots(expectedSlottedKind, effectRecord)
    : undefined;
  const projectedCurrentSelection: ResolutionSelectionCurrentSelection = { ...currentSelection };
  const [onlyTargetDsl] = analysis.targetDsl;
  const onlyTargetCardTypes =
    onlyTargetDsl && typeof onlyTargetDsl === "object" && "cardTypes" in onlyTargetDsl
      ? onlyTargetDsl.cardTypes
      : undefined;
  const isMoveToLocationLocationPrompt =
    expectedSlottedKind === "move-to-location" &&
    analysis.targetDsl.length === 1 &&
    Array.isArray(onlyTargetCardTypes) &&
    onlyTargetCardTypes.includes("location");
  if (isMoveToLocationLocationPrompt && !projectedCurrentSelection.targets?.length) {
    const priorTargets = getContextSelectionTargets(args.resolutionInput).filter(
      (target): target is CardInstanceId | PlayerId =>
        typeof target === "string" && target.length > 0,
    );
    if (priorTargets.length > 0) {
      projectedCurrentSelection.targets = priorTargets;
    }
  }

  return {
    origin: args.origin,
    requestId: args.requestId,
    kind: args.kind,
    sourceCardId: args.sourceCardId,
    chooserId: args.chooserId,
    currentSelection: projectedCurrentSelection,
    submitField: "targets",
    originatesFromOptional: args.originatesFromOptional,
    canDeclineSelection: args.canDeclineSelection,
    targetDsl: [...analysis.targetDsl],
    cardCandidateIds: cardCandidates,
    playerCandidateIds: playerCandidates,
    allowedZones: [...analysis.allowedZones],
    minSelections,
    maxSelections,
    declaredMaxSelections: analysis.declaredMaxSelections ?? analysis.maxSelections,
    ordered: args.ordered === true,
    autoRejected: allowEmptyResolution,
    ...(expectedSlottedKind ? { expectedSlottedKind } : {}),
    ...(autoResolvedSlots && autoResolvedSlots.length > 0 ? { autoResolvedSlots } : {}),
  };
}

/**
 * Tell the UI which `SlottedTargetInput` shape to serialize for this pending
 * effect. Only populated for effect descriptor types that have a dedicated
 * multi-slot entry in `SlottedTargetInput`; single-filter effects (deal-damage,
 * discard, etc.) stay on the flat-array path.
 */
function deriveSlottedKind(
  effectRecord: ReturnType<typeof asRecord>,
): SlottedTargetKind | undefined {
  const type = effectRecord?.type;
  switch (type) {
    case "move-damage":
      return "move-damage";
    case "move-to-location":
      return "move-to-location";
    default:
      return undefined;
  }
}

/**
 * Identify the slot keys the engine already bound to the source card. The
 * canonical signal is a slot whose printed descriptor names `SELF` — that
 * slot is auto-bound to the activating card; only the remaining slots are
 * chooser-filled. Returning the actual keys (instead of a count) lets the
 * UI render the correct direction even when the SELF slot is trailing —
 * e.g. Luisa "I Can Take It" (`from: CHOSEN, to: SELF`), where the previous
 * "leading slots auto-resolved" heuristic flipped FROM and TO and built a
 * submission the engine silently rejected.
 */
function deriveAutoResolvedSlots(
  kind: SlottedTargetKind,
  effectRecord: ReturnType<typeof asRecord>,
): readonly string[] | undefined {
  if (!effectRecord) {
    return undefined;
  }
  if (kind === "move-damage") {
    const auto: string[] = [];
    if (isSelfTargetDescriptor(effectRecord.from)) {
      auto.push("from");
    }
    if (isSelfTargetDescriptor(effectRecord.to)) {
      auto.push("to");
    }
    return auto.length > 0 ? auto : undefined;
  }
  // Other slotted kinds (move-to-location, shift-and-choose, banish-and-play)
  // currently don't expose `SELF`-bound slots in printed effects; leave
  // unset until a card actually needs it.
  return undefined;
}

function isSelfTargetDescriptor(value: unknown): boolean {
  if (value === "SELF") {
    return true;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    (typeof record.ref === "string" &&
      SELF_REF_VALUES.includes(record.ref as MoveDamageRefValue)) ||
    (typeof record.reference === "string" &&
      SELF_REFERENCE_VALUES.includes(record.reference as MoveDamageReferenceValue))
  );
}

type PlayCardEffectRecord = {
  from?: unknown;
  target?: unknown;
  cardType?: unknown;
  costRestriction?: unknown;
  filter?: unknown;
  playMethod?: string;
};

type PlayCardSourceZone = "hand" | "discard" | "inkwell";

function getPlayableSourceZones(from: unknown): PlayCardSourceZone[] {
  if (from === "hand" || from === "discard" || from === "inkwell") {
    return [from];
  }

  if (Array.isArray(from)) {
    return from.filter(
      (zone): zone is PlayCardSourceZone =>
        zone === "hand" || zone === "discard" || zone === "inkwell",
    );
  }

  return ["hand"];
}

function matchesPlayCardTypeConstraint(
  definition: { actionSubtype?: string; cardType?: string; classifications?: string[] },
  expectedType: unknown,
): boolean {
  if (typeof expectedType !== "string") {
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

function isNameRestrictedPlayCard(effectRecord: Record<string, unknown>): boolean {
  const filter = effectRecord.filter;
  if (!filter || typeof filter !== "object" || Array.isArray(filter)) {
    return false;
  }
  const filterRecord = filter as Record<string, unknown>;
  return (
    typeof filterRecord.name === "string" ||
    filterRecord.sameNameAsChosenCard === true ||
    filterRecord.sameInstanceAsSource === true
  );
}

function isContextDependentPlayCardFilter(filter: unknown): boolean {
  if (!filter || typeof filter !== "object" || Array.isArray(filter)) {
    return false;
  }
  const f = filter as Record<string, unknown>;
  return (
    f.excludeChosenCard === true ||
    f.sameNameAsChosenCard === true ||
    f.maxCost === "chosen-card-cost" ||
    (typeof f.maxCost === "object" &&
      f.maxCost !== null &&
      (f.maxCost as Record<string, unknown>).type === "chosen-card-cost")
  );
}

function resolveContextDependentMaxCost(
  filter: unknown,
  ctx: ResolutionSelectionRuntimeContext,
  resolutionInput: PendingActionResolutionInput,
): number | undefined {
  if (!filter || typeof filter !== "object" || Array.isArray(filter)) {
    return undefined;
  }
  const f = filter as Record<string, unknown>;
  if (
    f.maxCost !== "chosen-card-cost" &&
    !(
      typeof f.maxCost === "object" &&
      f.maxCost !== null &&
      (f.maxCost as Record<string, unknown>).type === "chosen-card-cost"
    )
  ) {
    return undefined;
  }

  const offset =
    typeof f.maxCost === "object" && f.maxCost !== null
      ? typeof (f.maxCost as Record<string, unknown>).offset === "number"
        ? ((f.maxCost as Record<string, unknown>).offset as number)
        : 0
      : 0;

  const eventSnapshot = resolutionInput.eventSnapshot;
  const chosenCardCost = eventSnapshot?.chosenCardCost;
  if (typeof chosenCardCost === "number" && Number.isFinite(chosenCardCost)) {
    return chosenCardCost + offset;
  }

  const chosenCardId = eventSnapshot?.chosenCardId as CardInstanceId | undefined;
  if (!chosenCardId) {
    return undefined;
  }

  const chosenDefinition = ctx.cards.getDefinition(chosenCardId) as { cost?: number } | undefined;
  return typeof chosenDefinition?.cost === "number" ? chosenDefinition.cost + offset : undefined;
}

function getPlayCardEntryModeCandidateIds(
  args: ResolutionSelectionBuildArgs,
  eligibleCards: readonly CardInstanceId[],
): CardInstanceId[] {
  return eligibleCards.filter((cardId) => {
    const definition = args.ctx.cards.getDefinition(cardId);
    return definition
      ? hasBodyguard(definition) || hasMayEnterPlayExertedOption(definition)
      : false;
  });
}

function getLegalShiftBaseCandidateIds(
  args: ResolutionSelectionBuildArgs,
  eligibleCards: readonly CardInstanceId[],
  effectRecord: PlayCardEffectRecord,
): CardInstanceId[] {
  if (effectRecord.playMethod !== "shift" && effectRecord.playMethod !== "either") {
    return [];
  }

  const controllerId = args.cardPlayed.playerId;
  const charactersInPlay = args.ctx.framework.zones.getCards({
    zone: "play",
    playerId: controllerId,
  }) as CardInstanceId[];
  const candidateIds = new Set<CardInstanceId>();

  for (const cardId of eligibleCards) {
    const definition = args.ctx.cards.getDefinition(cardId) as LorcanaCardDefinition | undefined;
    const shiftRules = getShiftRules(definition);
    if (!shiftRules) {
      continue;
    }

    for (const shiftTargetId of resolveShiftTargetCandidates(
      shiftRules,
      charactersInPlay,
      (candidateId) =>
        args.ctx.cards.getDefinition(candidateId) as LorcanaCardDefinition | undefined,
    )) {
      candidateIds.add(shiftTargetId);
    }
  }

  return [...candidateIds];
}

function getEligibleZoneCardsForPlayCardEffect(
  args: ResolutionSelectionBuildArgs,
  effectRecord: PlayCardEffectRecord,
  zone: "hand" | "discard" | "inkwell",
): CardInstanceId[] {
  // Context-dependent filters: resolve maxCost from event snapshot so we can
  // compute eligible candidates for the selection context.
  const resolvedContextMaxCost = resolveContextDependentMaxCost(
    effectRecord.filter,
    args.ctx,
    args.resolutionInput,
  );

  // Resolve the target player(s) — mirrors the logic in resolvePlayCardEffect execution.
  const targetPlayerIds =
    typeof effectRecord.target === "string"
      ? resolveTargetPlayerIds(args.ctx, effectRecord.target, {
          controllerId: args.cardPlayed.playerId,
          sourceCardId: args.sourceCardId,
          eventSnapshot: args.resolutionInput.eventSnapshot,
        })
      : [];
  const resolvedPlayerIds =
    targetPlayerIds.length > 0
      ? targetPlayerIds
      : [args.resolutionInput.chooserPlayerId ?? args.cardPlayed.playerId];

  const zoneCardsAccum: CardInstanceId[] = [];
  for (const playerId of resolvedPlayerIds) {
    const zoneCards = args.ctx.framework.zones.getCards({
      zone,
      playerId,
    }) as CardInstanceId[];
    zoneCardsAccum.push(...zoneCards);
  }

  return zoneCardsAccum.filter((cardId) => {
    const definition = args.ctx.cards.getDefinition(cardId) as
      | { actionSubtype?: string; cost?: number; cardType?: string; classifications?: string[] }
      | undefined;
    if (!definition) {
      return false;
    }

    // Top-level card type constraint (e.g. effect.cardType = "character")
    if (!matchesPlayCardTypeConstraint(definition, effectRecord.cardType)) {
      return false;
    }

    // Cost restriction (e.g. costRestriction: { comparison: "less-or-equal", value: 2 })
    const costRestriction = effectRecord.costRestriction;
    if (costRestriction && typeof costRestriction === "object" && !Array.isArray(costRestriction)) {
      const { comparison, value } = costRestriction as { comparison?: unknown; value?: unknown };
      if (typeof comparison === "string" && typeof value === "number") {
        const cardCost = Number(definition.cost ?? Number.NaN);
        if (!Number.isFinite(cardCost)) {
          return false;
        }
        if (comparison === "less-or-equal" && cardCost > value) return false;
        if (comparison === "less-than" && cardCost >= value) return false;
        if (comparison === "equal" && cardCost !== value) return false;
        if (comparison === "greater-than" && cardCost <= value) return false;
        if (comparison === "greater-or-equal" && cardCost < value) return false;
      }
    }

    // Filter-level card type, max cost, and classification constraints
    const filter = effectRecord.filter;
    if (filter && typeof filter === "object" && !Array.isArray(filter)) {
      const filterRecord = filter as Record<string, unknown>;
      if (!matchesPlayCardTypeConstraint(definition, filterRecord.cardType)) {
        return false;
      }
      if (typeof filterRecord.maxCost === "number") {
        const cardCost = Number(definition.cost ?? Number.NaN);
        if (!Number.isFinite(cardCost) || cardCost > filterRecord.maxCost) {
          return false;
        }
      }
      if (resolvedContextMaxCost !== undefined) {
        const cardCost = Number(definition.cost ?? Number.NaN);
        if (!Number.isFinite(cardCost) || cardCost > resolvedContextMaxCost) {
          return false;
        }
      }
      if (
        filterRecord.excludeChosenCard === true &&
        args.resolutionInput.eventSnapshot?.chosenCardId === cardId
      ) {
        return false;
      }
      if (
        typeof filterRecord.classification === "string" &&
        !(definition.classifications ?? []).includes(filterRecord.classification)
      ) {
        return false;
      }
    }

    // Handle CardFilter[] format — e.g. [{ type: "has-keyword", keyword: "Shift" }]
    if (Array.isArray(filter)) {
      if (
        !matchesCardFilterArray(
          filter,
          definition as {
            abilities?: Array<{ type?: string; keyword?: string }>;
            classifications?: string[];
          },
        )
      ) {
        return false;
      }
    }

    return true;
  });
}

function buildPlayCardSelectionContext(
  args: ResolutionSelectionBuildArgs,
  effectRecord: Record<string, unknown>,
  options?: {
    originatesFromOptional?: boolean;
    canDeclineSelection?: boolean;
  },
): TargetResolutionSelectionContext | undefined {
  const sourceZones = getPlayableSourceZones(effectRecord.from);
  const isContextDependent = isContextDependentPlayCardFilter(effectRecord.filter);

  // If the effect is name-restricted (filter.name / sameNameAsChosenCard),
  // the card to play is unambiguous — let the engine auto-select.
  if (isNameRestrictedPlayCard(effectRecord)) {
    return undefined;
  }

  // If a target has already been selected, proceed to execution.
  const alreadySelected =
    normalizeSelectedTargets(getCurrentSelectionInput(args.resolutionInput)) ?? [];
  if (alreadySelected.length > 0) {
    return undefined;
  }

  // Play from discard or inkwell: always require an explicit choice so the player picks the card.
  if (sourceZones.includes("discard") || sourceZones.includes("inkwell")) {
    const eligibleCards = sourceZones.flatMap((zone) =>
      getEligibleZoneCardsForPlayCardEffect(args, effectRecord as PlayCardEffectRecord, zone),
    );
    if (eligibleCards.length === 0) {
      return undefined;
    }

    const playCardEntryModeCandidateIds = getPlayCardEntryModeCandidateIds(args, eligibleCards);
    return {
      origin: args.origin,
      requestId: args.requestId,
      kind: "target-selection",
      sourceCardId: args.sourceCardId,
      chooserId: args.chooserId,
      currentSelection: normalizeCurrentSelection(args.resolutionInput),
      submitField: "targets",
      originatesFromOptional: options?.originatesFromOptional,
      canDeclineSelection: options?.canDeclineSelection,
      targetDsl: [],
      cardCandidateIds: eligibleCards,
      playerCandidateIds: [],
      allowedZones: sourceZones,
      minSelections: 1,
      maxSelections: 1,
      ordered: false,
      autoRejected: false,
      ...(playCardEntryModeCandidateIds.length > 0 ? { playCardEntryModeCandidateIds } : {}),
    };
  }

  const eligibleCards = getEligibleZoneCardsForPlayCardEffect(
    args,
    effectRecord as PlayCardEffectRecord,
    "hand",
  );
  if (eligibleCards.length === 0) {
    return undefined;
  }

  // Multi-player targets (EACH_PLAYER, EACH_OPPONENT, ALL_PLAYERS, OPPONENTS): the execution
  // loop handles each player's selection independently, so no picker is needed here.
  // getEligibleZoneCardsForPlayCardEffect aggregates across all target players, making
  // eligibleCards.length misleading for single-player picker logic.
  const target = effectRecord.target;
  if (
    target === "EACH_PLAYER" ||
    target === "EACH_OPPONENT" ||
    target === "ALL_PLAYERS" ||
    target === "OPPONENTS"
  ) {
    return undefined;
  }

  // Build the hand-picker selection context when:
  // 1. This is a bag-resolution path (original behavior, always show picker).
  // 2. Filter is context-dependent (e.g. "play a character costing up to X").
  // 3. Multiple eligible cards exist and an explicit choice is required (the
  //    engine cannot auto-select when the player must choose among candidates).
  // 4. The play-card effect originates from an optional: always show the picker
  //    so the player can see and confirm which card will be played (R16).
  // When only 1 card is eligible and none of the above apply, the engine
  // auto-selects it, so no picker is needed.
  const playCardEntryModeCandidateIds = getPlayCardEntryModeCandidateIds(args, eligibleCards);
  const legalShiftBaseCandidateIds = getLegalShiftBaseCandidateIds(
    args,
    eligibleCards,
    effectRecord,
  );
  const canSelectShiftBase = legalShiftBaseCandidateIds.length > 0;
  if (
    args.origin !== "bag" &&
    !isContextDependent &&
    eligibleCards.length <= 1 &&
    playCardEntryModeCandidateIds.length === 0 &&
    !canSelectShiftBase &&
    !options?.originatesFromOptional
  ) {
    return undefined;
  }

  const requiresShiftBase = effectRecord.playMethod === "shift";
  return {
    origin: args.origin,
    requestId: args.requestId,
    kind: "target-selection",
    sourceCardId: args.sourceCardId,
    chooserId: args.chooserId,
    currentSelection: normalizeCurrentSelection(args.resolutionInput),
    submitField: "targets",
    originatesFromOptional: options?.originatesFromOptional,
    canDeclineSelection: options?.canDeclineSelection,
    targetDsl: canSelectShiftBase
      ? [
          {
            selector: "chosen",
            zones: ["hand"],
            count: 1,
          },
          {
            selector: "chosen",
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            count: requiresShiftBase ? 1 : { upTo: 1 },
          },
        ]
      : [],
    cardCandidateIds: canSelectShiftBase
      ? [...new Set([...eligibleCards, ...legalShiftBaseCandidateIds])]
      : eligibleCards,
    playerCandidateIds: [],
    allowedZones: canSelectShiftBase ? ["hand", "play"] : ["hand"],
    minSelections: requiresShiftBase ? 2 : 1,
    maxSelections: canSelectShiftBase ? 2 : 1,
    ordered: false,
    autoRejected: false,
    ...(playCardEntryModeCandidateIds.length > 0 ? { playCardEntryModeCandidateIds } : {}),
  };
}

function requiresTargetOrdering(
  ctx: ResolutionSelectionRuntimeContext,
  cardPlayed: CardPlayedPayload,
  effect: Record<string, unknown>,
  resolutionInput: PendingActionResolutionInput,
): boolean {
  if (effect.type !== "put-on-bottom" || effect.ordering !== "player-choice") {
    return false;
  }
  if (isAllTargetDescriptor(effect.target)) {
    return false;
  }

  const candidateTargets =
    resolveEffectTargets(
      ctx,
      cardPlayed,
      effect.target,
      getCombinedSelectionInput(resolutionInput),
    ) ?? [];
  if (candidateTargets.length <= 1) {
    return false;
  }

  const selectedTargets = normalizeSelectedTargets(getCurrentSelectionInput(resolutionInput)) ?? [];
  const candidateSet = new Set(candidateTargets);
  return !(
    selectedTargets.length === candidateTargets.length &&
    new Set(selectedTargets).size === candidateTargets.length &&
    selectedTargets.every((targetId) => candidateSet.has(targetId))
  );
}

function isAllTargetDescriptor(target: unknown): boolean {
  if (!target || typeof target !== "object" || Array.isArray(target)) {
    return false;
  }

  const targetRecord = target as Record<string, unknown>;
  return targetRecord.selector === "all" || targetRecord.count === "all";
}

function buildImmediateSelectionContext(
  args: ResolutionSelectionBuildArgs,
): ResolutionSelectionContext | undefined {
  const effectRecord = asRecord(args.effect);
  if (!effectRecord) {
    return undefined;
  }

  if (effectRecord.type === "sequence") {
    const nestedEffects = Array.isArray(effectRecord.steps)
      ? effectRecord.steps
      : Array.isArray(effectRecord.effects)
        ? effectRecord.effects
        : [];
    // Only return a selection context if the FIRST step needs immediate selection.
    // If the first step executes without selection (e.g. draw), the sequence must
    // execute directly — subsequent steps that need targets (e.g. discard) will
    // be queued as pending effects by the sequence execution pipeline.
    if (nestedEffects.length === 0) {
      return undefined;
    }
    return buildImmediateSelectionContext({
      ...args,
      effect: nestedEffects[0],
    });
  }

  if (effectRecord.type === "conditional") {
    const conditionMet = evaluateActionCondition(
      args.condition ?? (effectRecord.condition as Condition | undefined),
      args.ctx as never,
      args.cardPlayed,
      args.resolutionInput as never,
    );
    const nextEffect = conditionMet
      ? (effectRecord.then ?? effectRecord.effect ?? effectRecord.ifTrue)
      : (effectRecord.else ?? effectRecord.ifFalse);
    return nextEffect
      ? buildImmediateSelectionContext({
          ...args,
          effect: nextEffect,
        })
      : undefined;
  }

  // `pay-cost` wraps another effect with an ink (or other) payment step. The
  // prompt the UI actually needs to render is the inner effect — pay-cost itself
  // has no `chosenBy` / `target`, so if we hand it to the generic builder the
  // chooser resolution falls back to `cardPlayed.playerId` and misattributes
  // `chosenBy: "opponent"` effects (e.g. Basil - Disguised Detective's TWISTS
  // AND TURNS) to the controller. Unwrap like optional/conditional.
  if (effectRecord.type === "pay-cost") {
    const inner = effectRecord.effect;
    return inner
      ? buildImmediateSelectionContext({
          ...args,
          effect: inner,
        })
      : undefined;
  }

  // Optional "you may": when the inner effect's first prompt is already target-selection
  // (e.g. search-deck), merge into one context with originatesFromOptional instead of
  // optional-selection. Inner prompts that are not target-selection (name-a-card, choice,
  // scry, optional nested inside optional, etc.) still surface optional-selection first.
  if (effectRecord.type === "optional") {
    if (effectRecord.chooser === "CHOSEN_PLAYER") {
      const selectedPlayers = resolveSelectedPlayerIds(
        args.ctx.framework.state.playerIds,
        getCombinedSelectionInput(args.resolutionInput),
      );
      if ((selectedPlayers?.length ?? 0) === 0) {
        return buildChosenPlayerTargetSelectionContext({
          ...args,
          chooserId: args.chooserId,
          originatesFromOptional: true,
          canDeclineSelection: true,
        });
      }
    }

    const chooserId = resolveOptionalChooserId(
      args.ctx,
      args.cardPlayed,
      effectRecord,
      args.resolutionInput,
    );
    if (typeof args.resolutionInput.resolveOptional !== "boolean") {
      const immediateContext = effectRecord.effect
        ? buildImmediateSelectionContext({
            ...args,
            effect: effectRecord.effect,
            chooserId,
          })
        : undefined;
      if (
        immediateContext &&
        immediateContext.kind === "target-selection" &&
        immediateContext.currentSelection.resolveOptional === undefined &&
        immediateContext.cardCandidateIds.length + immediateContext.playerCandidateIds.length > 0 &&
        (args.origin !== "bag" ||
          (immediateContext.targetDsl as unknown[]).length > 0 ||
          (immediateContext.playCardEntryModeCandidateIds?.length ?? 0) > 0)
      ) {
        return {
          ...immediateContext,
          originatesFromOptional: true,
          canDeclineSelection: true,
        };
      }
      return buildOptionalSelectionContext({
        ...args,
        chooserId,
      });
    }
    if (!args.resolutionInput.resolveOptional) {
      return undefined;
    }

    return effectRecord.effect
      ? buildImmediateSelectionContext({
          ...args,
          effect: effectRecord.effect,
          chooserId,
          originatesFromOptional: true,
        })
      : undefined;
  }

  if (effectRecord.type === "choice" || effectRecord.type === "or") {
    if (effectRecord.chooser === "CHOSEN_PLAYER") {
      const selectedPlayers = resolveSelectedPlayerIds(
        args.ctx.framework.state.playerIds,
        getCombinedSelectionInput(args.resolutionInput),
      );
      if ((selectedPlayers?.length ?? 0) === 0) {
        return buildChosenPlayerTargetSelectionContext({
          ...args,
          chooserId: args.chooserId,
          originatesFromOptional: args.originatesFromOptional,
        });
      }
    }

    const chooserId = resolveChoiceChooserId(
      args.ctx,
      args.cardPlayed,
      effectRecord,
      args.resolutionInput,
    );
    const options = Array.isArray(effectRecord.options)
      ? effectRecord.options
      : Array.isArray(effectRecord.choices)
        ? effectRecord.choices
        : [];
    const rawChoiceIndex = args.resolutionInput.choiceIndex;
    if (
      options.length > 0 &&
      (typeof rawChoiceIndex !== "number" ||
        !Number.isInteger(rawChoiceIndex) ||
        rawChoiceIndex < 0)
    ) {
      return buildChoiceSelectionContext({
        ...args,
        chooserId,
        effect: effectRecord,
        legalChoiceIndices: args.legalChoiceIndices ?? deriveLegalChoiceIndices(args, options),
      });
    }

    const chosenEffect =
      typeof rawChoiceIndex === "number" && rawChoiceIndex >= 0
        ? options[Math.min(rawChoiceIndex, Math.max(options.length - 1, 0))]
        : undefined;

    return chosenEffect
      ? buildImmediateSelectionContext({
          ...args,
          effect: chosenEffect,
          chooserId,
        })
      : undefined;
  }

  if (effectRecord.type === "name-a-card") {
    if (
      typeof args.resolutionInput.namedCard !== "string" ||
      args.resolutionInput.namedCard.trim().length === 0
    ) {
      return buildNameCardSelectionContext(args);
    }
    return undefined;
  }

  if (effectRecord.chooser === "CHOSEN_PLAYER" || effectRecord.target === "CHOSEN_PLAYER") {
    const selectedPlayers = resolveSelectedPlayerIds(
      args.ctx.framework.state.playerIds,
      getCombinedSelectionInput(args.resolutionInput),
    );
    if ((selectedPlayers?.length ?? 0) === 0) {
      return buildChosenPlayerTargetSelectionContext({
        ...args,
        originatesFromOptional: args.originatesFromOptional,
      });
    }
  }

  if (effectRecord.type === "scry") {
    const hasExplicitDestinations =
      Array.isArray(args.resolutionInput.destinations) &&
      args.resolutionInput.destinations.length > 0;
    if (!hasExplicitDestinations) {
      return buildScrySelectionContext({
        ...args,
        effect: effectRecord,
      });
    }
    return undefined;
  }

  if (effectRecord.type === "play-card") {
    return buildPlayCardSelectionContext(args, effectRecord, {
      originatesFromOptional: args.originatesFromOptional,
    });
  }

  if (effectRecord.type === "search-deck") {
    return buildSearchDeckSelectionContext(args, effectRecord);
  }

  const ordered = requiresTargetOrdering(
    args.ctx,
    args.cardPlayed,
    effectRecord,
    args.resolutionInput,
  );
  return buildGenericTargetSelectionContext({
    ...args,
    effect: effectRecord,
    kind:
      effectRecord.type === "discard" && effectRecord.chosen === true
        ? "discard-choice"
        : "target-selection",
    ordered,
    chooserId: resolveDefaultTargetChooserId(
      args.ctx,
      args.cardPlayed,
      effectRecord,
      args.resolutionInput,
      args.chooserId,
    ),
    originatesFromOptional: args.originatesFromOptional,
  });
}

export function buildResolutionSelectionContext(
  args: ResolutionSelectionBuildArgs,
): ResolutionSelectionContext | undefined {
  return buildImmediateSelectionContext(args);
}
