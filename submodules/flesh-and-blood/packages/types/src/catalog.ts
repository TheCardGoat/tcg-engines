import type { FleshAndBloodCatalogCard, FleshAndBloodPrinting } from "./catalog-types.ts";

export * from "./catalog-types.ts";
export {
  hydrateFleshAndBloodCatalog,
  hydrateFleshAndBloodCardDataCatalog,
  hydrateFleshAndBloodCatalogParts,
  hydrateFleshAndBloodCatalogSourceParts,
  type SparseFleshAndBloodCardData,
  type SparseFleshAndBloodCardDataCatalog,
  type SparseFleshAndBloodCatalogCard,
  type SparseFleshAndBloodCatalog,
  type SparseFleshAndBloodFormatLegality,
  type SparseFleshAndBloodLegality,
  type SparseFleshAndBloodPrinting,
  type SparseFleshAndBloodPrintingsCatalog,
} from "./catalog-defaults.ts";

export type FleshAndBloodCatalogSource = "fab-cube";
export interface FleshAndBloodSourceArtifact {
  path: string;
  sourceUrl: string;
  sha256: string;
}
export interface FleshAndBloodCatalogProvenance {
  source: FleshAndBloodCatalogSource;
  sourceUrl: string;
  sourceRef: string;
  locale: string;
  fetchedAt: string;
  sourceVersion: string;
  sha256: string;
  productionEligible: boolean;
}
export interface FleshAndBloodSetDefinition {
  id: string;
  name: string;
  /** Earliest public release date across this set's print runs. */
  releaseDate?: string;
}
export interface FleshAndBloodCatalog {
  schemaVersion: 1;
  game: "flesh-and-blood";
  provenance: FleshAndBloodCatalogProvenance | null;
  sets: readonly FleshAndBloodSetDefinition[];
  cards: readonly FleshAndBloodCatalogCard[];
}
export type FleshAndBloodCardData = Omit<FleshAndBloodCatalogCard, "printings">;
export interface FleshAndBloodCardDataCatalog extends Omit<FleshAndBloodCatalog, "cards"> {
  cards: readonly FleshAndBloodCardData[];
}
export type PopulatedFleshAndBloodCatalog = FleshAndBloodCatalog & {
  provenance: FleshAndBloodCatalogProvenance;
};
export type PopulatedFleshAndBloodCardDataCatalog = FleshAndBloodCardDataCatalog & {
  provenance: FleshAndBloodCatalogProvenance;
};
export interface FleshAndBloodCardTranslation {
  canonicalId: string;
  name: string;
  functionalTextHtml?: string;
  functionalTextPlain?: string;
  typeText?: string;
  imageUrl?: string;
  boardImageUrl?: string;
}
export interface FleshAndBloodSetTranslation {
  setId: string;
  name: string;
}
export interface FleshAndBloodTranslationCatalog {
  schemaVersion: 1;
  game: "flesh-and-blood";
  locale: string;
  provenance: FleshAndBloodCatalogProvenance | null;
  catalogSha256: string;
  sets: readonly FleshAndBloodSetTranslation[];
  cards: readonly FleshAndBloodCardTranslation[];
}
export interface FleshAndBloodLocalizedPrintingsCatalog {
  schemaVersion: 1;
  game: "flesh-and-blood";
  locale: string;
  provenance: FleshAndBloodCatalogProvenance;
  catalogSha256: string;
  printingsByCanonicalId: Readonly<Record<string, readonly FleshAndBloodPrinting[]>>;
}
export interface FleshAndBloodCatalogAudit {
  canonicalCardCount: number;
  printingCount: number;
  uniqueSourceImageCount: number;
  printingsSharingSourceImages: number;
  missingImagePrintingIds: readonly string[];
  nonHttpsImagePrintingIds: readonly string[];
  crossCardArtworkGroups: Readonly<Record<string, readonly string[]>>;
  physicalIdentityCollisions: Readonly<Record<string, readonly string[]>>;
}
export interface FleshAndBloodRawSnapshot {
  schemaVersion: 2;
  source: FleshAndBloodCatalogSource;
  sourceUrl: string;
  sourceRef: string;
  locale: string;
  language?: string;
  fetchedAt: string;
  sourceVersion: string;
  artifacts: readonly FleshAndBloodSourceArtifact[];
  sha256: string;
  payload: unknown;
}
export interface FleshAndBloodImportContext {
  source: FleshAndBloodCatalogSource;
  sourceUrl: string;
  sourceRef: string;
  locale: string;
  fetchedAt: string;
  sourceVersion: string;
  sha256: string;
}
