import type { EffectTrigger, Keyword } from "./primitives.ts";
import type { TargetFilter } from "./target.ts";
import type { Condition } from "./condition.ts";
import type { Cost } from "./cost.ts";
import type { Action } from "./action.ts";

export interface EffectBlock {
  trigger: EffectTrigger;
  conditions?: Condition[];
  costs?: Cost[];
  actions: Action[];
  optional?: boolean;
  oncePerTurn?: boolean;
}

export interface PermanentEffect {
  conditions?: Condition[];
  actions: Action[];
}

export interface ReplacementEffect {
  replacedEvent: "ko" | "removeFromField" | "loseGame" | "leaveField" | "rested";
  replacementAction: Action;
  conditions?: Condition[];
  oncePerTurn?: boolean;
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
