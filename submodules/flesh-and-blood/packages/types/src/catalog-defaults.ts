import type {
  FleshAndBloodCatalogCard,
  FleshAndBloodCardData,
  FleshAndBloodCatalog,
  FleshAndBloodFormatLegality,
  FleshAndBloodLegality,
  FleshAndBloodPrinting,
  PopulatedFleshAndBloodCatalog,
  PopulatedFleshAndBloodCardDataCatalog,
} from "./catalog.ts";
import type { FabSupertypeSets, FabTypeBoxToken } from "./base-object-properties.ts";

/**
 * Generator input retained in the source artifact only. Public catalog cards
 * are projected from this record and never expose executable identity fields.
 */
export interface FleshAndBloodCatalogSourceFields {
  readonly color?: string;
  readonly pitch?: string;
  readonly cost?: number;
  readonly power?: number;
  readonly defense?: number;
  readonly health?: number;
  readonly intelligence?: number;
  readonly arcane?: number;
  readonly types: readonly FabTypeBoxToken[];
  readonly supertypeSets?: FabSupertypeSets;
  readonly traits: readonly string[];
  readonly cardKeywords: readonly string[];
  readonly abilitiesAndEffects: readonly string[];
  readonly abilityAndEffectKeywords: readonly string[];
  readonly grantedKeywords: readonly string[];
  readonly removedKeywords: readonly string[];
  readonly interactsWithKeywords: readonly string[];
}

export type FleshAndBloodCatalogSourceCard = FleshAndBloodCatalogCard &
  FleshAndBloodCatalogSourceFields;
export type FleshAndBloodCatalogSourceCardData = Omit<FleshAndBloodCatalogSourceCard, "printings">;

export type FleshAndBloodCatalogSource = Omit<FleshAndBloodCatalog, "cards"> & {
  readonly cards: readonly FleshAndBloodCatalogSourceCard[];
};

export type PopulatedFleshAndBloodCatalogSource = FleshAndBloodCatalogSource & {
  readonly provenance: NonNullable<FleshAndBloodCatalogSource["provenance"]>;
};

export type SparseFleshAndBloodFormatLegality = Partial<FleshAndBloodFormatLegality>;
export type SparseFleshAndBloodLegality = Partial<
  Record<keyof FleshAndBloodLegality, SparseFleshAndBloodFormatLegality>
>;

export type SparseFleshAndBloodPrinting = Omit<
  FleshAndBloodPrinting,
  "artVariationIds" | "imageRotationDegrees" | "edition"
> & {
  artVariationIds?: readonly string[];
  imageRotationDegrees?: number;
  edition?: string;
};

type SparseCardDefaults = "playedHorizontally" | "legalities" | "printings";

export type SparseFleshAndBloodCatalogCard = Omit<
  FleshAndBloodCatalogSourceCard,
  SparseCardDefaults | keyof FleshAndBloodCatalogSourceFields
> &
  Partial<FleshAndBloodCatalogSourceFields> & {
    traits?: readonly string[];
    abilitiesAndEffects?: readonly string[];
    abilityAndEffectKeywords?: readonly string[];
    grantedKeywords?: readonly string[];
    removedKeywords?: readonly string[];
    interactsWithKeywords?: readonly string[];
    playedHorizontally?: boolean;
    legalities?: SparseFleshAndBloodLegality;
    printings: readonly SparseFleshAndBloodPrinting[];
  };

export type SparseFleshAndBloodCatalog = Omit<FleshAndBloodCatalog, "cards"> & {
  cards: readonly SparseFleshAndBloodCatalogCard[];
};

export type SparseFleshAndBloodCardData = Omit<SparseFleshAndBloodCatalogCard, "printings">;

export type SparseFleshAndBloodCardDataCatalog = Omit<FleshAndBloodCatalog, "cards"> & {
  cards: readonly SparseFleshAndBloodCardData[];
};

export interface SparseFleshAndBloodPrintingsCatalog {
  schemaVersion: 1;
  game: "flesh-and-blood";
  catalogSha256: string;
  printingsByCanonicalId: Readonly<Record<string, readonly SparseFleshAndBloodPrinting[]>>;
}

const DEFAULT_FORMAT_LEGALITY: FleshAndBloodFormatLegality = {
  legal: true,
  banned: false,
  suspended: false,
  livingLegend: false,
  restricted: false,
};

function hydrateFormatLegality(
  legality: SparseFleshAndBloodFormatLegality | undefined,
): FleshAndBloodFormatLegality {
  return { ...DEFAULT_FORMAT_LEGALITY, ...legality };
}

function hydrateFleshAndBloodCardData(card: SparseFleshAndBloodCardData): FleshAndBloodCardData {
  return {
    canonicalId: card.canonicalId,
    slug: card.slug,
    name: card.name,
    ...(card.externalIds ? { externalIds: card.externalIds } : {}),
    ...(card.functionalTextHtml ? { functionalTextHtml: card.functionalTextHtml } : {}),
    ...(card.functionalTextPlain ? { functionalTextPlain: card.functionalTextPlain } : {}),
    typeText: card.typeText,
    playedHorizontally: card.playedHorizontally ?? false,
    legalities: {
      blitz: hydrateFormatLegality(card.legalities?.blitz),
      cc: hydrateFormatLegality(card.legalities?.cc),
      commoner: hydrateFormatLegality(card.legalities?.commoner),
      ll: hydrateFormatLegality(card.legalities?.ll),
      silverAge: hydrateFormatLegality(card.legalities?.silverAge),
    },
    ...(card.cardsReferencedBy ? { cardsReferencedBy: card.cardsReferencedBy } : {}),
  };
}

function hydrateFleshAndBloodSourceCardData(
  card: SparseFleshAndBloodCardData,
): FleshAndBloodCatalogSourceCardData {
  return {
    ...card,
    types: card.types ?? [],
    traits: card.traits ?? [],
    cardKeywords: card.cardKeywords ?? [],
    abilitiesAndEffects: card.abilitiesAndEffects ?? [],
    abilityAndEffectKeywords: card.abilityAndEffectKeywords ?? [],
    grantedKeywords: card.grantedKeywords ?? [],
    removedKeywords: card.removedKeywords ?? [],
    interactsWithKeywords: card.interactsWithKeywords ?? [],
    playedHorizontally: card.playedHorizontally ?? false,
    legalities: {
      blitz: hydrateFormatLegality(card.legalities?.blitz),
      cc: hydrateFormatLegality(card.legalities?.cc),
      commoner: hydrateFormatLegality(card.legalities?.commoner),
      ll: hydrateFormatLegality(card.legalities?.ll),
      silverAge: hydrateFormatLegality(card.legalities?.silverAge),
    },
  };
}

export function hydrateFleshAndBloodCardDataCatalog(
  catalog: SparseFleshAndBloodCardDataCatalog,
): PopulatedFleshAndBloodCardDataCatalog {
  if (!catalog.provenance) throw new Error("Generated FAB catalog provenance is required.");
  return {
    ...catalog,
    provenance: catalog.provenance,
    cards: catalog.cards.map(hydrateFleshAndBloodCardData),
  };
}

export function hydrateFleshAndBloodCatalog(
  catalog: SparseFleshAndBloodCatalog,
): PopulatedFleshAndBloodCatalog {
  if (!catalog.provenance) throw new Error("Generated FAB catalog provenance is required.");
  return {
    ...catalog,
    provenance: catalog.provenance,
    cards: catalog.cards.map(
      (card): FleshAndBloodCatalogCard => ({
        ...hydrateFleshAndBloodCardData(card),
        printings: card.printings.map(
          (printing): FleshAndBloodPrinting => ({
            ...printing,
            artVariationIds: printing.artVariationIds ?? [],
            imageRotationDegrees: printing.imageRotationDegrees ?? 0,
            edition: printing.edition ?? "N",
          }),
        ),
      }),
    ),
  };
}

export function hydrateFleshAndBloodCatalogParts(
  cardData: SparseFleshAndBloodCardDataCatalog,
  printingData: SparseFleshAndBloodPrintingsCatalog,
): PopulatedFleshAndBloodCatalog {
  if (!cardData.provenance) throw new Error("Generated FAB catalog provenance is required.");
  if (
    printingData.schemaVersion !== cardData.schemaVersion ||
    printingData.game !== cardData.game ||
    printingData.catalogSha256 !== cardData.provenance.sha256
  ) {
    throw new Error("FAB card and printing catalog parts do not describe the same source.");
  }

  const expectedCanonicalIds = new Set(cardData.cards.map((card) => card.canonicalId));
  const unexpectedCanonicalIds = Object.keys(printingData.printingsByCanonicalId).filter(
    (canonicalId) => !expectedCanonicalIds.has(canonicalId),
  );
  if (unexpectedCanonicalIds.length > 0) {
    throw new Error(`FAB printing catalog contains unknown card ${unexpectedCanonicalIds[0]}.`);
  }

  return hydrateFleshAndBloodCatalog({
    ...cardData,
    cards: cardData.cards.map((card) => {
      const printings = printingData.printingsByCanonicalId[card.canonicalId];
      if (!printings) {
        throw new Error(`FAB printing catalog is missing card ${card.canonicalId}.`);
      }
      return { ...card, printings };
    }),
  });
}

/** Catalog-tool-only hydration that preserves identity generator inputs. */
export function hydrateFleshAndBloodCatalogSourceParts(
  cardData: SparseFleshAndBloodCardDataCatalog,
  printingData: SparseFleshAndBloodPrintingsCatalog,
): PopulatedFleshAndBloodCatalogSource {
  if (!cardData.provenance) throw new Error("Generated FAB catalog provenance is required.");
  if (
    printingData.schemaVersion !== cardData.schemaVersion ||
    printingData.game !== cardData.game ||
    printingData.catalogSha256 !== cardData.provenance.sha256
  ) {
    throw new Error("FAB card and printing catalog parts do not describe the same source.");
  }
  const expectedCanonicalIds = new Set(cardData.cards.map((card) => card.canonicalId));
  const unexpectedCanonicalIds = Object.keys(printingData.printingsByCanonicalId).filter(
    (canonicalId) => !expectedCanonicalIds.has(canonicalId),
  );
  if (unexpectedCanonicalIds.length > 0) {
    throw new Error(`FAB printing catalog contains unknown card ${unexpectedCanonicalIds[0]}.`);
  }
  return {
    ...cardData,
    provenance: cardData.provenance,
    cards: cardData.cards.map((card) => {
      const printings = printingData.printingsByCanonicalId[card.canonicalId];
      if (!printings) {
        throw new Error(`FAB printing catalog is missing card ${card.canonicalId}.`);
      }
      return {
        ...hydrateFleshAndBloodSourceCardData(card),
        printings: printings.map(
          (printing): FleshAndBloodPrinting => ({
            ...printing,
            artVariationIds: printing.artVariationIds ?? [],
            imageRotationDegrees: printing.imageRotationDegrees ?? 0,
            edition: printing.edition ?? "N",
          }),
        ),
      };
    }),
  };
}
