import { describe, expect, it } from "vite-plus/test";
import {
  GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_THRESHOLDS_V1,
  GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_VERSION,
} from "./archetype-classifier.ts";
import {
  GUNDAM_TOURNAMENT_META_METHODOLOGY_CANDIDATE_V1,
  GUNDAM_TOURNAMENT_META_V1_CONFIG,
  GUNDAM_TOURNAMENT_META_WINDOWS_V1,
} from "./tournament-meta-v1.ts";

describe("Gundam Tournament Meta V1 config", () => {
  it("owns the constructed format, windows, current-set boundary, and classifier config", () => {
    expect(GUNDAM_TOURNAMENT_META_V1_CONFIG).toMatchObject({
      gameSlug: "gundam",
      formatId: "constructed-en-us",
      windows: ["30d", "60d", "90d", "current-set"],
      currentSet: {
        setId: "GD05",
        label: "Freedom Ascension",
        startDate: "2026-07-24",
      },
      classifier: {
        version: GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_VERSION,
        thresholds: GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_THRESHOLDS_V1,
      },
      statisticalReview: { status: "required" },
    });
    expect(GUNDAM_TOURNAMENT_META_V1_CONFIG.windows).toBe(GUNDAM_TOURNAMENT_META_WINDOWS_V1);
  });

  it("publishes the candidate placement formula and worked example without win-rate claims", () => {
    expect(GUNDAM_TOURNAMENT_META_METHODOLOGY_CANDIDATE_V1).toMatchObject({
      version: "gundam.tournament-meta.candidate.v1",
      sampleFloor: 8,
      formula: {
        weights: { metaShare: 0, topCut: 0, top4: 0.6, top1: 0.4 },
      },
      workedExample: { score: 38, tier: "B" },
    });
    expect(JSON.stringify(GUNDAM_TOURNAMENT_META_METHODOLOGY_CANDIDATE_V1)).not.toMatch(
      /win.?rate/i,
    );
  });
});
