import { z } from "zod";

import { BOT_CORE_SCHEMA_VERSION } from "./types.js";

export const botInformationPolicySchema = z.enum(["public", "oracle"]);

export const botStrategyDescriptorV1Schema = z.object({
  schemaVersion: z.literal(BOT_CORE_SCHEMA_VERSION),
  game: z.string().min(1),
  id: z.string().min(1),
  label: z.string().min(1),
  strategyVersion: z.string().min(1),
  informationPolicy: botInformationPolicySchema,
  cardProfileVersion: z.string().min(1),
  productionEligible: z.boolean(),
  aliases: z.array(z.string().min(1)).optional(),
});

export const botCandidateManifestV1Schema = z.object({
  schemaVersion: z.literal(BOT_CORE_SCHEMA_VERSION),
  game: z.string().min(1),
  candidateId: z.string().min(1),
  parentStrategyId: z.string().min(1),
  informationPolicy: botInformationPolicySchema,
  hypothesis: z.string().min(1),
  engineRevision: z.string().min(1),
  cardCatalogHash: z.string().min(1),
  adapterVersion: z.string().min(1),
  changes: z.record(z.string(), z.unknown()),
  training: z
    .object({
      generator: z.string().min(1),
      seed: z.string().min(1),
      iterations: z.number().int().nonnegative(),
      corpusId: z.string().min(1),
    })
    .optional(),
  evaluation: z.object({
    suiteId: z.string().min(1),
    seedBase: z.string().min(1),
    minimumBlocks: z.number().int().positive(),
    maximumBlocks: z.number().int().positive(),
    batchSize: z.number().int().positive(),
    confidenceLevel: z.number().gt(0).lt(1),
    minimumMeanImprovement: z.number().nonnegative(),
    maximumCellRegression: z.number().nonnegative(),
  }),
});

export const botCardHeuristicProfileV1Schema = z.object({
  schemaVersion: z.literal(BOT_CORE_SCHEMA_VERSION),
  cardId: z.string().min(1),
  profileVersion: z.string().min(1),
  source: z.enum(["derived", "manual", "trained"]),
  axes: z.record(z.string(), z.number().min(-100).max(100)),
  tags: z.array(z.string()),
  matchups: z
    .array(
      z.object({
        opponentTags: z.array(z.string()),
        adjustments: z.record(z.string(), z.number().min(-100).max(100)),
        rationale: z.string().min(1),
      }),
    )
    .optional(),
  rationale: z.array(z.string()),
});

export const botTerminationReasonSchema = z.enum([
  "rules-win",
  "deck-out",
  "player-concession",
  "automation-concession",
  "repeated-state",
  "unsupported-prompt",
  "illegal-command",
  "max-actions",
  "replay-mismatch",
  "infrastructure-error",
]);

const botConfidenceIntervalV1Schema = z.object({
  level: z.number().gt(0).lt(1),
  lower: z.number(),
  upper: z.number(),
});

const botFamilyStatsV1Schema = z.object({
  attempted: z.number().int().nonnegative(),
  succeeded: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  errorCodes: z.record(z.string(), z.number().int().nonnegative()),
});

export const botMatchRecordV1Schema = z.object({
  blockId: z.string().min(1),
  legId: z.string().min(1),
  seed: z.string().min(1),
  candidateSeat: z.enum(["p1", "p2"]),
  candidateDeckId: z.string().min(1),
  baselineDeckId: z.string().min(1),
  winner: z.enum(["candidate", "baseline"]).nullable(),
  termination: botTerminationReasonSchema,
  turnCount: z.number().int().nonnegative(),
  actionCount: z.number().int().nonnegative(),
  finalStateHash: z.string().min(1),
  candidateFamilyStats: z.record(z.string(), botFamilyStatsV1Schema).optional(),
  baselineFamilyStats: z.record(z.string(), botFamilyStatsV1Schema).optional(),
  diagnostics: z.record(z.string(), z.number()).optional(),
});

export const botEvaluationReportV1Schema = z.object({
  schemaVersion: z.literal(BOT_CORE_SCHEMA_VERSION),
  manifest: botCandidateManifestV1Schema,
  manifestHash: z.string().min(1),
  scheduleHash: z.string().min(1),
  candidate: botStrategyDescriptorV1Schema,
  baseline: botStrategyDescriptorV1Schema,
  engineRevision: z.string().min(1),
  cardCatalogHash: z.string().min(1),
  matches: z.array(botMatchRecordV1Schema),
  summary: z.object({
    blocks: z.number().int().nonnegative(),
    matches: z.number().int().nonnegative(),
    meanPairedImprovement: z.number(),
    confidenceInterval: botConfidenceIntervalV1Schema,
    terminationCounts: z.record(botTerminationReasonSchema, z.number().int().nonnegative()),
    hardFailureCount: z.number().int().nonnegative(),
    cellRegressions: z.record(z.string(), z.number()),
  }),
  verdict: z.enum(["promote", "reject", "inconclusive"]),
  verdictReasons: z.array(z.string()),
});

export const botPromotionRecordV1Schema = z.object({
  schemaVersion: z.literal(BOT_CORE_SCHEMA_VERSION),
  game: z.string().min(1),
  promotedStrategyId: z.string().min(1),
  previousStrategyId: z.string().min(1),
  informationPolicy: botInformationPolicySchema,
  manifestHash: z.string().min(1),
  scheduleHash: z.string().min(1),
  engineRevision: z.string().min(1),
  cardCatalogHash: z.string().min(1),
  strategyConfig: z.record(z.string(), z.unknown()),
  blocks: z.number().int().positive(),
  matches: z.number().int().positive(),
  meanPairedImprovement: z.number(),
  confidenceInterval: botConfidenceIntervalV1Schema,
});
