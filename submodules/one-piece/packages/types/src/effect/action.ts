import type { Duration, EffectTrigger, Keyword, Player, TargetCount, Zone } from "./primitives.ts";
import type { Target, TargetFilter } from "./target.ts";
import type { Condition } from "./condition.ts";

export type Action =
  | SequenceAction
  | OptionalAction
  | DelayedAction
  | ModifyPowerAction
  | ModifyCounterAction
  | KoAction
  | DrawAction
  | RedrawHandAction
  | TrashFromHandAction
  | TrashFromHandUntilAction
  | PlayAction
  | GroupedPlayAction
  | PlayRestedAction
  | PlayThisCardAction
  | AddThisCardToHandAction
  | RestAction
  | SetActiveAction
  | ReturnToHandAction
  | ReturnToDeckAction
  | SearchAction
  | AddDonAction
  | GiveDonFromDonPhaseAction
  | GiveDonAction
  | GrantKeywordAction
  | AddToLifeAction
  | RemoveFromLifeAction
  | SetPowerAction
  | SetBasePowerFromAction
  | CopyPowerAction
  | SwapBasePowerAction
  | ModifyCostAction
  | SetCostAction
  | NegateEffectsAction
  | NegatePlayerEffectsAction
  | CannotAttackAction
  | CannotBeKodAction
  | CannotBeRemovedAction
  | CannotActivateAction
  | CanAttackActiveAction
  | TrashFromFieldAction
  | TrashThisCardAction
  | WinGameAction
  | ChangeBattleTargetAction
  | AttackRestrictionAction
  | CannotAttackTargetsAction
  | RearrangeDeckAction
  | ShuffleDeckAction
  | RearrangeLifeAction
  | RevealTopDeckCardAction
  | LookAtTopDeckCardAction
  | ActivateEventAction
  | RestDonForPowerAction
  | ActivateEffectAction
  | TrashFromDeckAction
  | FreezeAction
  | BattleKoReplacementAction
  | PlayRestrictionAction
  | ReturnDonAction
  | OpponentReturnDonAction
  | ChoiceAction
  | ConditionalAction
  | ScheduleAtEndOfTurnAction
  | ExtraTurnAction
  | DealDamageAction
  | RedistributeDonAction
  | CannotBeRestedAction
  | CannotDrawAction
  | CannotSetDonActiveAction
  | CannotBePlayedByEffectsAction
  | LookAtLifeAction
  | RevealFromLifeAction
  | RevealFromDeckAction
  | RevealFromHandAction
  | GuessTopDeckCostAction
  | TurnLifeFaceDownAction
  | TurnLifeFaceUpAction;

export interface SequenceAction {
  action: "sequence";
  actions: Action[];
  condition?: Condition;
}

export interface OptionalAction {
  action: "optional";
  actions: Action[];
  condition?: Condition;
}

export interface DelayedAction {
  action: "delayed";
  timing: "endOfThisTurn" | "endOfThisBattle" | "startOfOpponentNextMainPhase";
  actions: Action[];
  condition?: Condition;
}

export interface ModifyPowerAction {
  action: "modifyPower";
  target: Target;
  value: number;
  /** Applies values by selected-target order when one effect distributes unequal modifiers. */
  distributedValues?: number[];
  duration: Duration;
  previousActionTargets?: boolean;
  valuePerPreviousActionTarget?: number;
  previousActionTargetGroupSize?: number;
  restedDonGroupSize?: number;
  valuePerCardGroup?: {
    target: Target;
    size: number;
  };
  condition?: Condition;
}

export interface ModifyCounterAction {
  action: "modifyCounter";
  target: Target;
  value: number;
  condition?: Condition;
}

export interface KoAction {
  action: "ko";
  target: Target;
  previousActionTargets?: boolean;
  condition?: Condition;
}

export interface DrawAction {
  action: "draw";
  player: Player;
  amount: number;
  amountFromTarget?: Target;
  amountFromTriggerEvent?: boolean;
  upTo?: boolean;
  untilHandSize?: number;
  condition?: Condition;
}

export interface RedrawHandAction {
  action: "redrawHand";
  player: Player;
  drawCount: number | "returned";
  condition?: Condition;
}

export interface TrashFromHandAction {
  action: "trashFromHand";
  player: Player;
  chosenBy?: Player;
  amount: number | "all";
  amountFromTarget?: Target;
  amountFromPreviousActionTargets?: boolean;
  untilHandSize?: number;
  upTo?: boolean;
  filters?: TargetFilter[];
  condition?: Condition;
}

export interface TrashFromHandUntilAction {
  action: "trashFromHandUntil";
  player: Player;
  handSize: number;
  condition?: Condition;
}

export interface PlayAction {
  action: "play";
  source: {
    player: Player;
    zone: Zone | Zone[];
  };
  count: TargetCount;
  self?: boolean;
  filters?: TargetFilter[];
  differentColorFromPreviousCharacter?: boolean;
  differentNames?: boolean;
  sameNameAsPreviousCard?: boolean;
  playState?: "rested" | "active";
  topOnly?: boolean;
  /** Actions that resolve only when at least one card was actually played. */
  thenActions?: Action[];
  condition?: Condition;
}

export interface GroupedPlayAction {
  action: "playGrouped";
  source: {
    player: Player;
    zone: Zone | Zone[];
  };
  groups: Array<{
    count: { amount: 1; upTo: true };
    filters?: TargetFilter[];
  }>;
  playStates: {
    single: "active";
    multiple: ["active", "rested"];
    /** When true, each state in `multiple` is constrained by the matching group. */
    byGroup?: true;
  };
  chooseOnPlayOrder: true;
  /** Restrict the grouped choice to physical cards selected by the preceding action. */
  previousActionTargets?: boolean;
  condition?: Condition;
}

export interface PlayRestedAction {
  action: "playRested";
  player: Player;
  filters: TargetFilter[];
  condition?: Condition;
}

export interface PlayThisCardAction {
  action: "playThisCard";
  condition?: Condition;
}

export interface AddThisCardToHandAction {
  action: "addThisCardToHand";
  condition?: Condition;
}

export interface RestAction {
  action: "rest";
  target: Target;
  condition?: Condition;
}

export interface SetActiveAction {
  action: "setActive";
  target: Target;
  condition?: Condition;
}

export interface ReturnToHandAction {
  action: "returnToHand";
  target: Target;
  thenActions?: Action[];
  condition?: Condition;
}

export interface ReturnToDeckAction {
  action: "returnToDeck";
  target: Target;
  position: "top" | "bottom" | "any";
  order?: "any";
  destinationPlayer?: Player;
  triggerEventTarget?: boolean;
  previousActionTargets?: boolean;
  condition?: Condition;
}

export interface SearchAction {
  action: "search";
  lookCount: number;
  source: {
    player: Player;
    zone: Zone;
  };
  revealCount: TargetCount;
  revealFilters?: TargetFilter[];
  revealFilterMode?: "all" | "any";
  revealDestination: Zone;
  remainderPosition: "top" | "bottom" | "any" | "trash";
  playState?: "rested" | "active";
  condition?: Condition;
}

export interface AddDonAction {
  action: "addDon";
  player?: Player;
  count: TargetCount;
  state: "active" | "rested";
  condition?: Condition;
}

export interface GiveDonFromDonPhaseAction {
  action: "giveDonFromDonPhase";
  count: number;
  condition?: Condition;
}

export interface GiveDonAction {
  action: "giveDon";
  target: Target;
  count: TargetCount;
  donState?: "rested" | "active";
  distribution?: "single" | "each";
  condition?: Condition;
}

export interface GrantKeywordAction {
  action: "grantKeyword";
  target: Target;
  keyword: Keyword;
  duration: Duration;
  previousActionTargets?: boolean;
  condition?: Condition;
}

export interface AddToLifeAction {
  action: "addToLife";
  target: Target;
  position: "top" | "bottom" | "choice";
  faceUp?: boolean;
  /** Move the exact physical cards selected by the preceding action. */
  previousActionTargets?: boolean;
  condition?: Condition;
}

export interface RemoveFromLifeAction {
  action: "removeFromLife";
  player: Player;
  count: TargetCount | { untilRemaining: number };
  destination: Zone;
  destinationPosition?: "top" | "bottom";
  position?: "top" | "bottom" | "choice";
  /** Actions resolved only when at least one Life card was moved. */
  thenActions?: Action[];
  condition?: Condition;
}

export interface SetPowerAction {
  action: "setPower";
  target: Target;
  value: number;
  duration: Duration;
  condition?: Condition;
}

/** Set a card's base power from another card while preserving other modifiers. */
export interface SetBasePowerFromAction {
  action: "setBasePowerFrom";
  target: Target;
  source: Target;
  duration: Duration;
  condition?: Condition;
}

export interface CopyPowerAction {
  action: "copyPower";
  target: Target;
  duration: Duration;
  /** Bind the copied power source to the attacker carried by the trigger event. */
  triggerEventAttacker?: boolean;
  condition?: Condition;
}

export interface SwapBasePowerAction {
  action: "swapBasePower";
  target: Target;
  pairedTarget?: Target;
  duration: Duration;
  condition?: Condition;
}

export interface ModifyCostAction {
  action: "modifyCost";
  target: Target;
  value: number;
  duration?: Duration;
  consumeOnPlay?: boolean;
  condition?: Condition;
}

export interface SetCostAction {
  action: "setCost";
  target: Target;
  value: number;
  duration?: Duration;
  condition?: Condition;
}

export interface NegateEffectsAction {
  action: "negateEffects";
  target: Target;
  duration: Duration;
  effectTypes?: EffectTrigger[];
  condition?: Condition;
}

export interface NegatePlayerEffectsAction {
  action: "negatePlayerEffects";
  player: Player;
  duration: Duration;
  effectTypes?: EffectTrigger[];
  condition?: Condition;
}

export interface CannotAttackAction {
  action: "cannotAttack";
  target: Target;
  duration: Duration;
  /** If present, the target may attack by trashing this many cards from hand for that attack. */
  unlessTrashFromHand?: number;
  previousActionTargets?: boolean;
  condition?: Condition;
}

export interface CannotBeKodAction {
  action: "cannotBeKod";
  target: Target;
  duration: Duration;
  restriction?: "inBattle" | "byEffect";
  byPlayer?: "self" | "opponent";
  byFilter?: TargetFilter[];
  condition?: Condition;
}

export interface CannotBeRemovedAction {
  action: "cannotBeRemoved";
  target: Target;
  duration: Duration;
  bySource?: "opponentEffect" | "ownEffect";
  condition?: Condition;
}

export interface CannotActivateAction {
  action: "cannotActivate";
  target: Target;
  keyword: Keyword;
  requiresKeyword?: boolean;
  duration: Duration;
  condition?: Condition;
}

export interface CanAttackActiveAction {
  action: "canAttackActive";
  target: Target;
  duration: Duration;
  condition?: Condition;
}

export interface TrashFromFieldAction {
  action: "trashFromField";
  target: Target;
  condition?: Condition;
}

export interface TrashThisCardAction {
  action: "trashThisCard";
  condition?: Condition;
}

export interface WinGameAction {
  action: "winGame";
  condition?: Condition;
}

export interface ChangeBattleTargetAction {
  action: "changeBattleTarget";
  target: Target;
  condition?: Condition;
}

export interface AttackRestrictionAction {
  action: "attackRestriction";
  restriction: "mustAttack" | "cannotAttack" | "cannotAttackOtherThan";
  target: Target;
  duration: Duration;
  condition?: Condition;
}

export interface CannotAttackTargetsAction {
  action: "cannotAttackTargets";
  attacker: Target;
  filters: TargetFilter[];
  duration: Duration;
  condition?: Condition;
}

export interface LookAtTopDeckCardAction {
  action: "lookAtTopDeckCard";
  player: Player;
  condition?: Condition;
}

export interface ActivateEventAction {
  action: "activateEvent";
  target: Target;
  effectTrigger: Extract<EffectTrigger, "main">;
  condition?: Condition;
}

export interface RestDonForPowerAction {
  action: "restDonForPower";
  target: Target;
  valuePerDon: number;
  duration: Duration;
  condition?: Condition;
}

export interface RearrangeDeckAction {
  action: "rearrangeDeck";
  player: Player;
  count: number;
  position: "top" | "bottom" | "topOrBottom";
  trashUpTo?: number;
  condition?: Condition;
}

export interface ShuffleDeckAction {
  action: "shuffleDeck";
  player: Player;
  condition?: Condition;
}

export interface RearrangeLifeAction {
  action: "rearrangeLife";
  player: Player;
  moveOneToDeckTop?: boolean;
  condition?: Condition;
}

export interface RevealTopDeckCardAction {
  action: "revealTopDeckCard";
  player: Player;
  conditional?: {
    filters: TargetFilter[];
    actions: Action[];
  };
  finalPosition: "top" | "bottom" | "choice";
  condition?: Condition;
}

export interface ActivateEffectAction {
  action: "activateEffect";
  effectTrigger: EffectTrigger;
  target?: Target;
  condition?: Condition;
}

export interface TrashFromDeckAction {
  action: "trashFromDeck";
  player: Player;
  amount: number;
  amountFromPreviousActionTargets?: boolean;
  upTo?: boolean;
  thenActions?: Action[];
  condition?: Condition;
}

export interface FreezeAction {
  action: "freeze";
  target: Target;
  previousActionTargets?: boolean;
  condition?: Condition;
}

export interface BattleKoReplacementAction {
  action: "battleKoReplacement";
  target: Omit<Target, "count"> & { count: TargetCount & { amount: "all" } };
  duration: Extract<Duration, "thisTurn">;
  condition?: Condition;
}

export interface PlayRestrictionAction {
  action: "playRestriction";
  restriction: "cannotPlay";
  filters: TargetFilter[];
  sourceZones?: Extract<Zone, "hand" | "deck" | "trash" | "life">[];
  duration: Duration;
  condition?: Condition;
}

export interface OpponentReturnDonAction {
  action: "opponentReturnDon";
  amount: number;
  condition?: Condition;
}

export interface ReturnDonAction {
  action: "returnDon";
  player: Player;
  amount: number;
  untilSameCountAsOpponent?: boolean;
  thenActions?: Action[];
  condition?: Condition;
}

export interface ChoiceAction {
  action: "choice";
  player?: Player;
  options: Action[][];
  condition?: Condition;
}

export interface ConditionalAction {
  action: "conditional";
  predicate: Condition;
  whenTrue: Action[];
  whenFalse?: Action[];
  condition?: Condition;
}

export interface ScheduleAtEndOfTurnAction {
  action: "scheduleAtEndOfTurn";
  actions: Action[];
  condition?: Condition;
}

export interface ExtraTurnAction {
  action: "extraTurn";
  condition?: Condition;
}

export interface DealDamageAction {
  action: "dealDamage";
  player: Player;
  amount: number;
  condition?: Condition;
}

export interface RedistributeDonAction {
  action: "redistributeDon";
  count: TargetCount;
  target: Target;
  condition?: Condition;
}

export interface CannotBeRestedAction {
  action: "cannotBeRested";
  target: Target;
  duration: Duration;
  /** Restrict effect-based rest prevention to effects controlled by this relative player. */
  byPlayer?: "self" | "opponent";
  condition?: Condition;
}

export interface CannotDrawAction {
  action: "cannotDraw";
  player: Player;
  source: "ownEffects";
  duration: Duration;
  condition?: Condition;
}

export interface CannotSetDonActiveAction {
  action: "cannotSetDonActive";
  player: Player;
  source: "characterEffects";
  duration: Duration;
  condition?: Condition;
}

export interface CannotBePlayedByEffectsAction {
  action: "cannotBePlayedByEffects";
  condition?: Condition;
}

export interface LookAtLifeAction {
  action: "lookAtLife";
  player: Player | "either";
  position: "topOrBottom";
  upTo?: boolean;
  condition?: Condition;
}

export interface RevealFromLifeAction {
  action: "revealFromLife";
  player: Player;
  conditionalPlay?: {
    filters: TargetFilter[];
    thenActions?: Action[];
  };
  condition?: Condition;
}

export interface RevealFromDeckAction {
  action: "revealFromDeck";
  player: Player;
  count: 1;
  ifRevealedCardMatches?: {
    filters: TargetFilter[];
    actions: Action[];
  };
  condition?: Condition;
}

export interface RevealFromHandAction {
  action: "revealFromHand";
  player: Player;
  amount: number | "all";
  chosenBy?: Player;
  filters?: TargetFilter[];
  upTo?: boolean;
  /** Actions that consume the exact physical cards selected for this reveal. */
  thenActions?: Action[];
  ifRevealedCardMatches?: {
    filters: TargetFilter[];
    actions: Action[];
  };
  condition?: Condition;
}

export interface GuessTopDeckCostAction {
  action: "guessTopDeckCost";
  player: Player;
  onMatch: Action[];
  condition?: Condition;
}

export interface TurnLifeFaceDownAction {
  action: "turnLifeFaceDown";
  player: Player;
  condition?: Condition;
}

export interface TurnLifeFaceUpAction {
  action: "turnLifeFaceUp";
  player: Player;
  count: number;
  position: "top" | "bottom";
  condition?: Condition;
}
