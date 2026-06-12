import type { Amount } from "@tcg/lorcana-types";

import type { DeepReadonly, CardInstanceId, CommandResult, PlayerId } from "#core";
import type { Effect } from "@tcg/lorcana-types";
import type { ChallengePreviewResult, PlayCardCostInput } from "../lorcana-engine-base";
import type {
  BagEffectEntry,
  LorcanaCardDefinition,
  LorcanaMatchState,
  LorcanaProjectedBoardView,
  PendingActionEffect,
} from "../types";

export type AutomatedActionFamily =
  | "chooseWhoGoesFirst"
  | "alterHand"
  | "resolveBag"
  | "resolveEffect"
  | "putCardIntoInkwell"
  | "playCard"
  | "activateAbility"
  | "quest"
  | "challenge"
  | "moveCharacterToLocation";

export interface AutomatedActionSearchCaps {
  targetPool: number;
  targetCombinationsPerFamily: number;
  choiceIndices: number;
  singerCombinations: number;
}

export const DEFAULT_AUTOMATED_ACTION_SEARCH_CAPS: AutomatedActionSearchCaps = {
  targetPool: 8,
  targetCombinationsPerFamily: 16,
  choiceIndices: 8,
  singerCombinations: 16,
};

export const DEFAULT_AUTOMATED_ACTION_MAX_EXECUTION_FAILURES = 3;

export type AutomatedActionTargetId = CardInstanceId | PlayerId;

export type AutomatedActionCostSelections = {
  banishCharacters?: CardInstanceId[];
  banishItems?: CardInstanceId[];
  discardCards?: CardInstanceId[];
  exertCharacters?: CardInstanceId[];
};

export type AutomatedActionDestinationSelection = {
  zone: string;
  cards: CardInstanceId[];
};

export type AutomatedActionCandidate =
  | {
      family: "chooseWhoGoesFirst";
      firstPlayerId: PlayerId;
    }
  | {
      family: "alterHand";
      cardsToMulligan: CardInstanceId[];
      plan: "keep-all" | "structural-mulligan" | "full-mulligan";
    }
  | {
      family: "resolveBag";
      bagId: string;
      choiceIndex?: number;
      destinations?: AutomatedActionDestinationSelection[];
      namedCard?: string;
      resolveOptional?: boolean;
      targets?: AutomatedActionTargetId[];
    }
  | {
      family: "resolveEffect";
      effectId: string;
      choiceIndex?: number;
      destinations?: AutomatedActionDestinationSelection[];
      namedCard?: string;
      resolveOptional?: boolean;
      targets?: AutomatedActionTargetId[];
    }
  | {
      family: "putCardIntoInkwell";
      cardId: CardInstanceId;
    }
  | {
      family: "playCard";
      cardId: CardInstanceId;
      cost: PlayCardCostInput;
      choiceIndex?: number;
      resolveOptional?: boolean;
      targets?: AutomatedActionTargetId[];
    }
  | {
      family: "activateAbility";
      cardId: CardInstanceId;
      abilityIndex: number;
      choiceIndex?: number;
      costs?: AutomatedActionCostSelections;
      targets?: AutomatedActionTargetId[];
    }
  | {
      family: "quest";
      cardId: CardInstanceId;
    }
  | {
      family: "challenge";
      attackerId: CardInstanceId;
      defenderId: CardInstanceId;
      preview?: ChallengePreviewResult | null;
    }
  | {
      family: "moveCharacterToLocation";
      characterId: CardInstanceId;
      locationId: CardInstanceId;
    };

export type AutomatedActionDiagnostic =
  | {
      kind: "unsupported-shape";
      family: AutomatedActionFamily;
      reason: string;
      sourceCardId?: CardInstanceId;
      abilityIndex?: number;
      bagId?: string;
      effectId?: string;
    }
  | {
      kind: "overflow-skip";
      family: AutomatedActionFamily;
      reason: string;
      cap: number;
      actual: number;
      sourceCardId?: CardInstanceId;
      abilityIndex?: number;
      bagId?: string;
      effectId?: string;
    }
  | {
      kind: "validation-reject";
      family: AutomatedActionFamily;
      reason: string;
      code?: string;
      candidate: AutomatedActionCandidate;
    }
  | {
      kind: "actor-resolution";
      reason: string;
      source:
        | "scoped-player"
        | "pending-effect-chooser"
        | "bag-chooser"
        | "choosing-first-player"
        | "pending-mulligan"
        | "priority-holder"
        | "unresolved";
      actorId?: PlayerId;
    };

export interface AutomatedActionDiagnosticSink {
  push(diagnostic: AutomatedActionDiagnostic): void;
}

export interface AutomatedActionAuthoritativeHints {
  actorBoard: LorcanaProjectedBoardView;
  bagItems: readonly DeepReadonly<BagEffectEntry>[];
  pendingEffects: readonly DeepReadonly<PendingActionEffect>[];
  state: DeepReadonly<LorcanaMatchState>;
}

export type AutomatedActionTurnBucket = "opening" | "mid" | "late";

export type StrategyInformationPolicy = "fair" | "oracle";

export type AutomatedActionOpponentKnowledgeSource = "none" | "public-zones" | "full-deck";

export type StrategyAxis = "mulligan" | "ink" | "play" | "challenge" | "target";

export type AutomatedActionStrategyTag =
  | "core"
  | "engine"
  | "silver-bullet"
  | "situational"
  | "expendable"
  | "dead";

export type AutomatedActionDeckRoleTag =
  | "mulliganKeep"
  | "inkAvoid"
  | "earlyPlay"
  | "latePlay"
  | "mustAnswerThreat"
  | "removal"
  | "sweeper"
  | "ramp"
  | "drawEngine"
  | "tempoThreat"
  | "evasiveThreat"
  | "synergyAnchor";

export type AutomatedActionDeckArchetype = "aggressive" | "midrange" | "control";

export interface AutomatedActionDeckCardProfile {
  cardType: NonNullable<LorcanaCardDefinition["cardType"]>;
  cost: number;
  count: number;
  definitionId: string;
  fullName: string;
  inkable: boolean;
  inkTypes: readonly string[];
  lore: number;
  roles: readonly AutomatedActionDeckRoleTag[];
}

export interface AutomatedActionDeckCurveProfile {
  high: number;
  low: number;
  mid: number;
}

export interface AutomatedActionDeckTypeProfile {
  action: number;
  character: number;
  item: number;
  location: number;
}

export interface AutomatedActionDeckProfile {
  archetype: AutomatedActionDeckArchetype;
  cards: readonly AutomatedActionDeckCardProfile[];
  colorPairId: string;
  colors: readonly string[];
  curve: AutomatedActionDeckCurveProfile;
  inkableCount: number;
  playerId: PlayerId;
  roleCounts: Readonly<Partial<Record<AutomatedActionDeckRoleTag, number>>>;
  signature: string;
  typeCounts: AutomatedActionDeckTypeProfile;
  uninkableCount: number;
}

export interface AutomatedActionMatchupProfile {
  actorArchetype: AutomatedActionDeckArchetype;
  actorColorPairId: string;
  opponentArchetype: AutomatedActionDeckArchetype;
  opponentColorPairId: string;
  pairId: string;
}

export interface AutomatedActionPlanningContext {
  actorId: PlayerId;
  actorDeckProfile?: AutomatedActionDeckProfile;
  authoritativeHints?: AutomatedActionAuthoritativeHints;
  board: LorcanaProjectedBoardView;
  deckProfilesByPlayer: Readonly<Partial<Record<PlayerId, AutomatedActionDeckProfile>>>;
  diagnostics: AutomatedActionDiagnosticSink;
  gameSegment?: string;
  getCardDefinition(cardId: CardInstanceId): LorcanaCardDefinition | undefined;
  getCardRoles(cardId: CardInstanceId): readonly AutomatedActionDeckRoleTag[];
  getDefinitionRoles(definitionId: string): readonly AutomatedActionDeckRoleTag[];
  informationPolicy: StrategyInformationPolicy;
  phase?: string;
  matchupProfile?: AutomatedActionMatchupProfile;
  opponentKnowledgeSource: AutomatedActionOpponentKnowledgeSource;
  opponentDeckProfile?: AutomatedActionDeckProfile;
  opponentId?: PlayerId;
  resolveCandidateSourceCardId(candidate: AutomatedActionCandidate): CardInstanceId | undefined;
  resolveCandidateSourceDefinitionId(candidate: AutomatedActionCandidate): string | undefined;
  resolveCandidateEffect(candidate: AutomatedActionCandidate): Effect | undefined;
  resolveCandidateSourceRoles(
    candidate: AutomatedActionCandidate,
  ): readonly AutomatedActionDeckRoleTag[];
  step?: string | null;
  turnBucket: AutomatedActionTurnBucket;
  turnNumber: number;
}

export interface AutomatedActionStrategy {
  informationPolicy?: StrategyInformationPolicy;
  name: string;
  summarizeCandidates(
    context: AutomatedActionPlanningContext,
    candidates: readonly AutomatedActionCandidate[],
  ): AutomatedActionCandidateSummary[];
}

export type AutomatedActionTraceHeuristicValue = boolean | number | string;

export interface AutomatedActionCandidateHeuristic {
  direction: "asc" | "desc" | "preferTrue";
  key: string;
  value: AutomatedActionTraceHeuristicValue;
}

export interface AutomatedActionCandidateContributor {
  axis?: StrategyAxis;
  key: string;
  reason?: string;
  ruleId?: string;
  source: "opening" | "family" | "role" | "target" | "card-profile" | "card-rule" | "generic";
  strategyTags?: readonly AutomatedActionStrategyTag[];
  value: number;
}

export interface AutomatedActionCandidateSummary {
  actorDeckSignature?: string;
  candidate: AutomatedActionCandidate;
  contributors?: readonly AutomatedActionCandidateContributor[];
  family: AutomatedActionFamily;
  heuristics: readonly AutomatedActionCandidateHeuristic[];
  informationPolicy?: StrategyInformationPolicy;
  matchedRuleIds?: readonly string[];
  opponentKnowledgeSource?: AutomatedActionOpponentKnowledgeSource;
  sourceDefinitionId?: string;
  stableKey: string;
}

export interface AutomatedActionBoardSnapshot {
  bagCount: number;
  boardCounts: Readonly<Record<PlayerId, number>>;
  handCounts: Readonly<Record<PlayerId, number>>;
  inkCounts: Readonly<Record<PlayerId, number>>;
  loreTotals: Readonly<Record<PlayerId, number>>;
  pendingEffectCount: number;
  stateFingerprint: string;
}

export interface AutomatedActionDecisionTraceExecutionAttempt {
  candidate: AutomatedActionCandidateSummary;
  error?: string;
  errorCode?: string;
  stateId?: number;
  success: boolean;
}

export interface AutomatedActionDecisionTraceFinalResult {
  error?: string;
  errorCode?: string;
  stateId?: number;
  success: boolean;
}

export interface AutomatedActionDecisionTrace {
  actorId?: PlayerId;
  actorDeckSignature?: string;
  boardSnapshot: AutomatedActionBoardSnapshot;
  blocked?: AutomatedActionBlockedState;
  diagnostics: AutomatedActionDiagnostic[];
  executionAttempts: AutomatedActionDecisionTraceExecutionAttempt[];
  fallbackTaken?: AutomatedActionFallback;
  finalResult?: AutomatedActionDecisionTraceFinalResult;
  gameSegment?: string;
  informationPolicy?: StrategyInformationPolicy;
  kind: "enumeration" | "execution";
  opponentKnowledgeSource?: AutomatedActionOpponentKnowledgeSource;
  orderedCandidates: AutomatedActionCandidateSummary[];
  phase?: string;
  selectedCandidate?: AutomatedActionCandidateSummary;
  step?: string | null;
  strategyName: string;
  turnNumber: number;
  unsupportedSkips: Array<
    Extract<AutomatedActionDiagnostic, { kind: "unsupported-shape" } | { kind: "overflow-skip" }>
  >;
  validationSkips: Array<Extract<AutomatedActionDiagnostic, { kind: "validation-reject" }>>;
}

export interface AutomatedActionTraceSink {
  push(trace: AutomatedActionDecisionTrace): void;
}

export interface AutomatedActionEnumerationOptions {
  searchCaps?: Partial<AutomatedActionSearchCaps>;
  strategy?: AutomatedActionStrategy;
  traceSink?: AutomatedActionTraceSink;
}

export interface AutomatedActionExecutionOptions extends AutomatedActionEnumerationOptions {
  maxExecutionFailures?: number;
}

export interface AutomatedActionEnumerationResult {
  actorId?: PlayerId;
  candidates: AutomatedActionCandidate[];
  diagnostics: AutomatedActionDiagnostic[];
  unsupportedSkips: Array<
    Extract<AutomatedActionDiagnostic, { kind: "unsupported-shape" } | { kind: "overflow-skip" }>
  >;
  validationSkips: Array<Extract<AutomatedActionDiagnostic, { kind: "validation-reject" }>>;
}

export interface AutomatedActionExecutionAttempt {
  candidate: AutomatedActionCandidate;
  result: CommandResult;
}

export type AutomatedActionFallback = "passTurn" | "concede";

export interface AutomatedActionBlockedState {
  reason: "execution-failures" | "no-candidates";
  passTurnError: string;
  passTurnErrorCode: string;
}

export interface AutomatedActionExecutionResult {
  actorId?: PlayerId;
  blocked?: AutomatedActionBlockedState;
  diagnostics: AutomatedActionDiagnostic[];
  executionAttempts: AutomatedActionExecutionAttempt[];
  fallbackTaken?: AutomatedActionFallback;
  finalResult: CommandResult;
  orderedCandidates: AutomatedActionCandidate[];
  selectedCandidate?: AutomatedActionCandidate;
  unsupportedSkips: Array<
    Extract<AutomatedActionDiagnostic, { kind: "unsupported-shape" } | { kind: "overflow-skip" }>
  >;
  validationSkips: Array<Extract<AutomatedActionDiagnostic, { kind: "validation-reject" }>>;
}

export type AutomatedActionResolutionShape = {
  choiceCount: number;
  choiceOptionCount?: number;
  optionalCount: number;
  requiresDestinations: boolean;
  requiresNamedCard: boolean;
  requiresOrderedTargets: boolean;
  usesAmountSelection: boolean;
};

export type AutomatedActionResolutionVariant = {
  choiceIndex?: number;
  destinations?: AutomatedActionDestinationSelection[];
  namedCard?: string;
  resolveOptional?: boolean;
  targets?: AutomatedActionTargetId[];
};

export type AutomatedActionEffectSupport = {
  reason?: string;
  shape: AutomatedActionResolutionShape;
  supported: boolean;
};

export type AutomatedActionAmount = Amount;
