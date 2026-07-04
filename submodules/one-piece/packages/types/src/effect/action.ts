import type { Duration, EffectTrigger, Keyword, Player, TargetCount, Zone } from "./primitives.ts";
import type { Target, TargetFilter } from "./target.ts";
import type { Condition } from "./condition.ts";

export type Action =
  | ModifyPowerAction
  | KoAction
  | DrawAction
  | TrashFromHandAction
  | PlayAction
  | RestAction
  | SetActiveAction
  | ReturnToHandAction
  | ReturnToDeckAction
  | SearchAction
  | AddDonAction
  | GiveDonAction
  | GrantKeywordAction
  | AddToLifeAction
  | RemoveFromLifeAction
  | SetPowerAction
  | ModifyCostAction
  | NegateEffectsAction
  | CannotAttackAction
  | CannotBeKodAction
  | CannotBeRemovedAction
  | CannotActivateAction
  | CanAttackActiveAction
  | TrashFromFieldAction
  | TrashThisCardAction
  | WinGameAction
  | AttackRestrictionAction
  | RearrangeDeckAction
  | ActivateEffectAction
  | TrashFromDeckAction
  | FreezeAction
  | PlayRestrictionAction
  | OpponentReturnDonAction
  | ChoiceAction
  | ExtraTurnAction
  | DealDamageAction
  | RedistributeDonAction
  | CannotBeRestedAction
  | RevealFromLifeAction
  | RevealFromHandAction
  | TurnLifeFaceDownAction;

export interface ModifyPowerAction {
  action: "modifyPower";
  target: Target;
  value: number;
  duration: Duration;
  condition?: Condition;
}

export interface KoAction {
  action: "ko";
  target: Target;
  condition?: Condition;
}

export interface DrawAction {
  action: "draw";
  player: Player;
  amount: number;
  condition?: Condition;
}

export interface TrashFromHandAction {
  action: "trashFromHand";
  player: Player;
  amount: number;
  filters?: TargetFilter[];
  condition?: Condition;
}

export interface PlayAction {
  action: "play";
  source: {
    player: Player;
    zone: Zone | Zone[];
  };
  count: TargetCount;
  filters?: TargetFilter[];
  playState?: "rested" | "active";
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
  condition?: Condition;
}

export interface ReturnToDeckAction {
  action: "returnToDeck";
  target: Target;
  position: "top" | "bottom" | "any";
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
  revealDestination: Zone;
  remainderPosition: "top" | "bottom" | "any" | "trash";
  condition?: Condition;
}

export interface AddDonAction {
  action: "addDon";
  count: TargetCount;
  state: "active" | "rested";
  condition?: Condition;
}

export interface GiveDonAction {
  action: "giveDon";
  target: Target;
  count: TargetCount;
  donState?: "rested" | "active";
  condition?: Condition;
}

export interface GrantKeywordAction {
  action: "grantKeyword";
  target: Target;
  keyword: Keyword;
  duration: Duration;
  condition?: Condition;
}

export interface AddToLifeAction {
  action: "addToLife";
  target: Target;
  position: "top" | "bottom";
  faceUp?: boolean;
  condition?: Condition;
}

export interface RemoveFromLifeAction {
  action: "removeFromLife";
  player: Player;
  count: TargetCount;
  destination: Zone;
  condition?: Condition;
}

export interface SetPowerAction {
  action: "setPower";
  target: Target;
  value: number;
  duration: Duration;
  condition?: Condition;
}

export interface ModifyCostAction {
  action: "modifyCost";
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

export interface CannotAttackAction {
  action: "cannotAttack";
  target: Target;
  duration: Duration;
  condition?: Condition;
}

export interface CannotBeKodAction {
  action: "cannotBeKod";
  target: Target;
  duration: Duration;
  restriction?: "inBattle" | "byEffect";
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

export interface AttackRestrictionAction {
  action: "attackRestriction";
  restriction: "mustAttack" | "cannotAttackOtherThan";
  target: Target;
  duration: Duration;
  condition?: Condition;
}

export interface RearrangeDeckAction {
  action: "rearrangeDeck";
  player: Player;
  count: number;
  position: "top" | "bottom" | "topOrBottom";
  condition?: Condition;
}

export interface ActivateEffectAction {
  action: "activateEffect";
  effectTrigger: EffectTrigger;
  condition?: Condition;
}

export interface TrashFromDeckAction {
  action: "trashFromDeck";
  player: Player;
  amount: number;
  condition?: Condition;
}

export interface FreezeAction {
  action: "freeze";
  target: Target;
  condition?: Condition;
}

export interface PlayRestrictionAction {
  action: "playRestriction";
  restriction: "cannotPlay";
  filters: TargetFilter[];
  duration: Duration;
  condition?: Condition;
}

export interface OpponentReturnDonAction {
  action: "opponentReturnDon";
  amount: number;
  condition?: Condition;
}

export interface ChoiceAction {
  action: "choice";
  options: Action[][];
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

export interface RevealFromHandAction {
  action: "revealFromHand";
  player: Player;
  amount: number;
  chosenBy?: Player;
  condition?: Condition;
}

export interface TurnLifeFaceDownAction {
  action: "turnLifeFaceDown";
  player: Player;
  condition?: Condition;
}
