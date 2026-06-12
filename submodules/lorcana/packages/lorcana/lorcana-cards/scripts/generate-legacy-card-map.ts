#!/usr/bin/env bun

import * as fs from "node:fs";
import * as path from "node:path";

export const NEW_CARDS_ROOT = path.resolve(import.meta.dir, "../src/cards");
export const LEGACY_CARDS_ROOT = path.resolve(
  import.meta.dir,
  "../../../../../lorcanito/packages/lorcana-engine/src/cards",
);
export const OUTPUT_CSV_PATH = path.resolve(NEW_CARDS_ROOT, "LEGACY_CARD_MAP.csv");
const AUDIT_INVENTORY_ROOT = NEW_CARDS_ROOT;

const INCLUDED_GROUPS = new Set(["actions", "characters", "items", "locations"]);
const EXCLUDED_FILENAMES = new Set([
  "index.ts",
  "actions.ts",
  "characters.ts",
  "items.ts",
  "locations.ts",
  "songs.ts",
  "abilities.ts",
  "test-helpers.ts",
  "helpers.ts",
]);

export type MatchType = "exact" | "number_only" | "fuzzy" | "missing";

export interface CardFileRecord {
  absolutePath: string;
  relativePath: string;
  setCode: string;
  kind: string;
  normalizedKind: string;
  number: string;
  baseName: string;
  rawSlug: string;
  normalizedSlug: string;
  testPath: string;
}

export interface LegacyCardMapRow {
  sort_name: string;
  new_card_path: string;
  new_test_path: string;
  legacy_card_path: string;
  legacy_test_path: string;
  match_type: MatchType;
  validated_by_llm: "true" | "false";
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

export function normalizeKind(kind: string): string | null {
  switch (kind) {
    case "character":
    case "characters":
      return "characters";
    case "action":
    case "actions":
      return "actions";
    case "item":
    case "items":
      return "items";
    case "location":
    case "locations":
      return "locations";
    case "song":
    case "songs":
      return "actions";
    default:
      return null;
  }
}

function isSupportedImplementationFile(fileName: string): boolean {
  if (!fileName.endsWith(".ts")) return false;
  if (fileName.endsWith(".test.ts") || fileName.endsWith(".spec.ts")) return false;
  if (EXCLUDED_FILENAMES.has(fileName)) return false;
  return /^\d{3}-.*\.ts$/.test(fileName);
}

function isSupportedTestFile(fileName: string): boolean {
  if (EXCLUDED_FILENAMES.has(fileName)) return false;
  return /^\d{3}-.*\.(test|spec)\.ts$/.test(fileName);
}

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/\.(test|spec)$/g, "")
    .replace(/^\d+-/, "")
    .replace(/['".,!?():[\]{}]/g, "")
    .replace(/&/g, " and ")
    .replace(/-/g, " ")
    .replace(/\bworld s\b/g, "worlds")
    .replace(/\bi m\b/g, "im")
    .replace(/\bwon t\b/g, "wont")
    .replace(/\bhe s\b/g, "hes")
    .replace(/\bit s\b/g, "its")
    .replace(/\beveryone s\b/g, "everyones")
    .replace(/\s+/g, " ")
    .trim();
}

function collectFilesRecursive(root: string): string[] {
  const output: string[] = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const absolutePath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      output.push(...collectFilesRecursive(absolutePath));
      continue;
    }
    output.push(absolutePath);
  }
  return output;
}

function findSiblingTestFile(filePath: string): string {
  const basePath = filePath.replace(/\.ts$/, "");
  const testCandidates = [`${basePath}.test.ts`, `${basePath}.spec.ts`];
  for (const candidate of testCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return "";
}

function collectAuditInventoryFiles(root: string): string[] {
  return collectFilesRecursive(root).filter((absolutePath) => {
    const fileName = path.basename(absolutePath);
    return fileName === "AUDIT_INVENTORY.md" || /^AUDIT_INVENTORY_CHUNK_\d+\.md$/.test(fileName);
  });
}

export function collectValidatedTests(auditRoot = AUDIT_INVENTORY_ROOT): Set<string> {
  const validatedTests = new Set<string>();
  const pattern = /^- \[x\] \*\*(.+?\.test\.ts)\*\*$/;

  for (const inventoryFile of collectAuditInventoryFiles(auditRoot)) {
    const content = fs.readFileSync(inventoryFile, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = pattern.exec(line.trim());
      if (!match) continue;
      const relativePath = match[1]!;
      validatedTests.add(path.join(auditRoot, relativePath));
    }
  }

  return validatedTests;
}

export function collectCardFiles(root: string): CardFileRecord[] {
  return collectFilesRecursive(root)
    .map((absolutePath) => {
      const relativePath = toPosixPath(path.relative(root, absolutePath));
      const parts = relativePath.split("/");
      if (parts.length !== 3) return null;

      const [setCode, kind, fileName] = parts;
      if (!/^\d{3}$/.test(setCode)) return null;

      const normalizedKind = normalizeKind(kind);
      if (!normalizedKind || !INCLUDED_GROUPS.has(normalizedKind)) return null;
      if (!isSupportedImplementationFile(fileName)) return null;

      const match = /^(\d{3})-(.+)\.ts$/.exec(fileName);
      if (!match) return null;

      const [, number, rawSlug] = match;
      return {
        absolutePath,
        relativePath,
        setCode,
        kind,
        normalizedKind,
        number,
        baseName: fileName.replace(/\.ts$/, ""),
        rawSlug,
        normalizedSlug: normalizeSlug(rawSlug),
        testPath: findSiblingTestFile(absolutePath),
      } satisfies CardFileRecord;
    })
    .filter((record): record is CardFileRecord => Boolean(record));
}

function buildKey(...parts: string[]): string {
  return parts.join("|");
}

interface LegacyIndexes {
  exact: Map<string, CardFileRecord[]>;
  byNumber: Map<string, CardFileRecord[]>;
  bySlug: Map<string, CardFileRecord[]>;
}

function buildLegacyIndexes(cards: CardFileRecord[]): LegacyIndexes {
  const exact = new Map<string, CardFileRecord[]>();
  const byNumber = new Map<string, CardFileRecord[]>();
  const bySlug = new Map<string, CardFileRecord[]>();

  for (const card of cards) {
    const exactKey = buildKey(card.setCode, card.normalizedKind, card.number, card.normalizedSlug);
    const numberKey = buildKey(card.setCode, card.normalizedKind, card.number);
    const slugKey = buildKey(card.setCode, card.normalizedKind, card.normalizedSlug);
    exact.set(exactKey, [...(exact.get(exactKey) ?? []), card]);
    byNumber.set(numberKey, [...(byNumber.get(numberKey) ?? []), card]);
    bySlug.set(slugKey, [...(bySlug.get(slugKey) ?? []), card]);
  }

  return { exact, byNumber, bySlug };
}

function chooseBestCandidate(candidates: CardFileRecord[], number: string): CardFileRecord | null {
  if (candidates.length === 0) return null;
  const sameNumber = candidates.filter((candidate) => candidate.number === number);
  if (sameNumber.length === 1) return sameNumber[0] ?? null;
  if (sameNumber.length > 1) return null;
  if (candidates.length === 1) return candidates[0] ?? null;
  return null;
}

export function findLegacyMatch(
  newCard: CardFileRecord,
  indexes: LegacyIndexes,
): { card: CardFileRecord | null; matchType: MatchType } {
  const exactCandidates =
    indexes.exact.get(
      buildKey(newCard.setCode, newCard.normalizedKind, newCard.number, newCard.normalizedSlug),
    ) ?? [];
  const exactMatch = chooseBestCandidate(exactCandidates, newCard.number);
  if (exactMatch) {
    return { card: exactMatch, matchType: "exact" };
  }

  const numberCandidates =
    indexes.byNumber.get(buildKey(newCard.setCode, newCard.normalizedKind, newCard.number)) ?? [];
  const numberOnlyMatch = chooseBestCandidate(numberCandidates, newCard.number);
  if (numberOnlyMatch) {
    return { card: numberOnlyMatch, matchType: "number_only" };
  }

  const slugCandidates =
    indexes.bySlug.get(buildKey(newCard.setCode, newCard.normalizedKind, newCard.normalizedSlug)) ??
    [];
  const fuzzyMatch = chooseBestCandidate(slugCandidates, newCard.number);
  if (fuzzyMatch) {
    return { card: fuzzyMatch, matchType: "fuzzy" };
  }

  return { card: null, matchType: "missing" };
}

export function generateLegacyCardMapRows(
  newCardsRoot = NEW_CARDS_ROOT,
  legacyCardsRoot = LEGACY_CARDS_ROOT,
): LegacyCardMapRow[] {
  const newCards = collectCardFiles(newCardsRoot);
  const legacyCards = collectCardFiles(legacyCardsRoot);
  const indexes = buildLegacyIndexes(legacyCards);
  const validatedTests = collectValidatedTests(newCardsRoot);

  return newCards
    .map((newCard) => {
      const { card: legacyCard, matchType } = findLegacyMatch(newCard, indexes);
      return {
        sort_name: newCard.normalizedSlug,
        new_card_path: newCard.absolutePath,
        new_test_path: newCard.testPath,
        legacy_card_path: legacyCard?.absolutePath ?? "MISSING",
        legacy_test_path: legacyCard?.testPath || "MISSING",
        match_type: matchType,
        validated_by_llm:
          newCard.testPath && validatedTests.has(newCard.testPath) ? "true" : "false",
      } satisfies LegacyCardMapRow;
    })
    .sort((left, right) => {
      const sortNameComparison = left.sort_name.localeCompare(right.sort_name);
      if (sortNameComparison !== 0) return sortNameComparison;
      return left.new_card_path.localeCompare(right.new_card_path);
    });
}

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function rowsToCsv(rows: LegacyCardMapRow[]): string {
  const header = [
    "sort_name",
    "new_card_path",
    "new_test_path",
    "legacy_card_path",
    "legacy_test_path",
    "match_type",
    "validated_by_llm",
  ];
  const lines = [header.join(",")];

  for (const row of rows) {
    lines.push(
      [
        row.sort_name,
        row.new_card_path,
        row.new_test_path,
        row.legacy_card_path,
        row.legacy_test_path,
        row.match_type,
        row.validated_by_llm,
      ]
        .map(escapeCsvCell)
        .join(","),
    );
  }

  return `${lines.join("\n")}\n`;
}

export function writeLegacyCardMapCsv(
  outputPath = OUTPUT_CSV_PATH,
  newCardsRoot = NEW_CARDS_ROOT,
  legacyCardsRoot = LEGACY_CARDS_ROOT,
): LegacyCardMapRow[] {
  const rows = generateLegacyCardMapRows(newCardsRoot, legacyCardsRoot);
  fs.writeFileSync(outputPath, rowsToCsv(rows), "utf8");
  return rows;
}

async function main(): Promise<void> {
  const rows = writeLegacyCardMapCsv();
  const counts = rows.reduce<Record<MatchType, number>>(
    (acc, row) => {
      acc[row.match_type] += 1;
      return acc;
    },
    { exact: 0, number_only: 0, fuzzy: 0, missing: 0 },
  );

  console.log(`Wrote ${rows.length} rows to ${OUTPUT_CSV_PATH}`);
  console.log(
    `Matches: exact=${counts.exact}, number_only=${counts.number_only}, fuzzy=${counts.fuzzy}, missing=${counts.missing}`,
  );
}

if (import.meta.main) {
  await main();
}
