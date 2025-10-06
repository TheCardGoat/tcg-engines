import type {
  DynamicValue,
  LorcanaAbility,
  LorcanaEffect,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type { ScryEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/scry";
import type { BaseEffect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { PlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type {
  LorcanaCardFilter,
  LorcanaZone,
} from "~/game-engine/engines/lorcana/src/lorcana-engine-types";

export interface BasePlayerEffect extends BaseEffect {
  targets?: PlayerTarget[];
}

// Player-targeting effects (effects that can only target players)
export interface DrawEffect extends BasePlayerEffect {
  type: "draw";
  amount?: number | DynamicValue; // Legacy property name
  parameters?: {
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

export interface DrawThenDiscardEffect extends BasePlayerEffect {
  type: "drawThenDiscard";
  draw: number | DynamicValue;
  discard: number | DynamicValue;
}

export interface DiscardEffect extends BasePlayerEffect {
  type: "discard";
  amount?: number | DynamicValue; // Legacy property name
  parameters?: {
    value: number | DynamicValue;
    random?: boolean;
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

export interface CreateCardEffectForTargetPlayer extends BasePlayerEffect {
  type: "cardEffectForPlayer";
  parameters: {
    effects: LorcanaEffect[]; // Effect that uses the named card
  };
}

export type PlayerEffect =
  | ScryEffect
  | DrawEffect
  | GainLoreEffect
  | LoseLoreEffect
  | DiscardEffect
  | DrawThenDiscardEffect
  | CostReductionEffect
  | OptionalChoiceEffect
  | OptionalPlayEffect
  | NameCardEffect
  | SearchDeckEffect
  | RevealEffect
  | CreateCardEffectForTargetPlayer
  | InkwellManagementEffect
  | ConditionalPlayerEffect
  | PlayerChoiceEffect;
