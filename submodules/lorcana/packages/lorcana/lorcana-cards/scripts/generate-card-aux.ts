#!/usr/bin/env bun
/**
 * Generate Card Auxiliary Files Script
 *
 * Post-generation validation and auxiliary file generation.
 * Loads generated cards and produces:
 * - cards.aux.kv.json: identity/reprint/localization lookup maps
 * - cards.aux.validation-report.json: validation results for ids, canonicalIds, reprints, localization
 *
 * Responsibilities:
 * - Load generated cards via canonical-cards.json (printingId-keyed)
 * - Build canonicalId → shortId mappings and reprint lists
 * - Validate ID format/uniqueness, canonicalId consistency, reprint correctness
 * - Build culture_invariant_id → shortId mapping from EN Ravensburger input
 * - Write deterministic aux files (sorted keys, no timestamps)
 *
 * Exit code: 0 on success, 1 on validation failure
 */

import fs from "node:fs";
import path from "node:path";
import type {
  CanonicalCard,
  CardPrintingMetadata,
  CardsAuxKv,
  CardsAuxValidationReport,
  InputCard,
  RavensburgerInputJson,
  SpecialRarity,
  ValidationSection,
} from "./types";

const DATA_DIR = path.resolve(__dirname, "../src/data");
const INPUT_DIR = path.resolve(__dirname, "../data/inputs");
const CANONICAL_CARDS_PATH = path.join(DATA_DIR, "canonical-cards.json");
const PRINTING_METADATA_PATH = path.join(DATA_DIR, "cards.aux.printing-metadata.json");
const RAVENSBURGER_EN_PATH = path.join(INPUT_DIR, "ravensburger-input.json");

const AUX_KV_PATH = path.join(DATA_DIR, "cards.aux.kv.json");
const VALIDATION_REPORT_PATH = path.join(DATA_DIR, "cards.aux.validation-report.json");

const SPECIAL_RARITY_ORDER: SpecialRarity[] = ["enchanted", "epic", "iconic", "promo", "challenge"];
const REPRINT_SHARED_FIELDS = [
  "cardType",
  "name",
  "version",
  "inkType",
  "franchise",
  "cost",
  "inkable",
  "cardCopyLimit",
  "strength",
  "willpower",
  "moveCost",
  "lore",
  "classifications",
  "actionSubtype",
  "vanilla",
  "missingImplementation",
  "missingTests",
  "rulesText",
  "text",
  "abilities",
  "i18n",
  "externalIds",
  "layout",
  "language",
] as const;

type ComparableJson =
  | string
  | number
  | boolean
  | null
  | ComparableJson[]
  | { [key: string]: ComparableJson | undefined };

type ComparableCard = { [key: string]: ComparableJson | undefined };

/**
 * Write JSON file with deterministic formatting (sorted keys, 2 spaces)
 */
function writeJson(filePath: string, data: unknown): void {
  const sorted = sortKeysDeep(data);
  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2), "utf-8");
}

/**
 * Recursively sort object keys for deterministic output
 */
function sortKeysDeep<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortKeysDeep) as unknown as T;
  }

  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortKeysDeep((obj as Record<string, unknown>)[key]);
  }
  return sorted as T;
}

/**
 * Load canonical cards from JSON (keyed by printingId)
 */
function loadCanonicalCards(): Record<string, CanonicalCard> {
  if (!fs.existsSync(CANONICAL_CARDS_PATH)) {
    throw new Error(`canonical-cards.json not found at ${CANONICAL_CARDS_PATH}`);
  }
  const content = fs.readFileSync(CANONICAL_CARDS_PATH, "utf-8");
  return JSON.parse(content) as Record<string, CanonicalCard>;
}

/**
 * Load printing metadata from JSON
 */
function loadPrintingMetadata(): Record<string, CardPrintingMetadata> {
  if (!fs.existsSync(PRINTING_METADATA_PATH)) {
    throw new Error(`printing-metadata.json not found at ${PRINTING_METADATA_PATH}`);
  }
  const content = fs.readFileSync(PRINTING_METADATA_PATH, "utf-8");
  return JSON.parse(content) as Record<string, CardPrintingMetadata>;
}

/**
 * Load Ravensburger EN input for culture_invariant_id mapping
 */
function loadRavensburgerEn(): RavensburgerInputJson {
  if (!fs.existsSync(RAVENSBURGER_EN_PATH)) {
    throw new Error(`ravensburger-input.json not found at ${RAVENSBURGER_EN_PATH}`);
  }
  const content = fs.readFileSync(RAVENSBURGER_EN_PATH, "utf-8");
  return JSON.parse(content) as RavensburgerInputJson;
}

/**
 * Get all InputCards from Ravensburger data
 */
function getAllInputCards(data: RavensburgerInputJson): InputCard[] {
  return [
    ...(data.cards.characters || []),
    ...(data.cards.locations || []),
    ...(data.cards.items || []),
    ...(data.cards.actions || []),
  ];
}

/**
 * Validate that an ID is a valid 3-character short ID
 */
function isValidShortId(id: string): boolean {
  return /^[0-9a-zA-Z]{3}$/.test(id);
}

/**
 * Validate that a canonicalId starts with ci_
 */
function isValidCanonicalId(id: string): boolean {
  return id.startsWith("ci_") && id.length > 3;
}

/**
 * Sort printing IDs by set number, card number, special rarity order, collision suffix
 */
function sortPrintingIds(ids: string[]): string[] {
  return [...ids].sort((a, b) => {
    // Extract set number
    const setMatchA = a.match(/^set(\d+)/i);
    const setMatchB = b.match(/^set(\d+)/i);
    const setNumA = setMatchA ? parseInt(setMatchA[1], 10) : 0;
    const setNumB = setMatchB ? parseInt(setMatchB[1], 10) : 0;

    if (setNumA !== setNumB) {
      return setNumA - setNumB;
    }

    // Extract card number
    const cardMatchA = a.match(/-(\d+)/);
    const cardMatchB = b.match(/-(\d+)/);
    const cardNumA = cardMatchA ? parseInt(cardMatchA[1], 10) : 0;
    const cardNumB = cardMatchB ? parseInt(cardMatchB[1], 10) : 0;

    if (cardNumA !== cardNumB) {
      return cardNumA - cardNumB;
    }

    // Extract special rarity
    const specialA = SPECIAL_RARITY_ORDER.findIndex((r) => a.includes(`-${r}`));
    const specialB = SPECIAL_RARITY_ORDER.findIndex((r) => b.includes(`-${r}`));
    const specialOrderA = specialA === -1 ? -1 : specialA;
    const specialOrderB = specialB === -1 ? -1 : specialB;

    if (specialOrderA !== specialOrderB) {
      return specialOrderA - specialOrderB;
    }

    // Extract collision suffix (e.g., -2, -3)
    const collisionMatchA = a.match(/-(\d+)$/);
    const collisionMatchB = b.match(/-(\d+)$/);
    const collisionA = collisionMatchA ? parseInt(collisionMatchA[1], 10) : 0;
    const collisionB = collisionMatchB ? parseInt(collisionMatchB[1], 10) : 0;

    return collisionA - collisionB;
  });
}

function getPrintingSet(printingId: string): string | undefined {
  return printingId.match(/^set\d+/i)?.[0]?.toLowerCase();
}

function normalizeTextValue(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\\/g, "")
    .replace(/<([^>]+)>/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeTextShape(value: ComparableJson | undefined): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return normalizeTextValue(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    return normalizeTextValue(value.map(normalizeTextShape).filter(Boolean).join(" "));
  }

  const parts: string[] = [];
  for (const key of ["title", "description", "text"]) {
    const part = normalizeTextShape(value[key]);
    if (part) parts.push(part);
  }
  for (const key of Object.keys(value).sort()) {
    if (key === "title" || key === "description" || key === "text") continue;
    const part = normalizeTextShape(value[key]);
    if (part) parts.push(part);
  }
  return normalizeTextValue(parts.join(" "));
}

function normalizeComparableValue(
  value: ComparableJson | undefined,
  textLike = false,
): ComparableJson | undefined {
  if (typeof value === "string") {
    return textLike ? normalizeTextValue(value) : value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeComparableValue(item, textLike))
      .filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    const normalized: { [key: string]: ComparableJson | undefined } = {};
    for (const key of Object.keys(value).sort()) {
      normalized[key] = normalizeComparableValue(value[key], textLike);
    }
    return normalized;
  }

  return value;
}

function comparableValueForField(
  field: (typeof REPRINT_SHARED_FIELDS)[number],
  value: ComparableJson | undefined,
): ComparableJson | undefined {
  if (field === "i18n" && value && typeof value === "object" && !Array.isArray(value)) {
    const en = value.en;
    if (!en || typeof en !== "object" || Array.isArray(en))
      return normalizeComparableValue(en, true);
    return {
      name: normalizeComparableValue(en.name, true),
      version: normalizeComparableValue(en.version, true),
      text: normalizeTextShape(en.text),
    };
  }

  if (field === "rulesText" || field === "text") {
    return normalizeTextShape(value);
  }

  return normalizeComparableValue(value);
}

function stringifyComparableValue(
  field: (typeof REPRINT_SHARED_FIELDS)[number],
  value: ComparableJson | undefined,
): string {
  const normalized = comparableValueForField(field, value);
  return normalized === undefined ? "<undefined>" : JSON.stringify(sortKeysDeep(normalized));
}

function summarizeComparableValue(
  field: (typeof REPRINT_SHARED_FIELDS)[number],
  value: ComparableJson | undefined,
): string {
  const serialized = stringifyComparableValue(field, value);
  return serialized.length > 240 ? `${serialized.slice(0, 237)}...` : serialized;
}

/**
 * Build auxiliary KV maps from canonical cards and printing metadata
 */
function buildAuxKv(
  canonicalCards: Record<string, CanonicalCard>,
  printingMetadata: Record<string, CardPrintingMetadata>,
  ravensburgerData: RavensburgerInputJson,
): CardsAuxKv {
  const canonicalIdByShortId: Record<string, string> = {};
  const representativeShortIdByCanonicalId: Record<string, string> = {};
  const printingIdToShortId: Record<string, string> = {};
  const printingIdsByCanonicalId: Record<string, string[]> = {};
  const baseReprintIdsByCanonicalId: Record<string, string[]> = {};
  const localizationShortIdByCultureInvariantId: Record<string, string> = {};

  // Build maps from canonical cards
  for (const [printingId, card] of Object.entries(canonicalCards)) {
    const shortId = card.id;
    const canonicalId = card.canonicalId;

    // canonicalIdByShortId
    if (!canonicalIdByShortId[shortId]) {
      canonicalIdByShortId[shortId] = canonicalId;
    }

    // printingIdToShortId
    printingIdToShortId[printingId] = shortId;

    // printingIdsByCanonicalId
    if (!printingIdsByCanonicalId[canonicalId]) {
      printingIdsByCanonicalId[canonicalId] = [];
    }
    printingIdsByCanonicalId[canonicalId].push(printingId);

    // representativeShortIdByCanonicalId (first occurrence wins)
    if (!representativeShortIdByCanonicalId[canonicalId]) {
      representativeShortIdByCanonicalId[canonicalId] = shortId;
    }
  }

  // Sort printing IDs in each list
  for (const canonicalId of Object.keys(printingIdsByCanonicalId)) {
    printingIdsByCanonicalId[canonicalId] = sortPrintingIds(printingIdsByCanonicalId[canonicalId]);
  }

  // Build baseReprintIdsByCanonicalId (exclude special rarities)
  for (const [canonicalId, printingIds] of Object.entries(printingIdsByCanonicalId)) {
    const baseIds = printingIds.filter((pid) => {
      const meta = printingMetadata[pid];
      if (!meta) return true; // Keep if no metadata (shouldn't happen)
      return !meta.specialRarity;
    });
    if (baseIds.length > 0) {
      baseReprintIdsByCanonicalId[canonicalId] = baseIds;
    }
  }

  // Build localizationShortIdByCultureInvariantId from Ravensburger EN input
  const inputCards = getAllInputCards(ravensburgerData);
  const cultureIdMap = new Map<number, string>(); // culture_invariant_id -> shortId

  // First pass: collect culture_invariant_id -> printingId mappings
  const printingIdByCultureId = new Map<number, string>();
  for (const card of inputCards) {
    if (card.culture_invariant_id != null) {
      // Find printing ID for this card
      const fullName = card.subtitle ? `${card.name} - ${card.subtitle}` : card.name;
      const matchingPrinting = Object.entries(canonicalCards).find(([, cc]) => {
        const ccFullName = cc.version ? `${cc.name} - ${cc.version}` : cc.name;
        return ccFullName.toLowerCase() === fullName.toLowerCase();
      });

      if (matchingPrinting) {
        const [printingId] = matchingPrinting;
        const existing = printingIdByCultureId.get(card.culture_invariant_id);
        if (!existing) {
          printingIdByCultureId.set(card.culture_invariant_id, printingId);
        }
      }
    }
  }

  // Second pass: map culture_invariant_id -> shortId via printingId
  for (const [cultureId, printingId] of printingIdByCultureId) {
    const shortId = printingIdToShortId[printingId];
    if (shortId) {
      localizationShortIdByCultureInvariantId[cultureId.toString()] = shortId;
    }
  }

  return {
    canonicalIdByShortId,
    representativeShortIdByCanonicalId,
    printingIdToShortId,
    printingIdsByCanonicalId,
    baseReprintIdsByCanonicalId,
    localizationShortIdByCultureInvariantId,
  };
}

/**
 * Validate IDs section
 */
function validateIds(
  canonicalCards: Record<string, CanonicalCard>,
  auxKv: CardsAuxKv,
): ValidationSection {
  const errors: string[] = [];
  const warnings: string[] = [];
  const counts: Record<string, number> = { totalCards: Object.keys(canonicalCards).length };

  const seenShortIds = new Map<string, string[]>();

  for (const [printingId, card] of Object.entries(canonicalCards)) {
    // Validate short ID format
    if (!isValidShortId(card.id)) {
      errors.push(`Invalid shortId format: "${card.id}" for printing ${printingId}`);
    }

    // Track duplicates
    const list = seenShortIds.get(card.id) ?? [];
    list.push(printingId);
    seenShortIds.set(card.id, list);
  }

  // Check for duplicate short IDs across different cards
  for (const [shortId, printingIds] of seenShortIds) {
    if (printingIds.length > 1) {
      // Check if they're actually different cards or just different printings of same card
      const canonicalIds = new Set(printingIds.map((pid) => canonicalCards[pid]?.canonicalId));
      if (canonicalIds.size > 1) {
        errors.push(
          `Duplicate shortId "${shortId}" across different cards: ${printingIds.join(", ")}`,
        );
      }
    }
  }

  // Check aux KV consistency
  for (const [printingId, card] of Object.entries(canonicalCards)) {
    const mappedShortId = auxKv.printingIdToShortId[printingId];
    if (mappedShortId !== card.id) {
      errors.push(
        `printingIdToShortId mismatch for ${printingId}: expected ${card.id}, got ${mappedShortId}`,
      );
    }

    const mappedCanonicalId = auxKv.canonicalIdByShortId[card.id];
    if (mappedCanonicalId !== card.canonicalId) {
      errors.push(
        `canonicalIdByShortId mismatch for ${card.id}: expected ${card.canonicalId}, got ${mappedCanonicalId}`,
      );
    }
  }

  counts.uniqueShortIds = Object.keys(auxKv.canonicalIdByShortId).length;
  counts.uniquePrintingIds = Object.keys(auxKv.printingIdToShortId).length;

  return {
    status: errors.length === 0 ? "pass" : "fail",
    errors,
    warnings,
    counts,
  };
}

/**
 * Validate canonicalIds section
 */
function validateCanonicalIds(canonicalCards: Record<string, CanonicalCard>): ValidationSection {
  const errors: string[] = [];
  const warnings: string[] = [];
  const counts: Record<string, number> = {};

  const byCanonicalId = new Map<string, Array<{ printingId: string; fullName: string }>>();

  for (const [printingId, card] of Object.entries(canonicalCards)) {
    // Validate canonicalId format
    if (!isValidCanonicalId(card.canonicalId)) {
      errors.push(
        `Invalid canonicalId format for ${printingId}: "${card.canonicalId}" (must start with ci_)`,
      );
    }

    const fullName = card.version ? `${card.name} - ${card.version}` : card.name;
    const entry = { printingId, fullName };
    const list = byCanonicalId.get(card.canonicalId) ?? [];
    list.push(entry);
    byCanonicalId.set(card.canonicalId, list);
  }

  // Check that cards with same canonicalId have same full name
  for (const [canonicalId, entries] of byCanonicalId) {
    const distinctNames = new Set(entries.map((e) => e.fullName.toLowerCase()));
    if (distinctNames.size > 1) {
      const names = [...distinctNames].join(" | ");
      const details = entries.map((e) => `${e.printingId}: "${e.fullName}"`).join("; ");
      errors.push(
        `Canonical ID ${canonicalId} has cards with different names: ${names}. Cards: ${details}`,
      );
    }
  }

  counts.uniqueCanonicalIds = byCanonicalId.size;
  counts.cardsWithCanonicalId = Object.keys(canonicalCards).length;

  return {
    status: errors.length === 0 ? "pass" : "fail",
    errors,
    warnings,
    counts,
  };
}

/**
 * Validate reprints section
 */
function validateReprints(
  auxKv: CardsAuxKv,
  printingMetadata: Record<string, CardPrintingMetadata>,
): ValidationSection {
  const errors: string[] = [];
  const warnings: string[] = [];
  const counts: Record<string, number> = {};

  let totalReprintGroups = 0;
  let totalReprints = 0;
  let totalBaseReprints = 0;

  for (const [canonicalId, printingIds] of Object.entries(auxKv.printingIdsByCanonicalId)) {
    if (printingIds.length > 1) {
      totalReprintGroups++;
      totalReprints += printingIds.length;

      // Verify base reprint list excludes special rarities
      const baseIds = auxKv.baseReprintIdsByCanonicalId[canonicalId] ?? [];
      totalBaseReprints += baseIds.length;

      for (const pid of baseIds) {
        const meta = printingMetadata[pid];
        if (meta?.specialRarity) {
          errors.push(
            `baseReprintIdsByCanonicalId[${canonicalId}] includes special rarity: ${pid} (${meta.specialRarity})`,
          );
        }
      }

      // Check that all printings in group point to same canonicalId via representative
      const representativeShortId = auxKv.representativeShortIdByCanonicalId[canonicalId];
      if (!representativeShortId) {
        errors.push(`No representative shortId for canonicalId: ${canonicalId}`);
      }
    }
  }

  counts.reprintGroups = totalReprintGroups;
  counts.totalReprints = totalReprints;
  counts.totalBaseReprints = totalBaseReprints;

  return {
    status: errors.length === 0 ? "pass" : "fail",
    errors,
    warnings,
    counts,
  };
}

/**
 * Validate same-set special printings against their base printing.
 *
 * Cross-set reprints can carry official wording/template changes, so this guardrail focuses on
 * alternate art and promo drift within the same set: the bug class where a duplicated source file
 * accidentally diverges from the canonical/base gameplay payload.
 */
export function validateReprintSharedFields(
  canonicalCards: Record<string, CanonicalCard>,
  printingMetadata: Record<string, CardPrintingMetadata>,
): ValidationSection {
  const errors: string[] = [];
  const warnings: string[] = [];
  const counts: Record<string, number> = {
    reprintGroupsChecked: 0,
    reprintPrintingsCompared: 0,
    sharedFieldComparisons: 0,
  };

  const cardsByCanonicalId = new Map<string, Array<{ printingId: string; card: CanonicalCard }>>();
  for (const [printingId, card] of Object.entries(canonicalCards)) {
    const group = cardsByCanonicalId.get(card.canonicalId) ?? [];
    group.push({ printingId, card });
    cardsByCanonicalId.set(card.canonicalId, group);
  }

  for (const [canonicalId, entries] of cardsByCanonicalId) {
    if (entries.length < 2) continue;

    let groupChecked = false;
    for (const entry of entries) {
      const meta = printingMetadata[entry.printingId];
      if (!meta?.specialRarity) continue;

      const printingSet = getPrintingSet(entry.printingId);
      const representative = entries.find((candidate) => {
        const candidateMeta = printingMetadata[candidate.printingId];
        return (
          !candidateMeta?.specialRarity &&
          printingSet !== undefined &&
          getPrintingSet(candidate.printingId) === printingSet
        );
      });

      if (!representative) {
        warnings.push(
          `${canonicalId}: skipped ${entry.printingId}; no same-set base printing found`,
        );
        continue;
      }

      groupChecked = true;
      counts.reprintPrintingsCompared += 1;
      const expectedCard = representative.card as object as ComparableCard;
      const actualCard = entry.card as object as ComparableCard;

      for (const field of REPRINT_SHARED_FIELDS) {
        counts.sharedFieldComparisons += 1;
        const expected = expectedCard[field];
        const actual = actualCard[field];
        if (stringifyComparableValue(field, expected) === stringifyComparableValue(field, actual)) {
          continue;
        }

        errors.push(
          `${canonicalId}: ${representative.printingId} vs ${entry.printingId} at ${field}; expected ${summarizeComparableValue(field, expected)}, got ${summarizeComparableValue(field, actual)}`,
        );
      }
    }

    if (groupChecked) counts.reprintGroupsChecked += 1;
  }

  return {
    status: errors.length === 0 ? "pass" : "fail",
    errors,
    warnings,
    counts,
  };
}

/**
 * Validate localization section (EN culture_invariant_id coverage)
 *
 * `localizationShortIdByCultureInvariantId` stores one shortId per culture_invariant_id.
 * Reprint printings have their own shortId but share canonicalId with the row that received
 * the culture id mapping — so we validate by canonicalId coverage, not by "shortId appears
 * as a map value".
 */
function validateLocalization(
  auxKv: CardsAuxKv,
  canonicalCards: Record<string, CanonicalCard>,
): ValidationSection {
  const errors: string[] = [];
  const warnings: string[] = [];
  const counts: Record<string, number> = {};

  const totalCards = Object.keys(canonicalCards).length;
  const mappedCultureIds = Object.keys(auxKv.localizationShortIdByCultureInvariantId).length;

  const canonicalIdsWithCultureMapping = new Set<string>();
  for (const shortId of Object.values(auxKv.localizationShortIdByCultureInvariantId)) {
    const cid = auxKv.canonicalIdByShortId[shortId];
    if (cid) canonicalIdsWithCultureMapping.add(cid);
  }

  const uncoveredPrintingIds: string[] = [];
  for (const [printingId, card] of Object.entries(canonicalCards)) {
    if (!canonicalIdsWithCultureMapping.has(card.canonicalId)) {
      uncoveredPrintingIds.push(printingId);
    }
  }

  const uncoveredCanonicalIds = new Set(
    uncoveredPrintingIds.map((pid) => canonicalCards[pid]?.canonicalId).filter(Boolean),
  );

  if (uncoveredPrintingIds.length > 0) {
    warnings.push(
      `${uncoveredPrintingIds.length} printing(s) in ${uncoveredCanonicalIds.size} canonical group(s) have no EN culture_invariant_id → shortId mapping (locale embed may fail for these).`,
    );
  }

  // Check for duplicate shortId mappings (different culture IDs mapping to same shortId)
  const shortIdToCultureIds = new Map<string, string[]>();
  for (const [cultureId, shortId] of Object.entries(
    auxKv.localizationShortIdByCultureInvariantId,
  )) {
    const list = shortIdToCultureIds.get(shortId) ?? [];
    list.push(cultureId);
    shortIdToCultureIds.set(shortId, list);
  }

  for (const [shortId, cultureIds] of shortIdToCultureIds) {
    if (cultureIds.length > 1) {
      // Multiple culture_invariant_id values mapped to the same shortId — unusual; if their
      // canonicalIds ever diverged it would indicate inconsistent EN matching.
      const canonicalIds = new Set(
        cultureIds.map((cid) => {
          const sid = auxKv.localizationShortIdByCultureInvariantId[cid];
          return auxKv.canonicalIdByShortId[sid];
        }),
      );
      if (canonicalIds.size > 1) {
        warnings.push(
          `ShortId ${shortId} has multiple culture_invariant_id mappings with different canonicalIds: ${cultureIds.join(", ")}`,
        );
      }
    }
  }

  counts.totalCards = totalCards;
  counts.mappedCultureIds = mappedCultureIds;
  counts.canonicalIdsWithCultureMapping = canonicalIdsWithCultureMapping.size;
  counts.printingsWithoutLocalizationCultureMapping = uncoveredPrintingIds.length;
  counts.canonicalIdsWithoutLocalizationCultureMapping = uncoveredCanonicalIds.size;

  return {
    status: errors.length === 0 ? "pass" : "fail",
    errors,
    warnings,
    counts,
  };
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("🔄 Generating card auxiliary files...\n");

  // Load input data
  console.log("📂 Loading input files...");
  const canonicalCards = loadCanonicalCards();
  const printingMetadata = loadPrintingMetadata();
  const ravensburgerData = loadRavensburgerEn();
  console.log(`  ✅ ${Object.keys(canonicalCards).length} canonical cards`);
  console.log(`  ✅ ${Object.keys(printingMetadata).length} printing metadata entries`);

  // Build auxiliary KV
  console.log("\n🔧 Building auxiliary KV maps...");
  const auxKv = buildAuxKv(canonicalCards, printingMetadata, ravensburgerData);
  console.log(
    `  ✅ ${Object.keys(auxKv.canonicalIdByShortId).length} shortId → canonicalId mappings`,
  );
  console.log(
    `  ✅ ${Object.keys(auxKv.printingIdToShortId).length} printingId → shortId mappings`,
  );
  console.log(
    `  ✅ ${Object.keys(auxKv.localizationShortIdByCultureInvariantId).length} culture_invariant_id mappings`,
  );

  // Run validations
  console.log("\n✓ Running validations...");

  const idsValidation = validateIds(canonicalCards, auxKv);
  console.log(`  ${idsValidation.status === "pass" ? "✅" : "❌"} IDs validation`);
  if (idsValidation.errors.length > 0) {
    for (const error of idsValidation.errors.slice(0, 5)) {
      console.log(`     ❌ ${error}`);
    }
    if (idsValidation.errors.length > 5) {
      console.log(`     ... and ${idsValidation.errors.length - 5} more errors`);
    }
  }

  const canonicalValidation = validateCanonicalIds(canonicalCards);
  console.log(`  ${canonicalValidation.status === "pass" ? "✅" : "❌"} Canonical IDs validation`);
  if (canonicalValidation.errors.length > 0) {
    for (const error of canonicalValidation.errors.slice(0, 5)) {
      console.log(`     ❌ ${error}`);
    }
    if (canonicalValidation.errors.length > 5) {
      console.log(`     ... and ${canonicalValidation.errors.length - 5} more errors`);
    }
  }

  const reprintsValidation = validateReprints(auxKv, printingMetadata);
  console.log(`  ${reprintsValidation.status === "pass" ? "✅" : "❌"} Reprints validation`);

  const reprintSharedFieldsValidation = validateReprintSharedFields(
    canonicalCards,
    printingMetadata,
  );
  console.log(
    `  ${reprintSharedFieldsValidation.status === "pass" ? "✅" : "❌"} Reprint shared fields validation`,
  );
  if (reprintSharedFieldsValidation.errors.length > 0) {
    for (const error of reprintSharedFieldsValidation.errors.slice(0, 5)) {
      console.log(`     ❌ ${error}`);
    }
    if (reprintSharedFieldsValidation.errors.length > 5) {
      console.log(`     ... and ${reprintSharedFieldsValidation.errors.length - 5} more errors`);
    }
  }

  const localizationValidation = validateLocalization(auxKv, canonicalCards);
  console.log(
    `  ${localizationValidation.status === "pass" ? "✅" : "❌"} Localization validation`,
  );
  if (localizationValidation.warnings.length > 0) {
    for (const warning of localizationValidation.warnings.slice(0, 3)) {
      console.log(`     ⚠️ ${warning}`);
    }
  }

  // Build validation report
  const report: CardsAuxValidationReport = {
    ids: idsValidation,
    canonicalIds: canonicalValidation,
    reprints: reprintsValidation,
    reprintSharedFields: reprintSharedFieldsValidation,
    localization: localizationValidation,
  };

  // Write output files
  console.log("\n📝 Writing auxiliary files...");
  writeJson(AUX_KV_PATH, auxKv);
  console.log(`  ✅ cards.aux.kv.json`);
  writeJson(VALIDATION_REPORT_PATH, report);
  console.log(`  ✅ cards.aux.validation-report.json`);

  // Summary
  console.log("\n📊 Summary:");
  console.log(
    `  Unique canonicalIds: ${Object.keys(auxKv.representativeShortIdByCanonicalId).length}`,
  );
  console.log(`  Unique shortIds: ${Object.keys(auxKv.canonicalIdByShortId).length}`);
  console.log(`  Total printing mappings: ${Object.keys(auxKv.printingIdToShortId).length}`);

  // Exit with error if any validation failed
  const hasErrors =
    idsValidation.status === "fail" ||
    canonicalValidation.status === "fail" ||
    reprintsValidation.status === "fail" ||
    reprintSharedFieldsValidation.status === "fail" ||
    localizationValidation.status === "fail";

  if (hasErrors) {
    console.log("\n❌ Validation failed!");
    process.exit(1);
  }

  console.log("\n🎉 Auxiliary file generation complete!");
}

// Run the script
if (import.meta.main) {
  main().catch((err) => {
    console.error("❌ Error generating auxiliary files:", err);
    process.exit(1);
  });
}
