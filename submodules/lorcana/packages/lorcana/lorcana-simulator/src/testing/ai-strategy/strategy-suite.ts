import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  AutomatedActionCandidateSummary,
  AutomatedActionStrategyOption,
  AutomatedActionDecisionTrace,
  AutomatedActionFallback,
  AutomatedActionSearchCaps,
  AutomatedActionStrategy,
  LorcanaCard,
  StrategyInformationPolicy,
  PlayerId,
} from "@tcg/lorcana-engine";
import {
  AUTOMATED_ACTION_STRATEGIES,
  BEST_AI_CARD_PROFILES,
  BEST_AI_DECK_DOSSIERS,
  BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID,
  BEST_DECK_AWARE_ORACLE_LORE_RACE_STRATEGY_ID,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  buildBestAiMatchupWeightReport,
  buildBestAiMatchupWeightReportMarkdown,
  computeAutomatedActionStateFingerprint,
  getSafeAutomatedActionStrategyOption,
} from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  DECK_FIXTURES,
  type DeckFixture,
} from "../../lib/features/simulator-devtools/deck-fixtures/index.js";
import {
  createFixture,
  type LorcanaSimulatorFixtureInput,
} from "../../lib/features/simulator-devtools/fixtures/fixture-factory.js";
import { all001Cards } from "@tcg/lorcana-cards/cards/001";
import { all002Cards } from "@tcg/lorcana-cards/cards/002";
import { all003Cards } from "@tcg/lorcana-cards/cards/003";
import { all004Cards } from "@tcg/lorcana-cards/cards/004";
import { all005Cards } from "@tcg/lorcana-cards/cards/005";
import { all006Cards } from "@tcg/lorcana-cards/cards/006";
import { all007Cards } from "@tcg/lorcana-cards/cards/007";
import { all008Cards } from "@tcg/lorcana-cards/cards/008";
import { all009Cards } from "@tcg/lorcana-cards/cards/009";
import { all010Cards } from "@tcg/lorcana-cards/cards/010";
import { all011Cards } from "@tcg/lorcana-cards/cards/011";
import { all012Cards } from "@tcg/lorcana-cards/cards/012";
import { resolveLorcanaDeckListTextFromPool } from "@tcg/lorcana-cards/deck-list-resolver";
import { configureStrategySuiteLogging } from "./configure-strategy-logging.js";
import {
  createRepeatedStateDeadlockTracker,
  resolveRepeatedStateDeadlockByConceding,
  STRATEGY_ACTION_LIMIT,
  resolveStrategyMatchEndReason,
  type StrategyMatchEndReason,
} from "./deadlock.js";
import {
  CORE_STRATEGY_BENCHMARK_DECK_IDS,
  FULL_STRATEGY_REGRESSION_DECK_IDS,
  PROMOTED_STRATEGY_BASELINE_ID,
  getStrategyCandidateManifests,
  type StrategyBenchmarkPreset,
  type StrategyCandidateManifest,
} from "./strategy-iteration.js";
export { resolveStrategyBenchmarkPreset } from "./strategy-iteration.js";

type StrategyDeck = {
  fixture: DeckFixture;
  id: string;
  strategy?: AutomatedActionStrategy;
  strategyId: string;
};
type StrategyPlayerSlot = "player_one" | "player_two";
type StrategyLoreTotals = Record<StrategyPlayerSlot, number>;

export type StrategyLabMatchMode = "mirror" | "cross-deck" | "both";

export type StrategyDeckMatchInput = {
  fixture: DeckFixture;
  id?: string;
  strategy?: AutomatedActionStrategy;
  strategyId?: string;
};

type StrategyMatchDefinition = {
  id: string;
  playerOne: StrategyDeck;
  playerTwo: StrategyDeck;
  seed: string;
};

export type StrategyMatchSimulationOptions = {
  actionLimit?: number;
  artifactRoot?: string;
  includeGameLogTranscript?: boolean;
  matchId?: string;
  playerOne: StrategyDeckMatchInput;
  playerTwo: StrategyDeckMatchInput;
  repeatThreshold?: number;
  searchCaps?: Partial<AutomatedActionSearchCaps>;
  seed?: string;
  turnLimit?: number;
};

export type StrategyLabOptions = {
  artifactRoot?: string;
  baselineStrategyId?: string;
  candidateManifests?: StrategyCandidateManifest[];
  crossDeckGameCount?: number;
  deckIds?: string[];
  gameCount?: number;
  includeSameStrategyMirrors?: boolean;
  matchMode?: StrategyLabMatchMode;
  mirrorGameCount?: number;
  preset?: StrategyBenchmarkPreset;
  strategyIds?: string[];
};

export type StrategyLabGameCounts = {
  crossDeck: number;
  mirror: number;
};

export type StrategyDecisionLogEntry = AutomatedActionDecisionTrace & {
  matchId: string;
  moveNumber: number;
  playerOneDeckId: string;
  playerOneStrategyId: string;
  playerTwoDeckId: string;
  playerTwoStrategyId: string;
  seed: string;
};

export type QuestionableDecision = {
  category: "suicide-challenge" | "low-value-challenge" | "traded-last-quester" | "inked-key-card";
  matchId: string;
  moveNumber: number;
  turnNumber: number;
  reason: string;
};

export type StrategyMatchSummary = {
  actions: number;
  artifactPaths: {
    gameRuntime: string;
    strategyDecisions: string;
  };
  challengeOverQuestCount: number;
  deadlockConcedeCount: number;
  deadlock: boolean;
  diagnosticCounts: {
    actorResolution: number;
    total: number;
    unsupported: number;
    validation: number;
  };
  endReason: StrategyMatchEndReason;
  fallbackCounts: Record<AutomatedActionFallback, number>;
  gameEndReason?: string;
  gameLogTranscript?: string[];
  loreTotals: StrategyLoreTotals;
  matchId: string;
  outcome: "terminated" | "winner";
  playerOneDeckId: string;
  playerOneStrategyId: string;
  playerTwoDeckId: string;
  playerTwoStrategyId: string;
  questionableDecisions?: QuestionableDecision[];
  seed: string;
  turns: number;
  winner?: PlayerId;
};

export type StrategySuiteRunSummary = {
  artifactRoot: string;
  baselineStrategyId: string;
  candidateManifests: StrategyCandidateManifest[];
  deckIds: string[];
  gameCount: number;
  gameCounts: StrategyLabGameCounts;
  generatedAt: string;
  matches: StrategyMatchSummary[];
  mode: StrategyLabMatchMode | "curated";
  preset?: StrategyBenchmarkPreset;
  strategyIds: string[];
};

export type StrategyLabMatchClassification = "mirror" | "mirror-same-strategy" | "cross-deck";
export type StrategyLabTriageCategory =
  | "over-inking"
  | "missed-challenge"
  | "bad-play-before-quest"
  | "bad-ability-timing"
  | "fallback-churn";

type StrategyFallbackCounts = StrategyMatchSummary["fallbackCounts"];
type StrategyDiagnosticCounts = StrategyMatchSummary["diagnosticCounts"];

export type StrategyLabStrategyRecord = {
  averageActions: number;
  averageTurns: number;
  deadlockConcedeCount: number;
  deadlockGames: number;
  diagnosticCounts: StrategyDiagnosticCounts;
  fallbackCounts: StrategyFallbackCounts;
  games: number;
  losses: number;
  noWinnerGames: number;
  strategyId: string;
  winRate: number;
  wins: number;
};

export type StrategyLabMirrorDeckRecord = {
  averageActions: number;
  averageTurns: number;
  classification: "mirror" | "mirror-same-strategy";
  deadlockConcedeCount: number;
  deadlockGames: number;
  deckId: string;
  diagnosticCounts: StrategyDiagnosticCounts;
  fallbackCounts: StrategyFallbackCounts;
  games: number;
  noWinnerGames: number;
  strategyPairId: string;
  strategyPairLabel: string;
  wins: Record<string, number>;
};

export type StrategyLabMirrorStrategyPairRecord = {
  averageActions: number;
  averageTurns: number;
  classification: "mirror" | "mirror-same-strategy";
  deadlockConcedeCount: number;
  deadlockGames: number;
  diagnosticCounts: StrategyDiagnosticCounts;
  fallbackCounts: StrategyFallbackCounts;
  games: number;
  noWinnerGames: number;
  strategyPairId: string;
  strategyPairLabel: string;
  wins: Record<string, number>;
};

export type StrategyLabCrossDeckDeckRecord = {
  averageActions: number;
  averageTurns: number;
  deadlockConcedeCount: number;
  deadlockGames: number;
  deckId: string;
  diagnosticCounts: StrategyDiagnosticCounts;
  fallbackCounts: StrategyFallbackCounts;
  games: number;
  losses: number;
  noWinnerGames: number;
  strategyId: string;
  winRate: number;
  wins: number;
};

export type StrategyLabCrossDeckOrderedPairRecord = {
  averageActions: number;
  averageTurns: number;
  deadlockConcedeCount: number;
  deadlockGames: number;
  diagnosticCounts: StrategyDiagnosticCounts;
  fallbackCounts: StrategyFallbackCounts;
  games: number;
  noWinnerGames: number;
  orderedDeckPairId: string;
  orderedDeckPairLabel: string;
  playerOneDeckId: string;
  playerOneStrategyId: string;
  playerTwoDeckId: string;
  playerTwoStrategyId: string;
  wins: Record<string, number>;
};

export type StrategyLabWorstMatchupRecord = {
  averageActions: number;
  averageTurns: number;
  classification: StrategyLabMatchClassification;
  deadlockConcedeCount: number;
  deadlockGames: number;
  deckId: string;
  diagnosticCounts: StrategyDiagnosticCounts;
  fallbackCounts: StrategyFallbackCounts;
  games: number;
  label: string;
  losses: number;
  matchIds: string[];
  noWinnerGames: number;
  opponentDeckId: string;
  opponentStrategyId: string;
  strategyId: string;
  winRate: number;
  wins: number;
};

export type StrategyLabDiagnosticHotspotRecord = {
  actorResolution: number;
  label: string;
  perGame: number;
  total: number;
  unsupported: number;
  validation: number;
};

export type StrategyLabInspectionRecommendation = {
  artifactPaths: StrategyMatchSummary["artifactPaths"];
  classification: StrategyLabMatchClassification;
  deckId: string;
  matchId: string;
  opponentDeckId: string;
  opponentStrategyId: string;
  reason: string;
  strategyId: string;
};

export type StrategyLabScoreMetrics = {
  blendedScore: number;
  crossDeckScore: number;
  deadlockFallbackPenalty: number;
  diagnosticPenalty: number;
  fallbackCount: number;
  games: number;
  mirrorScore: number;
  signalDiagnostics: number;
  totalDeadlockGames: number;
  totalDiagnostics: number;
};

export type StrategyLabPromotionGateResult = {
  passed: boolean;
  reasons: string[];
};

export type StrategyLabCandidateScorecard = {
  baselineStrategyId: string;
  candidateId: string;
  changedHeuristics: string[];
  deltaVsBaseline?: {
    blendedScore: number;
    crossDeckScore: number;
    deadlockFallbackPenalty: number;
    diagnosticPenalty: number;
    fallbackCount: number;
    mirrorScore: number;
    signalDiagnostics: number;
    totalDeadlockGames: number;
    totalDiagnostics: number;
  };
  hypothesis: string;
  notes: string;
  parentStrategyId: string;
  promotionGate: StrategyLabPromotionGateResult;
  score: StrategyLabScoreMetrics;
  status: StrategyCandidateManifest["status"];
};

export type StrategyLabTriageCategoryRecord = {
  category: StrategyLabTriageCategory;
  count: number;
  label: string;
  matchIds: string[];
  recommendations: StrategyLabInspectionRecommendation[];
  summary: string;
};

export type StrategyLabReport = {
  artifactRoot: string;
  baselineStrategyId: string;
  candidateManifests: StrategyCandidateManifest[];
  challengeOverQuestCount: number;
  crossDeck: {
    deckRecords: StrategyLabCrossDeckDeckRecord[];
    orderedPairRecords: StrategyLabCrossDeckOrderedPairRecord[];
    strategyRecords: StrategyLabStrategyRecord[];
  };
  deckIds: string[];
  gameCount: number;
  gameCounts: StrategyLabGameCounts;
  generatedAt: string;
  inspectNext: StrategyLabInspectionRecommendation[];
  matchClassifications: Record<StrategyLabMatchClassification, number>;
  mirror: {
    deckRecords: StrategyLabMirrorDeckRecord[];
    strategyPairRecords: StrategyLabMirrorStrategyPairRecord[];
  };
  mode: StrategyLabMatchMode | "curated";
  overall: {
    averageActions: number;
    averageTurns: number;
    deadlockConcedeCount: number;
    deadlockGames: number;
    diagnosticCounts: StrategyDiagnosticCounts;
    fallbackCounts: StrategyFallbackCounts;
    games: number;
    noWinnerGames: number;
    terminatedGames: number;
    winnerCounts: Record<PlayerId | "no-winner", number>;
  };
  preset?: StrategyBenchmarkPreset;
  questionableDecisions: QuestionableDecision[];
  scorecards: StrategyLabCandidateScorecard[];
  strategyIds: string[];
  strategyRecords: StrategyLabStrategyRecord[];
  triage: {
    categories: StrategyLabTriageCategoryRecord[];
  };
  worstMatchups: StrategyLabWorstMatchupRecord[];
  diagnostics: {
    byMatchup: StrategyLabDiagnosticHotspotRecord[];
    byStrategy: StrategyLabDiagnosticHotspotRecord[];
  };
};

type StrategyExecutionTrace = StrategyDecisionLogEntry;
type StrategyParticipantPerspectiveRecord = {
  artifactPaths: StrategyMatchSummary["artifactPaths"];
  classification: StrategyLabMatchClassification;
  deckId: string;
  diagnosticCounts: StrategyDiagnosticCounts;
  fallbackCounts: StrategyFallbackCounts;
  matchId: string;
  opponentDeckId: string;
  opponentStrategyId: string;
  strategyId: string;
  turns: number;
  actions: number;
  deadlock: boolean;
  deadlockConcedeCount: number;
  outcome: "loss" | "no-winner" | "win";
};
type StrategyScoreAggregate = {
  crossDeckGames: number;
  crossDeckWins: number;
  deadlockGames: number;
  fallbackCount: number;
  games: number;
  mirrorGames: number;
  mirrorWins: number;
  signalDiagnostics: number;
  totalDiagnostics: number;
};
type StrategyTriageSignal = {
  category: StrategyLabTriageCategory;
  matchId: string;
};
type StrategyBenchmarkPresetConfig = {
  artifactSegment: string[];
  matchMode: StrategyLabMatchMode;
  crossDeckGameCount: number;
  deckIds: string[];
  includeSameStrategyMirrors: boolean;
  mirrorGameCount: number;
};

const STRATEGY_ARTIFACT_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../.artifacts/strategy/latest",
);
const STRATEGY_SIMULATION_SEARCH_CAPS: Partial<AutomatedActionSearchCaps> = {
  choiceIndices: 16,
  singerCombinations: 32,
  targetCombinationsPerFamily: 48,
  targetPool: 16,
};
const STRATEGY_TRIAGE_LABELS: Record<StrategyLabTriageCategory, string> = {
  "bad-ability-timing": "Bad ability timing",
  "bad-play-before-quest": "Bad play-before-quest",
  "fallback-churn": "Fallback churn",
  "missed-challenge": "Missed challenge",
  "over-inking": "Over-inking",
};
const STRATEGY_PRESET_CONFIGS: Record<StrategyBenchmarkPreset, StrategyBenchmarkPresetConfig> = {
  candidate: {
    artifactSegment: ["presets", "candidate"],
    crossDeckGameCount: 2,
    deckIds: [...FULL_STRATEGY_REGRESSION_DECK_IDS],
    includeSameStrategyMirrors: true,
    matchMode: "both",
    mirrorGameCount: 2,
  },
  promotion: {
    artifactSegment: ["presets", "promotion"],
    crossDeckGameCount: 5,
    deckIds: [...FULL_STRATEGY_REGRESSION_DECK_IDS],
    includeSameStrategyMirrors: true,
    matchMode: "both",
    mirrorGameCount: 5,
  },
  quick: {
    artifactSegment: ["presets", "quick"],
    crossDeckGameCount: 0,
    deckIds: [...CORE_STRATEGY_BENCHMARK_DECK_IDS],
    includeSameStrategyMirrors: false,
    matchMode: "mirror",
    mirrorGameCount: 20,
  },
};

function buildStrategySuiteDecks(): StrategyDeck[] {
  return DECK_FIXTURES.map((fixture) => ({
    fixture,
    id: fixture.id,
    strategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  }));
}

function sanitizeMatchSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9-]+/g, "-");
}

function createEmptyFallbackCounts(): StrategyFallbackCounts {
  return {
    concede: 0,
    passTurn: 0,
  };
}

function createEmptyDiagnosticCounts(): StrategyDiagnosticCounts {
  return {
    actorResolution: 0,
    total: 0,
    unsupported: 0,
    validation: 0,
  };
}

function addFallbackCounts(
  target: StrategyFallbackCounts,
  source: Readonly<StrategyFallbackCounts>,
): void {
  target.concede += source.concede;
  target.passTurn += source.passTurn;
}

function addDiagnosticCounts(
  target: StrategyDiagnosticCounts,
  source: Readonly<StrategyDiagnosticCounts>,
): void {
  target.actorResolution += source.actorResolution;
  target.total += source.total;
  target.unsupported += source.unsupported;
  target.validation += source.validation;
}

function roundAverage(total: number, count: number): number {
  return Number((count === 0 ? 0 : total / count).toFixed(2));
}

function roundScore(value: number): number {
  return Number(value.toFixed(4));
}

function sortStrings(values: Iterable<string>): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

export function resolveStrategyBenchmarkPresetConfig(
  preset: StrategyBenchmarkPreset,
): StrategyBenchmarkPresetConfig {
  return STRATEGY_PRESET_CONFIGS[preset];
}

function normalizeGameCount(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

function resolveStrategyLabGameCounts(options: StrategyLabOptions = {}): StrategyLabGameCounts {
  const sharedGameCount = normalizeGameCount(options.gameCount ?? 20, 20);
  const mirror = Math.max(
    0,
    normalizeGameCount(options.mirrorGameCount ?? sharedGameCount, sharedGameCount),
  );
  const crossDeck = Math.max(
    0,
    normalizeGameCount(options.crossDeckGameCount ?? sharedGameCount, sharedGameCount),
  );

  return { crossDeck, mirror };
}

function resolveStrategyLabPresetOptions(options: StrategyLabOptions = {}): StrategyLabOptions {
  if (!options.preset) {
    return options;
  }

  const config = resolveStrategyBenchmarkPresetConfig(options.preset);

  return {
    ...options,
    crossDeckGameCount: options.crossDeckGameCount ?? config.crossDeckGameCount,
    deckIds: options.deckIds && options.deckIds.length > 0 ? options.deckIds : config.deckIds,
    includeSameStrategyMirrors:
      options.includeSameStrategyMirrors ?? config.includeSameStrategyMirrors,
    matchMode: options.matchMode ?? config.matchMode,
    mirrorGameCount: options.mirrorGameCount ?? config.mirrorGameCount,
  };
}

function buildStrategyPairIds(
  playerOneStrategyId: string,
  playerTwoStrategyId: string,
): { pairId: string; pairLabel: string } {
  const strategyIds = sortStrings([playerOneStrategyId, playerTwoStrategyId]);

  return {
    pairId: strategyIds.join("__vs__"),
    pairLabel: strategyIds.join(" vs "),
  };
}

function buildOrderedDeckPairId(match: StrategyMatchSummary): string {
  return `${match.playerOneDeckId}__vs__${match.playerTwoDeckId}__${match.playerOneStrategyId}__vs__${match.playerTwoStrategyId}`;
}

function classifyStrategyMatch(match: StrategyMatchSummary): StrategyLabMatchClassification {
  if (match.playerOneDeckId !== match.playerTwoDeckId) {
    return "cross-deck";
  }

  if (match.playerOneStrategyId === match.playerTwoStrategyId) {
    return "mirror-same-strategy";
  }

  return "mirror";
}

function getMatchWinnerLabel(match: StrategyMatchSummary): PlayerId | "no-winner" {
  return match.winner ?? "no-winner";
}

function expandParticipantPerspectiveRecords(
  match: StrategyMatchSummary,
): StrategyParticipantPerspectiveRecord[] {
  return [
    {
      actions: match.actions,
      artifactPaths: match.artifactPaths,
      classification: classifyStrategyMatch(match),
      deadlock: match.deadlock,
      deadlockConcedeCount: match.deadlockConcedeCount,
      deckId: match.playerOneDeckId,
      diagnosticCounts: match.diagnosticCounts,
      fallbackCounts: match.fallbackCounts,
      matchId: match.matchId,
      opponentDeckId: match.playerTwoDeckId,
      opponentStrategyId: match.playerTwoStrategyId,
      outcome:
        match.winner === "player_one"
          ? "win"
          : match.winner === "player_two"
            ? "loss"
            : "no-winner",
      strategyId: match.playerOneStrategyId,
      turns: match.turns,
    },
    {
      actions: match.actions,
      artifactPaths: match.artifactPaths,
      classification: classifyStrategyMatch(match),
      deadlock: match.deadlock,
      deadlockConcedeCount: match.deadlockConcedeCount,
      deckId: match.playerTwoDeckId,
      diagnosticCounts: match.diagnosticCounts,
      fallbackCounts: match.fallbackCounts,
      matchId: match.matchId,
      opponentDeckId: match.playerOneDeckId,
      opponentStrategyId: match.playerOneStrategyId,
      outcome:
        match.winner === "player_two"
          ? "win"
          : match.winner === "player_one"
            ? "loss"
            : "no-winner",
      strategyId: match.playerTwoStrategyId,
      turns: match.turns,
    },
  ];
}

function resolveRunDeckIds(
  matches: readonly StrategyMatchSummary[],
  requestedDeckIds?: readonly string[],
): string[] {
  if (requestedDeckIds && requestedDeckIds.length > 0) {
    return sortStrings(new Set(requestedDeckIds));
  }

  return sortStrings(
    new Set(matches.flatMap((match) => [match.playerOneDeckId, match.playerTwoDeckId])),
  );
}

function resolveRunStrategyIds(
  matches: readonly StrategyMatchSummary[],
  requestedStrategyIds?: readonly string[],
): string[] {
  if (requestedStrategyIds && requestedStrategyIds.length > 0) {
    return sortStrings(new Set(requestedStrategyIds));
  }

  return sortStrings(
    new Set(matches.flatMap((match) => [match.playerOneStrategyId, match.playerTwoStrategyId])),
  );
}

function normalizeStrategyDeck(input: StrategyDeckMatchInput): StrategyDeck {
  return {
    fixture: input.fixture,
    id: input.id ?? input.fixture.id,
    strategy: input.strategy,
    strategyId: input.strategyId ?? input.strategy?.name ?? DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  };
}

function buildSelectedStrategyOptions(
  strategyIds: readonly string[] = [],
): AutomatedActionStrategyOption[] {
  if (strategyIds.length === 0) {
    return AUTOMATED_ACTION_STRATEGIES.filter((option) => option.testOnly !== true);
  }

  return AUTOMATED_ACTION_STRATEGIES.filter((option) => strategyIds.includes(option.id));
}

function buildMatchDefinitions(): StrategyMatchDefinition[] {
  const decks = buildStrategySuiteDecks();
  const matchDefinitions: StrategyMatchDefinition[] = [];

  if (decks.length < 2) {
    return matchDefinitions;
  }

  for (let index = 0; index < decks.length; index += 1) {
    const leftDeck = decks[index]!;
    const rightDeck = decks[(index + 1) % decks.length]!;
    const forwardId = `${sanitizeMatchSegment(leftDeck.id)}-vs-${sanitizeMatchSegment(rightDeck.id)}-p1`;
    const reverseId = `${sanitizeMatchSegment(rightDeck.id)}-vs-${sanitizeMatchSegment(leftDeck.id)}-p2`;

    matchDefinitions.push({
      id: forwardId,
      playerOne: leftDeck,
      playerTwo: rightDeck,
      seed: `strategy-suite:${forwardId}`,
    });

    matchDefinitions.push({
      id: reverseId,
      playerOne: rightDeck,
      playerTwo: leftDeck,
      seed: `strategy-suite:${reverseId}`,
    });
  }

  return matchDefinitions;
}

export function buildStrategyLabMatchDefinitions(
  options: StrategyLabOptions = {},
): StrategyMatchDefinition[] {
  const resolvedOptions = resolveStrategyLabPresetOptions(options);
  const deckIdFilter = new Set(resolvedOptions.deckIds ?? []);
  const selectedDecks = buildStrategySuiteDecks().filter(
    (deck) => deckIdFilter.size === 0 || deckIdFilter.has(deck.id),
  );
  const strategyOptions = buildSelectedStrategyOptions(resolvedOptions.strategyIds);
  const matchDefinitions: StrategyMatchDefinition[] = [];
  const matchMode = resolvedOptions.matchMode ?? "both";
  const gameCounts = resolveStrategyLabGameCounts(resolvedOptions);

  if ((matchMode === "mirror" || matchMode === "both") && gameCounts.mirror > 0) {
    const includeSameStrategyMirrors = resolvedOptions.includeSameStrategyMirrors === true;
    for (const deck of selectedDecks) {
      for (const playerOneStrategy of strategyOptions) {
        for (const playerTwoStrategy of strategyOptions) {
          if (!includeSameStrategyMirrors && playerOneStrategy.id === playerTwoStrategy.id) {
            continue;
          }

          for (let gameIndex = 0; gameIndex < gameCounts.mirror; gameIndex += 1) {
            const matchId = `${deck.id}-mirror-${playerOneStrategy.id}-vs-${playerTwoStrategy.id}-${gameIndex}`;
            matchDefinitions.push({
              id: matchId,
              playerOne: {
                fixture: deck.fixture,
                id: deck.id,
                strategy: playerOneStrategy.strategy,
                strategyId: playerOneStrategy.id,
              },
              playerTwo: {
                fixture: deck.fixture,
                id: deck.id,
                strategy: playerTwoStrategy.strategy,
                strategyId: playerTwoStrategy.id,
              },
              seed: `strategy-lab:${matchId}`,
            });
          }
        }
      }
    }
  }

  if ((matchMode === "cross-deck" || matchMode === "both") && gameCounts.crossDeck > 0) {
    for (const strategyOption of strategyOptions) {
      for (const playerOneDeck of selectedDecks) {
        for (const playerTwoDeck of selectedDecks) {
          if (playerOneDeck.id === playerTwoDeck.id) {
            continue;
          }

          for (let gameIndex = 0; gameIndex < gameCounts.crossDeck; gameIndex += 1) {
            const matchId = `${playerOneDeck.id}-vs-${playerTwoDeck.id}-${strategyOption.id}-${gameIndex}`;
            matchDefinitions.push({
              id: matchId,
              playerOne: {
                fixture: playerOneDeck.fixture,
                id: playerOneDeck.id,
                strategy: strategyOption.strategy,
                strategyId: strategyOption.id,
              },
              playerTwo: {
                fixture: playerTwoDeck.fixture,
                id: playerTwoDeck.id,
                strategy: strategyOption.strategy,
                strategyId: strategyOption.id,
              },
              seed: `strategy-lab:${matchId}`,
            });
          }
        }
      }
    }
  }

  return matchDefinitions;
}

// Card pool for strategy tests — eagerly loaded because this module only runs in Bun/Node.
const STRATEGY_CARD_POOL = [
  ...all001Cards,
  ...all002Cards,
  ...all003Cards,
  ...all004Cards,
  ...all005Cards,
  ...all006Cards,
  ...all007Cards,
  ...all008Cards,
  ...all009Cards,
  ...all010Cards,
  ...all011Cards,
  ...all012Cards,
].filter((card) => card?.name != null);

function resolveStrategyDeckText(deckText: string): LorcanaCard[] {
  const { cards } = resolveLorcanaDeckListTextFromPool(deckText, STRATEGY_CARD_POOL);
  return cards;
}

function createFixturePlayer(deckText: string): LorcanaSimulatorFixtureInput["playerOne"] {
  return {
    deck: resolveStrategyDeckText(deckText),
  };
}

function buildDecisionEntry(args: {
  match: StrategyMatchDefinition;
  moveNumber: number;
  trace: AutomatedActionDecisionTrace;
}): StrategyDecisionLogEntry {
  const { match, moveNumber, trace } = args;

  return {
    ...trace,
    matchId: match.id,
    moveNumber,
    playerOneDeckId: match.playerOne.id,
    playerOneStrategyId: match.playerOne.strategyId,
    playerTwoDeckId: match.playerTwo.id,
    playerTwoStrategyId: match.playerTwo.strategyId,
    seed: match.seed,
  };
}

function countFallbacks(
  entries: readonly StrategyDecisionLogEntry[],
): Record<AutomatedActionFallback, number> {
  return entries.reduce<Record<AutomatedActionFallback, number>>(
    (counts, entry) => {
      if (entry.fallbackTaken) {
        counts[entry.fallbackTaken] += 1;
      }

      return counts;
    },
    {
      concede: 0,
      passTurn: 0,
    },
  );
}

function countDiagnostics(entries: readonly StrategyDecisionLogEntry[]) {
  return entries.reduce(
    (counts, entry) => {
      counts.total += entry.diagnostics.length;
      counts.unsupported += entry.unsupportedSkips.length;
      counts.validation += entry.validationSkips.length;
      counts.actorResolution += entry.diagnostics.filter(
        (diagnostic) => diagnostic.kind === "actor-resolution",
      ).length;

      return counts;
    },
    {
      actorResolution: 0,
      total: 0,
      unsupported: 0,
      validation: 0,
    },
  );
}

function countChallengeOverQuest(entries: readonly StrategyDecisionLogEntry[]): number {
  let count = 0;

  for (const entry of entries) {
    if (
      entry.selectedCandidate?.family === "challenge" &&
      entry.orderedCandidates.some((candidate) => candidate.family === "quest")
    ) {
      count += 1;
    }
  }

  return count;
}

const QUESTIONABLE_CATEGORY_SEVERITY: Record<QuestionableDecision["category"], number> = {
  "suicide-challenge": 4,
  "traded-last-quester": 3,
  "low-value-challenge": 2,
  "inked-key-card": 1,
};

const KEY_CARD_DEFINITION_IDS = new Set(
  BEST_AI_CARD_PROFILES.filter(
    (profile) => profile.baseAdjust?.ink !== undefined && profile.baseAdjust.ink < 0,
  ).map((profile) => profile.definitionId),
);

function buildMatchDecisionAnalysis(
  matchId: string,
  entries: readonly StrategyDecisionLogEntry[],
): QuestionableDecision[] {
  const decisions: QuestionableDecision[] = [];

  for (const entry of entries) {
    const selectedFamily = entry.selectedCandidate?.family;

    // challenge-vs-quest analysis: split into suicide-challenge (clear
    // mistake) and low-value-challenge (debatable trade), so the digest can
    // distinguish bugs from judgment calls.
    if (
      selectedFamily === "challenge" &&
      entry.orderedCandidates.some((candidate) => candidate.family === "quest") &&
      entry.selectedCandidate
    ) {
      const heuristics = entry.selectedCandidate.heuristics;
      const findNumber = (key: string): number | undefined => {
        const found = heuristics.find((heuristic) => heuristic.key === key);
        return typeof found?.value === "number" ? found.value : undefined;
      };
      const findBoolean = (key: string): boolean | undefined => {
        const found = heuristics.find((heuristic) => heuristic.key === key);
        return typeof found?.value === "boolean" ? found.value : undefined;
      };
      const attackerSurvives = findBoolean("challengeAttackerSurvives");
      const loreSwing = findNumber("challengeLoreSwing");
      const attackerLore = findNumber("challengeAttackerLore");
      const defenderLore = findNumber("challengeDefenderLore");
      const loreTotals = entry.boardSnapshot.loreTotals as Record<string, number>;
      const opponentLore = Object.entries(loreTotals).reduce(
        (max, [playerId, score]) =>
          playerId !== entry.actorId && (score ?? 0) > max ? (score ?? 0) : max,
        0,
      );
      // Suppress suicide-challenge flags when the opponent is at true
      // end-game (≥15 lore): the strategy deliberately permits defensive
      // banish-trades there to buy a critical turn. Also suppress the
      // matchup-aware `attackerLore≥2 && opp≥10` window — the anti-suicide
      // guard in challenge.ts leaves those to card-rule and mode logic.
      const isIntentionalEndGameTrade =
        opponentLore >= 15 || ((attackerLore ?? 0) >= 2 && opponentLore >= 10);

      if (
        attackerSurvives === false &&
        loreSwing !== undefined &&
        loreSwing <= 0 &&
        attackerLore !== undefined &&
        attackerLore > 0 &&
        !isIntentionalEndGameTrade
      ) {
        decisions.push({
          category: "suicide-challenge",
          matchId,
          moveNumber: entry.moveNumber,
          turnNumber: entry.turnNumber,
          reason: `Self-banished a ${attackerLore}-lore quester for non-positive swing (swing: ${loreSwing}, defender lore: ${defenderLore ?? "?"}, opp lore: ${opponentLore})`,
        });
      } else if (
        attackerSurvives === true &&
        loreSwing !== undefined &&
        attackerLore !== undefined &&
        defenderLore !== undefined &&
        attackerLore > 0 &&
        loreSwing < attackerLore &&
        // Only flag when the defender's lore is strictly smaller than the
        // attacker's: equal-lore trades that banish the defender are
        // net-positive long-term (challenge gains `attackerLore` next turn
        // while opp can't quest with the banished defender), so the bot's
        // call is defensible even though `swing < attackerLore` for one turn.
        defenderLore < attackerLore &&
        // Skip end-game defensive trades — when opp is one turn from
        // winning, any banish-trade buys time and the strategy intentionally
        // permits the lore-suboptimal play.
        opponentLore < 15
      ) {
        decisions.push({
          category: "low-value-challenge",
          matchId,
          moveNumber: entry.moveNumber,
          turnNumber: entry.turnNumber,
          reason: `Challenged for swing ${loreSwing} instead of questing for ${attackerLore} (defender lore: ${defenderLore}, opp lore: ${opponentLore})`,
        });
      }
    }

    // traded-last-quester
    if (selectedFamily === "challenge" && entry.selectedCandidate) {
      const attackerSurvivesHeuristic = entry.selectedCandidate.heuristics.find(
        (heuristic) => heuristic.key === "challengeAttackerSurvives",
      );
      const attackerDies =
        attackerSurvivesHeuristic !== undefined && attackerSurvivesHeuristic.value === false;

      if (attackerDies) {
        const questCandidatesExcludingAttacker = entry.orderedCandidates.filter(
          (candidate) =>
            candidate.family === "quest" &&
            candidate.stableKey !== entry.selectedCandidate?.stableKey,
        );

        if (questCandidatesExcludingAttacker.length === 0) {
          decisions.push({
            category: "traded-last-quester",
            matchId,
            moveNumber: entry.moveNumber,
            turnNumber: entry.turnNumber,
            reason: "Traded last quester in a challenge where attacker would be banished",
          });
        }
      }
    }

    // inked-key-card: suppress when (a) the matchup explicitly favours
    // inking this card (positive `matchupInk:<definitionId>` contributor —
    // the deck-profile encodes intentional matchup overrides, e.g. Pete in
    // sapphire-steel vs amber-steel ramps), or (b) every ink candidate is a
    // key card, meaning the bot had no non-key alternative and was forced
    // to ink the least-bad option.
    if (
      selectedFamily === "putCardIntoInkwell" &&
      entry.selectedCandidate?.sourceDefinitionId &&
      KEY_CARD_DEFINITION_IDS.has(entry.selectedCandidate.sourceDefinitionId)
    ) {
      const definitionId = entry.selectedCandidate.sourceDefinitionId;
      const matchupInkKey = `matchupInk:${definitionId}`;
      const matchupOverrideValue = (entry.selectedCandidate.contributors ?? []).find(
        (contributor) => contributor.key === matchupInkKey,
      )?.value;
      const isMatchupDrivenInk =
        typeof matchupOverrideValue === "number" && matchupOverrideValue > 0;
      const inkCandidates = entry.orderedCandidates.filter(
        (candidate) => candidate.family === "putCardIntoInkwell",
      );
      // A candidate is "ink-averse" if it's in the curated key-card profile
      // registry OR carries an `inkAvoid` role contributor. The deck-profile
      // tags many engine cards with `inkAvoid` even when they don't have a
      // standalone profile entry — flagging on those is just as much a
      // forced-ink situation.
      const isInkAverseCandidate = (candidate: AutomatedActionCandidateSummary): boolean => {
        if (
          candidate.sourceDefinitionId !== undefined &&
          KEY_CARD_DEFINITION_IDS.has(candidate.sourceDefinitionId)
        ) {
          return true;
        }
        return (candidate.contributors ?? []).some(
          (contributor) =>
            contributor.key === "inkAvoid" &&
            typeof contributor.value === "number" &&
            contributor.value < 0,
        );
      };
      const everyInkCandidateIsKey =
        inkCandidates.length > 0 && inkCandidates.every(isInkAverseCandidate);

      if (!isMatchupDrivenInk && !everyInkCandidateIsKey) {
        const profile = BEST_AI_CARD_PROFILES.find((p) => p.definitionId === definitionId);

        decisions.push({
          category: "inked-key-card",
          matchId,
          moveNumber: entry.moveNumber,
          turnNumber: entry.turnNumber,
          reason: `Inked key card ${profile?.label ?? definitionId} (ink adjust: ${profile?.baseAdjust?.ink ?? "n/a"})`,
        });
      }
    }
  }

  // Sort by severity (highest first), then by move number
  decisions.sort((a, b) => {
    const severityDiff =
      QUESTIONABLE_CATEGORY_SEVERITY[b.category] - QUESTIONABLE_CATEGORY_SEVERITY[a.category];
    if (severityDiff !== 0) return severityDiff;
    return a.moveNumber - b.moveNumber;
  });

  return decisions.slice(0, 3);
}

function readStrategyDecisionLogEntries(path: string): StrategyDecisionLogEntry[] {
  if (!existsSync(path)) {
    return [];
  }

  const content = readFileSync(path, "utf8").trim();
  if (!content) {
    return [];
  }

  return content
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as StrategyDecisionLogEntry);
}

function extractStrategyTriageSignals(
  entries: readonly StrategyDecisionLogEntry[],
): StrategyTriageSignal[] {
  const signals: StrategyTriageSignal[] = [];

  for (const entry of entries) {
    if (entry.kind !== "execution") {
      continue;
    }

    const orderedFamilies = new Set(entry.orderedCandidates.map((candidate) => candidate.family));
    const selectedFamily = entry.selectedCandidate?.family;

    if (entry.fallbackTaken) {
      signals.push({
        category: "fallback-churn",
        matchId: entry.matchId,
      });
    }

    if (selectedFamily === "putCardIntoInkwell" && orderedFamilies.has("playCard")) {
      signals.push({
        category: "over-inking",
        matchId: entry.matchId,
      });
    }

    if (selectedFamily === "quest" && orderedFamilies.has("challenge")) {
      signals.push({
        category: "missed-challenge",
        matchId: entry.matchId,
      });
    }

    if (selectedFamily === "playCard" && orderedFamilies.has("quest")) {
      signals.push({
        category: "bad-play-before-quest",
        matchId: entry.matchId,
      });
    }

    if (
      selectedFamily === "activateAbility" &&
      (entry.diagnostics.length > 0 ||
        entry.validationSkips.length > 0 ||
        entry.unsupportedSkips.length > 0)
    ) {
      signals.push({
        category: "bad-ability-timing",
        matchId: entry.matchId,
      });
    }
  }

  return signals;
}

function ensureArtifactRoot(root: string): void {
  rmSync(root, { force: true, recursive: true });
  mkdirSync(root, { recursive: true });
}

function writeJsonlRecord(path: string, value: object): void {
  appendFileSync(path, `${JSON.stringify(value)}\n`, "utf8");
}

function resolveStrategyPlayerLabel(
  playerId: string | null | undefined,
  match: StrategyMatchDefinition,
): string {
  if (!playerId) {
    return "unknown-player";
  }

  if (playerId === "player_one") {
    return `P1 (${match.playerOne.id})`;
  }

  if (playerId === "player_two") {
    return `P2 (${match.playerTwo.id})`;
  }

  return playerId;
}

function resolveStrategyCardName(
  engine: LorcanaMultiplayerTestEngine,
  cardId: string | null | undefined,
): string | undefined {
  if (!cardId) {
    return undefined;
  }

  const card = engine.getCardDefinition(cardId);
  return card.version ? `${card.name} - ${card.version}` : card.name;
}

function resolveStrategyPlayerSlot(playerId: string | undefined): StrategyPlayerSlot | undefined {
  if (playerId === "player_one" || playerId === "player_two") {
    return playerId;
  }

  return undefined;
}

function resolveStrategyPlayerId(playerId: string | undefined): PlayerId | undefined {
  const slot = resolveStrategyPlayerSlot(playerId);
  if (slot) {
    return slot as PlayerId;
  }

  return undefined;
}

function getLoreTotal(loreTotals: StrategyLoreTotals, playerId: PlayerId): number {
  return playerId === "player_one" ? loreTotals.player_one : loreTotals.player_two;
}

function normalizeLoreTotals(loreTotals: Readonly<Record<PlayerId, number>>): StrategyLoreTotals {
  const playerOneId = resolveStrategyPlayerId("player_one");
  const playerTwoId = resolveStrategyPlayerId("player_two");

  if (!playerOneId || !playerTwoId) {
    throw new Error("Unable to resolve strategy player ids");
  }

  return {
    player_one: loreTotals[playerOneId] ?? 0,
    player_two: loreTotals[playerTwoId] ?? 0,
  };
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function getExecutionTraces(
  entries: readonly StrategyDecisionLogEntry[],
): StrategyExecutionTrace[] {
  return entries.filter((entry): entry is StrategyExecutionTrace => entry.kind === "execution");
}

function formatQuestDetail(args: {
  actorLabel: string;
  actorId: PlayerId;
  afterLoreTotals: StrategyLoreTotals;
  beforeLoreTotals: StrategyLoreTotals;
  cardId: string;
  engine: LorcanaMultiplayerTestEngine;
  prefix: string;
}): string {
  const { actorLabel, actorId, afterLoreTotals, beforeLoreTotals, cardId, engine, prefix } = args;
  const cardName = resolveStrategyCardName(engine, cardId) ?? cardId;
  const beforeLore = getLoreTotal(beforeLoreTotals, actorId);
  const afterLore = getLoreTotal(afterLoreTotals, actorId);
  const delta = afterLore - beforeLore;
  return `${prefix} ${actorLabel}: Quested with ${cardName} for ${delta} lore (total: ${afterLore})`;
}

function formatFallbackDetail(args: {
  actorLabel: string;
  move: string;
  prefix: string;
  trace: StrategyExecutionTrace;
}): string | undefined {
  const { actorLabel, move, prefix, trace } = args;
  if (trace.fallbackTaken !== move) {
    return undefined;
  }

  if (move === "passTurn") {
    return `${prefix} ${actorLabel}: Passed turn as fallback after no valid action candidates remained`;
  }

  if (move === "concede") {
    return `${prefix} ${actorLabel}: Conceded as fallback after no valid action candidates remained`;
  }

  return undefined;
}

function formatLoreDeltaDetail(args: {
  actorLabel: string;
  actorId: PlayerId;
  afterLoreTotals: StrategyLoreTotals;
  beforeLoreTotals: StrategyLoreTotals;
  move: string;
  prefix: string;
}): string | undefined {
  const { actorLabel, actorId, afterLoreTotals, beforeLoreTotals, move, prefix } = args;
  const beforeLore = getLoreTotal(beforeLoreTotals, actorId);
  const afterLore = getLoreTotal(afterLoreTotals, actorId);
  const delta = afterLore - beforeLore;

  if (delta <= 0) {
    return undefined;
  }

  return `${prefix} ${actorLabel}: executed ${move} and gained ${delta} lore (total: ${afterLore})`;
}

function formatCandidateActionDetail(args: {
  actorLabel: string;
  actorId: PlayerId;
  afterLoreTotals: StrategyLoreTotals;
  beforeLoreTotals: StrategyLoreTotals;
  engine: LorcanaMultiplayerTestEngine;
  move: string;
  prefix: string;
  trace: StrategyExecutionTrace;
}): string | undefined {
  const { actorLabel, actorId, afterLoreTotals, beforeLoreTotals, engine, move, prefix, trace } =
    args;
  const fallbackDetail = formatFallbackDetail({ actorLabel, move, prefix, trace });
  if (fallbackDetail) {
    return fallbackDetail;
  }

  const candidate = trace.selectedCandidate?.candidate;
  if (!candidate) {
    return undefined;
  }

  if (candidate.family !== move) {
    return undefined;
  }

  if (candidate.family === "quest") {
    return formatQuestDetail({
      actorLabel,
      actorId,
      afterLoreTotals,
      beforeLoreTotals,
      cardId: candidate.cardId,
      engine,
      prefix,
    });
  }

  return formatLoreDeltaDetail({
    actorLabel,
    actorId,
    afterLoreTotals,
    beforeLoreTotals,
    move,
    prefix,
  });
}

function buildGameLogTranscript(
  engine: LorcanaMultiplayerTestEngine,
  _decisionEntries: readonly StrategyDecisionLogEntry[],
  _finalLoreTotals: StrategyLoreTotals,
  match: StrategyMatchDefinition,
): string[] {
  const moveLogHistory = engine.asServer().getRuntime().getMoveLogHistory();
  const runningLore: StrategyLoreTotals = { player_one: 0, player_two: 0 };

  return moveLogHistory.map((entry) => {
    const actorLabel = resolveStrategyPlayerLabel(entry.playerId, match);
    const slot = resolveStrategyPlayerSlot(entry.playerId);

    switch (entry.moveType) {
      case "quest": {
        const message = entry.public.find((item) => item.key === "lorcana.move.quest");
        const cardId = message?.values.cardId;
        const loreGained = message?.values.loreGained ?? 0;
        const cardName = cardId
          ? (resolveStrategyCardName(engine, cardId) ?? cardId)
          : "unknown card";
        if (slot) {
          const afterLore = runningLore[slot] + loreGained;
          runningLore[slot] = afterLore;
          return `${actorLabel}: Quested with ${cardName} for ${loreGained} lore (total: ${afterLore})`;
        }
        return `${actorLabel}: Quested with ${cardName} for ${loreGained} lore`;
      }
      case "questWithAll": {
        const message = entry.public.find((item) => item.key === "lorcana.move.questWithAll");
        const count = message?.values.cardIds.length ?? 0;
        const totalLore = message?.values.loreGained ?? 0;
        if (slot) {
          const afterLore = runningLore[slot] + totalLore;
          runningLore[slot] = afterLore;
          return `${actorLabel}: Quested with ${count} character${count === 1 ? "" : "s"} for ${totalLore} lore (total: ${afterLore})`;
        }
        return `${actorLabel}: Quested with ${count} character${count === 1 ? "" : "s"} for ${totalLore} lore`;
      }
      case "inkCard": {
        const message = entry.public.find((item) => item.key === "lorcana.card.inked");
        const cardId = message?.values.cardId;
        const cardName = cardId
          ? (resolveStrategyCardName(engine, cardId) ?? cardId)
          : "unknown card";
        return `${actorLabel}: Inked ${cardName}`;
      }
      case "playCard": {
        const message = entry.public.find((item) => item.key === "lorcana.move.playCard");
        const cardId = message?.values.cardId;
        const cardName = cardId
          ? (resolveStrategyCardName(engine, cardId) ?? cardId)
          : "unknown card";
        return `${actorLabel}: Played ${cardName}`;
      }
      case "challenge": {
        const message = entry.public.find((item) => item.key === "lorcana.move.challenge");
        const attackerId = message?.values.attackerId;
        const defenderId = message?.values.defenderId;
        const attackerName = attackerId
          ? (resolveStrategyCardName(engine, attackerId) ?? attackerId)
          : "unknown attacker";
        const defenderName = defenderId
          ? (resolveStrategyCardName(engine, defenderId) ?? defenderId)
          : "unknown defender";
        return `${actorLabel}: ${attackerName} challenged ${defenderName}`;
      }
      case "turnStart":
        return `${actorLabel}: Turn started`;
      case "gameEnd":
        return "Game ended.";
      case "passTurn":
        return `${actorLabel}: Passed turn`;
      case "concede":
        return `${actorLabel}: Conceded`;
      case "chooseFirstPlayer":
        return `${actorLabel}: Chose first player`;
      case "alterHand":
        return `${actorLabel}: Mulliganed cards`;
      case "activateAbility": {
        const message = entry.public.find(
          (item) =>
            item.key === "lorcana.ability.activated" ||
            item.key === "lorcana.ability.activated.named" ||
            item.key === "lorcana.ability.activated.discardCost" ||
            item.key === "lorcana.ability.activated.named.discardCost",
        );
        const cardId = message?.values.cardId;
        const cardName = cardId
          ? (resolveStrategyCardName(engine, cardId) ?? cardId)
          : "unknown card";
        const abilityValues = message?.values as { abilityName?: string } | undefined;
        const abilityName =
          typeof abilityValues?.abilityName === "string" ? abilityValues.abilityName : undefined;
        return `${actorLabel}: Activated ${abilityName ? `${cardName} (${abilityName})` : cardName}`;
      }
      case "shiftCard":
      case "singCard": {
        const message = entry.public.find(
          (item) =>
            item.key === "lorcana.move.playCard.shift" || item.key === "lorcana.move.playCard.sing",
        );
        const cardId = message?.values.cardId;
        const cardName = cardId
          ? (resolveStrategyCardName(engine, cardId) ?? cardId)
          : "unknown card";
        return `${actorLabel}: ${entry.moveType === "shiftCard" ? "Shifted" : "Sang"} ${cardName}`;
      }
      default:
        return `${actorLabel}: ${entry.moveType}`;
    }
  });
}

function createMatchFixture(match: StrategyMatchDefinition) {
  return createFixture({
    description: `Strategy evaluation fixture for ${match.playerOne.id} versus ${match.playerTwo.id}.`,
    id: match.id,
    name: `${match.playerOne.fixture.name} vs ${match.playerTwo.fixture.name}`,
    playerOne: createFixturePlayer(match.playerOne.fixture.cards),
    playerTwo: createFixturePlayer(match.playerTwo.fixture.cards),
    seed: match.seed,
    skipPreGame: false,
  });
}

function getStrategyForActor(
  match: StrategyMatchDefinition,
  actorId: PlayerId | undefined,
): AutomatedActionStrategy | undefined {
  if (actorId === "player_one") {
    return match.playerOne.strategy;
  }

  if (actorId === "player_two") {
    return match.playerTwo.strategy;
  }

  return undefined;
}

function runStrategyMatch(
  match: StrategyMatchDefinition,
  options: {
    actionLimit?: number;
    artifactRoot?: string;
    includeGameLogTranscript?: boolean;
    repeatThreshold?: number;
    searchCaps?: Partial<AutomatedActionSearchCaps>;
    turnLimit?: number;
  } = {},
): StrategyMatchSummary {
  const matchArtifactRoot = join(options.artifactRoot ?? STRATEGY_ARTIFACT_ROOT, match.id);
  mkdirSync(matchArtifactRoot, { recursive: true });

  const strategyDecisionsPath = join(matchArtifactRoot, "strategy-decisions.jsonl");
  const gameRuntimePath = join(matchArtifactRoot, "game-runtime.jsonl");

  writeFileSync(strategyDecisionsPath, "");
  configureStrategySuiteLogging(gameRuntimePath);

  const fixture = createMatchFixture(match);
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    fixture.playerOne,
    fixture.playerTwo,
    {
      seed: match.seed,
      skipPreGame: false,
    },
  );

  const decisionEntries: StrategyDecisionLogEntry[] = [];
  const repeatedStateTracker = createRepeatedStateDeadlockTracker(options.repeatThreshold);
  let actionCount = 0;
  let deadlockConcedeCount = 0;
  let pendingDeadlock = false;

  const traceSink = {
    push(trace: AutomatedActionDecisionTrace) {
      const entry = buildDecisionEntry({
        match,
        moveNumber: decisionEntries.length + 1,
        trace,
      });

      decisionEntries.push(entry);
      writeJsonlRecord(strategyDecisionsPath, entry);
    },
  };

  let endReason: StrategyMatchEndReason | undefined;
  const maxSteps = (options.actionLimit ?? STRATEGY_ACTION_LIMIT) + 2;

  for (let step = 0; step < maxSteps && !endReason; step += 1) {
    const server = engine.asServer();
    const winner = server.getWinner();

    endReason = resolveStrategyMatchEndReason({
      actionCount,
      actionLimit: options.actionLimit,
      pendingDeadlock,
      turnLimit: options.turnLimit,
      turnNumber: server.getTurnNumber(),
      winner,
    });

    if (endReason) {
      break;
    }

    const fingerprint = computeAutomatedActionStateFingerprint(server.getState());
    const { actorId } = server.enumerateAutomatedActionsForCurrentActor();
    const strategy = getStrategyForActor(match, actorId);
    const result = server.takeAutomatedActionForCurrentActor({
      searchCaps: options.searchCaps ?? STRATEGY_SIMULATION_SEARCH_CAPS,
      strategy,
      traceSink,
    });
    actionCount += 1;

    if (result.fallbackTaken === "concede" || server.getWinner()) {
      if (result.fallbackTaken === "concede") {
        deadlockConcedeCount += 1;
      }
      pendingDeadlock = false;
      continue;
    }

    const observation = repeatedStateTracker.observe({
      actorId: result.actorId,
      stateFingerprint: fingerprint,
    });
    const deadlockResolution = resolveRepeatedStateDeadlockByConceding({
      actorId: result.actorId,
      concede: (actorId) => server.concede(actorId),
      observation,
    });

    if (deadlockResolution.conceded) {
      deadlockConcedeCount += 1;
      pendingDeadlock = false;
      continue;
    }

    pendingDeadlock = observation.repeatedStateDeadlock;
  }

  const finalState = engine.asServer().getState();
  const winner = engine.asServer().getWinner();
  const loreTotals = normalizeLoreTotals(finalState.G.lore);
  const gameLogTranscript = options.includeGameLogTranscript
    ? buildGameLogTranscript(engine, decisionEntries, loreTotals, match)
    : undefined;

  const challengeOverQuestCount = countChallengeOverQuest(decisionEntries);
  const questionableDecisions = buildMatchDecisionAnalysis(match.id, decisionEntries);

  return {
    actions: actionCount,
    artifactPaths: {
      gameRuntime: gameRuntimePath,
      strategyDecisions: strategyDecisionsPath,
    },
    challengeOverQuestCount,
    deadlockConcedeCount,
    deadlock: endReason === "repeated-state-deadlock",
    diagnosticCounts: countDiagnostics(decisionEntries),
    endReason: endReason ?? "winner",
    fallbackCounts: countFallbacks(decisionEntries),
    ...(finalState.ctx.status.reason ? { gameEndReason: finalState.ctx.status.reason } : {}),
    ...(options.includeGameLogTranscript ? { gameLogTranscript: gameLogTranscript ?? [] } : {}),
    loreTotals,
    matchId: match.id,
    outcome: endReason === "winner" ? "winner" : "terminated",
    playerOneDeckId: match.playerOne.id,
    playerOneStrategyId: match.playerOne.strategyId,
    playerTwoDeckId: match.playerTwo.id,
    playerTwoStrategyId: match.playerTwo.strategyId,
    ...(questionableDecisions.length > 0 ? { questionableDecisions } : {}),
    seed: match.seed,
    turns: engine.asServer().getTurnNumber(),
    ...(winner ? { winner } : {}),
  };
}

export function getStrategyArtifactRoot(): string {
  return STRATEGY_ARTIFACT_ROOT;
}

export function simulateAutomatedDeckMatch(
  options: StrategyMatchSimulationOptions,
): StrategyMatchSummary {
  const playerOne = normalizeStrategyDeck(options.playerOne);
  const playerTwo = normalizeStrategyDeck(options.playerTwo);
  const matchId =
    options.matchId ??
    `${sanitizeMatchSegment(playerOne.id)}-vs-${sanitizeMatchSegment(playerTwo.id)}`;

  return runStrategyMatch(
    {
      id: matchId,
      playerOne,
      playerTwo,
      seed: options.seed ?? `strategy-suite:${matchId}`,
    },
    {
      actionLimit: options.actionLimit,
      artifactRoot: options.artifactRoot,
      includeGameLogTranscript: options.includeGameLogTranscript,
      repeatThreshold: options.repeatThreshold,
      searchCaps: options.searchCaps,
      turnLimit: options.turnLimit,
    },
  );
}

export function resolveStrategyLabMatchMode(
  value = process.env.STRATEGY_MATCH_MODE,
): StrategyLabMatchMode {
  return value === "mirror" || value === "cross-deck" || value === "both" ? value : "both";
}

export function parseStrategyLabFilter(value = ""): string[] {
  return value
    .split(",")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}

export function resolveStrategyLabGameCount(
  value = process.env.STRATEGY_GAME_COUNT,
  fallback = 20,
): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

type MutableParticipantAggregate = {
  deadlockConcedeCount: number;
  deadlockGames: number;
  diagnosticCounts: StrategyDiagnosticCounts;
  fallbackCounts: StrategyFallbackCounts;
  games: number;
  losses: number;
  noWinnerGames: number;
  totalActions: number;
  totalTurns: number;
  wins: number;
};

type MutableMatchAggregate = {
  deadlockConcedeCount: number;
  deadlockGames: number;
  diagnosticCounts: StrategyDiagnosticCounts;
  fallbackCounts: StrategyFallbackCounts;
  games: number;
  noWinnerGames: number;
  totalActions: number;
  totalTurns: number;
  wins: Record<string, number>;
};

type MutableWorstMatchupAggregate = MutableParticipantAggregate & {
  classification: StrategyLabMatchClassification;
  deckId: string;
  label: string;
  matchIds: string[];
  opponentDeckId: string;
  opponentStrategyId: string;
  sampleMatches: StrategyParticipantPerspectiveRecord[];
  strategyId: string;
};

function createMutableParticipantAggregate(): MutableParticipantAggregate {
  return {
    deadlockConcedeCount: 0,
    deadlockGames: 0,
    diagnosticCounts: createEmptyDiagnosticCounts(),
    fallbackCounts: createEmptyFallbackCounts(),
    games: 0,
    losses: 0,
    noWinnerGames: 0,
    totalActions: 0,
    totalTurns: 0,
    wins: 0,
  };
}

function createMutableMatchAggregate(): MutableMatchAggregate {
  return {
    deadlockConcedeCount: 0,
    deadlockGames: 0,
    diagnosticCounts: createEmptyDiagnosticCounts(),
    fallbackCounts: createEmptyFallbackCounts(),
    games: 0,
    noWinnerGames: 0,
    totalActions: 0,
    totalTurns: 0,
    wins: {},
  };
}

function createStrategyScoreAggregate(): StrategyScoreAggregate {
  return {
    crossDeckGames: 0,
    crossDeckWins: 0,
    deadlockGames: 0,
    fallbackCount: 0,
    games: 0,
    mirrorGames: 0,
    mirrorWins: 0,
    signalDiagnostics: 0,
    totalDiagnostics: 0,
  };
}

function accumulateParticipantAggregate(
  target: MutableParticipantAggregate,
  record: StrategyParticipantPerspectiveRecord,
): void {
  target.games += 1;
  target.totalActions += record.actions;
  target.totalTurns += record.turns;
  target.deadlockConcedeCount += record.deadlockConcedeCount;
  if (record.deadlock) {
    target.deadlockGames += 1;
  }
  addFallbackCounts(target.fallbackCounts, record.fallbackCounts);
  addDiagnosticCounts(target.diagnosticCounts, record.diagnosticCounts);

  if (record.outcome === "win") {
    target.wins += 1;
  } else if (record.outcome === "loss") {
    target.losses += 1;
  } else {
    target.noWinnerGames += 1;
  }
}

function accumulateMatchAggregate(
  target: MutableMatchAggregate,
  match: StrategyMatchSummary,
  winnerKey?: string,
): void {
  target.games += 1;
  target.totalActions += match.actions;
  target.totalTurns += match.turns;
  target.deadlockConcedeCount += match.deadlockConcedeCount;
  if (match.deadlock) {
    target.deadlockGames += 1;
  }
  addFallbackCounts(target.fallbackCounts, match.fallbackCounts);
  addDiagnosticCounts(target.diagnosticCounts, match.diagnosticCounts);

  if (winnerKey) {
    target.wins[winnerKey] = (target.wins[winnerKey] ?? 0) + 1;
  } else {
    target.noWinnerGames += 1;
  }
}

function accumulateScoreAggregate(
  target: StrategyScoreAggregate,
  record: StrategyParticipantPerspectiveRecord,
): void {
  target.games += 1;
  target.deadlockGames += record.deadlock ? 1 : 0;
  target.fallbackCount += record.fallbackCounts.concede + record.fallbackCounts.passTurn;
  target.totalDiagnostics += record.diagnosticCounts.total;
  target.signalDiagnostics +=
    record.diagnosticCounts.unsupported + record.diagnosticCounts.validation;

  if (record.classification === "mirror") {
    target.mirrorGames += 1;
    target.mirrorWins += record.outcome === "win" ? 1 : 0;
  }

  if (record.classification === "cross-deck") {
    target.crossDeckGames += 1;
    target.crossDeckWins += record.outcome === "win" ? 1 : 0;
  }
}

function finalizeScoreAggregate(aggregate: StrategyScoreAggregate): StrategyLabScoreMetrics {
  const deadlockFallbackPenalty =
    aggregate.games === 0
      ? 0
      : (aggregate.deadlockGames + aggregate.fallbackCount) / aggregate.games;
  const diagnosticPenalty =
    aggregate.games === 0 ? 0 : aggregate.signalDiagnostics / aggregate.games;
  const mirrorScore =
    aggregate.mirrorGames === 0 ? 0 : aggregate.mirrorWins / aggregate.mirrorGames;
  const crossDeckScore =
    aggregate.crossDeckGames === 0 ? 0 : aggregate.crossDeckWins / aggregate.crossDeckGames;

  return {
    blendedScore: roundScore(
      0.5 * mirrorScore +
        0.3 * crossDeckScore -
        0.1 * deadlockFallbackPenalty -
        0.1 * diagnosticPenalty,
    ),
    crossDeckScore: roundScore(crossDeckScore),
    deadlockFallbackPenalty: roundScore(deadlockFallbackPenalty),
    diagnosticPenalty: roundScore(diagnosticPenalty),
    fallbackCount: aggregate.fallbackCount,
    games: aggregate.games,
    mirrorScore: roundScore(mirrorScore),
    signalDiagnostics: aggregate.signalDiagnostics,
    totalDeadlockGames: aggregate.deadlockGames,
    totalDiagnostics: aggregate.totalDiagnostics,
  };
}

function compareStrategyRecords(
  left: StrategyLabStrategyRecord,
  right: StrategyLabStrategyRecord,
): number {
  return (
    right.winRate - left.winRate ||
    right.wins - left.wins ||
    left.noWinnerGames - right.noWinnerGames ||
    left.strategyId.localeCompare(right.strategyId)
  );
}

function compareMirrorRecords(
  left: StrategyLabMirrorDeckRecord | StrategyLabMirrorStrategyPairRecord,
  right: StrategyLabMirrorDeckRecord | StrategyLabMirrorStrategyPairRecord,
): number {
  return (
    left.classification.localeCompare(right.classification) ||
    left.strategyPairLabel.localeCompare(right.strategyPairLabel)
  );
}

function compareCrossDeckDeckRecords(
  left: StrategyLabCrossDeckDeckRecord,
  right: StrategyLabCrossDeckDeckRecord,
): number {
  return (
    right.winRate - left.winRate ||
    right.wins - left.wins ||
    left.deckId.localeCompare(right.deckId) ||
    left.strategyId.localeCompare(right.strategyId)
  );
}

function compareCrossDeckPairRecords(
  left: StrategyLabCrossDeckOrderedPairRecord,
  right: StrategyLabCrossDeckOrderedPairRecord,
): number {
  return (
    left.orderedDeckPairLabel.localeCompare(right.orderedDeckPairLabel) ||
    left.playerOneStrategyId.localeCompare(right.playerOneStrategyId) ||
    left.playerTwoStrategyId.localeCompare(right.playerTwoStrategyId)
  );
}

function compareWorstMatchups(
  left: StrategyLabWorstMatchupRecord,
  right: StrategyLabWorstMatchupRecord,
): number {
  const leftPressure =
    left.deadlockGames +
    left.deadlockConcedeCount +
    left.fallbackCounts.concede +
    left.fallbackCounts.passTurn;
  const rightPressure =
    right.deadlockGames +
    right.deadlockConcedeCount +
    right.fallbackCounts.concede +
    right.fallbackCounts.passTurn;

  return (
    left.winRate - right.winRate ||
    rightPressure - leftPressure ||
    right.diagnosticCounts.total - left.diagnosticCounts.total ||
    left.label.localeCompare(right.label)
  );
}

function compareDiagnosticHotspots(
  left: StrategyLabDiagnosticHotspotRecord,
  right: StrategyLabDiagnosticHotspotRecord,
): number {
  return (
    right.total - left.total ||
    right.actorResolution - left.actorResolution ||
    right.validation - left.validation ||
    right.unsupported - left.unsupported ||
    left.label.localeCompare(right.label)
  );
}

function compareScorecards(
  left: StrategyLabCandidateScorecard,
  right: StrategyLabCandidateScorecard,
): number {
  return (
    right.score.blendedScore - left.score.blendedScore ||
    right.score.mirrorScore - left.score.mirrorScore ||
    right.score.crossDeckScore - left.score.crossDeckScore ||
    left.candidateId.localeCompare(right.candidateId)
  );
}

function compareTriageCategories(
  left: StrategyLabTriageCategoryRecord,
  right: StrategyLabTriageCategoryRecord,
): number {
  return (
    right.count - left.count ||
    right.matchIds.length - left.matchIds.length ||
    left.label.localeCompare(right.label)
  );
}

function finalizeParticipantAggregate(
  aggregate: MutableParticipantAggregate,
): Omit<StrategyLabStrategyRecord, "strategyId"> {
  return {
    averageActions: roundAverage(aggregate.totalActions, aggregate.games),
    averageTurns: roundAverage(aggregate.totalTurns, aggregate.games),
    deadlockConcedeCount: aggregate.deadlockConcedeCount,
    deadlockGames: aggregate.deadlockGames,
    diagnosticCounts: aggregate.diagnosticCounts,
    fallbackCounts: aggregate.fallbackCounts,
    games: aggregate.games,
    losses: aggregate.losses,
    noWinnerGames: aggregate.noWinnerGames,
    winRate: roundAverage(aggregate.wins, aggregate.games),
    wins: aggregate.wins,
  };
}

function finalizeMatchAggregate(
  aggregate: MutableMatchAggregate,
): Omit<
  StrategyLabMirrorDeckRecord,
  "classification" | "deckId" | "strategyPairId" | "strategyPairLabel"
> {
  return {
    averageActions: roundAverage(aggregate.totalActions, aggregate.games),
    averageTurns: roundAverage(aggregate.totalTurns, aggregate.games),
    deadlockConcedeCount: aggregate.deadlockConcedeCount,
    deadlockGames: aggregate.deadlockGames,
    diagnosticCounts: aggregate.diagnosticCounts,
    fallbackCounts: aggregate.fallbackCounts,
    games: aggregate.games,
    noWinnerGames: aggregate.noWinnerGames,
    wins: aggregate.wins,
  };
}

function formatWinsRecord(record: Record<string, number>): string {
  const entries = Object.entries(record).sort((left, right) => left[0].localeCompare(right[0]));
  return entries.length === 0
    ? "none"
    : entries.map(([key, value]) => `${key}:${value}`).join(", ");
}

function formatFallbackCountsForMarkdown(counts: StrategyFallbackCounts): string {
  return `concede ${counts.concede}, pass ${counts.passTurn}`;
}

function formatDiagnosticCountsForMarkdown(counts: StrategyDiagnosticCounts): string {
  return `total ${counts.total}, actor ${counts.actorResolution}, validation ${counts.validation}, unsupported ${counts.unsupported}`;
}

function buildRecommendationReason(record: StrategyLabWorstMatchupRecord): string {
  const reasons: string[] = [];

  if (record.deadlockGames > 0 || record.deadlockConcedeCount > 0) {
    reasons.push(
      `deadlocks ${record.deadlockGames}, deadlock concedes ${record.deadlockConcedeCount}`,
    );
  }

  if (record.fallbackCounts.concede > 0 || record.fallbackCounts.passTurn > 0) {
    reasons.push(`fallbacks ${formatFallbackCountsForMarkdown(record.fallbackCounts)}`);
  }

  if (record.diagnosticCounts.total > 0) {
    reasons.push(`diagnostics ${formatDiagnosticCountsForMarkdown(record.diagnosticCounts)}`);
  }

  return reasons.join("; ") || "lowest win rate in this run";
}

function buildStrategyPromotionGate(args: {
  baselineScore?: StrategyLabScoreMetrics;
  candidateScore: StrategyLabScoreMetrics;
}): StrategyLabPromotionGateResult {
  const { baselineScore, candidateScore } = args;

  if (!baselineScore || baselineScore.games === 0) {
    return {
      passed: false,
      reasons: ["Baseline strategy was not present in this benchmark run."],
    };
  }

  const reasons: string[] = [];
  const fallbackIncreaseLimit = Math.ceil(baselineScore.fallbackCount * 0.05);
  const diagnosticIncreaseLimit = Math.ceil(baselineScore.signalDiagnostics * 0.05);

  if (candidateScore.blendedScore - baselineScore.blendedScore < 0.02) {
    reasons.push("Blended score did not improve by at least 0.02.");
  }

  if (candidateScore.mirrorScore < baselineScore.mirrorScore - 0.01) {
    reasons.push("Mirror win rate regressed by more than 0.01.");
  }

  if (candidateScore.totalDeadlockGames > baselineScore.totalDeadlockGames) {
    reasons.push("Deadlock games increased.");
  }

  if (candidateScore.fallbackCount > baselineScore.fallbackCount + fallbackIncreaseLimit) {
    reasons.push("Fallback count increased by more than 5%.");
  }

  if (
    candidateScore.signalDiagnostics >
    baselineScore.signalDiagnostics + diagnosticIncreaseLimit
  ) {
    reasons.push("Diagnostic count increased by more than 5%.");
  }

  return {
    passed: reasons.length === 0,
    reasons: reasons.length === 0 ? ["Candidate passed the promotion gate."] : reasons,
  };
}

function buildStrategyCandidateScorecards(args: {
  baselineStrategyId: string;
  candidateManifests: readonly StrategyCandidateManifest[];
  participantRecords: readonly StrategyParticipantPerspectiveRecord[];
  summary: StrategySuiteRunSummary;
}): StrategyLabCandidateScorecard[] {
  const { baselineStrategyId, candidateManifests, participantRecords, summary } = args;
  const coreDeckIds = new Set<string>(CORE_STRATEGY_BENCHMARK_DECK_IDS);
  const benchmarkDeckIds = sortStrings(
    new Set(summary.deckIds.filter((deckId) => coreDeckIds.has(deckId))),
  );
  const scoringDeckIds = new Set(
    benchmarkDeckIds.length > 0 ? benchmarkDeckIds : sortStrings(summary.deckIds),
  );

  const buildScoreForStrategy = (strategyId: string): StrategyLabScoreMetrics => {
    const aggregate = createStrategyScoreAggregate();

    for (const record of participantRecords) {
      if (record.strategyId !== strategyId || !scoringDeckIds.has(record.deckId)) {
        continue;
      }

      if (record.classification === "cross-deck" && !scoringDeckIds.has(record.opponentDeckId)) {
        continue;
      }

      accumulateScoreAggregate(aggregate, record);
    }

    return finalizeScoreAggregate(aggregate);
  };

  const baselineScore = buildScoreForStrategy(baselineStrategyId);

  return candidateManifests
    .map((manifest) => {
      const candidateScore = buildScoreForStrategy(manifest.candidateId);

      return {
        baselineStrategyId,
        candidateId: manifest.candidateId,
        changedHeuristics: [...manifest.changedHeuristics],
        deltaVsBaseline:
          baselineScore.games > 0
            ? {
                blendedScore: roundScore(candidateScore.blendedScore - baselineScore.blendedScore),
                crossDeckScore: roundScore(
                  candidateScore.crossDeckScore - baselineScore.crossDeckScore,
                ),
                deadlockFallbackPenalty: roundScore(
                  candidateScore.deadlockFallbackPenalty - baselineScore.deadlockFallbackPenalty,
                ),
                diagnosticPenalty: roundScore(
                  candidateScore.diagnosticPenalty - baselineScore.diagnosticPenalty,
                ),
                fallbackCount: candidateScore.fallbackCount - baselineScore.fallbackCount,
                mirrorScore: roundScore(candidateScore.mirrorScore - baselineScore.mirrorScore),
                signalDiagnostics:
                  candidateScore.signalDiagnostics - baselineScore.signalDiagnostics,
                totalDeadlockGames:
                  candidateScore.totalDeadlockGames - baselineScore.totalDeadlockGames,
                totalDiagnostics: candidateScore.totalDiagnostics - baselineScore.totalDiagnostics,
              }
            : undefined,
        hypothesis: manifest.hypothesis,
        notes: manifest.notes,
        parentStrategyId: manifest.parentStrategyId,
        promotionGate: buildStrategyPromotionGate({
          baselineScore,
          candidateScore,
        }),
        score: candidateScore,
        status: manifest.status,
      };
    })
    .sort(compareScorecards);
}

function buildStrategyTriageSummary(args: {
  inspectNext: readonly StrategyLabInspectionRecommendation[];
  summary: StrategySuiteRunSummary;
}): { categories: StrategyLabTriageCategoryRecord[] } {
  const recommendationByMatchId = new Map(
    args.inspectNext.map((recommendation) => [recommendation.matchId, recommendation]),
  );
  const signalTotals = new Map<
    StrategyLabTriageCategory,
    { count: number; matchIds: Set<string> }
  >();

  for (const match of args.summary.matches) {
    const entries = readStrategyDecisionLogEntries(match.artifactPaths.strategyDecisions);

    for (const signal of extractStrategyTriageSignals(entries)) {
      const aggregate = signalTotals.get(signal.category) ?? {
        count: 0,
        matchIds: new Set<string>(),
      };
      aggregate.count += 1;
      aggregate.matchIds.add(signal.matchId);
      signalTotals.set(signal.category, aggregate);
    }
  }

  return {
    categories: [...signalTotals.entries()]
      .map(([category, aggregate]) => {
        const matchIds = sortStrings(aggregate.matchIds);
        const recommendations = matchIds
          .map((matchId) => recommendationByMatchId.get(matchId))
          .filter(
            (recommendation): recommendation is StrategyLabInspectionRecommendation =>
              recommendation !== undefined,
          )
          .slice(0, 3);

        return {
          category,
          count: aggregate.count,
          label: STRATEGY_TRIAGE_LABELS[category],
          matchIds,
          recommendations,
          summary: `${STRATEGY_TRIAGE_LABELS[category]} showed up in ${aggregate.count} traced decisions across ${matchIds.length} match${matchIds.length === 1 ? "" : "es"}.`,
        };
      })
      .sort(compareTriageCategories),
  };
}

function buildBenchmarkSummaryMarkdown(report: StrategyLabReport): string {
  const topStrategies = report.strategyRecords.slice(0, 5);
  const topScorecards = report.scorecards.slice(0, 5);
  const triageCategories = report.triage.categories.slice(0, 5);
  const worstMatchups = report.worstMatchups.slice(0, 5);
  const recommendations = report.inspectNext.slice(0, 5);
  const lines = [
    "# Strategy Lab Benchmark Summary",
    "",
    "## Run Metadata",
    `- Generated at: ${report.generatedAt}`,
    `- Preset: ${report.preset ?? "custom"}`,
    `- Mode: ${report.mode}`,
    `- Shared game count fallback: ${report.gameCount}`,
    `- Mirror games per pairing: ${report.gameCounts.mirror}`,
    `- Cross-deck games per pairing: ${report.gameCounts.crossDeck}`,
    `- Total matches: ${report.overall.games}`,
    `- Baseline strategy: ${report.baselineStrategyId}`,
    `- Decks: ${report.deckIds.join(", ") || "none"}`,
    `- Strategies: ${report.strategyIds.join(", ") || "none"}`,
    `- Match classifications: mirror ${report.matchClassifications.mirror}, mirror-same-strategy ${report.matchClassifications["mirror-same-strategy"]}, cross-deck ${report.matchClassifications["cross-deck"]}`,
    "",
    "## Candidate Scorecards",
    "| Candidate | Status | Parent | Blended | Mirror | Cross-Deck | Deadlock/Fallback Penalty | Diagnostic Penalty | Signal Diag | Delta Vs Baseline | Gate |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...(topScorecards.length > 0
      ? topScorecards.map(
          (scorecard) =>
            `| ${scorecard.candidateId} | ${scorecard.status} | ${scorecard.parentStrategyId} | ${scorecard.score.blendedScore.toFixed(4)} | ${scorecard.score.mirrorScore.toFixed(4)} | ${scorecard.score.crossDeckScore.toFixed(4)} | ${scorecard.score.deadlockFallbackPenalty.toFixed(4)} | ${scorecard.score.diagnosticPenalty.toFixed(4)} | ${scorecard.score.signalDiagnostics} | ${scorecard.deltaVsBaseline?.blendedScore?.toFixed(4) ?? "n/a"} | ${scorecard.promotionGate.passed ? "pass" : "hold"} |`,
        )
      : ["| none | n/a | n/a | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0 | n/a | hold |"]),
    ...(topScorecards.length > 0
      ? topScorecards.flatMap((scorecard) => [
          `- ${scorecard.candidateId}: ${scorecard.hypothesis}`,
          `- heuristics: ${scorecard.changedHeuristics.join("; ") || "none"}`,
          `- promotion gate: ${scorecard.promotionGate.reasons.join(" ")}`,
        ])
      : []),
    "",
    "## Top Strategies",
    "| Strategy | Win Rate | Wins | Losses | No Winner | Avg Turns | Avg Actions | Deadlocks | Fallbacks |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...(topStrategies.length > 0
      ? topStrategies.map(
          (record) =>
            `| ${record.strategyId} | ${record.winRate.toFixed(2)} | ${record.wins} | ${record.losses} | ${record.noWinnerGames} | ${record.averageTurns.toFixed(2)} | ${record.averageActions.toFixed(2)} | ${record.deadlockGames}/${record.deadlockConcedeCount} | ${formatFallbackCountsForMarkdown(record.fallbackCounts)} |`,
        )
      : ["| none | 0.00 | 0 | 0 | 0 | 0.00 | 0.00 | 0/0 | concede 0, pass 0 |"]),
    "",
    "## Worst Matchups",
    "| Matchup | Win Rate | Games | Losses | Deadlocks | Fallbacks | Diagnostics |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...(worstMatchups.length > 0
      ? worstMatchups.map(
          (record) =>
            `| ${record.label} | ${record.winRate.toFixed(2)} | ${record.games} | ${record.losses} | ${record.deadlockGames}/${record.deadlockConcedeCount} | ${formatFallbackCountsForMarkdown(record.fallbackCounts)} | ${formatDiagnosticCountsForMarkdown(record.diagnosticCounts)} |`,
        )
      : [
          "| none | 0.00 | 0 | 0 | 0/0 | concede 0, pass 0 | total 0, actor 0, validation 0, unsupported 0 |",
        ]),
    "",
    "## Deadlock And Fallback Summary",
    `- Deadlock games: ${report.overall.deadlockGames}`,
    `- Deadlock concedes: ${report.overall.deadlockConcedeCount}`,
    `- Fallbacks: ${formatFallbackCountsForMarkdown(report.overall.fallbackCounts)}`,
    `- Diagnostics: ${formatDiagnosticCountsForMarkdown(report.overall.diagnosticCounts)}`,
    `- Challenge over quest: ${report.challengeOverQuestCount}`,
    "",
    "## Questionable Decisions",
    "| Match | Turn | Category | Reason |",
    "| --- | --- | --- | --- |",
    ...(report.questionableDecisions.length > 0
      ? report.questionableDecisions.map(
          (decision) =>
            `| ${decision.matchId} | ${decision.turnNumber} | ${decision.category} | ${decision.reason} |`,
        )
      : ["| none | 0 | n/a | n/a |"]),
    "",
    "## Triage Backlog",
    "| Category | Signals | Matches | Recommended Transcripts |",
    "| --- | --- | --- | --- |",
    ...(triageCategories.length > 0
      ? triageCategories.map(
          (category) =>
            `| ${category.label} | ${category.count} | ${category.matchIds.length} | ${category.recommendations.map((recommendation) => recommendation.matchId).join(", ") || "none"} |`,
        )
      : ["| none | 0 | 0 | none |"]),
    ...(triageCategories.length > 0
      ? triageCategories.map((category) => `- ${category.summary}`)
      : []),
    "",
    "## Suggested Transcripts To Inspect Next",
    ...(recommendations.length > 0
      ? recommendations.flatMap((recommendation) => [
          `- ${recommendation.matchId} (${recommendation.strategyId} on ${recommendation.deckId} vs ${recommendation.opponentStrategyId} on ${recommendation.opponentDeckId}, ${recommendation.classification})`,
          `  reason: ${recommendation.reason}`,
          `  decisions: ${recommendation.artifactPaths.strategyDecisions}`,
          `  runtime: ${recommendation.artifactPaths.gameRuntime}`,
        ])
      : ["- No recommendations generated"]),
  ];

  return `${lines.join("\n")}\n`;
}

export function buildStrategyLabReport(summary: StrategySuiteRunSummary): StrategyLabReport {
  const playerOneWinnerId = resolveStrategyPlayerId("player_one");
  const playerTwoWinnerId = resolveStrategyPlayerId("player_two");

  if (!playerOneWinnerId || !playerTwoWinnerId) {
    throw new Error("Unable to resolve winner ids for strategy lab reporting");
  }

  const matchClassifications: Record<StrategyLabMatchClassification, number> = {
    "cross-deck": 0,
    mirror: 0,
    "mirror-same-strategy": 0,
  };
  const overall = {
    deadlockConcedeCount: 0,
    deadlockGames: 0,
    diagnosticCounts: createEmptyDiagnosticCounts(),
    fallbackCounts: createEmptyFallbackCounts(),
    games: summary.matches.length,
    noWinnerGames: 0,
    terminatedGames: 0,
    totalActions: 0,
    totalTurns: 0,
    winnerCounts: {
      "no-winner": 0,
      [playerOneWinnerId]: 0,
      [playerTwoWinnerId]: 0,
    } satisfies Record<PlayerId | "no-winner", number>,
  };
  const strategyTotals = new Map<string, MutableParticipantAggregate>();
  const crossDeckStrategyTotals = new Map<string, MutableParticipantAggregate>();
  const crossDeckDeckTotals = new Map<string, MutableParticipantAggregate>();
  const mirrorDeckTotals = new Map<
    string,
    MutableMatchAggregate & {
      classification: "mirror" | "mirror-same-strategy";
      deckId: string;
      strategyPairId: string;
      strategyPairLabel: string;
    }
  >();
  const mirrorStrategyPairTotals = new Map<
    string,
    MutableMatchAggregate & {
      classification: "mirror" | "mirror-same-strategy";
      strategyPairId: string;
      strategyPairLabel: string;
    }
  >();
  const crossDeckPairTotals = new Map<
    string,
    MutableMatchAggregate & {
      orderedDeckPairId: string;
      orderedDeckPairLabel: string;
      playerOneDeckId: string;
      playerOneStrategyId: string;
      playerTwoDeckId: string;
      playerTwoStrategyId: string;
    }
  >();
  const worstMatchupTotals = new Map<string, MutableWorstMatchupAggregate>();
  const diagnosticsByStrategy = new Map<
    string,
    { games: number; counts: StrategyDiagnosticCounts; label: string }
  >();
  const diagnosticsByMatchup = new Map<
    string,
    { games: number; counts: StrategyDiagnosticCounts; label: string }
  >();
  const participantRecords: StrategyParticipantPerspectiveRecord[] = [];

  for (const match of summary.matches) {
    const classification = classifyStrategyMatch(match);
    matchClassifications[classification] += 1;
    overall.totalActions += match.actions;
    overall.totalTurns += match.turns;
    overall.deadlockConcedeCount += match.deadlockConcedeCount;
    if (match.deadlock) {
      overall.deadlockGames += 1;
    }
    if (match.outcome === "terminated") {
      overall.terminatedGames += 1;
    }
    addFallbackCounts(overall.fallbackCounts, match.fallbackCounts);
    addDiagnosticCounts(overall.diagnosticCounts, match.diagnosticCounts);
    const winnerLabel = getMatchWinnerLabel(match);
    overall.winnerCounts[winnerLabel] += 1;
    if (winnerLabel === "no-winner") {
      overall.noWinnerGames += 1;
    }

    if (classification !== "cross-deck") {
      const { pairId, pairLabel } = buildStrategyPairIds(
        match.playerOneStrategyId,
        match.playerTwoStrategyId,
      );
      const mirrorDeckKey = `${classification}::${match.playerOneDeckId}::${pairId}`;
      const mirrorDeckRecord = mirrorDeckTotals.get(mirrorDeckKey) ?? {
        ...createMutableMatchAggregate(),
        classification,
        deckId: match.playerOneDeckId,
        strategyPairId: pairId,
        strategyPairLabel: pairLabel,
      };
      accumulateMatchAggregate(
        mirrorDeckRecord,
        match,
        match.winner === "player_one"
          ? match.playerOneStrategyId
          : match.winner === "player_two"
            ? match.playerTwoStrategyId
            : undefined,
      );
      mirrorDeckTotals.set(mirrorDeckKey, mirrorDeckRecord);

      const mirrorPairKey = `${classification}::${pairId}`;
      const mirrorPairRecord = mirrorStrategyPairTotals.get(mirrorPairKey) ?? {
        ...createMutableMatchAggregate(),
        classification,
        strategyPairId: pairId,
        strategyPairLabel: pairLabel,
      };
      accumulateMatchAggregate(
        mirrorPairRecord,
        match,
        match.winner === "player_one"
          ? match.playerOneStrategyId
          : match.winner === "player_two"
            ? match.playerTwoStrategyId
            : undefined,
      );
      mirrorStrategyPairTotals.set(mirrorPairKey, mirrorPairRecord);
    }

    if (classification === "cross-deck") {
      const orderedDeckPairId = buildOrderedDeckPairId(match);
      const orderedDeckPairLabel = `${match.playerOneDeckId} (${match.playerOneStrategyId}) vs ${match.playerTwoDeckId} (${match.playerTwoStrategyId})`;
      const pairRecord = crossDeckPairTotals.get(orderedDeckPairId) ?? {
        ...createMutableMatchAggregate(),
        orderedDeckPairId,
        orderedDeckPairLabel,
        playerOneDeckId: match.playerOneDeckId,
        playerOneStrategyId: match.playerOneStrategyId,
        playerTwoDeckId: match.playerTwoDeckId,
        playerTwoStrategyId: match.playerTwoStrategyId,
      };
      accumulateMatchAggregate(
        pairRecord,
        match,
        match.winner === "player_one"
          ? `${match.playerOneDeckId} (${match.playerOneStrategyId})`
          : match.winner === "player_two"
            ? `${match.playerTwoDeckId} (${match.playerTwoStrategyId})`
            : undefined,
      );
      crossDeckPairTotals.set(orderedDeckPairId, pairRecord);
    }

    for (const participantRecord of expandParticipantPerspectiveRecords(match)) {
      participantRecords.push(participantRecord);
      const strategyRecord =
        strategyTotals.get(participantRecord.strategyId) ?? createMutableParticipantAggregate();
      accumulateParticipantAggregate(strategyRecord, participantRecord);
      strategyTotals.set(participantRecord.strategyId, strategyRecord);

      if (participantRecord.classification === "cross-deck") {
        const crossDeckStrategyRecord =
          crossDeckStrategyTotals.get(participantRecord.strategyId) ??
          createMutableParticipantAggregate();
        accumulateParticipantAggregate(crossDeckStrategyRecord, participantRecord);
        crossDeckStrategyTotals.set(participantRecord.strategyId, crossDeckStrategyRecord);

        const crossDeckDeckKey = `${participantRecord.deckId}::${participantRecord.strategyId}`;
        const crossDeckDeckRecord =
          crossDeckDeckTotals.get(crossDeckDeckKey) ?? createMutableParticipantAggregate();
        accumulateParticipantAggregate(crossDeckDeckRecord, participantRecord);
        crossDeckDeckTotals.set(crossDeckDeckKey, crossDeckDeckRecord);
      }

      const matchupLabel = `${participantRecord.strategyId} on ${participantRecord.deckId} vs ${participantRecord.opponentStrategyId} on ${participantRecord.opponentDeckId}`;
      const worstMatchupKey = [
        participantRecord.classification,
        participantRecord.deckId,
        participantRecord.strategyId,
        participantRecord.opponentDeckId,
        participantRecord.opponentStrategyId,
      ].join("::");
      const worstMatchupRecord = worstMatchupTotals.get(worstMatchupKey) ?? {
        ...createMutableParticipantAggregate(),
        classification: participantRecord.classification,
        deckId: participantRecord.deckId,
        label: matchupLabel,
        matchIds: [],
        opponentDeckId: participantRecord.opponentDeckId,
        opponentStrategyId: participantRecord.opponentStrategyId,
        sampleMatches: [],
        strategyId: participantRecord.strategyId,
      };
      accumulateParticipantAggregate(worstMatchupRecord, participantRecord);
      worstMatchupRecord.matchIds.push(participantRecord.matchId);
      worstMatchupRecord.sampleMatches.push(participantRecord);
      worstMatchupTotals.set(worstMatchupKey, worstMatchupRecord);

      const strategyDiagnosticRecord = diagnosticsByStrategy.get(participantRecord.strategyId) ?? {
        counts: createEmptyDiagnosticCounts(),
        games: 0,
        label: participantRecord.strategyId,
      };
      strategyDiagnosticRecord.games += 1;
      addDiagnosticCounts(strategyDiagnosticRecord.counts, participantRecord.diagnosticCounts);
      diagnosticsByStrategy.set(participantRecord.strategyId, strategyDiagnosticRecord);

      const matchupDiagnosticRecord = diagnosticsByMatchup.get(worstMatchupKey) ?? {
        counts: createEmptyDiagnosticCounts(),
        games: 0,
        label: matchupLabel,
      };
      matchupDiagnosticRecord.games += 1;
      addDiagnosticCounts(matchupDiagnosticRecord.counts, participantRecord.diagnosticCounts);
      diagnosticsByMatchup.set(worstMatchupKey, matchupDiagnosticRecord);
    }
  }

  const strategyRecords = [...strategyTotals.entries()]
    .map(([strategyId, aggregate]) => ({
      strategyId,
      ...finalizeParticipantAggregate(aggregate),
    }))
    .sort(compareStrategyRecords);

  const mirrorDeckRecords = [...mirrorDeckTotals.values()]
    .map((aggregate) => ({
      classification: aggregate.classification,
      deckId: aggregate.deckId,
      strategyPairId: aggregate.strategyPairId,
      strategyPairLabel: aggregate.strategyPairLabel,
      ...finalizeMatchAggregate(aggregate),
    }))
    .sort(
      (left, right) => left.deckId.localeCompare(right.deckId) || compareMirrorRecords(left, right),
    );

  const mirrorStrategyPairRecords = [...mirrorStrategyPairTotals.values()]
    .map((aggregate) => ({
      classification: aggregate.classification,
      strategyPairId: aggregate.strategyPairId,
      strategyPairLabel: aggregate.strategyPairLabel,
      ...finalizeMatchAggregate(aggregate),
    }))
    .sort(compareMirrorRecords);

  const crossDeckDeckRecords = [...crossDeckDeckTotals.entries()]
    .map(([key, aggregate]) => {
      const [deckId, strategyId] = key.split("::");

      if (!deckId || !strategyId) {
        throw new Error(`Invalid cross-deck deck key: ${key}`);
      }

      return {
        deckId,
        strategyId,
        ...finalizeParticipantAggregate(aggregate),
      };
    })
    .sort(compareCrossDeckDeckRecords);

  const crossDeckStrategyRecords = [...crossDeckStrategyTotals.entries()]
    .map(([strategyId, aggregate]) => ({
      strategyId,
      ...finalizeParticipantAggregate(aggregate),
    }))
    .sort(compareStrategyRecords);

  const crossDeckOrderedPairRecords = [...crossDeckPairTotals.values()]
    .map((aggregate) => ({
      orderedDeckPairId: aggregate.orderedDeckPairId,
      orderedDeckPairLabel: aggregate.orderedDeckPairLabel,
      playerOneDeckId: aggregate.playerOneDeckId,
      playerOneStrategyId: aggregate.playerOneStrategyId,
      playerTwoDeckId: aggregate.playerTwoDeckId,
      playerTwoStrategyId: aggregate.playerTwoStrategyId,
      ...finalizeMatchAggregate(aggregate),
    }))
    .sort(compareCrossDeckPairRecords);

  const worstMatchups = [...worstMatchupTotals.values()]
    .map((aggregate) => ({
      classification: aggregate.classification,
      deckId: aggregate.deckId,
      label: aggregate.label,
      matchIds: sortStrings(new Set(aggregate.matchIds)),
      opponentDeckId: aggregate.opponentDeckId,
      opponentStrategyId: aggregate.opponentStrategyId,
      strategyId: aggregate.strategyId,
      ...finalizeParticipantAggregate(aggregate),
    }))
    .sort(compareWorstMatchups);

  const diagnostics = {
    byMatchup: [...diagnosticsByMatchup.values()]
      .map((aggregate) => ({
        actorResolution: aggregate.counts.actorResolution,
        label: aggregate.label,
        perGame: roundAverage(aggregate.counts.total, aggregate.games),
        total: aggregate.counts.total,
        unsupported: aggregate.counts.unsupported,
        validation: aggregate.counts.validation,
      }))
      .sort(compareDiagnosticHotspots),
    byStrategy: [...diagnosticsByStrategy.values()]
      .map((aggregate) => ({
        actorResolution: aggregate.counts.actorResolution,
        label: aggregate.label,
        perGame: roundAverage(aggregate.counts.total, aggregate.games),
        total: aggregate.counts.total,
        unsupported: aggregate.counts.unsupported,
        validation: aggregate.counts.validation,
      }))
      .sort(compareDiagnosticHotspots),
  };

  const inspectNext = worstMatchups.slice(0, 5).flatMap((record) => {
    const aggregate = [...worstMatchupTotals.values()].find(
      (item) =>
        item.classification === record.classification &&
        item.deckId === record.deckId &&
        item.strategyId === record.strategyId &&
        item.opponentDeckId === record.opponentDeckId &&
        item.opponentStrategyId === record.opponentStrategyId,
    );

    if (!aggregate) {
      return [];
    }

    const selectedMatch = [...aggregate.sampleMatches].sort((left, right) => {
      const leftPressure =
        left.deadlockConcedeCount +
        left.fallbackCounts.concede +
        left.fallbackCounts.passTurn +
        left.diagnosticCounts.total;
      const rightPressure =
        right.deadlockConcedeCount +
        right.fallbackCounts.concede +
        right.fallbackCounts.passTurn +
        right.diagnosticCounts.total;

      return rightPressure - leftPressure || left.matchId.localeCompare(right.matchId);
    })[0];

    if (!selectedMatch) {
      return [];
    }

    return [
      {
        artifactPaths: selectedMatch.artifactPaths,
        classification: record.classification,
        deckId: record.deckId,
        matchId: selectedMatch.matchId,
        opponentDeckId: record.opponentDeckId,
        opponentStrategyId: record.opponentStrategyId,
        reason: buildRecommendationReason(record),
        strategyId: record.strategyId,
      },
    ];
  });

  const candidateManifests =
    summary.candidateManifests.length > 0
      ? [...summary.candidateManifests]
      : getStrategyCandidateManifests(summary.strategyIds);
  const scorecards = buildStrategyCandidateScorecards({
    baselineStrategyId: summary.baselineStrategyId,
    candidateManifests,
    participantRecords,
    summary,
  });
  const triage = buildStrategyTriageSummary({
    inspectNext,
    summary,
  });

  const totalChallengeOverQuestCount = summary.matches.reduce(
    (total, match) => total + match.challengeOverQuestCount,
    0,
  );
  const allQuestionableDecisions = summary.matches
    .flatMap((match) => match.questionableDecisions ?? [])
    .sort((a, b) => {
      const severityDiff =
        QUESTIONABLE_CATEGORY_SEVERITY[b.category] - QUESTIONABLE_CATEGORY_SEVERITY[a.category];
      if (severityDiff !== 0) return severityDiff;
      return a.moveNumber - b.moveNumber;
    })
    .slice(0, 5);

  return {
    artifactRoot: summary.artifactRoot,
    baselineStrategyId: summary.baselineStrategyId,
    candidateManifests,
    challengeOverQuestCount: totalChallengeOverQuestCount,
    crossDeck: {
      deckRecords: crossDeckDeckRecords,
      orderedPairRecords: crossDeckOrderedPairRecords,
      strategyRecords: crossDeckStrategyRecords,
    },
    deckIds: summary.deckIds,
    gameCount: summary.gameCount,
    gameCounts: summary.gameCounts,
    generatedAt: summary.generatedAt,
    inspectNext,
    matchClassifications,
    mirror: {
      deckRecords: mirrorDeckRecords,
      strategyPairRecords: mirrorStrategyPairRecords,
    },
    mode: summary.mode,
    overall: {
      averageActions: roundAverage(overall.totalActions, overall.games),
      averageTurns: roundAverage(overall.totalTurns, overall.games),
      deadlockConcedeCount: overall.deadlockConcedeCount,
      deadlockGames: overall.deadlockGames,
      diagnosticCounts: overall.diagnosticCounts,
      fallbackCounts: overall.fallbackCounts,
      games: overall.games,
      noWinnerGames: overall.noWinnerGames,
      terminatedGames: overall.terminatedGames,
      winnerCounts: overall.winnerCounts,
    },
    preset: summary.preset,
    scorecards,
    questionableDecisions: allQuestionableDecisions,
    strategyIds: summary.strategyIds,
    strategyRecords,
    triage,
    worstMatchups,
    diagnostics,
  };
}

// ---------------------------------------------------------------------------
// Card strategy coverage report
// ---------------------------------------------------------------------------

type CardStrategyCoverageEntry = {
  definitionId: string;
  fixtureCount: number;
  totalCopies: number;
};

export function buildCardStrategyCoverageReport(): CardStrategyCoverageEntry[] {
  const coveredIds = new Set<string>(BEST_AI_CARD_PROFILES.map((profile) => profile.definitionId));

  const uncoveredCounts = new Map<string, { fixtureCount: number; totalCopies: number }>();

  for (const dossier of BEST_AI_DECK_DOSSIERS) {
    const entries = dossier.signature.split("|");
    for (const entry of entries) {
      const [defId, countStr] = entry.split(":");
      if (coveredIds.has(defId)) continue;

      const count = Number(countStr);
      const existing = uncoveredCounts.get(defId);
      if (existing) {
        existing.fixtureCount += 1;
        existing.totalCopies += count;
      } else {
        uncoveredCounts.set(defId, { fixtureCount: 1, totalCopies: count });
      }
    }
  }

  return [...uncoveredCounts.entries()]
    .map(([definitionId, { fixtureCount, totalCopies }]) => ({
      definitionId,
      fixtureCount,
      totalCopies,
    }))
    .sort((a, b) => b.totalCopies - a.totalCopies);
}

export function buildCardStrategyCoverageMarkdown(report: CardStrategyCoverageEntry[]): string {
  const lines: string[] = [
    "# Card Strategy Coverage Report",
    "",
    `Uncovered cards: **${report.length}**`,
    "",
    "| Definition ID | Fixtures | Copies |",
    "| --- | ---: | ---: |",
  ];

  for (const entry of report) {
    lines.push(`| ${entry.definitionId} | ${entry.fixtureCount} | ${entry.totalCopies} |`);
  }

  lines.push("");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Smoke-level summary line
// ---------------------------------------------------------------------------

export function buildCuratedSuiteSummaryLine(summary: StrategySuiteRunSummary): string {
  const matchCount = summary.matches.length;

  const winsByStrategy = new Map<string, number>();
  for (const match of summary.matches) {
    if (match.winner === undefined) continue;
    const winnerStrategyId =
      match.winner === "player_one" ? match.playerOneStrategyId : match.playerTwoStrategyId;
    winsByStrategy.set(winnerStrategyId, (winsByStrategy.get(winnerStrategyId) ?? 0) + 1);
  }

  const winsSegment = [...winsByStrategy.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([strategyId, wins]) => `${strategyId} ${wins}`)
    .join(", ");

  let signalDiag = 0;
  let fallbacks = 0;
  for (const match of summary.matches) {
    signalDiag += match.diagnosticCounts.unsupported + match.diagnosticCounts.validation;
    fallbacks += match.fallbackCounts.concede + match.fallbackCounts.passTurn;
  }

  return `Smoke: ${matchCount} matches | wins: ${winsSegment} | signal diag: ${signalDiag} | fallbacks: ${fallbacks}`;
}

type StrategyRunArtifactResult = {
  digest: StrategyTriageDigest;
  report: StrategyLabReport;
};

function writeStrategyRunArtifacts(
  summary: StrategySuiteRunSummary,
  previousSummary?: StrategySuiteRunSummary,
): StrategyRunArtifactResult {
  writeFileSync(
    join(summary.artifactRoot, "run-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  );
  if (previousSummary) {
    writeFileSync(
      join(summary.artifactRoot, "previous-run-summary.json"),
      `${JSON.stringify(previousSummary, null, 2)}\n`,
      "utf8",
    );
  }

  const report = buildStrategyLabReport(summary);
  writeFileSync(
    join(summary.artifactRoot, "benchmark-summary.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    join(summary.artifactRoot, "benchmark-summary.md"),
    buildBenchmarkSummaryMarkdown(report),
    "utf8",
  );

  const digest = buildTriageDigest(report);
  writeFileSync(
    join(summary.artifactRoot, "triage-digest.md"),
    buildTriageDigestMarkdown(digest),
    "utf8",
  );

  const matchupWeightStrategies = summary.strategyIds.reduce<
    Array<{ informationPolicy: StrategyInformationPolicy; strategyId: string }>
  >((entries, strategyId) => {
    if (strategyId === BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID) {
      entries.push({
        informationPolicy: "fair",
        strategyId,
      });
    } else if (strategyId === BEST_DECK_AWARE_ORACLE_LORE_RACE_STRATEGY_ID) {
      entries.push({
        informationPolicy: "oracle",
        strategyId,
      });
    }

    return entries;
  }, []);
  const matchupWeightReport = buildBestAiMatchupWeightReport({
    strategies: matchupWeightStrategies,
  });
  writeFileSync(
    join(summary.artifactRoot, "matchup-weight-report.json"),
    `${JSON.stringify(matchupWeightReport, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    join(summary.artifactRoot, "matchup-weight-report.md"),
    buildBestAiMatchupWeightReportMarkdown(matchupWeightReport),
    "utf8",
  );

  const coverageReport = buildCardStrategyCoverageReport();
  const coverageMarkdown = buildCardStrategyCoverageMarkdown(coverageReport);
  writeFileSync(join(summary.artifactRoot, "card-coverage-report.md"), coverageMarkdown);

  return { digest, report };
}

export type StrategySuiteRunResult = {
  digest: StrategyTriageDigest;
  report: StrategyLabReport;
  summary: StrategySuiteRunSummary;
};

export function runStrategyLab(options: StrategyLabOptions = {}): StrategySuiteRunResult {
  const resolvedOptions = resolveStrategyLabPresetOptions(options);
  const artifactBaseRoot = resolvedOptions.artifactRoot ?? STRATEGY_ARTIFACT_ROOT;
  const matchMode = resolvedOptions.matchMode ?? "both";
  const artifactRoot = resolvedOptions.preset
    ? join(
        artifactBaseRoot,
        ...resolveStrategyBenchmarkPresetConfig(resolvedOptions.preset).artifactSegment,
      )
    : join(artifactBaseRoot, matchMode);
  const previousSummary = loadRunSummaryFromDisk(artifactRoot);
  ensureArtifactRoot(artifactRoot);

  const matches = buildStrategyLabMatchDefinitions(resolvedOptions).map((match) =>
    runStrategyMatch(match, {
      artifactRoot,
      turnLimit: 60,
    }),
  );
  const gameCounts = resolveStrategyLabGameCounts(resolvedOptions);
  const candidateManifests =
    resolvedOptions.candidateManifests && resolvedOptions.candidateManifests.length > 0
      ? [...resolvedOptions.candidateManifests]
      : getStrategyCandidateManifests(resolveRunStrategyIds(matches, resolvedOptions.strategyIds));
  const summary: StrategySuiteRunSummary = {
    artifactRoot,
    baselineStrategyId: resolvedOptions.baselineStrategyId ?? PROMOTED_STRATEGY_BASELINE_ID,
    candidateManifests,
    deckIds: resolveRunDeckIds(matches, resolvedOptions.deckIds),
    gameCount: Math.max(
      1,
      resolvedOptions.gameCount ?? Math.max(gameCounts.mirror, gameCounts.crossDeck, 1),
    ),
    gameCounts,
    generatedAt: new Date().toISOString(),
    matches,
    mode: matchMode,
    preset: resolvedOptions.preset,
    strategyIds: resolveRunStrategyIds(matches, resolvedOptions.strategyIds),
  };
  const { digest, report } = writeStrategyRunArtifacts(summary, previousSummary);

  return { digest, report, summary };
}

export function runCuratedStrategySuite(): StrategySuiteRunResult {
  const previousSummary = loadRunSummaryFromDisk(STRATEGY_ARTIFACT_ROOT);
  ensureArtifactRoot(STRATEGY_ARTIFACT_ROOT);

  const matches = buildMatchDefinitions().map((match) => runStrategyMatch(match));
  const summary: StrategySuiteRunSummary = {
    artifactRoot: STRATEGY_ARTIFACT_ROOT,
    baselineStrategyId: PROMOTED_STRATEGY_BASELINE_ID,
    candidateManifests: [],
    deckIds: resolveRunDeckIds(matches),
    gameCount: 1,
    gameCounts: {
      crossDeck: 1,
      mirror: 0,
    },
    generatedAt: new Date().toISOString(),
    matches,
    mode: "curated",
    strategyIds: resolveRunStrategyIds(matches),
  };
  const { digest, report } = writeStrategyRunArtifacts(summary, previousSummary);

  return { digest, report, summary };
}

function loadRunSummaryFromDisk(artifactRoot: string): StrategySuiteRunSummary | undefined {
  const path = join(artifactRoot, "run-summary.json");
  if (!existsSync(path)) {
    return undefined;
  }

  try {
    return JSON.parse(readFileSync(path, "utf-8")) as StrategySuiteRunSummary;
  } catch {
    return undefined;
  }
}

export function loadPreviousRunSummary(artifactRoot: string): StrategySuiteRunSummary | undefined {
  const previousPath = join(artifactRoot, "previous-run-summary.json");
  if (!existsSync(previousPath)) {
    return undefined;
  }

  return JSON.parse(readFileSync(previousPath, "utf-8")) as StrategySuiteRunSummary;
}

export function runQuickReplayCheck(): StrategySuiteRunResult {
  const artifactRoot = join(STRATEGY_ARTIFACT_ROOT, "..", "quick-replay");
  const previousSummary = loadRunSummaryFromDisk(artifactRoot);
  ensureArtifactRoot(artifactRoot);

  const gamesPerDeck = 5;
  const matches: StrategyMatchSummary[] = [];

  for (const deckId of CORE_STRATEGY_BENCHMARK_DECK_IDS) {
    const fixture = DECK_FIXTURES.find((f) => f.id === deckId);
    if (!fixture) {
      throw new Error(`Deck fixture not found for ID: ${deckId}`);
    }

    for (let index = 0; index < gamesPerDeck; index += 1) {
      matches.push(
        simulateAutomatedDeckMatch({
          artifactRoot,
          matchId: `quick-replay-${deckId}-${index}`,
          playerOne: {
            fixture,
            id: deckId,
          },
          playerTwo: {
            fixture,
            id: deckId,
          },
          seed: `quick-replay:${deckId}:${index}`,
          turnLimit: 60,
        }),
      );
    }
  }

  const summary: StrategySuiteRunSummary = {
    artifactRoot,
    baselineStrategyId: PROMOTED_STRATEGY_BASELINE_ID,
    candidateManifests: [],
    deckIds: resolveRunDeckIds(matches),
    gameCount: gamesPerDeck,
    gameCounts: {
      crossDeck: 0,
      mirror: gamesPerDeck,
    },
    generatedAt: new Date().toISOString(),
    matches,
    mode: "mirror",
    strategyIds: resolveRunStrategyIds(matches),
  };
  const { digest, report } = writeStrategyRunArtifacts(summary, previousSummary);

  return { digest, report, summary };
}

export function replayStrategyMatch(args: {
  playerOneDeckId: string;
  playerTwoDeckId: string;
  playerOneStrategyId: string;
  playerTwoStrategyId: string;
  seed: string;
  artifactRoot?: string;
}): StrategyMatchSummary {
  const playerOneFixture = DECK_FIXTURES.find((f) => f.id === args.playerOneDeckId);
  if (!playerOneFixture) {
    throw new Error(`Deck fixture not found for player one deck ID: ${args.playerOneDeckId}`);
  }

  const playerTwoFixture = DECK_FIXTURES.find((f) => f.id === args.playerTwoDeckId);
  if (!playerTwoFixture) {
    throw new Error(`Deck fixture not found for player two deck ID: ${args.playerTwoDeckId}`);
  }

  const playerOneOption = getSafeAutomatedActionStrategyOption(args.playerOneStrategyId);
  const playerTwoOption = getSafeAutomatedActionStrategyOption(args.playerTwoStrategyId);

  const replayArtifactRoot = args.artifactRoot ?? join(STRATEGY_ARTIFACT_ROOT, "..", "replay");
  ensureArtifactRoot(replayArtifactRoot);

  return simulateAutomatedDeckMatch({
    artifactRoot: replayArtifactRoot,
    playerOne: {
      fixture: playerOneFixture,
      id: args.playerOneDeckId,
      strategy: playerOneOption.strategy,
      strategyId: playerOneOption.id,
    },
    playerTwo: {
      fixture: playerTwoFixture,
      id: args.playerTwoDeckId,
      strategy: playerTwoOption.strategy,
      strategyId: playerTwoOption.id,
    },
    seed: args.seed,
    turnLimit: 60,
  });
}

export function replayMatchFromRunSummary(
  summary: StrategySuiteRunSummary,
  matchIndex: number,
  artifactRoot?: string,
): StrategyMatchSummary {
  if (matchIndex < 0 || matchIndex >= summary.matches.length) {
    throw new Error(
      `Match index ${matchIndex} is out of bounds (0..${summary.matches.length - 1})`,
    );
  }

  const match = summary.matches[matchIndex]!;

  return replayStrategyMatch({
    playerOneDeckId: match.playerOneDeckId,
    playerTwoDeckId: match.playerTwoDeckId,
    playerOneStrategyId: match.playerOneStrategyId,
    playerTwoStrategyId: match.playerTwoStrategyId,
    seed: match.seed,
    artifactRoot,
  });
}

export function strategyArtifactsExist(summary: StrategySuiteRunSummary): boolean {
  return summary.matches.every(
    (match) =>
      existsSync(match.artifactPaths.strategyDecisions) &&
      existsSync(match.artifactPaths.gameRuntime),
  );
}

// ---------------------------------------------------------------------------
// Triage digest
// ---------------------------------------------------------------------------

type StrategyTriageTrack = "A" | "B" | "C" | "D";

export type StrategyTriageDigest = {
  deadlockGames: number;
  inspectNext: Array<{ matchId: string; path: string; reason: string }>;
  questionableDecisionCount: number;
  signalDiagnosticCount: number;
  topTriageCategory: { count: number; label: string } | undefined;
  topWeakness:
    | {
        evidence: string;
        inspectPath?: string;
        label: string;
        track: StrategyTriageTrack;
      }
    | undefined;
  worstMatchup: { label: string; winRate: number } | undefined;
};

const TRIAGE_CATEGORY_TRACK: Record<StrategyLabTriageCategory, StrategyTriageTrack> = {
  "bad-ability-timing": "B",
  "bad-play-before-quest": "B",
  "fallback-churn": "A",
  "missed-challenge": "B",
  "over-inking": "C",
};

export function buildTriageDigest(report: StrategyLabReport): StrategyTriageDigest {
  const signalDiagnosticCount =
    report.overall.diagnosticCounts.unsupported + report.overall.diagnosticCounts.validation;

  const worstMatchup =
    report.worstMatchups.length > 0
      ? { label: report.worstMatchups[0]!.label, winRate: report.worstMatchups[0]!.winRate }
      : undefined;

  const topTriageCategory =
    report.triage.categories.length > 0
      ? { count: report.triage.categories[0]!.count, label: report.triage.categories[0]!.label }
      : undefined;

  const inspectNext = report.inspectNext.slice(0, 3).map((rec) => ({
    matchId: rec.matchId,
    path: rec.artifactPaths.strategyDecisions,
    reason: rec.reason,
  }));

  const topWeakness = resolveTopWeakness({
    deadlockGames: report.overall.deadlockGames,
    inspectNext,
    signalDiagnosticCount,
    topTriageCategory,
    worstMatchup,
  });

  return {
    deadlockGames: report.overall.deadlockGames,
    inspectNext,
    questionableDecisionCount: report.questionableDecisions.length,
    signalDiagnosticCount,
    topTriageCategory,
    topWeakness,
    worstMatchup,
  };
}

function resolveTopWeakness(args: {
  deadlockGames: number;
  inspectNext: StrategyTriageDigest["inspectNext"];
  signalDiagnosticCount: number;
  topTriageCategory: StrategyTriageDigest["topTriageCategory"];
  worstMatchup: StrategyTriageDigest["worstMatchup"];
}): StrategyTriageDigest["topWeakness"] {
  const firstInspectPath = args.inspectNext[0]?.path;

  if (args.deadlockGames > 0) {
    return {
      evidence: `${args.deadlockGames} game(s) ended in deadlock`,
      inspectPath: firstInspectPath,
      label: "Deadlock games detected",
      track: "A",
    };
  }

  if (args.signalDiagnosticCount > 0) {
    return {
      evidence: `${args.signalDiagnosticCount} signal diagnostic(s) (unsupported-shape or validation-reject)`,
      inspectPath: firstInspectPath,
      label: "Signal diagnostics present",
      track: "A",
    };
  }

  if (args.worstMatchup && args.worstMatchup.winRate < 0.3) {
    return {
      evidence: `${args.worstMatchup.label} has ${(args.worstMatchup.winRate * 100).toFixed(0)}% win rate`,
      inspectPath: firstInspectPath,
      label: "Low win-rate matchup",
      track: "B",
    };
  }

  if (args.topTriageCategory && args.topTriageCategory.count > 0) {
    const category = args.topTriageCategory.label.toLowerCase().replace(/\s+/g, "-") as string;
    const track =
      TRIAGE_CATEGORY_TRACK[category as StrategyLabTriageCategory] ?? ("B" as StrategyTriageTrack);

    return {
      evidence: `${args.topTriageCategory.count} instance(s) of ${args.topTriageCategory.label}`,
      inspectPath: firstInspectPath,
      label: args.topTriageCategory.label,
      track,
    };
  }

  return undefined;
}

export function buildTriageDigestMarkdown(digest: StrategyTriageDigest): string {
  const lines = [
    "# Triage Digest",
    "",
    "## Top Weakness",
    digest.topWeakness
      ? [
          `- **Track ${digest.topWeakness.track}**: ${digest.topWeakness.label}`,
          `- Evidence: ${digest.topWeakness.evidence}`,
          digest.topWeakness.inspectPath ? `- Inspect: ${digest.topWeakness.inspectPath}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      : "- No actionable weakness detected",
    "",
    "## Summary",
    `- Deadlock games: ${digest.deadlockGames}`,
    `- Signal diagnostics: ${digest.signalDiagnosticCount}`,
    `- Questionable decisions: ${digest.questionableDecisionCount}`,
    `- Worst matchup: ${digest.worstMatchup ? `${digest.worstMatchup.label} (${(digest.worstMatchup.winRate * 100).toFixed(0)}%)` : "none"}`,
    `- Top triage: ${digest.topTriageCategory ? `${digest.topTriageCategory.label} (${digest.topTriageCategory.count})` : "none"}`,
    "",
    "## Inspect Next",
    ...(digest.inspectNext.length > 0
      ? digest.inspectNext.map((rec) => `- ${rec.matchId}: ${rec.reason}\n  ${rec.path}`)
      : ["- No recommendations"]),
    "",
  ];

  return lines.join("\n");
}

export function buildTriageDigestConsoleOutput(digest: StrategyTriageDigest): string {
  const lines: string[] = [];

  if (digest.topWeakness) {
    lines.push(
      `Triage: Track ${digest.topWeakness.track} — ${digest.topWeakness.label}`,
      `  ${digest.topWeakness.evidence}`,
    );
    if (digest.topWeakness.inspectPath) {
      lines.push(`  Inspect: ${digest.topWeakness.inspectPath}`);
    }
  } else {
    lines.push("Triage: No actionable weakness detected");
  }

  const stats = [
    `deadlocks=${digest.deadlockGames}`,
    `signal-diag=${digest.signalDiagnosticCount}`,
    `questionable=${digest.questionableDecisionCount}`,
  ];
  if (digest.worstMatchup) {
    stats.push(`worst-matchup=${(digest.worstMatchup.winRate * 100).toFixed(0)}%`);
  }
  lines.push(`  ${stats.join(" | ")}`);

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Run comparison
// ---------------------------------------------------------------------------

export type StrategyRunComparison = {
  after: { artifactRoot: string; games: number };
  before: { artifactRoot: string; games: number };
  delta: {
    concedeFallbacks: number;
    deadlockGames: number;
    questionableDecisions: number;
    signalDiagnostics: number;
    worstMatchupWinRate: number | undefined;
  };
  improved: string[];
  regressed: string[];
};

export function compareStrategyRuns(
  before: StrategySuiteRunSummary,
  after: StrategySuiteRunSummary,
): StrategyRunComparison {
  const beforeReport = buildStrategyLabReport(before);
  const afterReport = buildStrategyLabReport(after);

  const beforeSignalDiag =
    beforeReport.overall.diagnosticCounts.unsupported +
    beforeReport.overall.diagnosticCounts.validation;
  const afterSignalDiag =
    afterReport.overall.diagnosticCounts.unsupported +
    afterReport.overall.diagnosticCounts.validation;

  const beforeWorstWinRate =
    beforeReport.worstMatchups.length > 0 ? beforeReport.worstMatchups[0]!.winRate : undefined;
  const afterWorstWinRate =
    afterReport.worstMatchups.length > 0 ? afterReport.worstMatchups[0]!.winRate : undefined;

  const delta = {
    concedeFallbacks:
      afterReport.overall.fallbackCounts.concede - beforeReport.overall.fallbackCounts.concede,
    deadlockGames: afterReport.overall.deadlockGames - beforeReport.overall.deadlockGames,
    questionableDecisions:
      afterReport.questionableDecisions.length - beforeReport.questionableDecisions.length,
    signalDiagnostics: afterSignalDiag - beforeSignalDiag,
    worstMatchupWinRate:
      afterWorstWinRate !== undefined && beforeWorstWinRate !== undefined
        ? afterWorstWinRate - beforeWorstWinRate
        : undefined,
  };

  const improved: string[] = [];
  const regressed: string[] = [];

  if (delta.deadlockGames < 0) improved.push(`Deadlocks: ${delta.deadlockGames}`);
  if (delta.deadlockGames > 0) regressed.push(`Deadlocks: +${delta.deadlockGames}`);

  if (delta.signalDiagnostics < 0) improved.push(`Signal diagnostics: ${delta.signalDiagnostics}`);
  if (delta.signalDiagnostics > 0)
    regressed.push(`Signal diagnostics: +${delta.signalDiagnostics}`);

  if (delta.concedeFallbacks < 0) improved.push(`Concede fallbacks: ${delta.concedeFallbacks}`);
  if (delta.concedeFallbacks > 0) regressed.push(`Concede fallbacks: +${delta.concedeFallbacks}`);

  if (delta.questionableDecisions < 0)
    improved.push(`Questionable decisions: ${delta.questionableDecisions}`);
  if (delta.questionableDecisions > 0)
    regressed.push(`Questionable decisions: +${delta.questionableDecisions}`);

  if (delta.worstMatchupWinRate !== undefined) {
    if (delta.worstMatchupWinRate > 0.01)
      improved.push(`Worst matchup win rate: +${(delta.worstMatchupWinRate * 100).toFixed(1)}%`);
    if (delta.worstMatchupWinRate < -0.01)
      regressed.push(`Worst matchup win rate: ${(delta.worstMatchupWinRate * 100).toFixed(1)}%`);
  }

  return {
    after: { artifactRoot: after.artifactRoot, games: after.matches.length },
    before: { artifactRoot: before.artifactRoot, games: before.matches.length },
    delta,
    improved,
    regressed,
  };
}

export function buildRunComparisonMarkdown(comparison: StrategyRunComparison): string {
  const lines = [
    "# Strategy Run Comparison",
    "",
    `- Before: ${comparison.before.artifactRoot} (${comparison.before.games} games)`,
    `- After: ${comparison.after.artifactRoot} (${comparison.after.games} games)`,
    "",
    "## Delta",
    `| Metric | Change |`,
    `| --- | --- |`,
    `| Deadlock games | ${formatDelta(comparison.delta.deadlockGames)} |`,
    `| Signal diagnostics | ${formatDelta(comparison.delta.signalDiagnostics)} |`,
    `| Concede fallbacks | ${formatDelta(comparison.delta.concedeFallbacks)} |`,
    `| Questionable decisions | ${formatDelta(comparison.delta.questionableDecisions)} |`,
    `| Worst matchup win rate | ${comparison.delta.worstMatchupWinRate !== undefined ? formatDelta(Number((comparison.delta.worstMatchupWinRate * 100).toFixed(1)), "%", true) : "n/a"} |`,
    "",
    "## Improved",
    ...(comparison.improved.length > 0
      ? comparison.improved.map((line) => `- ${line}`)
      : ["- No improvements detected"]),
    "",
    "## Regressed",
    ...(comparison.regressed.length > 0
      ? comparison.regressed.map((line) => `- ${line}`)
      : ["- No regressions detected"]),
    "",
  ];

  return lines.join("\n");
}

function formatDelta(value: number, suffix = "", higherIsBetter = false): string {
  if (value === 0) return `0${suffix}`;
  const sign = value > 0 ? "+" : "";
  const indicator = higherIsBetter
    ? value > 0
      ? " (better)"
      : " (worse)"
    : value < 0
      ? " (better)"
      : " (worse)";
  return `${sign}${value}${suffix}${indicator}`;
}

export function buildRunComparisonConsoleOutput(comparison: StrategyRunComparison): string {
  const lines: string[] = [
    `Comparison: ${comparison.before.games} games (before) vs ${comparison.after.games} games (after)`,
  ];

  if (comparison.improved.length > 0) {
    lines.push(`  Improved: ${comparison.improved.join(", ")}`);
  }
  if (comparison.regressed.length > 0) {
    lines.push(`  Regressed: ${comparison.regressed.join(", ")}`);
  }
  if (comparison.improved.length === 0 && comparison.regressed.length === 0) {
    lines.push("  No significant changes detected");
  }

  return lines.join("\n");
}
