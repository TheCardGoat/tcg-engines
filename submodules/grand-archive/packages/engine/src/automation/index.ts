export {
  chooseGrandArchiveAutomatedAction,
  deterministicRandomGrandArchiveStrategy,
  firstLegalGrandArchiveStrategy,
  passOnlyGrandArchiveStrategy,
  seatMustActInGrandArchive,
  submitGrandArchiveAutomatedAction,
  type GrandArchiveBotDecisionContext,
  type GrandArchiveBotStrategy,
  type SubmitGrandArchiveAutomatedActionResult,
} from "./bot-strategies.ts";

export {
  DEFAULT_GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGY_ID,
  getGrandArchiveAutomatedActionStrategyOption,
  getSafeGrandArchiveAutomatedActionStrategyOption,
  GRAND_ARCHIVE_AUTOMATED_ACTION_STRATEGIES,
  resolveGrandArchiveAutomatedActionStrategyOption,
  type GrandArchiveAutomatedActionStrategyId,
  type GrandArchiveAutomatedActionStrategyOption,
} from "./strategy-registry.ts";

export {
  parseGrandArchiveDeckTextLine,
  resolveGrandArchiveCardIdentifier,
  resolveGrandArchiveTextDeck,
  type GrandArchiveTextDeckInput,
  type ParsedGrandArchiveDeckTextLine,
  type ResolvedGrandArchiveTextDeck,
} from "./deck-text.ts";

export { createGrandArchiveCatalogSmokeFixture } from "./catalog-smoke-fixture.ts";

export {
  playGrandArchiveAutomatedMatch,
  type GrandArchiveAutomatedMatchFrame,
  type GrandArchiveAutomatedMatchTermination,
  type GrandArchiveAutomatedMatchTranscript,
  type PlayGrandArchiveAutomatedMatchInput,
} from "./play-match.ts";

export {
  diffGrandArchiveAutomatedBenchReports,
  runGrandArchiveAutomatedBench,
  type GrandArchiveAutomatedBenchCase,
  type GrandArchiveAutomatedBenchDiff,
  type GrandArchiveAutomatedBenchMatchReport,
  type GrandArchiveAutomatedBenchReport,
  type RunGrandArchiveAutomatedBenchInput,
} from "./bench.ts";

export {
  listGrandArchiveLegalCommands,
  type GrandArchiveLegalCommand,
  type ListGrandArchiveLegalCommandsOptions,
} from "./legal-commands.ts";

export {
  buildGrandArchiveHeuristicSnapshot,
  championProfileGrandArchiveStrategy,
  chooseGrandArchiveHeuristicAction,
  chooseGrandArchiveCompiledLineCommand,
  compileGrandArchiveLine,
  createGrandArchiveChampionMatcher,
  createGrandArchiveChampionProfileStrategy,
  createGrandArchiveHeuristicStrategy,
  GRAND_ARCHIVE_CHAMPION_PROFILE_BINDINGS,
  grandArchiveHeuristicCardById,
  rankGrandArchiveLines,
  resolveGrandArchiveChampionProfileBinding,
  valueExtractGrandArchiveStrategy,
  type GrandArchiveAttackRankingPreference,
  type GrandArchiveChampionIdentity,
  type GrandArchiveChampionMatcher,
  type GrandArchiveChampionMatchSpec,
  type GrandArchiveChampionProfileBinding,
  type GrandArchiveCompiledLine,
  type GrandArchiveCompiledLineKind,
  type GrandArchiveHeuristicCard,
  type GrandArchiveHeuristicCombat,
  type GrandArchiveHeuristicHistory,
  type GrandArchiveHeuristicHistoryEvent,
  type GrandArchiveHeuristicPlayer,
  type GrandArchiveHeuristicSnapshot,
  type GrandArchiveLineRankingHint,
  type GrandArchiveLineRankingInput,
  type GrandArchiveLineRankingProvider,
} from "./heuristic/index.ts";
