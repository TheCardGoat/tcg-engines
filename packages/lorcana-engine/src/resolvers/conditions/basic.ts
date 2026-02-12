import type {
  HasAnyDamageCondition,
  IfCondition,
  InChallengeCondition,
  InInkwellCondition,
  InPlayCondition,
  IsExertedCondition,
  IsReadyCondition,
  NoDamageCondition,
  TurnCondition,
} from "@tcg/lorcana-types";
import { conditionRegistry } from "../condition-registry";

conditionRegistry.register<TurnCondition>("turn", {
  complexity: 10,
  evaluate: (condition, sourceCard, { state }) => {
    const isActivePlayer = state.external.activePlayerId === sourceCard.controller;
    return condition.whose === "your" ? isActivePlayer : !isActivePlayer;
  },
});

conditionRegistry.register<IsExertedCondition>("is-exerted", {
  complexity: 10,
  evaluate: (_condition, sourceCard) => sourceCard.state === "exerted",
});

conditionRegistry.register<IsReadyCondition>("is-ready", {
  complexity: 10,
  evaluate: (_condition, sourceCard) => sourceCard.state === "ready",
});

conditionRegistry.register<InInkwellCondition>("in-inkwell", {
  complexity: 10,
  evaluate: (_condition, sourceCard) => sourceCard.zone === "inkwell",
});

conditionRegistry.register<InPlayCondition>("in-play", {
  complexity: 10,
  evaluate: (_condition, sourceCard) => sourceCard.zone === "play",
});

conditionRegistry.register<HasAnyDamageCondition>("has-any-damage", {
  complexity: 2,
  evaluate: (_condition, sourceCard) => (sourceCard.damage || 0) > 0,
});

conditionRegistry.register<NoDamageCondition>("no-damage", {
  complexity: 2,
  evaluate: (_condition, sourceCard) => (sourceCard.damage || 0) === 0,
});

conditionRegistry.register<InChallengeCondition>("in-challenge", {
  complexity: 5,
  evaluate: (_condition, _sourceCard, { context }) => Boolean(context?.attacker || context?.defender),
});

// Register IfCondition handler (parser catch-all)
conditionRegistry.register<IfCondition>("if", {
  complexity: 99,
  evaluate: (_condition, _sourceCard, _context) => false,
});
