export type {
  AIStrategy,
  ChoiceResolver,
  ChoiceResolverMap,
  DecisionContext,
  DecisionDiagnostics,
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
  scryResolver,
  revealDestinationResolver,
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
  attackRivalOnlyStrategy,
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
  CYBERPUNK_AUTOMATION_REVISION,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  buildAutomatedActionStrategyOptions,
  getAutomatedActionStrategyOption,
  getSafeAutomatedActionStrategyOption,
  isGreedyWeights,
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

export {
  abilityAwareTacticalStrategy,
  tacticalStrategy,
  createTacticalStrategy,
  type TacticalStrategyOptions,
} from "./search/tactical.ts";

export {
  evaluateBoard,
  extractBoardFeatures,
  DEFAULT_BOARD_EVALUATION_WEIGHTS,
  type BoardEvaluationWeights,
  type BoardFeatures,
} from "./search/evaluate-board.ts";

export { assertNever } from "./util/assert-never.ts";
