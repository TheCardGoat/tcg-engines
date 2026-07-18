import type { EffectTrigger, Keyword, Zone } from "./primitives.ts";
import type { Target, TargetFilter } from "./target.ts";
import type { Condition } from "./condition.ts";
import type { Cost } from "./cost.ts";
import type { Action } from "./action.ts";

export interface EffectEventFilter {
  player?: "self" | "opponent" | "any";
  causedBy?: "self" | "opponent" | "any";
  koCause?: "battle" | "effect";
  fromZone?: Zone;
  toZone?: Zone;
  targetSelf?: boolean;
  sourceSelf?: boolean;
  filters?: TargetFilter[];
  sourceFilters?: TargetFilter[];
  targetFilters?: TargetFilter[];
  sourceFromZone?: Zone;
  minimumAmount?: number;
}

export interface EffectBlock {
  trigger: EffectTrigger;
  source?: "opponentEffect" | "opponentCharacterEffect" | "effect";
  eventFilter?: EffectEventFilter;
  conditions?: Condition[];
  costs?: Cost[];
  actions: Action[];
  optional?: boolean;
  oncePerTurn?: boolean;
  oncePerTurnKey?: string;
}

export interface PermanentEffect {
  conditions?: Condition[];
  actions: Action[];
}

export interface ReplacementEffect {
  replacedEvent: "ko" | "removeFromField" | "loseGame" | "leaveField" | "rested";
  target?: Target;
  source?: "opponentEffect" | "opponentCharacterEffect" | "battle" | "effect";
  replacementAction: Action;
  eventFilter?: EffectEventFilter;
  conditions?: Condition[];
  oncePerTurn?: boolean;
  /** Mandatory printed replacement. Omitted replacement effects remain optional for compatibility. */
  mandatory?: true;
}

export type DeckBuildingRule =
  | { rule: "unlimitedCopies" }
  | { rule: "cannotInclude"; filters: TargetFilter[] };

export interface CardEffects {
  keywords?: Keyword[];
  effects?: EffectBlock[];
  permanentEffects?: PermanentEffect[];
  replacementEffects?: ReplacementEffect[];
  deckBuildingRules?: DeckBuildingRule[];
}
