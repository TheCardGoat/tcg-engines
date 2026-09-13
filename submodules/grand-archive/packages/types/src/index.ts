import type { BaseCardDefinition, Printing } from "@tcg/card-model";

export const GRAND_ARCHIVE_CARD_TYPES = [
  "ACTION",
  "ALLY",
  "ATTACK",
  "CHAMPION",
  "DOMAIN",
  "GREATER BOON",
  "ITEM",
  "LESSER BOON",
  "MASTERY",
  "PHANTASIA",
  "REGALIA",
  "STATUS",
  "TOKEN",
  "UNIQUE",
  "WEAPON",
] as const;
export const GRAND_ARCHIVE_ELEMENTS = [
  "ARCANE",
  "ASTRA",
  "CRUX",
  "EXALTED",
  "EXIA",
  "FIRE",
  "LUXEM",
  "NEOS",
  "NORM",
  "TERA",
  "UMBRA",
  "WATER",
  "WIND",
] as const;
export const GRAND_ARCHIVE_CLASSES = [
  "ANOMALY",
  "ASSASSIN",
  "CLERIC",
  "GUARDIAN",
  "MAGE",
  "RANGER",
  "SPIRIT",
  "TAMER",
  "WARRIOR",
] as const;
export const GRAND_ARCHIVE_REFERENCE_KINDS = [
  "BREW",
  "GENERATE",
  "MASTERY",
  "REFERENCE",
  "STATUS",
  "SUMMON",
] as const;

export type GrandArchiveCardType = (typeof GRAND_ARCHIVE_CARD_TYPES)[number];
export type GrandArchiveElement = (typeof GRAND_ARCHIVE_ELEMENTS)[number];
export type GrandArchiveClass = (typeof GRAND_ARCHIVE_CLASSES)[number];
export type GrandArchiveReferenceKind = (typeof GRAND_ARCHIVE_REFERENCE_KINDS)[number];
export type GrandArchiveSpeed = "fast" | "slow";
export type GrandArchiveCost =
  | { readonly type: "memory"; readonly value: string }
  | { readonly type: "reserve"; readonly value: string }
  | { readonly type: "none"; readonly value: null };

export interface GrandArchiveSet {
  readonly id: string;
  readonly prefix: string;
  readonly name: string;
  readonly language: string;
  readonly releaseDate: string;
}

export interface GrandArchivePrinting extends Printing {
  readonly editionSlug: string;
  readonly configuration: "default" | "flip";
  readonly orientation: "front" | "back" | null;
  readonly illustrator: string | null;
  readonly flavor: string | null;
  readonly set: GrandArchiveSet;
}

export interface GrandArchiveCardReference {
  readonly kind: GrandArchiveReferenceKind;
  readonly name: string;
  readonly slug: string;
}

/** Per-format deckbuilding limit returned by the official Index API. */
export interface GrandArchiveLegalityLimit {
  readonly limit: number;
}

/** Official Index characteristics for the opposite face of a double-faced card. */
export interface GrandArchiveRelatedFaceDefinition {
  readonly canonicalId: string;
  readonly slug: string;
  readonly name: string;
  readonly types: readonly GrandArchiveCardType[];
  readonly subtypes: readonly string[];
  readonly classes: readonly GrandArchiveClass[];
  readonly elements: readonly GrandArchiveElement[];
  readonly cost: GrandArchiveCost;
  readonly memoryCost: number | null;
  readonly reserveCost: number | null;
  readonly level: number | null;
  readonly power: number | null;
  readonly life: number | null;
  readonly durability: number | null;
  readonly speed: GrandArchiveSpeed | null;
  readonly effect: string | null;
  readonly effectRaw: string | null;
  readonly effectHtml: string | null;
  readonly orientation: "front" | "back";
}

/** Catalog metadata only. Rules text is never an executable effect definition. */
export interface GrandArchiveCardDefinition extends BaseCardDefinition {
  readonly externalIds: { readonly gatcgIndex: string };
  readonly types: readonly GrandArchiveCardType[];
  readonly subtypes: readonly string[];
  readonly classes: readonly GrandArchiveClass[];
  readonly elements: readonly GrandArchiveElement[];
  readonly cost: GrandArchiveCost;
  readonly memoryCost: number | null;
  readonly reserveCost: number | null;
  readonly level: number | null;
  readonly power: number | null;
  readonly life: number | null;
  readonly durability: number | null;
  readonly speed: GrandArchiveSpeed | null;
  readonly effect: string | null;
  readonly effectRaw: string | null;
  readonly effectHtml: string | null;
  readonly legality: Readonly<Record<string, GrandArchiveLegalityLimit>> | null;
  readonly references: readonly GrandArchiveCardReference[];
  readonly referencedBy: readonly GrandArchiveCardReference[];
  /** Deduplicated opposite faces supplied by Index `other_orientations`. */
  readonly relatedFaces: readonly GrandArchiveRelatedFaceDefinition[];
  readonly printings: readonly GrandArchivePrinting[];
}

export interface GrandArchiveCatalogProvenance {
  readonly source: "gatcg-index-api";
  readonly sourceUrl: string;
  readonly openApiUrl: string;
  readonly fetchedAt: string;
  readonly sha256: string;
}

export interface GrandArchiveCatalog {
  readonly schemaVersion: 1;
  readonly game: "grand-archive";
  readonly provenance: GrandArchiveCatalogProvenance | null;
  readonly cards: readonly GrandArchiveCardDefinition[];
}

export interface GrandArchiveRawSnapshot {
  readonly schemaVersion: 1;
  readonly source: "gatcg-index-api";
  readonly sourceUrl: string;
  readonly openApiUrl: string;
  readonly fetchedAt: string;
  readonly sha256: string;
  readonly payload: unknown;
}

export * from "./card.ts";
export * from "./abilities/index.ts";
