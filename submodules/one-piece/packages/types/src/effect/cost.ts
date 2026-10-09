import type { Player, Zone } from "./primitives.ts";
import type { TargetFilter } from "./target.ts";

export type Cost =
  | RestDonCost
  | GiveDonCost
  | ReturnDonCost
  | TrashFromHandCost
  | TrashLifeCost
  | RestThisCardCost
  | TrashThisCardCost
  | TurnLifeFaceUpCost
  | ReturnCharacterCost
  | ReturnCharacterToDeckCost
  | ReturnHandToDeckCost
  | ReturnThisToHandCost
  | ReturnThisToDeckCost
  | ReturnThisAndHandToDeckCost
  | AddLifeToHandCost
  | AddCharacterToLifeCost
  | RevealFromHandCost
  | ReturnTrashToDeckCost
  | RestCardsCost
  | TrashCharacterCost
  | KoCharacterCost
  | PlayCardCost
  | TrashCardCost
  | ModifyLeaderPowerCost;

export interface CardCostOption {
  zones: Zone[];
  filters?: TargetFilter[];
}

export interface PlayCardCost extends CardCostOption {
  cost: "playCard";
  amount: number;
}

export interface TrashCardCost {
  cost: "trashCard";
  amount: number;
  options: CardCostOption[];
}

export interface RestDonCost {
  cost: "restDon";
  amount: number;
}

export interface GiveDonCost {
  cost: "giveDon";
  amount: number;
  /** Whose DON!! pool funds the give; defaults to the effect controller. */
  donorPlayer?: Player;
  /** Which DON!! pool funds the give; defaults to "active". */
  donState?: "rested" | "active";
  /** Whose Leader/Characters receive the DON!!; defaults to the effect controller. */
  recipientPlayer?: Player;
  /** Which field zones can receive the DON!!; defaults to Leader and Character. */
  recipientZones?: Array<"leader" | "character">;
  /** Printed restrictions on the receiving Leader or Character. */
  recipientFilters?: TargetFilter[];
}

/** DON!! -N returns field DON!! to the deck; printed given-DON costs may return it rested. */
export type ReturnDonCost = {
  cost: "returnDon";
} & ({ amount: number; minimumAmount?: never } | { minimumAmount: number; amount?: never }) &
  (
    | { destination?: "donDeck"; donState?: "active" | "rested" | "any" }
    | { destination: "costAreaRested"; donState: "attached" }
  );

export interface TrashFromHandCost {
  cost: "trashFromHand";
  amount: number;
  filters?: TargetFilter[];
  fieldZones?: Array<"character" | "stage">;
  fieldFilters?: TargetFilter[];
}

export interface TrashLifeCost {
  cost: "trashLife";
  amount: number;
  position?: "top" | "bottom" | "choice";
}

export interface RestThisCardCost {
  cost: "restThisCard";
}

export interface TrashThisCardCost {
  cost: "trashThisCard";
  /** Extra gate such as "with a cost of 20 or more": filters apply to the card bearing the cost. */
  filters?: TargetFilter[];
}

export interface TurnLifeFaceUpCost {
  cost: "turnLifeFaceUp";
  count: number;
  /** Defaults to top; any permits any eligible Life; choice permits only the top or bottom card. */
  position?: "top" | "any" | "choice";
  /** Defaults to true for legacy definitions. False turns currently face-up Life face-down. */
  faceUp?: boolean;
}

export interface ReturnCharacterCost {
  cost: "returnCharacter";
  amount: number;
  filters?: TargetFilter[];
}

export interface ReturnCharacterToDeckCost {
  cost: "returnCharacterToDeck";
  amount: number;
  position: "top" | "bottom";
  player?: Player | "both";
  zones?: Array<"character" | "stage">;
  filters?: TargetFilter[];
}

export interface ReturnHandToDeckCost {
  cost: "returnHandToDeck";
  amount: number;
  position: "top" | "bottom";
}

export interface ReturnThisToHandCost {
  cost: "returnThisToHand";
}

export interface ReturnThisToDeckCost {
  cost: "returnThisToDeck";
  position: "top" | "bottom";
}

export interface ReturnThisAndHandToDeckCost {
  cost: "returnThisAndHandToDeck";
  handAmount: number;
  position: "top" | "bottom";
}

export interface AddCharacterToLifeCost {
  cost: "addCharacterToLife";
  amount: number;
  player?: "self" | "opponent";
  filters?: TargetFilter[];
  position: "top" | "bottom" | "choice";
  faceUp?: boolean;
}

export interface AddLifeToHandCost {
  cost: "addLifeToHand";
  amount: number;
  position?: "top" | "bottom" | "choice";
}

export interface RevealFromHandCost {
  cost: "revealFromHand";
  amount: number;
  filters?: TargetFilter[];
}

export interface ReturnTrashToDeckCost {
  cost: "returnTrashToDeck";
  /** Number of cards selected from trash, excluding the source. */
  amount: number;
  /** Return the source Character together with the trash cards in one chosen order. */
  includeSelf?: true;
  position: "top" | "bottom";
  filters?: TargetFilter[];
}

export interface RestCardsCost {
  cost: "restCards";
  amount: number;
  filters?: TargetFilter[];
}

export interface TrashCharacterCost {
  cost: "trashCharacter";
  amount: number;
  filters?: TargetFilter[];
}

export interface KoCharacterCost {
  cost: "koCharacter";
  amount: number;
  filters?: TargetFilter[];
}

export interface ModifyLeaderPowerCost {
  cost: "modifyLeaderPower";
  value: number;
  duration: "thisTurn";
  requiresActive?: boolean;
}
