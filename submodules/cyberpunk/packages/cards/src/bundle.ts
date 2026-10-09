import { DSL_VERSION, type StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { structuredCards } from "./cards/index.ts";
import { getMergedCyberpunkCards, getMergedCyberpunkCardsById } from "./merged.ts";

/**
 * DSL version of every card in {@link cardBundle}. External consumers should
 * pass this to `assertCompatibleDsl()` from `@tcg/cyberpunk-types` to verify
 * their engine can interpret the bundle. See the `DSL_VERSION` JSDoc for the
 * bump policy.
 */
export const BUNDLE_DSL_VERSION: number = DSL_VERSION;

/**
 * Frozen, build-time bundle: every structured card definition keyed by its
 * stable `id`. Use this for production lookups instead of scanning the array.
 */
export const cardBundle: Readonly<Record<string, StructuredCardDefinition>> = Object.freeze(
  Object.fromEntries(structuredCards.map((c) => [c.id, c])),
);

export interface CardCatalog {
  get(definitionId: string): StructuredCardDefinition | undefined;
  entries(): IterableIterator<[string, StructuredCardDefinition]>;
  size: number;
}

/**
 * Construct the canonical runtime catalog used by server and browser. Authored
 * source ids and stored canonical aliases resolve through the same merged pool.
 * The catalog is
 * lightweight; create one per session/match. Tests can extend the result by
 * wrapping it or by using the engine's `overrideDefinition` overlay.
 */
export function createCardCatalog(): CardCatalog {
  const cards = getMergedCyberpunkCards();
  const byId = getMergedCyberpunkCardsById();
  return {
    get(id) {
      return byId.get(id);
    },
    *entries() {
      for (const card of cards) yield [card.id, card];
    },
    get size() {
      return cards.length;
    },
  };
}

// Re-export the atelier data projection so consumers of the packed bundle
// (`@tcg/cyberpunk-cards`) can reach it through either entry. Authoritative
// implementation + JSDoc live in `src/atelier.ts`.
export {
  CYBERPUNK_RARITY_TO_CODE,
  CYBERPUNK_LEGACY_ART_ID_TO_ART_ID,
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
