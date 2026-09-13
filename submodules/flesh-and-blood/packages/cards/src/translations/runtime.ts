import type { FleshAndBloodCardLocaleText } from "@tcg/flesh-and-blood-types/authoring";
import type {
  FleshAndBloodCardTranslation,
  FleshAndBloodLocalizedPrintingsCatalog,
  FleshAndBloodPrinting,
  FleshAndBloodTranslationCatalog,
} from "@tcg/flesh-and-blood-types/catalog";

import { localeAssetUrlsForCard } from "../authoring/locale-assets.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertTranslationCatalog(
  value: unknown,
): asserts value is FleshAndBloodTranslationCatalog {
  if (
    !isRecord(value) ||
    value.schemaVersion !== 1 ||
    value.game !== "flesh-and-blood" ||
    typeof value.locale !== "string" ||
    typeof value.catalogSha256 !== "string" ||
    !isRecord(value.provenance) ||
    value.provenance.locale !== value.locale ||
    !Array.isArray(value.cards) ||
    !Array.isArray(value.sets)
  ) {
    throw new Error("Invalid generated FAB translation catalog.");
  }
  for (const card of value.cards) {
    if (!isRecord(card) || typeof card.canonicalId !== "string" || typeof card.name !== "string") {
      throw new Error("Invalid generated FAB card translation.");
    }
  }
}

function assertLocalizedPrintingsCatalog(
  value: unknown,
): asserts value is FleshAndBloodLocalizedPrintingsCatalog {
  if (
    !isRecord(value) ||
    value.schemaVersion !== 1 ||
    value.game !== "flesh-and-blood" ||
    typeof value.locale !== "string" ||
    typeof value.catalogSha256 !== "string" ||
    !isRecord(value.provenance) ||
    value.provenance.locale !== value.locale ||
    !isRecord(value.printingsByCanonicalId)
  ) {
    throw new Error("Invalid generated FAB localized printings catalog.");
  }
  for (const printings of Object.values(value.printingsByCanonicalId)) {
    if (!Array.isArray(printings)) {
      throw new Error("Invalid generated FAB localized printing collection.");
    }
    for (const printing of printings) {
      if (
        !isRecord(printing) ||
        typeof printing.id !== "string" ||
        printing.locale !== value.locale
      ) {
        throw new Error("Invalid generated FAB localized printing.");
      }
    }
  }
}

function languageOf(locale: string): string {
  try {
    return new Intl.Locale(locale).language;
  } catch {
    return locale.split("-")[0] ?? locale;
  }
}

function translationToLocaleText(
  translation: FleshAndBloodCardTranslation,
  printings: readonly FleshAndBloodPrinting[] = [],
  locale: string,
): FleshAndBloodCardLocaleText {
  const assets = localeAssetUrlsForCard(printings, locale);
  const text = translation.functionalTextPlain ?? translation.functionalTextHtml;
  return {
    name: translation.name,
    typeText: translation.typeText ?? "",
    ...(text ? { text } : {}),
    ...(translation.imageUrl ? { imageUrl: translation.imageUrl } : {}),
    ...(translation.boardImageUrl ? { boardImageUrl: translation.boardImageUrl } : {}),
    ...(assets ? { imageUrl: assets.imageUrl, boardImageUrl: assets.boardImageUrl } : {}),
  };
}

export interface FleshAndBloodLocalizedTranslationView {
  translations: FleshAndBloodTranslationCatalog;
  printingsByCanonicalId: ReadonlyMap<string, readonly FleshAndBloodPrinting[]>;
  cardLocaleTextByCanonicalId: ReadonlyMap<string, FleshAndBloodCardLocaleText>;
  getCardLocaleText(
    canonicalId: string,
    requestedLocale?: string,
  ): FleshAndBloodCardLocaleText | undefined;
}

export function createFleshAndBloodLocalizedTranslationView(options: {
  translationsJson: unknown;
  printingsJson: unknown;
  englishByCanonicalId: ReadonlyMap<string, FleshAndBloodCardTranslation>;
}): FleshAndBloodLocalizedTranslationView {
  assertTranslationCatalog(options.translationsJson);
  assertLocalizedPrintingsCatalog(options.printingsJson);
  const translations = options.translationsJson;
  const localizedPrintings = options.printingsJson;
  if (
    localizedPrintings.locale !== translations.locale ||
    localizedPrintings.catalogSha256 !== translations.catalogSha256 ||
    localizedPrintings.provenance.sourceVersion !== translations.provenance?.sourceVersion
  ) {
    throw new Error("FAB localized text and printing catalogs are from different revisions.");
  }
  const printingsByCanonicalId = new Map(Object.entries(localizedPrintings.printingsByCanonicalId));
  const cardLocaleTextByCanonicalId = new Map(
    translations.cards.map((translation) => [
      translation.canonicalId,
      translationToLocaleText(
        translation,
        printingsByCanonicalId.get(translation.canonicalId),
        translations.locale,
      ),
    ]),
  );
  return {
    translations,
    printingsByCanonicalId,
    cardLocaleTextByCanonicalId,
    getCardLocaleText(canonicalId, requestedLocale = translations.locale) {
      if (languageOf(requestedLocale) === languageOf(translations.locale)) {
        const localized = cardLocaleTextByCanonicalId.get(canonicalId);
        if (localized) return localized;
      }
      const english = options.englishByCanonicalId.get(canonicalId);
      return english ? translationToLocaleText(english, [], "en-US") : undefined;
    },
  };
}
