#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { auditCardReleaseAudit, renderReleaseAuditDoc } from "./audit-card-release-audit.mjs";
import {
  currentUnitDigests,
  excludeUnresolvedGapUnits,
  headUnitDigests,
  loadReleaseEvidence,
  parseLegacyAuditedMarks,
  refreshReviewedUnitEvidence,
  releaseEvidencePath,
} from "./release-audit-evidence.mjs";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_PACKAGE_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..");
const GAPS_RELATIVE_PATH = "scripts/card-coverage/gaps.json";
const DOCS_RELATIVE_FROM_PACKAGE = "../../docs/card-release-audit.md";

function parseArguments(argv) {
  const packageRootIndex = argv.indexOf("--package-root");
  const packageRoot =
    packageRootIndex >= 0 && argv[packageRootIndex + 1]
      ? path.resolve(argv[packageRootIndex + 1])
      : DEFAULT_PACKAGE_ROOT;
  return {
    packageRoot,
    excludeOpenGaps: argv.includes("--exclude-open-gaps"),
    migrateFromDocs: argv.includes("--migrate-from-docs"),
    refreshReviewedUnits: parseOption(argv, "--refresh-reviewed-units"),
    reviewedBy: parseOption(argv, "--reviewed-by"),
    useHead: argv.includes("--use-head"),
  };
}

function parseOption(argv, name) {
  const index = argv.indexOf(name);
  if (index < 0) return undefined;
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return value;
}

function currentLocalDate() {
  const now = new Date();
  const part = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${part(now.getMonth() + 1)}-${part(now.getDate())}`;
}

function readGaps(packageRoot) {
  const file = path.join(packageRoot, GAPS_RELATIVE_PATH);
  return JSON.parse(readFileSync(file, "utf8"));
}

function canonicalIds(values) {
  return [...new Set(values)].sort((a, b) => String(a).localeCompare(String(b)));
}

function sameStrings(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function validateGapRegistry(gaps) {
  const errors = [];
  if (gaps?.version !== 2 || !Array.isArray(gaps.families)) {
    return ["gap registry must use schema version 2 with a families array"];
  }
  const familyIds = new Set();
  for (const family of gaps.families) {
    if (typeof family?.family !== "string" || family.family.trim() === "") {
      errors.push("gap family has no stable family id");
      continue;
    }
    if (familyIds.has(family.family)) errors.push(`${family.family}: duplicate family id`);
    familyIds.add(family.family);
    if (!["open", "pinned", "resolved"].includes(family.status)) {
      errors.push(`${family.family}: invalid status ${String(family.status)}`);
    }
    if (
      family.status === "resolved" &&
      !(typeof family.resolvedBy === "string" && family.resolvedBy.trim())
    ) {
      errors.push(`${family.family}: resolved family requires resolvedBy evidence`);
    }
    if (family.status !== "resolved" && family.resolvedBy !== null) {
      errors.push(`${family.family}: unresolved family must have resolvedBy: null`);
    }
    if (!Array.isArray(family.members)) {
      errors.push(`${family.family}: members must be an array`);
      continue;
    }
    const memberIds = new Set();
    for (const member of family.members) {
      if (typeof member?.canonicalId !== "string" || member.canonicalId.trim() === "") {
        errors.push(`${family.family}: every member requires canonicalId`);
        continue;
      }
      if (memberIds.has(member.canonicalId)) {
        errors.push(`${family.family}: duplicate member ${member.canonicalId}`);
      }
      memberIds.add(member.canonicalId);
      if (typeof member.cluster !== "string" || /[\r\n]/.test(member.cluster)) {
        errors.push(`${family.family}:${member.canonicalId}: cluster must be one line`);
      }
    }
  }
  return errors;
}

export function mapOpenGapUnits(report, gaps) {
  const errors = [];
  const unitByCanonicalId = new Map(
    report.unitsAll.flatMap((unit) => unit.cards.map((canonicalId) => [canonicalId, unit.unit])),
  );
  const openGapUnits = new Map();
  for (const family of gaps.families.filter((candidate) => candidate.status !== "resolved")) {
    for (const member of family.members) {
      const unit = unitByCanonicalId.get(member.canonicalId);
      if (!unit) {
        errors.push(
          `${family.family}:${member.canonicalId}: gap member is absent from authored units`,
        );
        continue;
      }
      const families = openGapUnits.get(unit) ?? [];
      families.push(family.family);
      openGapUnits.set(unit, families);
    }
  }
  return { openGapUnits, errors };
}

export function reconcileEvidenceAgainstOpenGaps({ evidence, report, gaps }) {
  const errors = validateGapRegistry(gaps);
  if (errors.length > 0) return { ok: false, errors, evidence, removed: [] };
  const mapped = mapOpenGapUnits(report, gaps);
  if (mapped.errors.length > 0) {
    return { ok: false, errors: mapped.errors, evidence, removed: [] };
  }
  const reconciled = excludeUnresolvedGapUnits(evidence, mapped.openGapUnits);
  return { ok: true, errors: [], ...reconciled };
}

export function excludeOpenGapUnitNames(unitNames, openGapUnits) {
  return unitNames.filter((unitName) => !openGapUnits.has(unitName));
}

export function parseRefreshReviewedUnits(value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("--refresh-reviewed-units requires an exact comma-separated unit list");
  }
  const units = value.split(",").map((unit) => unit.trim());
  if (units.some((unit) => unit === "")) {
    throw new Error("--refresh-reviewed-units cannot contain an empty unit name");
  }
  if (new Set(units).size !== units.length) {
    throw new Error("--refresh-reviewed-units cannot contain duplicate unit names");
  }
  const invalid = units.find((unit) => !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(unit));
  if (invalid) throw new Error(`invalid reviewed unit name: ${invalid}`);
  return units;
}

export function prepareReviewedEvidenceRefresh({
  evidence,
  report,
  gaps,
  unitNames,
  reviewedBy,
  reviewedAt,
  digestsByUnit,
}) {
  const errors = validateGapRegistry(gaps);
  if (typeof reviewedBy !== "string" || reviewedBy.trim() === "") {
    errors.push("--reviewed-by requires a non-empty provenance label");
  }
  const mapped = mapOpenGapUnits(report, gaps);
  errors.push(...mapped.errors);
  const unitsByName = new Map(report.unitsAll.map((unit) => [unit.unit, unit]));
  const replacements = new Map();
  for (const unitName of unitNames) {
    const unit = unitsByName.get(unitName);
    if (!unit) {
      errors.push(`${unitName}: reviewed unit is absent from authored units`);
      continue;
    }
    const openFamilies = mapped.openGapUnits.get(unitName) ?? [];
    if (openFamilies.length > 0) {
      errors.push(
        `${unitName}: reviewed unit belongs to open gap families ${openFamilies.join(", ")}`,
      );
    }
    const authoredIssues = unit.issues.filter((issue) => issue.dimension !== "assets");
    if (authoredIssues.length > 0) {
      errors.push(
        `${unitName}: reviewed unit has authored issues ${authoredIssues.map((issue) => `${issue.dimension}/${issue.code}`).join(", ")}`,
      );
    }
    const digests = digestsByUnit.get(unitName);
    if (!digests?.definitionSha256 || !digests.i18nSha256) {
      errors.push(`${unitName}: definition or i18n source is absent`);
      continue;
    }
    if (!digests.testSha256 && !unit.tests.exempt) {
      errors.push(`${unitName}: test source is absent and the kind is not exempt`);
      continue;
    }
    replacements.set(unitName, {
      ...digests,
      coveredCanonicalIds: canonicalIds(unit.cards),
      reviewedAt,
      reviewedBy: reviewedBy.trim(),
    });
  }
  if (errors.length > 0) return { ok: false, errors, evidence };
  return {
    ok: true,
    errors: [],
    evidence: refreshReviewedUnitEvidence(evidence, replacements),
    refreshed: unitNames,
  };
}

export function auditCardReleaseConsistency({ packageRoot = DEFAULT_PACKAGE_ROOT } = {}) {
  const report = auditCardReleaseAudit({ packageRoot });
  const evidence = loadReleaseEvidence(packageRoot, { required: true });
  const gaps = readGaps(packageRoot);
  const docsPath = path.resolve(packageRoot, DOCS_RELATIVE_FROM_PACKAGE);
  const docs = readFileSync(docsPath, "utf8");
  const errors = validateGapRegistry(gaps);
  const unitsByName = new Map(report.unitsAll.map((unit) => [unit.unit, unit]));
  const mapped = mapOpenGapUnits(report, gaps);
  errors.push(...mapped.errors);
  const { openGapUnits } = mapped;

  for (const [unitName, unitEvidence] of Object.entries(evidence.units)) {
    const unit = unitsByName.get(unitName);
    if (!unit) {
      errors.push(`${unitName}: release evidence points to an absent authored unit`);
      continue;
    }
    const expectedCards = canonicalIds(unit.cards);
    const evidencedCards = canonicalIds(unitEvidence.coveredCanonicalIds);
    if (!sameStrings(expectedCards, evidencedCards)) {
      errors.push(
        `${unitName}: coveredCanonicalIds differ from the complete authored family (${evidencedCards.join(", ")} != ${expectedCards.join(", ")})`,
      );
    }
    const actual = currentUnitDigests(packageRoot, unitName);
    for (const field of ["definitionSha256", "i18nSha256", "testSha256"]) {
      if (actual[field] !== unitEvidence[field]) {
        errors.push(`${unitName}: ${field} is stale`);
      }
    }
    const authoredIssues = unit.issues.filter((issue) => issue.dimension !== "assets");
    if (authoredIssues.length > 0) {
      errors.push(
        `${unitName}: audited unit has authored issues ${authoredIssues.map((issue) => `${issue.dimension}/${issue.code}`).join(", ")}`,
      );
    }
    const openFamilies = openGapUnits.get(unitName) ?? [];
    if (openFamilies.length > 0) {
      errors.push(
        `${unitName}: audited unit belongs to open gap families ${openFamilies.join(", ")}`,
      );
    }
  }

  const docsMarks = [...parseLegacyAuditedMarks(docs)].sort((a, b) =>
    String(a).localeCompare(String(b)),
  );
  const evidenceMarks = Object.keys(evidence.units).sort((a, b) =>
    String(a).localeCompare(String(b)),
  );
  if (!sameStrings(docsMarks, evidenceMarks)) {
    errors.push("generated audit document checkmarks differ from release evidence");
  }
  const rendered = renderReleaseAuditDoc(report, {
    evidence,
    generatedAt: evidence.generatedAt,
  });
  if (rendered !== docs)
    errors.push("generated audit document is stale; run the write-docs command");

  return {
    ok: errors.length === 0,
    errors,
    auditedUnits: evidenceMarks.length,
    openGapFamilies: gaps.families.filter((family) => family.status !== "resolved").length,
    openGapMembers: [...openGapUnits.values()].reduce(
      (total, families) => total + families.length,
      0,
    ),
  };
}

function migrateEvidenceFromDocs(packageRoot, useHead) {
  const report = auditCardReleaseAudit({ packageRoot });
  const gaps = readGaps(packageRoot);
  const gapErrors = validateGapRegistry(gaps);
  if (gapErrors.length > 0) {
    throw new Error(
      `Cannot migrate with an invalid gap registry:\n${gapErrors.map((error) => `- ${error}`).join("\n")}`,
    );
  }
  const mapped = mapOpenGapUnits(report, gaps);
  if (mapped.errors.length > 0) {
    throw new Error(
      `Cannot migrate with unmapped gap members:\n${mapped.errors.map((error) => `- ${error}`).join("\n")}`,
    );
  }
  const docsPath = path.resolve(packageRoot, DOCS_RELATIVE_FROM_PACKAGE);
  const docs = readFileSync(docsPath, "utf8");
  const marks = excludeOpenGapUnitNames(
    [...parseLegacyAuditedMarks(docs)].sort((a, b) => String(a).localeCompare(String(b))),
    mapped.openGapUnits,
  );
  const unitsByName = new Map(report.unitsAll.map((unit) => [unit.unit, unit]));
  const units = {};
  for (const unitName of marks) {
    const unit = unitsByName.get(unitName);
    if (!unit) throw new Error(`Cannot migrate absent audited unit ${unitName}`);
    const digests = useHead
      ? headUnitDigests(packageRoot, unitName)
      : currentUnitDigests(packageRoot, unitName);
    if (!digests.definitionSha256 || !digests.i18nSha256) {
      throw new Error(`Cannot migrate ${unitName}: definition or i18n source is absent`);
    }
    if (!digests.testSha256 && !unit.tests.exempt) {
      throw new Error(
        `Cannot migrate ${unitName}: test source is absent and the kind is not exempt`,
      );
    }
    units[unitName] = {
      ...digests,
      coveredCanonicalIds: canonicalIds(unit.cards),
      reviewedAt: "2026-08-30",
      reviewedBy: "migration:pr-224-card-release-audit",
    };
  }
  const evidence = {
    version: 1,
    generatedAt: "2026-08-30",
    note: "Content-addressed migration of the human review decisions recorded by PR 224, excluding every unit in an unresolved gap family. Any source change invalidates the corresponding evidence until it is reviewed again.",
    units,
  };
  writeFileSync(releaseEvidencePath(packageRoot), `${JSON.stringify(evidence, null, 2)}\n`);
  return evidence;
}

export async function run(argv = process.argv.slice(2)) {
  const {
    packageRoot,
    excludeOpenGaps,
    migrateFromDocs,
    refreshReviewedUnits,
    reviewedBy,
    useHead,
  } = parseArguments(argv);
  const mutationCount =
    Number(excludeOpenGaps) + Number(migrateFromDocs) + Number(refreshReviewedUnits !== undefined);
  if (mutationCount > 1) {
    throw new Error(
      "Choose only one mutation: --exclude-open-gaps, --migrate-from-docs, or --refresh-reviewed-units",
    );
  }
  if (reviewedBy !== undefined && refreshReviewedUnits === undefined) {
    throw new Error("--reviewed-by is only valid with --refresh-reviewed-units");
  }
  if (useHead && !migrateFromDocs) {
    throw new Error(
      "--use-head is only valid with --migrate-from-docs; review refresh always hashes current files",
    );
  }
  if (refreshReviewedUnits !== undefined) {
    const unitNames = parseRefreshReviewedUnits(refreshReviewedUnits);
    const report = auditCardReleaseAudit({ packageRoot });
    const evidence = loadReleaseEvidence(packageRoot, { required: true });
    const digestsByUnit = new Map(
      unitNames.map((unitName) => [unitName, currentUnitDigests(packageRoot, unitName)]),
    );
    const prepared = prepareReviewedEvidenceRefresh({
      evidence,
      report,
      gaps: readGaps(packageRoot),
      unitNames,
      reviewedBy,
      reviewedAt: currentLocalDate(),
      digestsByUnit,
    });
    if (!prepared.ok) {
      process.stdout.write(`${JSON.stringify({ ok: false, errors: prepared.errors }, null, 2)}\n`);
      return 1;
    }
    writeFileSync(
      releaseEvidencePath(packageRoot),
      `${JSON.stringify(prepared.evidence, null, 2)}\n`,
    );
    process.stdout.write(
      `${JSON.stringify({ ok: true, refreshed: prepared.refreshed, reviewedBy: reviewedBy.trim() }, null, 2)}\n`,
    );
    return 0;
  }
  if (excludeOpenGaps) {
    const report = auditCardReleaseAudit({ packageRoot });
    const evidence = loadReleaseEvidence(packageRoot, { required: true });
    const reconciled = reconcileEvidenceAgainstOpenGaps({
      evidence,
      report,
      gaps: readGaps(packageRoot),
    });
    if (!reconciled.ok) {
      process.stdout.write(
        `${JSON.stringify({ ok: false, errors: reconciled.errors }, null, 2)}\n`,
      );
      return 1;
    }
    writeFileSync(
      releaseEvidencePath(packageRoot),
      `${JSON.stringify(reconciled.evidence, null, 2)}\n`,
    );
    process.stdout.write(
      `${JSON.stringify({ ok: true, removed: reconciled.removed, retainedUnits: Object.keys(reconciled.evidence.units).length }, null, 2)}\n`,
    );
    return 0;
  }
  if (migrateFromDocs) {
    const evidence = migrateEvidenceFromDocs(packageRoot, useHead);
    process.stdout.write(
      `Migrated ${Object.keys(evidence.units).length} audited units to ${releaseEvidencePath(packageRoot)}\n`,
    );
    return 0;
  }
  const result = auditCardReleaseConsistency({ packageRoot });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result.ok ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  process.exitCode = await run();
}
