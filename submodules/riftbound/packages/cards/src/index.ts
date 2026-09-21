import type {
  RiftboundCardDefinition,
  RiftboundCatalog,
  PopulatedRiftboundCatalog,
  RiftboundSetDefinition,
  RiftboundTranslationCatalog,
} from "@tcg/riftbound-types";
import { riftboundCatalog } from "./generated/riftbound-catalog.ts";
import { riftboundTranslations } from "./generated/riftbound-translations.ts";

export { riftboundCatalog, riftboundTranslations };

export const riftboundCardTranslationsByCanonicalId = new Map(
  (riftboundTranslations?.cards ?? []).map(
    (translation) => [translation.canonicalId, translation] as const,
  ),
);

export const allRiftboundCards: readonly RiftboundCardDefinition[] = riftboundCatalog?.cards ?? [];
export const allRiftboundSets: readonly RiftboundSetDefinition[] = riftboundCatalog?.sets ?? [];

export const riftboundCardsByCanonicalId: ReadonlyMap<string, RiftboundCardDefinition> = new Map(
  allRiftboundCards.map((card) => [card.canonicalId, card]),
);
export const riftboundCardsByPrintingId: ReadonlyMap<string, RiftboundCardDefinition> = new Map(
  allRiftboundCards.flatMap((card) =>
    card.printings.map((printing) => [printing.id, card] as const),
  ),
);
export const riftboundCardsBySetCollectorNumber: ReadonlyMap<string, RiftboundCardDefinition> =
  new Map(
    allRiftboundCards.flatMap((card) =>
      card.printings.map(
        (printing) =>
          [
            `${printing.setCode.toUpperCase()}:${printing.collectorNumber.toUpperCase()}`,
            card,
          ] as const,
      ),
    ),
  );
export const riftboundSetsById: ReadonlyMap<string, RiftboundSetDefinition> = new Map(
  allRiftboundSets.map((set) => [set.id, set]),
);

export interface RiftboundCatalogIndex {
  cardsByCanonicalId: ReadonlyMap<string, RiftboundCardDefinition>;
  cardsByPrintingId: ReadonlyMap<string, RiftboundCardDefinition>;
  cardsBySetCollectorNumber: ReadonlyMap<string, RiftboundCardDefinition>;
  setsById: ReadonlyMap<string, RiftboundSetDefinition>;
  getCard(id: string): RiftboundCardDefinition | undefined;
  getSet(id: string): RiftboundSetDefinition | undefined;
  search(query: string): RiftboundCardDefinition[];
}

export function createRiftboundCatalogIndex(catalog: RiftboundCatalog): RiftboundCatalogIndex {
  const cardsByCanonicalId = new Map(
    catalog.cards.map((card) => [card.canonicalId, card] as const),
  );
  const cardsByPrintingId = new Map(
    catalog.cards.flatMap((card) => card.printings.map((printing) => [printing.id, card] as const)),
  );
  const cardsBySetCollectorNumber = new Map(
    catalog.cards.flatMap((card) =>
      card.printings.map(
        (printing) =>
          [
            `${printing.setCode.toUpperCase()}:${printing.collectorNumber.toUpperCase()}`,
            card,
          ] as const,
      ),
    ),
  );
  const setsById = new Map(catalog.sets.map((set) => [set.id, set] as const));
  const search = (query: string): RiftboundCardDefinition[] => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return [...catalog.cards];
    return catalog.cards.filter((card) => {
      const printing = card.printings[0];
      const fields = [
        card.name,
        card.cardType,
        card.rulesTextPlain,
        card.effectTextPlain,
        card.flavorText,
        ...card.domains,
        ...card.tags,
        ...card.keywords,
        printing?.setCode,
        printing?.collectorNumber,
      ];
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

export function getRiftboundCard(id: string): RiftboundCardDefinition | undefined {
  return riftboundCardsByCanonicalId.get(id) ?? riftboundCardsByPrintingId.get(id);
}

export function getRiftboundSet(id: string): RiftboundSetDefinition | undefined {
  return riftboundSetsById.get(id);
}

export function searchRiftboundCards(query: string): RiftboundCardDefinition[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [...allRiftboundCards];
  return allRiftboundCards.filter((card) => {
    const printing = card.printings[0];
    const fields = [
      card.name,
      card.cardType,
      card.rulesTextPlain,
      ...(card.domains ?? []),
      ...(card.tags ?? []),
      ...(card.keywords ?? []),
      printing?.setCode,
      printing?.collectorNumber,
    ];
    return fields.some((field) => field?.toLocaleLowerCase().includes(normalized));
  });
}

export function assertProductionEligibleRiftboundCatalog(
  catalog: RiftboundCatalog = riftboundCatalog,
): asserts catalog is PopulatedRiftboundCatalog {
  if (
    !catalog.provenance ||
    catalog.provenance.source !== "riot-content-api" ||
    !catalog.provenance.productionEligible ||
    !catalog.provenance.sourceVersion ||
    !/^[a-f0-9]{64}$/.test(catalog.provenance.sha256)
  ) {
    throw new Error(
      "Riftbound production catalog is unavailable: authenticated Riot API provenance is required.",
    );
  }
  const sourceUrl = new URL(catalog.provenance.sourceUrl);
  if (
    sourceUrl.protocol !== "https:" ||
    !/^[a-z]+\.api\.riotgames\.com$/.test(sourceUrl.hostname)
  ) {
    throw new Error("Riftbound production catalog source is not an approved Riot API URL.");
  }
}

export type {
  RiftboundCardDefinition,
  RiftboundCatalog,
  RiftboundSetDefinition,
  RiftboundTranslationCatalog,
} from "@tcg/riftbound-types";
