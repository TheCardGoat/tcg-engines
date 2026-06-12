import type { CardInstanceId, PlayerId, RuntimeValidationResult } from "#core";
import {
  createLorcanaGameLogEntry,
  createLorcanaLogMessage,
  createLorcanaLogProjection,
  type LorcanaMoveDefinition,
} from "../../types";
import type {
  PendingActionEffect,
  PendingActionResolutionInput,
  TargetResolutionSelectionContext,
} from "../../types";
import type { LogTargetId, ScryDestinationEntry } from "../../types/log-messages";
import { resolveActionEffect } from "./action-effects/composed-effect-resolver";
import { isScryEffect, validateScrySelection } from "./action-effects/scry-effect";
import { buildResolutionSelectionContext } from "./action-effects/selection-context";
import { resolveRecordedVanishTargets } from "./action-effects/vanish";
import {
  clearPendingActionChoice,
  enqueuePendingActionEffect,
  finalizeResolvedActionCard,
  mergeActionResolutionInput,
  removePendingActionEffect,
  createPendingActionEffect,
} from "./action-effects/pending-action-effects";
import {
  flushTriggeredEventsToBag,
  hasPendingBagItems,
  removeBagItemMatchingPendingSource,
} from "../effects/triggered-abilities";
import { emitBeChosenEvents } from "../effects/be-chosen";
import { continuePendingChallengeResolution } from "../moves/core/challenge";
import { continuePendingTurnTransition } from "../moves/turn/pass-turn";
import {
  formatLorcanaPlayerLabel,
  getLorcanaCardName,
  traceLorcanaRuntimeStep,
} from "../../runtime-trace";
import {
  clearCurrentSelectionTargets,
  getContextSelectionTargets,
  getCurrentSelectionInput,
  getCurrentSelectionTargets,
  promoteCurrentSelectionTargetsToContext,
  withCurrentSelectionTargets,
  type SelectionTarget,
} from "./action-effects/selection-state";
import {
  analyzeEffectTargets,
  buildMissingTargetSelectionError,
  countExplicitTargetSelections,
  hasExplicitTargetSelectionInput,
  validateAndNormalizeTargetSelection,
} from "../../targeting/runtime";
import { resolveTurnOwnerId } from "../../core/runtime/turn-owner";
import { flattenSlottedTargets, isSlottedTargetInput } from "../../targeting/slotted-targets";

function effectContainsRequireDifferentTargets(effect: unknown): boolean {
  if (!effect || typeof effect !== "object") return false;
  if (Array.isArray(effect)) return effect.some(effectContainsRequireDifferentTargets);
  const record = effect as Record<string, unknown>;
  if (record.requireDifferentTargets === true) return true;
  return Object.values(record).some(effectContainsRequireDifferentTargets);
}

type ResolveEffectValidationContext = Parameters<
  NonNullable<LorcanaMoveDefinition<"resolveEffect">["validate"]>
>[0];

type ResolveEffectExecutionContext = Parameters<
  LorcanaMoveDefinition<"resolveEffect">["execute"]
>[0];

type ResolveEffectEnumerationContext = Parameters<
  NonNullable<LorcanaMoveDefinition<"resolveEffect">["available"]>
>[0];

function toLogTargetId(value: string): LogTargetId {
  return value as LogTargetId;
}

function normalizeResolveEffectTargets(
  targets:
    | PendingActionResolutionInput["currentTargets"]
    | PendingActionResolutionInput["targets"]
    | undefined,
): LogTargetId[] {
  if (typeof targets === "string") {
    return [toLogTargetId(targets)];
  }

  if (Array.isArray(targets)) {
    return targets
      .filter((target): target is string => typeof target === "string")
      .map(toLogTargetId);
  }

  return [];
}

function resolvePendingEffectAbilityName(
  ctx: ResolveEffectExecutionContext,
  pendingEffect: PendingActionEffect,
): string | undefined {
  const abilityIndex = pendingEffect.abilityIndex;
  if (typeof abilityIndex !== "number") {
    return undefined;
  }

  const abilityName = ctx.cards.getDefinition(pendingEffect.sourceCardId)?.abilities?.[abilityIndex]
    ?.name;
  return typeof abilityName === "string" && abilityName.trim().length > 0
    ? abilityName.trim()
    : undefined;
}

function countResolvedTargets(
  targets:
    | PendingActionResolutionInput["currentTargets"]
    | PendingActionResolutionInput["targets"]
    | undefined,
): number {
  if (typeof targets === "string") {
    return targets.length > 0 ? 1 : 0;
  }

  if (Array.isArray(targets)) {
    return targets.filter(
      (target): target is string => typeof target === "string" && target.length > 0,
    ).length;
  }

  return 0;
}

function countContinuationContextTargets(
  pendingEffect: PendingActionEffect,
  resolutionInput: PendingActionResolutionInput,
): number {
  return pendingEffect.kind === "target-selection"
    ? countResolvedTargets(getCurrentSelectionInput(resolutionInput))
    : 0;
}

function buildContinuationResolutionInput(
  pendingEffect: PendingActionEffect,
  resolutionInput: PendingActionResolutionInput,
): PendingActionResolutionInput {
  // Clear resolveOptional from the continuation input so that an optional
  // acceptance/decline from the current pending effect does not bleed into
  // subsequent optional effects in the continuation sequence.
  const inputWithoutOptional: PendingActionResolutionInput =
    resolutionInput.resolveOptional !== undefined
      ? { ...resolutionInput, resolveOptional: undefined }
      : resolutionInput;
  const inputWithoutTransientSelectionState =
    inputWithoutOptional.targetSelectionResolved !== undefined
      ? {
          ...inputWithoutOptional,
          targetSelectionResolved: undefined,
        }
      : inputWithoutOptional;
  // Clear destinations and scry-specific eventSnapshot fields so that the
  // current effect's resolution choices do not bleed into subsequent continuation
  // steps (e.g. P1 scry destinations and revealedCardIds leaking into the P2
  // scry in a multi-player sequence like Let's Get Dangerous).
  // We preserve the rest of eventSnapshot (e.g. lastEffectTargetCount) since
  // continuation steps like for-each may depend on it.
  const needsClearDestinations = inputWithoutTransientSelectionState.destinations !== undefined;
  const needsClearRevealedCards =
    inputWithoutTransientSelectionState.eventSnapshot?.revealedCardIds !== undefined ||
    inputWithoutTransientSelectionState.eventSnapshot?.revealWindowIds !== undefined;
  const inputWithoutTransientDestinations =
    needsClearDestinations || needsClearRevealedCards
      ? {
          ...inputWithoutTransientSelectionState,
          destinations: undefined,
          ...(needsClearRevealedCards
            ? {
                eventSnapshot: {
                  ...inputWithoutTransientSelectionState.eventSnapshot,
                  revealedCardIds: undefined,
                  revealWindowIds: undefined,
                },
              }
            : {}),
        }
      : inputWithoutTransientSelectionState;

  if (pendingEffect.kind === "target-selection") {
    return promoteCurrentSelectionTargetsToContext(inputWithoutTransientDestinations);
  }

  if (countResolvedTargets(getCurrentSelectionInput(inputWithoutTransientDestinations)) > 0) {
    return promoteCurrentSelectionTargetsToContext(inputWithoutTransientDestinations);
  }

  return clearCurrentSelectionTargets(inputWithoutTransientDestinations);
}

function getScryDestinationLogLabel(zone: string): string {
  switch (zone) {
    case "deck-top":
      return "Top of deck";
    case "deck-bottom":
      return "Bottom of deck";
    case "hand":
      return "Hand";
    case "play":
      return "Play";
    case "inkwell":
      return "Inkwell";
    case "discard":
      return "Discard";
    default:
      return zone;
  }
}

function buildRevealedZoneSet(pendingEffect: PendingActionEffect): Set<string> {
  const revealedZones = new Set<string>();
  const effect = pendingEffect.effect as
    | { destinations?: Array<{ zone?: unknown; reveal?: unknown }> }
    | undefined;
  const effectDestinations = Array.isArray(effect?.destinations) ? effect.destinations : [];
  for (const dest of effectDestinations) {
    if (dest && typeof dest === "object" && typeof dest.zone === "string" && dest.reveal === true) {
      revealedZones.add(dest.zone);
    }
  }
  return revealedZones;
}

function buildScrySelectionLogDetail(
  ctx: ResolveEffectExecutionContext,
  pendingEffect: PendingActionEffect,
  resolutionInput: PendingActionResolutionInput,
): {
  selection: string[];
  destinations: ScryDestinationEntry[];
  deckTopCards?: CardInstanceId[];
  deckBottomCards?: CardInstanceId[];
  handCards?: CardInstanceId[];
  playCards?: CardInstanceId[];
  inkwellCards?: CardInstanceId[];
  discardCards?: CardInstanceId[];
} {
  if (!Array.isArray(resolutionInput.destinations)) {
    return { selection: [], destinations: [] };
  }

  const revealedZones = buildRevealedZoneSet(pendingEffect);

  const detail: {
    selection: string[];
    destinations: ScryDestinationEntry[];
    deckTopCards?: CardInstanceId[];
    deckBottomCards?: CardInstanceId[];
    handCards?: CardInstanceId[];
    playCards?: CardInstanceId[];
    inkwellCards?: CardInstanceId[];
    discardCards?: CardInstanceId[];
  } = { selection: [], destinations: [] };

  for (const destination of resolutionInput.destinations) {
    if (!destination || typeof destination.zone !== "string" || !Array.isArray(destination.cards)) {
      continue;
    }

    const cardIds = destination.cards.filter(
      (cardId): cardId is CardInstanceId => typeof cardId === "string" && cardId.length > 0,
    );
    if (cardIds.length === 0) {
      continue;
    }
    const cardNames = cardIds.map(
      (cardId) => getLorcanaCardName(cardId, ctx.cards.getDefinition) ?? cardId,
    );

    detail.selection.push(
      `${getScryDestinationLogLabel(destination.zone)}: ${cardNames.join(", ")}`,
    );
    const isRevealed = revealedZones.has(destination.zone);
    detail.destinations.push({
      zone: destination.zone,
      cardIds,
      ...(isRevealed ? { revealed: true } : {}),
    });
    switch (destination.zone) {
      case "deck-top":
        detail.deckTopCards = cardIds;
        break;
      case "deck-bottom":
        detail.deckBottomCards = cardIds;
        break;
      case "hand":
        detail.handCards = cardIds;
        break;
      case "play":
        detail.playCards = cardIds;
        break;
      case "inkwell":
        detail.inkwellCards = cardIds;
        break;
      case "discard":
        detail.discardCards = cardIds;
        break;
    }
  }

  return detail;
}

function logResolveEffectMessage(
  ctx: ResolveEffectExecutionContext,
  pendingEffect: PendingActionEffect,
  resolutionInput: PendingActionResolutionInput,
): void {
  const common = {
    playerId: pendingEffect.chooserId,
    sourceCardId: pendingEffect.sourceCardId,
  };

  const visibility = { mode: "PUBLIC" as const };
  const category = "action" as const;
  const selectedTargets = normalizeResolveEffectTargets(getCurrentSelectionInput(resolutionInput));
  const abilityName = resolvePendingEffectAbilityName(ctx, pendingEffect);

  if (pendingEffect.kind === "scry-selection") {
    const selection = buildScrySelectionLogDetail(ctx, pendingEffect, resolutionInput);
    const hasSelection = selection.selection.length > 0;

    // Build a public-only view of the selection, scoped to destinations whose
    // cards were revealed to all players (e.g. "reveal a Toy character and put
    // it into your hand"). Non-chooser viewers still get the revealed cards in
    // the log; non-revealed destinations (e.g. cards put on the bottom of the
    // deck) remain hidden.
    const publicDestinations = selection.destinations.filter((d) => d.revealed === true);
    const publicSelection =
      publicDestinations.length > 0
        ? {
            selection: publicDestinations.map((d) => {
              const names = d.cardIds.map(
                (cardId) => getLorcanaCardName(cardId, ctx.cards.getDefinition) ?? cardId,
              );
              return `${getScryDestinationLogLabel(d.zone)}: ${names.join(", ")}`;
            }),
            destinations: publicDestinations,
          }
        : undefined;

    const scryVisibility = hasSelection
      ? {
          mode: "PUBLIC_WITH_OVERRIDES" as const,
          overrides: {
            [pendingEffect.chooserId]: createLorcanaLogMessage(
              "lorcana.effect.resolve.scrySelection.detail",
              { ...common, ...selection },
            ),
          },
        }
      : visibility;

    // typedEntry uses the detail version so the acting player sees
    // what cards went where. The adapter strips this for other players
    // based on the PUBLIC_WITH_OVERRIDES visibility.
    const typedEntry = hasSelection
      ? createLorcanaGameLogEntry(
          "lorcana.effect.resolve.scrySelection.detail",
          { ...common, ...selection },
          { mode: "PRIVATE", visibleTo: [pendingEffect.chooserId] },
          category,
        )
      : createLorcanaGameLogEntry(
          "lorcana.effect.resolve.scrySelection",
          common,
          visibility,
          category,
        );

    const defaultMessage = publicSelection
      ? createLorcanaLogMessage("lorcana.effect.resolve.scrySelection.detail", {
          ...common,
          ...publicSelection,
        })
      : createLorcanaLogMessage("lorcana.effect.resolve.scrySelection", common);

    ctx.framework.log({
      category,
      visibility: scryVisibility,
      defaultMessage,
      typedEntry,
    });
    return;
  }

  const projection = (() => {
    switch (pendingEffect.kind) {
      case "discard-choice":
        return createLorcanaLogProjection(
          "lorcana.effect.resolve.discardChoice",
          {
            ...common,
            targets: normalizeResolveEffectTargets(getCurrentSelectionInput(resolutionInput)),
          },
          visibility,
          category,
        );
      case "target-selection":
        return createLorcanaLogProjection(
          "lorcana.effect.resolve.targetSelection",
          {
            ...common,
            targets: selectedTargets,
            effectType: getPendingEffectLogEffectType(pendingEffect),
          },
          visibility,
          category,
        );
      case "choice-selection": {
        const revealedCardId = resolutionInput.eventSnapshot?.revealedCardIds?.[0];
        const choiceContext = pendingEffect.selectionContext;
        const choiceLabel =
          typeof resolutionInput.choiceIndex === "number" &&
          choiceContext?.kind === "choice-selection"
            ? choiceContext.options.find((option) => option.index === resolutionInput.choiceIndex)
                ?.label
            : undefined;
        if (revealedCardId) {
          return createLorcanaLogProjection(
            "lorcana.effect.resolve.choiceSelection.withReveal",
            {
              ...common,
              revealedCardId,
              choiceIndex: (resolutionInput.choiceIndex ?? 0) + 1,
              choiceLabel,
            },
            visibility,
            category,
          );
        }
        return createLorcanaLogProjection(
          "lorcana.effect.resolve.choiceSelection",
          {
            ...common,
            choiceIndex: (resolutionInput.choiceIndex ?? 0) + 1,
            choiceLabel,
          },
          visibility,
          category,
        );
      }
      case "optional-selection":
        if (resolutionInput.resolveOptional && selectedTargets.length > 0) {
          return abilityName
            ? createLorcanaLogProjection(
                "lorcana.effect.resolve.optionalSelection.accepted.targets.named",
                {
                  playerId: pendingEffect.chooserId,
                  sourceCardId: pendingEffect.sourceCardId,
                  abilityName,
                  targets: selectedTargets,
                },
                visibility,
                category,
              )
            : createLorcanaLogProjection(
                "lorcana.effect.resolve.optionalSelection.accepted.targets",
                {
                  playerId: pendingEffect.chooserId,
                  sourceCardId: pendingEffect.sourceCardId,
                  targets: selectedTargets,
                },
                visibility,
                category,
              );
        }
        return createLorcanaLogProjection(
          resolutionInput.resolveOptional
            ? "lorcana.effect.resolve.optionalSelection.accepted"
            : "lorcana.effect.resolve.optionalSelection.rejected",
          common,
          visibility,
          category,
        );
      case "name-card-selection":
        return createLorcanaLogProjection(
          "lorcana.effect.resolve.nameCardSelection",
          {
            ...common,
            namedCard: resolutionInput.namedCard ?? "",
          },
          visibility,
          category,
        );
      default:
        return assertNever(pendingEffect.kind);
    }
  })();

  ctx.framework.log(projection);
}

function getPendingEffectLogEffectType(pendingEffect: PendingActionEffect): string | undefined {
  const effect = pendingEffect.effect;
  if (!effect || typeof effect !== "object" || Array.isArray(effect)) {
    return undefined;
  }

  const type = (effect as { type?: unknown }).type;
  return typeof type === "string" ? type : undefined;
}

function isValidActionResolutionAmount(value: unknown): boolean {
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0;
  }

  if (typeof value === "string") {
    return value.length > 0;
  }

  return typeof value === "object" && value !== null;
}

function isValidTargetInput(value: unknown): boolean {
  if (value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.length > 0;
  }

  if (isSlottedTargetInput(value)) {
    return flattenSlottedTargets(value).every((entry) => typeof entry === "string");
  }

  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isValidDestinations(value: unknown): boolean {
  if (value === undefined) {
    return true;
  }

  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((destination) => {
    if (!destination || typeof destination !== "object" || Array.isArray(destination)) {
      return false;
    }

    const record = destination as Record<string, unknown>;
    if (typeof record.zone !== "string" || record.zone.length === 0) {
      return false;
    }

    if (typeof record.cards === "string") {
      return record.cards.length > 0;
    }

    return (
      Array.isArray(record.cards) && record.cards.every((cardId) => typeof cardId === "string")
    );
  });
}

function normalizeResolveEffectParams(params: unknown): PendingActionResolutionInput {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    return {};
  }

  const record = params as Record<string, unknown>;
  const normalized: PendingActionResolutionInput = {};

  if (record.amount !== undefined) {
    normalized.amount = record.amount as PendingActionResolutionInput["amount"];
  }
  if (typeof record.namedCard === "string" && record.namedCard.trim().length > 0) {
    normalized.namedCard = record.namedCard.trim();
  }

  if (typeof record.choiceIndex === "number" && Number.isInteger(record.choiceIndex)) {
    normalized.choiceIndex = record.choiceIndex;
  }

  if (Array.isArray(record.destinations)) {
    normalized.destinations = record.destinations as PendingActionResolutionInput["destinations"];
  }

  if (typeof record.resolveOptional === "boolean") {
    normalized.resolveOptional = record.resolveOptional;
  }

  if (typeof record.enterPlayExerted === "boolean") {
    normalized.enterPlayExerted = record.enterPlayExerted;
  }

  if (record.targets !== undefined && isValidTargetInput(record.targets)) {
    if (isSlottedTargetInput(record.targets)) {
      const flat = flattenSlottedTargets(record.targets);
      normalized.slottedTargets = record.targets;
      normalized.currentTargets = flat as PendingActionResolutionInput["currentTargets"];
      normalized.targets = flat as PendingActionResolutionInput["targets"];
    } else {
      normalized.currentTargets = record.targets as PendingActionResolutionInput["currentTargets"];
      normalized.targets = record.targets as PendingActionResolutionInput["targets"];
    }
  }

  if (
    normalized.resolveOptional === undefined &&
    (normalized.choiceIndex !== undefined ||
      normalized.namedCard !== undefined ||
      normalized.enterPlayExerted !== undefined ||
      normalized.destinations !== undefined ||
      normalized.targets !== undefined ||
      normalized.currentTargets !== undefined ||
      normalized.amount !== undefined)
  ) {
    normalized.resolveOptional = true;
  }

  return normalized;
}

function getTargetSelectionValidationInput(
  normalizedParams: PendingActionResolutionInput,
  targetSelectionContext: TargetResolutionSelectionContext | undefined,
): PendingActionResolutionInput["targets"] {
  const slottedTargets = normalizedParams.slottedTargets;
  if (
    targetSelectionContext?.kind === "target-selection" &&
    targetSelectionContext.expectedSlottedKind === "move-to-location" &&
    targetSelectionContext.targetDsl.length === 1 &&
    slottedTargets?.kind === "move-to-location"
  ) {
    const [targetDsl] = targetSelectionContext.targetDsl;
    const cardTypes =
      targetDsl && typeof targetDsl === "object" && "cardTypes" in targetDsl
        ? targetDsl.cardTypes
        : undefined;
    if (Array.isArray(cardTypes) && cardTypes.includes("location")) {
      return [...slottedTargets.location] as PendingActionResolutionInput["targets"];
    }

    return [...slottedTargets.subject] as PendingActionResolutionInput["targets"];
  }

  return normalizedParams.targets;
}

function getPendingEffect(
  ctx:
    | ResolveEffectValidationContext
    | ResolveEffectExecutionContext
    | ResolveEffectEnumerationContext,
  effectId: string,
): PendingActionEffect | undefined {
  const pendingEffects = ctx.G.pendingEffects ?? [];
  return pendingEffects.find((effect) => effect.id === effectId) as PendingActionEffect | undefined;
}

function validatePendingEffectParams(
  ctx: ResolveEffectValidationContext,
  pendingEffect: PendingActionEffect,
  params: unknown,
): RuntimeValidationResult {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    return {
      valid: false,
      error: "resolveEffect params must be an object",
      errorCode: "INVALID_RESOLVE_EFFECT_PARAMS",
    };
  }

  const record = params as Record<string, unknown>;
  if (!isValidTargetInput(record.targets)) {
    return {
      valid: false,
      error: "resolveEffect targets must be a card id or an array of card ids",
      errorCode: "INVALID_RESOLVE_EFFECT_TARGETS",
    };
  }
  if (record.amount !== undefined && !isValidActionResolutionAmount(record.amount)) {
    return {
      valid: false,
      error: "resolveEffect amount must be a valid Amount value",
      errorCode: "INVALID_RESOLVE_EFFECT_AMOUNT",
    };
  }
  if (
    record.choiceIndex !== undefined &&
    (typeof record.choiceIndex !== "number" ||
      !Number.isInteger(record.choiceIndex) ||
      record.choiceIndex < 0)
  ) {
    return {
      valid: false,
      error: "resolveEffect choiceIndex must be a non-negative integer",
      errorCode: "INVALID_RESOLVE_EFFECT_CHOICE_INDEX",
    };
  }
  if (record.resolveOptional !== undefined && typeof record.resolveOptional !== "boolean") {
    return {
      valid: false,
      error: "resolveEffect resolveOptional must be a boolean",
      errorCode: "INVALID_RESOLVE_EFFECT_OPTIONAL",
    };
  }
  if (record.enterPlayExerted !== undefined && typeof record.enterPlayExerted !== "boolean") {
    return {
      valid: false,
      error: "resolveEffect enterPlayExerted must be a boolean",
      errorCode: "INVALID_RESOLVE_EFFECT_ENTER_PLAY_EXERTED",
    };
  }
  if (!isValidDestinations(record.destinations)) {
    return {
      valid: false,
      error: "resolveEffect destinations must be a valid destination array",
      errorCode: "INVALID_RESOLVE_EFFECT_DESTINATIONS",
    };
  }

  const normalizedParams = normalizeResolveEffectParams(params);
  const normalizedTargets = normalizedParams.targets;
  const hasExplicitTargets = hasExplicitTargetSelectionInput(normalizedTargets);
  const explicitTargetCount = countExplicitTargetSelections(normalizedTargets);
  const selectionContext = pendingEffect.selectionContext;
  const targetSelectionContext =
    selectionContext?.kind === "discard-choice" || selectionContext?.kind === "target-selection"
      ? selectionContext
      : undefined;
  const allowsEmptyTargetResolution = (targetSelectionContext?.minSelections ?? 1) === 0;
  const allowsOptionalDecline =
    normalizedParams.resolveOptional === false &&
    (targetSelectionContext?.originatesFromOptional === true ||
      targetSelectionContext?.canDeclineSelection === true);

  if (pendingEffect.kind === "discard-choice" || pendingEffect.kind === "target-selection") {
    if (!hasExplicitTargets && !allowsEmptyTargetResolution && !allowsOptionalDecline) {
      return {
        valid: false,
        error: buildMissingTargetSelectionError("resolveEffect", pendingEffect.effect),
        errorCode: "RESOLVE_EFFECT_TARGETS_REQUIRED",
      };
    }

    if (
      (targetSelectionContext?.minSelections ?? 1) > 0 &&
      explicitTargetCount === 0 &&
      !allowsOptionalDecline
    ) {
      return {
        valid: false,
        error: "resolveEffect requires at least 1 explicit target for this pending effect",
        errorCode: "RESOLVE_EFFECT_TARGETS_REQUIRED",
      };
    }

    if (hasExplicitTargets) {
      const analysis = analyzeEffectTargets(
        pendingEffect.effect,
        pendingEffect.controllerId,
        ctx,
        pendingEffect.sourceCardId,
        {
          includeDeferredChosenSelections: true,
        },
      );
      const scCardCandidates =
        targetSelectionContext && targetSelectionContext.cardCandidateIds.length > 0
          ? targetSelectionContext.cardCandidateIds
          : undefined;
      const scPlayerCandidates =
        targetSelectionContext && targetSelectionContext.playerCandidateIds.length > 0
          ? targetSelectionContext.playerCandidateIds
          : undefined;
      const targetValidation = validateAndNormalizeTargetSelection(
        getTargetSelectionValidationInput(normalizedParams, targetSelectionContext),
        {
          ...analysis,
          cardCandidates: scCardCandidates ?? analysis.cardCandidates,
          playerCandidates: scPlayerCandidates ?? analysis.playerCandidates,
          minSelections: targetSelectionContext?.minSelections ?? analysis.minSelections,
          maxSelections: targetSelectionContext?.maxSelections ?? analysis.maxSelections,
        },
        {
          currentPlayer: pendingEffect.chooserId,
          ctx,
        },
      );
      if (!targetValidation.valid) {
        return targetValidation;
      }
    }
  }

  if (pendingEffect.kind === "choice-selection" && normalizedParams.choiceIndex === undefined) {
    return {
      valid: false,
      error: "resolveEffect requires choiceIndex for this pending effect",
      errorCode: "RESOLVE_EFFECT_CHOICE_REQUIRED",
    };
  }

  if (
    pendingEffect.kind === "optional-selection" &&
    normalizedParams.resolveOptional === undefined
  ) {
    return {
      valid: false,
      error: "resolveEffect requires resolveOptional for this pending effect",
      errorCode: "RESOLVE_EFFECT_OPTIONAL_REQUIRED",
    };
  }

  if (
    pendingEffect.kind === "optional-selection" &&
    normalizedParams.resolveOptional === true &&
    hasExplicitTargets
  ) {
    const optionalEffect = pendingEffect.effect as Record<string, unknown> | null | undefined;
    const innerEffect = optionalEffect?.effect;
    if (innerEffect) {
      const innerAnalysis = analyzeEffectTargets(
        innerEffect,
        pendingEffect.controllerId,
        ctx,
        pendingEffect.sourceCardId,
        {
          includeDeferredChosenSelections: true,
          eventSnapshot: pendingEffect.resolutionInput.eventSnapshot,
        },
      );
      // When maxSelections is 0 the effect takes no card targets; any explicit
      // targets provided are unconditionally illegal.
      if (innerAnalysis.maxSelections === 0 && (normalizedTargets?.length ?? 0) > 0) {
        return {
          valid: false,
          error: "Effect accepts no card targets",
          errorCode: "INVALID_ACTION_TARGET" as const,
        };
      }
      // Validate targets against candidates when candidates exist.  When there
      // are no candidates the optional effect simply cannot fire; the resolution
      // itself is still allowed so the action completes normally.
      // When the inner effect requires a target different from prior-step selections,
      // filter the context targets (previously selected cards) out of the candidate
      // list so the same card cannot be chosen for both steps.
      // Two sources of prior-step targets are checked:
      //  1. contextTargets — set when targets flow inline through the sequence
      //  2. previouslyTargetedCardIds — set in eventSnapshot when steps are staged
      //     as separate pending effects (e.g. Three Arrows optional second shot)
      const contextTargets = getContextSelectionTargets(pendingEffect.resolutionInput);
      const previouslyTargetedCardIds =
        pendingEffect.resolutionInput.eventSnapshot?.previouslyTargetedCardIds ?? [];
      const allPriorTargets = [
        ...contextTargets,
        ...(previouslyTargetedCardIds as readonly string[]),
      ];
      const requiresDifferentTarget =
        allPriorTargets.length > 0 && effectContainsRequireDifferentTargets(innerEffect);
      const normalizedTargetList = normalizeResolveEffectTargets(normalizedTargets);
      if (
        requiresDifferentTarget &&
        normalizedTargetList.some((target) => allPriorTargets.includes(target as SelectionTarget))
      ) {
        return {
          valid: false,
          error: "Target has already been chosen for a prior step",
          errorCode: "INVALID_ACTION_TARGET" as const,
        };
      }

      const contextualInnerAnalysis =
        targetSelectionContext?.kind === "target-selection" ||
        targetSelectionContext?.kind === "discard-choice"
          ? {
              ...innerAnalysis,
              targetDsl: [...targetSelectionContext.targetDsl],
              cardCandidates: [...targetSelectionContext.cardCandidateIds],
              playerCandidates: [...targetSelectionContext.playerCandidateIds],
              allowedZones: [...targetSelectionContext.allowedZones],
              minSelections: targetSelectionContext.minSelections,
              maxSelections: targetSelectionContext.maxSelections,
              declaredMaxSelections: targetSelectionContext.declaredMaxSelections,
            }
          : innerAnalysis;
      const innerAnalysisForValidation = requiresDifferentTarget
        ? {
            ...contextualInnerAnalysis,
            cardCandidates: contextualInnerAnalysis.cardCandidates.filter(
              (id) => !allPriorTargets.includes(id as SelectionTarget),
            ),
          }
        : contextualInnerAnalysis;
      if (innerAnalysisForValidation.cardCandidates.length > 0) {
        const innerTargetValidation = validateAndNormalizeTargetSelection(
          normalizedTargets,
          innerAnalysisForValidation,
          {
            currentPlayer: pendingEffect.chooserId,
            ctx,
          },
        );
        if (!innerTargetValidation.valid) {
          return innerTargetValidation;
        }
      } else if (
        requiresDifferentTarget &&
        contextualInnerAnalysis.cardCandidates.length > 0 &&
        (normalizedTargets?.length ?? 0) > 0
      ) {
        // All remaining candidates were filtered because they were already targeted.
        // Explicit targets were still provided — reject them as invalid.
        return {
          valid: false,
          error: "Target has already been chosen for a prior step",
          errorCode: "INVALID_ACTION_TARGET" as const,
        };
      }
    }
  }

  if (pendingEffect.kind === "scry-selection" && !Array.isArray(normalizedParams.destinations)) {
    return {
      valid: false,
      error: "resolveEffect requires destinations for this pending effect",
      errorCode: "RESOLVE_EFFECT_DESTINATIONS_REQUIRED",
    };
  }

  if (
    pendingEffect.kind === "name-card-selection" &&
    (typeof record.namedCard !== "string" || record.namedCard.trim().length === 0)
  ) {
    return {
      valid: false,
      error: "resolveEffect requires namedCard for this pending effect",
      errorCode: "RESOLVE_EFFECT_NAMED_CARD_REQUIRED",
    };
  }

  if (pendingEffect.kind === "scry-selection" && isScryEffect(pendingEffect.effect)) {
    const normalizedParams = normalizeResolveEffectParams(params);
    const scryValidation = validateScrySelection(
      ctx,
      pendingEffect.cardPlayed,
      pendingEffect.effect,
      {
        destinations: normalizedParams.destinations,
        lookedAtCards: pendingEffect.resolutionInput.eventSnapshot?.revealedCardIds,
        revealWindowIds: pendingEffect.resolutionInput.eventSnapshot?.revealWindowIds,
        scryAmount: pendingEffect.resolutionInput.eventSnapshot?.revealedCardIds?.length,
      },
    );

    if (!scryValidation.valid) {
      return scryValidation;
    }
  }

  return { valid: true };
}

export const resolveEffect: LorcanaMoveDefinition<"resolveEffect"> = {
  ignorePriority: true,

  validate: (ctx): RuntimeValidationResult => {
    const effectId = ctx.args.effectId;
    if (typeof effectId !== "string" || effectId.length === 0) {
      traceLorcanaRuntimeStep({
        kind: "move.validation.failed",
        moveId: "resolveEffect",
        playerId: ctx.playerId,
        effectId,
        message: `${formatLorcanaPlayerLabel(ctx.playerId)} cannot execute move: resolveEffect (RESOLVE_EFFECT_ID_REQUIRED)`,
        payload: {
          error: "resolveEffect requires a valid effect id",
          errorCode: "RESOLVE_EFFECT_ID_REQUIRED",
        },
      });
      return {
        valid: false,
        error: "resolveEffect requires a valid effect id",
        errorCode: "RESOLVE_EFFECT_ID_REQUIRED",
      };
    }

    const pendingChoice = ctx.framework.state.priority.pendingChoice;
    if (!pendingChoice || pendingChoice.requestID !== effectId) {
      traceLorcanaRuntimeStep({
        kind: "move.validation.failed",
        moveId: "resolveEffect",
        playerId: ctx.playerId,
        effectId,
        message: `${formatLorcanaPlayerLabel(ctx.playerId)} cannot execute move: resolveEffect (RESOLVE_EFFECT_NOT_PENDING)`,
        payload: {
          error: "No matching pending effect is available to resolve",
          errorCode: "RESOLVE_EFFECT_NOT_PENDING",
        },
      });
      return {
        valid: false,
        error: "No matching pending effect is available to resolve",
        errorCode: "RESOLVE_EFFECT_NOT_PENDING",
      };
    }

    const pendingEffect = getPendingEffect(ctx, effectId);
    if (!pendingEffect) {
      traceLorcanaRuntimeStep({
        kind: "move.validation.failed",
        moveId: "resolveEffect",
        playerId: ctx.playerId,
        effectId,
        message: `${formatLorcanaPlayerLabel(ctx.playerId)} cannot execute move: resolveEffect (RESOLVE_EFFECT_NOT_FOUND)`,
        payload: {
          error: "Pending effect payload was not found",
          errorCode: "RESOLVE_EFFECT_NOT_FOUND",
        },
      });
      return {
        valid: false,
        error: "Pending effect payload was not found",
        errorCode: "RESOLVE_EFFECT_NOT_FOUND",
      };
    }

    const actorId = ctx.playerId;
    // Check only chooserId: for opponent-choice effects (e.g. Hades), pendingChoice.playerID
    // is the chooser (e.g. opponent P2), not the controller. The chooserId is authoritative.
    if (!actorId || actorId !== pendingEffect.chooserId) {
      traceLorcanaRuntimeStep({
        kind: "move.validation.failed",
        moveId: "resolveEffect",
        playerId: ctx.playerId,
        effectId,
        message: `${formatLorcanaPlayerLabel(ctx.playerId)} cannot execute move: resolveEffect (RESOLVE_EFFECT_WRONG_PLAYER)`,
        payload: {
          error: "Only the pending chooser may resolve this effect",
          errorCode: "RESOLVE_EFFECT_WRONG_PLAYER",
        },
      });
      return {
        valid: false,
        error: "Only the pending chooser may resolve this effect",
        errorCode: "RESOLVE_EFFECT_WRONG_PLAYER",
      };
    }

    if (ctx.validationMode === "preflight" && ctx.args.params === undefined) {
      return { valid: true };
    }

    const validationResult = validatePendingEffectParams(ctx, pendingEffect, ctx.args.params);
    if (!validationResult.valid) {
      traceLorcanaRuntimeStep({
        kind: "move.validation.failed",
        moveId: "resolveEffect",
        playerId: ctx.playerId,
        effectId,
        message: `${formatLorcanaPlayerLabel(ctx.playerId)} cannot execute move: resolveEffect (${validationResult.errorCode ?? "RESOLVE_EFFECT_INVALID"})`,
        payload: {
          error: validationResult.error ?? "resolveEffect validation failed",
          errorCode: validationResult.errorCode ?? "RESOLVE_EFFECT_INVALID",
        },
      });
      return validationResult;
    }

    return validationResult;
  },

  execute: (ctx) => {
    const effectId = ctx.args.effectId;
    const pendingEffect = removePendingActionEffect(ctx, effectId);
    if (!pendingEffect) {
      return;
    }

    const sourceCardName = getLorcanaCardName(pendingEffect.sourceCardId, (cardId) =>
      ctx.cards.getDefinition(cardId),
    );
    traceLorcanaRuntimeStep({
      kind: "effect.resolution.started",
      moveId: "resolveEffect",
      playerId: pendingEffect.chooserId,
      effectId,
      cardId: pendingEffect.sourceCardId,
      cardName: sourceCardName,
      message: "Effect goes to resolution",
    });

    clearPendingActionChoice(ctx);

    const normalizedParams = normalizeResolveEffectParams(ctx.args.params);

    // Decline of an optional that was merged into a target-selection prompt:
    // the player chose to skip rather than pick a target. The pending's
    // effect is the inner of the optional (e.g. put-damage), but submitting
    // `resolveOptional: false` is a clean decline — short-circuit the
    // resolution rather than running the inner effect (which would just
    // re-suspend asking for a target the player already declined).
    if (
      normalizedParams.resolveOptional === false &&
      pendingEffect.kind === "target-selection" &&
      pendingEffect.selectionContext?.kind === "target-selection" &&
      (pendingEffect.selectionContext.canDeclineSelection === true ||
        pendingEffect.selectionContext.originatesFromOptional === true)
    ) {
      finalizeResolvedActionCard(ctx, pendingEffect.cardPlayed);
      traceLorcanaRuntimeStep({
        kind: "effect.resolution.completed",
        moveId: "resolveEffect",
        playerId: pendingEffect.chooserId,
        effectId,
        cardId: pendingEffect.sourceCardId,
        cardName: sourceCardName,
        message: "Effect resolution completes (optional declined)",
      });
      removeBagItemMatchingPendingSource(ctx, pendingEffect);
      flushTriggeredEventsToBag(ctx);
      if (ctx.G.pendingTurnTransition && !hasPendingBagItems(ctx)) {
        continuePendingTurnTransition(ctx);
      } else if (ctx.G.challengeState && !hasPendingBagItems(ctx)) {
        continuePendingChallengeResolution(ctx);
      }
      restorePriorityToTurnPlayer(ctx);
      return;
    }

    const allowsEmptyTargetResolution =
      pendingEffect.kind === "target-selection" &&
      (pendingEffect.selectionContext?.kind === "target-selection"
        ? pendingEffect.selectionContext.minSelections
        : 1) === 0;
    const didResolveTargetSelectionWithoutTargets =
      allowsEmptyTargetResolution &&
      countResolvedTargets(getCurrentSelectionInput(normalizedParams)) === 0;
    const resolutionInput =
      normalizedParams.currentTargets !== undefined
        ? withCurrentSelectionTargets(
            mergeActionResolutionInput(pendingEffect.resolutionInput, normalizedParams),
            getCurrentSelectionTargets(normalizedParams),
          )
        : mergeActionResolutionInput(pendingEffect.resolutionInput, normalizedParams);
    if (didResolveTargetSelectionWithoutTargets) {
      resolutionInput.targetSelectionResolved = true;
    }
    let replayStagedSequence = pendingEffect.continuation?.stagedSequence;

    if (pendingEffect.continuation?.stagedSequence) {
      const collectedTargets = getCurrentSelectionTargets(resolutionInput);
      const combinedTargets = [
        ...pendingEffect.continuation.stagedSequence.collectedTargets,
        ...collectedTargets,
      ];
      const combinedTargetCounts = [
        ...pendingEffect.continuation.stagedSequence.collectedTargetCounts,
        collectedTargets.length,
      ];
      const [nextStep, ...remainingSteps] =
        pendingEffect.continuation.stagedSequence.remainingSteps;

      if (nextStep) {
        const nextResolutionInput = {
          ...clearCurrentSelectionTargets(pendingEffect.resolutionInput),
        };
        const stagedPendingEffect = createPendingActionEffect(ctx, {
          kind: "target-selection",
          sourceCardId: pendingEffect.sourceCardId,
          controllerId: pendingEffect.controllerId,
          chooserId: pendingEffect.chooserId,
          abilityIndex: pendingEffect.abilityIndex,
          cardPlayed: pendingEffect.cardPlayed,
          effect: nextStep,
          continuation: {
            ...(pendingEffect.continuation.remainingEffects
              ? { remainingEffects: [...pendingEffect.continuation.remainingEffects] }
              : {}),
            stagedSequence: {
              sequenceEffect: pendingEffect.continuation.stagedSequence.sequenceEffect,
              collectedTargets: combinedTargets,
              collectedTargetCounts: combinedTargetCounts,
              remainingSteps,
            },
          },
          resolutionInput: nextResolutionInput,
          selectionContext: buildResolutionSelectionContext({
            origin: "pending-effect",
            requestId: pendingEffect.id,
            sourceCardId: pendingEffect.sourceCardId,
            chooserId: pendingEffect.chooserId,
            cardPlayed: pendingEffect.cardPlayed,
            effect: nextStep,
            resolutionInput: nextResolutionInput,
            ctx,
            originatesFromOptional: resolutionInput.resolveOptional === true,
          }),
        });
        enqueuePendingActionEffect(ctx, stagedPendingEffect);
        logResolveEffectMessage(ctx, pendingEffect, resolutionInput);

        traceLorcanaRuntimeStep({
          kind: "effect.resolution.suspended",
          moveId: "resolveEffect",
          playerId: pendingEffect.chooserId,
          effectId,
          cardId: pendingEffect.sourceCardId,
          cardName: sourceCardName,
          message: "Effect resolution is waiting for further input",
        });
        return;
      }

      resolutionInput.currentTargets = undefined;
      resolutionInput.targets = undefined;
      replayStagedSequence = {
        sequenceEffect: pendingEffect.continuation.stagedSequence.sequenceEffect,
        collectedTargets: combinedTargets,
        collectedTargetCounts: combinedTargetCounts,
        remainingSteps: [],
      };
    }

    // Emit be-chosen events for targets submitted in this deferred resolution step.
    // The initial emission in resolveActionCardEffects only covers pre-determined targets.
    // Targets chosen during pending-effect resolution (e.g., choice option targets) are new.
    emitBeChosenEvents(ctx, pendingEffect.cardPlayed, normalizedParams);

    const result = resolveActionEffect(
      ctx,
      pendingEffect.cardPlayed,
      replayStagedSequence?.sequenceEffect ?? pendingEffect.effect,
      resolutionInput,
      {
        allowPromptForExistingChosenTargets: true,
        sourceAbilityIndex: pendingEffect.abilityIndex,
        ...(pendingEffect.allowSuspendWithZeroTargetCandidates === true
          ? { allowSuspendWithZeroTargetCandidates: true as const }
          : {}),
        continuation: replayStagedSequence
          ? {
              ...(pendingEffect.continuation?.remainingEffects
                ? { remainingEffects: pendingEffect.continuation.remainingEffects }
                : {}),
              stagedSequence: replayStagedSequence,
            }
          : pendingEffect.continuation,
      },
    );
    logResolveEffectMessage(ctx, pendingEffect, resolutionInput);
    if (didResolveTargetSelectionWithoutTargets) {
      ctx.framework.log(
        createLorcanaLogProjection(
          "lorcana.effect.cancelled",
          {
            playerId: pendingEffect.chooserId,
            sourceCardId: pendingEffect.sourceCardId,
            cause: "no-valid-targets",
          },
          { mode: "PUBLIC" },
          "action",
        ),
      );
    }

    if (result.status === "suspended") {
      traceLorcanaRuntimeStep({
        kind: "effect.resolution.suspended",
        moveId: "resolveEffect",
        playerId: pendingEffect.chooserId,
        effectId,
        cardId: pendingEffect.sourceCardId,
        cardName: sourceCardName,
        message: "Effect resolution is waiting for further input",
      });
      return;
    }

    const remainingEffects = pendingEffect.continuation?.remainingEffects ?? [];
    if (remainingEffects.length === 0) {
      resolveRecordedVanishTargets(ctx, pendingEffect.cardPlayed, resolutionInput);
      finalizeResolvedActionCard(ctx, pendingEffect.cardPlayed);
      traceLorcanaRuntimeStep({
        kind: "effect.resolution.completed",
        moveId: "resolveEffect",
        playerId: pendingEffect.chooserId,
        effectId,
        cardId: pendingEffect.sourceCardId,
        cardName: sourceCardName,
        message: "Effect resolution completes",
      });
      removeBagItemMatchingPendingSource(ctx, pendingEffect);
      flushTriggeredEventsToBag(ctx);
      if (ctx.G.pendingTurnTransition && !hasPendingBagItems(ctx)) {
        continuePendingTurnTransition(ctx);
      } else if (ctx.G.challengeState && !hasPendingBagItems(ctx)) {
        continuePendingChallengeResolution(ctx);
      }
      restorePriorityToTurnPlayer(ctx);
      return;
    }

    const continuationResult = resolveActionEffect(
      ctx,
      pendingEffect.cardPlayed,
      {
        type: "sequence",
        steps: remainingEffects,
      },
      buildContinuationResolutionInput(pendingEffect, resolutionInput),
      {
        allowPromptForExistingChosenTargets: true,
        sourceAbilityIndex: pendingEffect.abilityIndex,
        ...(pendingEffect.allowSuspendWithZeroTargetCandidates === true
          ? { allowSuspendWithZeroTargetCandidates: true as const }
          : {}),
      },
    );
    if (continuationResult.status === "suspended") {
      traceLorcanaRuntimeStep({
        kind: "effect.resolution.suspended",
        moveId: "resolveEffect",
        playerId: pendingEffect.chooserId,
        effectId,
        cardId: pendingEffect.sourceCardId,
        cardName: sourceCardName,
        message: "Effect resolution is waiting for further input",
      });
      return;
    }

    resolveRecordedVanishTargets(ctx, pendingEffect.cardPlayed, resolutionInput);
    finalizeResolvedActionCard(ctx, pendingEffect.cardPlayed);
    traceLorcanaRuntimeStep({
      kind: "effect.resolution.completed",
      moveId: "resolveEffect",
      playerId: pendingEffect.chooserId,
      effectId,
      cardId: pendingEffect.sourceCardId,
      cardName: sourceCardName,
      message: "Effect resolution completes",
    });
    removeBagItemMatchingPendingSource(ctx, pendingEffect);
    flushTriggeredEventsToBag(ctx);

    if (ctx.G.pendingTurnTransition && !hasPendingBagItems(ctx)) {
      continuePendingTurnTransition(ctx);
    } else if (ctx.G.challengeState && !hasPendingBagItems(ctx)) {
      continuePendingChallengeResolution(ctx);
    }
    restorePriorityToTurnPlayer(ctx);
  },

  available: (ctx) => {
    const pendingChoice = ctx.framework.state.priority.pendingChoice;
    if (!pendingChoice) {
      return false;
    }

    // Do NOT restrict by pendingChoice.playerID here: for opponent-choice effects (e.g. Hades),
    // pendingChoice.playerID is the chooser/decision-maker (set from pendingEffect.chooserId),
    // which is correct for clock targeting. The chooserId check below is the authoritative
    // access control for who can resolve the effect.
    const pendingEffect = getPendingEffect(ctx, pendingChoice.requestID);
    if (!pendingEffect || pendingEffect.chooserId !== ctx.playerId) {
      return false;
    }

    // Note: Target validation for resolveEffect happens internally via validatePendingEffectParams
    // because targets are nested inside params.targets, not at the top level of args.
    // The core engine's target intent system doesn't support nested paths like "params.targets".
    return true;
  },
};

function assertNever(value: never): never {
  throw new Error(`Unhandled pending action effect kind: ${String(value)}`);
}

function restorePriorityToTurnPlayer(ctx: ResolveEffectExecutionContext): void {
  if (
    hasPendingBagItems(ctx) ||
    ctx.framework.state.priority.pendingChoice ||
    (ctx.G.pendingEffects?.length ?? 0) > 0 ||
    ctx.G.pendingTurnTransition ||
    ctx.G.challengeState
  ) {
    return;
  }

  const turnPlayer = resolveTurnOwnerId(ctx.framework.state, ctx.G);
  if (!turnPlayer || ctx.framework.state.currentPlayer === turnPlayer) {
    return;
  }

  if (typeof ctx.framework.priority?.setHolder === "function") {
    ctx.framework.priority.setHolder(turnPlayer);
  } else {
    (ctx.framework.state.priority as { holder?: PlayerId }).holder = turnPlayer;
  }
}
