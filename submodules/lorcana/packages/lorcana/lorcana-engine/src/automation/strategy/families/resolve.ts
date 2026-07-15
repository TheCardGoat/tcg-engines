import type { CardInstanceId } from "#core";
import type { Effect } from "@tcg/lorcana-types";
import {
  evaluateOptionalResolutionPolicy,
  type OptionalResolutionPolicyEvaluation,
  type OptionalResolutionPolicyMetadata,
} from "../../resolve-policy-inventory";
import type {
  AutomatedActionCandidate,
  AutomatedActionPlanningContext,
  AutomatedActionTargetId,
} from "../../types";
import type { BagEffectEntry, PendingActionEffect } from "../../../types";
import { compareBooleansDescending, createHeuristic, getProjectedCard } from "../common";
import type { FamilyEvaluation, FamilyEvaluator } from "../internal-types";

type ResolveCandidate = Extract<
  AutomatedActionCandidate,
  { family: "resolveBag" } | { family: "resolveEffect" }
>;

function isResolveCandidate(candidate: AutomatedActionCandidate): candidate is ResolveCandidate {
  return candidate.family === "resolveBag" || candidate.family === "resolveEffect";
}

type EffectInspectionNode = Effect & {
  amount?: number;
  chooser?: string;
  effect?: Effect;
  effects?: Effect[];
  else?: Effect;
  falseEffect?: Effect;
  forEach?: Effect[];
  ifFalse?: Effect;
  ifTrue?: Effect;
  options?: Effect[];
  source?: AutomatedActionTargetId | { zones?: string[] } | string;
  steps?: Effect[];
  target?: string;
  then?: Effect;
  trueEffect?: Effect;
  type: string;
};

type ResolutionMetadata = {
  abilityIndex?: number;
  abilityName?: string;
  controllerId: string;
  effect?: Effect;
  sourceCardId?: CardInstanceId;
  sourceDefinitionId?: string;
};

function isEffectInspectionNode(value: unknown): value is EffectInspectionNode {
  return typeof value === "object" && value !== null && "type" in value;
}

function isBagEffectEntryPayload(value: unknown): value is BagEffectEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    "controllerId" in value &&
    "effect" in value &&
    "id" in value
  );
}

function isPendingActionEffectPayload(value: unknown): value is PendingActionEffect {
  return (
    typeof value === "object" &&
    value !== null &&
    "controllerId" in value &&
    "effect" in value &&
    "sourceCardId" in value
  );
}

function readInspectableEffect(value: unknown): Effect | undefined {
  return isEffectInspectionNode(value) ? value : undefined;
}

function getAbilityNameFromDefinition(
  context: AutomatedActionPlanningContext,
  sourceCardId: CardInstanceId | undefined,
  abilityIndex: number | undefined,
): string | undefined {
  if (!sourceCardId || typeof abilityIndex !== "number") {
    return undefined;
  }

  const definition = context.getCardDefinition(sourceCardId);
  if (!definition?.abilities || abilityIndex < 0 || abilityIndex >= definition.abilities.length) {
    return undefined;
  }

  return definition.abilities[abilityIndex]?.name;
}

function readBagMetadata(
  context: AutomatedActionPlanningContext,
  candidate: Extract<ResolveCandidate, { family: "resolveBag" }>,
): ResolutionMetadata | undefined {
  const hinted = context.authoritativeHints?.bagItems.find((entry) => entry.id === candidate.bagId);
  if (hinted) {
    const sourceCardId = hinted.sourceId;
    const abilityIndex = hinted.abilityIndex;

    return {
      abilityIndex,
      abilityName:
        hinted.abilityName ?? getAbilityNameFromDefinition(context, sourceCardId, abilityIndex),
      controllerId: hinted.controllerId,
      effect: readInspectableEffect(hinted.effect),
      sourceCardId,
      sourceDefinitionId:
        context.getCardDefinition(sourceCardId)?.id ??
        context.resolveCandidateSourceDefinitionId(candidate),
    };
  }

  const projected = context.board.bagEffects.find((entry) => entry.id === candidate.bagId)?.payload;
  if (!isBagEffectEntryPayload(projected)) {
    return undefined;
  }

  const sourceCardId = projected.sourceId;
  const abilityIndex = projected.abilityIndex;

  return {
    abilityIndex,
    abilityName:
      projected.abilityName ?? getAbilityNameFromDefinition(context, sourceCardId, abilityIndex),
    controllerId: projected.controllerId,
    effect: readInspectableEffect(projected.effect),
    sourceCardId,
    sourceDefinitionId:
      context.getCardDefinition(sourceCardId)?.id ??
      context.resolveCandidateSourceDefinitionId(candidate),
  };
}

function readPendingMetadata(
  context: AutomatedActionPlanningContext,
  candidate: Extract<ResolveCandidate, { family: "resolveEffect" }>,
): ResolutionMetadata | undefined {
  const hinted = context.authoritativeHints?.pendingEffects.find(
    (entry) => entry.id === candidate.effectId,
  );
  if (hinted) {
    const sourceCardId = hinted.sourceCardId ?? hinted.sourceId;
    const abilityIndex = hinted.abilityIndex;

    return {
      abilityIndex,
      abilityName: getAbilityNameFromDefinition(context, sourceCardId, abilityIndex),
      controllerId: hinted.controllerId,
      effect: readInspectableEffect(hinted.effect),
      sourceCardId,
      sourceDefinitionId:
        context.getCardDefinition(sourceCardId)?.id ??
        context.resolveCandidateSourceDefinitionId(candidate),
    };
  }

  const projected = context.board.pendingEffects.find(
    (entry) => entry.id === candidate.effectId,
  )?.payload;
  if (!isPendingActionEffectPayload(projected)) {
    return undefined;
  }

  const sourceCardId = projected.sourceCardId ?? projected.sourceId;
  const abilityIndex = projected.abilityIndex;

  return {
    abilityIndex,
    abilityName: getAbilityNameFromDefinition(context, sourceCardId, abilityIndex),
    controllerId: projected.controllerId,
    effect: readInspectableEffect(projected.effect),
    sourceCardId,
    sourceDefinitionId:
      context.getCardDefinition(sourceCardId)?.id ??
      context.resolveCandidateSourceDefinitionId(candidate),
  };
}

function readResolutionMetadata(
  context: AutomatedActionPlanningContext,
  candidate: ResolveCandidate,
): ResolutionMetadata | undefined {
  switch (candidate.family) {
    case "resolveBag":
      return readBagMetadata(context, candidate);
    case "resolveEffect":
      return readPendingMetadata(context, candidate);
  }
}

function doesTargetBenefitActor(
  target: string | undefined,
  controllerId: string,
  actorId: string,
): boolean {
  if (!target) {
    return false;
  }

  if (target === "CONTROLLER" || target === "YOU") {
    return controllerId === actorId;
  }

  if (target === "OPPONENT" || target === "EACH_OPPONENT") {
    return controllerId !== actorId;
  }

  if (target === actorId) {
    return true;
  }

  return false;
}

function countDestinationBenefit(candidate: ResolveCandidate): number {
  return (
    candidate.destinations?.reduce((score, destination) => {
      switch (destination.zone) {
        case "play":
          return score + destination.cards.length * 6;
        case "hand":
          return score + destination.cards.length * 4;
        case "inkwell":
        case "deck-top":
        case "deck-bottom":
          return score + 0;
        default:
          return score;
      }
    }, 0) ?? 0
  );
}

function estimateEffectBenefit(
  node: EffectInspectionNode,
  controllerId: string,
  actorId: string,
): number {
  let score = 0;

  switch (node.type) {
    case "draw":
      if (doesTargetBenefitActor(node.target, controllerId, actorId)) {
        score += (node.amount ?? 1) * 3;
      }
      break;
    case "gain-lore":
      if (doesTargetBenefitActor(node.target, controllerId, actorId)) {
        score += (node.amount ?? 1) * 4;
      }
      break;
    case "put-into-inkwell":
      if (doesTargetBenefitActor(node.target, controllerId, actorId)) {
        score += 3;
      }
      break;
    case "play-card":
      score += 5;
      break;
    default:
      break;
  }

  const nestedEffects = [
    node.effect,
    node.then,
    node.else,
    node.ifTrue,
    node.ifFalse,
    node.trueEffect,
    node.falseEffect,
    ...(node.effects ?? []),
    ...(node.options ?? []),
    ...(node.steps ?? []),
    ...(node.forEach ?? []),
  ].filter((effect): effect is Effect => Boolean(effect));

  return (
    score +
    nestedEffects.reduce(
      (current, effect) =>
        current + estimateEffectBenefit(effect as EffectInspectionNode, controllerId, actorId),
      0,
    )
  );
}

function canCardBePutInInkwell(
  context: AutomatedActionPlanningContext,
  cardId: CardInstanceId,
): boolean {
  const projectedCard = getProjectedCard(context, String(cardId));
  if (typeof projectedCard?.canBePutInInkwell === "boolean") {
    return projectedCard.canBePutInInkwell;
  }

  return context.getCardDefinition(cardId)?.inkable ?? false;
}

function buildOptionalResolutionPolicyMetadata(
  context: AutomatedActionPlanningContext,
  candidate: ResolveCandidate,
  metadata: ResolutionMetadata | undefined,
): OptionalResolutionPolicyMetadata {
  const actorHandCardIds = (context.board.players[context.actorId]?.hand ?? []).map(
    (cardId) => String(cardId) as CardInstanceId,
  );
  const actorUninkableHandCount = actorHandCardIds.reduce((count, cardId) => {
    return count + (canCardBePutInInkwell(context, cardId) ? 0 : 1);
  }, 0);
  const sourceCardId = metadata?.sourceCardId ?? context.resolveCandidateSourceCardId(candidate);

  return {
    abilityIndex: metadata?.abilityIndex,
    abilityName: metadata?.abilityName,
    actorHandCardIds,
    actorHandSize: actorHandCardIds.length,
    actorUninkableHandCount,
    allActorHandCardsUninkable: actorHandCardIds.length === actorUninkableHandCount,
    sourceCardId,
    sourceDefinitionId:
      metadata?.sourceDefinitionId ??
      (sourceCardId ? context.getCardDefinition(sourceCardId)?.id : undefined) ??
      context.resolveCandidateSourceDefinitionId(candidate),
  };
}

function buildResolutionPolicyHeuristics(args: {
  candidate: ResolveCandidate;
  evaluation: OptionalResolutionPolicyEvaluation | undefined;
  metadata: OptionalResolutionPolicyMetadata;
}) {
  if (typeof args.candidate.resolveOptional !== "boolean") {
    return [];
  }

  const policyDecision = args.evaluation ? (args.evaluation.accept ? "accept" : "decline") : "none";

  return [
    createHeuristic("preferTrue", "resolvePolicyMatched", Boolean(args.evaluation)),
    createHeuristic("asc", "resolvePolicyId", args.evaluation?.id ?? "none"),
    createHeuristic("asc", "resolvePolicyDecision", policyDecision),
    createHeuristic(
      "asc",
      "resolvePolicyReason",
      args.evaluation?.reason ?? "no-card-specific-policy",
    ),
    createHeuristic("asc", "resolvePolicyHandSize", args.metadata.actorHandSize),
    createHeuristic(
      "asc",
      "resolvePolicyUninkableHandCount",
      args.metadata.actorUninkableHandCount,
    ),
    createHeuristic(
      "preferTrue",
      "resolvePolicyAllHandCardsUninkable",
      args.metadata.allActorHandCardsUninkable,
    ),
    createHeuristic(
      "preferTrue",
      "resolvePolicyDecisionAligned",
      args.evaluation ? args.candidate.resolveOptional === args.evaluation.accept : false,
    ),
  ];
}

function getResolutionComplexity(candidate: ResolveCandidate): number {
  return (
    (candidate.targets?.length ?? 0) +
    (typeof candidate.choiceIndex === "number" ? 1 : 0) +
    (typeof candidate.resolveOptional === "boolean" ? 1 : 0) +
    (candidate.destinations?.reduce((count, destination) => count + destination.cards.length, 0) ??
      0)
  );
}

function getResolutionBenefitScore(
  context: AutomatedActionPlanningContext,
  candidate: ResolveCandidate,
  metadata: ResolutionMetadata | undefined,
): number {
  if (candidate.resolveOptional === false) {
    return 0;
  }

  const destinationScore = countDestinationBenefit(candidate);
  if (!metadata?.effect) {
    return destinationScore;
  }

  return (
    destinationScore +
    estimateEffectBenefit(
      metadata.effect as EffectInspectionNode,
      metadata.controllerId,
      context.actorId,
    )
  );
}

function getResolutionVariantKey(candidate: ResolveCandidate): string {
  const destinationsKey =
    candidate.destinations
      ?.map((destination) => `${destination.zone}:${destination.cards.join(",")}`)
      .join("|") ?? "";

  return [
    candidate.choiceIndex ?? "",
    candidate.namedCard ?? "",
    candidate.targets?.join(",") ?? "",
    destinationsKey,
  ].join(":");
}

function areOptionalResolutionVariantsForSameSource(
  left: AutomatedActionCandidate,
  right: AutomatedActionCandidate,
): boolean {
  if (!isResolveCandidate(left) || !isResolveCandidate(right)) {
    return false;
  }

  if (
    left.family !== right.family ||
    typeof left.resolveOptional !== "boolean" ||
    typeof right.resolveOptional !== "boolean"
  ) {
    return false;
  }

  let sameSourceId = false;

  if (left.family === "resolveBag" && right.family === "resolveBag") {
    sameSourceId = left.bagId === right.bagId;
  }

  if (left.family === "resolveEffect" && right.family === "resolveEffect") {
    sameSourceId = left.effectId === right.effectId;
  }

  return sameSourceId && getResolutionVariantKey(left) === getResolutionVariantKey(right);
}

export const evaluateResolution: FamilyEvaluator<ResolveCandidate> = (
  context,
  candidate,
): FamilyEvaluation => {
  const metadata = readResolutionMetadata(context, candidate);
  const policyMetadata = buildOptionalResolutionPolicyMetadata(context, candidate, metadata);
  const policyEvaluation =
    typeof candidate.resolveOptional === "boolean"
      ? evaluateOptionalResolutionPolicy(policyMetadata)
      : undefined;

  return {
    heuristics: buildResolutionPolicyHeuristics({
      candidate,
      evaluation: policyEvaluation,
      metadata: policyMetadata,
    }),
    ranking: {
      resolveBenefitScore: getResolutionBenefitScore(context, candidate, metadata),
      resolveComplexity: getResolutionComplexity(candidate),
      resolveOptionalAccepted: candidate.resolveOptional === true,
      resolvePolicyDecisionAligned:
        policyEvaluation && typeof candidate.resolveOptional === "boolean"
          ? candidate.resolveOptional === policyEvaluation.accept
          : undefined,
    },
  };
};

export function compareResolution(
  leftCandidate: AutomatedActionCandidate,
  left: FamilyEvaluation["ranking"],
  rightCandidate: AutomatedActionCandidate,
  right: FamilyEvaluation["ranking"],
): number {
  if (areOptionalResolutionVariantsForSameSource(leftCandidate, rightCandidate)) {
    const policyAlignmentOrder = compareBooleansDescending(
      left.resolvePolicyDecisionAligned ?? false,
      right.resolvePolicyDecisionAligned ?? false,
    );
    if (policyAlignmentOrder !== 0) {
      return policyAlignmentOrder;
    }
  }

  const benefitOrder = (right.resolveBenefitScore ?? 0) - (left.resolveBenefitScore ?? 0);
  if (benefitOrder !== 0) {
    return benefitOrder;
  }

  if ((left.resolveOptionalAccepted ?? false) !== (right.resolveOptionalAccepted ?? false)) {
    return left.resolveOptionalAccepted ? -1 : 1;
  }

  return (left.resolveComplexity ?? 0) - (right.resolveComplexity ?? 0);
}
