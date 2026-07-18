#!/usr/bin/env bun
/**
 * Create the translator-facing inventory for the future Spanish card locale.
 *
 * One row represents one printing and points at the companion `.i18n.ts` file
 * where its `es` entry will live. The file intentionally contains only the
 * fields supported by I18nProperties: name, version, text, and optionTexts.
 *
 * Usage:
 *   bun scripts/generate-spanish-translation-inventory.ts
 */

import fs from "node:fs";
import path from "node:path";

const PACKAGE_ROOT = path.resolve(import.meta.dir, "..");
const CARDS_ROOT = path.join(PACKAGE_ROOT, "src/cards");
const CANONICAL_CARDS_PATH = path.join(PACKAGE_ROOT, "src/data/canonical-cards.json");
const PRINTINGS_PATH = path.join(PACKAGE_ROOT, "src/data/printings.json");
const IDENTITY_REGISTRY_PATH = path.join(PACKAGE_ROOT, "src/data/cards.identity-registry.json");
const OUTPUT_PATH = path.join(PACKAGE_ROOT, "data/spanish-translation-inventory.csv");

interface CanonicalCard {
  id: string;
  canonicalId: string;
  cardType: string;
  name: string;
  version?: string;
  rulesText: string;
}

interface Printing {
  id: string;
  gameCardId: string;
  set: string;
  cardNumber: number;
  flavorText?: string;
}

interface IdentityRecord {
  printingId: string;
  canonicalId: string;
  shortId: string;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function collectI18nFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectI18nFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".i18n.ts")) {
      files.push(entryPath);
    }
  }
  return files;
}

function i18nFileByShortId(): Map<string, string> {
  const filesByShortId = new Map<string, string>();

  for (const i18nFile of collectI18nFiles(CARDS_ROOT)) {
    const cardFile = i18nFile.replace(/\.i18n\.ts$/, ".ts");
    if (!fs.existsSync(cardFile)) continue;

    const cardSource = fs.readFileSync(cardFile, "utf8");
    const shortId = cardSource.match(/\bid:\s*["']([^"']+)["']/)?.[1];
    if (!shortId) {
      throw new Error(`Could not find card id in ${cardFile}`);
    }
    if (filesByShortId.has(shortId)) {
      throw new Error(`Duplicate i18n file for short id ${shortId}`);
    }

    filesByShortId.set(shortId, path.relative(PACKAGE_ROOT, i18nFile));
  }

  return filesByShortId;
}

function csvValue(value: string | number): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function main(): void {
  const canonicalCards = readJson<Record<string, CanonicalCard>>(CANONICAL_CARDS_PATH);
  const printings = readJson<Record<string, Printing>>(PRINTINGS_PATH);
  const identities = readJson<Record<string, IdentityRecord>>(IDENTITY_REGISTRY_PATH);
  const i18nPaths = i18nFileByShortId();

  const rows = Object.entries(canonicalCards)
    .map(([printingId, card]) => {
      const identity = identities[printingId];
      if (!identity) throw new Error(`Missing identity record for ${printingId}`);
      if (card.id !== identity.shortId || card.canonicalId !== identity.canonicalId) {
        throw new Error(`Card identity mismatch for ${printingId}`);
      }

      const i18nFile = i18nPaths.get(card.id);
      if (!i18nFile) throw new Error(`Missing i18n file for ${printingId} (${card.id})`);

      const [, setCode = "", collectorNumber = ""] =
        printingId.match(/^(.+)-(\d+)(?:-[^-]+)?$/) ?? [];
      if (!setCode || !collectorNumber) {
        throw new Error(`Unexpected printing id ${printingId}`);
      }
      const printing = printings[printingId];

      return [
        printingId,
        card.id,
        card.canonicalId,
        printing?.set ?? setCode,
        printing?.cardNumber ?? Number(collectorNumber),
        card.cardType,
        card.name,
        card.version ?? "",
        card.rulesText,
        printing?.flavorText ?? "",
        i18nFile,
        "pending",
      ];
    })
    .sort((left, right) => left[0].localeCompare(right[0], "en"));

  if (rows.length !== i18nPaths.size) {
    throw new Error(`Expected ${i18nPaths.size} rows from card i18n files, generated ${rows.length}`);
  }

  const header = [
    "printing_id",
    "short_id",
    "canonical_id",
    "set_code",
    "collector_number",
    "card_type",
    "name_en",
    "version_en",
    "rules_text_en",
    "flavor_text_en_reference",
    "i18n_file_to_update",
    "spanish_status",
  ];
  const content = [header, ...rows].map((row) => row.map(csvValue).join(",")).join("\n") + "\n";

  fs.writeFileSync(OUTPUT_PATH, content, "utf8");
  console.log(`Wrote ${rows.length} Spanish translation inventory rows to ${OUTPUT_PATH}`);
}

main();
