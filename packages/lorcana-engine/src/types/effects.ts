// Vibe Coding

import type { EffectTarget } from "./abilities";

// Base interface for all effects
export interface BaseEffect {
  type: EffectType;
  target?: EffectTarget;
  amount?: number;
  duration?: "instant" | "turn" | "permanent" | "custom";
}

// Types of effects as defined in the rules
export type EffectType =
  | "damage"
  | "heal"
  | "draw"
  | "discard"
  | "banish"
  | "exert"
  | "ready"
  | "move"
  | "gain-lore"
  | "lose-lore"
  | "modify-strength"
  | "modify-willpower"
  | "modify-lore"
  | "gain-ability"
  | "lose-ability"
  | "prevent-damage"
  | "prevent-ability"
  | "prevent-action"
  | "custom";

// Specific effect types

export interface DamageEffect extends BaseEffect {
  type: "damage";
  target: EffectTarget;
  amount: number;
  preventable?: boolean;
}

export interface HealEffect extends BaseEffect {
  type: "heal";
  target: EffectTarget;
  amount: number;
}

export interface DrawEffect extends BaseEffect {
  type: "draw";
  amount: number;
}

export interface DiscardEffect extends BaseEffect {
  type: "discard";
  target: EffectTarget;
  amount: number;
}

export interface BanishEffect extends BaseEffect {
  type: "banish";
  target: EffectTarget;
}

export interface ExertEffect extends BaseEffect {
  type: "exert";
  target: EffectTarget;
}

export interface ReadyEffect extends BaseEffect {
  type: "ready";
  target: EffectTarget;
}

export interface MoveEffect extends BaseEffect {
  type: "move";
  target: EffectTarget;
  destination: EffectTarget;
}

export interface GainLoreEffect extends BaseEffect {
  type: "gain-lore";
  amount: number;
}

export interface LoseLoreEffect extends BaseEffect {
  type: "lose-lore";
  amount: number;
}

export interface ModifyStrengthEffect extends BaseEffect {
  type: "modify-strength";
  target: EffectTarget;
  amount: number;
  modifier: "add" | "subtract";
}

export interface ModifyWillpowerEffect extends BaseEffect {
  type: "modify-willpower";
  target: EffectTarget;
  amount: number;
  modifier: "add" | "subtract";
}

export interface ModifyLoreEffect extends BaseEffect {
  type: "modify-lore";
  target: EffectTarget;
  amount: number;
  modifier: "add" | "subtract";
}

export interface GainAbilityEffect extends BaseEffect {
  type: "gain-ability";
  target: EffectTarget;
  ability: string; // Reference to ability type
}

export interface LoseAbilityEffect extends BaseEffect {
  type: "lose-ability";
  target: EffectTarget;
  ability: string; // Reference to ability type
}

export interface PreventDamageEffect extends BaseEffect {
  type: "prevent-damage";
  target: EffectTarget;
  amount?: number;
}

export interface PreventAbilityEffect extends BaseEffect {
  type: "prevent-ability";
  target: EffectTarget;
  ability: string; // Reference to ability type
}

export interface PreventActionEffect extends BaseEffect {
  type: "prevent-action";
  target: EffectTarget;
  action: string; // Reference to action type
}

// Union type of all possible effects
export type Effect =
  | DamageEffect
  | HealEffect
  | DrawEffect
  | DiscardEffect
  | BanishEffect
  | ExertEffect
  | ReadyEffect
  | MoveEffect
  | GainLoreEffect
  | LoseLoreEffect
  | ModifyStrengthEffect
  | ModifyWillpowerEffect
  | ModifyLoreEffect
  | GainAbilityEffect
  | LoseAbilityEffect
  | PreventDamageEffect
  | PreventAbilityEffect
  | PreventActionEffect;
