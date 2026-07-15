import type {
  DeckAwareOpeningPlanOverride,
  AutomatedActionCardTargetPreference,
  RoleWeightMap,
} from "../deck-profile";
import type {
  AutomatedActionDeckArchetype,
  AutomatedActionDeckRoleTag,
  AutomatedActionStrategyTag,
  AutomatedActionTurnBucket,
  StrategyAxis,
} from "../types";

export type StrategyFamilyBias = {
  challenge: number;
  playCard: number;
  putCardIntoInkwell: number;
  quest: number;
};

export interface MatchupSelector {
  actorArchetypes?: readonly AutomatedActionDeckArchetype[];
  actorColorPairs?: readonly string[];
  actorDeckSignatures?: readonly string[];
  opponentArchetypes?: readonly AutomatedActionDeckArchetype[];
  opponentColorPairs?: readonly string[];
  opponentDeckSignatures?: readonly string[];
  requiresAnyCards?: readonly string[];
  requiresAnyRoles?: readonly AutomatedActionDeckRoleTag[];
}

export interface CardStrategyRule {
  adjust: Partial<Record<StrategyAxis, number>>;
  id: string;
  label: string;
  reason: string;
  strategyTags: readonly AutomatedActionStrategyTag[];
  targetPreference?: AutomatedActionCardTargetPreference;
  when: MatchupSelector;
}

export interface CardStrategyProfile {
  baseAdjust?: Partial<Record<StrategyAxis, number>>;
  baseReason?: string;
  definitionId: string;
  label: string;
  rules: readonly CardStrategyRule[];
  strategyTags: readonly AutomatedActionStrategyTag[];
  targetPreference?: AutomatedActionCardTargetPreference;
}

export interface MatchupPlan {
  challengeBias?: number;
  familyBias?: Partial<StrategyFamilyBias>;
  id: string;
  inkRoleWeights?: RoleWeightMap;
  label: string;
  mulliganRoleWeights?: RoleWeightMap;
  openingPlan?: DeckAwareOpeningPlanOverride;
  questBias?: number;
  reason: string;
  roleWeightsByTurnBucket?: Partial<Record<AutomatedActionTurnBucket, RoleWeightMap>>;
  strategyTags: readonly AutomatedActionStrategyTag[];
  when: MatchupSelector;
}

export interface StrategyDeckDossier {
  archetype: AutomatedActionDeckArchetype;
  colorPairId: string;
  fixtureId: string;
  label: string;
  signature: string;
}

export interface StrategyMatchupDossier {
  actorArchetype: AutomatedActionDeckArchetype;
  actorColorPairId: string;
  actorFixtureId: string;
  actorSignature: string;
  label: string;
  opponentArchetype: AutomatedActionDeckArchetype;
  opponentColorPairId: string;
  opponentFixtureId: string;
  opponentSignature: string;
  pairId: string;
  planIds: readonly string[];
}

export type StrategyRuleKnowledgeAccess = "actor-only" | "public-opponent" | "oracle-opponent";
