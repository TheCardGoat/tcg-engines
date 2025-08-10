import type {
  AbilityDuration,
  Classification,
  DynamicValue,
  LorcanaAbility,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import type {
  BanishEffect,
  ChallengeOverrideEffect,
  ConditionalEffect,
  ConditionalTargetEffect,
  ContextualEffect,
  DamageImmunityEffect,
  DealDamageEffect,
  ExertCardEffect,
  GainsAbilityEffect,
  GetEffect,
  LorcanaEffect,
  ModalEffect,
  MoveCardEffect,
  MoveToLocationEffect,
  PlayCardEffect,
  ReadyEffect,
  RemoveDamageEffect,
  RestrictEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type {
  ConditionalPlayerEffect,
  CostReductionEffect,
  CreateCardEffectForTargetPlayer,
  DiscardEffect,
  DrawEffect,
  GainLoreEffect,
  InkwellManagementEffect,
  LoseLoreEffect,
  NameCardEffect,
  OptionalChoiceEffect,
  OptionalPlayEffect,
  PlayerChoiceEffect,
  RevealEffect,
  SearchDeckEffect,
} from "~/game-engine/engines/lorcana/src/abilities/player-effect";
import type { PlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { CardTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/targets";
import type {
  LorcanaCardFilter,
  LorcanaZone,
} from "~/game-engine/engines/lorcana/src/lorcana-engine-types";

export function getEffect({
  attribute,
  value,
  targets,
  duration,
}: {
  attribute: "strength" | "willpower" | "lore";
  value?: number | DynamicValue;
  targets?: CardTarget | CardTarget[];
  duration?: AbilityDuration;
}): GetEffect {
  return {
    type: "get",
    duration,
    targets: Array.isArray(targets) ? targets : [targets],
    parameters: {
      attribute,
      value,
    },
  };
}

export function gainsAbilityEffect({
  targets,
  duration,
  ability,
}: {
  ability: LorcanaAbility;
  targets?: CardTarget | CardTarget[];
  duration?: AbilityDuration;
}): GainsAbilityEffect {
  return {
    type: "gainsAbility",
    duration,
    targets: Array.isArray(targets) ? targets : [targets],
    parameters: {
      ability,
    },
  };
}

export function banishEffect({
  targets,
  followedBy,
  optional,
}: {
  targets?: CardTarget | CardTarget[];
  followedBy?: LorcanaEffect;
  optional?: boolean;
} = {}): BanishEffect {
  return {
    type: "banish",
    targets: Array.isArray(targets) ? targets : [targets],
    optional,
    followedBy: followedBy,
  };
}

// Implementation that handles both signatures
export function drawCardEffect({
  targets,
  value,
  followedBy,
}: {
  targets?: PlayerTarget | PlayerTarget[];
  value?: number | DynamicValue;
  followedBy?: LorcanaEffect;
} = {}): DrawEffect {
  // New API with 'target'
  return {
    type: "draw",
    parameters: {
      value: value || 1,
    },
    targets: Array.isArray(targets) ? targets : [targets],
    followedBy: followedBy,
  };
}

// Implementation that handles both signatures
export function gainLoreEffect({
  targets,
  value,
  followedBy,
}: {
  targets?: PlayerTarget | PlayerTarget[];
  value?: number | DynamicValue;
  followedBy?: LorcanaEffect;
}): GainLoreEffect {
  return {
    type: "gainLore",
    parameters: {
      value: value || 1,
    },
    targets: Array.isArray(targets) ? targets : [targets],
    followedBy: followedBy,
  };
}

// Implementation that handles both signatures
export function loseLoreEffect({
  targets,
  value,
  followedBy,
}: {
  targets?: PlayerTarget | PlayerTarget[];
  value?: number | DynamicValue;
  followedBy?: LorcanaEffect;
}): LoseLoreEffect {
  // New API with 'target'
  return {
    type: "loseLore",
    parameters: {
      value: value || 1,
    },
    targets: Array.isArray(targets) ? targets : [targets],
    followedBy: followedBy,
  };
}

export function readyEffect(params: { targets: CardTarget[] }): ReadyEffect {
  return {
    type: "ready",
    ...params,
  };
}

export function restrictEffect(params: {
  targets: CardTarget[];
  restriction: "quest" | "ready" | "challengeable" | "challenge";
  duration: AbilityDuration;
}): RestrictEffect {
  return {
    type: "restrict",
    ...params,
  };
}

export function readyAndCantQuest(params: {
  targets: CardTarget[];
  duration: AbilityDuration;
}): [ReadyEffect, RestrictEffect] {
  return [
    readyEffect(params),
    restrictEffect({ ...params, restriction: "quest" }),
  ];
}

// Implementation that handles both signatures
export function dealDamageEffect({
  targets,
  value,
  followedBy,
}: {
  targets?: CardTarget | CardTarget[];
  value: number | DynamicValue;
  source?: string;
  followedBy?: LorcanaEffect;
}): DealDamageEffect {
  return {
    type: "dealDamage",
    targets: Array.isArray(targets) ? targets : [targets],
    parameters: {
      value: value || 1,
    },
    followedBy: followedBy,
  };
}

export function removeDamageEffect({
  targets,
  value,
  followedBy,
}: {
  targets?: CardTarget | CardTarget[];
  value: number | DynamicValue;
  followedBy?: LorcanaEffect;
}): RemoveDamageEffect {
  return {
    type: "removeDamage",
    targets: Array.isArray(targets) ? targets : [targets],
    parameters: { value },
    followedBy,
  };
}

export function putDamageEffect({
  targets,
  value,
  followedBy,
}: {
  targets?: CardTarget | CardTarget[];
  value?: number | DynamicValue;
  followedBy?: LorcanaEffect;
}): DealDamageEffect {
  return {
    type: "dealDamage",
    targets: Array.isArray(targets) ? targets : [targets],
    parameters: {
      value: value || 1,
    },
    followedBy: followedBy,
  };
}

export function moveDamageEffect({
  fromTargets,
  toTargets,
  value,
  followedBy,
}: {
  fromTargets: CardTarget | CardTarget[];
  toTargets: CardTarget | CardTarget[];
  value?: number | DynamicValue;
  followedBy?: LorcanaEffect;
}): LorcanaEffect[] {
  const damageValue = value || 1;
  return [
    removeDamageEffect({
      targets: fromTargets,
      value: damageValue,
    }),
    putDamageEffect({
      targets: toTargets,
      value: damageValue,
      followedBy,
    }),
  ];
}

export function moveDamageFromEachEffect({
  fromFilter,
  toTargets,
  value,
  followedBy,
}: {
  fromFilter: any; // LorcanaCardFilter type
  toTargets: CardTarget | CardTarget[];
  value?: number | DynamicValue;
  followedBy?: LorcanaEffect;
}): LorcanaEffect[] {
  const damageValue = value || 1;
  return [
    removeDamageEffect({
      targets: [
        {
          type: "card",
          filter: fromFilter,
          count: -1, // All matching cards
        },
      ],
      value: damageValue,
    }),
    putDamageEffect({
      targets: toTargets,
      value: {
        type: "count",
        filter: fromFilter,
        multiplier: typeof damageValue === "number" ? damageValue : 1,
      } as DynamicValue,
      followedBy,
    }),
  ];
}

export function millEffect({
  value,
  owner,
  followedBy,
}: {
  value: number | DynamicValue;
  owner?: "self" | "opponent";
  followedBy?: LorcanaEffect;
}): MoveCardEffect {
  return moveCardEffect({
    targets: [
      {
        type: "card",
        zone: "deck",
        count: typeof value === "number" ? value : 1,
        owner: owner || "self",
      },
    ],
    zoneTo: "discard",
    zoneFrom: "deck",
    placement: "top",
    followedBy,
  });
}

export function discardHandEffect({
  targets,
  followedBy,
}: {
  targets?: PlayerTarget | PlayerTarget[];
  followedBy?: LorcanaEffect;
} = {}): LorcanaEffect {
  return moveCardEffect({
    targets: [
      {
        type: "card",
        zone: "hand",
        count: -1, // All cards in hand
        owner: "self",
      },
    ],
    zoneTo: "discard",
    zoneFrom: "hand",
    followedBy,
  });
}

export function costReductionEffect({
  targets,
  value,
  cardType,
  count,
  filter,
  duration,
  followedBy,
}: {
  targets?: PlayerTarget | PlayerTarget[];
  value: number | DynamicValue;
  cardType?: "character" | "item" | "location" | "action" | "song";
  count?: number;
  filter?: any;
  duration?: AbilityDuration;
  followedBy?: LorcanaEffect;
}): CostReductionEffect {
  return {
    type: "costReduction",
    targets: Array.isArray(targets) ? targets : [targets],
    parameters: {
      value,
      cardType,
      count,
      filter,
    },
    duration,
    followedBy,
  };
}

export function playCardEffect({
  targets,
  from,
  cost,
  filter,
  gainsAbilities,
  followedBy,
}: {
  targets?: CardTarget | CardTarget[];
  from?: LorcanaZone;
  cost?: number | "free";
  filter?: any;
  gainsAbilities?: LorcanaAbility[];
  followedBy?: LorcanaEffect;
}): PlayCardEffect {
  return {
    type: "playCard",
    targets: Array.isArray(targets) ? targets : [targets],
    parameters: {
      from,
      cost,
      filter,
      gainsAbilities,
    },
    followedBy,
  };
}

export function moveCardEffect({
  targets,
  zoneTo,
  zoneFrom,
  placement,
  exerted,
  shuffle,
  order,
  followedBy,
}: {
  targets?: CardTarget[] | CardTarget;
  zoneTo: LorcanaZone;
  zoneFrom?: LorcanaZone;
  placement?: "top" | "bottom" | "random";
  exerted?: boolean;
  shuffle?: boolean;
  order?: "any" | "random";
  followedBy?: LorcanaEffect;
}): MoveCardEffect {
  return {
    type: "moveCard",
    targets: Array.isArray(targets) ? targets : [targets],
    parameters: { zoneTo, zoneFrom, placement, exerted, shuffle, order },
    followedBy,
  };
}

export function exertCardEffect({
  targets,
  followedBy,
}: {
  targets?: CardTarget[] | CardTarget;
  followedBy?: LorcanaEffect;
}): ExertCardEffect {
  return {
    type: "exertCard",
    targets: Array.isArray(targets) ? targets : [targets],
    followedBy,
  };
}

export function returnCardEffect({
  to,
  from,
  targets,
  followedBy,
}: {
  to: LorcanaZone;
  from?: LorcanaZone;
  targets?: CardTarget[] | CardTarget;
  followedBy?: LorcanaEffect;
}): MoveCardEffect {
  return moveCardEffect({
    targets: targets,
    zoneTo: to,
    zoneFrom: from,
    followedBy,
  });
}

export function putCardEffect({
  to,
  from,
  targets,
  position,
  shuffle,
  order,
  followedBy,
  exerted,
}: {
  to: LorcanaZone;
  from?: LorcanaZone;
  targets?: CardTarget[] | CardTarget;
  position?: "top" | "bottom";
  shuffle?: boolean;
  order?: "any" | "random";
  followedBy?: LorcanaEffect;
  exerted?: boolean;
}): MoveCardEffect {
  return moveCardEffect({
    targets: targets,
    zoneTo: to,
    zoneFrom: from,
    placement: position,
    shuffle,
    order,
    followedBy,
    exerted,
  });
}

export function discardCardEffect({
  value,
  targets,
  random,
  optional,
  followedBy,
}: {
  value: number | DynamicValue;
  targets?: PlayerTarget | PlayerTarget[];
  random?: boolean;
  optional?: boolean;
  followedBy?: LorcanaEffect;
}): DiscardEffect {
  const playerTargets: PlayerTarget[] | undefined = targets
    ? Array.isArray(targets)
      ? targets
      : [targets]
    : undefined;

  return {
    type: "discard",
    targets: playerTargets,
    optional,
    followedBy,
    parameters: {
      value,
      random,
    },
  };
}

export function drawThenDiscardEffect(params: {
  draw: number | DynamicValue;
  discard: number | DynamicValue;
}): LorcanaEffect[] {
  return [
    drawCardEffect({ value: params.draw }),
    discardCardEffect({ value: params.discard }),
  ];
}

export function readyAndRestrictQuestEffect({
  targets,
  duration,
}: {
  targets?: CardTarget | CardTarget[];
  duration?: AbilityDuration;
}): LorcanaEffect[] {
  const arr = Array.isArray(targets) ? targets : [targets];
  return [
    readyEffect({ targets: arr }),
    restrictEffect({
      targets: arr,
      restriction: "quest",
      duration: FOR_THE_REST_OF_THIS_TURN,
    }),
  ];
}

// Modal effect helper
export function modalEffect(
  modes: Array<{ text: string; effects: LorcanaEffect[] }>,
): ModalEffect {
  return {
    type: "modal",
    parameters: {
      modes,
    },
  };
}

export function challengeOverrideEffect(params: {
  canChallenge: "evasive" | "ready" | "all";
  duration?: AbilityDuration;
}): ChallengeOverrideEffect {
  return {
    type: "challengeOverride",
    parameters: {
      canChallenge: params.canChallenge,
      duration: params.duration,
    },
  };
}

export function conditionalTargetEffect(params: {
  targetCondition: {
    type: "hasClassification";
    classification: Classification;
  };
  effect: LorcanaEffect;
  elseEffect?: LorcanaEffect;
  duration?: AbilityDuration;
  targets?: CardTarget[];
  optional?: boolean;
  followedBy?: LorcanaEffect;
}): ConditionalTargetEffect {
  return {
    type: "conditionalTarget",
    parameters: {
      targetCondition: params.targetCondition,
      elseEffect: params.elseEffect,
      effect: params.effect,
      duration: params.duration,
    },
    targets: params.targets,
    optional: params.optional,
    followedBy: params.followedBy,
  };
}

export function optionalChoiceEffect({
  choice,
  onDecline,
  responder = "self",
  targets,
}: {
  choice: LorcanaEffect;
  onDecline?: LorcanaEffect;
  responder?: "self" | "opponent";
  targets?: PlayerTarget | PlayerTarget[];
}): OptionalChoiceEffect {
  const playerTargets: PlayerTarget[] | undefined = targets
    ? Array.isArray(targets)
      ? targets
      : [targets]
    : undefined;

  return {
    type: "optionalChoice",
    targets: playerTargets,
    parameters: {
      choice,
      onDecline,
      responder,
    },
  };
}

export function optionalPlayEffect({
  targets,
  from = "hand",
  cost = "free",
  filter,
  gainsAbilities,
  reveal = false,
}: {
  targets?: PlayerTarget | PlayerTarget[];
  from?: LorcanaZone;
  cost?: number | "free";
  filter?: any;
  gainsAbilities?: LorcanaAbility[];
  reveal?: boolean;
}): OptionalPlayEffect {
  const playerTargets: PlayerTarget[] | undefined = targets
    ? Array.isArray(targets)
      ? targets
      : [targets]
    : undefined;

  return {
    type: "optionalPlay",
    targets: playerTargets,
    parameters: {
      from,
      cost,
      filter,
      gainsAbilities,
      reveal,
    },
  };
}

export function nameCardEffect({
  followedBy,
  targets,
}: {
  followedBy: LorcanaEffect;
  targets?: PlayerTarget | PlayerTarget[];
}): NameCardEffect {
  const playerTargets: PlayerTarget[] | undefined = targets
    ? Array.isArray(targets)
      ? targets
      : [targets]
    : undefined;

  return {
    type: "nameCard",
    targets: playerTargets,
    parameters: {
      followedBy,
    },
  };
}

export function searchDeckEffect({
  cardType,
  filter,
  reveal = false,
  toZone,
  shuffle = true,
  optional = false,
  targets,
}: {
  cardType?: "character" | "action" | "item" | "location";
  filter?: LorcanaCardFilter;
  reveal?: boolean;
  toZone: LorcanaZone;
  shuffle?: boolean;
  optional?: boolean;
  targets?: PlayerTarget | PlayerTarget[];
}): SearchDeckEffect {
  const playerTargets: PlayerTarget[] | undefined = targets
    ? Array.isArray(targets)
      ? targets
      : [targets]
    : undefined;

  return {
    type: "searchDeck",
    targets: playerTargets,
    parameters: {
      cardType,
      filter,
      reveal,
      toZone,
      shuffle,
      optional,
    },
  };
}

export function damageImmunityEffect({
  targets,
  sources = ["challenges"],
  duration,
}: {
  targets?: CardTarget | CardTarget[];
  sources?: ("challenges" | "abilities" | "spells" | "all")[];
  duration?: AbilityDuration;
}): DamageImmunityEffect {
  const cardTargets: CardTarget[] | undefined = targets
    ? Array.isArray(targets)
      ? targets
      : [targets]
    : undefined;

  return {
    type: "damageImmunity",
    targets: cardTargets,
    duration,
    parameters: {
      sources,
    },
  };
}

export function moveToLocationEffect({
  targets,
  cost = 0,
  sameLocation = false,
  targetLocation,
  optional = false,
  duration,
}: {
  targets?: CardTarget | CardTarget[];
  cost?: number;
  sameLocation?: boolean;
  targetLocation?: CardTarget;
  optional?: boolean;
  duration?: AbilityDuration;
}): MoveToLocationEffect {
  const cardTargets: CardTarget[] | undefined = targets
    ? Array.isArray(targets)
      ? targets
      : [targets]
    : undefined;

  return {
    type: "moveToLocation",
    targets: cardTargets,
    duration,
    optional,
    parameters: {
      cost,
      sameLocation,
      targetLocation,
    },
  };
}

export function contextualEffect({
  targets,
  context,
  effect,
  duration,
}: {
  targets?: CardTarget | CardTarget[];
  context: {
    type: "whileChallenging";
    cardType?: "character" | "location";
  };
  effect: LorcanaEffect;
  duration?: AbilityDuration;
}): ContextualEffect {
  const cardTargets: CardTarget[] | undefined = targets
    ? Array.isArray(targets)
      ? targets
      : [targets]
    : undefined;

  return {
    type: "contextual",
    targets: cardTargets,
    duration,
    parameters: {
      context,
      effect,
    },
  };
}

export function inkwellManagementEffect({
  targets,
  action,
  condition,
  targetSize,
  count,
}: {
  targets?: PlayerTarget | PlayerTarget[];
  action: "exertAll" | "returnRandom" | "conditionalReturn";
  condition?: {
    type: "sizeGreaterThan";
    value: number;
  };
  targetSize?: number;
  count?: number;
}): InkwellManagementEffect {
  const playerTargets: PlayerTarget[] | undefined = targets
    ? Array.isArray(targets)
      ? targets
      : [targets]
    : undefined;

  return {
    type: "inkwellManagement",
    targets: playerTargets,
    parameters: {
      action,
      condition,
      targetSize,
      count,
    },
  };
}

export function conditionalPlayerEffect({
  targets,
  condition,
  effect,
  elseEffect,
}: {
  targets?: PlayerTarget | PlayerTarget[];
  condition: {
    type: "hasCardsInHand" | "handSizeComparison";
    maxCount?: number;
    minCount?: number;
    comparison?: "lessThan" | "greaterThan" | "equalTo";
    compareWith?: "opponent" | "target";
  };
  effect: LorcanaEffect;
  elseEffect?: LorcanaEffect;
}): ConditionalPlayerEffect {
  const playerTargets: PlayerTarget[] | undefined = targets
    ? Array.isArray(targets)
      ? targets
      : [targets]
    : undefined;

  return {
    type: "conditionalPlayer",
    targets: playerTargets,
    parameters: {
      condition,
      effect,
      elseEffect,
    },
  };
}

export function revealEffect({
  targets,
  from,
  count = 1,
  position = "top",
  thenEffect,
}: {
  targets?: PlayerTarget | PlayerTarget[];
  from: LorcanaZone;
  count?: number;
  position?: "top" | "bottom" | "random";
  thenEffect?: LorcanaEffect;
}): RevealEffect {
  const playerTargets: PlayerTarget[] | undefined = targets
    ? Array.isArray(targets)
      ? targets
      : [targets]
    : undefined;

  return {
    type: "reveal",
    targets: playerTargets,
    parameters: {
      from,
      count,
      position,
      thenEffect,
    },
  };
}

export function conditionalEffect({
  condition,
  ifTrue,
  ifFalse,
}: {
  condition: {
    type: "sameName" | "sameCardType" | "sameCost";
    compareWith: "previousTarget" | "namedCard";
  };
  ifTrue: LorcanaEffect;
  ifFalse?: LorcanaEffect;
}): ConditionalEffect {
  return {
    type: "conditional",
    parameters: {
      condition,
      ifTrue,
      ifFalse,
    },
  };
}

export function playerChoiceEffect({
  selection,
  effect,
}: {
  selection: {
    type: "anyNumber" | "exactly" | "upTo";
    count?: number;
    from: PlayerTarget[];
  };
  effect: LorcanaEffect;
}): PlayerChoiceEffect {
  return {
    type: "playerChoice",
    parameters: {
      selection,
      effect,
    },
  };
}

export function createCardEffectsForTargetPlayer({
  effects,
}: {
  effects: LorcanaEffect[];
}): CreateCardEffectForTargetPlayer {
  return {
    type: "cardEffectForPlayer",
    parameters: {
      effects,
    },
  };
}
