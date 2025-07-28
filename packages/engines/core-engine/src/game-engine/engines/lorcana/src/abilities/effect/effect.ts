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
  ConditionalTargetEffect,
  CostReductionEffect,
  DealDamageEffect,
  DiscardEffect,
  DrawEffect,
  ExertCardEffect,
  GainLoreEffect,
  GainsAbilityEffect,
  GetEffect,
  LorcanaEffect,
  LoseLoreEffect,
  ModalEffect,
  MoveCardEffect,
  RemoveDamageEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import { chosenCardFromHandTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { PlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { CardTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/targets";
import type { LorcanaZone } from "~/game-engine/engines/lorcana/src/lorcana-engine-types";

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
}: {
  targets?: CardTarget | CardTarget[];
  followedBy?: LorcanaEffect;
} = {}): BanishEffect {
  return {
    type: "banish",
    targets: Array.isArray(targets) ? targets : [targets],
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
  targets: PlayerTarget | PlayerTarget[];
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

export function readyEffect(params: { targets: CardTarget[] }): LorcanaEffect {
  return {
    type: "ready",
    ...params,
  };
}

export function restrictEffect(params: {
  targets: CardTarget[];
  restriction: "quest" | "ready" | "challengeable" | "challenge";
  duration: AbilityDuration;
}): LorcanaEffect {
  return {
    type: "restrict",
    ...params,
  };
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
} = {}): LorcanaEffect[] {
  return [
    moveCardEffect({
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
    }),
  ];
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

export function moveCardEffect({
  targets,
  zoneTo,
  zoneFrom,
  placement,
  exerted,
  followedBy,
}: {
  targets?: CardTarget[] | CardTarget;
  zoneTo: LorcanaZone;
  zoneFrom?: LorcanaZone;
  placement?: "top" | "bottom" | "random";
  exerted?: boolean;
  followedBy?: LorcanaEffect;
}): MoveCardEffect {
  return {
    type: "moveCard",
    targets: Array.isArray(targets) ? targets : [targets],
    parameters: { zoneTo, zoneFrom, placement, exerted },
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
  followedBy,
}: {
  to: LorcanaZone;
  from?: LorcanaZone;
  targets?: CardTarget[] | CardTarget;
  position?: "top" | "bottom";
  followedBy?: LorcanaEffect;
}): MoveCardEffect {
  return moveCardEffect({
    targets: targets,
    zoneTo: to,
    zoneFrom: from,
    placement: position,
    followedBy,
  });
}

export function discardCardEffect({
  value,
  targets,
  random,
}: {
  value: number | DynamicValue;
  targets?: PlayerTarget | PlayerTarget[];
  random?: boolean;
}): DiscardEffect {
  const playerTargets: PlayerTarget[] | undefined = targets
    ? Array.isArray(targets)
      ? targets
      : [targets]
    : undefined;

  return {
    type: "discard",
    targets: playerTargets,
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

export function readyAndRestrictQuestEffect(
  targets: CardTarget | CardTarget[],
) {
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
