import type { BoardZones } from "../../../shared-types";
import type { TargetFilter } from "./targets/targetFilters";
import type { CardEffectTarget, PlayerEffectTarget } from "./targets/targets";

interface PlayerBaseEffect {
  type: PlayerEffects["type"];
  target: PlayerEffectTarget;
}

interface CardBaseEffect {
  type: CardEffects["type"];
  target: CardEffectTarget;
  amount?: number;
}

interface ContinuousBaseEffect {
  duration: number;
}

export interface CardContinuousEffect
  extends CardBaseEffect,
    ContinuousBaseEffect {}

interface PlayerContinuousEffect
  extends PlayerBaseEffect,
    ContinuousBaseEffect {}

export interface PlayerRestrictionEffect extends PlayerContinuousEffect {
  type: "player-restriction";
  restriction: "shield-receive-damage";
  attackerFilters?: TargetFilter[]; // Optional field that is only used by "shield-receive-damage" restriction
}

export interface DrawEffect extends PlayerBaseEffect {
  type: "draw";
  amount: number;
}

export interface HealEffect extends CardBaseEffect {
  type: "heal";
  amount: number;
}

export interface MoveCardEffect extends CardBaseEffect {
  type: "move";
  to: BoardZones;
  rested?: boolean;
  shouldRevealMoved?: boolean;
}

export interface RestCardEffect extends CardBaseEffect {
  type: "rest";
  rest: boolean;
}

export interface DiscardEffect extends CardBaseEffect {
  type: "discard";
  amount: number;
}

export interface AttributeEffect extends CardContinuousEffect {
  type: "attribute";
  attribute: "ap" | "hp";
  amount: number;
  modifier: "add" | "subtract";
}

export type CardContinuousEffects = AttributeEffect;
export type PlayerContinuousEffects = PlayerRestrictionEffect;

export type CardEffects =
  | CardContinuousEffects
  | DiscardEffect
  | HealEffect
  | MoveCardEffect
  | RestCardEffect;

export type PlayerEffects = DrawEffect | PlayerContinuousEffects;
export type Effect = PlayerEffects | CardEffects;

export const isPlayerRestrictionEffect = (
  effect: Effect,
): effect is PlayerRestrictionEffect => effect.type === "player-restriction";

export const isAttributeEffect = (effect: Effect): effect is AttributeEffect =>
  effect.type === "attribute";

export const isContinuousEffect = (
  effect: Effect,
): effect is CardContinuousEffects | PlayerRestrictionEffect => {
  return isAttributeEffect(effect) || isPlayerRestrictionEffect(effect);
};
