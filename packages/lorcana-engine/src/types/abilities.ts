// Vibe Coding

import type { Effect } from "./effects";

// Base types for all abilities
interface BaseAbility {
  type: AbilityType;
  name?: string;
  text?: string;
  responder?: "self" | "opponent";
  conditions?: Condition[];
  costs?: Cost[];
  optional?: boolean;
  accepted?: boolean;
  resolveEffectsIndividually?: boolean;
  detrimental?: boolean;
  dependentEffects?: boolean;
  isPrivate?: boolean;
  oncePerTurn?: boolean;
  unless?: boolean;
}

// Types of abilities as defined in the rules
type AbilityType =
  | "keyword"
  | "triggered"
  | "activated"
  | "static"
  | "replacement"
  | "floating-triggered"
  | "play-condition";

// Types of costs that can be required for abilities
type Cost = {
  type: "exert" | "ink" | "banish" | "discard" | "custom";
  amount?: number;
  target?: EffectTarget;
};

// Types of conditions that can trigger abilities
interface Condition {
  type: "game-state" | "card-state" | "player-state" | "custom";
  value: string | number | boolean | Record<string, unknown>;
  operator: "equals" | "greater-than" | "less-than" | "contains" | "custom";
}

// Types of targets for effects
export type EffectTarget = {
  type: "card" | "player" | "zone" | "custom";
  filter?: TargetFilter;
  amount?: number;
};

// Specific ability types based on the rules

interface KeywordAbility extends BaseAbility {
  type: "keyword";
  keyword: KeywordType;
  value?: number; // For keywords that have a value (e.g., Challenger +2)
}

interface TriggeredAbility extends BaseAbility {
  type: "triggered";
  trigger: TriggerType;
  effects: Effect[];
  secondaryCondition?: Condition;
}

interface ActivatedAbility extends BaseAbility {
  type: "activated";
  costs: Cost[];
  effects: Effect[];
}

interface StaticAbility extends BaseAbility {
  type: "static";
  effects: Effect[];
  duration?: "permanent" | "turn" | "custom";
}

interface ReplacementAbility extends BaseAbility {
  type: "replacement";
  originalEffect: Effect;
  replacementEffect: Effect;
}

interface FloatingTriggeredAbility extends BaseAbility {
  type: "floating-triggered";
  trigger: TriggerType;
  effects: Effect[];
  duration: "turn" | "custom";
}

// Keyword types as defined in the rules
type KeywordType =
  | "bodyguard"
  | "challenger"
  | "evasive"
  | "reckless"
  | "resist"
  | "rush"
  | "shift"
  | "singer"
  | "sing-together"
  | "support"
  | "ward";

// Trigger types as defined in the rules
export type TriggerType =
  | "when-played"
  | "whenever-quests"
  | "whenever-challenges"
  | "whenever-sings"
  | "whenever-moves"
  | "whenever-shifts"
  | "whenever-banished"
  | "whenever-damaged"
  | "whenever-draws"
  | "whenever-moves-to-location"
  | "at-start-of-turn"
  | "at-end-of-turn"
  | "custom";

// Target filters for effects
export type TargetFilter = {
  type:
    | "card-type"
    | "classification"
    | "ink-type"
    | "name"
    | "cost"
    | "custom";
  value: string | number | boolean | Record<string, unknown>;
  operator: "equals" | "greater-than" | "less-than" | "contains" | "custom";
};

// Union type of all possible abilities
export type Ability =
  | KeywordAbility
  | TriggeredAbility
  | ActivatedAbility
  | StaticAbility
  | ReplacementAbility
  | FloatingTriggeredAbility;
