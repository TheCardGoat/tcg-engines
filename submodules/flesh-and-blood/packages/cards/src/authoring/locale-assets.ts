import type { FleshAndBloodCardLocaleText } from "@tcg/flesh-and-blood-types/authoring";
import type { FleshAndBloodPrinting } from "@tcg/flesh-and-blood-types/catalog";

/**
 * Per-locale card asset URLs derived from catalog printings.
 *
 * Printings carry `locale` alongside their first-party CDN URLs, so the
 * localized asset for a card is the default usable printing whose printing
 * locale matches. Derivation lives here (not in the authored `.i18n.ts`
 * files) so URLs stay generated data: hand-authoring them per card would
 * re-create the drift the release audit guards against.
 */

export interface LocaleAssetUrls {
  imageUrl: string;
  boardImageUrl: string;
}

function usable(url: string | undefined): url is string {
  return typeof url === "string" && url !== "";
}

function languageOf(locale: string): string {
  const index = locale.indexOf("-");
  return index === -1 ? locale : locale.slice(0, index);
}

/**
 * The default printing for `locale`: the first printing whose locale matches
 * exactly and that carries a face image; falls back to a language-only match
 * (e.g. `en` → `en-US`). Catalog normalization already orders printings by
 * source quality, so first-match is deterministic.
 */
export function defaultPrintingForLocale(
  printings: readonly FleshAndBloodPrinting[],
  locale: string,
): FleshAndBloodPrinting | undefined {
  const language = languageOf(locale);
  const matchers: readonly ((printing: FleshAndBloodPrinting) => boolean)[] = [
    (printing) => printing.locale === locale,
    (printing) => languageOf(printing.locale ?? "") === language,
  ];
  for (const matches of matchers) {
    for (const printing of printings) {
      if (matches(printing) && usable(printing.imageUrl)) return printing;
    }
  }
  return undefined;
}

/**
 * Asset URLs for one card in `locale`, or `undefined` when no matching
 * printing carries a face image.
 */
export function localeAssetUrlsForCard(
  printings: readonly FleshAndBloodPrinting[],
  locale: string,
): LocaleAssetUrls | undefined {
  const printing = defaultPrintingForLocale(printings, locale);
  if (!printing) return undefined;
  return {
    imageUrl: printing.imageUrl,
    boardImageUrl: usable(printing.boardImageUrl) ? printing.boardImageUrl : printing.imageUrl,
  };
}

/**
 * Attach derived asset URLs to a locale text record without mutating it.
 * Authored fields win if one is ever set explicitly.
 */
export function withLocaleAssets(
  text: FleshAndBloodCardLocaleText,
  assets: LocaleAssetUrls | undefined,
): FleshAndBloodCardLocaleText {
  if (!assets) return text;
  return {
    ...text,
    imageUrl: text.imageUrl ?? assets.imageUrl,
    boardImageUrl: text.boardImageUrl ?? assets.boardImageUrl,
  };
}
