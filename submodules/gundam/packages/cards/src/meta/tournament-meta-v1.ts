import { GUNDAM_EN_US_PRODUCT_RELEASES } from "../catalog-release.ts";
import {
  GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_THRESHOLDS_V1,
  GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_VERSION,
  projectGundamTournamentMetaDeckV1,
} from "./archetype-classifier.ts";

export const GUNDAM_TOURNAMENT_META_CONSTRUCTED_FORMAT_ID = "constructed-en-us";
export const GUNDAM_TOURNAMENT_META_WINDOWS_V1 = ["30d", "60d", "90d", "current-set"] as const;

/**
 * Candidate methodology derived from the competitor report, not an official
 * Bandai formula. Statistical review must approve thresholds before production
 * publication.
 */
export const GUNDAM_TOURNAMENT_META_METHODOLOGY_CANDIDATE_V1 = Object.freeze({
  version: "gundam.tournament-meta.candidate.v1",
  sampleFloor: 8,
  formula: {
    version: "gundam.tournament-meta.top4-top1.candidate.v1",
    topCutPlacementCeiling: 16,
    weights: {
      metaShare: 0,
      topCut: 0,
      top4: 0.6,
      top1: 0.4,
    },
    tierThresholds: [
      { tier: "S", minimumScore: 65 },
      { tier: "A", minimumScore: 50 },
      { tier: "B", minimumScore: 35 },
      { tier: "C", minimumScore: 20 },
      { tier: "D", minimumScore: 0 },
    ],
  },
  workedExample: {
    description:
      "A shell with a 50% Top 4 rate and a 20% first-place rate scores 38: (50 × 0.60) + (20 × 0.40), which maps to candidate Tier B.",
    inputs: {
      metaShare: 0,
      topCut: 0,
      top4: 50,
      top1: 20,
    },
    score: 38,
    tier: "B",
  },
} as const);

export const GUNDAM_TOURNAMENT_META_V1_CONFIG = Object.freeze({
  gameSlug: "gundam",
  formatId: GUNDAM_TOURNAMENT_META_CONSTRUCTED_FORMAT_ID,
  windows: GUNDAM_TOURNAMENT_META_WINDOWS_V1,
  currentSet: {
    setId: "GD05",
    label: "Freedom Ascension",
    startDate: GUNDAM_EN_US_PRODUCT_RELEASES.GD05.releaseDate,
  },
  classifier: {
    version: GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_VERSION,
    thresholds: GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_THRESHOLDS_V1,
  },
  methodology: GUNDAM_TOURNAMENT_META_METHODOLOGY_CANDIDATE_V1,
  statisticalReview: {
    status: "required",
    statement:
      "Candidate tier cutoffs and sample floor require statistical-review approval before production publication.",
  },
} as const);

export { projectGundamTournamentMetaDeckV1 };
