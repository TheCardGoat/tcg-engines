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
}

export type ReturnDonCost =
  | {
      cost: "returnDon";
      amount: number;
      minimumAmount?: never;
    }
  | {
      cost: "returnDon";
      minimumAmount: number;
      amount?: never;
    };

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
}

export interface TurnLifeFaceUpCost {
  cost: "turnLifeFaceUp";
  count: number;
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
  amount: number;
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
