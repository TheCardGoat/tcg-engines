import type {
  CardInstanceId,
  MoveEnumerationContext,
  MoveInput,
  MoveValidationContext,
  PlayerId,
} from "#core";
import { analyzeEffectTargets, type TargetAnalysis } from "./target-analysis";
import {
  allowsExplicitEmptyTargetSelection,
  analyzeResolutionRequirements,
} from "./resolution-requirements";

type TargetSelectionAvailabilityContext = Pick<
  MoveValidationContext<MoveInput> | MoveEnumerationContext,
  "framework" | "cards"
> & {
  args?: unknown;
};

type TargetSelectionAvailabilityOptions = {
  analysis?: TargetAnalysis;
  includeDeferredChosenSelections?: boolean;
  minSelections?: number;
  maxSelections?: number;
};

export type TargetSelectionAvailability = {
  candidateCount: number;
  cardCandidateCount: number;
  playerCandidateCount: number;
  minSelections: number;
  maxSelections: number;
  allowsExplicitEmptyTargetSelection: boolean;
  canSatisfyRequiredSelection: boolean;
  shouldAutoRejectForNoValidTargets: boolean;
  requiresExplicitTargetSelection: boolean;
};

export function analyzeTargetSelectionAvailabilityFromAnalysis(
  effectOrAbility: unknown,
  analysis: TargetAnalysis,
  options?: Pick<TargetSelectionAvailabilityOptions, "minSelections" | "maxSelections">,
): TargetSelectionAvailability {
  const cardCandidateCount = analysis.cardCandidates.length;
  const playerCandidateCount = analysis.playerCandidates.length;
  const candidateCount = cardCandidateCount + playerCandidateCount;
  const minSelections = Math.max(0, options?.minSelections ?? analysis.minSelections);
  const maxSelections = Math.max(0, options?.maxSelections ?? analysis.maxSelections);
  const requiresExplicitTargetSelection = analysis.requiresExplicitSelection;
  const canSatisfyRequiredSelection =
    !requiresExplicitTargetSelection ||
    minSelections <= 0 ||
    (candidateCount > 0 && (analysis.allowDuplicateTargets || candidateCount >= minSelections));

  const resolutionReqs = analyzeResolutionRequirements(effectOrAbility);

  return {
    candidateCount,
    cardCandidateCount,
    playerCandidateCount,
    minSelections,
    maxSelections,
    allowsExplicitEmptyTargetSelection: allowsExplicitEmptyTargetSelection(effectOrAbility),
    canSatisfyRequiredSelection,
    shouldAutoRejectForNoValidTargets:
      !resolutionReqs.isOptional &&
      requiresExplicitTargetSelection &&
      (candidateCount === 0 || !canSatisfyRequiredSelection),
    requiresExplicitTargetSelection,
  };
}

export function analyzeTargetSelectionAvailability(
  effectOrAbility: unknown,
  playerId: PlayerId,
  ctx: TargetSelectionAvailabilityContext,
  sourceCardId?: CardInstanceId,
  options?: TargetSelectionAvailabilityOptions,
): TargetSelectionAvailability {
  const analysis =
    options?.analysis ??
    analyzeEffectTargets(effectOrAbility, playerId, ctx, sourceCardId, {
      includeDeferredChosenSelections: options?.includeDeferredChosenSelections,
    });

  return analyzeTargetSelectionAvailabilityFromAnalysis(effectOrAbility, analysis, {
    minSelections: options?.minSelections,
    maxSelections: options?.maxSelections,
  });
}
