import type { CardDefinition, RawCardRecord, StructuredCardDefinition } from "@tcg/cyberpunk-types";

export { cards, rawCards } from "./generated.ts";
export { CYBERPUNK_STARTER_DECK_SOURCE_URL, deckLists, starterDeckLists } from "./decks/index.ts";
export * from "./promo/index.ts";
export * from "./PRM01/index.ts";
export * from "./boxtoppersretail/index.ts";
export * from "./theheistretailstarterdeck/index.ts";
export * from "./embracingpowerretailstarterdeck/index.ts";
export * from "./welcometonightcityretail/index.ts";

import { rawCards } from "./generated.ts";
import { prm01Cards } from "./PRM01/index.ts";
import { boxToppersRetailCards } from "./boxtoppersretail/index.ts";
import { promoCards } from "./promo/index.ts";
import { theHeistRetailStarterDeckCards } from "./theheistretailstarterdeck/index.ts";
import { embracingPowerRetailStarterDeckCards } from "./embracingpowerretailstarterdeck/index.ts";
import { welcomeToNightCityRetailCards } from "./welcometonightcityretail/index.ts";
import { getMergedCyberpunkCards, setPriority } from "./merged.ts";

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

export const structuredCards: StructuredCardDefinition[] = [
  ...promoCards,
  ...prm01Cards,
  ...boxToppersRetailCards,
  ...theHeistRetailStarterDeckCards,
  ...embracingPowerRetailStarterDeckCards,
  ...welcomeToNightCityRetailCards,
];

export function getStructuredCardBySlug(slug: string): StructuredCardDefinition | undefined {
  return structuredCards.find((card) => card.slug === slug);
}

export function getStructuredPromoCardBySlug(slug: string) {
  return promoCards.find((card) => card.slug === slug);
}

export function getStructuredPrm01CardBySlug(slug: string) {
  return prm01Cards.find((card) => card.slug === slug);
}

// Cross-set card merge — single source of truth shared with the platform card
// catalog and the deck-save validator so canonical selection + printing sets
// cannot drift. See `src/merged.ts`.
export {
  getMergedCyberpunkCards,
  getMergedCyberpunkCardsById,
  legacyAccentMangledSlugAliases,
  mergeDuplicateCards,
  pickCanonicalAndMergePrintings,
  setPriority,
  SET_PRIORITY,
  type MergeableCard,
  type MergeablePrinting,
} from "./merged.ts";

// Atelier (alt-art acquisition/rental) data projection for the platform
// deckbuilder + atelier backend. See `src/atelier.ts`.
export {
  CYBERPUNK_ALT_ART_SET_CODES,
  CYBERPUNK_RARITY_RANK,
  CYBERPUNK_RARITY_TO_CODE,
  cyberpunkPrintingEffectiveRarityCode,
  cyberpunkRarityCode,
  defaultCyberpunkPrintingId,
  getCyberpunkCanonicalForCardId,
  getCyberpunkCardDisplay,
  getCyberpunkPrintingImageUrl,
  getCyberpunkPrintingInfo,
  getCyberpunkPrintingInfosForCanonical,
  isCyberpunkAlternateArtPrinting,
  isCyberpunkPrintingOfCanonical,
  type CyberpunkPrintingInfo,
  type CyberpunkPrintingSetRef,
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
export {
  deriveCardSurface,
  deriveKeywords,
  deriveTimingTriggers,
  gearAttachmentToUnitOrLegend,
} from "./define.ts";

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
