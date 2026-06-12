import type { PlayerId } from "#core";
import type { AutomatedActionCardTargetPreference, RoleWeightMap } from "../deck-profile";
import type {
  AutomatedActionDeckCardProfile,
  AutomatedActionDeckProfile,
  AutomatedActionStrategyTag,
  StrategyAxis,
  StrategyInformationPolicy,
} from "../types";
import { BEST_AI_CARD_PROFILES } from "./cards";
import { BEST_AI_DECK_DOSSIERS } from "./fixtures";

export { BEST_AI_CARD_PROFILES, BEST_AI_DECK_DOSSIERS };
import { BEST_AI_MATCHUP_PLANS } from "./matchups";
import type {
  CardStrategyProfile,
  CardStrategyRule,
  MatchupPlan,
  MatchupSelector,
  StrategyDeckDossier,
  StrategyMatchupDossier,
  StrategyRuleKnowledgeAccess,
} from "./types";

export * from "./types";

type SignatureCardEntry = {
  count: number;
  definitionId: string;
};

export type EvaluatedBestAiRule = {
  adjust: Partial<Record<StrategyAxis, number>>;
  id: string;
  knowledgeAccess: StrategyRuleKnowledgeAccess;
  label: string;
  reason: string;
  strategyTags: readonly AutomatedActionStrategyTag[];
  targetPreference?: AutomatedActionCardTargetPreference;
};

export type EvaluatedBestAiCardStrategy = {
  baseAdjust: Partial<Record<StrategyAxis, number>>;
  baseReason?: string;
  definitionId: string;
  label: string;
  matchedRuleIds: readonly string[];
  matchedRules: readonly EvaluatedBestAiRule[];
  matchupAdjust: Partial<Record<StrategyAxis, number>>;
  strategyTags: readonly AutomatedActionStrategyTag[];
  targetPreference?: AutomatedActionCardTargetPreference;
};

export type EvaluatedBestAiMatchupPlan = {
  challengeBias: number;
  familyBias: Partial<MatchupPlan["familyBias"]>;
  id: string;
  inkRoleWeights: RoleWeightMap;
  label: string;
  mulliganRoleWeights: RoleWeightMap;
  openingPlan: MatchupPlan["openingPlan"];
  questBias: number;
  reason: string;
  roleWeightsByTurnBucket: NonNullable<MatchupPlan["roleWeightsByTurnBucket"]>;
  strategyTags: readonly AutomatedActionStrategyTag[];
  when: MatchupSelector;
};

export type MatchupWeightReportCardEntry = {
  baseAdjust: Partial<Record<StrategyAxis, number>>;
  baseReason?: string;
  count: number;
  definitionId: string;
  label: string;
  matchedRuleIds: readonly string[];
  matchedRules: readonly EvaluatedBestAiRule[];
  matchupAdjust: Partial<Record<StrategyAxis, number>>;
  strategyTags: readonly AutomatedActionStrategyTag[];
};

export type MatchupWeightReportPlanEntry = {
  id: string;
  knowledgeAccess: StrategyRuleKnowledgeAccess;
  label: string;
  reason: string;
  strategyTags: readonly AutomatedActionStrategyTag[];
};

export type MatchupWeightReportMatchupEntry = {
  actorArchetype: StrategyDeckDossier["archetype"];
  actorColorPairId: string;
  actorFixtureId: string;
  actorSignature: string;
  cards: readonly MatchupWeightReportCardEntry[];
  informationPolicy: StrategyInformationPolicy;
  label: string;
  matchupPairId: string;
  opponentArchetype: StrategyDeckDossier["archetype"];
  opponentColorPairId: string;
  opponentFixtureId: string;
  opponentSignature: string;
  plans: readonly MatchupWeightReportPlanEntry[];
};

export type MatchupWeightReportStrategyEntry = {
  informationPolicy: StrategyInformationPolicy;
  matchups: readonly MatchupWeightReportMatchupEntry[];
  strategyId: string;
};

export type MatchupWeightReport = {
  generatedAt: string;
  strategies: readonly MatchupWeightReportStrategyEntry[];
};

const CARD_PROFILE_BY_DEFINITION_ID = new Map(
  BEST_AI_CARD_PROFILES.map((profile) => [profile.definitionId, profile] as const),
);

function parseSignature(signature: string): SignatureCardEntry[] {
  if (!signature) {
    return [];
  }

  return signature
    .split("|")
    .map((entry) => {
      const [definitionId, rawCount] = entry.split(":");
      const count = Number(rawCount);

      if (!definitionId || !Number.isFinite(count) || count <= 0) {
        return undefined;
      }

      return {
        count,
        definitionId,
      } satisfies SignatureCardEntry;
    })
    .filter((entry): entry is SignatureCardEntry => entry !== undefined);
}

function normalizeAxisAdjustments(
  adjustments: Partial<Record<StrategyAxis, number>> | undefined,
): Partial<Record<StrategyAxis, number>> {
  if (!adjustments) {
    return {};
  }

  const normalized: Partial<Record<StrategyAxis, number>> = {};
  for (const [axis, value] of Object.entries(adjustments)) {
    if (typeof value !== "number" || !Number.isFinite(value) || value === 0) {
      continue;
    }

    normalized[axis as StrategyAxis] = value;
  }

  return normalized;
}

function mergeAxisAdjustments(
  ...adjustments: Array<Partial<Record<StrategyAxis, number>> | undefined>
): Partial<Record<StrategyAxis, number>> {
  const merged: Partial<Record<StrategyAxis, number>> = {};

  for (const current of adjustments) {
    if (!current) {
      continue;
    }

    for (const [axis, value] of Object.entries(current)) {
      if (typeof value !== "number" || !Number.isFinite(value) || value === 0) {
        continue;
      }

      const resolvedAxis = axis as StrategyAxis;
      merged[resolvedAxis] = (merged[resolvedAxis] ?? 0) + value;
    }
  }

  return merged;
}

function mergeRoleWeights(...weights: Array<RoleWeightMap | undefined>): RoleWeightMap {
  const merged: RoleWeightMap = {};

  for (const current of weights) {
    if (!current) {
      continue;
    }

    for (const [role, value] of Object.entries(current)) {
      if (typeof value !== "number" || !Number.isFinite(value) || value === 0) {
        continue;
      }

      merged[role as keyof RoleWeightMap] = (merged[role as keyof RoleWeightMap] ?? 0) + value;
    }
  }

  return merged;
}

function mergeTargetPreferences(
  left: AutomatedActionCardTargetPreference | undefined,
  right: AutomatedActionCardTargetPreference | undefined,
): AutomatedActionCardTargetPreference | undefined {
  if (!left) {
    return right;
  }

  if (!right) {
    return left;
  }

  return {
    actorPlayerScore: (left.actorPlayerScore ?? 0) + (right.actorPlayerScore ?? 0),
    alliedRoleWeights: mergeRoleWeights(left.alliedRoleWeights, right.alliedRoleWeights),
    damagedAlliedScore: (left.damagedAlliedScore ?? 0) + (right.damagedAlliedScore ?? 0),
    damagedOpposingScore: (left.damagedOpposingScore ?? 0) + (right.damagedOpposingScore ?? 0),
    exertedOpposingScore: (left.exertedOpposingScore ?? 0) + (right.exertedOpposingScore ?? 0),
    highLoreOpposingMultiplier:
      (left.highLoreOpposingMultiplier ?? 0) + (right.highLoreOpposingMultiplier ?? 0),
    lowStrengthOpposingScore:
      (left.lowStrengthOpposingScore ?? 0) + (right.lowStrengthOpposingScore ?? 0),
    opposingRoleWeights: mergeRoleWeights(left.opposingRoleWeights, right.opposingRoleWeights),
    opponentPlayerScore: (left.opponentPlayerScore ?? 0) + (right.opponentPlayerScore ?? 0),
  };
}

function hasAnyRequiredRole(
  profile: AutomatedActionDeckProfile | undefined,
  requiredRoles: readonly string[] | undefined,
): boolean {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (!profile) {
    return false;
  }

  return requiredRoles.some(
    (role) => (profile.roleCounts[role as keyof typeof profile.roleCounts] ?? 0) > 0,
  );
}

function hasAnyRequiredCard(
  profile: AutomatedActionDeckProfile | undefined,
  requiredCards: readonly string[] | undefined,
): boolean {
  if (!requiredCards || requiredCards.length === 0) {
    return true;
  }

  if (!profile) {
    return false;
  }

  return profile.cards.some((card) => requiredCards.includes(card.definitionId));
}

function matchesDeckSelector(args: {
  archetypes: readonly string[] | undefined;
  colorPairs: readonly string[] | undefined;
  deckSignatures: readonly string[] | undefined;
  profile: AutomatedActionDeckProfile | undefined;
}): boolean {
  const { archetypes, colorPairs, deckSignatures, profile } = args;
  if (!archetypes?.length && !colorPairs?.length && !deckSignatures?.length) {
    return true;
  }

  if (!profile) {
    return false;
  }

  if (archetypes?.length && !archetypes.includes(profile.archetype)) {
    return false;
  }

  if (colorPairs?.length && !colorPairs.includes(profile.colorPairId)) {
    return false;
  }

  if (deckSignatures?.length && !deckSignatures.includes(profile.signature)) {
    return false;
  }

  return true;
}

export function getStrategyRuleKnowledgeAccess(
  selector: MatchupSelector | undefined,
): StrategyRuleKnowledgeAccess {
  if (!selector) {
    return "actor-only";
  }

  if (
    (selector.opponentDeckSignatures?.length ?? 0) > 0 ||
    (selector.requiresAnyCards?.length ?? 0) > 0 ||
    (selector.requiresAnyRoles?.length ?? 0) > 0
  ) {
    return "oracle-opponent";
  }

  if (
    (selector.opponentArchetypes?.length ?? 0) > 0 ||
    (selector.opponentColorPairs?.length ?? 0) > 0
  ) {
    return "public-opponent";
  }

  return "actor-only";
}

export function matchesMatchupSelector(args: {
  actorDeckProfile?: AutomatedActionDeckProfile;
  opponentDeckProfile?: AutomatedActionDeckProfile;
  selector: MatchupSelector;
}): boolean {
  const { actorDeckProfile, opponentDeckProfile, selector } = args;

  return (
    matchesDeckSelector({
      archetypes: selector.actorArchetypes,
      colorPairs: selector.actorColorPairs,
      deckSignatures: selector.actorDeckSignatures,
      profile: actorDeckProfile,
    }) &&
    matchesDeckSelector({
      archetypes: selector.opponentArchetypes,
      colorPairs: selector.opponentColorPairs,
      deckSignatures: selector.opponentDeckSignatures,
      profile: opponentDeckProfile,
    }) &&
    hasAnyRequiredRole(opponentDeckProfile, selector.requiresAnyRoles) &&
    hasAnyRequiredCard(opponentDeckProfile, selector.requiresAnyCards)
  );
}

export function getBestAiCardStrategyProfile(
  definitionId: string,
): CardStrategyProfile | undefined {
  return CARD_PROFILE_BY_DEFINITION_ID.get(definitionId);
}

export function resolveBestAiDeckDossierBySignature(
  signature: string | undefined,
): StrategyDeckDossier | undefined {
  return BEST_AI_DECK_DOSSIERS.find((dossier) => dossier.signature === signature);
}

export function resolveBestAiDeckDossierByFixtureId(
  fixtureId: string,
): StrategyDeckDossier | undefined {
  return BEST_AI_DECK_DOSSIERS.find((dossier) => dossier.fixtureId === fixtureId);
}

export function evaluateBestAiCardStrategy(args: {
  actorDeckProfile?: AutomatedActionDeckProfile;
  definitionId: string;
  opponentDeckProfile?: AutomatedActionDeckProfile;
}): EvaluatedBestAiCardStrategy | undefined {
  const profile = getBestAiCardStrategyProfile(args.definitionId);
  if (!profile) {
    return undefined;
  }

  const matchedRules = profile.rules
    .filter((rule) =>
      matchesMatchupSelector({
        actorDeckProfile: args.actorDeckProfile,
        opponentDeckProfile: args.opponentDeckProfile,
        selector: rule.when,
      }),
    )
    .map((rule) => ({
      adjust: normalizeAxisAdjustments(rule.adjust),
      id: rule.id,
      knowledgeAccess: getStrategyRuleKnowledgeAccess(rule.when),
      label: rule.label,
      reason: rule.reason,
      strategyTags: rule.strategyTags,
      targetPreference: rule.targetPreference,
    }));

  return {
    baseAdjust: normalizeAxisAdjustments(profile.baseAdjust),
    baseReason: profile.baseReason,
    definitionId: profile.definitionId,
    label: profile.label,
    matchedRuleIds: matchedRules.map((rule) => rule.id),
    matchedRules,
    matchupAdjust: mergeAxisAdjustments(...matchedRules.map((rule) => rule.adjust)),
    strategyTags: profile.strategyTags,
    targetPreference: matchedRules.reduce<AutomatedActionCardTargetPreference | undefined>(
      (current, rule) => mergeTargetPreferences(current, rule.targetPreference),
      profile.targetPreference,
    ),
  };
}

export function evaluateBestAiMatchupPlans(args: {
  actorDeckProfile?: AutomatedActionDeckProfile;
  opponentDeckProfile?: AutomatedActionDeckProfile;
}): EvaluatedBestAiMatchupPlan[] {
  return BEST_AI_MATCHUP_PLANS.filter((plan) =>
    matchesMatchupSelector({
      actorDeckProfile: args.actorDeckProfile,
      opponentDeckProfile: args.opponentDeckProfile,
      selector: plan.when,
    }),
  ).map((plan) => ({
    challengeBias: plan.challengeBias ?? 0,
    familyBias: plan.familyBias ?? {},
    id: plan.id,
    inkRoleWeights: mergeRoleWeights(plan.inkRoleWeights),
    label: plan.label,
    mulliganRoleWeights: mergeRoleWeights(plan.mulliganRoleWeights),
    openingPlan: plan.openingPlan,
    questBias: plan.questBias ?? 0,
    reason: plan.reason,
    roleWeightsByTurnBucket: {
      late: mergeRoleWeights(plan.roleWeightsByTurnBucket?.late),
      mid: mergeRoleWeights(plan.roleWeightsByTurnBucket?.mid),
      opening: mergeRoleWeights(plan.roleWeightsByTurnBucket?.opening),
    },
    strategyTags: plan.strategyTags,
    when: plan.when,
  }));
}

function createSyntheticDeckProfile(dossier: StrategyDeckDossier): AutomatedActionDeckProfile {
  const cards = parseSignature(dossier.signature).map(
    (entry) =>
      ({
        cardType: "character",
        cost: 0,
        count: entry.count,
        definitionId: entry.definitionId,
        fullName: entry.definitionId,
        inkTypes: [],
        inkable: true,
        lore: 0,
        roles: [],
      }) satisfies AutomatedActionDeckCardProfile,
  );

  return {
    archetype: dossier.archetype,
    cards,
    colorPairId: dossier.colorPairId,
    colors: dossier.colorPairId ? dossier.colorPairId.split("-") : [],
    curve: { high: 0, low: 0, mid: 0 },
    inkableCount: cards.reduce((total, card) => total + card.count, 0),
    playerId: "player_one" as PlayerId,
    roleCounts: {},
    signature: dossier.signature,
    typeCounts: {
      action: 0,
      character: cards.reduce((total, card) => total + card.count, 0),
      item: 0,
      location: 0,
    },
    uninkableCount: 0,
  };
}

function resolveMatchupPlanIds(
  actor: StrategyDeckDossier,
  opponent: StrategyDeckDossier,
): readonly string[] {
  const actorProfile = createSyntheticDeckProfile(actor);
  const opponentProfile = createSyntheticDeckProfile(opponent);

  return evaluateBestAiMatchupPlans({
    actorDeckProfile: actorProfile,
    opponentDeckProfile: opponentProfile,
  }).map((plan) => plan.id);
}

export const BEST_AI_MATCHUP_DOSSIERS: readonly StrategyMatchupDossier[] =
  BEST_AI_DECK_DOSSIERS.flatMap((actor) =>
    BEST_AI_DECK_DOSSIERS.map((opponent) => ({
      actorArchetype: actor.archetype,
      actorColorPairId: actor.colorPairId,
      actorFixtureId: actor.fixtureId,
      actorSignature: actor.signature,
      label: `${actor.fixtureId} vs ${opponent.fixtureId}`,
      opponentArchetype: opponent.archetype,
      opponentColorPairId: opponent.colorPairId,
      opponentFixtureId: opponent.fixtureId,
      opponentSignature: opponent.signature,
      pairId: `${actor.colorPairId}__vs__${opponent.colorPairId}`,
      planIds: resolveMatchupPlanIds(actor, opponent),
    })),
  );

function buildReportCardEntries(args: {
  actor: StrategyDeckDossier;
  opponent: StrategyDeckDossier;
}): MatchupWeightReportCardEntry[] {
  const actorProfile = createSyntheticDeckProfile(args.actor);
  const opponentProfile = createSyntheticDeckProfile(args.opponent);

  return parseSignature(args.actor.signature)
    .flatMap((entry) => {
      const evaluation = evaluateBestAiCardStrategy({
        actorDeckProfile: actorProfile,
        definitionId: entry.definitionId,
        opponentDeckProfile: opponentProfile,
      });

      if (!evaluation) {
        return [];
      }

      return [
        {
          baseAdjust: evaluation.baseAdjust,
          ...(evaluation.baseReason ? { baseReason: evaluation.baseReason } : {}),
          count: entry.count,
          definitionId: evaluation.definitionId,
          label: evaluation.label,
          matchedRuleIds: evaluation.matchedRuleIds,
          matchedRules: evaluation.matchedRules,
          matchupAdjust: evaluation.matchupAdjust,
          strategyTags: evaluation.strategyTags,
        } satisfies MatchupWeightReportCardEntry,
      ];
    })
    .sort((left, right) => left.label.localeCompare(right.label));
}

function buildReportPlanEntries(args: {
  actor: StrategyDeckDossier;
  opponent: StrategyDeckDossier;
}): MatchupWeightReportPlanEntry[] {
  const actorProfile = createSyntheticDeckProfile(args.actor);
  const opponentProfile = createSyntheticDeckProfile(args.opponent);

  return evaluateBestAiMatchupPlans({
    actorDeckProfile: actorProfile,
    opponentDeckProfile: opponentProfile,
  }).map((plan) => ({
    id: plan.id,
    knowledgeAccess: getStrategyRuleKnowledgeAccess(plan.when),
    label: plan.label,
    reason: plan.reason,
    strategyTags: plan.strategyTags,
  }));
}

export function buildBestAiMatchupWeightReport(args: {
  strategies: readonly {
    informationPolicy: StrategyInformationPolicy;
    strategyId: string;
  }[];
}): MatchupWeightReport {
  return {
    generatedAt: new Date().toISOString(),
    strategies: args.strategies.map((strategy) => ({
      informationPolicy: strategy.informationPolicy,
      matchups: BEST_AI_DECK_DOSSIERS.flatMap((actor) =>
        BEST_AI_DECK_DOSSIERS.map((opponent) => ({
          actorArchetype: actor.archetype,
          actorColorPairId: actor.colorPairId,
          actorFixtureId: actor.fixtureId,
          actorSignature: actor.signature,
          cards: buildReportCardEntries({ actor, opponent }),
          informationPolicy: strategy.informationPolicy,
          label: `${actor.label} vs ${opponent.label}`,
          matchupPairId: `${actor.colorPairId}__vs__${opponent.colorPairId}`,
          opponentArchetype: opponent.archetype,
          opponentColorPairId: opponent.colorPairId,
          opponentFixtureId: opponent.fixtureId,
          opponentSignature: opponent.signature,
          plans: buildReportPlanEntries({ actor, opponent }),
        })),
      ),
      strategyId: strategy.strategyId,
    })),
  };
}

function formatAxisAdjustments(adjustments: Partial<Record<StrategyAxis, number>>): string {
  const entries = Object.entries(adjustments).filter(
    ([, value]) => typeof value === "number" && value !== 0,
  );
  if (entries.length === 0) {
    return "none";
  }

  return entries
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([axis, value]) => `${axis}:${value}`)
    .join(", ");
}

export function buildBestAiMatchupWeightReportMarkdown(report: MatchupWeightReport): string {
  const lines: string[] = ["# Matchup Weight Report", ""];

  for (const strategy of report.strategies) {
    lines.push(`## ${strategy.strategyId} (${strategy.informationPolicy})`, "");

    for (const matchup of strategy.matchups) {
      const relevantCards = matchup.cards.filter(
        (card) =>
          Object.keys(card.baseAdjust).length > 0 ||
          Object.keys(card.matchupAdjust).length > 0 ||
          card.matchedRules.length > 0,
      );
      const relevantPlans = matchup.plans;

      if (relevantCards.length === 0 && relevantPlans.length === 0) {
        continue;
      }

      lines.push(`### ${matchup.label}`, "");
      lines.push(
        `- Pair: \`${matchup.matchupPairId}\``,
        `- Actor signature: \`${matchup.actorSignature}\``,
        `- Opponent signature: \`${matchup.opponentSignature}\``,
      );

      if (relevantPlans.length > 0) {
        lines.push("- Matchup plans:");
        for (const plan of relevantPlans) {
          lines.push(`  - \`${plan.id}\` [${plan.knowledgeAccess}] ${plan.label} - ${plan.reason}`);
        }
      }

      if (relevantCards.length > 0) {
        lines.push(
          "",
          "| Card | Count | Base | Matchup | Tags | Rules |",
          "| --- | ---: | --- | --- | --- | --- |",
        );
        for (const card of relevantCards) {
          const ruleSummary =
            card.matchedRules.length === 0
              ? "none"
              : card.matchedRules
                  .map((rule) => `${rule.id} [${rule.knowledgeAccess}]`)
                  .join("<br>");
          lines.push(
            `| ${card.label} (\`${card.definitionId}\`) | ${card.count} | ${formatAxisAdjustments(card.baseAdjust)} | ${formatAxisAdjustments(card.matchupAdjust)} | ${card.strategyTags.join(", ")} | ${ruleSummary} |`,
          );
        }
      }

      lines.push("");
    }
  }

  return `${lines.join("\n").trim()}\n`;
}
