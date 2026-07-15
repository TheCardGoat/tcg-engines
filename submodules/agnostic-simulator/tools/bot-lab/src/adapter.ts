import type {
  BotCandidateManifestV1,
  BotDeckPair,
  BotEvaluationReportV1,
  BotMatchRecordV1,
  BotPromotionRecordV1,
  BotScheduledMatch,
  BotStrategyDescriptorV1,
} from "@tcg/bot-core";

export interface BotLabMatchInput {
  readonly scheduledMatch: BotScheduledMatch;
  readonly candidateManifest: BotCandidateManifestV1;
  readonly baselineStrategyId: string;
}

export interface BotLabPromotionWrite {
  readonly path: string;
  readonly content: string;
}

export interface BotLabDoctorResult {
  readonly ok: boolean;
  readonly checks: readonly {
    readonly name: string;
    readonly ok: boolean;
    readonly detail: string;
  }[];
}

export interface BotLabAdapter {
  readonly game: string;
  readonly adapterVersion: string;
  getEngineRevision(): string;
  getCardCatalogHash(): string;
  getCurrentDefaultStrategyId(): string;
  getStrategyDescriptor(strategyId: string): BotStrategyDescriptorV1 | undefined;
  getCandidateDescriptor(manifest: BotCandidateManifestV1): BotStrategyDescriptorV1;
  getPromotionDeckPairs(suiteId: string): readonly BotDeckPair[];
  runMatch(input: BotLabMatchInput): Promise<BotMatchRecordV1> | BotMatchRecordV1;
  replayMatch(
    record: BotMatchRecordV1,
    report: BotEvaluationReportV1,
  ): Promise<BotMatchRecordV1> | BotMatchRecordV1;
  planPromotion(record: BotPromotionRecordV1): readonly BotLabPromotionWrite[];
  doctor(): Promise<BotLabDoctorResult> | BotLabDoctorResult;
  train?(input: unknown): Promise<BotCandidateManifestV1> | BotCandidateManifestV1;
}
