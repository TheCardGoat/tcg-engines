import assert from "node:assert/strict";
import test from "node:test";

import {
  excludeOpenGapUnitNames,
  mapOpenGapUnits,
  parseRefreshReviewedUnits,
  prepareReviewedEvidenceRefresh,
  reconcileEvidenceAgainstOpenGaps,
  run,
  validateGapRegistry,
} from "./check-card-release-audit-consistency.mjs";
import {
  excludeUnresolvedGapUnits,
  refreshReviewedUnitEvidence,
  validateReleaseEvidenceShape,
} from "./release-audit-evidence.mjs";

const digest = "a".repeat(64);

test("release evidence requires content hashes and complete provenance", () => {
  assert.deepEqual(
    validateReleaseEvidenceShape({
      version: 1,
      units: {
        "actions/test-strike": {
          definitionSha256: digest,
          i18nSha256: digest,
          testSha256: digest,
          coveredCanonicalIds: ["canonical-1"],
          reviewedAt: "2026-08-30",
          reviewedBy: "review:test",
        },
      },
    }),
    [],
  );
  assert.match(
    validateReleaseEvidenceShape({
      version: 1,
      units: {
        "actions/test-strike": {
          definitionSha256: "stale",
          i18nSha256: digest,
          testSha256: null,
          coveredCanonicalIds: [],
          reviewedAt: "today",
          reviewedBy: "",
        },
      },
    }).join("\n"),
    /definitionSha256.*reviewedAt.*reviewedBy/s,
  );
});

test("gap registry rejects duplicates, malformed clusters, and status drift", () => {
  const errors = validateGapRegistry({
    version: 2,
    families: [
      {
        family: "engine/example",
        status: "open",
        resolvedBy: "should be null",
        members: [
          { canonicalId: "card-1", cluster: "one\nline" },
          { canonicalId: "card-1", cluster: "duplicate" },
        ],
      },
      {
        family: "engine/example",
        status: "resolved",
        resolvedBy: null,
        members: [],
      },
    ],
  });
  assert.match(
    errors.join("\n"),
    /unresolved family must have resolvedBy: null.*cluster must be one line.*duplicate member.*duplicate family id.*resolved family requires resolvedBy evidence/s,
  );
});

test("open-gap reconciliation removes whole units and preserves retained evidence", () => {
  const retained = {
    definitionSha256: "1".repeat(64),
    i18nSha256: "2".repeat(64),
    testSha256: "3".repeat(64),
    coveredCanonicalIds: ["card-safe"],
    reviewedAt: "2026-08-30",
    reviewedBy: "review:safe",
  };
  const removed = {
    definitionSha256: "4".repeat(64),
    i18nSha256: "5".repeat(64),
    testSha256: "6".repeat(64),
    coveredCanonicalIds: ["card-red", "card-blue"],
    reviewedAt: "2026-08-30",
    reviewedBy: "review:family",
  };
  const evidence = {
    version: 1,
    generatedAt: "2026-08-30",
    units: { "actions/family": removed, "actions/safe": retained },
  };
  const openGapUnits = new Map([["actions/family", ["engine/two", "engine/one", "engine/one"]]]);

  const result = excludeUnresolvedGapUnits(evidence, openGapUnits);

  assert.deepEqual(result.removed, [
    { unit: "actions/family", families: ["engine/one", "engine/two"] },
  ]);
  assert.deepEqual(result.evidence.units, { "actions/safe": retained });
  assert.equal(result.evidence.units["actions/safe"], retained);
  assert.equal(evidence.units["actions/family"], removed);
});

test("open-gap mapping invalidates a complete authored family when one card is a member", () => {
  const report = {
    unitsAll: [
      { unit: "actions/family", cards: ["card-red", "card-yellow", "card-blue"] },
      { unit: "actions/safe", cards: ["card-safe"] },
    ],
  };
  const gaps = {
    version: 2,
    families: [
      {
        family: "engine/example",
        status: "open",
        resolvedBy: null,
        members: [{ canonicalId: "card-yellow", cluster: "actions|example" }],
      },
      {
        family: "engine/resolved",
        status: "resolved",
        resolvedBy: "fixed by test",
        members: [{ canonicalId: "card-safe", cluster: "actions|safe" }],
      },
    ],
  };

  const result = mapOpenGapUnits(report, gaps);

  assert.deepEqual(result.errors, []);
  assert.deepEqual([...result.openGapUnits], [["actions/family", ["engine/example"]]]);
  assert.deepEqual(
    excludeOpenGapUnitNames(["actions/family", "actions/safe"], result.openGapUnits),
    ["actions/safe"],
  );
});

test("reconciliation refuses invalid gaps without changing evidence", () => {
  const evidence = {
    version: 1,
    units: {
      "actions/safe": {
        definitionSha256: digest,
        i18nSha256: digest,
        testSha256: digest,
        coveredCanonicalIds: ["card-safe"],
        reviewedAt: "2026-08-30",
        reviewedBy: "review:safe",
      },
    },
  };
  const result = reconcileEvidenceAgainstOpenGaps({
    evidence,
    report: { unitsAll: [{ unit: "actions/safe", cards: ["card-safe"] }] },
    gaps: {
      version: 2,
      families: [
        {
          family: "engine/invalid",
          status: "open",
          resolvedBy: "not null",
          members: [{ canonicalId: "card-safe", cluster: "actions|safe" }],
        },
      ],
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.evidence, evidence);
  assert.deepEqual(result.removed, []);
  assert.match(result.errors.join("\n"), /unresolved family must have resolvedBy: null/);
});

test("reviewed-unit list parsing requires an exact non-empty unique list", () => {
  assert.deepEqual(parseRefreshReviewedUnits("actions/one,equipment/two"), [
    "actions/one",
    "equipment/two",
  ]);
  assert.throws(() => parseRefreshReviewedUnits(""), /exact comma-separated unit list/);
  assert.throws(() => parseRefreshReviewedUnits("actions/one,"), /empty unit name/);
  assert.throws(() => parseRefreshReviewedUnits("actions/one,actions/one"), /duplicate/);
  assert.throws(() => parseRefreshReviewedUnits("../../outside"), /invalid reviewed unit name/);
});

test("review refresh CLI rejects missing values and mutation combinations before I/O", async () => {
  await assert.rejects(() => run(["--refresh-reviewed-units"]), /requires a value/);
  await assert.rejects(
    () =>
      run([
        "--refresh-reviewed-units",
        "actions/one",
        "--reviewed-by",
        "review:test",
        "--exclude-open-gaps",
      ]),
    /Choose only one mutation/,
  );
  await assert.rejects(() => run(["--reviewed-by", "review:test"]), /only valid/);
  await assert.rejects(() => run(["--use-head"]), /only valid with --migrate-from-docs/);
});

test("review refresh changes only named evidence and preserves every other entry", () => {
  const retained = {
    definitionSha256: "1".repeat(64),
    i18nSha256: "2".repeat(64),
    testSha256: "3".repeat(64),
    coveredCanonicalIds: ["safe-card"],
    reviewedAt: "2026-08-29",
    reviewedBy: "review:original",
  };
  const stale = {
    definitionSha256: "4".repeat(64),
    i18nSha256: "5".repeat(64),
    testSha256: "6".repeat(64),
    coveredCanonicalIds: ["review-card"],
    reviewedAt: "2026-08-29",
    reviewedBy: "review:old",
  };
  const evidence = {
    version: 1,
    generatedAt: "2026-08-30",
    units: { "actions/review": stale, "actions/safe": retained },
  };
  const current = {
    definitionSha256: "7".repeat(64),
    i18nSha256: "8".repeat(64),
    testSha256: "9".repeat(64),
  };
  const result = prepareReviewedEvidenceRefresh({
    evidence,
    report: {
      unitsAll: [
        {
          unit: "actions/review",
          cards: ["review-card"],
          issues: [{ dimension: "assets", code: "missing-catalog-asset-urls" }],
          tests: { exempt: false },
        },
        { unit: "actions/safe", cards: ["safe-card"], issues: [], tests: { exempt: false } },
      ],
    },
    gaps: { version: 2, families: [] },
    unitNames: ["actions/review"],
    reviewedBy: "review:agent-b",
    reviewedAt: "2026-08-30",
    digestsByUnit: new Map([["actions/review", current]]),
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.refreshed, ["actions/review"]);
  assert.deepEqual(result.evidence.units["actions/review"], {
    ...current,
    coveredCanonicalIds: ["review-card"],
    reviewedAt: "2026-08-30",
    reviewedBy: "review:agent-b",
  });
  assert.equal(result.evidence.units["actions/safe"], retained);
  assert.equal(evidence.units["actions/review"], stale);

  const replacement = { ...current, reviewedAt: "2026-08-30" };
  const directlyRefreshed = refreshReviewedUnitEvidence(
    evidence,
    new Map([["actions/new", replacement]]),
  );
  assert.equal(directlyRefreshed.units["actions/safe"], retained);
  assert.equal(directlyRefreshed.units["actions/new"], replacement);
});

test("review refresh rejects open-gap, absent, authored-issue, and missing-test units", () => {
  const evidence = { version: 1, units: {} };
  const unitsAll = [
    { unit: "actions/open", cards: ["open-card"], issues: [], tests: { exempt: false } },
    {
      unit: "actions/broken",
      cards: ["broken-card"],
      issues: [{ dimension: "tests", code: "missing-test-module" }],
      tests: { exempt: false },
    },
  ];
  const result = prepareReviewedEvidenceRefresh({
    evidence,
    report: { unitsAll },
    gaps: {
      version: 2,
      families: [
        {
          family: "engine/open",
          status: "open",
          resolvedBy: null,
          members: [{ canonicalId: "open-card", cluster: "actions|open" }],
        },
      ],
    },
    unitNames: ["actions/open", "actions/broken", "actions/absent"],
    reviewedBy: "review:agent-b",
    reviewedAt: "2026-08-30",
    digestsByUnit: new Map([
      ["actions/open", { definitionSha256: digest, i18nSha256: digest, testSha256: digest }],
      ["actions/broken", { definitionSha256: digest, i18nSha256: digest, testSha256: null }],
      ["actions/absent", { definitionSha256: null, i18nSha256: null, testSha256: null }],
    ]),
  });

  assert.equal(result.ok, false);
  assert.equal(result.evidence, evidence);
  assert.match(
    result.errors.join("\n"),
    /belongs to open gap families.*has authored issues.*test source is absent.*absent from authored units/s,
  );
});
