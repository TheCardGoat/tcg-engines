#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const packageRoot = path.resolve(import.meta.dirname, "..");
const sourceRoot = path.join(packageRoot, "src");
const _cardsRoot = path.join(sourceRoot, "cards");
const SET_DIRECTORY = /^[A-Z0-9]{3}$/;
const LEGACY_IMPORT =
  /(?:^|\/)[A-Z0-9]{3}\/(?:actions|attack-reactions|defense-reactions|instants|blocks|equipments?|weapons|heroes|tokens)(?:\/|$)|(?:^|\/)[A-Z0-9]{3}\d{3,4}[^/]*\.ts$/;
const SCAFFOLD_MARKERS = [
  "TODO(canonical-scaffold)",
  "TODO(family-scaffold)",
  "IMPLEMENTATION GAP",
];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

export function auditCanonicalCardLayout({ sourceRoot: root = sourceRoot } = {}) {
  const rootCards = path.join(root, "cards");
  const setDirectories = readdirSync(rootCards, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && SET_DIRECTORY.test(entry.name))
    .map((entry) => entry.name);
  const collectorImports = [];
  const scaffolds = [];
  for (const file of walk(root)) {
    if (!/\.[cm]?[jt]sx?$/.test(file)) continue;
    const source = readFileSync(file, "utf8");
    const specifiers = [...source.matchAll(/(?:from\s*|import\s*\(\s*)["']([^"']+)["']/g)].map(
      (match) => match[1],
    );
    if (specifiers.some((specifier) => LEGACY_IMPORT.test(specifier))) {
      collectorImports.push(path.relative(root, file));
    }
    if (SCAFFOLD_MARKERS.some((marker) => source.includes(marker))) {
      scaffolds.push(path.relative(root, file));
    }
  }
  return {
    setDirectories,
    collectorImports,
    familiesDirectory: existsSync(path.join(root, "families")),
    scaffolds,
  };
}

export function auditReviewedPhysicalLayouts({
  specs,
  catalogCards,
  authoredCards,
  physicalCards,
}) {
  const catalogIds = new Set(catalogCards.map((card) => card.canonicalId));
  const missingCatalogIds = [];
  const missingAuthoredIds = [];
  const identicalFaceIds = [];
  const mismatchedPhysicalKinds = [];
  for (const spec of specs) {
    for (const canonicalId of [spec.frontCanonicalId, spec.backCanonicalId]) {
      if (!catalogIds.has(canonicalId)) missingCatalogIds.push(canonicalId);
      if (!authoredCards.has(canonicalId)) missingAuthoredIds.push(canonicalId);
    }
    if (spec.frontCanonicalId === spec.backCanonicalId) {
      identicalFaceIds.push(spec.frontCanonicalId);
    }
    const physical = physicalCards.get(spec.frontCanonicalId);
    if (!physical || physical.layout.kind !== spec.kind) {
      mismatchedPhysicalKinds.push({
        frontCanonicalId: spec.frontCanonicalId,
        expected: spec.kind,
        actual: physical?.layout.kind ?? "missing",
      });
    }
  }
  return {
    missingCatalogIds: [...new Set(missingCatalogIds)].sort((a, b) =>
      String(a).localeCompare(String(b)),
    ),
    missingAuthoredIds: [...new Set(missingAuthoredIds)].sort((a, b) =>
      String(a).localeCompare(String(b)),
    ),
    identicalFaceIds: [...new Set(identicalFaceIds)].sort((a, b) =>
      String(a).localeCompare(String(b)),
    ),
    mismatchedPhysicalKinds,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const report = auditCanonicalCardLayout();
  const [layouts, catalog, authored, physical] = await Promise.all([
    import("../src/authoring/reviewed-card-layouts.ts"),
    import("../src/generated/flesh-and-blood-catalog.ts"),
    import("../src/generated/card-registry.generated.ts"),
    import("../src/runtime-registry.ts"),
  ]);
  const reviewedLayouts = auditReviewedPhysicalLayouts({
    specs: layouts.FAB_DOUBLE_FACED_CARD_SPECS,
    catalogCards: catalog.fleshAndBloodCatalog.cards,
    authoredCards: authored.STRUCTURED_CARDS_BY_CANONICAL_ID,
    physicalCards: physical.PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID,
  });
  const issueCount =
    report.setDirectories.length +
    report.collectorImports.length +
    Number(report.familiesDirectory) +
    report.scaffolds.length +
    Object.values(reviewedLayouts).reduce((total, issues) => total + issues.length, 0);
  process.stdout.write(
    `${JSON.stringify({ mode: "canonical", ...report, reviewedLayouts }, null, 2)}\n`,
  );
  if (issueCount > 0) process.exitCode = 1;
}
