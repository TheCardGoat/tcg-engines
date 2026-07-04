import type { OPAttribute, OPCardType, OPColor } from "../card.ts";
import type {
  Comparison,
  EffectTrigger,
  Keyword,
  Player,
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
  | ColorFilter
  | CardCategoryFilter
  | StateFilter
  | HasKeywordFilter
  | HasTriggerFilter
  | HasEffectTypeFilter
  | PlayerFilter
  | DynamicCostFilter
  | NoBaseEffectFilter;

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
  value: string;
  negate?: boolean;
}

export interface AttributeFilter {
  filter: "attribute";
  value: OPAttribute;
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

// ──────────────────────────────────────────────
// Target
// ──────────────────────────────────────────────

export interface TotalConstraint {
  property: "cost" | "power";
  comparison: Comparison;
  value: number;
}

export interface Target {
  player: Player;
  zones: Zone[];
  count: TargetCount;
  filters?: TargetFilter[];
  totalConstraint?: TotalConstraint;
  /** True when the target is the card bearing this effect */
  self?: boolean;
  /** Who selects the target; defaults to effect controller when omitted */
  chosenBy?: Player;
}
