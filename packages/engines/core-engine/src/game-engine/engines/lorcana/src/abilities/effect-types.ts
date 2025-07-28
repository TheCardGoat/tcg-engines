import type {
  AbilityDuration,
  Classification,
  ComparisonOperator,
  DynamicValue,
  Keyword,
  LorcanaAbility,
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
  followedBy?: LorcanaEffect; // Better name for effect chaining based on card text patterns
  condition?: EffectCondition;
}

interface BasePlayerEffect extends BaseEffect {
  targets?: PlayerTarget[];
}

interface BaseCardEffect extends BaseEffect {
  targets?: CardTarget[];
}

// Scry Effect (existing specific implementation)
export type ScryDestination = {
  zone: LorcanaZone;
  filter?: LorcanaCardFilter;
  value?: number;
  position?: "top" | "bottom";
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

export type ScryEffect = BasePlayerEffect & {
  type: "scry";
  parameters: ScryParameters;
};

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
  };
}

export interface ExertCardEffect extends BaseCardEffect {
  type: "exertCard";
}

// Player-targeting effects (effects that can only target players)
export interface DrawEffect extends BasePlayerEffect {
  type: "draw";
  parameters: {
    value: number | DynamicValue;
    target?: PlayerTarget;
  };
}

export interface GainLoreEffect extends BasePlayerEffect {
  type: "gainLore";
  parameters: {
    value: number | DynamicValue;
    target?: PlayerTarget;
  };
}

export interface LoseLoreEffect extends BasePlayerEffect {
  type: "loseLore";
  parameters: {
    value: number | DynamicValue;
  };
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

export interface DrawThenDiscardEffect extends BaseCardEffect {
  type: "drawThenDiscard";
  draw: number | DynamicValue;
  discard: number | DynamicValue;
}

export interface DiscardEffect extends BasePlayerEffect {
  type: "discard";
  parameters: {
    value: number | DynamicValue;
    random?: boolean;
  };
}

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

export interface CostReductionEffect extends BasePlayerEffect {
  type: "costReduction";
  parameters: {
    value: number | DynamicValue;
    cardType?: "character" | "item" | "location" | "action" | "song";
    filter?: LorcanaCardFilter;
    count?: number; // Number of cards this applies to
  };
}

type PlayerEffect =
  | ScryEffect
  | DrawEffect
  | GainLoreEffect
  | LoseLoreEffect
  | DiscardEffect
  | DrawThenDiscardEffect
  | CostReductionEffect;

type CardEffect =
  | GetEffect
  | BanishEffect
  | ExertCardEffect
  | DealDamageEffect
  | ConditionalTargetEffect
  | MoveCardEffect
  | ModifyStatEffect
  | ChallengeOverrideEffect
  | PreventDamageEffect
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
  | ModalEffect;

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
