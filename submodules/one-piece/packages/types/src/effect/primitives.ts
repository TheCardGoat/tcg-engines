export type Player = "self" | "opponent";
export type TargetPlayer = Player | "any" | "both";

export type Zone =
  | "leader"
  | "character"
  | "stage"
  | "hand"
  | "deck"
  | "trash"
  | "life"
  | "don"
  | "donDeck"
  | "costArea"
  | "field";

export type Comparison = "eq" | "lte" | "gte" | "lt" | "gt";

export type Amount = number | "all";

export interface TargetCount {
  amount: Amount;
  upTo?: boolean;
}

export type Duration =
  | "thisTurn"
  | "thisBattle"
  | "untilEndOfYourNextTurn"
  | "untilEndOfOpponentNextTurn"
  | "untilEndOfOpponentNextEndPhase"
  | "untilStartOfNextTurn"
  | "endOfTurn"
  | "permanent";

export type Keyword =
  | "rush"
  | "rushCharacter"
  | "doubleAttack"
  | "banish"
  | "blocker"
  | "unblockable";

export type EffectTrigger =
  | "onPlay"
  | "whenAttacking"
  | "onBlock"
  | "onKo"
  | "startOfYourTurn"
  | "endOfYourTurn"
  | "endOfOpponentTurn"
  | "onOpponentAttack"
  | "activateMain"
  | "counter"
  | "main"
  | "trigger"
  | "whenDealsDamage"
  | "whenYouDealDamage"
  | "whenCharacterKod"
  | "whenCharacterRemoved"
  | "whenLeaving"
  | "whenBlockerActivated"
  | "whenTriggerActivates"
  | "whenDonReturned"
  | "whenOpponentActivatesEvent"
  | "whenYouActivateEvent"
  | "whenDonGiven"
  | "endOfBattle"
  | "whenCardDrawn"
  | "whenCardTrashedFromHandByEffect"
  | "whenLifeAddedToHand"
  | "whenLifeRemoved"
  | "whenOpponentPlaysCharacter"
  | "whenYouPlayCharacter"
  | "whenTriggerCharacterPlayed"
  | "whenBecomesRested"
  | "whenCharacterRestedByEffect"
  | "whenCardsTrashedFromHandByEffect"
  | "whenYouTakeDamage";
