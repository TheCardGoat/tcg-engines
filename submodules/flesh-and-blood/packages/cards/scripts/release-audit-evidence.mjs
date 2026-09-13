import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export const RELEASE_EVIDENCE_VERSION = 1;
export const RELEASE_EVIDENCE_RELATIVE_PATH = "scripts/card-coverage/release-evidence.json";

export function releaseEvidencePath(packageRoot) {
  return path.join(packageRoot, RELEASE_EVIDENCE_RELATIVE_PATH);
}

export function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

export function auditedUnitPaths(unit) {
  const base = path.join("src", "cards", unit);
  return {
    definition: `${base}.ts`,
    i18n: `${base}.i18n.ts`,
    test: `${base}.test.ts`,
  };
}

function isDigest(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

export function validateReleaseEvidenceShape(value) {
  const errors = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return ["release evidence must be an object"];
  }
  if (value.version !== RELEASE_EVIDENCE_VERSION) {
    errors.push(`release evidence version must be ${RELEASE_EVIDENCE_VERSION}`);
  }
  if (!value.units || typeof value.units !== "object" || Array.isArray(value.units)) {
    errors.push("release evidence units must be an object keyed by canonical unit path");
    return errors;
  }
  for (const [unit, evidence] of Object.entries(value.units)) {
    if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(unit)) {
      errors.push(`invalid release evidence unit key: ${unit}`);
    }
    if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
      errors.push(`${unit}: evidence must be an object`);
      continue;
    }
    if (!isDigest(evidence.definitionSha256)) {
      errors.push(`${unit}: definitionSha256 must be a sha256 digest`);
    }
    if (!isDigest(evidence.i18nSha256)) {
      errors.push(`${unit}: i18nSha256 must be a sha256 digest`);
    }
    if (!(evidence.testSha256 === null || isDigest(evidence.testSha256))) {
      errors.push(`${unit}: testSha256 must be a sha256 digest or null`);
    }
    if (
      typeof evidence.reviewedAt !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(evidence.reviewedAt)
    ) {
      errors.push(`${unit}: reviewedAt must be YYYY-MM-DD`);
    }
    if (typeof evidence.reviewedBy !== "string" || evidence.reviewedBy.trim() === "") {
      errors.push(`${unit}: reviewedBy must be a non-empty provenance label`);
    }
    if (
      !Array.isArray(evidence.coveredCanonicalIds) ||
      evidence.coveredCanonicalIds.some((canonicalId) => typeof canonicalId !== "string")
    ) {
      errors.push(`${unit}: coveredCanonicalIds must be a string array`);
    }
  }
  return errors;
}

export function loadReleaseEvidence(packageRoot, { required = false } = {}) {
  const file = releaseEvidencePath(packageRoot);
  if (!existsSync(file)) {
    if (required) throw new Error(`Missing release evidence: ${file}`);
    return { version: RELEASE_EVIDENCE_VERSION, units: {} };
  }
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  const errors = validateReleaseEvidenceShape(parsed);
  if (errors.length > 0) {
    throw new Error(
      `Invalid release evidence at ${file}:\n${errors.map((error) => `- ${error}`).join("\n")}`,
    );
  }
  return parsed;
}

/**
 * Remove evidence for units that belong to unresolved gap families.
 *
 * Retained entries are reused verbatim: reconciliation is not a review and
 * must never refresh hashes or provenance for unrelated units.
 */
export function excludeUnresolvedGapUnits(evidence, openGapUnits) {
  const units = {};
  const removed = [];
  for (const [unit, unitEvidence] of Object.entries(evidence.units)) {
    if (openGapUnits.has(unit)) {
      removed.push({
        unit,
        families: [...new Set(openGapUnits.get(unit))].sort((a, b) =>
          String(a).localeCompare(String(b)),
        ),
      });
      continue;
    }
    units[unit] = unitEvidence;
  }
  return {
    evidence: { ...evidence, units },
    removed,
  };
}

/** Replace only explicitly reviewed unit entries; all other entry objects stay untouched. */
export function refreshReviewedUnitEvidence(evidence, replacements) {
  const units = {};
  for (const [unit, unitEvidence] of Object.entries(evidence.units)) {
    units[unit] = replacements.get(unit) ?? unitEvidence;
  }
  for (const [unit, unitEvidence] of replacements) {
    if (!(unit in units)) units[unit] = unitEvidence;
  }
  return { ...evidence, units };
}

export function currentUnitDigests(packageRoot, unit) {
  const files = auditedUnitPaths(unit);
  const digest = (relative) => {
    const absolute = path.join(packageRoot, relative);
    return existsSync(absolute) ? sha256(readFileSync(absolute)) : null;
  };
  return {
    definitionSha256: digest(files.definition),
    i18nSha256: digest(files.i18n),
    testSha256: digest(files.test),
  };
}

const headTreeCache = new Map();

function loadHeadTree(packageRoot) {
  const cached = headTreeCache.get(packageRoot);
  if (cached) return cached;
  const root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: packageRoot,
    encoding: "utf8",
  }).trim();
  const cardsPrefix = path
    .relative(root, path.join(packageRoot, "src", "cards"))
    .replaceAll(path.sep, "/");
  const tree = execFileSync("git", ["ls-tree", "-r", "-z", "HEAD", "--", cardsPrefix], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  const entries = tree
    .split("\0")
    .filter(Boolean)
    .map((line) => {
      const match = /^[0-7]+ blob ([a-f0-9]+)\t(.+)$/.exec(line);
      if (!match) throw new Error(`Unexpected git ls-tree row: ${line}`);
      return { oid: match[1], repositoryRelative: match[2] };
    });
  const batch = execFileSync("git", ["cat-file", "--batch"], {
    cwd: root,
    input: `${entries.map((entry) => entry.oid).join("\n")}\n`,
    encoding: null,
    maxBuffer: 256 * 1024 * 1024,
  });
  const byRepositoryPath = new Map();
  let offset = 0;
  for (const entry of entries) {
    const headerEnd = batch.indexOf(0x0a, offset);
    const header = batch.subarray(offset, headerEnd).toString("utf8");
    const match = /^[a-f0-9]+ blob (\d+)$/.exec(header);
    if (!match) throw new Error(`Unexpected git cat-file header: ${header}`);
    const size = Number(match[1]);
    const contentStart = headerEnd + 1;
    const contentEnd = contentStart + size;
    byRepositoryPath.set(entry.repositoryRelative, batch.subarray(contentStart, contentEnd));
    offset = contentEnd + 1;
  }
  const loaded = { root, byRepositoryPath };
  headTreeCache.set(packageRoot, loaded);
  return loaded;
}

function headFile(packageRoot, relative) {
  const { root, byRepositoryPath } = loadHeadTree(packageRoot);
  const repositoryRelative = path
    .relative(root, path.join(packageRoot, relative))
    .replaceAll(path.sep, "/");
  return byRepositoryPath.get(repositoryRelative) ?? null;
}

export function headUnitDigests(packageRoot, unit) {
  const files = auditedUnitPaths(unit);
  const digest = (relative) => {
    const content = headFile(packageRoot, relative);
    return content === null ? null : sha256(content);
  };
  return {
    definitionSha256: digest(files.definition),
    i18nSha256: digest(files.i18n),
    testSha256: digest(files.test),
  };
}

export function parseLegacyAuditedMarks(markdown) {
  const marks = new Set();
  const row = /^\|\s*\[x\]\s*\|\s*`([^`]+)`\s*\|/;
  for (const line of markdown.split("\n")) {
    const match = row.exec(line);
    if (match) marks.add(match[1]);
  }
  return marks;
}
