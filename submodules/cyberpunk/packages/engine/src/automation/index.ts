export type {
  AIStrategy,
  ChoiceResolver,
  ChoiceResolverMap,
  DecisionContext,
  MoveDecision,
  StepResult,
  StepResultActed,
  StepResultIdle,
  StepResultStuck,
  StepResultIllegal,
  TurnResult,
} from "./types.ts";

export { AIPlayer, type AIPlayerOptions } from "./ai-player.ts";
export { buildDecisionContext } from "./decision-context.ts";
export {
  runAutoMatch,
  type RunAutoMatchOptions,
  type AutoMatchResult,
  type AutoMatchLogEntry,
} from "./run-auto-match.ts";

export {
  defaultChoiceResolvers,
  searchDeckResolver,
  chooseTargetResolver,
  chooseEffectResolver,
  chooseGigsToStealResolver,
  chooseCardToPlayResolver,
  chooseCardToMoveResolver,
} from "./resolvers/index.ts";

export {
  defaultStrategy,
  firstLegalStrategy,
  randomStrategy,
  passOnlyStrategy,
  attackUnitOnlyStrategy,
  callLegendOnlyStrategy,
  greedyStrategy,
  createGreedyStrategy,
  DEFAULT_GREEDY_WEIGHTS,
  decisionFromMove,
  type ArgPicker,
  type GreedyWeights,
} from "./strategies/index.ts";

export {
  AUTOMATED_ACTION_STRATEGIES,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  getAutomatedActionStrategyOption,
  getSafeAutomatedActionStrategyOption,
  type AutomatedActionStrategyOption,
} from "./strategy-registry.ts";

export {
  monteCarloStrategy,
  monteCarloGreedyStrategy,
  createMonteCarloStrategy,
  type MonteCarloOptions,
} from "./search/monte-carlo.ts";

export {
  mctsStrategy,
  mctsGreedyStrategy,
  createMctsStrategy,
  type MctsOptions,
} from "./search/mcts.ts";

export { assertNever } from "./util/assert-never.ts";
