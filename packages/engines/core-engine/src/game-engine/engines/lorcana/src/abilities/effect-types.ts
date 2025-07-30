import type {
  AbilityDuration,
  Classification,
  ComparisonOperator,
  DynamicValue,
  Keyword,
  LorcanaAbility,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type { PlayerEffect } from "~/game-engine/engines/lorcana/src/abilities/player-effect";
import type {
  AbilityTarget,
  CardTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/targets";
import type {
  LorcanaCardFilter,
  LorcanaZone,
} from "~/game-engine/engines/lorcana/src/lorcana-engine-types";

// Base effect properties shared by all effects
export interface BaseEffect {
  duration?: AbilityDuration;
  targets?: AbilityTarget[];
  optional?: boolean;
  followedBy?: LorcanaEffect; // Better name for effect chaining based on card text patterns
  condition?: EffectCondition;
}

interface BaseCardEffect extends BaseEffect {
  targets?: CardTarget[];
}

// Card-targeting effects (effects that can only target cards)
export interface GetEffect extends BaseCardEffect {
  type: "get";
  parameters: {
    attribute: "strength" | "lore" | "willpower";
    value: number | DynamicValue;
  };
}

export interface GainsAbilityEffect extends BaseCardEffect {
  type: "gainsAbility";
  parameters: {
    ability: LorcanaAbility;
  };
}

export interface ModifyStatEffect extends BaseCardEffect {
  type: "modifyStat";
  parameters: GetEffect["parameters"];
}

export interface BanishEffect extends BaseCardEffect {
  type: "banish";
}

export interface DealDamageEffect extends BaseCardEffect {
  type: "dealDamage";
  parameters: {
    value: number | DynamicValue;
  };
}

export interface PreventDamageEffect extends BaseCardEffect {
  type: "preventDamage";
  parameters: {
    value: number | DynamicValue;
  };
}

export interface DamageImmunityEffect extends BaseCardEffect {
  type: "damageImmunity";
  parameters: {
    sources: ("challenges" | "abilities" | "spells" | "all")[];
  };
}

export interface MoveToLocationEffect extends BaseCardEffect {
  type: "moveToLocation";
  parameters: {
    cost?: number; // Cost to move, 0 for free
    sameLocation?: boolean; // Whether all targets move to same location
    targetLocation?: CardTarget; // Specific location to move to (if not chosen)
  };
}

export interface ContextualEffect extends BaseCardEffect {
  type: "contextual";
  parameters: {
    context: {
      type: "whileChallenging";
      cardType?: "character" | "location";
    };
    effect: LorcanaEffect;
  };
}

export interface ReadyEffect extends BaseCardEffect {
  type: "ready";
}

export interface ExertEffect extends BaseCardEffect {
  type: "exert";
}

export interface RemoveDamageEffect extends BaseCardEffect {
  type: "removeDamage";
  parameters: {
    value: number | DynamicValue;
  };
}

export interface MoveCardEffect extends BaseCardEffect {
  type: "moveCard";
  parameters: {
    zoneTo: LorcanaZone;
    zoneFrom?: LorcanaZone;
    placement?: "top" | "bottom" | "random";
    exerted?: boolean;
    shuffle?: boolean;
    order?: "any" | "random"; // For player choice ordering
  };
}

export interface ExertCardEffect extends BaseCardEffect {
  type: "exertCard";
}

// Special effects
export interface MultiEffect extends BaseEffect {
  type: "multiEffect";
  parameters: {
    effects: LorcanaEffect[];
  };
}

// Modal effect type
export interface ModalEffect extends BaseEffect {
  type: "modal";
  parameters: {
    modes: Array<{
      text: string;
      effects: LorcanaEffect[];
    }>;
  };
}

export interface BasicInkwellTriggerEffect extends BaseEffect {
  type: "basicInkwellTrigger";
  parameters: {
    payInk?: number;
    requiresShift?: boolean;
    condition?: EffectCondition;
  };
}

export interface ChallengeOverrideEffect extends BaseCardEffect {
  type: "challengeOverride";
  parameters: {
    canChallenge: "evasive" | "ready" | "all";
    duration?: AbilityDuration;
  };
}

export interface RestrictEffect extends BaseCardEffect {
  type: "restrict";
  restriction: "quest" | "ready" | "challengeable" | "challenge";
}

// Multi-effects (can contain both card and player effects)
export interface ConditionalTargetEffect extends BaseCardEffect {
  type: "conditionalTarget";
  parameters: {
    targetCondition: {
      type: "hasClassification";
      classification: Classification;
    };
    effect: LorcanaEffect;
    elseEffect?: LorcanaEffect;
    duration?: AbilityDuration;
  };
}

export interface ConditionalEffect extends BaseEffect {
  type: "conditional";
  parameters: {
    condition: {
      type: "sameName" | "sameCardType" | "sameCost";
      compareWith: "previousTarget" | "namedCard";
    };
    ifTrue: LorcanaEffect;
    ifFalse?: LorcanaEffect;
  };
}

export interface PlayCardEffect extends BaseCardEffect {
  type: "playCard";
  parameters: {
    from?: LorcanaZone;
    cost?: number | "free";
    filter?: LorcanaCardFilter;
    gainsAbilities?: LorcanaAbility[];
  };
}

type CardEffect =
  | GetEffect
  | BanishEffect
  | ExertCardEffect
  | DealDamageEffect
  | ConditionalTargetEffect
  | PlayCardEffect
  | MoveCardEffect
  | ModifyStatEffect
  | ChallengeOverrideEffect
  | PreventDamageEffect
  | DamageImmunityEffect
  | MoveToLocationEffect
  | ContextualEffect
  | ReadyEffect
  | GainsAbilityEffect
  | RestrictEffect
  | ExertEffect
  | RemoveDamageEffect
  | BasicInkwellTriggerEffect;

// Union of all effect types
export type LorcanaEffect =
  | CardEffect
  | PlayerEffect
  | MultiEffect
  | ModalEffect
  | ConditionalEffect;

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
  comparison?: ComparisonOperator;
  comparisonValue?: number;
};
