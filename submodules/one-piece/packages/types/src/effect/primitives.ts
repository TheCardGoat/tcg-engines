export type Player = "self" | "opponent";

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
  | "endOfYourTurn"
  | "endOfOpponentTurn"
  | "onOpponentAttack"
  | "activateMain"
  | "counter"
  | "main"
  | "trigger"
  | "whenDealsDamage"
  | "whenCharacterKod"
  | "whenLeaving"
  | "whenBlockerActivated"
  | "whenTriggerActivates"
  | "whenDonReturned"
  | "whenOpponentActivatesEvent"
  | "whenYouActivateEvent"
  | "whenDonGiven"
  | "endOfBattle"
  | "whenCardDrawn"
  | "whenLifeAddedToHand"
  | "whenLifeRemoved"
  | "whenOpponentPlaysCharacter"
  | "whenYouPlayCharacter"
  | "whenTriggerCharacterPlayed"
  | "whenBecomesRested"
  | "whenCharacterRestedByEffect";
