import type {
  AbilityDuration,
  DynamicValue,
  Keyword,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type {
  BanishEffect,
  DealDamageEffect,
  DrawEffect,
  Effect,
  GainLoreEffect,
  GetEffect,
  LoseLoreEffect,
  MoveCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type {
  AbilityTarget,
  CardTarget,
  PlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/targets";
import type { LorcanaZone } from "~/game-engine/engines/lorcana/src/lorcana-engine-types";

// Backwards-compatible overloads for existing tests and code
/** @deprecated Use the new strongly typed version with proper targets */
export function getEffect({
  attribute,
  duration,
  value,
}: {
  attribute: "strength";
  value: number;
  duration?: AbilityDuration;
}): Effect;

// New strongly typed version
export function getEffect({
  keyword,
  keywordValue,
  target,
  duration,
}: {
  keyword: Keyword;
  keywordValue?: number;
  target: CardTarget;
  duration?: AbilityDuration;
}): GetEffect;

// Implementation that handles both signatures
export function getEffect(params: any): any {
  // Legacy API with 'attribute'
  if ("attribute" in params) {
    return {
      type: "get",
      parameters: {
        keyword: params.attribute as any, // Convert for backward compatibility
        keywordValue: params.value,
        target: createChosenCharacterTarget(), // Default target
      },
      duration: params.duration,
    };
  }

  // New API with 'keyword' and 'target'
  return {
    type: "get",
    parameters: {
      keyword: params.keyword,
      keywordValue: params.keywordValue,
      target: params.target,
    },
    duration: params.duration,
  };
}

/** @deprecated Use the new strongly typed version with proper targets */
export function banishEffect(params?: {
  targets?: AbilityTarget[];
  thenEffect?: Effect;
}): Effect;

// New strongly typed version
export function banishEffect({
  target,
  ignoreRestrictions,
  followedBy,
}: {
  target: CardTarget;
  ignoreRestrictions?: boolean;
  followedBy?: Effect;
}): BanishEffect;

// Implementation that handles both signatures
export function banishEffect(params: any = {}): any {
  // Legacy API with 'targets' and 'thenEffect'
  if ("targets" in params || "thenEffect" in params || !params.target) {
    return {
      type: "banish",
      parameters: {
        target: params.targets?.[0] || createChosenCharacterTarget(),
        ignoreRestrictions: false,
      },
      followedBy: params.thenEffect,
    };
  }

  // New API with 'target'
  return {
    type: "banish",
    parameters: {
      target: params.target,
      ignoreRestrictions: params.ignoreRestrictions,
    },
    followedBy: params.followedBy,
  };
}

/** @deprecated Use the new strongly typed version with proper targets */
export function drawCardEffect(params?: {
  targets?: AbilityTarget[];
  amount?: number | DynamicValue;
}): Effect;

// New strongly typed version
export function drawCardEffect({
  target,
  amount,
  followedBy,
}: {
  target: PlayerTarget;
  amount?: number | DynamicValue;
  followedBy?: Effect;
}): DrawEffect;

// Implementation that handles both signatures
export function drawCardEffect(params: any = {}): any {
  // Legacy API with 'targets'
  if ("targets" in params || !params.target) {
    return {
      type: "draw",
      parameters: {
        amount: params.amount || 1,
        target: params.targets?.[0] || createSelfPlayerTarget(),
      },
      followedBy: params.followedBy,
    };
  }

  // New API with 'target'
  return {
    type: "draw",
    parameters: {
      amount: params.amount || 1,
      target: params.target,
    },
    followedBy: params.followedBy,
  };
}

/** @deprecated Use the new strongly typed version with proper targets */
export function gainLoreEffect(params?: {
  targets?: AbilityTarget[];
  amount?: number | DynamicValue;
}): Effect;

// New strongly typed version
export function gainLoreEffect({
  target,
  amount,
  followedBy,
}: {
  target: PlayerTarget;
  amount?: number | DynamicValue;
  followedBy?: Effect;
}): GainLoreEffect;

// Implementation that handles both signatures
export function gainLoreEffect(params: any = {}): any {
  // Legacy API with 'targets'
  if ("targets" in params || !params.target) {
    return {
      type: "gainLore",
      parameters: {
        amount: params.amount || 1,
        target: params.targets?.[0] || createSelfPlayerTarget(),
      },
      followedBy: params.followedBy,
    };
  }

  // New API with 'target'
  return {
    type: "gainLore",
    parameters: {
      amount: params.amount || 1,
      target: params.target,
    },
    followedBy: params.followedBy,
  };
}

/** @deprecated Use the new strongly typed version with proper targets */
export function loseLoreEffect(params?: {
  targets?: AbilityTarget[];
  amount?: number | DynamicValue;
}): Effect;

// New strongly typed version
export function loseLoreEffect({
  target,
  amount,
  followedBy,
}: {
  target: PlayerTarget;
  amount?: number | DynamicValue;
  followedBy?: Effect;
}): LoseLoreEffect;

// Implementation that handles both signatures
export function loseLoreEffect(params: any = {}): any {
  // Legacy API with 'targets'
  if ("targets" in params || !params.target) {
    return {
      type: "loseLore",
      parameters: {
        amount: params.amount || 1,
        target: params.targets?.[0] || createSelfPlayerTarget(),
      },
      followedBy: params.followedBy,
    };
  }

  // New API with 'target'
  return {
    type: "loseLore",
    parameters: {
      amount: params.amount || 1,
      target: params.target,
    },
    followedBy: params.followedBy,
  };
}

/** @deprecated Use the new strongly typed version with proper targets */
export function dealDamageEffect(params?: {
  targets?: AbilityTarget[];
  amount?: number | DynamicValue;
}): Effect;

// New strongly typed version
export function dealDamageEffect({
  target,
  amount,
  source,
  followedBy,
}: {
  target: CardTarget;
  amount?: number | DynamicValue;
  source?: string;
  followedBy?: Effect;
}): DealDamageEffect;

// Implementation that handles both signatures
export function dealDamageEffect(params: any = {}): any {
  // Legacy API with 'targets'
  if ("targets" in params || !params.target) {
    return {
      type: "dealDamage",
      parameters: {
        amount: params.amount || 1,
        target: params.targets?.[0] || createChosenCharacterTarget(),
        source: params.source,
      },
      followedBy: params.followedBy,
    };
  }

  // New API with 'target'
  return {
    type: "dealDamage",
    parameters: {
      amount: params.amount || 1,
      target: params.target,
      source: params.source,
    },
    followedBy: params.followedBy,
  };
}

export function moveCardEffect({
  target,
  zoneTo,
  zoneFrom,
  placement,
  exerted,
  followedBy,
}: {
  target: CardTarget;
  zoneTo: LorcanaZone;
  zoneFrom?: LorcanaZone;
  placement?: "top" | "bottom" | "random";
  exerted?: boolean;
  followedBy?: Effect;
}): MoveCardEffect {
  return {
    type: "moveCard",
    parameters: { target, zoneTo, zoneFrom, placement, exerted: exerted },
    followedBy,
  };
}

// Common target helpers for convenience
export const createSelfPlayerTarget = (): PlayerTarget => ({
  type: "player",
  value: "self",
});

export const createOpponentPlayerTarget = (): PlayerTarget => ({
  type: "player",
  value: "opponent",
});

export const createChosenCharacterTarget = (): CardTarget => ({
  type: "card",
  cardType: "character",
  count: 1,
});

export const createChosenDamagedCharacterTarget = (): CardTarget => ({
  type: "card",
  cardType: "character",
  count: 1,
  damaged: true,
});

// Deprecated - kept for backward compatibility during migration
/** @deprecated Use the specific typed effect functions instead */
export function returnCardEffect({
  to,
  from,
  targets,
}: {
  to: LorcanaZone;
  from?: LorcanaZone;
  targets?: AbilityTarget[];
}): Effect {
  // Convert to new system - assuming first target is a card target
  const cardTarget =
    (targets?.[0] as CardTarget) || createChosenCharacterTarget();
  return moveCardEffect({
    target: cardTarget,
    zoneTo: to,
    zoneFrom: from,
  });
}
