#!/usr/bin/env node

/**
 * Compare the authored Gundam catalog with the locally observed publisher-site
 * snapshot. This tool does not fetch or scrape. The required `--as-of` makes
 * release scope deterministic, while the report caps its evidence date at the
 * snapshot's own observation date.
 *
 * Usage:
 *   pnpm audit:released-catalog -- --as-of 2026-07-28
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Card } from "../packages/types/src/index.ts";
import * as cardExports from "../packages/cards/src/cards/index.ts";
import {
  GUNDAM_EN_US_PRODUCT_RELEASES,
  getGundamRollingPrintingReleaseEvidence,
  reconcileGundamReleasedCatalog,
  type GundamObservedCatalogSnapshot,
  type GundamObservedProductGroup,
} from "../packages/cards/src/index.ts";

interface SnapshotManifest {
  source: string;
  scrapedAt: string;
  sets: Array<{
    id: string;
    count: number;
  }>;
}

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DEFAULT_MANIFEST = join(ROOT, "tools/gundam-card-parser/data/scraped/manifest.json");

function usage(message?: string): never {
  if (message) console.error(message);
  console.error("Usage: pnpm audit:released-catalog -- --as-of YYYY-MM-DD [--manifest PATH]");
  process.exit(2);
}

function parseArguments(argv: string[]): { asOf: string; manifestPath: string } {
  let asOf: string | undefined;
  let manifestPath = DEFAULT_MANIFEST;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--") {
      continue;
    } else if (argument === "--as-of") {
      asOf = argv[index + 1];
      index += 1;
    } else if (argument === "--manifest") {
      const value = argv[index + 1];
      if (!value) usage("--manifest requires a path");
      manifestPath = isAbsolute(value) ? value : resolve(process.cwd(), value);
      index += 1;
    } else {
      usage(`Unknown argument: ${argument}`);
    }
  }
  if (!asOf) usage("--as-of is required");
  return { asOf, manifestPath };
}

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "canonicalId" in value &&
    "cardNumber" in value &&
    "name" in value &&
    "printings" in value &&
    Array.isArray((value as { printings?: unknown }).printings)
  );
}

function releaseSetCode(sourceSetId: string): string | null {
  if (sourceSetId === "edition-beta") return "BETA";
  const direct = sourceSetId.toUpperCase();
  return Object.hasOwn(GUNDAM_EN_US_PRODUCT_RELEASES, direct) ? direct : null;
}

function parseManifest(path: string): SnapshotManifest {
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (
    !parsed ||
    typeof parsed !== "object" ||
    typeof (parsed as SnapshotManifest).source !== "string" ||
    typeof (parsed as SnapshotManifest).scrapedAt !== "string" ||
    !Array.isArray((parsed as SnapshotManifest).sets)
  ) {
    throw new TypeError(`Invalid catalog snapshot manifest: ${path}`);
  }
  return parsed as SnapshotManifest;
}

function readSnapshot(manifestPath: string): GundamObservedCatalogSnapshot | undefined {
  if (!existsSync(manifestPath)) return undefined;
  const manifestSource = readFileSync(manifestPath, "utf8");
  const manifest = parseManifest(manifestPath);
  const snapshotRoot = dirname(manifestPath);
  const hash = createHash("sha256");
  hash.update(`${relative(ROOT, manifestPath)}\0${manifestSource}`);

  const groups: GundamObservedProductGroup[] = [...manifest.sets]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((entry) => {
      const dataPath = join(snapshotRoot, `${entry.id}.json`);
      const dataSource = existsSync(dataPath) ? readFileSync(dataPath, "utf8") : "[]";
      hash.update(`\0${relative(ROOT, dataPath)}\0${dataSource}`);
      const parsed: unknown = JSON.parse(dataSource);
      if (!Array.isArray(parsed)) {
        throw new TypeError(`Invalid catalog snapshot group: ${dataPath}`);
      }
      const printings = parsed.flatMap((printing) =>
        printing &&
        typeof printing === "object" &&
        typeof (printing as { id?: unknown }).id === "string"
          ? [
              {
                id: (printing as { id: string }).id,
                releaseEvidence:
                  getGundamRollingPrintingReleaseEvidence(entry.id, {
                    getIt:
                      typeof (printing as { getIt?: unknown }).getIt === "string"
                        ? (printing as { getIt: string }).getIt
                        : undefined,
                  }) ?? undefined,
              },
            ]
          : [],
      );
      return {
        sourceSetId: entry.id,
        releaseSetCode: releaseSetCode(entry.id),
        manifestCount: entry.count,
        printings,
        provenancePath: relative(ROOT, dataPath),
      };
    });

  return {
    sourceUrl: manifest.source,
    observedAt: manifest.scrapedAt,
    checkpoint: `sha256:${hash.digest("hex")}`,
    manifestPath: relative(ROOT, manifestPath),
    groups,
  };
}

const { asOf, manifestPath } = parseArguments(process.argv.slice(2));
const report = reconcileGundamReleasedCatalog({
  asOf,
  cards: Object.values(cardExports).filter(isCard),
  observedSnapshot: readSnapshot(manifestPath),
});

console.log(JSON.stringify(report, null, 2));

if (
  report.zeroPrintingCanonicals.length > 0 ||
  report.conflictingCanonicalDefinitions.length > 0 ||
  report.duplicateRuntimePrintingIdentities.some(
    (duplicate) =>
      duplicate.classification === "conflicting_owner" || !duplicate.metadataConsistent,
  ) ||
  report.duplicateSourcePrintingIdentities.length > 0 ||
  report.sourceManifestMismatches.length > 0 ||
  report.missingFromRuntime.length > 0 ||
  report.extraInRuntime.length > 0
) {
  process.exitCode = 1;
}
