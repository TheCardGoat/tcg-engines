import type {
  FleshAndBloodCatalogCard,
  FleshAndBloodCatalog,
  FleshAndBloodSetDefinition,
} from "@tcg/flesh-and-blood-types/catalog";
import { FAB_DOUBLE_FACED_CARD_SPECS } from "./authoring/reviewed-card-layouts.ts";

export { FAB_DOUBLE_FACED_BACK_CANONICAL_IDS } from "./authoring/reviewed-card-layouts.ts";

import { fleshAndBloodCatalog } from "./generated/flesh-and-blood-catalog.ts";
import { createCatalogIdentityProjection } from "./catalog-identity-projection.ts";
import { defaultTranslationsFromCatalog } from "./default-translations.ts";

export { fleshAndBloodStructuredCardsByCanonicalId } from "./cards/index.ts";

export { fabDefaultPrintingId } from "./cdn.ts";

export { fleshAndBloodCatalog };

export const fleshAndBloodTranslations = defaultTranslationsFromCatalog(fleshAndBloodCatalog);

export const fleshAndBloodCardTranslationsByCanonicalId = new Map(
  (fleshAndBloodTranslations?.cards ?? []).map(
    (translation) => [translation.canonicalId, translation] as const,
  ),
);

const catalogIdentityProjection = createCatalogIdentityProjection(
  fleshAndBloodCatalog?.cards ?? [],
  FAB_DOUBLE_FACED_CARD_SPECS,
);
export const allFleshAndBloodCards: readonly FleshAndBloodCatalogCard[] =
  catalogIdentityProjection.physicalCards;
export const allFleshAndBloodSets: readonly FleshAndBloodSetDefinition[] =
  fleshAndBloodCatalog?.sets ?? [];

export const fleshAndBloodCardsByCanonicalId: ReadonlyMap<string, FleshAndBloodCatalogCard> =
  catalogIdentityProjection.cardsByCanonicalId;
export const fleshAndBloodCardsByPrintingId: ReadonlyMap<string, FleshAndBloodCatalogCard> =
  catalogIdentityProjection.cardsByPrintingId;
function appendToSetCollectorMap(
  map: Map<string, FleshAndBloodCatalogCard[]>,
  key: string,
  card: FleshAndBloodCatalogCard,
): void {
  const existing = map.get(key);
  if (existing) {
    existing.push(card);
  } else {
    map.set(key, [card]);
  }
}

export const fleshAndBloodCardsBySetCollectorNumber: ReadonlyMap<
  string,
  readonly FleshAndBloodCatalogCard[]
> = allFleshAndBloodCards.reduce((map, card) => {
  for (const printing of card.printings) {
    const key = `${printing.setCode.toUpperCase()}:${printing.collectorNumber.toUpperCase()}`;
    appendToSetCollectorMap(map, key, card);
  }
  return map;
}, new Map<string, FleshAndBloodCatalogCard[]>());
export const fleshAndBloodSetsById: ReadonlyMap<string, FleshAndBloodSetDefinition> = new Map(
  allFleshAndBloodSets.map((set) => [set.id, set] as const),
);

export interface FleshAndBloodCatalogIndex {
  cardsByCanonicalId: ReadonlyMap<string, FleshAndBloodCatalogCard>;
  cardsByPrintingId: ReadonlyMap<string, FleshAndBloodCatalogCard>;
  cardsBySetCollectorNumber: ReadonlyMap<string, readonly FleshAndBloodCatalogCard[]>;
  setsById: ReadonlyMap<string, FleshAndBloodSetDefinition>;
  getCard(id: string): FleshAndBloodCatalogCard | undefined;
  getSet(id: string): FleshAndBloodSetDefinition | undefined;
  search(query: string): FleshAndBloodCatalogCard[];
}

export function createFleshAndBloodCatalogIndex(
  catalog: FleshAndBloodCatalog,
): FleshAndBloodCatalogIndex {
  const cardsByCanonicalId = new Map(
    catalog.cards.map((card) => [card.canonicalId, card] as const),
  );
  const cardsByPrintingId = new Map(
    catalog.cards.flatMap((card) => card.printings.map((printing) => [printing.id, card] as const)),
  );
  const cardsBySetCollectorNumber = catalog.cards.reduce((map, card) => {
    for (const printing of card.printings) {
      const key = `${printing.setCode.toUpperCase()}:${printing.collectorNumber.toUpperCase()}`;
      appendToSetCollectorMap(map, key, card);
    }
    return map;
  }, new Map<string, FleshAndBloodCatalogCard[]>());
  const setsById = new Map(catalog.sets.map((set) => [set.id, set] as const));
  const search = (query: string): FleshAndBloodCatalogCard[] => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return [...catalog.cards];
    return catalog.cards.filter((card) => {
      const printingFields = card.printings.flatMap((printing) => [
        printing.setCode,
        printing.collectorNumber,
      ]);
      const fields = [card.name, card.typeText, card.functionalTextPlain, ...printingFields];
      return fields.some((field) => field?.toLocaleLowerCase().includes(normalized));
    });
  };
  return {
    cardsByCanonicalId,
    cardsByPrintingId,
    cardsBySetCollectorNumber,
    setsById,
    getCard: (id) => cardsByCanonicalId.get(id) ?? cardsByPrintingId.get(id),
    getSet: (id) => setsById.get(id),
    search,
  };
}

export function getFleshAndBloodCard(id: string): FleshAndBloodCatalogCard | undefined {
  return fleshAndBloodCardsByCanonicalId.get(id) ?? fleshAndBloodCardsByPrintingId.get(id);
}

export function getFleshAndBloodSet(id: string): FleshAndBloodSetDefinition | undefined {
  return fleshAndBloodSetsById.get(id);
}

export function searchFleshAndBloodCards(query: string): FleshAndBloodCatalogCard[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [...allFleshAndBloodCards];
  return allFleshAndBloodCards.filter((card) => {
    const printingFields = card.printings.flatMap((printing) => [
      printing.setCode,
      printing.collectorNumber,
    ]);
    const fields = [card.name, card.typeText, card.functionalTextPlain, ...printingFields];
    return fields.some((field) => field?.toLocaleLowerCase().includes(normalized));
  });
}

export type {
  FleshAndBloodCatalogCard,
  FleshAndBloodCatalog,
  FleshAndBloodSetDefinition,
  FleshAndBloodTranslationCatalog,
} from "@tcg/flesh-and-blood-types/catalog";
