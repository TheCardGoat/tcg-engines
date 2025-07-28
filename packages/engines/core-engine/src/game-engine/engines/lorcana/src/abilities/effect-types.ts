import type {
  AbilityDuration,
  DynamicValue,
  Keyword,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type {
  AbilityTarget,
  CardTarget,
  PlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/targets";
import type {
  LorcanaCardFilter,
  LorcanaZone,
} from "~/game-engine/engines/lorcana/src/lorcana-engine-types";

// Base effect properties shared by all effects
interface BaseEffect {
  duration?: AbilityDuration;
  targets?: AbilityTarget[];
  optional?: boolean;
  followedBy?: Effect; // Better name for effect chaining based on card text patterns
}

// Scry Effect (existing specific implementation)
export type ScryDestination = {
  zone: LorcanaZone;
  filter?: LorcanaCardFilter;
  value?: number;
  location?: "top" | "bottom";
  shuffle?: boolean;
  remainder?: boolean;
  exerted?: boolean;
  order?: "any" | "random";
  reveal?: boolean;
  max?: number;
  min?: number;
};

export type ScryParameters = {
  lookAt: number;
  destinations: ScryDestination[];
};

export type ScryEffect = BaseEffect & {
  type: "scry";
  parameters: ScryParameters;
};

// Card-targeting effects (effects that can only target cards)
export type GetEffect = BaseEffect & {
  type: "get";
  parameters: {
    keyword: Keyword;
    keywordValue?: number;
    target: CardTarget;
  };
};

export type BanishEffect = BaseEffect & {
  type: "banish";
  parameters: {
    target: CardTarget;
    ignoreRestrictions?: boolean;
  };
};

export type DealDamageEffect = BaseEffect & {
  type: "dealDamage";
  parameters: {
    amount: number | DynamicValue;
    target: CardTarget;
    source?: string;
  };
};

export type ModifyStatEffect = BaseEffect & {
  type: "modifyStat";
  parameters: {
    stat: "strength" | "willpower" | "lore";
    value: number | DynamicValue;
    target: CardTarget;
  };
};

export type PreventDamageEffect = BaseEffect & {
  type: "preventDamage";
  parameters: {
    amount?: number | DynamicValue;
    target: CardTarget;
    condition?: EffectCondition;
  };
};

export type ReadyEffect = BaseEffect & {
  type: "ready";
  parameters: {
    target: CardTarget;
    ignoreRestrictions?: boolean;
  };
};

export type ExertEffect = BaseEffect & {
  type: "exert";
  parameters: {
    target: CardTarget;
    ignoreRestrictions?: boolean;
  };
};

export type RemoveDamageEffect = BaseEffect & {
  type: "removeDamage";
  parameters: {
    amount: number | DynamicValue;
    target: CardTarget;
  };
};

export type MoveCardEffect = BaseEffect & {
  type: "moveCard";
  parameters: {
    target: CardTarget;
    zoneTo: LorcanaZone;
    zoneFrom?: LorcanaZone;
    placement?: "top" | "bottom" | "random";
    exerted?: boolean;
  };
};

// Player-targeting effects (effects that can only target players)
export type DrawEffect = BaseEffect & {
  type: "draw";
  parameters: {
    amount: number | DynamicValue;
    target: PlayerTarget;
  };
};

export type GainLoreEffect = BaseEffect & {
  type: "gainLore";
  parameters: {
    amount: number | DynamicValue;
    target: PlayerTarget;
  };
};

export type LoseLoreEffect = BaseEffect & {
  type: "loseLore";
  parameters: {
    amount: number | DynamicValue;
    target: PlayerTarget;
  };
};

// Special effects
export type MultiEffect = BaseEffect & {
  type: "multiEffect";
  parameters: {
    effects: Effect[];
  };
};

export type BasicInkwellTriggerEffect = BaseEffect & {
  type: "basicInkwellTrigger";
  parameters: {
    payInk?: number;
    requiresShift?: boolean;
    condition?: EffectCondition;
  };
};

// Union of all effect types
export type Effect =
  | ScryEffect
  | GetEffect
  | BanishEffect
  | DrawEffect
  | GainLoreEffect
  | LoseLoreEffect
  | DealDamageEffect
  | MoveCardEffect
  | ModifyStatEffect
  | MultiEffect
  | PreventDamageEffect
  | ReadyEffect
  | ExertEffect
  | RemoveDamageEffect
  | BasicInkwellTriggerEffect;

// Effect condition type (preserved from original)
export type EffectCondition = {
  type:
    | "hasKeyword"
    | "hasDamage"
    | "hasCardInPlay"
    | "hasCardsInHand"
    | "hasZoneCount"
    | "statComparison"
    | "playerHasMoreLore";
  keyword?: Keyword;
  cardName?: string;
  classification?: string;
  minCount?: number;
  maxCount?: number;
  zone?: LorcanaZone;
  stat?: "strength" | "willpower" | "lore";
  comparison?:
    | "greaterThan"
    | "lessThan"
    | "equalTo"
    | "greaterThanOrEqual"
    | "lessThanOrEqual";
  comparisonValue?: number;
};

// Type guards for runtime validation
export const isCardTargetingEffect = (
  effect: Effect,
): effect is Effect & { parameters: { target: CardTarget } } => {
  return (
    "parameters" in effect &&
    effect.parameters &&
    "target" in effect.parameters &&
    effect.parameters.target &&
    effect.parameters.target.type === "card"
  );
};

export const isPlayerTargetingEffect = (
  effect: Effect,
): effect is Effect & { parameters: { target: PlayerTarget } } => {
  return (
    "parameters" in effect &&
    effect.parameters &&
    "target" in effect.parameters &&
    effect.parameters.target &&
    effect.parameters.target.type === "player"
  );
};

// Helper function to validate effect target consistency
export const validateEffectTargets = (effect: Effect): boolean => {
  const cardTargetingEffects: Effect["type"][] = [
    "get",
    "banish",
    "dealDamage",
    "modifyStat",
    "preventDamage",
    "ready",
    "exert",
    "removeDamage",
    "moveCard",
  ];

  const playerTargetingEffects: Effect["type"][] = [
    "draw",
    "gainLore",
    "loseLore",
  ];

  if (
    "parameters" in effect &&
    effect.parameters &&
    "target" in effect.parameters
  ) {
    const target = effect.parameters.target as AbilityTarget;

    if (cardTargetingEffects.includes(effect.type)) {
      return target.type === "card";
    }

    if (playerTargetingEffects.includes(effect.type)) {
      return target.type === "player";
    }
  }

  return true; // For effects without targets or special effects
};

// Factory functions for common effects (examples of usage)
export const createDealDamageEffect = (
  amount: number | DynamicValue,
  target: CardTarget,
  options?: {
    duration?: AbilityDuration;
    optional?: boolean;
    followedBy?: Effect;
  },
): DealDamageEffect => ({
  type: "dealDamage",
  parameters: { amount, target },
  ...options,
});

export const createDrawEffect = (
  amount: number | DynamicValue,
  target: PlayerTarget,
  options?: {
    duration?: AbilityDuration;
    optional?: boolean;
    followedBy?: Effect;
  },
): DrawEffect => ({
  type: "draw",
  parameters: { amount, target },
  ...options,
});

export const createGainLoreEffect = (
  amount: number | DynamicValue,
  target: PlayerTarget,
  options?: {
    duration?: AbilityDuration;
    optional?: boolean;
    followedBy?: Effect;
  },
): GainLoreEffect => ({
  type: "gainLore",
  parameters: { amount, target },
  ...options,
});

/* 
Example usage of the new strongly typed effects:

// This will work - correct target type
const damageEffect: DealDamageEffect = {
  type: "dealDamage",
  parameters: {
    amount: 2,
    target: { type: "card", cardType: "character" } // CardTarget
  }
};

// This will cause TypeScript error - wrong target type
const badDamageEffect: DealDamageEffect = {
  type: "dealDamage", 
  parameters: {
    amount: 2,
    target: { type: "player", value: "self" } // PlayerTarget - ERROR!
  }
};

// Chaining effects using followedBy
const chainedEffect: DealDamageEffect = {
  type: "dealDamage",
  parameters: {
    amount: 2,
    target: { type: "card", cardType: "character" }
  },
  followedBy: {
    type: "draw",
    parameters: {
      amount: 1,
      target: { type: "player", value: "self" }
    }
  }
};
*/
