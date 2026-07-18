import type { Comparison, EffectTrigger, Player, Zone } from "./primitives.ts";
import type { OPAttribute, OPColor } from "../card.ts";
import type { Target, TargetFilter } from "./target.ts";

export type Condition =
  | DonAttachedCondition
  | TurnCondition
  | OncePerTurnCondition
  | LeaderNameCondition
  | LeaderAttributeCondition
  | LeaderTraitCondition
  | LeaderMulticoloredCondition
  | LeaderColorCondition
  | ZoneCountCondition
  | ZoneValueTotalCondition
  | CombinedZoneCountCondition
  | ZoneCountComparisonCondition
  | HandCountCondition
  | LifeCountCondition
  | TotalLifeCountCondition
  | RestedCardCountCondition
  | LifeComparisonCondition
  | CardStateCondition
  | HasCardCondition
  | NotHasCardCondition
  | CompareHandsCondition
  | DonFieldCountCondition
  | DonFieldComparisonCondition
  | DonGivenCondition
  | GivenDonCountCondition
  | CompoundCondition
  | PlayedThisTurnCondition
  | FaceUpLifeCondition
  | ReplacementCondition
  | ExistsOnFieldCondition
  | PreviousActionTargetCondition
  | TriggerEventCardCondition
  | TriggerEventCondition
  | BattledOpponentCharacterThisTurnCondition
  | ActiveDonCountCondition;

export interface ActiveDonCountCondition {
  condition: "activeDonCount";
  comparison: Comparison;
  value: number;
}

export interface BattledOpponentCharacterThisTurnCondition {
  condition: "battledOpponentCharacterThisTurn";
}

export interface DonAttachedCondition {
  condition: "donAttached";
  amount: number;
}

export interface GivenDonCountCondition {
  condition: "givenDonCount";
  player: Player;
  comparison: Comparison;
  value: number;
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

export interface LeaderAttributeCondition {
  condition: "leaderAttribute";
  attribute: OPAttribute;
}

export interface LeaderTraitCondition {
  condition: "leaderTrait";
  trait: string;
  match?: "exact" | "includes";
}

export interface ZoneCountCondition {
  condition: "zoneCount";
  player: Player;
  zone: Zone;
  comparison: Comparison;
  value: number;
  filters?: TargetFilter[];
}

export interface ZoneValueTotalCondition {
  condition: "zoneValueTotal";
  player: Player;
  zone: Zone;
  property: "cost" | "power";
  comparison: Comparison;
  value: number;
  filters?: TargetFilter[];
}

export interface CombinedZoneCountCondition {
  condition: "combinedZoneCount";
  player: Player;
  zones: Zone[];
  comparison: Comparison;
  value: number;
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

export interface TotalLifeCountCondition {
  condition: "totalLifeCount";
  comparison: Comparison;
  value: number;
}

export interface RestedCardCountCondition {
  condition: "restedCardCount";
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
  state?: "active" | "rested";
}

export interface DonFieldComparisonCondition {
  condition: "donFieldComparison";
  /** Comparison of self's DON!! count relative to opponent's */
  selfComparison: Comparison;
  /** Minimum numeric gap between the two fields; defaults to zero. */
  difference?: number;
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
  target?: Target;
}

export interface ExistsOnFieldCondition {
  condition: "existsOnField";
  player?: Player;
  zone: Zone;
  filters: TargetFilter[];
}

export interface PreviousActionTargetCondition {
  condition: "previousActionTarget";
  filters: TargetFilter[];
}

export interface TriggerEventCondition {
  condition: "triggerEvent";
  event: EffectTrigger;
  source?: "opponentEffect" | "opponentCharacterEffect" | "effect";
}

export interface TriggerEventCardCondition {
  condition: "triggerEventCard";
  filters: TargetFilter[];
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
