import type {
  Cost,
  Effect,
  ResolutionAbility,
  TriggeredAbility,
} from "@lorcanito/lorcana-engine";
import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
import type { EndTurnTrigger } from "@lorcanito/lorcana-engine/abilities/triggers";
import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";

export const atTheEndOfTurnLayer = (params: {
  name?: string;
  text?: string;
  optional?: boolean;
  layer: ResolutionAbility;
  conditions?: Condition[];
  secondaryConditions?: Condition[];
  target: EffectTargets;
}): TriggeredAbility => {
  const {
    target,
    conditions,
    optional,
    name,
    text,
    layer,
    secondaryConditions,
  } = params;

  if (name) {
    layer.name = name;
  }

  if (text) {
    layer.text = text;
  }

  return {
    type: "static-triggered",
    conditions,
    secondaryConditions,
    optional,
    name,
    text,
    trigger: {
      on: "end_turn",
      target,
    } as EndTurnTrigger,
    layer,
  };
};
export const atTheStartOfYourTurnLayer = (params: {
  name?: string;
  text?: string;
  optional?: boolean;
  doesItTriggerFromDiscard?: boolean;
  layer: ResolutionAbility;
  conditions?: Condition[];
}): TriggeredAbility => {
  const { conditions, optional, name, text, layer, doesItTriggerFromDiscard } =
    params;

  if (name) {
    layer.name = name;
  }

  if (text) {
    layer.text = text;
  }

  return {
    type: "static-triggered",
    conditions,
    optional,
    name,
    text,
    trigger: {
      on: "start_turn",
      doesItTriggerFromDiscard,
      target: {
        type: "player",
        value: "self",
      },
    },
    layer,
  };
};
export const atTheEndOfOpponentTurn = (params: {
  effects: Effect[];
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  resolveEffectsIndividually?: boolean;
  costs?: Cost[];
  conditions?: Condition[];
  responder?: ResolutionAbility["responder"];
}): TriggeredAbility => {
  const {
    resolveEffectsIndividually,
    detrimental,
    costs,
    optional,
    effects,
    name,
    responder,
    text,
    conditions,
  } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    name,
    text,
    optional,
    detrimental,
    resolveEffectsIndividually,
    effects,
    responder,
    costs,
  };

  return atTheEndOfTurnLayer({
    target: opponent,
    optional,
    name,
    text,
    layer,
    conditions,
  });
};
export const atTheEndOfYourTurn = (params: {
  effects: Effect[];
  name?: string;
  text?: string;
  optional?: boolean;
  detrimental?: boolean;
  resolveEffectsIndividually?: boolean;
  costs?: Cost[];
  conditions?: Condition[];
  secondaryConditions?: Condition[];
}): TriggeredAbility => {
  const {
    resolveEffectsIndividually,
    detrimental,
    costs,
    optional,
    effects,
    name,
    text,
    conditions,
    secondaryConditions,
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

  return atTheEndOfTurnLayer({
    target: self,
    optional,
    name,
    text,
    layer,
    conditions,
    secondaryConditions,
  });
};
export const atTheStartOfYourTurn = (params: {
  effects: Effect[];
  target?: EffectTargets;
  name?: string;
  text?: string;
  optional?: boolean;
  doesItTriggerFromDiscard?: boolean;
  detrimental?: boolean;
  resolveEffectsIndividually?: boolean;
  costs?: Cost[];
  conditions?: Condition[];
  resolutionConditions?: Condition[];
  dependentEffects?: boolean;
}): TriggeredAbility => {
  const {
    resolveEffectsIndividually,
    detrimental,
    costs,
    optional,
    effects,
    name,
    text,
    conditions,
    resolutionConditions,
    doesItTriggerFromDiscard,
    dependentEffects,
  } = params;

  const layer: ResolutionAbility = {
    type: "resolution",
    name,
    text,
    optional,
    detrimental,
    resolveEffectsIndividually,
    dependentEffects,
    effects,
    resolutionConditions,
    costs,
  };

  return atTheStartOfYourTurnLayer({
    optional,
    name,
    text,
    layer,
    conditions,
    doesItTriggerFromDiscard,
  });
};
