import type { GrandArchiveCardDefinition, GrandArchiveCatalog } from "@tcg/grand-archive-types";
import { grandArchiveCatalog } from "./generated/grand-archive-catalog.ts";

export { grandArchiveCatalog };

export interface GrandArchiveCatalogIndex {
  readonly cardsByCanonicalId: ReadonlyMap<string, GrandArchiveCardDefinition>;
  readonly cardsByPrintingId: ReadonlyMap<string, GrandArchiveCardDefinition>;
  readonly cardsBySlug: ReadonlyMap<string, GrandArchiveCardDefinition>;
  readonly getCard: (id: string) => GrandArchiveCardDefinition | undefined;
  readonly search: (query: string) => readonly GrandArchiveCardDefinition[];
}

export function createGrandArchiveCatalogIndex(
  catalog: GrandArchiveCatalog,
): GrandArchiveCatalogIndex {
  const cardsByCanonicalId = new Map(
    catalog.cards.map((card) => [card.canonicalId, card] as const),
  );
  const cardsByPrintingId = new Map(
    catalog.cards.flatMap((card) => card.printings.map((printing) => [printing.id, card] as const)),
  );
  const cardsBySlug = new Map(catalog.cards.map((card) => [card.slug, card] as const));
  const search = (query: string): readonly GrandArchiveCardDefinition[] => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return catalog.cards;
    return catalog.cards.filter((card) =>
      [card.name, card.effectRaw, card.types.join(" "), card.subtypes.join(" ")].some((value) =>
        value?.toLocaleLowerCase().includes(normalized),
      ),
    );
  };
  return {
    cardsByCanonicalId,
    cardsByPrintingId,
    cardsBySlug,
    getCard: (id) => cardsByCanonicalId.get(id) ?? cardsByPrintingId.get(id) ?? cardsBySlug.get(id),
    search,
  };
}

export const grandArchiveCatalogIndex = createGrandArchiveCatalogIndex(grandArchiveCatalog);
export const allGrandArchiveCards = grandArchiveCatalog.cards;
export const getGrandArchiveCard = grandArchiveCatalogIndex.getCard;
export const searchGrandArchiveCards = grandArchiveCatalogIndex.search;
