import type {
  HasAnyDamageCondition,
  InChallengeCondition,
  InInkwellCondition,
  InPlayCondition,
  IsExertedCondition,
  IsReadyCondition,
  NoDamageCondition,
  TurnCondition,
} from "../../cards/abilities/types/condition-types";
import { conditionRegistry } from "../condition-registry";

conditionRegistry.register<TurnCondition>("turn", {
  complexity: 10,
  evaluate: (condition, sourceCard, { state }) => {
    const isActivePlayer =
      state.external.activePlayerId === sourceCard.controller;
    return condition.whose === "your" ? isActivePlayer : !isActivePlayer;
  },
});

conditionRegistry.register<IsExertedCondition>("is-exerted", {
  complexity: 10,
  evaluate: (_condition, sourceCard) => {
    return sourceCard.state === "exerted";
  },
});

conditionRegistry.register<IsReadyCondition>("is-ready", {
  complexity: 10,
  evaluate: (_condition, sourceCard) => {
    return sourceCard.state === "ready";
  },
});

conditionRegistry.register<InInkwellCondition>("in-inkwell", {
  complexity: 10,
  evaluate: (_condition, sourceCard) => {
    return sourceCard.zone === "inkwell";
  },
});

conditionRegistry.register<InPlayCondition>("in-play", {
  complexity: 10,
  evaluate: (_condition, sourceCard) => {
    return sourceCard.zone === "play";
  },
});

conditionRegistry.register<HasAnyDamageCondition>("has-any-damage", {
  complexity: 2,
  evaluate: (_condition, sourceCard) => {
    return (sourceCard.damage || 0) > 0;
  },
});

conditionRegistry.register<NoDamageCondition>("no-damage", {
  complexity: 2,
  evaluate: (_condition, sourceCard) => {
    return (sourceCard.damage || 0) === 0;
  },
});

conditionRegistry.register<InChallengeCondition>("in-challenge", {
  complexity: 5,
  evaluate: (_condition, _sourceCard, { context }) => {
    return !!(context?.attacker || context?.defender);
  },
});
