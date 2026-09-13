/**
 * Unified deck catalog for format-legal tournament text lists.
 *
 * Every entry is a Classic Constructed or Silver Age list
 * (`deck-text-fixtures.ts`). Shared metadata (format, hero class, event,
 * origin, tags) lives on every entry so bots, practice UI, and deck-QA can
 * query one list.
 */

import { FAB_DECK_TEXT_FIXTURES } from "./deck-text-fixtures.ts";
import type {
  FabDeckCatalogEntry,
  FabDeckCatalogQuery,
  FabTournamentDeckEntry,
} from "./deck-catalog-model.ts";

export type {
  FabConstructedFormat,
  FabDeckCatalogEntry,
  FabDeckCatalogFormat,
  FabDeckCatalogQuery,
  FabDeckKind,
  FabDeckOrigin,
  FabHeroClass,
  FabTournamentDeckEntry,
} from "./deck-catalog-model.ts";
export { fabDeckTags } from "./deck-catalog-model.ts";

/** Every registered format-legal tournament text list. */
export const FAB_DECK_CATALOG: readonly FabDeckCatalogEntry[] = FAB_DECK_TEXT_FIXTURES;

export function isFabTournamentDeck(entry: FabDeckCatalogEntry): entry is FabTournamentDeckEntry {
  return entry.kind === "tournament";
}

export function getFabDeck(deckId: string): FabDeckCatalogEntry | undefined {
  return FAB_DECK_CATALOG.find((deck) => deck.id === deckId);
}

export function listFabDecks(query: FabDeckCatalogQuery = {}): readonly FabDeckCatalogEntry[] {
  return FAB_DECK_CATALOG.filter((deck) => {
    if (query.kind !== undefined && deck.kind !== query.kind) {
      return false;
    }
    if (query.format !== undefined && deck.format !== query.format) {
      return false;
    }
    if (query.playable !== undefined && deck.playable !== query.playable) {
      return false;
    }
    if (query.heroClass !== undefined && deck.heroClass !== query.heroClass) {
      return false;
    }
    if (query.event !== undefined && deck.event !== query.event) {
      return false;
    }
    if (query.tag !== undefined && !deck.tags.includes(query.tag)) {
      return false;
    }
    return true;
  });
}
