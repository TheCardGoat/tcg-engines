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
import { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
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

export interface InkwellManagementEffect extends BasePlayerEffect {
  type: "inkwellManagement";
  parameters: {
    action: "exertAll" | "returnRandom" | "conditionalReturn";
    condition?: {
      type: "sizeGreaterThan";
      value: number;
    };
    targetSize?: number; // For returnRandom, return until this size
    count?: number; // For returnRandom, specific number to return
  };
}

export interface ConditionalPlayerEffect extends BasePlayerEffect {
  type: "conditionalPlayer";
  parameters: {
    condition: {
      type: "hasCardsInHand" | "handSizeComparison";
      maxCount?: number; // For hasCardsInHand
      minCount?: number; // For hasCardsInHand
      comparison?: "lessThan" | "greaterThan" | "equalTo"; // For handSizeComparison
      compareWith?: "opponent" | "target"; // For handSizeComparison
    };
    effect: LorcanaEffect;
    elseEffect?: LorcanaEffect;
  };
}

export interface RevealEffect extends BasePlayerEffect {
  type: "reveal";
  parameters: {
    from: LorcanaZone;
    count?: number;
    position?: "top" | "bottom" | "random";
    thenEffect?: LorcanaEffect; // What to do with revealed cards
  };
}

export interface PlayerChoiceEffect extends BasePlayerEffect {
  type: "playerChoice";
  parameters: {
    selection: {
      type: "anyNumber" | "exactly" | "upTo";
      count?: number; // For exactly/upTo
      from: PlayerTarget[]; // Available players to choose from
    };
    effect: LorcanaEffect; // Effect to apply to chosen players
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

export interface CostReductionEffect extends BasePlayerEffect {
  type: "costReduction";
  parameters: {
    value: number | DynamicValue;
    cardType?: "character" | "item" | "location" | "action" | "song";
    filter?: LorcanaCardFilter;
    count?: number; // Number of cards this applies to
  };
}

export interface PlayCardEffect extends BasePlayerEffect {
  type: "playCard";
  parameters: {
    from?: LorcanaZone;
    cost?: number | "free";
    filter?: LorcanaCardFilter;
    gainsAbilities?: LorcanaAbility[];
  };
}

export interface OptionalChoiceEffect extends BasePlayerEffect {
  type: "optionalChoice";
  parameters: {
    choice: LorcanaEffect; // The effect that can be chosen
    onDecline?: LorcanaEffect; // Effect that happens if choice is declined
    responder?: "self" | "opponent"; // Who makes the choice
  };
}

export interface OptionalPlayEffect extends BasePlayerEffect {
  type: "optionalPlay";
  parameters: {
    from?: LorcanaZone;
    cost?: number | "free";
    filter?: LorcanaCardFilter;
    gainsAbilities?: LorcanaAbility[];
    reveal?: boolean; // Whether the card must be revealed when played
  };
}

export interface NameCardEffect extends BasePlayerEffect {
  type: "nameCard";
  parameters: {
    followedBy: LorcanaEffect; // Effect that uses the named card
  };
}

export interface SearchDeckEffect extends BasePlayerEffect {
  type: "searchDeck";
  parameters: {
    cardType?: "character" | "action" | "item" | "location";
    filter?: LorcanaCardFilter;
    reveal?: boolean;
    toZone: LorcanaZone;
    shuffle?: boolean;
    optional?: boolean;
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

type PlayerEffect =
  | ScryEffect
  | DrawEffect
  | GainLoreEffect
  | LoseLoreEffect
  | DiscardEffect
  | DrawThenDiscardEffect
  | CostReductionEffect
  | PlayCardEffect
  | OptionalChoiceEffect
  | OptionalPlayEffect
  | NameCardEffect
  | SearchDeckEffect
  | RevealEffect
  | InkwellManagementEffect
  | ConditionalPlayerEffect
  | PlayerChoiceEffect;

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
