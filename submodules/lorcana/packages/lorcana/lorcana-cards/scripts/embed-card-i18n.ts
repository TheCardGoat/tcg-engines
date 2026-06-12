#!/usr/bin/env bun

import fs from "node:fs";
import path from "node:path";
import type { CardText, CardTextEntry, I18nProperties, Languages } from "@tcg/lorcana-types";
import { generateCardFiles } from "./generators/file-generator";
import { stripLeadingKeywords, stripTrailingKeywords } from "./utils/keyword-dictionary";
import {
  splitCardText,
  splitCardTextToEntries,
  normalizeCardTextEntries,
  cardTextEntriesToCardText,
} from "./utils/structured-card-text";
import type {
  CanonicalCard,
  CardPrinting,
  CardsAuxKv,
  LocalizationData,
  LocalizedCardData,
  SetDefinition,
} from "./types";

const DATA_DIR = path.resolve(import.meta.dir, "../src/data");
const CARDS_DIR = path.resolve(import.meta.dir, "../src/cards");
const CANONICAL_CARDS_PATH = path.join(DATA_DIR, "canonical-cards.json");
const AUX_KV_PATH = path.join(DATA_DIR, "cards.aux.kv.json");
const SETS_PATH = path.join(DATA_DIR, "sets.json");
const PRINTING_METADATA_PATH = path.join(DATA_DIR, "cards.aux.printing-metadata.json");
const NON_ENGLISH_LANGUAGES = ["de", "fr", "it"] as const;

type NonEnglishLanguage = (typeof NON_ENGLISH_LANGUAGES)[number];
type LocalizationByLanguage = Record<NonEnglishLanguage, LocalizationData>;

function loadJsonFile<T>(filePath: string): T {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required file not found: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

function writeJsonFile(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

export function buildEnglishI18nProperties(
  card: Pick<CanonicalCard, "name" | "version" | "rulesText" | "i18n">,
): I18nProperties {
  if (!card.rulesText) {
    return {
      name: card.name,
      ...(card.version ? { version: card.version } : {}),
    };
  }

  // Prefer keyword-aware parsing, but compare with existing EN text
  // to avoid regressions from splitCardText quirks (e.g. "READ A BOOK")
  const parsed = splitKeywordAwareCardText(card.rulesText, "en");
  const existing = card.i18n?.en?.text;

  // If existing structured text has same or more entries, preserve it.
  // The existing text may have been manually corrected or produced by a
  // previous parser run that handled edge cases differently.
  let text = parsed;
  if (existing && typeof existing !== "string" && typeof parsed !== "string") {
    if (existing.length >= parsed.length) {
      text = existing;
    }
  }

  return {
    name: card.name,
    ...(card.version ? { version: card.version } : {}),
    ...(text ? { text } : {}),
  };
}

/**
 * Split card text with keyword awareness for a given locale.
 *
 * Tries the generic parser first. If it produces a single entry or plain string
 * but the text starts with a known keyword, strips the keyword and re-parses.
 */
export function splitKeywordAwareCardText(text: string, locale: Languages): CardText {
  const genericResult = splitCardText(text);

  // If the generic parser produced multiple structured entries, it worked
  if (
    typeof genericResult !== "string" &&
    Array.isArray(genericResult) &&
    genericResult.length > 1
  ) {
    return genericResult;
  }

  let textToProcess = text;
  let leadingKeywords: Array<{ title: string }> = [];
  let trailingKeywords: Array<{ title: string }> = [];

  // Strip trailing keywords first
  {
    let result = stripTrailingKeywords(textToProcess, locale, 10);
    if (result.trailingKeywords.length === 0 && locale !== "en") {
      result = stripTrailingKeywords(textToProcess, "en", 10);
    }
    if (result.trailingKeywords.length > 0) {
      trailingKeywords = result.trailingKeywords;
      textToProcess = result.textBeforeTrailing;
    }
  }

  // Strip leading keywords
  {
    let result = stripLeadingKeywords(textToProcess, locale, 10);
    if (result.keywords.length === 0 && locale !== "en") {
      result = stripLeadingKeywords(textToProcess, "en", 10);
    }
    if (result.keywords.length > 0) {
      leadingKeywords = result.keywords;
      textToProcess = result.remainder;
    }
  }

  if (leadingKeywords.length === 0 && trailingKeywords.length === 0) {
    return genericResult;
  }

  const middleEntries = textToProcess
    ? normalizeCardTextEntries(splitCardTextToEntries(textToProcess))
    : [];

  const allEntries = [...leadingKeywords, ...middleEntries, ...trailingKeywords];

  // Only use the keyword-aware result if it produced more entries
  const genericCount = typeof genericResult === "string" ? 1 : genericResult.length;
  if (allEntries.length <= genericCount) {
    return genericResult;
  }

  return cardTextEntriesToCardText(allEntries);
}

/**
 * Count how many leading entries in a CardTextEntry[] are keyword-only
 * (i.e. have a title but no description).
 */
function countLeadingKeywordEntries(entries: CardTextEntry[]): number {
  let count = 0;
  for (const entry of entries) {
    if (entry.description) break;
    count++;
  }
  return count;
}

/**
 * Count how many trailing entries in a CardTextEntry[] are keyword-only.
 */
function countTrailingKeywordEntries(entries: CardTextEntry[]): number {
  let count = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i]?.description) break;
    count++;
  }
  return count;
}

/**
 * Flatten CardText to a plain string for re-parsing.
 */
function cardTextToPlainString(text: CardText): string {
  if (typeof text === "string") return text;
  return text
    .map((entry) => (entry.description ? `${entry.title} ${entry.description}` : entry.title))
    .join(" ");
}

/**
 * Build localized i18n properties using the EN text structure as a template.
 *
 * When the EN text is a structured array, we know how many leading keywords
 * to expect. We strip those locale-specific keywords from the localized text,
 * then re-parse the remainder using the generic parser.
 */
export function buildLocalizedI18nProperties(
  localized: Pick<LocalizedCardData, "name" | "version" | "text">,
  locale: Languages,
  enText?: CardText,
): I18nProperties {
  const text = splitLocalizedCardText(localized.text, locale, enText);
  return {
    name: localized.name,
    ...(localized.version ? { version: localized.version } : {}),
    ...(text ? { text } : {}),
  };
}

/**
 * Split localized card text using the EN text structure as a guide.
 *
 * Strategy:
 * 1. If EN text is a structured array with leading keyword-only entries,
 *    use the keyword dictionary to strip those keywords from the localized text.
 * 2. Parse the remainder with the generic parser.
 * 3. Combine stripped keywords + parsed remainder.
 */
export function splitLocalizedCardText(
  localizedText: CardText,
  locale: Languages,
  enText?: CardText,
): CardText {
  // If localized text is already a well-structured array, check if it needs fixing
  if (typeof localizedText !== "string" && Array.isArray(localizedText)) {
    // If EN template has more entries, the localized array is likely mis-merged
    if (enText && typeof enText !== "string" && localizedText.length < enText.length) {
      // Re-flatten and re-parse with template guidance
      const plainText = cardTextToPlainString(localizedText);
      return splitWithEnTemplate(plainText, locale, enText);
    }
    return localizedText;
  }

  // Plain string — try template-guided splitting first
  if (typeof localizedText === "string") {
    if (enText && typeof enText !== "string") {
      return splitWithEnTemplate(localizedText, locale, enText);
    }
    // No EN template, try keyword-aware splitting
    return splitKeywordAwareCardText(localizedText, locale);
  }

  return localizedText;
}

function splitWithEnTemplate(
  plainText: string,
  locale: Languages,
  enEntries: CardTextEntry[],
): CardText {
  const expectedLeading = countLeadingKeywordEntries(enEntries);
  const expectedTrailing = countTrailingKeywordEntries(enEntries);

  if (expectedLeading === 0 && expectedTrailing === 0) {
    // No keywords to strip, use generic parser
    return splitCardText(plainText);
  }

  let textToProcess = plainText;
  let leadingKeywords: Array<{ title: string }> = [];
  let trailingKeywords: Array<{ title: string }> = [];

  // Strip trailing keywords first (to avoid them interfering with remainder parsing)
  if (expectedTrailing > 0) {
    let result = stripTrailingKeywords(textToProcess, locale, expectedTrailing);
    if (result.trailingKeywords.length === 0 && locale !== "en") {
      result = stripTrailingKeywords(textToProcess, "en", expectedTrailing);
    }
    if (result.trailingKeywords.length > 0) {
      trailingKeywords = result.trailingKeywords;
      textToProcess = result.textBeforeTrailing;
    }
  }

  // Strip leading keywords
  if (expectedLeading > 0) {
    let result = stripLeadingKeywords(textToProcess, locale, expectedLeading);
    if (result.keywords.length === 0 && locale !== "en") {
      result = stripLeadingKeywords(textToProcess, "en", expectedLeading);
    }
    if (result.keywords.length > 0) {
      leadingKeywords = result.keywords;
      textToProcess = result.remainder;
    }
  }

  if (leadingKeywords.length === 0 && trailingKeywords.length === 0) {
    // Could not match any keywords, fall back to generic parser
    return splitCardText(plainText);
  }

  // Parse the middle portion with the generic parser
  const middleEntries = textToProcess
    ? normalizeCardTextEntries(splitCardTextToEntries(textToProcess))
    : [];

  const allEntries = [...leadingKeywords, ...middleEntries, ...trailingKeywords];
  return cardTextEntriesToCardText(allEntries);
}

export function cardTextToRulesText(text?: CardText): string | undefined {
  if (!text) {
    return undefined;
  }

  if (typeof text === "string") {
    return text;
  }

  const serialized = text
    .map((entry) =>
      (entry.description ? `${entry.title} ${entry.description}` : entry.title).trim(),
    )
    .filter(Boolean)
    .join(" ")
    .trim();

  return serialized || undefined;
}

export function resolveLocalizedEntry(
  card: Pick<CanonicalCard, "id" | "canonicalId" | "name" | "version">,
  auxKv: Pick<CardsAuxKv, "representativeShortIdByCanonicalId">,
  localizationData: LocalizationData,
  locale: NonEnglishLanguage,
): LocalizedCardData {
  // Always prefer the representative shortId's entry so all printings of the
  // same canonical card get identical localized text (name/version/rulesText).
  const representativeShortId = auxKv.representativeShortIdByCanonicalId[card.canonicalId];
  if (representativeShortId) {
    const representativeEntry = localizationData[representativeShortId];
    if (representativeEntry) {
      return representativeEntry;
    }
  }

  // Fall back to a direct lookup (e.g. when no representative is mapped yet).
  const directEntry = localizationData[card.id];
  if (directEntry) {
    return directEntry;
  }

  const cardLabel = card.version ? `${card.name} - ${card.version}` : card.name;
  throw new Error(
    `Missing ${locale} localization for card ${card.id} (${card.canonicalId}, ${cardLabel})`,
  );
}

export function embedI18nInCanonicalCards(
  canonicalCards: Record<string, CanonicalCard>,
  auxKv: Pick<CardsAuxKv, "representativeShortIdByCanonicalId">,
  localizationByLanguage: LocalizationByLanguage,
): Record<string, CanonicalCard> {
  const cardsWithI18n: Record<string, CanonicalCard> = {};

  for (const [printingId, card] of Object.entries(canonicalCards)) {
    const enProps = buildEnglishI18nProperties(card);
    cardsWithI18n[printingId] = {
      ...card,
      i18n: {
        en: enProps,
        de: buildLocalizedI18nProperties(
          resolveLocalizedEntry(card, auxKv, localizationByLanguage.de, "de"),
          "de",
          enProps.text,
        ),
        fr: buildLocalizedI18nProperties(
          resolveLocalizedEntry(card, auxKv, localizationByLanguage.fr, "fr"),
          "fr",
          enProps.text,
        ),
        it: buildLocalizedI18nProperties(
          resolveLocalizedEntry(card, auxKv, localizationByLanguage.it, "it"),
          "it",
          enProps.text,
        ),
      } satisfies Record<Languages, I18nProperties>,
    };
  }

  return cardsWithI18n;
}

function loadLocalizationByLanguage(): LocalizationByLanguage {
  return {
    de: loadJsonFile<LocalizationData>(path.join(DATA_DIR, "localization-de.json")),
    fr: loadJsonFile<LocalizationData>(path.join(DATA_DIR, "localization-fr.json")),
    it: loadJsonFile<LocalizationData>(path.join(DATA_DIR, "localization-it.json")),
  };
}

function main(): void {
  console.log("🌐 Embedding card i18n metadata...");

  const canonicalCards = loadJsonFile<Record<string, CanonicalCard>>(CANONICAL_CARDS_PATH);
  const auxKv = loadJsonFile<CardsAuxKv>(AUX_KV_PATH);
  const sets = loadJsonFile<Record<string, SetDefinition>>(SETS_PATH);
  const printingMetadata = loadJsonFile<Record<string, CardPrinting>>(PRINTING_METADATA_PATH);
  const localizationByLanguage = loadLocalizationByLanguage();

  const cardsWithI18n = embedI18nInCanonicalCards(canonicalCards, auxKv, localizationByLanguage);

  writeJsonFile(CANONICAL_CARDS_PATH, cardsWithI18n);
  console.log(`  ✅ Updated ${path.basename(CANONICAL_CARDS_PATH)}`);

  generateCardFiles(CARDS_DIR, cardsWithI18n, sets, printingMetadata);
}

if (import.meta.main) {
  main();
}
