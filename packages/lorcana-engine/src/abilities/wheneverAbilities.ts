import type {
  CardEffectTarget,
  Cost,
  Effect,
  ResolutionAbility,
  TargetFilter,
  TriggeredAbility,
  Zones,
} from "@lorcanito/lorcana-engine";
import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
import { anyCardYouOwn } from "@lorcanito/lorcana-engine/abilities/target";
import {
  thisCard,
  thisCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import type {
  BanishTrigger,
  ChallengeTrigger,
  DamageTrigger,
  DrawTrigger,
  OnMoveTrigger,
  QuestTrigger,
  SingTrigger,
} from "@lorcanito/lorcana-engine/abilities/triggers";
import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import { Characteristics } from "../cards/cardTypes";

export const wheneverIsExerted = (params: {
  name: string;
  text: string;
  optional?: boolean;
  effects: Effect[];
  target: CardEffectTarget;
}): TriggeredAbility => {
  const { optional, name, text, effects, target } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    name,
    text,
    effects,
  };

  const staticTrigger: TriggeredAbility = {
    type: "static-triggered",
    trigger: {
      on: "exert",
      target: target,
    },
    name,
    text,
    layer,
  };

  return staticTrigger;
};
export const wheneverIsReturnedToHand = (params: {
  name: string;
  text: string;
  optional?: boolean;
  effects: Effect[];
  target: CardEffectTarget;
  from?: Zones;
}): TriggeredAbility => {
  const { optional, name, text, effects, target } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    name,
    text,
    effects,
  };

  const trigger: OnMoveTrigger = {
    on: "leave",
    destination: "hand",
    // TODO: The trigger should also known source and destination.
    target: target,
    from: params.from,
  };

  const staticTrigger: TriggeredAbility = {
    type: "static-triggered",
    name,
    text,
    trigger,
    layer,
  };

  return staticTrigger;
};
export const wheneverACardIsPutIntoYourInkwell = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  oncePerTurn?: boolean;
  conditions?: Condition[];
  responder?: "self" | "opponent";
  costs?: Cost[];
  resolveEffectsIndividually?: boolean;
}): TriggeredAbility => {
  const {
    target,
    optional,
    effects,
    name,
    text,
    conditions,
    costs,
    oncePerTurn,
    responder,
    resolveEffectsIndividually,
  } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    oncePerTurn,
    optional,
    name,
    text,
    effects,
    costs,
    responder,
    resolveEffectsIndividually,
  };

  const trigger: OnMoveTrigger = {
    on: "inkwell",
    target: (target as CardEffectTarget) || anyCardYouOwn,
  };

  return {
    type: "static-triggered",
    oncePerTurn,
    name,
    text,
    trigger,
    conditions,
    layer,
  };
};
export const wheneverOneOfYourCharactersIsBanishedInAChallenge = (params: {
  effects: Effect[];
  target?: EffectTargets;
  triggerFilter?: TargetFilter[];
  name?: string;
  text?: string;
  optional?: boolean;
  conditions?: Condition[];
}): TriggeredAbility => {
  const { triggerFilter, optional, effects, name, text, conditions } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    name,
    text,
    effects,
  };

  const ability: TriggeredAbility = {
    type: "static-triggered",
    name,
    text,
    trigger: {
      on: "banish",
      in: "challenge",
      as: "both",
      exclude: "source",
      filters: triggerFilter,
    } as BanishTrigger,
    conditions,
    layer,
  };
  return ability;
};
// TODO: What's the difference between this and wheneverCharacterChallengesAndBanishes?
export const wheneverBanishesAnotherCharacterInChallenge = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
}): TriggeredAbility => {
  const { optional, effects, name, text, detrimental } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    name,
    text,
    detrimental,
    effects,
  };

  return {
    type: "static-triggered",
    name,
    text,
    layer: layer,
    trigger: {
      on: "banish-another",
      cardType: "character",
    },
  };
};
export const wheneverAnotherCharIsBanished = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
}): TriggeredAbility => {
  const { optional, effects, name, text } = params;
  return {
    type: "static-triggered",
    name,
    text,
    trigger: {
      on: "banish",
      exclude: "source",
      filters: [{ filter: "type", value: "character" }],
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
export const wheneverAnotherCharIsBanishedInChallenge = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
}): TriggeredAbility => {
  const { optional, effects, name, text } = params;
  return {
    type: "static-triggered",
    name,
    text,
    trigger: {
      on: "banish",
      exclude: "source",
      in: "challenge",
      filters: [{ filter: "type", value: "character" }],
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
export const wheneverOpposingCharIsBanishedInChallenge = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  conditions?: Condition[];
  costs?: Cost[];
}): TriggeredAbility => {
  const { optional, effects, name, text, conditions, costs } = params;
  const banishTrigger: BanishTrigger = {
    on: "banish",
    in: "challenge",
    exclude: "source",
    conditions,
    filters: [
      { filter: "type", value: "character" },
      { filter: "owner", value: "opponent" },
    ],
  };

  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    name,
    text,
    effects,
    costs,
  };

  return {
    type: "static-triggered",
    name,
    text,
    trigger: banishTrigger,
    layer,
  };
};
export const wheneverOpposingCharIsBanished = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  conditions?: Condition[];
}): TriggeredAbility => {
  const { optional, effects, name, text, conditions } = params;
  const banishTrigger: BanishTrigger = {
    on: "banish",
    exclude: "source",
    conditions,
    filters: [
      { filter: "type", value: "character" },
      { filter: "owner", value: "opponent" },
    ],
  };

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
    trigger: banishTrigger,
    layer,
  };
};
export const wheneverYouPlayAFloodBorn = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  excludeSelf?: boolean;
  responder?: "opponent";
  hasShifted?: boolean;
  costs?: Cost[];
}): TriggeredAbility => {
  return wheneverPlays({
    triggerTarget: {
      type: "card",
      value: "all",
      filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "characteristics", value: ["floodborn"] },
      ],
    },
    ...params,
  });
};
export const wheneverYouPlayACharacter = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  excludeSelf?: boolean;
  responder?: "opponent";
  hasShifted?: boolean;
  costs?: Cost[];
  conditions?: Condition[];
}): TriggeredAbility => {
  return wheneverPlays({
    triggerTarget: {
      type: "card",
      value: "all",
      filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
      ],
    },
    ...params,
  });
};

export const wheneverYouPlayAnotherCharacter = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  // excludeSelf?: boolean;
  responder?: "opponent";
  hasShifted?: boolean;
  costs?: Cost[];
  conditions?: Condition[];
}): TriggeredAbility => {
  return wheneverPlays({
    triggerTarget: {
      type: "card",
      value: "all",
      excludeSelf: true,
      filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
      ],
    },
    ...params,
  });
};

// whenever one of your (.*) characters is banished
// whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it’s a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.
export const wheneverOneOfYouCharactersIsBanished = (params: {
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
      filters: triggerTarget || [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
      ],
    },
    conditions,
    layer: layer,
  };
};
export const wheneverThisCharacterDealsDamageInChallenge = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  conditions?: Condition[];
}): TriggeredAbility => {
  const { optional, effects, name, text, conditions } = params;

  const damageTrigger: DamageTrigger = {
    on: "damage",
    dealt: true,
    inAChallenge: true,
    filters: [{ filter: "source", value: "self" }],
    defenderFilters: [{ filter: "type", value: "character" }],
  };

  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    name,
    text,
    effects,
  };

  return {
    type: "static-triggered",
    trigger: damageTrigger,
    conditions,
    name,
    text,
    layer,
  };
};
export const wheneverOneOfYourCharChallengesAnotherCharOrLocation = (params: {
  effects: Effect[];
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
  defenderFilter?: TargetFilter[];
  attackerFilter?: TargetFilter[];
}): TriggeredAbility => {
  const {
    responder,
    optional,
    effects,
    name,
    text,
    defenderFilter,
    attackerFilter,
  } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    responder,
    name,
    text,
    effects,
  };

  const trigger: ChallengeTrigger = {
    on: "challenge",
    as: "attacker",
    filters: attackerFilter || [{ filter: "source", value: "self" }],
    secondaryFilters: defenderFilter
      ? [
          { filter: "type", value: ["character", "location"] },
          ...defenderFilter,
        ]
      : [{ filter: "type", value: ["character", "location"] }],
  };

  return {
    type: "static-triggered",
    name,
    text,
    layer,
    trigger: trigger,
  };
};
export const wheneverChallengesAnotherChar = (params: {
  effects: Effect[];
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
  defenderFilter?: TargetFilter[];
  attackerFilters?: TargetFilter[];
}): TriggeredAbility => {
  const {
    responder,
    optional,
    effects,
    name,
    text,
    defenderFilter,
    attackerFilters,
  } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    responder,
    name,
    text,
    effects,
  };

  const trigger: ChallengeTrigger = {
    on: "challenge",
    as: "attacker",
    filters: attackerFilters || [{ filter: "source", value: "self" }],
    secondaryFilters: defenderFilter
      ? [{ filter: "type", value: "character" }, ...defenderFilter]
      : [{ filter: "type", value: "character" }],
  };

  return {
    type: "static-triggered",
    name,
    text,
    layer,
    trigger: trigger,
  };
};
export const wheneverACharacterQuests = (params: {
  effects: Effect[];
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
  characterFilter: TargetFilter[];
  dependentEffects?: boolean;
  resolveEffectsIndividually?: boolean;
}): TriggeredAbility => {
  const {
    dependentEffects,
    resolveEffectsIndividually,
    optional,
    effects,
    name,
    text,
    responder,
    characterFilter,
  } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    resolveEffectsIndividually,
    dependentEffects,
    responder,
    name,
    text,
    effects,
  };

  const questTrigger: QuestTrigger = {
    on: "quest",
    target: {
      type: "card",
      value: "all",
      filters: characterFilter,
    },
  };

  const ability: TriggeredAbility = {
    type: "static-triggered",
    name,
    text,
    trigger: questTrigger,
    layer,
  };

  return ability;
};

export function wheneverACharacterQuestsWhileHere(params: {
  effects: Effect[];
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
  dependentEffects?: boolean;
  resolveEffectsIndividually?: boolean;
  costs?: Cost[];
  conditions?: Condition[];
}) {
  return gainAbilityWhileHere({
    name: params.name,
    text: params.text,
    ability: wheneverQuests(params),
  });
}

export function wheneverOneOfYourCharsQuests(params: {
  effects: Effect[];
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
  dependentEffects?: boolean;
  resolveEffectsIndividually?: boolean;
  conditions?: Condition[];
}): TriggeredAbility {
  return wheneverQuests({
    ...params,
    triggerTarget: {
      type: "card",
      value: "all",
      filters: [
        { filter: "owner", value: "self" },
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
      ],
    },
  });
}

export const wheneverQuests = (params: {
  effects: Effect[];
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
  dependentEffects?: boolean;
  resolveEffectsIndividually?: boolean;
  conditions?: Condition[];
  costs?: Cost[];
  triggerTarget?: CardEffectTarget;
  nameACard?: boolean;
}): TriggeredAbility => {
  const {
    dependentEffects,
    resolveEffectsIndividually,
    optional,
    effects,
    name,
    text,
    conditions,
    responder,
    costs,
    triggerTarget,
    nameACard,
  } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    resolveEffectsIndividually,
    dependentEffects,
    responder,
    costs,
    name,
    text,
    effects,
    nameACard,
  };

  const questTrigger: QuestTrigger = {
    on: "quest",
    target: triggerTarget || thisCharacter,
  };

  const ability: TriggeredAbility = {
    type: "static-triggered",
    name,
    text,
    trigger: questTrigger,
    conditions,
    layer,
  };

  return ability;
};
export const wheneverThisCharacterQuests = (params: {
  effects: Effect[];
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
  dependentEffects?: boolean;
  resolveEffectsIndividually?: boolean;
  conditions?: Condition[];
  costs?: Cost[];
  triggerTarget?: CardEffectTarget;
  nameACard?: boolean;
}): TriggeredAbility => {
  return wheneverQuests(params);
};
export const wheneverOneOfYourCharactersSings = (params: {
  effects: Effect[];
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
  dependentEffects?: boolean;
  resolveEffectsIndividually?: boolean;
  oncePerTurn?: boolean;
  conditions?: Condition[];
}): TriggeredAbility => {
  const {
    dependentEffects,
    resolveEffectsIndividually,
    optional,
    effects,
    name,
    text,
    responder,
    oncePerTurn,
  } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    resolveEffectsIndividually,
    dependentEffects,
    responder,
    name,
    text,
    effects,
  };

  const trigger: SingTrigger = {
    on: "sing",
    target: {
      type: "card",
      value: "all",
      filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "action" },
        { filter: "characteristics", value: ["song"] },
      ],
    },
  };
  const ability: TriggeredAbility = {
    type: "static-triggered",
    name,
    text,
    trigger,
    layer,
    oncePerTurn,
  };

  return ability;
};
export const wheneverThisCharSings = (params: {
  effects: Effect[];
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
  dependentEffects?: boolean;
  resolveEffectsIndividually?: boolean;
}): TriggeredAbility => {
  const {
    dependentEffects,
    resolveEffectsIndividually,
    optional,
    effects,
    name,
    text,
    responder,
  } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    resolveEffectsIndividually,
    dependentEffects,
    responder,
    name,
    text,
    effects,
  };

  const trigger: SingTrigger = {
    on: "sing",
    onlySelf: true,
    target: {
      type: "card",
      value: "all",
      filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "action" },
        { filter: "characteristics", value: ["song"] },
      ],
    },
  };
  const ability: TriggeredAbility = {
    type: "static-triggered",
    name,
    text,
    trigger,
    layer,
  };

  return ability;
};
export const wheneverYouDiscardACard = (params: {
  name: string;
  text: string;
  optional?: boolean;
  effects: Effect[];
}): TriggeredAbility => {
  const { name, text, optional, effects } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    name,
    effects,
  };

  return {
    type: "static-triggered",
    name,
    text,
    layer,
    trigger: {
      on: "discard",
      player: "self",
    },
  };
};
export const wheneverYourOpponentDiscardsOneOrMore = (params: {
  name: string;
  text: string;
  optional?: boolean;
  effects: Effect[];
}): TriggeredAbility => {
  const { name, text, optional, effects } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    name,
    effects,
  };

  return {
    type: "static-triggered",
    name,
    text,
    layer,
    trigger: {
      on: "discard",
      player: "opponent",
    },
  };
};
export const wheneverYouDrawACard = (params: {
  name: string;
  text: string;
  optional?: boolean;
  effects: Effect[];
  conditions?: Condition[];
}): TriggeredAbility => {
  const { conditions, name, text, optional, effects } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    name,
    effects,
  };

  const trigger: DrawTrigger = {
    on: "draw",
    player: "self",
  };

  return {
    type: "static-triggered",
    name,
    text,
    trigger,
    conditions,
    layer: layer,
  };
};
export const wheneverOpponentDrawsACard = (params: {
  name: string;
  text: string;
  optional?: boolean;
  effects: Effect[];
  conditions?: Condition[];
}): TriggeredAbility => {
  const { conditions, name, text, optional, effects } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    name,
    effects,
  };

  const trigger: DrawTrigger = {
    on: "draw",
    player: "opponent",
  };

  return {
    type: "static-triggered",
    name,
    text,
    trigger,
    conditions,
    layer: layer,
  };
};
export const wheneverYouHeal = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  resolveEffectsIndividually?: boolean;
  costs?: Cost[];
}): TriggeredAbility => {
  const {
    resolveEffectsIndividually,
    detrimental,
    costs,
    optional,
    effects,
    name,
    text,
  } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    name,
    text,
    optional,
    detrimental,
    resolveEffectsIndividually,
    effects,
    costs,
  };
  return {
    type: "static-triggered",
    optional,
    name,
    text,
    trigger: {
      on: "heal",
      filters: [
        { filter: "owner", value: "self" },
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
      ],
    },
    layer,
  };
};
export const wheneverYouHealAnyCharacter = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  resolveEffectsIndividually?: boolean;
  costs?: Cost[];
}): TriggeredAbility => {
  const {
    resolveEffectsIndividually,
    detrimental,
    costs,
    optional,
    effects,
    name,
    text,
  } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    name,
    text,
    optional,
    detrimental,
    resolveEffectsIndividually,
    effects,
    costs,
  };
  return {
    type: "static-triggered",
    optional,
    name,
    text,
    trigger: {
      on: "heal",
      triggeredByPlayer: "self",
      filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
      ],
    },
    layer,
  };
};
export const wheneverThisCharIsDamaged = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  resolveEffectsIndividually?: boolean;
  costs?: Cost[];
}): TriggeredAbility => {
  const {
    resolveEffectsIndividually,
    detrimental,
    costs,
    optional,
    effects,
    name,
    text,
  } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    name,
    text,
    optional,
    detrimental,
    resolveEffectsIndividually,
    effects,
    costs,
  };
  return {
    type: "static-triggered",
    optional,
    name,
    text,
    trigger: {
      on: "damage",
      received: true,
      filters: thisCard.filters,
    } as DamageTrigger,
    layer,
  };
};
export const wheneverOppCharIsDamaged = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  oncePerTurn?: boolean;
  detrimental?: boolean;
  resolveEffectsIndividually?: boolean;
  costs?: Cost[];
  conditions?: Condition[];
}): TriggeredAbility => {
  const {
    resolveEffectsIndividually,
    detrimental,
    costs,
    optional,
    oncePerTurn,
    effects,
    name,
    text,
    conditions,
  } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    name,
    text,
    optional,
    oncePerTurn,
    detrimental,
    resolveEffectsIndividually,
    effects,
    costs,
  };
  return {
    type: "static-triggered",
    optional,
    name,
    text,
    trigger: {
      on: "damage",
      filters: [
        { filter: "owner", value: "opponent" },
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
      ],
    } as DamageTrigger,
    layer,
    conditions,
  };
};
export const wheneverOneOfYourCharChallengesAnotherChar = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  responder?: "self" | "opponent";
  conditions?: TriggeredAbility["conditions"];
  defenderFilter?: TargetFilter[];
  attackerFilter?: TargetFilter[];
}): TriggeredAbility => {
  const {
    responder,
    optional,
    effects,
    name,
    text,
    conditions,
    defenderFilter,
    attackerFilter,
  } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    responder,
    name,
    text,
    effects,
  };

  const challengeTrigger: ChallengeTrigger = {
    on: "challenge",
    as: "attacker",
    filters: attackerFilter
      ? [{ filter: "owner", value: "self" }, ...attackerFilter]
      : [{ filter: "owner", value: "self" }],
    secondaryFilters: defenderFilter
      ? [{ filter: "type", value: "character" }, ...defenderFilter]
      : [{ filter: "type", value: "character" }],
  };

  return {
    type: "static-triggered",
    name,
    text,
    trigger: challengeTrigger,
    layer: layer,
    conditions,
  };
};

export const wheneverTargetPlays = (params: {
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
  hasShifted?: boolean;
  hasSang?: boolean;
  conditions?: Condition[];
  oncePerTurn?: boolean;
}): TriggeredAbility => {
  const {
    excludeSelf,
    detrimental,
    costs,
    triggerFilter,
    optional,
    effects,
    hasShifted,
    resolveEffectsIndividually,
    name,
    text,
    responder,
    conditions,
    oncePerTurn,
    hasSang,
  } = params;
  const layer: ResolutionAbility = {
    type: "resolution",
    oncePerTurn,
    responder,
    name,
    resolveEffectsIndividually,
    text,
    optional,
    detrimental,
    effects,
    costs,
  };
  const trigger: OnMoveTrigger = {
    on: "play",
    hasShifted,
    hasSang,
    conditions,
    target: {
      type: "card",
      excludeSelf,
      value: "all",
      filters: triggerFilter || [],
    },
  };

  const ability: TriggeredAbility = {
    type: "static-triggered",
    oncePerTurn,
    optional,
    name,
    text,
    trigger,
    layer,
  };

  return ability;
};

export const wheneverYouPlayAnItem = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  costs?: Cost[];
  responder?: "opponent";
}): TriggeredAbility => {
  return wheneverTargetPlays({
    ...params,
    triggerFilter: [
      { filter: "type", value: "item" },
      { filter: "owner", value: "self" },
    ],
  });
};
export const wheneverOpponentPlaysASong = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  costs?: Cost[];
  responder?: "opponent";
}): TriggeredAbility => {
  return wheneverTargetPlays({
    ...params,
    triggerFilter: [
      { filter: "type", value: "action" },
      { filter: "characteristics", value: ["song"] },
      { filter: "owner", value: "opponent" },
    ],
  });
};

export const wheneverYouPlayASong = (params: {
  effects: Effect[];
  target?: EffectTargets;
  resolveEffectsIndividually?: boolean;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  costs?: Cost[];
  responder?: "opponent";
  oncePerTurn?: boolean;
}): TriggeredAbility => {
  return wheneverTargetPlays({
    ...params,
    triggerFilter: [
      { filter: "type", value: "action" },
      { filter: "characteristics", value: ["song"] },
      { filter: "owner", value: "self" },
    ],
  });
};

export const wheneverOneOrMoreOfYourCharSingsASong = (params: {
  effects: Effect[];
  target?: EffectTargets;
  resolveEffectsIndividually?: boolean;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  costs?: Cost[];
  responder?: "opponent";
  oncePerTurn?: boolean;
  conditions?: Condition[];
}): TriggeredAbility => {
  return wheneverTargetPlays({
    ...params,
    hasSang: true,
    triggerFilter: [
      { filter: "type", value: "action" },
      { filter: "characteristics", value: ["song"] },
      { filter: "owner", value: "self" },
    ],
  });
};
export const wheneverYouPlayAnActionNotASong = (params: {
  effects: Effect[];
  target?: EffectTargets;
  resolveEffectsIndividually?: boolean;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  costs?: Cost[];
  responder?: "opponent";
}): TriggeredAbility => {
  return wheneverTargetPlays({
    ...params,
    triggerFilter: [
      { filter: "type", value: "action" },
      { filter: "characteristics", value: ["song"], negate: true },
      { filter: "owner", value: "self" },
    ],
  });
};
export const wheneverYouPlayAnAction = (params: {
  effects: Effect[];
  target?: EffectTargets;
  resolveEffectsIndividually?: boolean;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  costs?: Cost[];
  responder?: "opponent";
}): TriggeredAbility => {
  return wheneverTargetPlays({
    ...params,
    triggerFilter: [
      { filter: "type", value: "action" },
      { filter: "characteristics", value: ["action"] },
      { filter: "owner", value: "self" },
    ],
  });
};
export const wheneverYouPlayALocation = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  costs?: Cost[];
  responder?: "opponent";
}): TriggeredAbility => {
  return wheneverTargetPlays({
    ...params,
    triggerFilter: [
      { filter: "type", value: "location" },
      { filter: "characteristics", value: ["location"] },
      { filter: "owner", value: "self" },
    ],
  });
};
export const wheneverYouPlayAnotherPrincess = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  costs?: Cost[];
  responder?: "opponent";
}): TriggeredAbility => {
  return wheneverTargetPlays({
    ...params,
    excludeSelf: true,
    triggerFilter: [
      { filter: "type", value: "character" },
      { filter: "characteristics", value: ["princess"] },
      { filter: "owner", value: "self" },
    ],
  });
};
export const wheneverPlays = (params: {
  triggerTarget: CardEffectTarget;
  effects: Effect[];
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  costs?: Cost[];
  hasShifted?: boolean;
  responder?: "opponent";
  conditions?: Condition[];
  excludeSelf?: boolean;
}): TriggeredAbility => {
  const { triggerTarget } = params;
  return wheneverTargetPlays({
    ...params,
    triggerFilter: "filters" in triggerTarget ? triggerTarget.filters : [],
  });
};

export function wheneverYouReadyThisCharacter({
  name,
  text,
  conditions,
  effects,
  optional,
  unless,
  oncePerTurn,
}: {
  name: string;
  text: string;
  conditions?: Condition[];
  effects: Effect[];
  optional?: boolean;
  unless?: boolean;
  oncePerTurn?: boolean;
}): TriggeredAbility {
  const layer: ResolutionAbility = {
    type: "resolution",
    optional,
    unless,
    name,
    text,
    effects,
    oncePerTurn,
  };

  const triggerAbility: TriggeredAbility = {
    type: "static-triggered",
    name: "We'll Always Be Together",
    text: "Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
    trigger: {
      on: "ready",
      target: thisCharacter,
    },
    conditions,
    oncePerTurn,
    layer: layer,
  };

  return triggerAbility;
}
