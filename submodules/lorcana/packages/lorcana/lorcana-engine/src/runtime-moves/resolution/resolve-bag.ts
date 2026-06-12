import type { CardInstanceId, PlayerId, RuntimeValidationResult } from "#core";
import type {
  BagEffectEntry,
  PendingActionResolutionInput,
  TargetResolutionSelectionContext,
} from "../../types";
import { createLorcanaLogProjection, type LorcanaMoveDefinition } from "../../types";
import type { LogTargetId, ResolveBagCancelledCause } from "../../types/log-messages";
import { continuePendingChallengeResolution } from "../moves/core/challenge";
import { continuePendingTurnTransition } from "../moves/turn/pass-turn";
import { resolveActionEffect } from "./action-effects/composed-effect-resolver";
import type { ActionResolutionInput } from "./action-effects/types";
import { evaluateActionCondition } from "./action-effects/action-condition-evaluator";
import {
  cloneActionResolutionInput,
  clearPendingActionChoice,
} from "./action-effects/pending-action-effects";
import { buildResolutionSelectionContext } from "./action-effects/selection-context";
import {
  getCurrentSelectionInput,
  type SelectionTarget,
  withCurrentSelectionTargets,
} from "./action-effects/selection-state";
import {
  canResolveBagEffectByRestrictions,
  flushTriggeredEventsToBag,
  getBagItemsForCurrentResolver,
  getNextBagResolver,
  hasPendingBagItems,
  recordBagEffectResolution,
  removeBagEffect,
  updateBagEffectResolutionInput,
} from "../effects/triggered-abilities";
import {
  formatLorcanaPlayerLabel,
  getLorcanaCardName,
  traceLorcanaRuntimeStep,
} from "../../runtime-trace";
import {
  analyzeEffectTargets,
  analyzeTargetSelectionAvailabilityFromAnalysis,
  analyzeResolutionRequirements,
  countExplicitTargetSelections,
  hasExplicitTargetSelectionInput,
  resolveTargetPlayerIds,
  type TargetAnalysis,
  validateAndNormalizeTargetSelection,
} from "../../targeting/runtime";
import { resolveTurnOwnerId } from "../../core/runtime/turn-owner";
import { flattenSlottedTargets, isSlottedTargetInput } from "../../targeting/slotted-targets";
import { shouldSkipEffectWithNoValidTargets } from "../../targeting/runtime/optional-skip-analysis";

type ResolveBagValidationContext = Parameters<
  NonNullable<LorcanaMoveDefinition<"resolveBag">["validate"]>
>[0];

type ResolveBagExecutionContext = Parameters<LorcanaMoveDefinition<"resolveBag">["execute"]>[0];
type ResolveBagChooserContext = Pick<
  ResolveBagValidationContext,
  "cards" | "framework" | "playerId"
>;

type ResolveBagStatus = "completed" | "pending" | "skipped" | "cancelled";

function toLogTargetId(value: string): LogTargetId {
  return value as LogTargetId;
}

function normalizeResolveBagTargets(
  targets: ActionResolutionInput["currentTargets"] | ActionResolutionInput["targets"] | undefined,
): LogTargetId[] | undefined {
  if (typeof targets === "string") {
    return [toLogTargetId(targets)];
  }

  if (Array.isArray(targets)) {
    return targets
      .filter((target): target is string => typeof target === "string")
      .map(toLogTargetId);
  }

  return undefined;
}

function getBagTargetSelectionValidationInput(
  explicitTargets: ActionResolutionInput["targets"] | undefined,
  bagSelectionContext: TargetResolutionSelectionContext | undefined,
  effect: unknown,
  cardCandidateIds: readonly string[],
): ActionResolutionInput["targets"] | undefined {
  const hasFixedMoveDestination =
    bagSelectionContext?.kind === "target-selection" &&
    bagSelectionContext.expectedSlottedKind === "move-to-location" &&
    bagSelectionContext.targetDsl.length === 1;
  const effectHasFixedMoveDestination = effectContainsTriggerDestinationMoveToLocation(effect);

  if (hasFixedMoveDestination || effectHasFixedMoveDestination) {
    if (isSlottedTargetInput(explicitTargets) && explicitTargets.kind === "move-to-location") {
      const [targetDsl] =
        bagSelectionContext?.kind === "target-selection" ? bagSelectionContext.targetDsl : [];
      const cardTypes =
        targetDsl && typeof targetDsl === "object" && "cardTypes" in targetDsl
          ? targetDsl.cardTypes
          : undefined;
      if (Array.isArray(cardTypes) && cardTypes.includes("location")) {
        return [...explicitTargets.location] as ActionResolutionInput["targets"];
      }

      return [...explicitTargets.subject] as ActionResolutionInput["targets"];
    }

    if (Array.isArray(explicitTargets)) {
      return explicitTargets.filter((target) =>
        cardCandidateIds.some((candidateId) => candidateId === target),
      ) as ActionResolutionInput["targets"];
    }
  }

  return explicitTargets;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function effectContainsTriggerDestinationMoveToLocation(effect: unknown): boolean {
  if (!isRecord(effect)) {
    return false;
  }

  if (effect.type === "move-to-location") {
    const location = effect.location;
    return isRecord(location) && location.ref === "trigger-destination";
  }

  const nestedEffect = effect.effect;
  if (nestedEffect && effectContainsTriggerDestinationMoveToLocation(nestedEffect)) {
    return true;
  }

  const steps = effect.steps;
  if (
    Array.isArray(steps) &&
    steps.some((step) => effectContainsTriggerDestinationMoveToLocation(step))
  ) {
    return true;
  }

  const options = effect.options;
  return (
    Array.isArray(options) &&
    options.some((option) => effectContainsTriggerDestinationMoveToLocation(option))
  );
}

function effectContainsOptional(effect: unknown): boolean {
  if (!effect || typeof effect !== "object" || Array.isArray(effect)) {
    return false;
  }

  const record = effect as Record<string, unknown>;
  if (record.type === "optional") {
    return true;
  }

  const nestedEffects = [
    ...(Array.isArray(record.steps) ? record.steps : []),
    ...(Array.isArray(record.effects) ? record.effects : []),
    record.effect,
    record.then,
    record.else,
    record.ifTrue,
    record.ifFalse,
  ];

  return nestedEffects.some(effectContainsOptional);
}

function logResolveBagMessage(
  ctx: ResolveBagExecutionContext,
  bagEffect: NonNullable<ReturnType<typeof getBagEffect>>,
  resolutionInput: ActionResolutionInput,
  status: ResolveBagStatus,
  cause?: ResolveBagCancelledCause,
): void {
  const common = {
    playerId: bagEffect.controllerId,
    sourceId: bagEffect.sourceId,
  };
  const abilityName = bagEffect.abilityName?.trim();
  const targets = normalizeResolveBagTargets(getCurrentSelectionInput(resolutionInput));

  const visibility = { mode: "PUBLIC" as const };
  const category = "action" as const;

  const projection = (() => {
    switch (status) {
      case "completed":
        if (abilityName && targets && targets.length > 0) {
          return createLorcanaLogProjection(
            "lorcana.bag.resolve.completed.targets.named",
            {
              ...common,
              abilityName,
              targets,
            },
            visibility,
            category,
          );
        }
        if (targets && targets.length > 0) {
          return createLorcanaLogProjection(
            "lorcana.bag.resolve.completed.targets",
            {
              ...common,
              targets,
            },
            visibility,
            category,
          );
        }
        if (abilityName) {
          return createLorcanaLogProjection(
            "lorcana.bag.resolve.completed.named",
            {
              ...common,
              abilityName,
            },
            visibility,
            category,
          );
        }
        return createLorcanaLogProjection(
          "lorcana.bag.resolve.completed",
          common,
          visibility,
          category,
        );
      case "pending":
        if (abilityName && targets && targets.length > 0) {
          return createLorcanaLogProjection(
            "lorcana.bag.resolve.pending.named.targets",
            {
              ...common,
              abilityName,
              targets,
            },
            visibility,
            category,
          );
        }
        if (abilityName) {
          return createLorcanaLogProjection(
            "lorcana.bag.resolve.pending.named",
            {
              ...common,
              abilityName,
            },
            visibility,
            category,
          );
        }
        return createLorcanaLogProjection(
          "lorcana.bag.resolve.pending",
          common,
          visibility,
          category,
        );
      case "skipped":
        if (abilityName) {
          return createLorcanaLogProjection(
            "lorcana.bag.resolve.skipped.named",
            {
              ...common,
              abilityName,
            },
            visibility,
            category,
          );
        }
        return createLorcanaLogProjection(
          "lorcana.bag.resolve.skipped",
          common,
          visibility,
          category,
        );
      case "cancelled":
        if (abilityName) {
          return createLorcanaLogProjection(
            "lorcana.bag.resolve.cancelled.named",
            {
              ...common,
              abilityName,
              cause: cause!,
            },
            visibility,
            category,
          );
        }
        return createLorcanaLogProjection(
          "lorcana.bag.resolve.cancelled",
          {
            ...common,
            cause: cause!,
          },
          visibility,
          category,
        );
      default:
        return assertNever(status);
    }
  })();

  ctx.framework.log(projection);
}

function getBagEffect(
  ctx: ResolveBagValidationContext | ResolveBagExecutionContext,
  bagId: string,
) {
  return (ctx.G.triggeredAbilities.bag.items ?? []).find((entry) => entry.id === bagId);
}

/**
 * If the effect is a `conditional` effect, evaluate the condition using the
 * stored event snapshot and return the branch that will actually be executed
 * (then-branch if condition passes, else-branch if not). This allows the caller
 * to analyse resolution requirements only against the branch that will run,
 * preventing spurious "targets required" errors when the condition fails and no
 * targets are needed.
 *
 * For any other effect shape the original effect is returned unchanged.
 */
function resolveConditionalEffectBranch(
  effect: unknown,
  ctx: Parameters<typeof evaluateActionCondition>[1],
  cardPlayed: Parameters<typeof evaluateActionCondition>[2],
  resolutionInput: Parameters<typeof evaluateActionCondition>[3],
): unknown {
  if (
    typeof effect !== "object" ||
    effect === null ||
    (effect as Record<string, unknown>).type !== "conditional"
  ) {
    return effect;
  }

  const conditional = effect as Record<string, unknown>;
  const condition = conditional.condition as Parameters<typeof evaluateActionCondition>[0];
  const conditionMet = evaluateActionCondition(condition, ctx, cardPlayed, resolutionInput);

  const thenBranch = conditional.then ?? conditional.effect ?? conditional.ifTrue;
  const elseBranch = conditional.else ?? conditional.ifFalse;
  return conditionMet ? thenBranch : elseBranch;
}

function getDirectBagChooserId(
  ctx: ResolveBagChooserContext,
  bagEffect: NonNullable<ReturnType<typeof getBagEffect>>,
  effect: unknown,
): PlayerId | undefined {
  if (!effect || typeof effect !== "object" || Array.isArray(effect)) {
    return undefined;
  }

  const effectRecord = effect as {
    type?: unknown;
    from?: unknown;
    amount?: unknown;
    chosen?: unknown;
    random?: unknown;
    target?: unknown;
  };

  if (effectRecord.type !== "discard") {
    return undefined;
  }

  const fromZone = typeof effectRecord.from === "string" ? effectRecord.from : "hand";
  if (fromZone !== "hand") {
    return undefined;
  }

  if (effectRecord.amount === "all") {
    return undefined;
  }

  const requiresChoice = effectRecord.random !== true || effectRecord.chosen === true;
  if (!requiresChoice) {
    return undefined;
  }

  const targetedPlayerIds = resolveTargetPlayerIds(ctx, effectRecord.target, {
    controllerId: bagEffect.controllerId as PlayerId,
    sourceCardId: bagEffect.sourceId as CardInstanceId,
    eventSnapshot: (bagEffect.resolutionInput as ActionResolutionInput).eventSnapshot,
  });

  return targetedPlayerIds.length === 1 ? targetedPlayerIds[0] : undefined;
}

export const resolveBag: LorcanaMoveDefinition<"resolveBag"> = {
  ignorePriority: true,

  validate: (ctx): RuntimeValidationResult => {
    const { bagId } = ctx.args;
    if (typeof bagId !== "string" || bagId.length === 0) {
      traceLorcanaRuntimeStep({
        kind: "move.validation.failed",
        moveId: "resolveBag",
        playerId: ctx.playerId,
        bagItemId: bagId,
        message: `${formatLorcanaPlayerLabel(ctx.playerId)} cannot execute move: resolveBag (RESOLVE_BAG_ID_REQUIRED)`,
        payload: {
          error: "resolveBag requires a valid bag id",
          errorCode: "RESOLVE_BAG_ID_REQUIRED",
        },
      });
      return {
        valid: false,
        error: "resolveBag requires a valid bag id",
        errorCode: "RESOLVE_BAG_ID_REQUIRED",
      };
    }

    const bagEffect = getBagEffect(ctx, bagId);
    if (!bagEffect) {
      traceLorcanaRuntimeStep({
        kind: "move.validation.failed",
        moveId: "resolveBag",
        playerId: ctx.playerId,
        bagItemId: bagId,
        message: `${formatLorcanaPlayerLabel(ctx.playerId)} cannot execute move: resolveBag (RESOLVE_BAG_NOT_FOUND)`,
        payload: {
          error: "Bag effect was not found",
          errorCode: "RESOLVE_BAG_NOT_FOUND",
        },
      });
      return {
        valid: false,
        error: "Bag effect was not found",
        errorCode: "RESOLVE_BAG_NOT_FOUND",
      };
    }

    const validationResolutionInput: ActionResolutionInput = {
      ...cloneActionResolutionInput(bagEffect.resolutionInput as ActionResolutionInput),
      ...ctx.args.params,
    } as ActionResolutionInput;
    const validationEffect = resolveConditionalEffectBranch(
      bagEffect.effect,
      ctx as unknown as Parameters<typeof evaluateActionCondition>[1],
      {
        ...bagEffect.cardPlayed,
        singerIds: bagEffect.cardPlayed.singerIds ? [...bagEffect.cardPlayed.singerIds] : undefined,
      },
      cloneActionResolutionInput(validationResolutionInput),
    );
    const directBagChooserId = getDirectBagChooserId(ctx, bagEffect, validationEffect);

    const resolver = getNextBagResolver(ctx);
    const isDirectBagChooser =
      directBagChooserId === ctx.playerId && bagEffect.controllerId !== directBagChooserId;
    if (
      !isDirectBagChooser &&
      (!resolver || resolver !== ctx.playerId || bagEffect.controllerId !== resolver)
    ) {
      traceLorcanaRuntimeStep({
        kind: "move.validation.failed",
        moveId: "resolveBag",
        playerId: ctx.playerId,
        bagItemId: bagId,
        message: `${formatLorcanaPlayerLabel(ctx.playerId)} cannot execute move: resolveBag (RESOLVE_BAG_WRONG_PLAYER)`,
        payload: {
          error: "Only the active bag resolver may choose this effect",
          errorCode: "RESOLVE_BAG_WRONG_PLAYER",
        },
      });
      return {
        valid: false,
        error: "Only the active bag resolver may choose this effect",
        errorCode: "RESOLVE_BAG_WRONG_PLAYER",
      };
    }

    const params = ctx.args.params;
    // For conditional effects, we must evaluate the condition before determining
    // resolution requirements. The branches of a conditional are only reachable
    // when the condition passes; requiring targets for the then-branch when the
    // condition will fail is incorrect and blocks auto-resolution.
    const effectForRequirements = validationEffect;
    const requirements = analyzeResolutionRequirements(effectForRequirements);
    const explicitTargets = params?.targets;
    const hasExplicitTargets = hasExplicitTargetSelectionInput(explicitTargets);
    const explicitTargetCount = countExplicitTargetSelections(explicitTargets);
    const sourceCardDefinition = ctx.cards.getDefinition(bagEffect.sourceId as CardInstanceId);
    const selectionResolutionInput: PendingActionResolutionInput = {
      targets: explicitTargets as PendingActionResolutionInput["targets"],
      currentTargets: explicitTargets as PendingActionResolutionInput["currentTargets"],
      resolveOptional: params?.resolveOptional,
      enterPlayExerted: params?.enterPlayExerted,
      choiceIndex: params?.choiceIndex,
      namedCard: params?.namedCard,
      destinations: params?.destinations as PendingActionResolutionInput["destinations"],
    };
    const bagSelectionContext = buildResolutionSelectionContext({
      origin: "bag",
      requestId: bagEffect.id,
      sourceCardId: bagEffect.sourceId as CardInstanceId,
      chooserId: bagEffect.controllerId as PlayerId,
      cardPlayed: {
        cardId: bagEffect.sourceId as CardInstanceId,
        cardType: sourceCardDefinition?.cardType ?? "character",
        costType: "free",
        playerId: bagEffect.controllerId as PlayerId,
      },
      effect: bagEffect.effect,
      resolutionInput: selectionResolutionInput,
      ctx,
    });
    const isDecliningOptional =
      params?.resolveOptional === false &&
      (requirements.isOptional || effectContainsOptional(bagEffect.effect));
    const controllerId = bagEffect.controllerId as PlayerId;
    const effectRecord = bagEffect.effect as Record<string, unknown> | null;
    const resolutionInput = bagEffect.resolutionInput as PendingActionResolutionInput | undefined;
    const effectForTargetAnalysis =
      effectRecord?.type === "or" && typeof resolutionInput?.choiceIndex === "number"
        ? ((effectRecord.options as unknown[] | undefined)?.[resolutionInput.choiceIndex] ??
          bagEffect.effect)
        : bagEffect.effect;
    if (effectRecord?.type === "or") {
      // console.log("[DEBUG] or effect detected", {
      //   choiceIndex: resolutionInput?.choiceIndex,
      //   isUsingChosenOption: effectForTargetAnalysis !== bagEffect.effect,
      //   effectType: (effectForTargetAnalysis as Record<string, unknown> | null)?.type,
      // });
    }
    const targetAnalysis = analyzeEffectTargets(
      effectForTargetAnalysis,
      controllerId,
      ctx,
      bagEffect.sourceId as CardInstanceId,
    );
    const currentSelectionAnalysis =
      bagSelectionContext?.kind === "target-selection" ||
      bagSelectionContext?.kind === "discard-choice"
        ? {
            ...targetAnalysis,
            minSelections: bagSelectionContext.minSelections,
            maxSelections: bagSelectionContext.maxSelections,
            ordered: bagSelectionContext.ordered,
          }
        : targetAnalysis;
    const targetAvailability = analyzeTargetSelectionAvailabilityFromAnalysis(
      effectForTargetAnalysis,
      currentSelectionAnalysis,
    );
    // For sequences, the whole-effect target analysis aggregates candidates from
    // ALL steps, which can mask that the current step has zero valid candidates.
    // Re-analyze the first step in isolation so shouldAutoRejectForNoValidTargets
    // reflects the step the player is actually resolving.
    // Similarly, for "or" effects with a chosen option, re-analyze just the chosen
    // option to properly validate targets against the constraints of that option.
    const firstStepEffect =
      effectRecord?.type === "sequence"
        ? ((effectRecord.steps as unknown[] | undefined)?.[0] ?? null)
        : null;
    const chosenOptionEffect =
      effectRecord?.type === "or" && typeof resolutionInput?.choiceIndex === "number"
        ? ((effectRecord.options as unknown[] | undefined)?.[resolutionInput.choiceIndex] ?? null)
        : null;
    const effectForAnalysis = chosenOptionEffect ?? firstStepEffect ?? bagEffect.effect;
    const shouldAutoRejectForNoValidTargets =
      (chosenOptionEffect != null || firstStepEffect != null) &&
      targetAvailability.shouldAutoRejectForNoValidTargets === false
        ? (() => {
            const isolatedAnalysis = analyzeEffectTargets(
              effectForAnalysis,
              controllerId,
              ctx,
              bagEffect.sourceId as CardInstanceId,
            );
            const isolatedSelectionAnalysis =
              bagSelectionContext?.kind === "target-selection" ||
              bagSelectionContext?.kind === "discard-choice"
                ? {
                    ...isolatedAnalysis,
                    minSelections: bagSelectionContext.minSelections,
                    maxSelections: bagSelectionContext.maxSelections,
                    ordered: bagSelectionContext.ordered,
                  }
                : isolatedAnalysis;
            return analyzeTargetSelectionAvailabilityFromAnalysis(
              effectForAnalysis,
              isolatedSelectionAnalysis,
            ).shouldAutoRejectForNoValidTargets;
          })()
        : targetAvailability.shouldAutoRejectForNoValidTargets;
    // Optional effects with zero valid candidates can never be meaningfully
    // accepted — the only coherent outcome is decline. Treat an empty-targets
    // submission as an implicit decline so the bag can drain instead of the
    // player being stuck clicking "Resolve triggered ability". The execute()
    // path forces resolveOptional=false in the same condition below.
    // Also short-circuit when the ability's intervening-if condition will
    // fail at resolution (CRD 6.2.7): execute() drains such effects at
    // line 800+, but the targets-required error would otherwise fire first.
    const abilityConditionWillFail =
      bagEffect.condition !== undefined &&
      bagEffect.condition !== null &&
      !evaluateActionCondition(
        bagEffect.condition as Parameters<typeof evaluateActionCondition>[0],
        ctx as unknown as Parameters<typeof evaluateActionCondition>[1],
        bagEffect.cardPlayed,
        validationResolutionInput,
      );
    const optionalWithNoCandidates =
      requirements.isOptional &&
      requirements.requiresExplicitTargetSelection &&
      targetAvailability.candidateCount === 0;
    if (
      requirements.requiresExplicitTargetSelection &&
      !requirements.allowsExplicitEmptyTargetSelection &&
      hasExplicitTargets &&
      explicitTargetCount === 0 &&
      !isDecliningOptional &&
      !shouldAutoRejectForNoValidTargets &&
      !optionalWithNoCandidates &&
      !abilityConditionWillFail
    ) {
      console.warn("[resolveBag] RESOLVE_BAG_TARGETS_REQUIRED", {
        bagId,
        playerId: ctx.playerId,
        sourceCardId: bagEffect.sourceId,
        effectType: (bagEffect.effect as { type?: unknown } | null)?.type,
        params,
        explicitTargets,
        explicitTargetCount,
        hasExplicitTargets,
        requirements,
        isDecliningOptional,
        shouldAutoRejectForNoValidTargets,
      });
      traceLorcanaRuntimeStep({
        kind: "move.validation.failed",
        moveId: "resolveBag",
        playerId: ctx.playerId,
        bagItemId: bagId,
        message: `${formatLorcanaPlayerLabel(ctx.playerId)} cannot execute move: resolveBag (RESOLVE_BAG_TARGETS_REQUIRED)`,
        payload: {
          error: "resolveBag requires at least 1 explicit target for this effect",
          errorCode: "RESOLVE_BAG_TARGETS_REQUIRED",
          explicitTargetCount,
        },
      });
      return {
        valid: false,
        error: "resolveBag requires at least 1 explicit target for this effect",
        errorCode: "RESOLVE_BAG_TARGETS_REQUIRED",
      };
    }

    // When bagSelectionContext is undefined, the provided targets are destined for
    // a nested inner step (e.g. the first step of an optional→sequence). The
    // full-effect targetAnalysis would incorrectly require targets for ALL steps.
    // Relax the minimum count to just the explicit target count, but still
    // validate each target's legality so invalid targets (wrong classification,
    // Ward restriction, strength filter, etc.) are still rejected.
    const targetSelectionContext =
      bagSelectionContext?.kind === "target-selection" ? bagSelectionContext : undefined;
    const selectionContextAnalysis: TargetAnalysis | undefined = targetSelectionContext
      ? {
          ...currentSelectionAnalysis,
          targetDsl: [...targetSelectionContext.targetDsl],
          cardCandidates: [...targetSelectionContext.cardCandidateIds],
          playerCandidates: [...targetSelectionContext.playerCandidateIds],
          allowedZones: [...targetSelectionContext.allowedZones],
          minSelections: targetSelectionContext.minSelections,
          maxSelections: targetSelectionContext.maxSelections,
          declaredMaxSelections: targetSelectionContext.declaredMaxSelections,
          requiresExplicitSelection:
            targetSelectionContext.minSelections > 0 ||
            targetSelectionContext.maxSelections > 0 ||
            targetSelectionContext.cardCandidateIds.length > 0 ||
            targetSelectionContext.playerCandidateIds.length > 0,
        }
      : undefined;
    const relaxTargetCount = bagSelectionContext === undefined;
    const selectionAnalysisForValidation =
      selectionContextAnalysis ??
      (relaxTargetCount
        ? { ...currentSelectionAnalysis, minSelections: explicitTargetCount }
        : currentSelectionAnalysis);
    if (hasExplicitTargets && explicitTargets !== undefined && !isDecliningOptional) {
      const validationTargets = getBagTargetSelectionValidationInput(
        explicitTargets,
        targetSelectionContext,
        bagEffect.effect,
        currentSelectionAnalysis.cardCandidates,
      );
      const targetSelectionAnalysisForValidation =
        validationTargets !== explicitTargets
          ? {
              ...selectionAnalysisForValidation,
              minSelections: Math.min(selectionAnalysisForValidation.minSelections, 1),
            }
          : selectionAnalysisForValidation;
      const selectionValidation = validateAndNormalizeTargetSelection(
        validationTargets,
        targetSelectionAnalysisForValidation,
        {
          currentPlayer: controllerId,
          ctx,
        },
      );
      const normalizedSelection =
        !selectionValidation.valid &&
        selectionValidation.errorCode === "TOO_FEW_TARGETS" &&
        (shouldAutoRejectForNoValidTargets || optionalWithNoCandidates || abilityConditionWillFail)
          ? validateAndNormalizeTargetSelection(
              validationTargets,
              {
                ...targetSelectionAnalysisForValidation,
                minSelections: 0,
              },
              {
                currentPlayer: controllerId,
                ctx,
              },
            )
          : selectionValidation;
      if (!normalizedSelection.valid) {
        console.warn("[resolveBag] target validation failed", {
          bagId,
          playerId: ctx.playerId,
          sourceCardId: bagEffect.sourceId,
          effectType: (bagEffect.effect as { type?: unknown } | null)?.type,
          errorCode: normalizedSelection.errorCode,
          error: normalizedSelection.error,
          explicitTargets,
          analysis: {
            cardCandidates: selectionAnalysisForValidation.cardCandidates,
            playerCandidates: selectionAnalysisForValidation.playerCandidates,
            minSelections: selectionAnalysisForValidation.minSelections,
            maxSelections: selectionAnalysisForValidation.maxSelections,
            allowDuplicateTargets: selectionAnalysisForValidation.allowDuplicateTargets,
          },
        });
        traceLorcanaRuntimeStep({
          kind: "move.validation.failed",
          moveId: "resolveBag",
          playerId: ctx.playerId,
          bagItemId: bagId,
          message: `${formatLorcanaPlayerLabel(ctx.playerId)} cannot execute move: resolveBag (${normalizedSelection.errorCode ?? "INVALID_BAG_TARGETS"})`,
          payload: {
            error: normalizedSelection.error ?? "Bag effect target selection is invalid",
            errorCode: normalizedSelection.errorCode ?? "INVALID_BAG_TARGETS",
          },
        });
        return {
          valid: false,
          error: normalizedSelection.error ?? "Bag effect target selection is invalid",
          errorCode: normalizedSelection.errorCode ?? "INVALID_BAG_TARGETS",
        };
      }
    }

    return { valid: true };
  },

  execute: (ctx) => {
    const { bagId } = ctx.args;

    // Multi-step resolution: check if this is a partial input that advances the
    // selection state (e.g. accepting an optional effect that still needs target
    // selection). If so, update the bag item's resolutionInput and return early
    // so the next board projection presents the next selection context.
    // Multi-step resolution: when the caller provides partial selection input
    // (e.g. only resolveOptional without targets, or only choiceIndex), check
    // whether the effect still needs more selection steps. If so, update the bag
    // item's resolutionInput in place and return early so the next board projection
    // presents the next selection context.
    // Only enter this path when:
    //  1. Targets are NOT provided (direct target submission uses the full path)
    //  2. At least one intermediate selection field IS provided
    const params = ctx.args.params;
    const hasProvidedTargets = params?.targets !== undefined;
    const hasIntermediateInput =
      typeof params?.resolveOptional === "boolean" ||
      typeof params?.enterPlayExerted === "boolean" ||
      typeof params?.choiceIndex === "number" ||
      typeof params?.namedCard === "string" ||
      params?.destinations !== undefined;
    const bagEntry = !hasProvidedTargets && hasIntermediateInput ? getBagEffect(ctx, bagId) : null;
    if (bagEntry && params) {
      const mergedResolutionInput: PendingActionResolutionInput = {
        ...(bagEntry.resolutionInput as PendingActionResolutionInput),
      };
      if (typeof params.resolveOptional === "boolean") {
        mergedResolutionInput.resolveOptional = params.resolveOptional;
      }
      if (typeof params.enterPlayExerted === "boolean") {
        mergedResolutionInput.enterPlayExerted = params.enterPlayExerted;
      }
      if (typeof params.choiceIndex === "number") {
        mergedResolutionInput.choiceIndex = params.choiceIndex;
      }
      if (typeof params.namedCard === "string") {
        mergedResolutionInput.namedCard = params.namedCard;
      }
      if (params.destinations !== undefined) {
        mergedResolutionInput.destinations =
          params.destinations as PendingActionResolutionInput["destinations"];
      }
      const nextSelectionContext = buildResolutionSelectionContext({
        origin: "bag",
        requestId: bagEntry.id,
        sourceCardId: bagEntry.sourceId as CardInstanceId,
        chooserId: bagEntry.chooserId as PlayerId,
        cardPlayed: bagEntry.cardPlayed,
        effect: bagEntry.effect,
        resolutionInput: mergedResolutionInput,
        ctx,
      });

      // Only advance if the effect truly requires explicit target selection AND
      // the optional decision (if any) has NOT yet been made. Once resolveOptional
      // is committed (true), the bag must execute immediately so the effect resolver
      // can create pending effects for any required target selection. Advancing bag
      // state after accepting an optional breaks the pending-effect target flow used
      // by most triggered abilities (e.g. "you may remove damage from chosen character").
      // A top-level decision has been made when:
      // - resolveOptional was set to true (optional accepted), or
      // - choiceIndex was provided (choice/or effect resolved)
      // In either case, execute the bag immediately so the effect resolver
      // can create pending effects for any remaining target selection.
      const isAcceptingOptional = mergedResolutionInput.resolveOptional === true;
      const hasResolvedChoice = typeof mergedResolutionInput.choiceIndex === "number";
      const mergedRequirements = analyzeResolutionRequirements(bagEntry.effect);
      // When accepting an optional that wraps a play-card effect, the
      // player must select which card to play before the bag executes.
      // play-card from hand or discard does not use the pending-effect suspension path, so
      // we advance the bag state here to show the card picker to the player.
      // Use targetDsl.length === 0 to identify play-card contexts: buildPlayCardSelectionContext
      // always returns targetDsl: [] while other card-targeting effects (put-into-inkwell, etc.)
      // return a non-empty targetDsl and DO use the pending-effect suspension path.
      const playCardCandidateCount =
        nextSelectionContext?.kind === "target-selection"
          ? ((nextSelectionContext.cardCandidateIds as unknown[] | undefined)?.length ?? 0)
          : 0;
      const hasPlayCardEntryModeChoice =
        nextSelectionContext?.kind === "target-selection" &&
        ((nextSelectionContext.playCardEntryModeCandidateIds as unknown[] | undefined)?.length ??
          0) > 0;
      const eventSnapshot = (mergedResolutionInput.eventSnapshot ?? {}) as Record<string, unknown>;
      const isAutoDrainedAfterDraw = typeof eventSnapshot.drawnCount === "number";
      const isAcceptingOptionalWithPlayCardSelection =
        isAcceptingOptional &&
        nextSelectionContext?.kind === "target-selection" &&
        ((nextSelectionContext.allowedZones as string[] | undefined)?.includes("hand") === true ||
          (nextSelectionContext.allowedZones as string[] | undefined)?.includes("discard") ===
            true ||
          (nextSelectionContext.allowedZones as string[] | undefined)?.includes("inkwell") ===
            true) &&
        (nextSelectionContext.targetDsl as unknown[])?.length === 0 &&
        (playCardCandidateCount !== 1 || hasPlayCardEntryModeChoice || !isAutoDrainedAfterDraw);
      const shouldAdvance =
        nextSelectionContext &&
        (mergedRequirements.requiresExplicitTargetSelection ||
          isAcceptingOptionalWithPlayCardSelection) &&
        (!isAcceptingOptional || isAcceptingOptionalWithPlayCardSelection) &&
        !hasResolvedChoice;
      if (shouldAdvance) {
        // There's still more input needed — advance the bag item's state
        // without executing the effect.
        updateBagEffectResolutionInput(ctx, bagId, mergedResolutionInput);
        traceLorcanaRuntimeStep({
          kind: "bag.effect.resolution.advanced",
          moveId: "resolveBag",
          playerId: bagEntry.controllerId,
          bagItemId: bagId,
          cardId: bagEntry.sourceId,
          cardName: getLorcanaCardName(bagEntry.sourceId, (cardId) =>
            ctx.cards.getDefinition(cardId),
          ),
          message: "Bag effect selection advanced to next step",
        });
        logResolveBagMessage(
          ctx,
          bagEntry,
          mergedResolutionInput as ActionResolutionInput,
          "pending",
        );
        return;
      }
    }

    const bagEffect = getBagEffect(ctx, bagId) as BagEffectEntry | undefined;
    if (!bagEffect) {
      throw new Error(`Bag effect '${bagId}' was not found during execution`);
    }

    const sourceCardName = getLorcanaCardName(bagEffect.sourceId, (cardId) =>
      ctx.cards.getDefinition(cardId),
    );
    traceLorcanaRuntimeStep({
      kind: "bag.effect.selected",
      moveId: "resolveBag",
      playerId: bagEffect.controllerId,
      bagItemId: bagId,
      cardId: bagEffect.sourceId,
      cardName: sourceCardName,
      message: "Bag effect selected",
      payload: {
        controllerId: bagEffect.controllerId,
      },
    });

    ctx.G.triggeredAbilities.bag.lastResolvedPlayerId = bagEffect.controllerId;

    const resolutionInput: ActionResolutionInput = {
      ...cloneActionResolutionInput(bagEffect.resolutionInput as ActionResolutionInput),
      ...ctx.args.params,
    } as ActionResolutionInput;

    // When executing a bag effect for an optional triggered ability, treat any
    // non-explicit-decline as acceptance. The player chose to call resolveBag
    // (rather than decline), so absence of resolveOptional = implicit accept.
    // Only explicit resolveOptional: false declines the optional.
    // Exception: if the optional has zero valid candidates AND no targets were
    // submitted, force decline — the player cannot meaningfully accept, and
    // validate() lets this through specifically so we can drain here.
    //
    // Only apply auto-accept when the top-level bag effect IS optional.
    // A sequence that contains a nested optional (e.g. "draw, then you may
    // play a character for free") must NOT inherit resolveOptional here —
    // the optional step will create its own pending-effect prompt after
    // preceding steps (like draw) have completed.
    const effectRequirements = analyzeResolutionRequirements(bagEffect.effect);
    const topLevelType = (bagEffect.effect as unknown as Record<string, unknown> | null)?.type as
      | string
      | undefined;
    if (
      topLevelType !== "sequence" &&
      effectRequirements.isOptional &&
      resolutionInput.resolveOptional !== false
    ) {
      const executeRawTargets = ctx.args.params?.targets;
      const executeTargetCount = countExplicitTargetSelections(executeRawTargets);
      const executeTargetAnalysis = analyzeEffectTargets(
        bagEffect.effect,
        bagEffect.controllerId as PlayerId,
        ctx,
        bagEffect.sourceId as CardInstanceId,
      );
      const executeCandidateCount =
        executeTargetAnalysis.cardCandidates.length + executeTargetAnalysis.playerCandidates.length;
      // Only auto-decline when the player EXPLICITLY submitted empty targets
      // (targets: []). Undefined targets means the player is accepting without
      // a target picker (e.g. sequence where the first step synthesizes input),
      // and we must preserve the existing auto-accept behavior.
      if (
        shouldSkipEffectWithNoValidTargets(
          bagEffect.effect,
          bagEffect.controllerId as PlayerId,
          ctx,
          bagEffect.sourceId as CardInstanceId,
          "bag-decision",
        ) ||
        (effectRequirements.requiresExplicitTargetSelection &&
          executeRawTargets !== undefined &&
          executeTargetCount === 0 &&
          executeCandidateCount === 0)
      ) {
        (resolutionInput as Record<string, unknown>).resolveOptional = false;
      } else {
        (resolutionInput as Record<string, unknown>).resolveOptional = true;
      }
    }

    // For a sequence whose first step(s) contain an optional, auto-accept the
    // optional when the player submitted explicit targets. The bag call implies
    // acceptance; the targets prove the player intended to proceed with the
    // optional step. Without this, sequences like `optional { banish(own) }` →
    // `conditional { if-you-do: opponent banishes }` never propagate the accept.
    // Note: sequences where the optional is a *later* step (e.g. draw → optional
    // play-card) do NOT supply targets to the bag call, so `hasProvidedTargets`
    // is false and this block is skipped — those sequences get their own pending
    // prompt after the preceding steps resolve.
    if (
      topLevelType === "sequence" &&
      effectRequirements.isOptional &&
      hasProvidedTargets &&
      resolutionInput.resolveOptional !== false
    ) {
      (resolutionInput as Record<string, unknown>).resolveOptional = true;
    }

    const paramsWithPlayerTargets = ctx.args.params as typeof ctx.args.params & {
      playerTargets?: SelectionTarget | SelectionTarget[];
    };
    const rawTargets = ctx.args.params?.targets;
    if (isSlottedTargetInput(rawTargets)) {
      resolutionInput.slottedTargets = rawTargets;
    }
    const cardTargets: SelectionTarget[] =
      rawTargets !== undefined
        ? isSlottedTargetInput(rawTargets)
          ? flattenSlottedTargets(rawTargets).filter(
              (target): target is SelectionTarget => typeof target === "string",
            )
          : Array.isArray(rawTargets)
            ? rawTargets.filter((target): target is SelectionTarget => typeof target === "string")
            : typeof rawTargets === "string"
              ? [rawTargets]
              : []
        : [];
    const playerTargets: SelectionTarget[] = Array.isArray(paramsWithPlayerTargets?.playerTargets)
      ? paramsWithPlayerTargets.playerTargets.filter(
          (target): target is SelectionTarget => typeof target === "string",
        )
      : typeof paramsWithPlayerTargets?.playerTargets === "string"
        ? [paramsWithPlayerTargets.playerTargets]
        : [];
    const allTargets = [...cardTargets, ...playerTargets];
    if (allTargets.length > 0) {
      const nextResolutionInput = withCurrentSelectionTargets(resolutionInput, allTargets);
      Object.assign(resolutionInput, nextResolutionInput);
    } else if (rawTargets !== undefined && effectRequirements.allowsExplicitEmptyTargetSelection) {
      // The player explicitly submitted `targets: []` for an "up to N" effect.
      // Mark the resolution so downstream target-selection steps (including
      // staged sequence steps that reference the same selection) treat the
      // empty selection as committed and do not re-suspend into an identical
      // picker. Mirrors the equivalent logic in resolveEffect.
      resolutionInput.targetSelectionResolved = true;
    }
    const shouldAttemptResolution = canResolveBagEffectByRestrictions(ctx, bagEffect);

    if (shouldAttemptResolution) {
      const shouldResolve =
        !bagEffect.condition ||
        evaluateActionCondition(bagEffect.condition, ctx, bagEffect.cardPlayed, resolutionInput);
      if (!shouldResolve) {
        removeBagEffect(ctx, bagId);
        traceLorcanaRuntimeStep({
          kind: "bag.effect.skipped",
          moveId: "resolveBag",
          playerId: bagEffect.controllerId,
          bagItemId: bagId,
          cardId: bagEffect.sourceId,
          cardName: sourceCardName,
          message: "Bag effect skipped because its condition was not met",
        });
        logResolveBagMessage(ctx, bagEffect, resolutionInput, "cancelled", "condition-not-met");
        flushTriggeredEventsToBag(ctx);
      } else {
        traceLorcanaRuntimeStep({
          kind: "bag.effect.resolution.started",
          moveId: "resolveBag",
          playerId: bagEffect.controllerId,
          bagItemId: bagId,
          cardId: bagEffect.sourceId,
          cardName: sourceCardName,
          message: "Effect goes to resolution",
        });
        const result = resolveActionEffect(
          ctx,
          bagEffect.cardPlayed,
          bagEffect.effect,
          resolutionInput,
          {
            allowPromptForExistingChosenTargets: true,
            sourceAbilityIndex: bagEffect.abilityIndex,
          },
        );
        if (result.status === "suspended") {
          traceLorcanaRuntimeStep({
            kind: "bag.effect.resolution.suspended",
            moveId: "resolveBag",
            playerId: bagEffect.controllerId,
            bagItemId: bagId,
            cardId: bagEffect.sourceId,
            cardName: sourceCardName,
            message: "Bag effect resolution is waiting for further input",
          });
          logResolveBagMessage(ctx, bagEffect, resolutionInput, "pending");
          // When auto-drain partially resolved a sequence (e.g. the leading
          // mandatory `draw` of "draw a card. Then, you may play a character...")
          // and the next step needs a player decision (a nested optional), keep
          // the bag entry with its effect rewritten to the pending sub-effect.
          // This preserves the player's bag-resolution affordance instead of
          // forcing them to discover a separately-tracked pendingEffect.
          // Triggered when: caller supplied no `params` (auto-drain calls resolveBag
          // with bagId only); top-level effect was a sequence; the pending effect
          // is an optional-selection.
          const pendingEffect = result.pendingEffect;
          const callerParams = ctx.args.params;
          const isAutoDrain = !callerParams || Object.keys(callerParams).length === 0;
          const wasSequence =
            (bagEffect.effect as unknown as Record<string, unknown> | null)?.type === "sequence";
          const firstSequenceStepType =
            wasSequence && Array.isArray((bagEffect.effect as { steps?: unknown }).steps)
              ? ((
                  (bagEffect.effect as { steps: unknown[] }).steps[0] as
                    | { type?: unknown }
                    | undefined
                )?.type ?? null)
              : null;
          if (
            isAutoDrain &&
            wasSequence &&
            firstSequenceStepType === "draw" &&
            pendingEffect.kind === "optional-selection" &&
            pendingEffect.effect
          ) {
            const bagItems = ctx.G.triggeredAbilities.bag.items ?? [];
            const entry = bagItems.find((item) => item.id === bagId);
            if (entry) {
              entry.effect = pendingEffect.effect as typeof entry.effect;
              entry.resolutionInput = pendingEffect.resolutionInput as typeof entry.resolutionInput;
              ctx.G.pendingEffects = (ctx.G.pendingEffects ?? []).filter(
                (effect) => effect.id !== pendingEffect.id,
              );
              clearPendingActionChoice(ctx);
              flushTriggeredEventsToBag(ctx);
              return;
            }
          }
          // Work continues via pendingEffects — do not keep a duplicate bag row.
          removeBagEffect(ctx, bagId);
          return;
        }
        recordBagEffectResolution(ctx, bagEffect);
        removeBagEffect(ctx, bagId);
        traceLorcanaRuntimeStep({
          kind: "bag.effect.resolution.completed",
          moveId: "resolveBag",
          playerId: bagEffect.controllerId,
          bagItemId: bagId,
          cardId: bagEffect.sourceId,
          cardName: sourceCardName,
          message: "Effect resolution completes",
        });
        const wasAutoRejectedForNoTargets = (() => {
          if (allTargets.length > 0) return false;
          // For control-flow effects like "or" and "choice", skip the post-resolution auto-rejection check.
          // These effects have already validated their branches/options during resolution and should not be
          // marked as "no-valid-targets" after successful resolution of one branch.
          const effectRecord = bagEffect.effect as unknown as Record<string, unknown> | null;
          if (effectRecord?.type === "or" || effectRecord?.type === "choice") return false;
          const targetAnalysis = analyzeEffectTargets(
            bagEffect.effect,
            bagEffect.controllerId,
            ctx,
            bagEffect.sourceId as CardInstanceId,
          );
          const availability = analyzeTargetSelectionAvailabilityFromAnalysis(
            bagEffect.effect,
            targetAnalysis,
          );
          if (availability.shouldAutoRejectForNoValidTargets) return true;
          const firstStepEffect =
            effectRecord?.type === "sequence"
              ? ((effectRecord.steps as unknown[] | undefined)?.[0] ?? null)
              : null;
          if (firstStepEffect != null) {
            const stepAnalysis = analyzeEffectTargets(
              firstStepEffect,
              bagEffect.controllerId,
              ctx,
              bagEffect.sourceId as CardInstanceId,
            );
            return analyzeTargetSelectionAvailabilityFromAnalysis(firstStepEffect, stepAnalysis)
              .shouldAutoRejectForNoValidTargets;
          }
          return false;
        })();
        logResolveBagMessage(
          ctx,
          bagEffect,
          resolutionInput,
          wasAutoRejectedForNoTargets ? "cancelled" : "completed",
          wasAutoRejectedForNoTargets ? "no-valid-targets" : undefined,
        );
      }
    } else {
      removeBagEffect(ctx, bagId);
      logResolveBagMessage(ctx, bagEffect, resolutionInput, "cancelled", "restriction");
    }

    flushTriggeredEventsToBag(ctx);

    if (!hasPendingBagItems(ctx)) {
      ctx.G.triggeredAbilities.bag.lastResolvedPlayerId = undefined;
      if (
        !ctx.framework.state.priority.pendingChoice &&
        (ctx.G.pendingEffects?.length ?? 0) === 0
      ) {
        if (ctx.G.pendingTurnTransition) {
          continuePendingTurnTransition(ctx);
        } else if (ctx.G.challengeState) {
          continuePendingChallengeResolution(ctx);
          // After challenge resolution completes, challengeState may have been cleared.
          // If so (and no new bag items were enqueued), restore priority to the turn
          // player so that the active player can continue taking actions.
          if (
            !ctx.G.challengeState &&
            !hasPendingBagItems(ctx) &&
            !ctx.framework.state.priority.pendingChoice &&
            (ctx.G.pendingEffects?.length ?? 0) === 0
          ) {
            const turnPlayer = resolveTurnOwnerId(ctx.framework.state, ctx.G);
            if (turnPlayer && ctx.framework.state.currentPlayer !== turnPlayer) {
              if (typeof ctx.framework.priority?.setHolder === "function") {
                ctx.framework.priority.setHolder(turnPlayer);
              } else {
                (ctx.framework.state.priority as { holder?: PlayerId }).holder = turnPlayer;
              }
            }
          }
        } else {
          // Bag resolved mid-turn (no pending transition or challenge).
          // Priority may have been temporarily transferred to the bag controller
          // for resolution.  Restore it to the actual turn player so that
          // subsequent triggered-ability restriction checks (e.g. "during an
          // opponent's turn") evaluate against the correct active player.
          const turnPlayer = resolveTurnOwnerId(ctx.framework.state, ctx.G);
          if (turnPlayer && ctx.framework.state.currentPlayer !== turnPlayer) {
            if (typeof ctx.framework.priority?.setHolder === "function") {
              ctx.framework.priority.setHolder(turnPlayer);
            } else {
              (ctx.framework.state.priority as { holder?: PlayerId }).holder = turnPlayer;
            }
          }
        }
      }
    }
  },

  available: (ctx) => {
    // Block bag resolution while a pending effect (e.g., target selection from a played action card)
    // is awaiting resolution. Rule 6.7.7: effects of a card played during resolution must fully
    // resolve before other bag triggers can be resolved.
    if (ctx.framework.state.priority.pendingChoice || (ctx.G.pendingEffects?.length ?? 0) > 0) {
      return false;
    }

    if (ctx.playerId !== getNextBagResolver(ctx)) {
      const bagItems = ctx.G.triggeredAbilities?.bag.items ?? [];
      return bagItems.some((bagEffect) => {
        const effectForAvailability = resolveConditionalEffectBranch(
          bagEffect.effect,
          ctx as unknown as Parameters<typeof evaluateActionCondition>[1],
          {
            ...bagEffect.cardPlayed,
            singerIds: bagEffect.cardPlayed.singerIds
              ? [...bagEffect.cardPlayed.singerIds]
              : undefined,
          },
          cloneActionResolutionInput(bagEffect.resolutionInput as ActionResolutionInput),
        );

        return getDirectBagChooserId(ctx, bagEffect, effectForAvailability) === ctx.playerId;
      });
    }

    return getBagItemsForCurrentResolver(ctx).length > 0;
  },
};

function assertNever(value: never): never {
  throw new Error(`Unhandled resolve bag status: ${String(value)}`);
}
