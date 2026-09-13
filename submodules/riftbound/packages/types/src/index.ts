import type { BaseCardDefinition, Printing } from "@tcg/card-model";

export type RiftboundCatalogSource = "riot-content-api" | "riot-card-gallery";

export interface RiftboundCatalogProvenance {
  source: RiftboundCatalogSource;
  sourceUrl: string;
  locale: string;
  fetchedAt: string;
  sourceVersion?: string;
  sha256: string;
  productionEligible: boolean;
}

export interface RiftboundImageDimensions {
  width: number;
  height: number;
}

export interface RiftboundPrinting extends Printing {
  upstreamPrintingId: string;
  artist: string;
  imageDimensions?: RiftboundImageDimensions;
}

export interface RiftboundSetDefinition {
  id: string;
  name: string;
  collectorNumberMax?: number;
}

export interface RiftboundCardDefinition extends BaseCardDefinition {
  printings: readonly RiftboundPrinting[];
  cardType: string;
  domains: readonly string[];
  energy?: number;
  power?: number;
  might?: number;
  mightBonus?: number;
  tags: readonly string[];
  keywords: readonly string[];
  flags: readonly string[];
  rulesTextHtml?: string;
  rulesTextPlain?: string;
  effectTextHtml?: string;
  effectTextPlain?: string;
  flavorText?: string;
  orientation: "portrait" | "landscape";
}

export interface RiftboundCatalog {
  schemaVersion: 1;
  game: "riftbound";
  /** `null` is the generated no-data catalog; populated catalogs retain official provenance. */
  provenance: RiftboundCatalogProvenance | null;
  sets: readonly RiftboundSetDefinition[];
  cards: readonly RiftboundCardDefinition[];
}

/** A generated catalog with cards must retain the provenance of its source. */
export type PopulatedRiftboundCatalog = RiftboundCatalog & {
  provenance: RiftboundCatalogProvenance;
};

/** Locale-owned display text, emitted separately from card and printing identity data. */
export interface RiftboundCardTranslation {
  canonicalId: string;
  name: string;
  rulesTextHtml?: string;
  rulesTextPlain?: string;
  effectTextHtml?: string;
  effectTextPlain?: string;
  flavorText?: string;
}

export interface RiftboundSetTranslation {
  setId: string;
  name: string;
}

export interface RiftboundTranslationCatalog {
  schemaVersion: 1;
  game: "riftbound";
  locale: string;
  catalogSha256: string;
  sets: readonly RiftboundSetTranslation[];
  cards: readonly RiftboundCardTranslation[];
}

export interface RiftboundRawSnapshot {
  schemaVersion: 1;
  source: RiftboundCatalogSource;
  sourceUrl: string;
  locale: string;
  fetchedAt: string;
  sourceVersion?: string;
  sha256: string;
  payload: unknown;
}

export interface RiftboundImportContext {
  source: RiftboundCatalogSource;
  sourceUrl: string;
  locale: string;
  fetchedAt: string;
  sourceVersion?: string;
  sha256: string;
}

export interface RiftboundDeckEntry {
  canonicalId: string;
  printingId: string;
  quantity: number;
}

export interface RiftboundDeckBoards {
  legend: RiftboundDeckEntry | null;
  mainDeck: readonly RiftboundDeckEntry[];
  battlefields: readonly RiftboundDeckEntry[];
  runes: readonly RiftboundDeckEntry[];
  sideboard: readonly RiftboundDeckEntry[];
  bench: readonly RiftboundDeckEntry[];
}

export interface RiftboundDeckDocument {
  schemaVersion: 2;
  game: "riftbound";
  name: string;
  boards: RiftboundDeckBoards;
  declarations?: {
    chosenChampionId?: string;
  };
}
