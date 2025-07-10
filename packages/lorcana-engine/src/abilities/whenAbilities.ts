import type {
  Ability,
  CardEffectTarget,
  Cost,
  DynamicAmount,
  Effect,
  ReplacementEffect,
  ResolutionAbility,
  StaticAbility,
  TargetFilter,
  TriggeredAbility,
} from "@lorcanito/lorcana-engine";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type {
  BanishTrigger,
  ChallengeTrigger,
  MovesToLocationTrigger,
  OnMoveTrigger,
  OnShiftTrigger,
} from "@lorcanito/lorcana-engine/abilities/triggers";
import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";

const movesToALocationTriggeredAbility = (params: {
  name: string;
  text: string;
  optional?: boolean;
  effects: Effect[];
  target: CardEffectTarget;
  source?: CardEffectTarget;
  conditions?: Condition[];
  oncePerTurn?: boolean;
  movingFrom?: MovesToLocationTrigger["movingFrom"];
}): TriggeredAbility => {
  const {
    optional,
    name,
    text,
    effects,
    target,
    source,
    conditions,
    movingFrom,
    oncePerTurn,
  } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    oncePerTurn,
    name,
    text,
    effects,
  };

  const trigger: MovesToLocationTrigger = {
    on: "moves-to-a-location",
    target: target,
    source: source,
    conditions,
    movingFrom,
    oncePerTurn,
  };

  return {
    type: "static-triggered",
    trigger: trigger,
    oncePerTurn,
    name,
    text,
    layer,
  };
};

export function whenYouMoveACharacterHere(params: {
  name: string;
  text: string;
  optional?: boolean;
  effects: Effect[];
  target?: CardEffectTarget;
  conditions?: Condition[];
  movingFrom?: MovesToLocationTrigger["movingFrom"];
}): TriggeredAbility {
  const source: CardEffectTarget = {
    type: "card",
    value: "all",
    filters: [{ filter: "source", value: "self" }],
  };
  const anyTarget: CardEffectTarget = {
    type: "card",
    value: "all",
    filters: [{ filter: "owner", value: "self" }],
  };
  return movesToALocationTriggeredAbility({
    ...params,
    source,
    target: params.target ? params.target : anyTarget,
  });
}

export const whenMovesToALocation = (params: {
  name: string;
  text: string;
  optional?: boolean;
  oncePerTurn?: boolean;
  effects: Effect[];
  conditions?: Condition[];
  target?: CardEffectTarget;
}): TriggeredAbility => {
  const target: CardEffectTarget = params.target || {
    type: "card",
    value: "all",
    filters: [{ filter: "source", value: "self" }],
  };

  return movesToALocationTriggeredAbility({ ...params, target });
};
export const whenPlayAndWhenLeaves = (params: {
  name: string;
  text: string;
  optional?: boolean;
  effects: Effect[];
}): Ability[] => {
  const { optional, name, text, effects } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    name,
    text,
    effects,
  };

  const trigger: OnMoveTrigger = {
    on: "leave",
    target: {
      type: "card",
      value: "all",
      filters: [{ filter: "source", value: "self" }],
    },
  };
  const staticTrigger: TriggeredAbility = {
    type: "static-triggered",
    name,
    text,
    trigger: trigger,
    layer,
  };

  return [layer, staticTrigger];
};
export const whenThisCharChallengesAndIsBanished = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
}): TriggeredAbility => {
  const { detrimental, optional, effects, name, text } = params;

  const trigger: BanishTrigger = {
    on: "banish",
    in: "challenge",
    as: "attacker",
    filters: [{ filter: "source", value: "self" }],
  };

  const ability: ResolutionAbility = {
    type: "resolution",
    detrimental,
    optional,
    name,
    text,
    effects,
  };

  return {
    type: "static-triggered",
    name,
    text,
    trigger: trigger,
    layer: ability,
  };
};
export const whenYourOtherCharactersIsBanished = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  conditions?: Condition[];
  triggerTarget?: TargetFilter[];
}): TriggeredAbility => {
  const { optional, effects, name, text, conditions, triggerTarget } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    name,
    text,
    effects,
  };

  return {
    type: "static-triggered",
    name,
    text,
    trigger: {
      on: "banish",
      exclude: "source",
      filters: triggerTarget || [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
      ],
    },
    conditions,
    layer: layer,
  };
};
export const whenThisCharacterBanished = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  conditions?: Condition[];
}): TriggeredAbility => {
  const { optional, effects, name, text, conditions } = params;
  return {
    type: "static-triggered",
    name,
    text,
    trigger: {
      on: "banish",
      filters: [{ filter: "source", value: "self" }],
      conditions,
    },
    layer: {
      type: "resolution",
      optional,
      name,
      text,
      effects,
    },
  };
};
export const whenThisCharacterBanishedInAChallenge = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  conditions?: Condition[];
}): TriggeredAbility => {
  const { optional, effects, name, text, conditions } = params;

  return {
    type: "static-triggered",
    name,
    text,
    conditions,
    trigger: {
      on: "banish",
      in: "challenge",
      as: "both",
      filters: [{ filter: "source", value: "self" }],
    } as BanishTrigger,
    layer: {
      type: "resolution",
      optional,
      name,
      text,
      effects,
    },
  };
};
export const whenChallengedAndBanished = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
}): TriggeredAbility => {
  const { optional, effects, name, text, responder } = params;

  return {
    type: "static-triggered",
    name,
    text,
    trigger: {
      on: "banish",
      in: "challenge",
      as: "defender",
    } as BanishTrigger,
    layer: {
      type: "resolution",
      responder,
      optional,
      name,
      text,
      effects,
    },
  };
};
export const whenChallenged = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
}): TriggeredAbility => {
  const { responder, optional, effects, name, text } = params;
  return {
    type: "static-triggered",
    name,
    text,
    trigger: {
      on: "challenge",
      as: "defender",
    } as ChallengeTrigger,
    layer: {
      type: "resolution",
      optional,
      responder,
      name,
      text,
      effects,
    },
  };
};
export const whenYouPlayThis = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
  resolveEffectsIndividually?: boolean;
  dependentEffects?: boolean;
  conditions?: ResolutionAbility["resolutionConditions"];
}): ResolutionAbility => {
  const {
    dependentEffects,
    resolveEffectsIndividually,
    optional,
    effects,
    conditions,
    responder,
    name,
    text,
  } = params;

  return {
    type: "resolution",
    resolutionConditions: conditions,
    optional,
    name,
    text,
    responder,
    effects,
    resolveEffectsIndividually,
    dependentEffects,
  };
};
export const whenPlayAndWheneverQuests = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  resolveEffectsIndividually?: boolean;
  dependentEffects?: boolean;
}): Ability[] => {
  const {
    dependentEffects,
    resolveEffectsIndividually,
    optional,
    effects,
    name,
    text,
  } = params;
  return [
    whenYouPlayThis({
      optional,
      name,
      text,
      effects,
      resolveEffectsIndividually,
      dependentEffects,
    }),
    wheneverQuests({
      effects,
      name,
      text,
      optional,
      resolveEffectsIndividually,
      dependentEffects,
    }),
  ];
};
export const whenYouPlayMayDrawACard: ResolutionAbility = {
  type: "resolution",
  optional: true,
  responder: "self",
  text: "When you play this, you may draw a card.",
  effects: [
    {
      type: "draw",
      amount: 1,
      target: {
        type: "player",
        value: "self",
      },
    },
  ],
};
export const whenPlayOnThisCard = (params: {
  effects: Effect[];
  target?: EffectTargets;
  triggerFilter?: TargetFilter[];
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  excludeSelf?: boolean;
  resolveEffectsIndividually?: boolean;
  costs?: Cost[];
  responder?: "opponent";
  conditions?: Condition[];
  shifterTargetFilters: TargetFilter[];
  shiftedTargetFilters: TargetFilter[];
}): TriggeredAbility => {
  const {
    detrimental,
    costs,
    optional,
    effects,
    resolveEffectsIndividually,
    name,
    text,
    responder,
    conditions,
    shifterTargetFilters,
    shiftedTargetFilters,
  } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    responder,
    name,
    resolveEffectsIndividually,
    text,
    optional,
    detrimental,
    effects,
    costs,
  };

  const trigger: OnShiftTrigger = {
    on: "shift",
    shifterFilter: shifterTargetFilters,
    shiftedFilter: shiftedTargetFilters,
    conditions,
  };

  return {
    type: "static-triggered",
    optional,
    name,
    text,
    trigger,
    layer,
  };
};
export const whenXIsBanished = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  conditions?: Condition[];
}): TriggeredAbility => {
  const { optional, effects, name, text, conditions } = params;
  return {
    type: "static-triggered",
    name,
    text,
    trigger: {
      on: "banish",
      filters: [{ filter: "source", value: "self" }],
      conditions,
    },
    layer: {
      type: "resolution",
      optional,
      name,
      text,
      effects,
    },
  };
};

export function whenYouPlayThisCharacter(params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
  resolveEffectsIndividually?: boolean;
  dependentEffects?: boolean;
  conditions?: ResolutionAbility["resolutionConditions"];
}) {
  return whenYouPlayThis(params);
}

// Sample text
// Playing this character costs you 2 {I} less if you have an Ally character in play.
export function whenYouPlayThisForEachYouPayLess(params: {
  name?: string;
  text?: string;
  amount: DynamicAmount | number;
  conditions?: Condition[];
}): StaticAbility {
  const { name, text, amount, conditions } = params;

  const costReplacementEffect: ReplacementEffect = {
    type: "replacement",
    replacement: "cost",
    duration: "next",
    amount: amount,
    target: thisCharacter,
  };

  return {
    type: "static",
    ability: "effects",
    name,
    text,
    conditions: conditions || [],
    effects: [costReplacementEffect],
  };
}

export function whenThisIsBanished({
  name,
  text,
  effects,
  optional,
}: {
  name: string;
  text: string;
  effects: Effect[];
  optional?: boolean;
}): TriggeredAbility {
  return {
    type: "static-triggered",
    trigger: {
      on: "banish",
      filters: [{ filter: "source", value: "self" }],
    },
    layer: {
      type: "resolution",
      optional,
      name,
      text,
      effects,
    },
  };
}

export function whenYouPlayThisCharAbility(
  ability: ResolutionAbility,
): ResolutionAbility {
  return ability;
}
