export {
  listLegalCommands,
  type FabLegalCommand,
  type ListLegalCommandsOptions,
} from "./legal-commands.ts";

export { getFabAutoPassPriorityCommand, type FabAutoPassPolicy } from "./auto-pass.ts";

export {
  passOnlyStrategy,
  firstLegalStrategy,
  randomStrategy,
  heuristicStrategy,
  chooseAutomatedAction,
  submitAutomatedAction,
  seatMustAct,
  progressCommand,
  concedeCommand,
  type FabBotStrategy,
  type FabBotPolicy,
  type SubmitAutomatedActionResult,
  type FabBotDecisionContext,
} from "./bot-strategies.ts";

export {
  compileTurnLine,
  chooseCompiledLineCommand,
  buildHeuristicSnapshot,
  estimateOffensiveValue,
  estimateOnHitValue,
  evaluateDefendSet,
  valueExtractStrategy,
  defendOnlyStrategy,
  neverDefendStrategy,
  heroProfileStrategy,
  rhinarStrategy,
  teklovossenStrategy,
  arakniStrategy,
  valdaStrategy,
  auroraStrategy,
  oscilioStrategy,
  zyggyStrategy,
  gravyStrategy,
  marlynnStrategy,
  puffinStrategy,
  pleiadesStrategy,
  kayoStrategy,
  lyathStrategy,
  type FabCardRole,
  type FabCompiledLine,
  type FabGoldfishPersona,
  type FabHeuristicSnapshot,
  type FabLineRankingHint,
  type FabLineRankingInput,
} from "./heuristic/index.ts";

export {
  FAB_AUTOMATED_ACTION_STRATEGIES,
  DEFAULT_FAB_AUTOMATED_ACTION_STRATEGY_ID,
  getFabAutomatedActionStrategyOption,
  getSafeFabAutomatedActionStrategyOption,
  resolveFabAutomatedActionStrategyOption,
  type FabAutomatedActionStrategyOption,
  type FabStrategyScope,
} from "./strategy-registry.ts";

export {
  PRACTICE_PLAYER_1,
  PRACTICE_PLAYER_2,
  buildFabPracticeTestFixture,
  type FabPracticeMatchFixtureInput,
} from "./sample-decks.ts";

export {
  catalogCardDefinition,
  parseFabDeckTextLine,
  resolveCatalogCardByName,
  resolveFabDeckSelection,
  type FabDeckCardLibrary,
  type FabDeckCardRecord,
  type ResolvedFabDeckSeat,
} from "./resolve-text-deck.ts";

export {
  CATALOG_TEST_DEFINITIONS,
  catalogIds,
  catalogTestCards,
  ids,
} from "./catalog-test-cards.ts";

export {
  FAB_DECK_TEXT_FIXTURES,
  DEFAULT_PLAYER_DECK_ID,
  DEFAULT_BOT_DECK_ID,
  getFabDeckTextFixture,
  getFabDeckTextFixturesByFormat,
  type FabDeckFormat,
  type FabDeckTextFixture,
} from "./deck-text-fixtures.ts";

export {
  FAB_DECK_CATALOG,
  getFabDeck,
  listFabDecks,
  isFabTournamentDeck,
  fabDeckTags,
  type FabConstructedFormat,
  type FabDeckCatalogEntry,
  type FabDeckCatalogFormat,
  type FabDeckCatalogQuery,
  type FabDeckKind,
  type FabDeckOrigin,
  type FabHeroClass,
  type FabTournamentDeckEntry,
} from "./deck-catalog.ts";

export { createFabPracticeMatch, type FabPracticeMatch } from "./create-practice-match.ts";

export {
  playFabMatch,
  runPairedFabEvaluation,
  type FabPairedEvaluationInput,
  type FabPairedEvaluationMatch,
  type FabEvaluationPolicy,
  runFabBench,
  runFabBenchWithTranscripts,
  diffFabBenchReports,
  type FabBenchDiff,
  type FabBenchOptions,
  type FabBenchReport,
  type FabDecisionFrame,
  type FabMatchTranscript,
  type PlayFabMatchInput,
} from "./bench/index.ts";
