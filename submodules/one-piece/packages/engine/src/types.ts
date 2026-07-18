import type { Patch } from "immer";
import type { Action, Duration, EffectTrigger, Keyword } from "@tcg/op-types";

export type MatchSeat = "north" | "south";
export type Viewer = MatchSeat | "judge" | "spectator";
export type MatchStatus = "setup" | "active" | "finished";
export type MatchPhase = "setup" | "refresh" | "draw" | "don" | "main" | "end" | "finished";
export type CardZone =
  | "leader"
  | "deck"
  | "hand"
  | "life"
  | "character"
  | "stage"
  | "trash"
  | "resolution";
export type JoKenPoChoice = "rock" | "paper" | "scissors";
export type PromptKind = "choice" | "judge";
export type ChoiceKind =
  | "selectTargets"
  | "selectCards"
  | "orderCards"
  | "confirm"
  | "costPayment"
  | "chooseOption";
export type EngineActor = MatchSeat | "judge" | "system";
export type LogVisibility = "public" | "private" | "judge";
export type ResolutionStatus = "idle" | "running" | "waitingForPrompt";

export interface ReturnToDeckOwnerGroup {
  owner: MatchSeat;
  targetIds: string[];
}

export interface ReturnToDeckContinuation {
  owner: MatchSeat;
  allTargetIds: string[];
  publicTargetIds: string[];
  orderedTargetIds: string[];
  remainingOwnerGroups: ReturnToDeckOwnerGroup[];
  orderResolved: boolean;
  finalizeOwnerGroup: boolean;
}

export interface EffectBlockContinuation {
  sourceInstanceId: string;
  controller: MatchSeat;
  trigger: EffectTrigger;
  blockIndex: number;
  trashHandIds?: string[];
  costPaymentIds?: string[];
  costPaymentIdsByType?: {
    restCards?: string[];
    returnCharacter?: string[];
  };
  costsPaid?: boolean;
  confirmed?: boolean;
  triggerEvent?: {
    instanceId: string;
    instanceController?: MatchSeat;
    effectController: MatchSeat;
    koCause?: "battle" | "effect";
    attachedDon?: number;
    targetInstanceId?: string;
    amount?: number;
    sourceInstanceId?: string;
    sourceFromZone?: CardZone;
    toZone?: CardZone;
  };
}

export interface MatchPlayerConfig {
  leaderCardId: string;
  mainDeck: string[];
  playerName?: string;
  donDeckCount?: number;
}

export interface MatchConfig {
  firstPlayer: MatchSeat;
  players: Record<MatchSeat, MatchPlayerConfig>;
  judgeFallback?: boolean;
  seed?: number | string;
  shuffleDecks?: boolean;
  skipFirstTurnDraw?: boolean;
  openingHandSize?: number;
  maxCharacterSlots?: number;
}

export interface CardInstance {
  instanceId: string;
  cardId: string;
  owner: MatchSeat;
  controller: MatchSeat;
  zone: CardZone;
  zoneIndex: number;
  zoneChangeCounter: number;
  rested: boolean;
  attachedDon: number;
  playedOnTurn: number | null;
  faceUp: boolean;
  publicKnowledge: boolean;
  usedEffectKeys: string[];
  battledOpponentCharacterOnTurn: number | null;
}

export interface ModifierState {
  id: string;
  sourceInstanceId: string | null;
  targetId: string;
  type: "power" | "cost" | "keyword" | "flag" | "attackRestriction";
  value?: number;
  keyword?: Keyword;
  flag?:
    | "cannotAttack"
    | "attackHandTrashCost"
    | "cannotBeKO"
    | "cannotBeRemoved"
    | "cannotAddLifeToHandByOwnEffect"
    | "cannotActivate"
    | "canAttackActive"
    | "cannotBeRested"
    | "freeze"
    | "freezeDon"
    | "battleKoReplacement"
    | "effectsNegated"
    | "cannotPlay"
    | "cannotDrawByOwnEffects"
    | "cannotSetDonActiveByCharacterEffects";
  negatedEffectTypes?: EffectTrigger[];
  playerScope?: boolean;
  koRestriction?: "inBattle" | "byEffect";
  koByPlayer?: "self" | "opponent";
  koByFilters?: import("@tcg/op-types").TargetFilter[];
  duration: Duration | "unsupported";
  expiresAtTurn: number | null;
  createdBySeat?: MatchSeat;
  expiresAtBattleId: string | null;
  expiresOnTurnStartOfSeat: MatchSeat | null;
  consumeOnPlay?: boolean;
  attackRestriction?: "mustAttack" | "cannotAttack" | "cannotAttackOtherThan";
  attackTargetFilters?: import("@tcg/op-types").TargetFilter[];
  playRestrictionFilters?: import("@tcg/op-types").TargetFilter[];
  playRestrictionSourceZones?: CardZone[];
}

export interface PromptOption {
  id: string;
  label: string;
  value: string;
  targetId?: string;
  enabled?: boolean;
}

export type PromptResolutionContext =
  | {
      intent: "battleAttackHandTrashCost";
      attackerId: string;
      targetId: string;
      controller: MatchSeat;
      amount: number;
      candidateIds: string[];
    }
  | {
      intent: "battleBlocker";
      battleId: string;
    }
  | {
      intent: "battleCounter";
      battleId: string;
    }
  | {
      intent: "battleKoReplacement";
      battleId: string;
      targetId: string;
      controller: MatchSeat;
      candidateIds: string[];
      sourceInstanceId?: string;
      replacementEffectIndex?: number;
      replacementEvent?: "ko" | "leaveField" | "loseGame" | "removeFromField" | "rested";
      replacementAction?: Action;
    }
  | {
      intent: "lifeTrigger";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: "trigger";
      damageKind: "battle";
      battleId: string;
      resume: "continueDamage" | "completeBattle";
    }
  | {
      intent: "lifeTrigger";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: "trigger";
      damageKind: "effect";
      damageSourceInstanceId: string;
      damageController: MatchSeat;
      damageTargetSeat: MatchSeat;
      damageRemaining: number;
    }
  | {
      intent: "effectOptional";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      trashHandIds?: string[];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
        targetInstanceId?: string;
        amount?: number;
        sourceInstanceId?: string;
      };
    }
  | {
      intent: "effectActionOptional";
      sourceInstanceId: string;
      controller: MatchSeat;
      actions: Action[];
      previousActionTargetIds?: string[];
    }
  | {
      intent: "effectActionChoice";
      sourceInstanceId: string;
      controller: MatchSeat;
      options: Action[][];
      previousActionTargetIds?: string[];
    }
  | {
      intent: "effectKoReplacement";
      targetId: string;
      controller: MatchSeat;
      replacementSourceInstanceId: string;
      replacementEffectIndex: number;
      replacementEvent: "ko" | "removeFromField";
      replacementAction: Action;
      koSourceInstanceId: string;
      koController: MatchSeat;
      replacementTargetIds: string[];
      remainingTargetIds: string[];
    }
  | {
      intent: "effectRestReplacement";
      targetId: string;
      controller: MatchSeat;
      replacementSourceInstanceId: string;
      replacementEffectIndex: number;
      replacementAction: Action;
      restSourceInstanceId: string;
      restController: MatchSeat;
      restAction: Extract<Action, { action: "rest" }>;
      remainingTargetIds: string[];
    }
  | {
      intent: "effectRemovalReplacement";
      targetId: string;
      controller: MatchSeat;
      replacementSourceInstanceId: string;
      replacementEffectIndex: number;
      replacementEvent: "removeFromField" | "leaveField";
      replacementAction: Action;
      removalSourceInstanceId: string;
      removalController: MatchSeat;
      removalAction: Extract<
        Action,
        { action: "returnToHand" | "returnToDeck" | "trashFromField" }
      >;
      remainingTargetIds: string[];
      returnToDeckContinuation?: ReturnToDeckContinuation;
      returnCharacterCostContinuation?: EffectBlockContinuation;
    }
  | {
      intent: "effectGuessTopDeckCost";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "guessTopDeckCost" }>;
      revealedInstanceId: string;
      owner: MatchSeat;
    }
  | {
      intent: "effectRestDonCount";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "rest" }>;
      targetSeat: MatchSeat;
      maximum: number;
    }
  | {
      intent: "effectMixedRestSelection";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "rest" }>;
      candidateIds: string[];
      requested: number;
    }
  | {
      intent: "effectRestDonForPowerCount";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "restDonForPower" }>;
      maximum: number;
    }
  | {
      intent: "effectCostTrashFromHand";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      amount: number;
      cost: Extract<import("@tcg/op-types").Cost, { cost: "trashFromHand" }>;
      candidateIds: string[];
      costPaymentIds?: string[];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
        targetInstanceId?: string;
        amount?: number;
        sourceInstanceId?: string;
        sourceFromZone?: CardZone;
        toZone?: CardZone;
      };
    }
  | {
      intent: "effectCostPlayCard" | "effectCostTrashCard";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      amount: number;
      candidateIds: string[];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
        targetInstanceId?: string;
        amount?: number;
        sourceInstanceId?: string;
        sourceFromZone?: CardZone;
        toZone?: CardZone;
      };
    }
  | {
      intent: "effectCostReturnDon";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      amount: number;
      candidateIds: string[];
      trashHandIds?: string[];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
      };
    }
  | {
      intent: "effectCostReturnCharacterToDeck";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      amount: number;
      candidateIds: string[];
      trashHandIds?: string[];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
      };
    }
  | {
      intent: "effectCostReturnCharacter";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      amount: number;
      candidateIds: string[];
      costPaymentIdsByType?: EffectBlockContinuation["costPaymentIdsByType"];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
      };
    }
  | {
      intent: "effectCostTrashLife";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
      };
    }
  | {
      intent: "effectCostAddLifeToHand";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
      };
    }
  | {
      intent: "effectCostReturnHandToDeck";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      amount: number;
      candidateIds: string[];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
      };
    }
  | {
      intent: "effectCostReturnTrashToDeck";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      amount: number;
      candidateIds: string[];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
      };
    }
  | {
      intent: "effectCostReturnThisAndHandToDeck";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      handAmount: number;
      candidateIds: string[];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
      };
    }
  | {
      intent: "effectCostRestCards";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      amount: number;
      candidateIds: string[];
      costPaymentIdsByType?: EffectBlockContinuation["costPaymentIdsByType"];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
      };
    }
  | {
      intent: "effectCostKoCharacter";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      amount: number;
      candidateIds: string[];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
      };
    }
  | {
      intent: "effectCostTrashCharacter";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      amount: number;
      candidateIds: string[];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
      };
    }
  | {
      intent: "effectCostRevealFromHand";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      amount: number;
      candidateIds: string[];
      triggerEvent?: {
        instanceId: string;
        effectController: MatchSeat;
      };
    }
  | {
      intent: "effectTargetSelection";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Action;
      previousActionTargetIds?: string[];
      opaqueCandidateIds?: Record<string, string>;
    }
  | {
      intent: "effectTrashFromHandSelection";
      sourceInstanceId: string;
      controller: MatchSeat;
      seat: MatchSeat;
      action: Extract<Action, { action: "trashFromHand" }>;
      candidateIds: string[];
      opaqueCandidateIds?: Record<string, string>;
    }
  | {
      intent: "effectRevealFromHandSelection";
      sourceInstanceId: string;
      controller: MatchSeat;
      seat: MatchSeat;
      action: Extract<Action, { action: "revealFromHand" }>;
      candidateIds: string[];
      opaqueCandidateIds?: Record<string, string>;
    }
  | {
      intent: "effectPlaySelection";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "play" }>;
      candidateIds: string[];
      previousActionTargetIds?: string[];
    }
  | {
      intent: "effectGroupedPlaySelection";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "playGrouped" }>;
      candidateIds: string[];
      previousActionTargetIds?: string[];
    }
  | {
      intent: "effectGroupedPlayStateAssignment";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "playGrouped" }>;
      selectedIds: string[];
    }
  | {
      intent: "effectGroupedPlayOnPlayOrder";
      sourceInstanceId: string;
      controller: MatchSeat;
      playedCards: Array<{
        instanceId: string;
        zoneChangeCounter: number;
      }>;
    }
  | {
      intent: "effectSearchSelection";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "search" }>;
      lookedIds: string[];
      eligibleIds: string[];
    }
  | {
      intent: "effectSearchRemainderOrder";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "search" }>;
      remainderIds: string[];
    }
  | {
      intent: "effectReturnToDeckOwnerOrder";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "returnToDeck" }>;
      targetIds: string[];
      continuation: ReturnToDeckContinuation;
    }
  | {
      intent: "effectSearchRemainderPosition";
      sourceInstanceId: string;
      controller: MatchSeat;
      orderedIds: string[];
    }
  | {
      intent: "effectRearrangeDeckTrashSelection";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "rearrangeDeck" }>;
      lookedIds: string[];
    }
  | {
      intent: "effectRearrangeDeckOrder";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "rearrangeDeck" }>;
      lookedIds: string[];
    }
  | {
      intent: "effectRearrangeDeckPosition";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "rearrangeDeck" }>;
      lookedIds: string[];
      orderedIds: string[];
    }
  | {
      intent: "effectRearrangeLifeOrder";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "rearrangeLife" }>;
      lookedIds: string[];
    }
  | {
      intent: "effectRedistributeDonSource";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "redistributeDon" }>;
      candidateIds: string[];
      tokenized: boolean;
    }
  | {
      intent: "effectRedistributeDonTarget";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "redistributeDon" }>;
      donorInstanceIds: string[];
      candidateIds: string[];
    }
  | {
      intent: "effectSetActiveDon";
      sourceInstanceId: string;
      controller: MatchSeat;
      maximum: number;
    }
  | {
      intent: "effectDeckPosition";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "returnToDeck" }>;
      selectedTargetIds: string[];
      returnToDeckContinuation?: ReturnToDeckContinuation;
    }
  | {
      intent: "effectReturnToDeckOrder";
      sourceInstanceId: string;
      controller: MatchSeat;
      owner: MatchSeat;
      action: Extract<Action, { action: "returnToDeck" }>;
      targetIds: string[];
      previousActionTargetIds?: string[];
    }
  | {
      intent: "effectLifePosition";
      sourceInstanceId: string;
      controller: MatchSeat;
      action:
        | Extract<Action, { action: "addToLife" }>
        | Extract<Action, { action: "removeFromLife" }>;
      selectedTargetIds?: string[];
    }
  | {
      intent: "effectLookAtLifeOwner";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "lookAtLife" }>;
      availableSeats: MatchSeat[];
    }
  | {
      intent: "effectLookAtLifePosition";
      sourceInstanceId: string;
      controller: MatchSeat;
      owner: MatchSeat;
      lookedInstanceId: string;
    }
  | {
      intent: "effectRevealFromLifePlay";
      sourceInstanceId: string;
      controller: MatchSeat;
      owner: MatchSeat;
      action: Extract<Action, { action: "revealFromLife" }>;
      revealedInstanceId: string;
    }
  | {
      intent: "effectRevealedDeckPosition";
      sourceInstanceId: string;
      controller: MatchSeat;
      revealedInstanceId: string;
      owner: MatchSeat;
    }
  | {
      intent: "effectAddDon";
      sourceInstanceId: string;
      controller: MatchSeat;
      maximum: number;
      rested: boolean;
    }
  | {
      intent: "effectAddToLifeFromDeck";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "addToLife" }>;
      maximum: number;
    }
  | {
      intent: "effectDrawCount";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "draw" }>;
      maximum: number;
    }
  | {
      intent: "effectOpponentReturnDon";
      sourceInstanceId: string;
      controller: MatchSeat;
      returningSeat: MatchSeat;
      amount: number;
      candidateIds: string[];
    }
  | {
      intent: "effectReturnDon";
      sourceInstanceId: string;
      controller: MatchSeat;
      returningSeat: MatchSeat;
      amount: number;
      candidateIds: string[];
      action: Extract<Action, { action: "returnDon" }>;
    }
  | {
      intent: "effectTrashFromDeckCount";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "trashFromDeck" }>;
      maximum: number;
    }
  | {
      intent: "effectRemoveFromLifeCount";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "removeFromLife" }>;
      maximum: number;
    }
  | {
      intent: "effectRemoveFromLifeSelection";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "removeFromLife" }>;
      candidateIds: string[];
      opaqueCandidateIds?: Record<string, string>;
      minimum: number;
      maximum: number;
    }
  | {
      intent: "effectGiveDonCount";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Extract<Action, { action: "giveDon" }>;
      maximum: number;
    }
  | {
      intent: "judge";
      issueId?: string | null;
    };

export interface PromptState {
  id: string;
  kind: PromptKind;
  choiceKind: ChoiceKind | null;
  seat: MatchSeat | "judge";
  label: string;
  details: string;
  sourceCardId: string | null;
  sourceInstanceId: string | null;
  eventId: string | null;
  status: "pending" | "resolved" | "cancelled";
  options: PromptOption[];
  minSelections: number;
  maxSelections: number;
  context: Record<string, string | number | boolean | string[] | null>;
  resolutionContext: PromptResolutionContext | null;
}

export interface BattleState {
  id: string;
  attackerId: string;
  originalTargetId: string;
  targetId: string;
  defendingSeat: MatchSeat;
  step: "declare" | "block" | "counter" | "damage" | "complete";
  blockerId: string | null;
  counterCardIds: string[];
  counterTotal: number;
  attackPower: number;
  defensePower: number;
  damageRemaining: number | null;
  result: "pending" | "hit" | "ko" | "blocked" | "no_damage";
  completionQueued?: boolean;
}

export interface SetupState {
  started: boolean;
  joKenPo: {
    round: number;
    pendingSeats: MatchSeat[];
    hiddenChoices: Partial<Record<MatchSeat, JoKenPoChoice>>;
    choices: Partial<Record<MatchSeat, JoKenPoChoice>>;
    winner: MatchSeat | null;
    firstPlayerDecided: boolean;
  };
  mulliganUsed: Record<MatchSeat, boolean>;
  mulliganDecided: Record<MatchSeat, boolean>;
}

export interface EngineCapabilityIssue {
  id: string;
  sequence: number;
  turn: number;
  phase: MatchPhase;
  kind:
    | "unsupportedAction"
    | "unsupportedCondition"
    | "unsupportedTarget"
    | "unsupportedCost"
    | "unsupportedTiming"
    | "invariantViolation";
  code: string;
  actor: EngineActor;
  sourceCardId: string | null;
  sourceInstanceId: string | null;
  eventId: string | null;
  details: string;
}

export type ResolutionItem =
  | {
      id: string;
      kind: "beginTurn";
      seat: MatchSeat;
      skipDraw: boolean;
    }
  | {
      id: string;
      kind: "beginTurnRefreshFinalize";
      seat: MatchSeat;
      skipDraw: boolean;
    }
  | {
      id: string;
      kind: "endTurnFinalize";
      seat: MatchSeat;
    }
  | {
      id: string;
      kind: "effectBlock";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      sourceZoneChangeCounter?: number;
      trashHandIds?: string[];
      costPaymentIds?: string[];
      costPaymentIdsByType?: EffectBlockContinuation["costPaymentIdsByType"];
      costsPaid?: boolean;
      confirmed?: boolean;
      triggerEvent?: {
        instanceId: string;
        instanceController?: MatchSeat;
        effectController: MatchSeat;
        koCause?: "battle" | "effect";
        attachedDon?: number;
        targetInstanceId?: string;
        amount?: number;
        sourceInstanceId?: string;
        sourceFromZone?: CardZone;
        toZone?: CardZone;
      };
    }
  | {
      id: string;
      kind: "effectAction";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Action;
      selectedTargetIds?: string[];
      previousActionTargetIds?: string[];
      skipRemovalReplacementIds?: string[];
      returnToDeckContinuation?: ReturnToDeckContinuation;
    }
  | {
      id: string;
      kind: "finalizeRevealedDeckCard";
      sourceInstanceId: string;
      controller: MatchSeat;
      revealedInstanceId: string;
      owner: MatchSeat;
      position: "top" | "bottom" | "choice";
    }
  | {
      id: string;
      kind: "battleBlockStep";
      battleId: string;
    }
  | {
      id: string;
      kind: "battleCounterStep";
      battleId: string;
    }
  | {
      id: string;
      kind: "battleFinalize";
      battleId: string;
    }
  | {
      id: string;
      kind: "battleDamageContinue";
      battleId: string;
    }
  | {
      id: string;
      kind: "battleLifeTriggerPrompt";
      battleId: string;
      lifeCardId: string;
    }
  | {
      id: string;
      kind: "battleDamageComplete";
      battleId: string;
    }
  | {
      id: string;
      kind: "battleEndEffects";
      battleId: string;
      attackerId: string;
      attackerController: MatchSeat;
      targetId: string;
    }
  | {
      id: string;
      kind: "battleCleanupFinalize";
      battleId: string;
    }
  | {
      id: string;
      kind: "effectDamageContinue";
      sourceInstanceId: string;
      controller: MatchSeat;
      targetSeat: MatchSeat;
      remaining: number;
    };

export interface PlayerState {
  seat: MatchSeat;
  playerName: string;
  leaderCardId: string;
  leaderInstanceId: string;
  deck: string[];
  hand: string[];
  life: string[];
  trash: string[];
  characterArea: Array<string | null>;
  stageArea: string | null;
  activeDon: number;
  restedDon: number;
  donDeckCount: number;
}

export interface EngineEvent {
  id: string;
  sequence: number;
  turn: number;
  phase: MatchPhase;
  type:
    | "commandAccepted"
    | "commandRejected"
    | "matchCreated"
    | "mulligan"
    | "gameStarted"
    | "phaseChanged"
    | "cardPlayed"
    | "cardMoved"
    | "donAttached"
    | "attackDeclared"
    | "promptCreated"
    | "promptResolved"
    | "resolutionQueued"
    | "battleResolved"
    | "effectResolved"
    | "capabilityIssue"
    | "judgeAction"
    | "winnerDeclared";
  actor: EngineActor;
  sourceCardId: string | null;
  sourceInstanceId: string | null;
  targetIds: string[];
  eventId: string | null;
  visibility: LogVisibility;
  payload: Record<string, string | number | boolean | string[] | null>;
}

export type EngineAnimationData =
  | {
      kind: "cardMove";
      cardId: string;
      fromZone: CardZone;
      toZone: CardZone;
      fromOwner: MatchSeat;
      toOwner: MatchSeat;
    }
  | {
      kind: "attack";
      attackerId: string;
      targetId: string;
    }
  | {
      kind: "effect";
      sourceInstanceId: string;
      targetIds: readonly string[];
      label: "RESOLVED";
    }
  | {
      kind: "generic";
      name: string;
      params: Record<string, string | number | boolean | null | readonly string[]>;
    };

export interface EngineAnimation {
  id: string;
  type: string;
  duration: number;
  data: EngineAnimationData;
  after?: string;
  group?: string;
}

export interface GameLogEntry {
  id: string;
  turn: number;
  phase: MatchPhase;
  sequence: number;
  actor: EngineActor;
  sourceCardId: string | null;
  sourceInstanceId: string | null;
  targetIds: string[];
  eventId: string | null;
  visibility: LogVisibility;
  message: string;
  privateMessages: Partial<Record<MatchSeat, string>>;
  judgeMessage: string | null;
}

export interface DelayedEffectAction {
  sourceInstanceId: string;
  controller: MatchSeat;
  action: Action;
  scheduledTurn: number;
  scheduledBattleId?: string;
  sourceZoneChangeCounter?: number;
  previousActionTargetIds?: string[];
}

export interface MatchState {
  config: Required<
    Pick<
      MatchConfig,
      | "judgeFallback"
      | "openingHandSize"
      | "maxCharacterSlots"
      | "shuffleDecks"
      | "skipFirstTurnDraw"
    >
  > &
    Pick<MatchConfig, "firstPlayer" | "players" | "seed">;
  status: MatchStatus;
  activeSeat: MatchSeat;
  extraTurnSeat: MatchSeat | null;
  turnNumber: number;
  phase: MatchPhase;
  players: Record<MatchSeat, PlayerState>;
  cards: Record<string, CardInstance>;
  modifiers: Record<string, ModifierState>;
  promptQueue: PromptState[];
  battle: BattleState | null;
  winner: MatchSeat | null;
  setup: SetupState;
  idCounter: number;
  eventSequence: number;
  logSequence: number;
  capabilitySequence: number;
  eventHistory: EngineEvent[];
  logHistory: GameLogEntry[];
  capabilityHistory: EngineCapabilityIssue[];
  delayedEffectActions: DelayedEffectAction[];
  resolutionQueue: ResolutionItem[];
  resolutionStatus: ResolutionStatus;
  commandHistory: Array<GameCommand | JudgeCommand>;
}

export interface PromptResolution {
  promptId: string;
  optionId?: string;
  selectedIds?: string[];
  note?: string;
  confirm?: boolean;
}

export interface GameCommandBase {
  seat: MatchSeat;
}

export type GameCommand =
  | ({ type: "chooseJoKenPo"; choice: JoKenPoChoice } & GameCommandBase)
  | ({
      type: "resolveJoKenPoTimeout";
      winner: MatchSeat;
      reason: "onePlayerTimedOut" | "bothPlayersTimedOut";
      elapsedMs: number;
      timedOutSeats?: MatchSeat[];
    } & GameCommandBase)
  | ({ type: "chooseFirstPlayer"; firstPlayer: MatchSeat } & GameCommandBase)
  | ({ type: "mulligan" } & GameCommandBase)
  | ({ type: "keepHand" } & GameCommandBase)
  | ({ type: "startGame" } & GameCommandBase)
  | ({ type: "endTurn" } & GameCommandBase)
  | ({
      type: "playCard";
      instanceId: string;
      slotIndex?: number;
    } & GameCommandBase)
  | ({
      type: "attachDon";
      targetId: string;
      amount?: number;
    } & GameCommandBase)
  | ({
      type: "declareAttack";
      attackerId: string;
      targetId: string;
    } & GameCommandBase)
  | ({
      type: "activateEffect";
      sourceInstanceId: string;
      trigger: "activateMain" | "main";
      trashHandIds?: string[];
    } & GameCommandBase)
  | ({
      type: "resolvePrompt";
    } & GameCommandBase &
      PromptResolution);

export type JudgeCommand =
  | {
      type: "judgeResolvePrompt";
      seat: "judge";
      promptId: string;
      note: string;
    }
  | {
      type: "judgeMoveCard";
      seat: "judge";
      instanceId: string;
      owner: MatchSeat;
      zone: Exclude<CardZone, "leader">;
      slotIndex?: number;
      deckPosition?: "top" | "bottom";
      note?: string;
    }
  | {
      type: "judgeSetWinner";
      seat: "judge";
      winner: MatchSeat;
      note?: string;
    };

export type EngineCommand = GameCommand | JudgeCommand;

export interface ApplyCommandResult {
  state: MatchState;
  accepted: boolean;
  reason: string | null;
  events: EngineEvent[];
  logs: GameLogEntry[];
  animations: EngineAnimation[];
  patches: Patch[];
  inversePatches: Patch[];
  capabilityIssues: EngineCapabilityIssue[];
}

export interface ReplayResult {
  state: MatchState;
  results: ApplyCommandResult[];
}

export interface LegalCommandDescriptor {
  type: EngineCommand["type"];
  seat: EngineActor;
  label: string;
  sourceId?: string;
  targetIds?: string[];
  slotChoices?: number[];
  promptId?: string;
  options?: PromptOption[];
}

export type ProjectedDecisionKind =
  | "chooseAction"
  | "chooseOption"
  | "selectCards"
  | "selectTargets"
  | "payCost"
  | "orderItems"
  | "confirm"
  | "respond"
  | "resolveStep";

export type ProjectedEntityKind =
  | "card"
  | "player"
  | "zone"
  | "counter"
  | "token"
  | "die"
  | "option";

export interface ProjectedEntityRef {
  kind: ProjectedEntityKind;
  id: string;
  ownerId?: string;
  zoneId?: string;
}

export interface ProjectedDecisionConstraint {
  id: string;
  label: string;
  operator?: "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "includes";
  value?: string | number | boolean;
  gameSpecific?: boolean;
}

export interface ProjectedEntityCandidate {
  ref: ProjectedEntityRef;
  label: string;
  legal: boolean;
  disabledReason?: string;
  matchedConstraints?: string[];
  publicInfo?: Record<string, string | number | boolean | null>;
}

export interface ProjectedActionCandidate {
  id: string;
  label: string;
  commandType: EngineCommand["type"];
  source?: ProjectedEntityRef;
  targets?: ProjectedEntityRef[];
  slotChoices?: number[];
  options?: PromptOption[];
}

export type ProjectedDecisionStep =
  | {
      id: string;
      kind: "chooseAction";
      label: string;
      actions: ProjectedActionCandidate[];
    }
  | {
      id: string;
      kind: "chooseOption";
      label: string;
      options: PromptOption[];
      min: number;
      max: number;
    }
  | {
      id: string;
      kind: "selectEntity";
      role: string;
      label: string;
      entityKinds: ProjectedEntityKind[];
      min: number;
      max: number;
      candidates: ProjectedEntityCandidate[];
      constraints: ProjectedDecisionConstraint[];
      selected: ProjectedEntityRef[];
      allowDuplicates?: boolean;
      optional?: boolean;
      uiHints?: {
        highlightZones?: string[];
        preferredPresentation?: "board" | "modal" | "drawer" | "inline";
        emptyMessage?: string;
      };
    }
  | {
      id: string;
      kind: "payCost";
      label: string;
      costType?: string;
      entityKinds: ProjectedEntityKind[];
      min: number;
      max: number;
      ordered?: boolean;
      candidates: ProjectedEntityCandidate[];
      constraints: ProjectedDecisionConstraint[];
      selected: ProjectedEntityRef[];
    }
  | {
      id: string;
      kind: "orderItems";
      label: string;
      candidates: ProjectedEntityCandidate[];
      min: number;
      max: number;
    }
  | {
      id: string;
      kind: "confirm";
      label: string;
      confirmLabel: string;
      cancelLabel: string;
      options: PromptOption[];
    };

export interface ProjectedDecisionSubmitSpec {
  commandType: EngineCommand["type"];
  payloadSchemaVersion: number;
  promptId?: string;
  requiredStepIds: string[];
}

export interface ProjectedDecisionValidationSummary {
  staleStateId?: number;
  errors: string[];
}

export interface ProjectedDecision {
  id: string;
  gameId: "one-piece";
  actorId: MatchSeat | "judge";
  priority: "active" | "response" | "simultaneous" | "judge";
  kind: ProjectedDecisionKind;
  title: string;
  message?: string;
  source?: ProjectedEntityRef;
  timing?: {
    phase?: MatchPhase;
    step?: BattleState["step"];
    trigger?: string;
    stackItemId?: string;
  };
  steps: ProjectedDecisionStep[];
  currentStepId?: string;
  canCancel?: boolean;
  cancelLabel?: string;
  canPass?: boolean;
  passLabel?: string;
  validation?: ProjectedDecisionValidationSummary;
  submit: ProjectedDecisionSubmitSpec;
  extensions?: Record<string, string | number | boolean | string[] | null>;
}

export interface ProjectedCard {
  instanceId: string | null;
  cardId: string | null;
  name: string | null;
  owner: MatchSeat;
  zone: CardZone;
  rested: boolean;
  attachedDon: number;
  power: number | null;
  cost: number | null;
  hidden: boolean;
}

export interface ProjectedPlayerState {
  seat: MatchSeat;
  playerName: string;
  leader: ProjectedCard;
  handCount: number;
  deckCount: number;
  lifeCount: number;
  trash: ProjectedCard[];
  stage: ProjectedCard | null;
  characters: Array<ProjectedCard | null>;
  hand: ProjectedCard[];
  life: ProjectedCard[];
  deckTop: ProjectedCard | null;
  activeDon: number;
  restedDon: number;
  donDeckCount: number;
}

export interface ProjectedPrompt {
  id: string;
  kind: PromptKind;
  choiceKind: ChoiceKind | null;
  seat: MatchSeat | "judge";
  label: string;
  details: string;
  options: PromptOption[];
  minSelections: number;
  maxSelections: number;
}

export interface ProjectedLogEntry {
  id: string;
  turn: number;
  phase: MatchPhase;
  sequence: number;
  actor: EngineActor;
  sourceCardId: string | null;
  sourceInstanceId: string | null;
  targetIds: string[];
  eventId: string | null;
  visibility: LogVisibility;
  message: string;
}

export interface PlayerView {
  viewer: Viewer;
  status: MatchStatus;
  activeSeat: MatchSeat;
  turnNumber: number;
  phase: MatchPhase;
  winner: MatchSeat | null;
  players: Record<MatchSeat, ProjectedPlayerState>;
  prompts: ProjectedPrompt[];
  decisions: ProjectedDecision[];
  battle: BattleState | null;
  logs: ProjectedLogEntry[];
}
