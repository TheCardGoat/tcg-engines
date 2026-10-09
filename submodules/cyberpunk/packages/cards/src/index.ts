import type { CardDefinition, RawCardRecord, StructuredCardDefinition } from "@tcg/cyberpunk-types";

export { cards, rawCards } from "./generated.ts";
export { CYBERPUNK_STARTER_DECK_SOURCE_URL, deckLists, starterDeckLists } from "./decks/index.ts";
// Canonical card definitions — one authored file per slug under
// `src/cards/<type>/`, plus the per-type arrays and the assembled
// `structuredCards` pool. See the generated `src/cards/index.ts`.
export * from "./cards/index.ts";

import { rawCards } from "./generated.ts";
import { structuredCards } from "./cards/index.ts";
import { getMergedCyberpunkCards, setPriority } from "./merged.ts";
import {
  collectCardRulings,
  localizeCardRuling,
  type CyberpunkRulingLocale,
  type LocalizedCardRuling,
} from "./rulings.ts";

export {
  CYBERPUNK_RULING_LOCALES,
  isCyberpunkRulingLocale,
  localizeCardRuling,
  type CyberpunkRulingLocale,
  type LocalizedCardRuling,
} from "./rulings.ts";

/**
 * Resolve a slug to its CANONICAL runtime card.
 *
 * The raw generated pool can carry the same slug twice — e.g. a
 * `cyberpunk:<slug>` spoiler row and a later `cb-<slug>` retail row for the
 * same printed card. A first-match scan would silently return whichever entry
 * was scraped first (the spoiler text/printings) instead of the canonical card
 * every merged consumer (engine catalog, deck identity, platform catalog)
 * resolves to. The merged pool is slug-unique by construction
 * (`mergeDuplicateCards` pass 2), so this lookup can never be shadowed.
 */
export function getCardBySlug(slug: string): CardDefinition | undefined {
  return getMergedCyberpunkCards().find((card) => card.slug === slug);
}

/**
 * Resolve a slug to the RAW generated record of its CANONICAL card.
 *
 * Same shadowing hazard as {@link getCardBySlug}: several raw sets can share a
 * slug, and the canonical (highest-priority set, ties by id — the same ordering
 * `pickCanonicalAndMergePrintings` applies) must win over scrape order. Falls
 * back to the highest-priority match only for slugs the merged pool does not
 * carry.
 */
export function getRawCardBySlug(slug: string): RawCardRecord | undefined {
  const matches = rawCards.filter((card) => card.slug === slug);
  if (matches.length <= 1) return matches[0];
  const canonical = getMergedCyberpunkCards().find((card) => card.slug === slug);
  const ordered = matches.toSorted(
    (a, b) => setPriority(b.set.code) - setPriority(a.set.code) || a.id.localeCompare(b.id),
  );
  // A merged canonical can intentionally preserve an older source id while
  // adopting the released set's rules and printings. Match its canonical set
  // before considering the legacy id so spoiler rows cannot shadow retail.
  return ordered.find((card) => card.set.code === canonical?.set.code) ?? ordered[0];
}

/** Keep canonical card FAQs and print-specific rulings from every source row. */
export function getCardRulingsBySlug(
  slug: string,
  locale: CyberpunkRulingLocale = "en",
): LocalizedCardRuling[] {
  const canonical = getRawCardBySlug(slug);
  if (!canonical) return [];

  return collectCardRulings(rawCards, canonical).map((ruling) =>
    localizeCardRuling(ruling, locale),
  );
}

export function getStructuredCardBySlug(slug: string): StructuredCardDefinition | undefined {
  return structuredCards.find((card) => card.slug === slug);
}

// Cross-set card merge — single source of truth shared with the platform card
// catalog and the deck-save validator so canonical selection + printing sets
// cannot drift. See `src/merged.ts`.
export {
  CYBERPUNK_PACK_COMMON_SLOTS,
  CYBERPUNK_PACK_RARE_SLOTS,
  CYBERPUNK_PACK_UNCOMMON_SLOTS,
  CYBERPUNK_RETAIL_PACK_SET,
  CYBERPUNK_SIX_PACK_COUNT,
  createCyberpunkPackSimulator,
} from "./pack-simulator/index.ts";

export {
  getMergedCyberpunkCards,
  getMergedCyberpunkCardsById,
  legacyAccentMangledSlugAliases,
  mergeDuplicateCards,
  pickCanonicalAndMergePrintings,
  RUNTIME_SET_CODES,
  setPriority,
  SET_PRIORITY,
  type MergeableCard,
  type MergeablePrinting,
} from "./merged.ts";

// Atelier (alt-art acquisition/rental) data projection for the platform
// deckbuilder + atelier backend. See `src/atelier.ts`.
export {
  CYBERPUNK_RARITY_TO_CODE,
  CYBERPUNK_LEGACY_ART_ID_TO_ART_ID,
  CYBERPUNK_LEGACY_ART_ID_TO_CANONICAL_ID,
  cyberpunkPrintingEffectiveRarityCode,
  cyberpunkRarityCode,
  defaultCyberpunkPrintingId,
  getCyberpunkArtIdForPrinting,
  getCyberpunkCanonicalForCardId,
  getCyberpunkCardDisplay,
  getCyberpunkFreeArtIdsForCanonical,
  getCyberpunkPrintingImageUrl,
  getCyberpunkPrintingInfo,
  getCyberpunkPrintingInfosForCanonical,
  isCyberpunkAlternateArtId,
  isCyberpunkAlternateArtPrinting,
  isCyberpunkPrintingOfCanonical,
  type CyberpunkPrintingInfo,
  type CyberpunkRarityCode,
} from "./atelier.ts";

export { cardBundle, createCardCatalog, type CardCatalog, BUNDLE_DSL_VERSION } from "./bundle.ts";
export {
  CYBERPUNK_CARDS_RUNTIME,
  type CyberpunkCardsRuntimeFingerprint,
} from "./runtime-fingerprint.ts";

// Re-export the version contract from `@tcg/cyberpunk-types` for convenience —
// external consumers can do everything they need with one import:
//   import { cardBundle, BUNDLE_DSL_VERSION, assertCompatibleDsl } from "@tcg/cyberpunk-cards";
//   assertCompatibleDsl(BUNDLE_DSL_VERSION);
export { DSL_VERSION, MIN_SUPPORTED_DSL_VERSION, assertCompatibleDsl } from "@tcg/cyberpunk-types";

// Authoring helpers — derive `timingTriggers` / `keywords` from the abilities
// array, plus the canonical gear attachment literal. See
// `packages/cards/src/define.ts` for the implementations.
export { deriveCardSurface, deriveKeywords, deriveTimingTriggers } from "./define.ts";

// Builder helpers — fluent / factory API for authoring abilities, targets,
// conditions, and effects without hand-writing the discriminated-union JSON.
export {
  AbilityBuilder,
  KeywordAbilityBuilder,
  StaticAbilityBuilder,
  TriggeredAbilityBuilder,
  condition,
  effect,
  target,
} from "./helpers/builders/index.ts";
