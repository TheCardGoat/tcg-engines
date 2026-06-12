import type { TargetFilter } from "./target.ts";

export type Cost =
  | RestDonCost
  | ReturnDonCost
  | TrashFromHandCost
  | RestThisCardCost
  | TrashThisCardCost
  | TurnLifeFaceUpCost
  | ReturnCharacterCost
  | AddLifeToHandCost
  | RevealFromHandCost
  | RestCardsCost;

export interface RestDonCost {
  cost: "restDon";
  amount: number;
}

export interface ReturnDonCost {
  cost: "returnDon";
  amount: number;
}

export interface TrashFromHandCost {
  cost: "trashFromHand";
  amount: number;
  filters?: TargetFilter[];
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
}

export interface ReturnCharacterCost {
  cost: "returnCharacter";
  amount: number;
  filters?: TargetFilter[];
}

export interface AddLifeToHandCost {
  cost: "addLifeToHand";
  amount: number;
}

export interface RevealFromHandCost {
  cost: "revealFromHand";
  amount: number;
  filters?: TargetFilter[];
}

export interface RestCardsCost {
  cost: "restCards";
  amount: number;
  filters?: TargetFilter[];
}
