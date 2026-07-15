export const BOT_CORE_SCHEMA_VERSION = 1 as const;
export const BOT_PRODUCTION_MINIMUM_BLOCKS = 200 as const;

export type BotInformationPolicy = "public" | "oracle";

export type BotTerminationReason =
  | "rules-win"
  | "deck-out"
  | "player-concession"
  | "automation-concession"
  | "repeated-state"
  | "unsupported-prompt"
  | "illegal-command"
  | "max-actions"
  | "replay-mismatch"
  | "infrastructure-error";

export const BOT_HARD_FAILURE_REASONS = [
  "automation-concession",
  "repeated-state",
  "unsupported-prompt",
  "illegal-command",
  "max-actions",
  "replay-mismatch",
  "infrastructure-error",
] as const satisfies readonly BotTerminationReason[];

export interface BotStrategyDescriptorV1 {
  readonly schemaVersion: typeof BOT_CORE_SCHEMA_VERSION;
  readonly game: string;
  readonly id: string;
  readonly label: string;
  readonly strategyVersion: string;
  readonly informationPolicy: BotInformationPolicy;
  readonly cardProfileVersion: string;
  readonly productionEligible: boolean;
  readonly aliases?: readonly string[];
}

export interface BotTrainingSpecV1 {
  readonly generator: string;
  readonly seed: string;
  readonly iterations: number;
  readonly corpusId: string;
}

export interface BotEvaluationSpecV1 {
  readonly suiteId: string;
  readonly seedBase: string;
  readonly minimumBlocks: number;
  readonly maximumBlocks: number;
  readonly batchSize: number;
  readonly confidenceLevel: number;
  readonly minimumMeanImprovement: number;
  readonly maximumCellRegression: number;
}

export interface BotCandidateManifestV1 {
  readonly schemaVersion: typeof BOT_CORE_SCHEMA_VERSION;
  readonly game: string;
  readonly candidateId: string;
  readonly parentStrategyId: string;
  readonly informationPolicy: BotInformationPolicy;
  readonly hypothesis: string;
  readonly engineRevision: string;
  readonly cardCatalogHash: string;
  readonly adapterVersion: string;
  readonly changes: Readonly<Record<string, unknown>>;
  readonly training?: BotTrainingSpecV1;
  readonly evaluation: BotEvaluationSpecV1;
}

export interface BotFamilyStatsV1 {
  readonly attempted: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly errorCodes: Readonly<Record<string, number>>;
}

export interface BotMatchRecordV1 {
  readonly blockId: string;
  readonly legId: string;
  readonly seed: string;
  readonly candidateSeat: "p1" | "p2";
  readonly candidateDeckId: string;
  readonly baselineDeckId: string;
  readonly winner: "candidate" | "baseline" | null;
  readonly termination: BotTerminationReason;
  readonly turnCount: number;
  readonly actionCount: number;
  readonly finalStateHash: string;
  readonly candidateFamilyStats?: Readonly<Record<string, BotFamilyStatsV1>>;
  readonly baselineFamilyStats?: Readonly<Record<string, BotFamilyStatsV1>>;
  readonly diagnostics?: Readonly<Record<string, number>>;
}

export interface BotConfidenceIntervalV1 {
  readonly level: number;
  readonly lower: number;
  readonly upper: number;
}

export interface BotEvaluationSummaryV1 {
  readonly blocks: number;
  readonly matches: number;
  readonly meanPairedImprovement: number;
  readonly confidenceInterval: BotConfidenceIntervalV1;
  readonly terminationCounts: Readonly<Record<BotTerminationReason, number>>;
  readonly hardFailureCount: number;
  readonly cellRegressions: Readonly<Record<string, number>>;
}

export type BotPromotionVerdict = "promote" | "reject" | "inconclusive";

export interface BotEvaluationReportV1 {
  readonly schemaVersion: typeof BOT_CORE_SCHEMA_VERSION;
  readonly manifest: BotCandidateManifestV1;
  readonly manifestHash: string;
  readonly scheduleHash: string;
  readonly candidate: BotStrategyDescriptorV1;
  readonly baseline: BotStrategyDescriptorV1;
  readonly engineRevision: string;
  readonly cardCatalogHash: string;
  readonly matches: readonly BotMatchRecordV1[];
  readonly summary: BotEvaluationSummaryV1;
  readonly verdict: BotPromotionVerdict;
  readonly verdictReasons: readonly string[];
}

export interface BotPromotionRecordV1 {
  readonly schemaVersion: typeof BOT_CORE_SCHEMA_VERSION;
  readonly game: string;
  readonly promotedStrategyId: string;
  readonly previousStrategyId: string;
  readonly informationPolicy: BotInformationPolicy;
  readonly manifestHash: string;
  readonly scheduleHash: string;
  readonly engineRevision: string;
  readonly cardCatalogHash: string;
  readonly strategyConfig: Readonly<Record<string, unknown>>;
  readonly blocks: number;
  readonly matches: number;
  readonly meanPairedImprovement: number;
  readonly confidenceInterval: BotConfidenceIntervalV1;
}

export type BotCardProfileSource = "derived" | "manual" | "trained";

export interface BotCardMatchupAdjustment<Axis extends string> {
  readonly opponentTags: readonly string[];
  readonly adjustments: Partial<Record<Axis, number>>;
  readonly rationale: string;
}

export interface BotCardHeuristicProfileV1<
  Axis extends string = string,
  Tag extends string = string,
> {
  readonly schemaVersion: typeof BOT_CORE_SCHEMA_VERSION;
  readonly cardId: string;
  readonly profileVersion: string;
  readonly source: BotCardProfileSource;
  readonly axes: Partial<Record<Axis, number>>;
  readonly tags: readonly Tag[];
  readonly matchups?: readonly BotCardMatchupAdjustment<Axis>[];
  readonly rationale: readonly string[];
}
