import type { OPAttribute, OPCardType, OPColor } from "../card.ts";
import type {
  Comparison,
  EffectTrigger,
  Keyword,
  Player,
  TargetPlayer,
  TargetCount,
  Zone,
} from "./primitives.ts";

// ──────────────────────────────────────────────
// Target Filters
// ──────────────────────────────────────────────

export type TargetFilter =
  | NameFilter
  | ExcludeNameFilter
  | ExcludeSelfFilter
  | TraitFilter
  | AttributeFilter
  | CostFilter
  | BaseCostFilter
  | PowerFilter
  | BasePowerFilter
  | CounterFilter
  | ColorFilter
  | CardCategoryFilter
  | StateFilter
  | HasKeywordFilter
  | HasTriggerFilter
  | HasEffectTypeFilter
  | PlayerFilter
  | DynamicCostFilter
  | NoBaseEffectFilter
  | AnyOfFilter
  | AllOfFilter;

export interface NameFilter {
  filter: "name";
  value: string;
}

export interface ExcludeNameFilter {
  filter: "excludeName";
  value: string;
}

export interface ExcludeSelfFilter {
  filter: "excludeSelf";
}

export interface TraitFilter {
  filter: "trait";
  value: string | string[];
  match?: "exact" | "includes";
  negate?: boolean;
}

export interface AttributeFilter {
  filter: "attribute";
  value: OPAttribute;
  negate?: boolean;
}

export interface CostFilter {
  filter: "cost";
  comparison: Comparison;
  value: number;
}

export interface BaseCostFilter {
  filter: "baseCost";
  comparison: Comparison;
  value: number;
}

export interface PowerFilter {
  filter: "power";
  comparison: Comparison;
  value: number;
}

export interface BasePowerFilter {
  filter: "basePower";
  comparison: Comparison;
  value: number;
}

export interface CounterFilter {
  filter: "counter";
  comparison: Comparison;
  value: number;
}

export interface ColorFilter {
  filter: "color";
  value: OPColor;
}

export interface CardCategoryFilter {
  filter: "cardCategory";
  value: OPCardType;
}

export interface StateFilter {
  filter: "state";
  value: "rested" | "active";
}

export interface HasKeywordFilter {
  filter: "hasKeyword";
  value: Keyword;
}

export interface HasTriggerFilter {
  filter: "hasTrigger";
  value: boolean;
}

export interface HasEffectTypeFilter {
  filter: "hasEffectType";
  value: EffectTrigger;
  negate?: boolean;
}

export interface PlayerFilter {
  filter: "player";
  value: Player;
}

export interface DynamicCostFilter {
  filter: "dynamicCost";
  comparison: Comparison;
  source:
    | "opponentLifeCount"
    | "totalLifeCount"
    | "selfLifeCount"
    | "selfDonCount"
    | "opponentDonCount";
}

export interface NoBaseEffectFilter {
  filter: "noBaseEffect";
}

export type AnyOfFilter =
  | {
      filter: "anyOf";
      /** At least one nested filter must match against the same candidate card. */
      filters: TargetFilter[];
    }
  | {
      filter: "anyOf";
      /** Each group is ANDed internally; a candidate matches when any group matches. */
      groups: TargetFilter[][];
    };

export interface AllOfFilter {
  filter: "allOf";
  filters: TargetFilter[];
}

// ──────────────────────────────────────────────
// Target
// ──────────────────────────────────────────────

export interface TotalConstraint {
  property: "cost" | "power";
  comparison: Comparison;
  value: number;
}

export interface Target {
  player: TargetPlayer;
  zones: Zone[];
  count: TargetCount;
  filters?: TargetFilter[];
  totalConstraint?: TotalConstraint;
  /** True when the target is the card bearing this effect */
  self?: boolean;
  /** Who selects the target; defaults to effect controller when omitted */
  chosenBy?: Player;
}
