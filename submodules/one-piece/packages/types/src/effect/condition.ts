import type { Comparison, EffectTrigger, Player, Zone } from "./primitives.ts";
import type { OPColor } from "../card.ts";
import type { TargetFilter } from "./target.ts";

export type Condition =
  | DonAttachedCondition
  | TurnCondition
  | OncePerTurnCondition
  | LeaderNameCondition
  | LeaderTraitCondition
  | LeaderMulticoloredCondition
  | LeaderColorCondition
  | ZoneCountCondition
  | ZoneCountComparisonCondition
  | HandCountCondition
  | LifeCountCondition
  | LifeComparisonCondition
  | CardStateCondition
  | HasCardCondition
  | NotHasCardCondition
  | CompareHandsCondition
  | DonFieldCountCondition
  | DonFieldComparisonCondition
  | DonGivenCondition
  | CompoundCondition
  | PlayedThisTurnCondition
  | FaceUpLifeCondition
  | ReplacementCondition
  | ExistsOnFieldCondition
  | TriggerEventCondition;

export interface DonAttachedCondition {
  condition: "donAttached";
  amount: number;
}

export interface TurnCondition {
  condition: "turn";
  value: "your" | "opponent";
}

export interface OncePerTurnCondition {
  condition: "oncePerTurn";
}

export interface LeaderNameCondition {
  condition: "leaderName";
  name: string;
}

export interface LeaderTraitCondition {
  condition: "leaderTrait";
  trait: string;
}

export interface ZoneCountCondition {
  condition: "zoneCount";
  player: Player;
  zone: Zone;
  comparison: Comparison;
  value: number;
  filters?: TargetFilter[];
}

export interface HandCountCondition {
  condition: "handCount";
  player: Player;
  comparison: Comparison;
  value: number;
}

export interface LifeCountCondition {
  condition: "lifeCount";
  player: Player;
  comparison: Comparison;
  value: number;
}

export interface CardStateCondition {
  condition: "cardState";
  target: "this";
  property: "power" | "cost" | "state";
  comparison: Comparison;
  value: number | "rested" | "active";
}

export interface HasCardCondition {
  condition: "hasCard";
  player: Player;
  zone: Zone;
  filters: TargetFilter[];
}

export interface NotHasCardCondition {
  condition: "notHasCard";
  player: Player;
  zone: Zone;
  filters: TargetFilter[];
}

export interface CompareHandsCondition {
  condition: "compareHands";
  selfComparison: Comparison;
  difference: number;
}

export interface LeaderMulticoloredCondition {
  condition: "leaderMulticolored";
}

export interface DonFieldCountCondition {
  condition: "donFieldCount";
  player: Player;
  comparison: Comparison;
  value: number;
}

export interface DonFieldComparisonCondition {
  condition: "donFieldComparison";
  /** Comparison of self's DON!! count relative to opponent's */
  selfComparison: Comparison;
}

export interface LifeComparisonCondition {
  condition: "lifeComparison";
  /** Comparison of self's life count relative to opponent's */
  selfComparison: Comparison;
}

export interface DonGivenCondition {
  condition: "donGiven";
  player: Player;
}

export interface CompoundCondition {
  condition: "compound";
  operator: "and" | "or";
  conditions: Condition[];
}

export interface PlayedThisTurnCondition {
  condition: "playedThisTurn";
}

export interface FaceUpLifeCondition {
  condition: "faceUpLife";
  player: Player;
}

export interface ReplacementCondition {
  condition: "replacement";
  event: "ko" | "removed" | "rested" | "leave";
  /** True when the condition refers to "this Character/card" */
  targetSelf: boolean;
  /** Source of the event */
  source?: "opponentEffect" | "opponentCharacterEffect" | "battle" | "effect";
}

export interface ExistsOnFieldCondition {
  condition: "existsOnField";
  zone: Zone;
  filters: TargetFilter[];
}

export interface TriggerEventCondition {
  condition: "triggerEvent";
  event: EffectTrigger;
}

export interface LeaderColorCondition {
  condition: "leaderColor";
  color: OPColor;
}

export interface ZoneCountComparisonCondition {
  condition: "zoneCountComparison";
  zone: Zone;
  selfComparison: Comparison;
  difference: number;
}
