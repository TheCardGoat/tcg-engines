import type { MatchStaticResources, CardInstanceId, PlayerId } from "#core";
import type { Effect, LorcanaCardDefinition } from "@tcg/lorcana-types";
import type {
  AutomatedActionAuthoritativeHints,
  AutomatedActionCandidate,
  AutomatedActionDeckArchetype,
  AutomatedActionDeckCardProfile,
  AutomatedActionDeckCurveProfile,
  AutomatedActionDeckProfile,
  AutomatedActionDeckRoleTag,
  AutomatedActionDeckTypeProfile,
  AutomatedActionMatchupProfile,
  AutomatedActionOpponentKnowledgeSource,
  AutomatedActionTurnBucket,
  StrategyInformationPolicy,
} from "./types";
import type { LorcanaProjectedBoardView } from "../types";

export type RoleWeightMap = Partial<Record<AutomatedActionDeckRoleTag, number>>;

export type DeckAwareOpeningFamilyBias = {
  challenge: number;
  playCard: number;
  putCardIntoInkwell: number;
  quest: number;
};

export type DeckAwareOpeningPlan = {
  minInkablesToKeep: number;
  maxUninkablesToKeep: number;
  maxLateCardsToKeep: number;
  minEarlyPlayCount: number;
  preferredTwoDropCount: number;
  openingFamilyBias: DeckAwareOpeningFamilyBias;
};

export type DeckAwareOpeningPlanOverride = Partial<
  Omit<DeckAwareOpeningPlan, "openingFamilyBias">
> & {
  openingFamilyBias?: Partial<DeckAwareOpeningFamilyBias>;
};

export type DeckAwareColorPairProfile = {
  archetype: AutomatedActionDeckArchetype;
  challengeMode: "default" | "board-control" | "aggressive-board-control";
  familyBias: {
    challenge: number;
    playCard: number;
    putCardIntoInkwell: number;
    quest: number;
  };
  inkPrintedCostDirection: "asc" | "desc";
  inkRoleWeights: RoleWeightMap;
  mulliganRoleWeights: RoleWeightMap;
  openingPlan: DeckAwareOpeningPlan;
  playCardNetCostDirection: "asc" | "desc";
  preferSimplePermanentDevelopment: boolean;
  roleWeightsByTurnBucket: Record<AutomatedActionTurnBucket, RoleWeightMap>;
};

export type DeckAwareMatchupModifier = {
  challengeBias?: number;
  familyBias?: Partial<DeckAwareColorPairProfile["familyBias"]>;
  inkRoleWeights?: RoleWeightMap;
  mulliganRoleWeights?: RoleWeightMap;
  openingPlan?: DeckAwareOpeningPlanOverride;
  questBias?: number;
  roleWeightsByTurnBucket?: Partial<Record<AutomatedActionTurnBucket, RoleWeightMap>>;
};

export type AutomatedActionCardTargetPreference = {
  actorPlayerScore?: number;
  alliedRoleWeights?: RoleWeightMap;
  beneficialAlliedScore?: number;
  beneficialOpposingPenalty?: number;
  damagedAlliedScore?: number;
  damagedOpposingScore?: number;
  exertedOpposingScore?: number;
  harmfulAlliedPenalty?: number;
  harmfulOpposingScore?: number;
  highLoreOpposingMultiplier?: number;
  lowStrengthOpposingScore?: number;
  opposingRoleWeights?: RoleWeightMap;
  opponentPlayerScore?: number;
};

export type DeckAwareCardOpeningMatchupAdjustment = {
  inkScoreAdjustment?: number;
  mulliganScoreAdjustment?: number;
};

export type DeckAwareCardOverride = {
  matchupAdjustments?: Readonly<Record<string, DeckAwareCardOpeningMatchupAdjustment>>;
  roleAdjustments?: RoleWeightMap;
  roles?: readonly AutomatedActionDeckRoleTag[];
  targetPreference?: AutomatedActionCardTargetPreference;
};

type EffectInspectionNode = Effect & {
  count?: number | { upTo?: number; min?: number; max?: number } | "all";
  destinations?: Array<{ zone?: string }>;
  effect?: Effect;
  effects?: Effect[];
  else?: Effect;
  falseEffect?: Effect;
  forEach?: Effect[];
  ifFalse?: Effect;
  ifTrue?: Effect;
  options?: Effect[];
  selector?: string;
  steps?: Effect[];
  target?: unknown;
  then?: Effect;
  trueEffect?: Effect;
  type: string;
};

type EffectSummary = {
  drawsCards: boolean;
  hasMultiTargetRemoval: boolean;
  hasRamp: boolean;
  removesThreats: boolean;
};

export type AutomatedActionDeckPlanningMetadata = {
  actorDeckProfile?: AutomatedActionDeckProfile;
  deckProfilesByPlayer: Readonly<Partial<Record<PlayerId, AutomatedActionDeckProfile>>>;
  getCardDefinition(cardId: CardInstanceId): LorcanaCardDefinition | undefined;
  getCardRoles(cardId: CardInstanceId): readonly AutomatedActionDeckRoleTag[];
  getDefinitionRoles(definitionId: string): readonly AutomatedActionDeckRoleTag[];
  informationPolicy: StrategyInformationPolicy;
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
  turnBucket: AutomatedActionTurnBucket;
};

const DEFAULT_COLOR_PAIR_PROFILE: DeckAwareColorPairProfile = {
  archetype: "midrange",
  challengeMode: "board-control",
  familyBias: {
    challenge: 0,
    playCard: 0,
    putCardIntoInkwell: 0,
    quest: 0,
  },
  inkPrintedCostDirection: "asc",
  inkRoleWeights: {
    drawEngine: -4,
    earlyPlay: -4,
    evasiveThreat: -3,
    inkAvoid: -5,
    latePlay: 5,
    mulliganKeep: -3,
    ramp: -5,
    removal: -2,
    sweeper: -5,
    synergyAnchor: -4,
    tempoThreat: -2,
  },
  mulliganRoleWeights: {
    drawEngine: 4,
    earlyPlay: 5,
    evasiveThreat: 2,
    inkAvoid: 2,
    latePlay: -3,
    mulliganKeep: 4,
    ramp: 4,
    removal: 1,
    sweeper: -3,
    synergyAnchor: 3,
    tempoThreat: 3,
  },
  openingPlan: {
    maxLateCardsToKeep: 1,
    maxUninkablesToKeep: 2,
    minEarlyPlayCount: 1,
    minInkablesToKeep: 2,
    openingFamilyBias: {
      challenge: 0,
      playCard: 0,
      putCardIntoInkwell: 0,
      quest: 0,
    },
    preferredTwoDropCount: 1,
  },
  playCardNetCostDirection: "desc",
  preferSimplePermanentDevelopment: true,
  roleWeightsByTurnBucket: {
    opening: {
      drawEngine: 3,
      earlyPlay: 5,
      evasiveThreat: 3,
      latePlay: -2,
      mulliganKeep: 2,
      ramp: 4,
      removal: 3,
      sweeper: -2,
      synergyAnchor: 2,
      tempoThreat: 4,
    },
    mid: {
      drawEngine: 3,
      earlyPlay: 2,
      evasiveThreat: 3,
      latePlay: 2,
      mulliganKeep: 1,
      ramp: 3,
      removal: 4,
      sweeper: 2,
      synergyAnchor: 3,
      tempoThreat: 3,
    },
    late: {
      drawEngine: 3,
      earlyPlay: -1,
      evasiveThreat: 2,
      latePlay: 5,
      mulliganKeep: 0,
      ramp: 1,
      removal: 4,
      sweeper: 4,
      synergyAnchor: 3,
      tempoThreat: 1,
    },
  },
};

const COLOR_PAIR_PROFILES: Record<string, DeckAwareColorPairProfile> = {
  "amber-emerald": {
    archetype: "aggressive",
    challengeMode: "default",
    familyBias: {
      challenge: -1,
      playCard: 1,
      putCardIntoInkwell: 0,
      quest: 2,
    },
    inkPrintedCostDirection: "asc",
    inkRoleWeights: {
      ...DEFAULT_COLOR_PAIR_PROFILE.inkRoleWeights,
      earlyPlay: -5,
      evasiveThreat: -5,
      removal: -1,
      tempoThreat: -4,
    },
    mulliganRoleWeights: {
      ...DEFAULT_COLOR_PAIR_PROFILE.mulliganRoleWeights,
      earlyPlay: 6,
      evasiveThreat: 5,
      latePlay: -4,
      removal: 0,
      tempoThreat: 6,
    },
    openingPlan: {
      maxLateCardsToKeep: 1,
      maxUninkablesToKeep: 1,
      minEarlyPlayCount: 2,
      minInkablesToKeep: 2,
      openingFamilyBias: {
        challenge: -1,
        playCard: 1,
        putCardIntoInkwell: -1,
        quest: 1,
      },
      preferredTwoDropCount: 1,
    },
    playCardNetCostDirection: "desc",
    preferSimplePermanentDevelopment: false,
    roleWeightsByTurnBucket: {
      opening: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.opening,
        drawEngine: 2,
        earlyPlay: 7,
        evasiveThreat: 6,
        latePlay: -3,
        ramp: 1,
        removal: 2,
        synergyAnchor: 1,
        tempoThreat: 7,
      },
      mid: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.mid,
        earlyPlay: 3,
        evasiveThreat: 5,
        latePlay: 1,
        removal: 2,
        tempoThreat: 5,
      },
      late: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.late,
        earlyPlay: -2,
        evasiveThreat: 3,
        latePlay: 3,
        removal: 2,
        sweeper: 1,
        tempoThreat: 2,
      },
    },
  },
  "amber-steel": {
    archetype: "aggressive",
    challengeMode: "aggressive-board-control",
    familyBias: {
      challenge: 1,
      playCard: 1,
      putCardIntoInkwell: 0,
      quest: 2,
    },
    inkPrintedCostDirection: "asc",
    inkRoleWeights: {
      ...DEFAULT_COLOR_PAIR_PROFILE.inkRoleWeights,
      drawEngine: -5,
      earlyPlay: -5,
      removal: -4,
      tempoThreat: -4,
    },
    mulliganRoleWeights: {
      ...DEFAULT_COLOR_PAIR_PROFILE.mulliganRoleWeights,
      drawEngine: 4,
      earlyPlay: 6,
      removal: 3,
      tempoThreat: 6,
    },
    openingPlan: {
      maxLateCardsToKeep: 1,
      maxUninkablesToKeep: 1,
      minEarlyPlayCount: 2,
      minInkablesToKeep: 2,
      openingFamilyBias: {
        challenge: 0,
        playCard: 1,
        putCardIntoInkwell: -1,
        quest: 1,
      },
      preferredTwoDropCount: 1,
    },
    playCardNetCostDirection: "desc",
    preferSimplePermanentDevelopment: false,
    roleWeightsByTurnBucket: {
      opening: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.opening,
        drawEngine: 3,
        earlyPlay: 7,
        latePlay: -3,
        ramp: 1,
        removal: 5,
        synergyAnchor: 2,
        tempoThreat: 7,
      },
      mid: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.mid,
        drawEngine: 3,
        earlyPlay: 3,
        evasiveThreat: 2,
        latePlay: 1,
        removal: 5,
        synergyAnchor: 2,
        tempoThreat: 4,
      },
      late: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.late,
        drawEngine: 3,
        latePlay: 3,
        removal: 4,
        sweeper: 2,
        tempoThreat: 2,
      },
    },
  },
  "amethyst-ruby": {
    archetype: "control",
    challengeMode: "board-control",
    familyBias: {
      challenge: 2,
      playCard: 0,
      putCardIntoInkwell: 0,
      quest: -1,
    },
    inkPrintedCostDirection: "asc",
    inkRoleWeights: {
      ...DEFAULT_COLOR_PAIR_PROFILE.inkRoleWeights,
      removal: -4,
      sweeper: -6,
      synergyAnchor: -5,
    },
    mulliganRoleWeights: {
      ...DEFAULT_COLOR_PAIR_PROFILE.mulliganRoleWeights,
      drawEngine: 5,
      latePlay: -2,
      ramp: 1,
      removal: 5,
      sweeper: 4,
      synergyAnchor: 4,
      tempoThreat: 2,
    },
    openingPlan: {
      maxLateCardsToKeep: 2,
      maxUninkablesToKeep: 2,
      minEarlyPlayCount: 1,
      minInkablesToKeep: 2,
      openingFamilyBias: {
        challenge: 0,
        playCard: -1,
        putCardIntoInkwell: 1,
        quest: -1,
      },
      preferredTwoDropCount: 1,
    },
    playCardNetCostDirection: "desc",
    preferSimplePermanentDevelopment: true,
    roleWeightsByTurnBucket: {
      opening: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.opening,
        drawEngine: 4,
        earlyPlay: 3,
        latePlay: -1,
        ramp: 1,
        removal: 6,
        sweeper: 3,
        synergyAnchor: 4,
        tempoThreat: 3,
      },
      mid: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.mid,
        drawEngine: 4,
        latePlay: 2,
        removal: 7,
        sweeper: 5,
        synergyAnchor: 4,
      },
      late: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.late,
        drawEngine: 4,
        latePlay: 5,
        removal: 6,
        sweeper: 6,
        synergyAnchor: 4,
      },
    },
  },
  "amethyst-sapphire": {
    archetype: "midrange",
    challengeMode: "board-control",
    familyBias: {
      challenge: 1,
      playCard: 1,
      putCardIntoInkwell: 0,
      quest: 0,
    },
    inkPrintedCostDirection: "asc",
    inkRoleWeights: {
      ...DEFAULT_COLOR_PAIR_PROFILE.inkRoleWeights,
      drawEngine: -5,
      ramp: -5,
      synergyAnchor: -4,
    },
    mulliganRoleWeights: {
      ...DEFAULT_COLOR_PAIR_PROFILE.mulliganRoleWeights,
      drawEngine: 5,
      earlyPlay: 4,
      ramp: 5,
      removal: 2,
      synergyAnchor: 4,
    },
    openingPlan: {
      maxLateCardsToKeep: 1,
      maxUninkablesToKeep: 2,
      minEarlyPlayCount: 1,
      minInkablesToKeep: 2,
      openingFamilyBias: {
        challenge: 0,
        playCard: 1,
        putCardIntoInkwell: 0,
        quest: -1,
      },
      preferredTwoDropCount: 1,
    },
    playCardNetCostDirection: "desc",
    preferSimplePermanentDevelopment: true,
    roleWeightsByTurnBucket: {
      opening: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.opening,
        drawEngine: 5,
        earlyPlay: 4,
        latePlay: -2,
        ramp: 6,
        removal: 2,
        synergyAnchor: 4,
      },
      mid: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.mid,
        drawEngine: 4,
        latePlay: 2,
        ramp: 5,
        removal: 3,
        synergyAnchor: 4,
      },
      late: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.late,
        drawEngine: 4,
        latePlay: 5,
        ramp: 2,
        removal: 4,
        sweeper: 3,
        synergyAnchor: 4,
      },
    },
  },
  "sapphire-steel": {
    archetype: "midrange",
    challengeMode: "board-control",
    familyBias: {
      challenge: 1,
      playCard: 2,
      putCardIntoInkwell: 0,
      quest: 0,
    },
    inkPrintedCostDirection: "asc",
    inkRoleWeights: {
      ...DEFAULT_COLOR_PAIR_PROFILE.inkRoleWeights,
      drawEngine: -5,
      ramp: -6,
      removal: -4,
      synergyAnchor: -4,
    },
    mulliganRoleWeights: {
      ...DEFAULT_COLOR_PAIR_PROFILE.mulliganRoleWeights,
      drawEngine: 4,
      earlyPlay: 4,
      ramp: 6,
      removal: 4,
      synergyAnchor: 3,
    },
    openingPlan: {
      maxLateCardsToKeep: 1,
      maxUninkablesToKeep: 2,
      minEarlyPlayCount: 1,
      minInkablesToKeep: 2,
      openingFamilyBias: {
        challenge: 0,
        playCard: 1,
        putCardIntoInkwell: 0,
        quest: -1,
      },
      preferredTwoDropCount: 1,
    },
    playCardNetCostDirection: "desc",
    preferSimplePermanentDevelopment: true,
    roleWeightsByTurnBucket: {
      opening: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.opening,
        drawEngine: 4,
        earlyPlay: 4,
        latePlay: -2,
        ramp: 7,
        removal: 4,
        synergyAnchor: 3,
        tempoThreat: 2,
      },
      mid: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.mid,
        drawEngine: 4,
        latePlay: 2,
        ramp: 5,
        removal: 5,
        synergyAnchor: 3,
      },
      late: {
        ...DEFAULT_COLOR_PAIR_PROFILE.roleWeightsByTurnBucket.late,
        drawEngine: 4,
        latePlay: 5,
        ramp: 2,
        removal: 5,
        synergyAnchor: 3,
      },
    },
  },
};

export const DECK_AWARE_COLOR_PAIR_IDS = Object.freeze(
  Object.keys(COLOR_PAIR_PROFILES).sort(),
) as readonly string[];

const MATCHUP_MODIFIERS: Record<string, DeckAwareMatchupModifier> = {
  "amber-emerald__vs__sapphire-steel": {
    challengeBias: -1,
    openingPlan: {
      minEarlyPlayCount: 2,
      openingFamilyBias: {
        playCard: 1,
        putCardIntoInkwell: -1,
      },
    },
    roleWeightsByTurnBucket: {
      mid: { evasiveThreat: 2, tempoThreat: 2 },
      opening: { evasiveThreat: 2, tempoThreat: 2 },
    },
  },
  "amber-steel__vs__amethyst-ruby": {
    openingPlan: {
      minEarlyPlayCount: 2,
      openingFamilyBias: {
        challenge: 1,
        playCard: 1,
      },
    },
    roleWeightsByTurnBucket: {
      mid: { removal: 1, tempoThreat: 1 },
    },
  },
  "amber-steel__vs__sapphire-steel": {
    openingPlan: {
      minEarlyPlayCount: 2,
      openingFamilyBias: {
        challenge: 1,
        playCard: 1,
      },
    },
    roleWeightsByTurnBucket: {
      mid: { mustAnswerThreat: 2, tempoThreat: 1 },
      opening: { mustAnswerThreat: 1, tempoThreat: 2 },
    },
  },
  "amethyst-ruby__vs__amber-emerald": {
    challengeBias: 1,
    openingPlan: {
      maxLateCardsToKeep: 1,
      openingFamilyBias: {
        challenge: 1,
        playCard: -1,
        putCardIntoInkwell: 1,
      },
    },
    roleWeightsByTurnBucket: {
      mid: { removal: 2, sweeper: 1 },
      opening: { mustAnswerThreat: 2, removal: 2 },
    },
  },
  "amethyst-ruby__vs__amber-steel": {
    challengeBias: 1,
    openingPlan: {
      maxLateCardsToKeep: 1,
      openingFamilyBias: {
        challenge: 1,
        playCard: -1,
        putCardIntoInkwell: 1,
      },
    },
    roleWeightsByTurnBucket: {
      mid: { removal: 2, sweeper: 1 },
      opening: { mustAnswerThreat: 2, removal: 2 },
    },
  },
  "amethyst-ruby__vs__amethyst-ruby": {
    openingPlan: {
      maxLateCardsToKeep: 2,
      openingFamilyBias: {
        playCard: 0,
        putCardIntoInkwell: 0,
      },
    },
  },
  "sapphire-steel__vs__amber-emerald": {
    challengeBias: 1,
    openingPlan: {
      maxLateCardsToKeep: 1,
      minEarlyPlayCount: 2,
      openingFamilyBias: {
        playCard: -1,
        putCardIntoInkwell: 1,
      },
    },
    roleWeightsByTurnBucket: {
      mid: { removal: 2, sweeper: 1 },
      opening: { mustAnswerThreat: 2, removal: 2 },
    },
  },
  "sapphire-steel__vs__amber-steel": {
    challengeBias: 1,
    openingPlan: {
      maxLateCardsToKeep: 1,
      minEarlyPlayCount: 2,
      openingFamilyBias: {
        playCard: -3,
        putCardIntoInkwell: 1,
      },
    },
    roleWeightsByTurnBucket: {
      mid: { removal: 2, ramp: 1 },
      opening: { mustAnswerThreat: 2, removal: 2 },
    },
  },
  "sapphire-steel__vs__sapphire-steel": {
    openingPlan: {
      maxLateCardsToKeep: 2,
      openingFamilyBias: {
        playCard: 1,
        putCardIntoInkwell: 0,
      },
    },
  },
};

const CARD_OVERRIDES: Record<string, DeckAwareCardOverride> = {
  "0RS": {
    matchupAdjustments: {
      "sapphire-steel__vs__amber-steel": {
        inkScoreAdjustment: 6,
        mulliganScoreAdjustment: -3,
      },
      "amethyst-ruby__vs__amethyst-ruby": {
        inkScoreAdjustment: -2,
        mulliganScoreAdjustment: 2,
      },
      "sapphire-steel__vs__sapphire-steel": {
        inkScoreAdjustment: -2,
        mulliganScoreAdjustment: 4,
      },
    },
    roleAdjustments: { drawEngine: 4, inkAvoid: 4, latePlay: 3, synergyAnchor: 3 },
    roles: ["drawEngine", "inkAvoid", "latePlay", "synergyAnchor"],
  },
  "3ft": {
    roleAdjustments: { inkAvoid: 3, removal: 4 },
    roles: ["inkAvoid", "removal"],
    targetPreference: {
      exertedOpposingScore: 2,
      highLoreOpposingMultiplier: 1,
      lowStrengthOpposingScore: 1,
      opposingRoleWeights: { drawEngine: 2, mustAnswerThreat: 4, tempoThreat: 2 },
    },
  },
  "404": {
    roleAdjustments: { drawEngine: 2, mulliganKeep: 2, removal: 4 },
    roles: ["drawEngine", "mulliganKeep", "removal"],
    targetPreference: {
      highLoreOpposingMultiplier: 1,
      lowStrengthOpposingScore: 2,
      opposingRoleWeights: { drawEngine: 2, evasiveThreat: 2, mustAnswerThreat: 4, tempoThreat: 2 },
    },
  },
  "7im": {
    roleAdjustments: { drawEngine: 4, inkAvoid: 4, synergyAnchor: 4 },
    roles: ["drawEngine", "inkAvoid", "synergyAnchor"],
  },
  B2Y: {
    roleAdjustments: { drawEngine: 3, evasiveThreat: 4, inkAvoid: 4, tempoThreat: 3 },
    roles: ["drawEngine", "evasiveThreat", "inkAvoid", "tempoThreat"],
  },
  DI6: {
    roleAdjustments: { drawEngine: 2, latePlay: 2, sweeper: 5 },
    roles: ["drawEngine", "latePlay", "sweeper"],
  },
  Dub: {
    roleAdjustments: { drawEngine: 4, earlyPlay: 2, inkAvoid: 4, mulliganKeep: 4 },
    roles: ["drawEngine", "earlyPlay", "inkAvoid", "mulliganKeep"],
  },
  EfC: {
    roleAdjustments: { drawEngine: 3, earlyPlay: 2, inkAvoid: 5, mulliganKeep: 4, ramp: 5 },
    roles: ["drawEngine", "earlyPlay", "inkAvoid", "mulliganKeep", "ramp"],
  },
  EhX: {
    roleAdjustments: { inkAvoid: 5, latePlay: 4, sweeper: 6 },
    roles: ["inkAvoid", "latePlay", "sweeper"],
  },
  EtL: {
    matchupAdjustments: {
      "amethyst-ruby__vs__amber-emerald": {
        inkScoreAdjustment: -4,
        mulliganScoreAdjustment: 4,
      },
      "amethyst-ruby__vs__amber-steel": {
        inkScoreAdjustment: -4,
        mulliganScoreAdjustment: 4,
      },
      "sapphire-steel__vs__amber-emerald": {
        inkScoreAdjustment: -4,
        mulliganScoreAdjustment: 4,
      },
      "sapphire-steel__vs__amber-steel": {
        inkScoreAdjustment: -5,
        mulliganScoreAdjustment: 5,
      },
    },
    roleAdjustments: { inkAvoid: 4, latePlay: 2, removal: 5 },
    roles: ["inkAvoid", "latePlay", "removal"],
    targetPreference: {
      highLoreOpposingMultiplier: 1,
      lowStrengthOpposingScore: 3,
      opposingRoleWeights: { evasiveThreat: 2, mustAnswerThreat: 4, tempoThreat: 3 },
    },
  },
  F8I: {
    roleAdjustments: { earlyPlay: 3, mulliganKeep: 3, synergyAnchor: 2 },
    roles: ["earlyPlay", "mulliganKeep", "synergyAnchor"],
  },
  Ql7: {
    roleAdjustments: { drawEngine: 2, mulliganKeep: 2, removal: 3 },
    roles: ["drawEngine", "mulliganKeep", "removal"],
    targetPreference: {
      exertedOpposingScore: 3,
      highLoreOpposingMultiplier: 1,
      opposingRoleWeights: { drawEngine: 2, mustAnswerThreat: 3, tempoThreat: 2 },
    },
  },
  Y3G: {
    roleAdjustments: {
      drawEngine: 4,
      inkAvoid: 4,
      latePlay: 5,
      mustAnswerThreat: 4,
      synergyAnchor: 3,
    },
    roles: ["drawEngine", "inkAvoid", "latePlay", "mustAnswerThreat", "synergyAnchor"],
  },
  bIQ: {
    roleAdjustments: { drawEngine: 2, mulliganKeep: 1, removal: 3 },
    roles: ["drawEngine", "mulliganKeep", "removal"],
    targetPreference: {
      opposingRoleWeights: { evasiveThreat: 6, mustAnswerThreat: 2, tempoThreat: 2 },
    },
  },
  gPY: {
    matchupAdjustments: {
      "amethyst-sapphire__vs__sapphire-steel": {
        inkScoreAdjustment: -3,
        mulliganScoreAdjustment: 2,
      },
      "sapphire-steel__vs__sapphire-steel": {
        inkScoreAdjustment: -4,
        mulliganScoreAdjustment: 4,
      },
    },
    roleAdjustments: { earlyPlay: 3, inkAvoid: 5, mulliganKeep: 4, ramp: 6, synergyAnchor: 2 },
    roles: ["earlyPlay", "inkAvoid", "mulliganKeep", "ramp", "synergyAnchor"],
  },
  lih: {
    roleAdjustments: { inkAvoid: 4, mulliganKeep: 4, mustAnswerThreat: 4, tempoThreat: 6 },
    roles: ["inkAvoid", "mulliganKeep", "mustAnswerThreat", "tempoThreat"],
  },
  mTY: {
    roleAdjustments: { drawEngine: 5, inkAvoid: 5, mulliganKeep: 4, synergyAnchor: 4 },
    roles: ["drawEngine", "inkAvoid", "mulliganKeep", "synergyAnchor"],
    targetPreference: {
      alliedRoleWeights: { synergyAnchor: 2, tempoThreat: 1 },
      damagedAlliedScore: 3,
    },
  },
  rHN: {
    roleAdjustments: { mulliganKeep: 1, removal: 4 },
    roles: ["mulliganKeep", "removal"],
    targetPreference: {
      highLoreOpposingMultiplier: 1,
      opposingRoleWeights: { drawEngine: 2, mustAnswerThreat: 4, tempoThreat: 2 },
    },
  },
  sQ9: {
    roleAdjustments: { mulliganKeep: 1, removal: 4 },
    roles: ["mulliganKeep", "removal"],
    targetPreference: {
      highLoreOpposingMultiplier: 1,
      opposingRoleWeights: { drawEngine: 2, mustAnswerThreat: 4, tempoThreat: 2 },
    },
  },
  t9V: {
    roleAdjustments: { inkAvoid: 5, latePlay: 2, removal: 6, sweeper: 1 },
    roles: ["inkAvoid", "latePlay", "removal", "sweeper"],
    targetPreference: {
      highLoreOpposingMultiplier: 1,
      opposingRoleWeights: {
        drawEngine: 2,
        latePlay: 3,
        mustAnswerThreat: 4,
        ramp: 2,
        synergyAnchor: 2,
      },
    },
  },
  tM1: {
    roleAdjustments: { inkAvoid: 4, mulliganKeep: 4, mustAnswerThreat: 4, tempoThreat: 5 },
    roles: ["inkAvoid", "mulliganKeep", "mustAnswerThreat", "tempoThreat"],
  },
};

function isEffectInspectionNode(value: unknown): value is EffectInspectionNode {
  return typeof value === "object" && value !== null && "type" in value;
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
      if (typeof value === "number" && Number.isFinite(value)) {
        merged[family] += value;
      }
    }
  }

  return merged;
}

function mergeOpeningPlan(
  baseline: DeckAwareOpeningPlan,
  override: DeckAwareOpeningPlanOverride | undefined,
): DeckAwareOpeningPlan {
  if (!override) {
    return baseline;
  }

  return {
    maxLateCardsToKeep: override.maxLateCardsToKeep ?? baseline.maxLateCardsToKeep,
    maxUninkablesToKeep: override.maxUninkablesToKeep ?? baseline.maxUninkablesToKeep,
    minEarlyPlayCount: override.minEarlyPlayCount ?? baseline.minEarlyPlayCount,
    minInkablesToKeep: override.minInkablesToKeep ?? baseline.minInkablesToKeep,
    openingFamilyBias: mergeOpeningFamilyBias(
      baseline.openingFamilyBias,
      override.openingFamilyBias,
    ),
    preferredTwoDropCount: override.preferredTwoDropCount ?? baseline.preferredTwoDropCount,
  };
}

function mergeRoleWeights(...weights: Array<RoleWeightMap | undefined>): RoleWeightMap {
  const merged: Partial<Record<AutomatedActionDeckRoleTag, number>> = {};

  for (const current of weights) {
    if (!current) {
      continue;
    }

    for (const [role, value] of Object.entries(current)) {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        continue;
      }

      const resolvedRole = role as AutomatedActionDeckRoleTag;
      merged[resolvedRole] = (merged[resolvedRole] ?? 0) + value;
    }
  }

  return merged;
}

function normalizeCardTextEntries(text: LorcanaCardDefinition["text"]): string[] {
  if (!text) {
    return [];
  }

  if (typeof text === "string") {
    return [text];
  }

  return text.flatMap((entry) =>
    [entry.title, entry.description].filter((value): value is string => typeof value === "string"),
  );
}

function definitionTextIncludes(definition: LorcanaCardDefinition, phrase: string): boolean {
  const normalizedPhrase = phrase.toLowerCase();
  const textEntries = normalizeCardTextEntries(definition.text);
  const abilityEntries =
    definition.abilities?.flatMap((ability) =>
      [ability.name, ability.text].filter((value): value is string => typeof value === "string"),
    ) ?? [];

  return [...textEntries, ...abilityEntries].some((entry) =>
    entry.toLowerCase().includes(normalizedPhrase),
  );
}

function inspectEffectSummary(node: EffectInspectionNode, summary: EffectSummary): void {
  switch (node.type) {
    case "additional-inkwell":
      summary.hasRamp = true;
      break;
    case "draw":
    case "draw-until-hand-size":
    case "scry":
      summary.drawsCards = true;
      break;
    case "banish":
    case "deal-damage":
    case "put-on-bottom":
    case "put-into-inkwell":
    case "restriction":
      summary.removesThreats = true;
      break;
    default:
      break;
  }

  const selector =
    typeof node.target === "object" &&
    node.target !== null &&
    "selector" in node.target &&
    typeof node.target.selector === "string"
      ? node.target.selector
      : typeof node.selector === "string"
        ? node.selector
        : undefined;
  const count =
    typeof node.target === "object" && node.target !== null && "count" in node.target
      ? node.target.count
      : node.count;
  const countObj = typeof count === "object" && count !== null ? count : null;
  const isMultiTarget =
    selector === "all" ||
    count === "all" ||
    (typeof count === "number" && count > 1) ||
    (countObj !== null &&
      "upTo" in countObj &&
      typeof countObj.upTo === "number" &&
      countObj.upTo > 1) ||
    (countObj !== null &&
      "max" in countObj &&
      typeof countObj.max === "number" &&
      countObj.max > 1);

  if (
    isMultiTarget &&
    (node.type === "banish" ||
      node.type === "deal-damage" ||
      node.type === "put-on-bottom" ||
      node.type === "restriction")
  ) {
    summary.hasMultiTargetRemoval = true;
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

  for (const nested of nestedEffects) {
    if (isEffectInspectionNode(nested)) {
      inspectEffectSummary(nested, summary);
    }
  }
}

function getDefinitionEffectSummary(definition: LorcanaCardDefinition): EffectSummary {
  const summary: EffectSummary = {
    drawsCards: false,
    hasMultiTargetRemoval: false,
    hasRamp: false,
    removesThreats: false,
  };

  for (const ability of definition.abilities ?? []) {
    if ("effect" in ability && ability.effect && isEffectInspectionNode(ability.effect)) {
      inspectEffectSummary(ability.effect, summary);
    }
  }

  return summary;
}

function resolveBaseRoles(definition: LorcanaCardDefinition): AutomatedActionDeckRoleTag[] {
  const roles = new Set<AutomatedActionDeckRoleTag>();
  const effectSummary = getDefinitionEffectSummary(definition);
  const lore = definition.lore ?? 0;

  if (
    (definition.cardType === "character" && definition.cost <= 2) ||
    (definition.cardType === "action" && definition.cost <= 3)
  ) {
    roles.add("earlyPlay");
  }

  if (definition.cost >= 5) {
    roles.add("latePlay");
  }

  if (lore >= 2 && definition.cardType === "character" && definition.cost <= 4) {
    roles.add("tempoThreat");
    roles.add("mustAnswerThreat");
  }

  if (definitionTextIncludes(definition, "evasive")) {
    roles.add("evasiveThreat");
    roles.add("mustAnswerThreat");
  }

  if (effectSummary.drawsCards) {
    roles.add("drawEngine");
  }

  if (effectSummary.hasRamp) {
    roles.add("ramp");
  }

  if (effectSummary.removesThreats) {
    roles.add("removal");
  }

  if (effectSummary.hasMultiTargetRemoval) {
    roles.add("sweeper");
  }

  if (
    roles.has("drawEngine") ||
    roles.has("ramp") ||
    roles.has("sweeper") ||
    (definition.cardType !== "action" && definition.cost >= 4)
  ) {
    roles.add("inkAvoid");
  }

  if (
    roles.has("earlyPlay") ||
    roles.has("ramp") ||
    roles.has("drawEngine") ||
    roles.has("tempoThreat")
  ) {
    roles.add("mulliganKeep");
  }

  return [...roles].sort();
}

function buildRoleList(definition: LorcanaCardDefinition): AutomatedActionDeckRoleTag[] {
  const override = CARD_OVERRIDES[definition.id];
  const mergedRoles = new Set<AutomatedActionDeckRoleTag>(resolveBaseRoles(definition));

  for (const role of override?.roles ?? []) {
    mergedRoles.add(role);
  }

  for (const [role, weight] of Object.entries(override?.roleAdjustments ?? {})) {
    if ((weight ?? 0) > 0) {
      mergedRoles.add(role as AutomatedActionDeckRoleTag);
    }
  }

  return [...mergedRoles].sort();
}

function buildDeckCurveProfile(
  cards: readonly AutomatedActionDeckCardProfile[],
): AutomatedActionDeckCurveProfile {
  return cards.reduce<AutomatedActionDeckCurveProfile>(
    (curve, card) => {
      if (card.cost <= 2) {
        curve.low += card.count;
      } else if (card.cost <= 4) {
        curve.mid += card.count;
      } else {
        curve.high += card.count;
      }

      return curve;
    },
    { high: 0, low: 0, mid: 0 },
  );
}

function buildDeckTypeProfile(
  cards: readonly AutomatedActionDeckCardProfile[],
): AutomatedActionDeckTypeProfile {
  return cards.reduce<AutomatedActionDeckTypeProfile>(
    (counts, card) => {
      counts[card.cardType] += card.count;
      return counts;
    },
    { action: 0, character: 0, item: 0, location: 0 },
  );
}

function resolveColorPairId(cards: readonly AutomatedActionDeckCardProfile[]): {
  colorPairId: string;
  colors: string[];
} {
  const colorCounts = new Map<string, number>();

  for (const card of cards) {
    for (const inkType of card.inkTypes) {
      colorCounts.set(inkType, (colorCounts.get(inkType) ?? 0) + card.count);
    }
  }

  const colors = [...colorCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 2)
    .map(([color]) => color)
    .sort((left, right) => left.localeCompare(right));

  return {
    colorPairId: colors.join("-"),
    colors,
  };
}

function resolveDerivedArchetype(args: {
  cards: readonly AutomatedActionDeckCardProfile[];
  colorPairId: string;
  curve: AutomatedActionDeckCurveProfile;
  roleCounts: Readonly<Partial<Record<AutomatedActionDeckRoleTag, number>>>;
}): AutomatedActionDeckArchetype {
  const configured = COLOR_PAIR_PROFILES[args.colorPairId];
  if (configured) {
    return configured.archetype;
  }

  const earlyPressure =
    (args.roleCounts.tempoThreat ?? 0) +
    (args.roleCounts.earlyPlay ?? 0) +
    (args.roleCounts.evasiveThreat ?? 0);
  const slowerTools =
    (args.roleCounts.drawEngine ?? 0) +
    (args.roleCounts.ramp ?? 0) +
    (args.roleCounts.sweeper ?? 0) +
    args.curve.high;

  if (earlyPressure >= slowerTools + 8) {
    return "aggressive";
  }

  if (slowerTools >= earlyPressure + 6) {
    return "control";
  }

  return "midrange";
}

function resolveDeckProfileSignature(cards: readonly AutomatedActionDeckCardProfile[]): string {
  return cards
    .map((card) => `${card.definitionId}:${card.count}`)
    .sort((left, right) => left.localeCompare(right))
    .join("|");
}

function buildDeckProfile(
  playerId: PlayerId,
  definitions: readonly LorcanaCardDefinition[],
): AutomatedActionDeckProfile | undefined {
  if (definitions.length === 0) {
    return undefined;
  }

  const countsByDefinitionId = new Map<string, number>();

  for (const definition of definitions) {
    countsByDefinitionId.set(definition.id, (countsByDefinitionId.get(definition.id) ?? 0) + 1);
  }

  const cards = [...countsByDefinitionId.entries()]
    .map(([definitionId, count]) => {
      const definition = definitions.find((entry) => entry.id === definitionId);
      if (!definition) {
        return undefined;
      }

      return {
        cardType: definition.cardType,
        cost: definition.cost,
        count,
        definitionId,
        fullName: definition.fullName ?? definition.name,
        inkable: definition.inkable,
        inkTypes: [...(definition.inkType ?? [])].sort() as string[],
        lore: definition.lore ?? 0,
        roles: buildRoleList(definition),
      } as AutomatedActionDeckCardProfile;
    })
    .filter((card): card is AutomatedActionDeckCardProfile => card !== undefined)
    .sort((left, right) => left.fullName.localeCompare(right.fullName));

  const { colorPairId, colors } = resolveColorPairId(cards);
  const curve = buildDeckCurveProfile(cards);
  const typeCounts = buildDeckTypeProfile(cards);
  const roleCounts = cards.reduce<Partial<Record<AutomatedActionDeckRoleTag, number>>>(
    (counts, card) => {
      for (const role of card.roles) {
        counts[role] = (counts[role] ?? 0) + card.count;
      }
      return counts;
    },
    {},
  );
  const archetype = resolveDerivedArchetype({
    cards,
    colorPairId,
    curve,
    roleCounts,
  });

  return {
    archetype,
    cards,
    colorPairId,
    colors,
    curve,
    inkableCount: cards.reduce((count, card) => count + (card.inkable ? card.count : 0), 0),
    playerId,
    roleCounts,
    signature: resolveDeckProfileSignature(cards),
    typeCounts,
    uninkableCount: cards.reduce((count, card) => count + (!card.inkable ? card.count : 0), 0),
  };
}

function resolveProjectedPlayerIds(board: LorcanaProjectedBoardView): PlayerId[] {
  if (board.playerOrder.length > 0) {
    return [...board.playerOrder] as PlayerId[];
  }

  return Object.keys(board.players).sort() as PlayerId[];
}

function resolveTurnBucket(
  board: LorcanaProjectedBoardView,
  actorId: PlayerId,
): AutomatedActionTurnBucket {
  const actorInk = board.players[actorId]?.inkwell.length ?? 0;
  const turnHeuristic = Math.max(board.turnNumber, actorInk);

  if (turnHeuristic <= 3) {
    return "opening";
  }

  if (turnHeuristic <= 6) {
    return "mid";
  }

  return "late";
}

function buildDefinitionLookups(
  staticResources: MatchStaticResources,
  board: LorcanaProjectedBoardView,
): {
  getCardDefinition(cardId: CardInstanceId): LorcanaCardDefinition | undefined;
  getCardRoles(cardId: CardInstanceId): readonly AutomatedActionDeckRoleTag[];
  getDefinitionRoles(definitionId: string): readonly AutomatedActionDeckRoleTag[];
} {
  const definitionCache = new Map<string, LorcanaCardDefinition | undefined>();
  const roleCache = new Map<string, readonly AutomatedActionDeckRoleTag[]>();

  const getDefinitionById = (definitionId: string): LorcanaCardDefinition | undefined => {
    if (!definitionCache.has(definitionId)) {
      definitionCache.set(
        definitionId,
        staticResources.cards.get(definitionId) as LorcanaCardDefinition | undefined,
      );
    }

    return definitionCache.get(definitionId);
  };

  const getCardDefinition = (cardId: CardInstanceId): LorcanaCardDefinition | undefined => {
    const projectedDefinitionId = board.cards[String(cardId)]?.definitionId;
    const staticDefinitionId = staticResources.instances.get(String(cardId))?.definitionId;
    const definitionId = projectedDefinitionId ?? staticDefinitionId;

    return definitionId ? getDefinitionById(definitionId) : undefined;
  };

  const getDefinitionRoles = (definitionId: string): readonly AutomatedActionDeckRoleTag[] => {
    if (!roleCache.has(definitionId)) {
      const definition = getDefinitionById(definitionId);
      roleCache.set(definitionId, definition ? buildRoleList(definition) : []);
    }

    return roleCache.get(definitionId) ?? [];
  };

  const getCardRoles = (cardId: CardInstanceId): readonly AutomatedActionDeckRoleTag[] => {
    const definition = getCardDefinition(cardId);
    return definition ? getDefinitionRoles(definition.id) : [];
  };

  return {
    getCardDefinition,
    getCardRoles,
    getDefinitionRoles,
  };
}

function buildSourceLookups(args: {
  authoritativeHints?: AutomatedActionAuthoritativeHints;
  board: LorcanaProjectedBoardView;
  getCardDefinition(cardId: CardInstanceId): LorcanaCardDefinition | undefined;
  getCardRoles(cardId: CardInstanceId): readonly AutomatedActionDeckRoleTag[];
  getDefinitionRoles(definitionId: string): readonly AutomatedActionDeckRoleTag[];
}): Pick<
  AutomatedActionDeckPlanningMetadata,
  | "resolveCandidateSourceCardId"
  | "resolveCandidateSourceDefinitionId"
  | "resolveCandidateEffect"
  | "resolveCandidateSourceRoles"
> {
  const bagSourceById = new Map<string, CardInstanceId>();
  const effectSourceById = new Map<string, CardInstanceId>();
  const bagEffectById = new Map<string, Effect>();
  const pendingEffectById = new Map<string, Effect>();

  for (const bagItem of args.authoritativeHints?.bagItems ?? []) {
    bagSourceById.set(bagItem.id, bagItem.sourceId);
    if (bagItem.effect) {
      bagEffectById.set(bagItem.id, bagItem.effect as Effect);
    }
  }

  for (const effect of args.authoritativeHints?.pendingEffects ?? []) {
    effectSourceById.set(effect.id, effect.sourceCardId ?? effect.sourceId);
    if (effect.effect) {
      pendingEffectById.set(effect.id, effect.effect as Effect);
    }
  }

  for (const bagEffect of args.board.bagEffects) {
    if (typeof bagEffect.sourceId === "string") {
      bagSourceById.set(bagEffect.id, bagEffect.sourceId as CardInstanceId);
    }
    if (
      bagEffect.payload &&
      typeof bagEffect.payload === "object" &&
      "effect" in bagEffect.payload
    ) {
      bagEffectById.set(bagEffect.id, bagEffect.payload.effect as Effect);
    }
  }

  for (const pendingEffect of args.board.pendingEffects) {
    if (typeof pendingEffect.sourceId === "string") {
      effectSourceById.set(pendingEffect.id, pendingEffect.sourceId as CardInstanceId);
    }
    const payload = pendingEffect.payload;
    if (payload && typeof payload === "object" && "effect" in payload) {
      pendingEffectById.set(pendingEffect.id, (payload as { effect: Effect }).effect);
    }
  }

  const resolveCandidateSourceCardId = (
    candidate: AutomatedActionCandidate,
  ): CardInstanceId | undefined => {
    switch (candidate.family) {
      case "activateAbility":
      case "playCard":
      case "putCardIntoInkwell":
      case "quest":
        return candidate.cardId;
      case "challenge":
        return candidate.attackerId;
      case "moveCharacterToLocation":
        return candidate.characterId;
      case "resolveBag":
        return bagSourceById.get(candidate.bagId);
      case "resolveEffect":
        return effectSourceById.get(candidate.effectId);
      default:
        return undefined;
    }
  };

  const resolveCandidateSourceDefinitionId = (
    candidate: AutomatedActionCandidate,
  ): string | undefined => {
    const sourceCardId = resolveCandidateSourceCardId(candidate);

    return sourceCardId ? args.getCardDefinition(sourceCardId)?.id : undefined;
  };

  const resolveCandidateSourceRoles = (
    candidate: AutomatedActionCandidate,
  ): readonly AutomatedActionDeckRoleTag[] => {
    const sourceCardId = resolveCandidateSourceCardId(candidate);
    if (sourceCardId) {
      return args.getCardRoles(sourceCardId);
    }

    const definitionId = resolveCandidateSourceDefinitionId(candidate);
    return definitionId ? args.getDefinitionRoles(definitionId) : [];
  };

  const resolveCandidateEffect = (candidate: AutomatedActionCandidate): Effect | undefined => {
    switch (candidate.family) {
      case "resolveBag":
        return bagEffectById.get(candidate.bagId);
      case "resolveEffect":
        return pendingEffectById.get(candidate.effectId);
      default:
        return undefined;
    }
  };

  return {
    resolveCandidateSourceCardId,
    resolveCandidateSourceDefinitionId,
    resolveCandidateEffect,
    resolveCandidateSourceRoles,
  };
}

function collectPublicDefinitionsForPlayer(args: {
  board: LorcanaProjectedBoardView;
  getCardDefinition(cardId: CardInstanceId): LorcanaCardDefinition | undefined;
  playerId: PlayerId;
}): LorcanaCardDefinition[] {
  const playerBoard = args.board.players[args.playerId];
  if (!playerBoard) {
    return [];
  }

  return [...playerBoard.play, ...playerBoard.discard]
    .map((cardId) => args.getCardDefinition(String(cardId) as CardInstanceId))
    .filter((definition): definition is LorcanaCardDefinition => definition !== undefined);
}

export function getAutomatedActionCardOverride(
  definitionId: string,
): DeckAwareCardOverride | undefined {
  return CARD_OVERRIDES[definitionId];
}

export function getAutomatedActionCardTargetPreference(
  definitionId: string,
): AutomatedActionCardTargetPreference | undefined {
  return CARD_OVERRIDES[definitionId]?.targetPreference;
}

export function getAutomatedActionCardMatchupAdjustment(
  definitionId: string,
  matchupPairId: string | undefined,
): DeckAwareCardOpeningMatchupAdjustment | undefined {
  if (!matchupPairId) {
    return undefined;
  }

  return CARD_OVERRIDES[definitionId]?.matchupAdjustments?.[matchupPairId];
}

export function getAutomatedActionColorPairProfile(colorPairId: string): DeckAwareColorPairProfile {
  return COLOR_PAIR_PROFILES[colorPairId] ?? DEFAULT_COLOR_PAIR_PROFILE;
}

export function getAutomatedActionMatchupModifier(
  actorColorPairId: string,
  opponentColorPairId: string,
): DeckAwareMatchupModifier | undefined {
  return MATCHUP_MODIFIERS[`${actorColorPairId}__vs__${opponentColorPairId}`];
}

export function getAutomatedActionOpeningPlan(
  colorPairId: string,
  opponentColorPairId: string | undefined,
): DeckAwareOpeningPlan {
  const profile = getAutomatedActionColorPairProfile(colorPairId);
  const modifier = opponentColorPairId
    ? getAutomatedActionMatchupModifier(colorPairId, opponentColorPairId)
    : undefined;

  return mergeOpeningPlan(profile.openingPlan, modifier?.openingPlan);
}

export function getAutomatedActionRoleWeights(
  colorPairId: string,
  opponentColorPairId: string | undefined,
  turnBucket: AutomatedActionTurnBucket,
): RoleWeightMap {
  const profile = getAutomatedActionColorPairProfile(colorPairId);
  const modifier = opponentColorPairId
    ? getAutomatedActionMatchupModifier(colorPairId, opponentColorPairId)
    : undefined;

  return mergeRoleWeights(
    profile.roleWeightsByTurnBucket[turnBucket],
    modifier?.roleWeightsByTurnBucket?.[turnBucket],
  );
}

export function getAutomatedActionMulliganWeights(
  colorPairId: string,
  opponentColorPairId: string | undefined,
): RoleWeightMap {
  const profile = getAutomatedActionColorPairProfile(colorPairId);
  const modifier = opponentColorPairId
    ? getAutomatedActionMatchupModifier(colorPairId, opponentColorPairId)
    : undefined;

  return mergeRoleWeights(profile.mulliganRoleWeights, modifier?.mulliganRoleWeights);
}

export function getAutomatedActionInkWeights(
  colorPairId: string,
  opponentColorPairId: string | undefined,
): RoleWeightMap {
  const profile = getAutomatedActionColorPairProfile(colorPairId);
  const modifier = opponentColorPairId
    ? getAutomatedActionMatchupModifier(colorPairId, opponentColorPairId)
    : undefined;

  return mergeRoleWeights(profile.inkRoleWeights, modifier?.inkRoleWeights);
}

export function buildAutomatedActionDeckPlanningMetadata(args: {
  actorId: PlayerId;
  authoritativeHints?: AutomatedActionAuthoritativeHints;
  board: LorcanaProjectedBoardView;
  informationPolicy?: StrategyInformationPolicy;
  staticResources: MatchStaticResources;
}): AutomatedActionDeckPlanningMetadata {
  const { actorId, authoritativeHints, board, staticResources } = args;
  const informationPolicy = args.informationPolicy ?? "oracle";
  const playerIds = resolveProjectedPlayerIds(board);
  const definitionLookups = buildDefinitionLookups(staticResources, board);
  const fullDefinitionsByPlayer = playerIds.reduce<
    Partial<Record<PlayerId, LorcanaCardDefinition[]>>
  >((accumulator, playerId) => {
    accumulator[playerId] = [];
    return accumulator;
  }, {});

  if (typeof staticResources.instances.entries === "function") {
    for (const record of staticResources.instances.entries()) {
      const ownerId = playerIds.find((playerId) => playerId === record.ownerID);
      if (!ownerId) {
        continue;
      }

      const definition = staticResources.cards.get(record.definitionId) as
        | LorcanaCardDefinition
        | undefined;
      if (!definition) {
        continue;
      }

      (fullDefinitionsByPlayer[ownerId] ||= []).push(definition);
    }
  }

  const definitionsByPlayer = playerIds.reduce<Partial<Record<PlayerId, LorcanaCardDefinition[]>>>(
    (accumulator, playerId) => {
      accumulator[playerId] =
        playerId === actorId || informationPolicy === "oracle"
          ? [...(fullDefinitionsByPlayer[playerId] ?? [])]
          : collectPublicDefinitionsForPlayer({
              board,
              getCardDefinition: definitionLookups.getCardDefinition,
              playerId,
            });
      return accumulator;
    },
    {},
  );
  const deckProfilesByPlayer = playerIds.reduce<
    Partial<Record<PlayerId, AutomatedActionDeckProfile>>
  >((accumulator, playerId) => {
    const deckProfile = buildDeckProfile(playerId, definitionsByPlayer[playerId] ?? []);
    if (deckProfile) {
      accumulator[playerId] = deckProfile;
    }
    return accumulator;
  }, {});
  const opponentId = playerIds.find((playerId) => playerId !== actorId);
  const actorDeckProfile = deckProfilesByPlayer[actorId];
  const opponentDeckProfile = opponentId ? deckProfilesByPlayer[opponentId] : undefined;
  const opponentKnowledgeSource: AutomatedActionOpponentKnowledgeSource = opponentDeckProfile
    ? informationPolicy === "oracle"
      ? "full-deck"
      : "public-zones"
    : "none";
  const matchupProfile =
    actorDeckProfile && opponentDeckProfile
      ? {
          actorArchetype: actorDeckProfile.archetype,
          actorColorPairId: actorDeckProfile.colorPairId,
          opponentArchetype: opponentDeckProfile.archetype,
          opponentColorPairId: opponentDeckProfile.colorPairId,
          pairId: `${actorDeckProfile.colorPairId}__vs__${opponentDeckProfile.colorPairId}`,
        }
      : undefined;
  const sourceLookups = buildSourceLookups({
    authoritativeHints,
    board,
    ...definitionLookups,
  });

  return {
    actorDeckProfile,
    deckProfilesByPlayer,
    informationPolicy,
    matchupProfile,
    opponentKnowledgeSource,
    opponentDeckProfile,
    opponentId,
    turnBucket: resolveTurnBucket(board, actorId),
    ...definitionLookups,
    ...sourceLookups,
  };
}
