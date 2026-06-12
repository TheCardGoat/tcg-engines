import type { CardInstanceId } from "#core";
import type {
  AutomatedActionCandidate,
  AutomatedActionCandidateContributor,
  AutomatedActionCandidateHeuristic,
  AutomatedActionCandidateSummary,
  AutomatedActionDeckRoleTag,
  AutomatedActionPlanningContext,
  AutomatedActionStrategy,
  AutomatedActionStrategyTag,
  StrategyAxis,
  StrategyInformationPolicy,
} from "./types";
import {
  type DeckAwareOpeningFamilyBias,
  type DeckAwareOpeningPlan,
  type RoleWeightMap,
  getAutomatedActionCardMatchupAdjustment,
  getAutomatedActionCardOverride,
  getAutomatedActionColorPairProfile,
  getAutomatedActionInkWeights,
  getAutomatedActionMatchupModifier,
  getAutomatedActionMulliganWeights,
  getAutomatedActionOpeningPlan,
  getAutomatedActionRoleWeights,
} from "./deck-profile";
import {
  evaluateBestAiCardStrategy,
  evaluateBestAiMatchupPlans,
  type EvaluatedBestAiCardStrategy,
  type EvaluatedBestAiMatchupPlan,
} from "./strategy-data";
import { summarizeLoreRaceCandidates } from "./strategy";
import type { LoreRaceHeuristicPreferences } from "./strategy/internal-types";
import {
  countCopiesInHand,
  createHeuristic,
  getAvailableInkForPlayer,
  getProjectedCard,
} from "./strategy/common";
import { scoreAutomatedActionTargets } from "./target-priority";
import { classifyEffectPolarity } from "./effect-polarity";

type Contribution = {
  axis?: StrategyAxis;
  key: string;
  reason?: string;
  ruleId?: string;
  source: AutomatedActionCandidateContributor["source"];
  strategyTags?: readonly AutomatedActionStrategyTag[];
  value: number;
};

type CandidateDeckAwareBreakdown = {
  contributors: Contribution[];
  effectiveFamilyOrder: number;
  familyBias: number;
  matchedRuleIds: readonly string[];
  matchupCardAdjustment: number;
  openingEarlyPlayDelta: number;
  openingFamilyBias: number;
  openingInkablesDelta: number;
  openingLateCardDelta: number;
  openingTwoDropDelta: number;
  openingUninkableDelta: number;
  roleScore: number;
  sourceDefinitionId?: string;
  targetScore: number;
  topContributors: string;
  totalScore: number;
};

type CandidateSummaryRecord = {
  baseFamilyOrder: number;
  baseIndex: number;
  breakdown: CandidateDeckAwareBreakdown;
  summary: AutomatedActionCandidateSummary;
};

type CandidateWithTargets = Extract<
  AutomatedActionCandidate,
  | { family: "playCard" }
  | { family: "activateAbility" }
  | { family: "resolveBag" }
  | { family: "resolveEffect" }
>;

type OpeningHandShape = {
  earlyPlayCount: number;
  inkableCount: number;
  lateCardCount: number;
  twoDropCount: number;
  uninkableCount: number;
};

type OpeningStructureMetrics = {
  openingEarlyPlayDelta: number;
  openingInkablesDelta: number;
  openingLateCardDelta: number;
  openingTwoDropDelta: number;
  openingUninkableDelta: number;
};

type DeckAwareStrategyConfig = {
  informationPolicy: StrategyInformationPolicy;
  name: string;
  useBestAiRules?: boolean;
};

type FamilyBiasMap = {
  challenge: number;
  playCard: number;
  putCardIntoInkwell: number;
  quest: number;
};

type BestAiAxisAdjustment = {
  contributors: Contribution[];
  matchedRuleIds: readonly string[];
  score: number;
  targetPreference?: EvaluatedBestAiCardStrategy["targetPreference"];
};

function mergeRoleWeights(...weights: Array<RoleWeightMap | undefined>): RoleWeightMap {
  const merged: Partial<Record<AutomatedActionDeckRoleTag, number>> = {};

  for (const current of weights) {
    if (!current) {
      continue;
    }

    for (const [role, value] of Object.entries(current)) {
      if (typeof value !== "number") {
        continue;
      }

      const resolvedRole = role as AutomatedActionDeckRoleTag;
      merged[resolvedRole] = (merged[resolvedRole] ?? 0) + value;
    }
  }

  return merged;
}

function mergeOpeningFamilyBias(
  ...biases: Array<Partial<DeckAwareOpeningFamilyBias> | undefined>
): DeckAwareOpeningFamilyBias {
  const merged: DeckAwareOpeningFamilyBias = {
    challenge: 0,
    playCard: 0,
    putCardIntoInkwell: 0,
    quest: 0,
  };

  for (const current of biases) {
    if (!current) {
      continue;
    }

    for (const family of Object.keys(merged) as Array<keyof DeckAwareOpeningFamilyBias>) {
      const value = current[family];
      if (typeof value !== "number" || !Number.isFinite(value)) {
        continue;
      }

      merged[family] += value;
    }
  }

  return merged;
}

function mergeOpeningPlan(
  baseline: DeckAwareOpeningPlan,
  ...overrides: Array<Partial<DeckAwareOpeningPlan> | undefined>
): DeckAwareOpeningPlan {
  let merged = baseline;

  for (const current of overrides) {
    if (!current) {
      continue;
    }

    merged = {
      maxLateCardsToKeep: current.maxLateCardsToKeep ?? merged.maxLateCardsToKeep,
      maxUninkablesToKeep: current.maxUninkablesToKeep ?? merged.maxUninkablesToKeep,
      minEarlyPlayCount: current.minEarlyPlayCount ?? merged.minEarlyPlayCount,
      minInkablesToKeep: current.minInkablesToKeep ?? merged.minInkablesToKeep,
      openingFamilyBias: mergeOpeningFamilyBias(
        merged.openingFamilyBias,
        current.openingFamilyBias,
      ),
      preferredTwoDropCount: current.preferredTwoDropCount ?? merged.preferredTwoDropCount,
    };
  }

  return merged;
}

function mergeFamilyBias(...biases: Array<Partial<FamilyBiasMap> | undefined>): FamilyBiasMap {
  const merged: FamilyBiasMap = {
    challenge: 0,
    playCard: 0,
    putCardIntoInkwell: 0,
    quest: 0,
  };

  for (const current of biases) {
    if (!current) {
      continue;
    }

    for (const family of Object.keys(merged) as Array<keyof FamilyBiasMap>) {
      const value = current[family];
      if (typeof value !== "number" || !Number.isFinite(value)) {
        continue;
      }

      merged[family] += value;
    }
  }

  return merged;
}

function findNumericHeuristic(
  heuristics: readonly AutomatedActionCandidateHeuristic[],
  key: string,
): number {
  const heuristic = heuristics.find((entry) => entry.key === key);
  return typeof heuristic?.value === "number" ? heuristic.value : 0;
}

function compareContributions(left: Contribution, right: Contribution): number {
  const magnitudeOrder = Math.abs(right.value) - Math.abs(left.value);
  if (magnitudeOrder !== 0) {
    return magnitudeOrder;
  }

  return left.key.localeCompare(right.key);
}

function formatTopContributors(contributions: readonly Contribution[]): string {
  return contributions
    .filter((entry) => entry.value !== 0)
    .sort(compareContributions)
    .slice(0, 2)
    .map((entry) => `${entry.key}:${entry.value}`)
    .join(", ");
}

function createEmptyOpeningStructureMetrics(): OpeningStructureMetrics {
  return {
    openingEarlyPlayDelta: 0,
    openingInkablesDelta: 0,
    openingLateCardDelta: 0,
    openingTwoDropDelta: 0,
    openingUninkableDelta: 0,
  };
}

function getMatchupPairId(context: AutomatedActionPlanningContext): string | undefined {
  return context.matchupProfile?.pairId;
}

function resolveMatchedBestAiPlans(
  context: AutomatedActionPlanningContext,
  config: DeckAwareStrategyConfig,
): EvaluatedBestAiMatchupPlan[] {
  if (!config.useBestAiRules) {
    return [];
  }

  return evaluateBestAiMatchupPlans({
    actorDeckProfile: context.actorDeckProfile,
    opponentDeckProfile: context.opponentDeckProfile,
  });
}

function resolveOpeningPlan(
  context: AutomatedActionPlanningContext,
  config: DeckAwareStrategyConfig,
): DeckAwareOpeningPlan {
  const baseline = getAutomatedActionOpeningPlan(
    context.actorDeckProfile?.colorPairId ?? "",
    context.opponentDeckProfile?.colorPairId,
  );
  const bestAiPlans = resolveMatchedBestAiPlans(context, config);

  return mergeOpeningPlan(
    baseline,
    ...bestAiPlans.map((plan) => plan.openingPlan as Partial<DeckAwareOpeningPlan> | undefined),
  );
}

function resolveMulliganWeights(
  context: AutomatedActionPlanningContext,
  config: DeckAwareStrategyConfig,
): RoleWeightMap {
  const baseline = getAutomatedActionMulliganWeights(
    context.actorDeckProfile?.colorPairId ?? "",
    context.opponentDeckProfile?.colorPairId,
  );

  return mergeRoleWeights(
    baseline,
    ...resolveMatchedBestAiPlans(context, config).map((plan) => plan.mulliganRoleWeights),
  );
}

function resolveInkWeights(
  context: AutomatedActionPlanningContext,
  config: DeckAwareStrategyConfig,
): RoleWeightMap {
  const baseline = getAutomatedActionInkWeights(
    context.actorDeckProfile?.colorPairId ?? "",
    context.opponentDeckProfile?.colorPairId,
  );

  return mergeRoleWeights(
    baseline,
    ...resolveMatchedBestAiPlans(context, config).map((plan) => plan.inkRoleWeights),
  );
}

function resolveRoleWeights(
  context: AutomatedActionPlanningContext,
  config: DeckAwareStrategyConfig,
): RoleWeightMap {
  const baseline = getAutomatedActionRoleWeights(
    context.actorDeckProfile?.colorPairId ?? "",
    context.opponentDeckProfile?.colorPairId,
    context.turnBucket,
  );

  return mergeRoleWeights(
    baseline,
    ...resolveMatchedBestAiPlans(context, config).map(
      (plan) => plan.roleWeightsByTurnBucket[context.turnBucket],
    ),
  );
}

function resolveBestAiAxisAdjustment(args: {
  axis: StrategyAxis;
  config: DeckAwareStrategyConfig;
  context: AutomatedActionPlanningContext;
  definitionId?: string;
}): BestAiAxisAdjustment {
  if (!args.definitionId) {
    return {
      contributors: [],
      matchedRuleIds: [],
      score: 0,
    };
  }

  const evaluation = evaluateBestAiCardStrategy({
    actorDeckProfile: args.context.actorDeckProfile,
    definitionId: args.definitionId,
    opponentDeckProfile: args.context.opponentDeckProfile,
  });
  if (!evaluation) {
    return {
      contributors: [],
      matchedRuleIds: [],
      score: 0,
    };
  }

  const contributors: Contribution[] = [];
  let score = 0;
  // `baseAdjust` is always-true per-card policy (e.g. Pete's `ink: -1`
  // says "this card is too valuable to ink in any matchup"). Apply it
  // unconditionally — the per-card profile is the right layer for these
  // matchup-agnostic biases, and gating it behind `useBestAiRules`
  // silently stripped them from the promoted default strategy.
  const baseValue = evaluation.baseAdjust[args.axis] ?? 0;
  if (baseValue !== 0) {
    contributors.push({
      axis: args.axis,
      key: `${args.axis}Base:${evaluation.definitionId}`,
      reason: evaluation.baseReason,
      source: "card-profile",
      strategyTags: evaluation.strategyTags,
      value: baseValue,
    });
    score += baseValue;
  }

  // Matchup-specific `matchedRules` remain candidate-tier (gated by
  // `useBestAiRules`) — those encode opinionated matchup adjustments that
  // are still being tuned against the default baseline.
  const includeMatchedRules = args.config.useBestAiRules === true;
  if (includeMatchedRules) {
    for (const rule of evaluation.matchedRules) {
      const value = rule.adjust[args.axis] ?? 0;
      if (value === 0) {
        continue;
      }

      contributors.push({
        axis: args.axis,
        key: `${args.axis}Rule:${rule.id}`,
        reason: rule.reason,
        ruleId: rule.id,
        source: "card-rule",
        strategyTags: rule.strategyTags,
        value,
      });
      score += value;
    }
  }

  return {
    contributors,
    matchedRuleIds: includeMatchedRules ? evaluation.matchedRuleIds : [],
    score,
    targetPreference: includeMatchedRules ? evaluation.targetPreference : undefined,
  };
}

function analyzeOpeningHand(
  context: AutomatedActionPlanningContext,
  cardIds: readonly CardInstanceId[],
): OpeningHandShape {
  return cardIds.reduce<OpeningHandShape>(
    (shape, cardId) => {
      const projectedCard = getProjectedCard(context, cardId);
      const roles = context.getCardRoles(cardId);
      const cost = projectedCard?.playCost ?? 0;

      if (projectedCard?.canBePutInInkwell === true) {
        shape.inkableCount += 1;
      } else {
        shape.uninkableCount += 1;
      }

      if (roles.includes("earlyPlay")) {
        shape.earlyPlayCount += 1;
      }

      if (cost === 2) {
        shape.twoDropCount += 1;
      }

      if (roles.includes("latePlay") || cost >= 5) {
        shape.lateCardCount += 1;
      }

      return shape;
    },
    {
      earlyPlayCount: 0,
      inkableCount: 0,
      lateCardCount: 0,
      twoDropCount: 0,
      uninkableCount: 0,
    },
  );
}

function getThresholdContribution(args: {
  delta: number;
  extraBonusCap: number;
  metBonus: number;
  penaltyMultiplier: number;
}): number {
  if (args.delta >= 0) {
    return args.metBonus + Math.min(args.delta, args.extraBonusCap);
  }

  return args.delta * args.penaltyMultiplier;
}

function scoreOpeningStructure(args: {
  openingPlan: DeckAwareOpeningPlan;
  shape: OpeningHandShape;
}): {
  contributors: Contribution[];
  metrics: OpeningStructureMetrics;
  score: number;
} {
  const metrics: OpeningStructureMetrics = {
    openingEarlyPlayDelta: args.shape.earlyPlayCount - args.openingPlan.minEarlyPlayCount,
    openingInkablesDelta: args.shape.inkableCount - args.openingPlan.minInkablesToKeep,
    openingLateCardDelta: args.openingPlan.maxLateCardsToKeep - args.shape.lateCardCount,
    openingTwoDropDelta: args.shape.twoDropCount - args.openingPlan.preferredTwoDropCount,
    openingUninkableDelta: args.openingPlan.maxUninkablesToKeep - args.shape.uninkableCount,
  };
  const scoredContributors: Array<{
    delta: number;
    extraBonusCap: number;
    key: string;
    metBonus: number;
    penaltyMultiplier: number;
  }> = [
    {
      delta: metrics.openingInkablesDelta,
      extraBonusCap: 1,
      key: "openingInkables",
      metBonus: 2,
      penaltyMultiplier: 3,
    },
    {
      delta: metrics.openingEarlyPlayDelta,
      extraBonusCap: 1,
      key: "openingEarlyPlays",
      metBonus: 2,
      penaltyMultiplier: 3,
    },
    {
      delta: metrics.openingTwoDropDelta,
      extraBonusCap: 1,
      key: "openingTwoDrops",
      metBonus: 1,
      penaltyMultiplier: 2,
    },
    {
      delta: metrics.openingLateCardDelta,
      extraBonusCap: 1,
      key: "openingLateCards",
      metBonus: 1,
      penaltyMultiplier: 2,
    },
    {
      delta: metrics.openingUninkableDelta,
      extraBonusCap: 1,
      key: "openingUninkables",
      metBonus: 1,
      penaltyMultiplier: 2,
    },
  ];
  const contributors = scoredContributors.map((entry) => ({
    key: entry.key,
    source: "opening" as const,
    value: getThresholdContribution(entry),
  }));

  return {
    contributors,
    metrics,
    score: contributors.reduce((total, entry) => total + entry.value, 0),
  };
}

function resolveStrategyPreferences(
  context: AutomatedActionPlanningContext,
): LoreRaceHeuristicPreferences {
  const colorPairId = context.actorDeckProfile?.colorPairId ?? "";
  const profile = getAutomatedActionColorPairProfile(colorPairId);

  return {
    challengePriorityMode: profile.challengeMode,
    inkPrintedCostDirection: profile.inkPrintedCostDirection,
    playCardNetCostDirection: profile.playCardNetCostDirection,
    preferSimplePermanentDevelopment: profile.preferSimplePermanentDevelopment,
  };
}

function scoreDefinitionRoles(args: {
  definitionId?: string;
  roles: readonly AutomatedActionDeckRoleTag[];
  weights: RoleWeightMap;
}): {
  contributors: Contribution[];
  score: number;
} {
  if (!args.definitionId || args.roles.length === 0) {
    return {
      contributors: [],
      score: 0,
    };
  }

  const override = getAutomatedActionCardOverride(args.definitionId);
  const roles = new Set<AutomatedActionDeckRoleTag>(args.roles);
  for (const role of Object.keys(override?.roleAdjustments ?? {})) {
    roles.add(role as AutomatedActionDeckRoleTag);
  }

  const contributors: Contribution[] = [];
  let score = 0;

  for (const role of roles) {
    const baseWeight = args.weights[role] ?? 0;
    if (baseWeight === 0) {
      continue;
    }

    const adjustment = override?.roleAdjustments?.[role] ?? 0;
    const contribution = baseWeight + Math.sign(baseWeight) * adjustment;
    if (contribution === 0) {
      continue;
    }

    contributors.push({
      key: role,
      source: "role",
      value: contribution,
    });
    score += contribution;
  }

  return {
    contributors,
    score,
  };
}

function scoreCardInstance(args: {
  cardId: CardInstanceId;
  context: AutomatedActionPlanningContext;
  weights: RoleWeightMap;
}): {
  contributors: Contribution[];
  score: number;
} {
  const definition = args.context.getCardDefinition(args.cardId);
  const roles = args.context.getCardRoles(args.cardId);

  return scoreDefinitionRoles({
    definitionId: definition?.id,
    roles,
    weights: args.weights,
  });
}

function scoreTargets(
  context: AutomatedActionPlanningContext,
  candidate: CandidateWithTargets | Extract<AutomatedActionCandidate, { family: "challenge" }>,
  sourceDefinitionId: string | undefined,
  sourceRoles: readonly AutomatedActionDeckRoleTag[],
  config: DeckAwareStrategyConfig,
): {
  contributors: Contribution[];
  matchedRuleIds: readonly string[];
  score: number;
} {
  const bestAiTargetAdjustment = resolveBestAiAxisAdjustment({
    axis: "target",
    config,
    context,
    definitionId: sourceDefinitionId,
  });
  const candidateEffect = context.resolveCandidateEffect(candidate);
  const effectPolarity = candidateEffect
    ? classifyEffectPolarity(candidateEffect).polarity
    : undefined;
  const targetScore = scoreAutomatedActionTargets({
    additionalPreference: bestAiTargetAdjustment.targetPreference,
    context,
    effectPolarity,
    family: candidate.family,
    sourceDefinitionId,
    sourceRoles,
    targets: candidate.family === "challenge" ? [candidate.defenderId] : (candidate.targets ?? []),
  });

  return {
    contributors: [
      ...targetScore.contributors.map((entry) => ({
        key: entry.key,
        source: "target" as const,
        value: entry.value,
      })),
      ...bestAiTargetAdjustment.contributors,
    ],
    matchedRuleIds: bestAiTargetAdjustment.matchedRuleIds,
    score: targetScore.score + bestAiTargetAdjustment.score,
  };
}

function resolveFamilyBias(
  context: AutomatedActionPlanningContext,
  family: AutomatedActionCandidate["family"],
  config: DeckAwareStrategyConfig,
): {
  contributors: Contribution[];
  familyBias: number;
  openingFamilyBias: number;
} {
  const colorPairId = context.actorDeckProfile?.colorPairId ?? "";
  const opponentColorPairId = context.opponentDeckProfile?.colorPairId;
  const profile = getAutomatedActionColorPairProfile(colorPairId);
  const modifier = opponentColorPairId
    ? getAutomatedActionMatchupModifier(colorPairId, opponentColorPairId)
    : undefined;
  const bestAiPlans = resolveMatchedBestAiPlans(context, config);
  const bestAiFamilyBias = mergeFamilyBias(...bestAiPlans.map((plan) => plan.familyBias));
  const familyKey =
    family === "playCard" ||
    family === "activateAbility" ||
    family === "resolveBag" ||
    family === "resolveEffect" ||
    family === "moveCharacterToLocation"
      ? "playCard"
      : family;
  const profileBias =
    familyKey === "challenge" ||
    familyKey === "playCard" ||
    familyKey === "putCardIntoInkwell" ||
    familyKey === "quest"
      ? profile.familyBias[familyKey]
      : 0;
  const modifierBias =
    familyKey === "challenge" ||
    familyKey === "playCard" ||
    familyKey === "putCardIntoInkwell" ||
    familyKey === "quest"
      ? (modifier?.familyBias?.[familyKey] ?? 0)
      : 0;
  const bestAiBias =
    familyKey === "challenge" ||
    familyKey === "playCard" ||
    familyKey === "putCardIntoInkwell" ||
    familyKey === "quest"
      ? bestAiFamilyBias[familyKey]
      : 0;
  const openingPlan = resolveOpeningPlan(context, config);
  const openingFamilyBias =
    context.turnBucket === "opening" &&
    (familyKey === "challenge" ||
      familyKey === "playCard" ||
      familyKey === "putCardIntoInkwell" ||
      familyKey === "quest")
      ? openingPlan.openingFamilyBias[familyKey]
      : 0;
  const contributors: Contribution[] = [
    {
      key: "familyBias",
      source: "family",
      value:
        profileBias +
        modifierBias +
        (family === "challenge" ? (modifier?.challengeBias ?? 0) : 0) +
        (family === "quest" ? (modifier?.questBias ?? 0) : 0),
    },
  ];

  if (bestAiBias !== 0) {
    contributors.push({
      key: `bestAiFamilyBias:${familyKey}`,
      source: "family",
      value: bestAiBias,
    });
  }

  if (family === "challenge") {
    const challengePlanBias = bestAiPlans.reduce((total, plan) => total + plan.challengeBias, 0);
    if (challengePlanBias !== 0) {
      contributors.push({
        key: "bestAiChallengeBias",
        source: "family",
        value: challengePlanBias,
      });
    }
  }

  if (family === "quest") {
    const questPlanBias = bestAiPlans.reduce((total, plan) => total + plan.questBias, 0);
    if (questPlanBias !== 0) {
      contributors.push({
        key: "bestAiQuestBias",
        source: "family",
        value: questPlanBias,
      });
    }
  }

  if (openingFamilyBias !== 0) {
    contributors.push({
      key: "openingFamilyBias",
      source: "family",
      value: openingFamilyBias,
    });
  }

  return {
    contributors,
    familyBias:
      profileBias +
      modifierBias +
      bestAiBias +
      (family === "challenge" ? (modifier?.challengeBias ?? 0) : 0) +
      (family === "quest" ? (modifier?.questBias ?? 0) : 0) +
      (family === "challenge"
        ? bestAiPlans.reduce((total, plan) => total + plan.challengeBias, 0)
        : 0) +
      (family === "quest" ? bestAiPlans.reduce((total, plan) => total + plan.questBias, 0) : 0),
    openingFamilyBias,
  };
}

function getAverageDeckScore(
  context: AutomatedActionPlanningContext,
  weights: RoleWeightMap,
): number {
  const cards = context.actorDeckProfile?.cards ?? [];
  const totalCopies = cards.reduce((count, card) => count + card.count, 0);
  if (totalCopies === 0) {
    return 0;
  }

  const totalScore = cards.reduce((score, card) => {
    const cardScore = scoreDefinitionRoles({
      definitionId: card.definitionId,
      roles: card.roles,
      weights,
    }).score;
    return score + cardScore * card.count;
  }, 0);

  return totalScore / totalCopies;
}

function scoreAlterHandCandidate(
  context: AutomatedActionPlanningContext,
  candidate: Extract<AutomatedActionCandidate, { family: "alterHand" }>,
  config: DeckAwareStrategyConfig,
): {
  contributors: Contribution[];
  matchedRuleIds: readonly string[];
  matchupCardAdjustment: number;
  metrics: OpeningStructureMetrics;
  score: number;
} {
  const actorColorPairId = context.actorDeckProfile?.colorPairId ?? "";
  const opponentColorPairId = context.opponentDeckProfile?.colorPairId;
  const weights = resolveMulliganWeights(context, config);
  const openingPlan = resolveOpeningPlan(context, config);
  const matchupPairId = getMatchupPairId(context);
  const hand = (context.board.players[context.actorId]?.hand ?? []).map(
    (cardId) => String(cardId) as CardInstanceId,
  );
  const mulliganSet = new Set(candidate.cardsToMulligan);
  const keptCards = hand.filter((cardId) => !mulliganSet.has(cardId));
  const replacementScore = getAverageDeckScore(context, weights);
  const contributors: Contribution[] = [];
  const matchedRuleIds = new Set<string>();

  let score = candidate.cardsToMulligan.length * replacementScore;
  if (candidate.cardsToMulligan.length > 0) {
    contributors.push({
      key: "replacementExpectation",
      source: "generic",
      value: Math.round(candidate.cardsToMulligan.length * replacementScore * 10) / 10,
    });
  }

  let matchupCardAdjustment = 0;
  for (const cardId of keptCards) {
    const cardScore = scoreCardInstance({
      cardId,
      context,
      weights,
    });
    contributors.push({
      key: `keep:${context.getCardDefinition(cardId)?.id ?? cardId}`,
      source: "generic",
      value: Math.round(cardScore.score * 10) / 10,
    });
    score += cardScore.score;

    const definitionId = context.getCardDefinition(cardId)?.id;
    const matchupAdjustment = definitionId
      ? (getAutomatedActionCardMatchupAdjustment(definitionId, matchupPairId)
          ?.mulliganScoreAdjustment ?? 0)
      : 0;
    if (matchupAdjustment !== 0) {
      contributors.push({
        key: `matchupKeep:${definitionId}`,
        source: "generic",
        value: matchupAdjustment,
      });
      matchupCardAdjustment += matchupAdjustment;
      score += matchupAdjustment;
    }

    const bestAiAdjustment = resolveBestAiAxisAdjustment({
      axis: "mulligan",
      config,
      context,
      definitionId,
    });
    for (const ruleId of bestAiAdjustment.matchedRuleIds) {
      matchedRuleIds.add(ruleId);
    }
    contributors.push(...bestAiAdjustment.contributors);
    score += bestAiAdjustment.score;
  }

  const openingStructure = scoreOpeningStructure({
    openingPlan,
    shape: analyzeOpeningHand(context, keptCards),
  });
  const compositionContributors: Contribution[] = [
    ...openingStructure.contributors,
    {
      key: "partialMulliganBias",
      source: "generic",
      value:
        candidate.plan === "structural-mulligan" &&
        candidate.cardsToMulligan.length > 0 &&
        candidate.cardsToMulligan.length < hand.length
          ? 1
          : candidate.plan === "full-mulligan"
            ? -2
            : 0,
    },
  ];

  for (const contribution of compositionContributors) {
    contributors.push(contribution);
    score += contribution.value;
  }

  return {
    contributors,
    matchedRuleIds: [...matchedRuleIds].sort(),
    matchupCardAdjustment,
    metrics: openingStructure.metrics,
    score,
  };
}

function scorePutInkCandidate(
  context: AutomatedActionPlanningContext,
  candidate: Extract<AutomatedActionCandidate, { family: "putCardIntoInkwell" }>,
  config: DeckAwareStrategyConfig,
): {
  contributors: Contribution[];
  matchedRuleIds: readonly string[];
  matchupCardAdjustment: number;
  metrics: OpeningStructureMetrics;
  score: number;
} {
  const weights = resolveInkWeights(context, config);
  const openingPlan = resolveOpeningPlan(context, config);
  const matchupPairId = getMatchupPairId(context);
  const roleScore = scoreCardInstance({
    cardId: candidate.cardId,
    context,
    weights,
  });
  const duplicateCount = countCopiesInHand(context, context.actorId, candidate.cardId);
  const projectedCard = getProjectedCard(context, candidate.cardId);
  const contributors: Contribution[] = [...roleScore.contributors];
  const remainingHand = (context.board.players[context.actorId]?.hand ?? [])
    .map((cardId) => String(cardId) as CardInstanceId)
    .filter((cardId) => cardId !== candidate.cardId);
  const openingStructure =
    context.turnBucket === "opening"
      ? scoreOpeningStructure({
          openingPlan,
          shape: analyzeOpeningHand(context, remainingHand),
        })
      : {
          contributors: [],
          metrics: createEmptyOpeningStructureMetrics(),
          score: 0,
        };
  const definitionId = context.getCardDefinition(candidate.cardId)?.id;
  const matchupCardAdjustment = definitionId
    ? (getAutomatedActionCardMatchupAdjustment(definitionId, matchupPairId)?.inkScoreAdjustment ??
      0)
    : 0;

  if (matchupCardAdjustment !== 0 && definitionId) {
    contributors.push({
      key: `matchupInk:${definitionId}`,
      source: "generic",
      value: matchupCardAdjustment,
    });
  }

  const bestAiAdjustment = resolveBestAiAxisAdjustment({
    axis: "ink",
    config,
    context,
    definitionId,
  });
  contributors.push(...bestAiAdjustment.contributors);

  const duplicateContribution = Math.max(0, duplicateCount - 1) * 3;
  if (duplicateContribution !== 0) {
    contributors.push({
      key: "duplicateCopy",
      source: "generic",
      value: duplicateContribution,
    });
  }

  const printedCostContribution = (projectedCard?.playCost ?? 0) >= 5 ? 2 : 0;
  if (printedCostContribution !== 0) {
    contributors.push({
      key: "lateCost",
      source: "generic",
      value: printedCostContribution,
    });
  }

  const lowLoreContribution = (projectedCard?.lore ?? 0) <= 1 ? 1 : 0;
  if (lowLoreContribution !== 0) {
    contributors.push({
      key: "lowLore",
      source: "generic",
      value: lowLoreContribution,
    });
  }

  const hand = context.board.players[context.actorId]?.hand ?? [];
  const availableInk = getAvailableInkForPlayer(context, context.actorId);
  const handSize = hand.length;
  const smallHandAllPlayable =
    handSize > 0 &&
    handSize <= 3 &&
    hand.every((cardId) => {
      const card = getProjectedCard(context, String(cardId));
      return (card?.playCost ?? 0) <= availableInk;
    });
  const smallHandAllPlayablePenalty = smallHandAllPlayable ? -30 : 0;
  if (smallHandAllPlayablePenalty !== 0) {
    contributors.push({
      key: "smallHandAllPlayable",
      source: "generic",
      value: smallHandAllPlayablePenalty,
    });
  }

  return {
    contributors: [...contributors, ...openingStructure.contributors],
    matchedRuleIds: [...bestAiAdjustment.matchedRuleIds].sort(),
    matchupCardAdjustment,
    metrics: openingStructure.metrics,
    score:
      roleScore.score +
      openingStructure.score +
      matchupCardAdjustment +
      bestAiAdjustment.score +
      duplicateContribution +
      printedCostContribution +
      lowLoreContribution +
      smallHandAllPlayablePenalty,
  };
}

function scoreQuestCandidate(
  context: AutomatedActionPlanningContext,
  candidate: Extract<AutomatedActionCandidate, { family: "quest" }>,
  config: DeckAwareStrategyConfig,
): {
  contributors: Contribution[];
  score: number;
} {
  const weights = resolveRoleWeights(context, config);
  const roleScore = scoreCardInstance({
    cardId: candidate.cardId,
    context,
    weights,
  });
  const projectedCard = getProjectedCard(context, candidate.cardId);
  const questLore = (projectedCard?.lore ?? 0) * 2;
  const contributors: Contribution[] = [...roleScore.contributors];

  if (questLore !== 0) {
    contributors.push({
      key: "questLore",
      source: "generic",
      value: questLore,
    });
  }

  const protectionPenalty = context
    .getCardRoles(candidate.cardId)
    .filter((role) => role === "drawEngine" || role === "synergyAnchor")
    .reduce((total) => total - (context.turnBucket === "opening" ? 2 : 1), 0);
  if (protectionPenalty !== 0) {
    contributors.push({
      key: "protectEngine",
      source: "generic",
      value: protectionPenalty,
    });
  }

  return {
    contributors,
    score: roleScore.score + questLore + protectionPenalty,
  };
}

function scoreChallengeCandidate(
  context: AutomatedActionPlanningContext,
  candidate: Extract<AutomatedActionCandidate, { family: "challenge" }>,
  config: DeckAwareStrategyConfig,
): {
  contributors: Contribution[];
  matchedRuleIds: readonly string[];
  score: number;
} {
  const attackerRoles = context.getCardRoles(candidate.attackerId);
  const sourceDefinitionId = context.getCardDefinition(candidate.attackerId)?.id;
  const challengeAxisAdjustment = resolveBestAiAxisAdjustment({
    axis: "challenge",
    config,
    context,
    definitionId: sourceDefinitionId,
  });
  const targetScore = scoreTargets(context, candidate, sourceDefinitionId, attackerRoles, config);
  const protectionPenalty = attackerRoles.reduce((total, role) => {
    if (role === "drawEngine" || role === "ramp") {
      return total - 3;
    }

    if (role === "synergyAnchor" || role === "latePlay") {
      return total - 2;
    }

    return total;
  }, 0);

  const contributors: Contribution[] = [
    ...targetScore.contributors,
    ...challengeAxisAdjustment.contributors,
  ];
  if (protectionPenalty !== 0) {
    contributors.push({
      key: "protectAttackerValue",
      source: "generic",
      value: protectionPenalty,
    });
  }

  return {
    contributors,
    matchedRuleIds: [
      ...new Set([...targetScore.matchedRuleIds, ...challengeAxisAdjustment.matchedRuleIds]),
    ].sort(),
    score: targetScore.score + challengeAxisAdjustment.score + protectionPenalty,
  };
}

function scoreSourceCandidate(
  context: AutomatedActionPlanningContext,
  candidate: Exclude<
    AutomatedActionCandidate,
    | { family: "chooseWhoGoesFirst" }
    | { family: "alterHand" }
    | { family: "putCardIntoInkwell" }
    | { family: "quest" }
    | { family: "challenge" }
  >,
  config: DeckAwareStrategyConfig,
): {
  contributors: Contribution[];
  matchedRuleIds: readonly string[];
  roleScore: number;
  score: number;
  sourceDefinitionId?: string;
  targetScore: number;
} {
  const weights = resolveRoleWeights(context, config);
  const sourceDefinitionId = context.resolveCandidateSourceDefinitionId(candidate);
  const sourceRoles = context.resolveCandidateSourceRoles(candidate);
  const roleScore = scoreDefinitionRoles({
    definitionId: sourceDefinitionId,
    roles: sourceRoles,
    weights,
  });
  const playAxisAdjustment = resolveBestAiAxisAdjustment({
    axis: "play",
    config,
    context,
    definitionId: sourceDefinitionId,
  });
  const targetScore =
    candidate.family === "playCard" ||
    candidate.family === "activateAbility" ||
    candidate.family === "resolveBag" ||
    candidate.family === "resolveEffect"
      ? scoreTargets(context, candidate, sourceDefinitionId, sourceRoles, config)
      : {
          contributors: [],
          matchedRuleIds: [],
          score: 0,
        };

  return {
    contributors: [
      ...roleScore.contributors,
      ...playAxisAdjustment.contributors,
      ...targetScore.contributors,
    ],
    matchedRuleIds: [
      ...new Set([...playAxisAdjustment.matchedRuleIds, ...targetScore.matchedRuleIds]),
    ].sort(),
    roleScore: roleScore.score + playAxisAdjustment.score,
    score: roleScore.score + playAxisAdjustment.score + targetScore.score,
    sourceDefinitionId,
    targetScore: targetScore.score,
  };
}

function buildDeckAwareBreakdown(
  context: AutomatedActionPlanningContext,
  summary: AutomatedActionCandidateSummary,
  config: DeckAwareStrategyConfig,
): CandidateDeckAwareBreakdown {
  const candidate = summary.candidate;
  const baseFamilyOrder = findNumericHeuristic(summary.heuristics, "familyOrder");
  const resolvedFamilyBias = resolveFamilyBias(context, candidate.family, config);
  const openingFamilyBias = resolvedFamilyBias.openingFamilyBias;
  const matchedRuleIds = new Set<string>(
    resolveMatchedBestAiPlans(context, config).map((plan) => plan.id),
  );
  let roleScore = 0;
  let targetScore = 0;
  let sourceDefinitionId = context.resolveCandidateSourceDefinitionId(candidate);
  let totalScore = resolvedFamilyBias.familyBias + openingFamilyBias;
  let contributors: Contribution[] = [...resolvedFamilyBias.contributors];

  let openingStructure =
    context.turnBucket === "opening"
      ? scoreOpeningStructure({
          openingPlan: resolveOpeningPlan(context, config),
          shape: analyzeOpeningHand(
            context,
            (context.board.players[context.actorId]?.hand ?? []).map(
              (cardId) => String(cardId) as CardInstanceId,
            ),
          ),
        })
      : {
          contributors: [],
          metrics: createEmptyOpeningStructureMetrics(),
          score: 0,
        };
  for (const contribution of openingStructure.contributors) {
    contributors.push(contribution);
  }

  let matchupCardAdjustment = 0;
  switch (candidate.family) {
    case "alterHand": {
      const mulliganScore = scoreAlterHandCandidate(context, candidate, config);
      totalScore += mulliganScore.score;
      matchupCardAdjustment = mulliganScore.matchupCardAdjustment;
      openingStructure = {
        contributors: openingStructure.contributors,
        metrics: mulliganScore.metrics,
        score: openingStructure.score,
      };
      mulliganScore.matchedRuleIds.forEach((ruleId) => matchedRuleIds.add(ruleId));
      contributors = [...contributors, ...mulliganScore.contributors];
      break;
    }
    case "putCardIntoInkwell": {
      const inkScore = scorePutInkCandidate(context, candidate, config);
      totalScore += inkScore.score;
      matchupCardAdjustment = inkScore.matchupCardAdjustment;
      sourceDefinitionId = context.getCardDefinition(candidate.cardId)?.id;
      openingStructure = {
        contributors: openingStructure.contributors,
        metrics: inkScore.metrics,
        score: openingStructure.score,
      };
      inkScore.matchedRuleIds.forEach((ruleId) => matchedRuleIds.add(ruleId));
      contributors = [...contributors, ...inkScore.contributors];
      break;
    }
    case "quest": {
      const questScore = scoreQuestCandidate(context, candidate, config);
      totalScore += questScore.score;
      roleScore = questScore.score;
      sourceDefinitionId = context.getCardDefinition(candidate.cardId)?.id;
      contributors = [...contributors, ...questScore.contributors];
      break;
    }
    case "challenge": {
      const challengeScore = scoreChallengeCandidate(context, candidate, config);
      totalScore += challengeScore.score;
      targetScore = challengeScore.score;
      challengeScore.matchedRuleIds.forEach((ruleId) => matchedRuleIds.add(ruleId));
      sourceDefinitionId = context.getCardDefinition(candidate.attackerId)?.id;
      contributors = [...contributors, ...challengeScore.contributors];
      break;
    }
    case "chooseWhoGoesFirst":
      break;
    default: {
      const sourceScore = scoreSourceCandidate(context, candidate, config);
      roleScore = sourceScore.roleScore;
      targetScore = sourceScore.targetScore;
      totalScore += sourceScore.score;
      sourceDefinitionId = sourceScore.sourceDefinitionId;
      sourceScore.matchedRuleIds.forEach((ruleId) => matchedRuleIds.add(ruleId));
      contributors = [...contributors, ...sourceScore.contributors];
      break;
    }
  }

  return {
    contributors,
    effectiveFamilyOrder:
      baseFamilyOrder * 10 - resolvedFamilyBias.familyBias - openingFamilyBias * 10,
    familyBias: resolvedFamilyBias.familyBias,
    matchedRuleIds: [...matchedRuleIds].sort(),
    matchupCardAdjustment,
    openingEarlyPlayDelta: openingStructure.metrics.openingEarlyPlayDelta,
    openingFamilyBias,
    openingInkablesDelta: openingStructure.metrics.openingInkablesDelta,
    openingLateCardDelta: openingStructure.metrics.openingLateCardDelta,
    openingTwoDropDelta: openingStructure.metrics.openingTwoDropDelta,
    openingUninkableDelta: openingStructure.metrics.openingUninkableDelta,
    roleScore,
    sourceDefinitionId,
    targetScore,
    topContributors: formatTopContributors(contributors),
    totalScore,
  };
}

function toStructuredContributors(
  contributions: readonly Contribution[],
): AutomatedActionCandidateContributor[] {
  return contributions
    .filter((contribution) => contribution.value !== 0)
    .sort(compareContributions)
    .map((contribution) => ({
      ...(contribution.axis ? { axis: contribution.axis } : {}),
      key: contribution.key,
      ...(contribution.reason ? { reason: contribution.reason } : {}),
      ...(contribution.ruleId ? { ruleId: contribution.ruleId } : {}),
      source: contribution.source,
      ...(contribution.strategyTags ? { strategyTags: contribution.strategyTags } : {}),
      value: contribution.value,
    }));
}

function appendDeckAwareHeuristics(
  context: AutomatedActionPlanningContext,
  summary: AutomatedActionCandidateSummary,
  breakdown: CandidateDeckAwareBreakdown,
): AutomatedActionCandidateSummary {
  const profileName =
    context.actorDeckProfile?.colorPairId ?? getAutomatedActionColorPairProfile("").archetype;
  const matchupPair = context.matchupProfile?.pairId ?? "unknown";

  return {
    ...summary,
    actorDeckSignature: context.actorDeckProfile?.signature,
    contributors: toStructuredContributors(breakdown.contributors),
    heuristics: [
      ...summary.heuristics,
      createHeuristic("asc", "profileName", profileName),
      createHeuristic("asc", "matchupPair", matchupPair),
      createHeuristic("asc", "turnBucket", context.turnBucket),
      createHeuristic("asc", "informationPolicy", context.informationPolicy),
      createHeuristic("asc", "opponentKnowledgeSource", context.opponentKnowledgeSource),
      createHeuristic("asc", "effectiveFamilyOrder", breakdown.effectiveFamilyOrder),
      createHeuristic("desc", "deckAwareFamilyBias", breakdown.familyBias),
      createHeuristic("desc", "openingFamilyBias", breakdown.openingFamilyBias),
      createHeuristic("desc", "deckAwareRoleScore", breakdown.roleScore),
      createHeuristic("desc", "deckAwareTargetScore", breakdown.targetScore),
      createHeuristic("desc", "deckAwareTotalScore", breakdown.totalScore),
      createHeuristic("desc", "matchupCardAdjustment", breakdown.matchupCardAdjustment),
      createHeuristic("desc", "openingInkablesDelta", breakdown.openingInkablesDelta),
      createHeuristic("desc", "openingEarlyPlayDelta", breakdown.openingEarlyPlayDelta),
      createHeuristic("desc", "openingLateCardDelta", breakdown.openingLateCardDelta),
      createHeuristic("desc", "openingUninkableDelta", breakdown.openingUninkableDelta),
      createHeuristic("desc", "openingTwoDropDelta", breakdown.openingTwoDropDelta),
      createHeuristic("asc", "topWeightContributors", breakdown.topContributors || "none"),
    ],
    informationPolicy: context.informationPolicy,
    matchedRuleIds: breakdown.matchedRuleIds,
    opponentKnowledgeSource: context.opponentKnowledgeSource,
    sourceDefinitionId: breakdown.sourceDefinitionId,
  };
}

function compareDeckAwareCandidateRecords(
  left: CandidateSummaryRecord,
  right: CandidateSummaryRecord,
): number {
  const familyOrder = left.breakdown.effectiveFamilyOrder - right.breakdown.effectiveFamilyOrder;
  if (familyOrder !== 0) {
    return familyOrder;
  }

  const scoreOrder = right.breakdown.totalScore - left.breakdown.totalScore;
  if (scoreOrder !== 0) {
    return scoreOrder;
  }

  return left.baseIndex - right.baseIndex;
}

function summarizeDeckAwareLoreRaceCandidatesWithConfig(
  context: AutomatedActionPlanningContext,
  candidates: readonly AutomatedActionCandidate[],
  config: DeckAwareStrategyConfig,
): AutomatedActionCandidateSummary[] {
  const preferences = resolveStrategyPreferences(context);
  const baseSummaries = summarizeLoreRaceCandidates(context, candidates, preferences);

  return baseSummaries
    .map((summary, baseIndex) => {
      const breakdown = buildDeckAwareBreakdown(context, summary, config);

      return {
        baseFamilyOrder: findNumericHeuristic(summary.heuristics, "familyOrder"),
        baseIndex,
        breakdown,
        summary: appendDeckAwareHeuristics(context, summary, breakdown),
      } satisfies CandidateSummaryRecord;
    })
    .sort(compareDeckAwareCandidateRecords)
    .map((record) => record.summary);
}

function createDeckAwareStrategy(config: DeckAwareStrategyConfig): AutomatedActionStrategy {
  return {
    informationPolicy: config.informationPolicy,
    name: config.name,
    summarizeCandidates(context, candidates) {
      return summarizeDeckAwareLoreRaceCandidatesWithConfig(context, candidates, config);
    },
  };
}

export function summarizeDeckAwareLoreRaceCandidates(
  context: AutomatedActionPlanningContext,
  candidates: readonly AutomatedActionCandidate[],
): AutomatedActionCandidateSummary[] {
  return summarizeDeckAwareLoreRaceCandidatesWithConfig(context, candidates, {
    informationPolicy: "oracle",
    name: "deck-aware-lore-race",
  });
}

export const deckAwareLoreRaceAutomatedActionStrategy = createDeckAwareStrategy({
  informationPolicy: "oracle",
  name: "deck-aware-lore-race",
});

export const bestDeckAwareLoreRaceAutomatedActionStrategy = createDeckAwareStrategy({
  informationPolicy: "fair",
  name: "best-deck-aware-lore-race",
  useBestAiRules: true,
});

export const bestDeckAwareOracleLoreRaceAutomatedActionStrategy = createDeckAwareStrategy({
  informationPolicy: "oracle",
  name: "best-deck-aware-oracle-lore-race",
  useBestAiRules: true,
});
