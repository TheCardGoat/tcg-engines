import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  FAB_CLASS_SUPERTYPES,
  FAB_METATYPES,
  FAB_SUBTYPES,
  FAB_TALENT_SUPERTYPES,
  FAB_TYPES,
  type FabSupertypeSet,
  type FabSupertypeSets,
  type FabSupertype,
} from "@tcg/flesh-and-blood-types";
import {
  type FleshAndBloodCatalogCard,
  type FleshAndBloodCardTranslation,
  type FleshAndBloodCatalogAudit,
  type FleshAndBloodCatalog,
  type FleshAndBloodCatalogProvenance,
  type FleshAndBloodFormatLegality,
  type FleshAndBloodImportContext,
  type FleshAndBloodLegality,
  type FleshAndBloodPrinting,
  type FleshAndBloodRawSnapshot,
  type FleshAndBloodSetDefinition,
  type FleshAndBloodSetTranslation,
  type SparseFleshAndBloodCatalog,
  type SparseFleshAndBloodCardDataCatalog,
  type SparseFleshAndBloodPrintingsCatalog,
  type FleshAndBloodTranslationCatalog,
  type PopulatedFleshAndBloodCatalog,
} from "@tcg/flesh-and-blood-types/catalog";
import type { ExternalSource } from "@tcg/card-model";
import { format } from "oxfmt";
import { z } from "zod";
import type {
  FleshAndBloodCatalogSource,
  FleshAndBloodCatalogSourceCard,
  PopulatedFleshAndBloodCatalogSource,
} from "../../../packages/types/src/catalog-defaults.ts";
import { withOfficialReleaseNoteCards } from "./official-release-note-cards.ts";

const FabCubePrintingSchema = z
  .object({
    unique_id: z.string().min(1),
    set_printing_unique_id: z.string().min(1),
    id: z.string().min(1),
    set_id: z.string().min(1),
    edition: z.string(),
    foiling: z.string(),
    rarity: z.string(),
    expansion_slot: z.boolean(),
    artists: z.array(z.string()),
    art_variations: z.array(z.string()),
    flavor_text: z.string(),
    flavor_text_plain: z.string(),
    image_url: z.union([z.string().url(), z.null()]),
    image_rotation_degrees: z.number(),
    tcgplayer_product_id: z.union([z.string(), z.null()]).optional(),
    tcgplayer_url: z.union([z.string().url(), z.null()]).optional(),
  })
  .passthrough();

const FabCubeCardSchema = z
  .object({
    unique_id: z.string().min(1),
    name: z.string().min(1),
    color: z.string(),
    pitch: z.string(),
    cost: z.string(),
    power: z.string(),
    defense: z.string(),
    health: z.string(),
    intelligence: z.string(),
    arcane: z.string(),
    types: z.array(z.string()),
    traits: z.array(z.string()),
    card_keywords: z.array(z.string()),
    abilities_and_effects: z.array(z.string()),
    ability_and_effect_keywords: z.array(z.string()),
    granted_keywords: z.array(z.string()),
    removed_keywords: z.array(z.string()),
    interacts_with_keywords: z.array(z.string()),
    functional_text: z.string(),
    functional_text_plain: z.string(),
    type_text: z.string(),
    played_horizontally: z.boolean(),
    blitz_legal: z.boolean(),
    cc_legal: z.boolean(),
    commoner_legal: z.boolean(),
    ll_legal: z.boolean(),
    silver_age_legal: z.boolean(),
    blitz_living_legend: z.boolean(),
    cc_living_legend: z.boolean(),
    blitz_banned: z.boolean(),
    cc_banned: z.boolean(),
    commoner_banned: z.boolean(),
    ll_banned: z.boolean(),
    silver_age_banned: z.boolean(),
    upf_banned: z.boolean(),
    blitz_suspended: z.boolean(),
    cc_suspended: z.boolean(),
    commoner_suspended: z.boolean(),
    ll_restricted: z.boolean(),
    printings: z.array(FabCubePrintingSchema),
    cards_referenced_by: z.array(z.string()).optional(),
  })
  .passthrough();

const FabCubeSetSchema = z
  .object({
    unique_id: z.string().min(1),
    id: z.string().min(1),
    name: z.string().min(1),
    printings: z.array(
      z
        .object({
          initial_release_date: z.string().nullable().optional(),
        })
        .passthrough(),
    ),
  })
  .passthrough();

const FabCubePayloadSchema = z.object({
  cards: z.array(FabCubeCardSchema).min(1),
  sets: z.array(FabCubeSetSchema),
  schemas: z
    .object({
      card: z.record(z.string(), z.unknown()),
      set: z.record(z.string(), z.unknown()),
    })
    .optional(),
  totalCards: z.number().int().nonnegative().optional(),
  totalSets: z.number().int().nonnegative().optional(),
});

export class FleshAndBloodCatalogError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "FleshAndBloodCatalogError";
  }
}

export interface FleshAndBloodCatalogChangeReport {
  previous: { cards: number; sets: number; printings: number };
  next: { cards: number; sets: number; printings: number };
  addedCardIds: readonly string[];
  removedCardIds: readonly string[];
  changedCardIds: readonly string[];
  addedSetIds: readonly string[];
  removedSetIds: readonly string[];
  changedSetIds: readonly string[];
  addedPrintingIds: readonly string[];
  removedPrintingIds: readonly string[];
  changedPrintingIds: readonly string[];
  changedStableIdentityCardIds: readonly string[];
  changedLegalityCardIds: readonly string[];
  changedImageSourcePrintingIds: readonly string[];
  addedTypeTokens: readonly string[];
  removedTypeTokens: readonly string[];
}

export interface FleshAndBloodSourceImageDiffInput {
  previous: ReadonlyMap<string, string | null>;
  next: ReadonlyMap<string, string | null>;
}

function schemaError(label: string, error: z.ZodError): FleshAndBloodCatalogError {
  const issue = error.issues[0];
  const issuePath = issue?.path.length ? `.${issue.path.join(".")}` : "";
  return new FleshAndBloodCatalogError(
    `${label}${issuePath}: ${issue?.message ?? "schema validation failed"}`,
    { cause: error },
  );
}

function optionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function cardSlug(name: string, color: string | undefined): string {
  let base = slugify(name);
  if (base === "") base = "card";
  if (color) {
    const colorSlug = slugify(color);
    // Strip a trailing full color or 3-letter abbreviation already on the name
    // (e.g. "Backup Protocol: YEL" + Yellow) so we don't emit "...yel-yellow".
    // Keep slug identity stable across catalog regenerations.
    base =
      base
        .replace(new RegExp(`-(?:${colorSlug}|red|yel|blu|yellow|blue)$`, "i"), "")
        .replace(/^-+|-+$/g, "") || "card";
    if (base.endsWith(`-${colorSlug}`)) return base;
    return `${base}-${colorSlug}`;
  }
  return base;
}

function normalizeLegality(raw: z.infer<typeof FabCubeCardSchema>): FleshAndBloodLegality {
  return {
    blitz: {
      legal: raw.blitz_legal,
      banned: raw.blitz_banned,
      suspended: raw.blitz_suspended,
      livingLegend: raw.blitz_living_legend,
      restricted: false,
    },
    cc: {
      legal: raw.cc_legal,
      banned: raw.cc_banned,
      suspended: raw.cc_suspended,
      livingLegend: raw.cc_living_legend,
      restricted: false,
    },
    commoner: {
      legal: raw.commoner_legal,
      banned: raw.commoner_banned,
      suspended: raw.commoner_suspended,
      livingLegend: false,
      restricted: false,
    },
    ll: {
      legal: raw.ll_legal,
      banned: raw.ll_banned,
      suspended: false,
      livingLegend: false,
      restricted: raw.ll_restricted,
    },
    silverAge: {
      legal: raw.silver_age_legal,
      banned: raw.silver_age_banned,
      suspended: false,
      livingLegend: false,
      restricted: false,
    },
  };
}

/**
 * Authored format-legality corrections from official LSS B&R announcements.
 * The FAB Cube ingests announcements late, so the catalog states the official
 * legality here and every source refresh re-applies the overlay; an entry is
 * removed once the source snapshot agrees with it. Keyed by exact English
 * card name and applied to every printing variant of the card. Benched
 * Silver Age heroes are recorded as not legal (a bench is a seasonal
 * exclusion, not a ban).
 */
interface CatalogLegalityOverride {
  /** Official announcement that states the encoded legality. */
  readonly announcement: string;
  /** ISO date the legality takes effect. */
  readonly effectiveFrom: string;
  /** Sparse per-format patch over the source legalities. */
  readonly patch: {
    readonly [F in keyof FleshAndBloodLegality]?: Partial<FleshAndBloodFormatLegality>;
  };
}

const FAB_BNR_2026_09_18 =
  "https://fabtcg.com/articles/scheduled-banned-and-restricted-announcement-17-09-26/";

const CATALOG_LEGALITY_OVERRIDES: Readonly<Record<string, CatalogLegalityOverride>> = {
  "Brand with Cinderclaw": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { cc: { banned: false } },
  },
  "Entwine Lightning": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { cc: { banned: true } },
  },
  Briar: {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { legal: false } },
  },
  Oldhim: {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { legal: false } },
  },
  Oscilio: {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { legal: false } },
  },
  Chane: {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { legal: false } },
  },
  "Ira, Crimson Haze": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: false } },
  },
  Kano: {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: false } },
  },
  Kayo: {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: false } },
  },
  "Beckoning Haunt": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: false } },
  },
  "Deathly Delight": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: false } },
  },
  Flourish: {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: false } },
  },
  "Sirens of Safe Harbor": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: false } },
  },
  "Vantom Wraith": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: false } },
  },
  "Absorb in Aether": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: true } },
  },
  "Beaten Trackers": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: true } },
  },
  "Emeritus Scolding": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: true } },
  },
  "Harmonized Kodachi": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: true } },
  },
  "Lightning Press": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: true } },
  },
  Pulping: {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: true } },
  },
  "Sigil of Suffering": {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: true } },
  },
  Snapback: {
    announcement: FAB_BNR_2026_09_18,
    effectiveFrom: "2026-09-18",
    patch: { silverAge: { banned: true } },
  },
};

function applyCatalogLegalityOverride(
  name: string,
  legalities: FleshAndBloodLegality,
): FleshAndBloodLegality {
  const override = CATALOG_LEGALITY_OVERRIDES[name];
  if (!override) return legalities;
  const patched = (
    legality: FleshAndBloodFormatLegality,
    patch: Partial<FleshAndBloodFormatLegality> | undefined,
  ): FleshAndBloodFormatLegality => ({ ...legality, ...patch });
  return {
    blitz: patched(legalities.blitz, override.patch.blitz),
    cc: patched(legalities.cc, override.patch.cc),
    commoner: patched(legalities.commoner, override.patch.commoner),
    ll: patched(legalities.ll, override.patch.ll),
    silverAge: patched(legalities.silverAge, override.patch.silverAge),
  };
}

const FAB_PUBLIC_ASSET_BASE = "https://cdn.tcg.online/public";

export interface FleshAndBloodAssetPrinting {
  readonly cardCanonicalId: string;
  readonly boardPath: string;
  readonly fullPath: string;
}

export type FleshAndBloodAssetPrintings = ReadonlyMap<string, FleshAndBloodAssetPrinting>;

/**
 * Read the content-addressed printing paths emitted by the assets repository.
 * The second accepted envelope is the checked-in simulator snapshot produced
 * directly from that schema-4 manifest.
 */
export function fleshAndBloodAssetPrintingsFromManifest(
  value: unknown,
): FleshAndBloodAssetPrintings {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new FleshAndBloodCatalogError("FAB asset manifest must be an object.");
  }
  const manifest = value as {
    schemaVersion?: unknown;
    sourceSchemaVersion?: unknown;
    printings?: unknown;
  };
  const isSchemaFour = manifest.schemaVersion === 4;
  const isSynchronizedSchemaFour =
    manifest.schemaVersion === 2 && manifest.sourceSchemaVersion === 4;
  if (!isSchemaFour && !isSynchronizedSchemaFour) {
    throw new FleshAndBloodCatalogError(
      "Expected FAB asset manifest schema 4 or its schema-2 synchronized snapshot.",
    );
  }
  if (manifest.printings === null || typeof manifest.printings !== "object") {
    throw new FleshAndBloodCatalogError("FAB asset manifest is missing its printings map.");
  }

  const printings = new Map<string, FleshAndBloodAssetPrinting>();
  for (const [printingId, rawEntry] of Object.entries(manifest.printings)) {
    if (rawEntry === null || typeof rawEntry !== "object" || Array.isArray(rawEntry)) {
      throw new FleshAndBloodCatalogError(`Invalid FAB asset entry for ${printingId}.`);
    }
    const entry = rawEntry as {
      cardCanonicalId?: unknown;
      boardPath?: unknown;
      fullPath?: unknown;
    };
    if (
      typeof entry.cardCanonicalId !== "string" ||
      typeof entry.boardPath !== "string" ||
      !/^fab\/assets\/board\/[a-f0-9]{64}\.webp$/u.test(entry.boardPath) ||
      typeof entry.fullPath !== "string" ||
      !/^fab\/assets\/full\/[a-f0-9]{64}\.webp$/u.test(entry.fullPath)
    ) {
      throw new FleshAndBloodCatalogError(`Invalid FAB asset entry for ${printingId}.`);
    }
    printings.set(printingId, {
      cardCanonicalId: entry.cardCanonicalId,
      boardPath: entry.boardPath,
      fullPath: entry.fullPath,
    });
  }
  return printings;
}

export function runtimeImageUrls(
  printingId: string,
  cardCanonicalId: string,
  assetPrintings: FleshAndBloodAssetPrintings,
): { boardImageUrl: string; imageUrl: string } {
  const asset = assetPrintings.get(printingId);
  if (!asset) return { boardImageUrl: "", imageUrl: "" };
  if (asset.cardCanonicalId !== cardCanonicalId) {
    throw new FleshAndBloodCatalogError(
      `FAB asset printing ${printingId} belongs to ${asset.cardCanonicalId}, not ${cardCanonicalId}.`,
    );
  }
  return {
    boardImageUrl: `${FAB_PUBLIC_ASSET_BASE}/${asset.boardPath}`,
    imageUrl: `${FAB_PUBLIC_ASSET_BASE}/${asset.fullPath}`,
  };
}

function sourceImageRank(imageUrl: string | null): number {
  if (!imageUrl) return -1;
  if (imageUrl.includes("/cardfaces/") || imageUrl.includes("/media/cards/large/")) return 2;
  if (imageUrl.includes("/media/images/")) return 1;
  return 0;
}

function normalizePrinting(
  raw: z.infer<typeof FabCubePrintingSchema>,
  locale: string,
  cardCanonicalId: string,
  assetPrintings: FleshAndBloodAssetPrintings,
): FleshAndBloodPrinting {
  const externalIds: Partial<Record<ExternalSource, string>> = {};
  externalIds.fabCube = raw.unique_id;
  if (raw.tcgplayer_product_id != null) {
    externalIds.tcgPlayer = raw.tcgplayer_product_id;
  }
  const imageUrls = runtimeImageUrls(raw.unique_id, cardCanonicalId, assetPrintings);

  return {
    id: raw.unique_id,
    // Several physical printings (for example standard and foil editions) can
    // share one artwork. The FAB Cube exposes that N:1 artwork
    // identity as set_printing_unique_id; raw.unique_id remains the exact
    // physical-printing identity.
    artId: raw.set_printing_unique_id,
    setPrintingId: raw.set_printing_unique_id,
    setCode: raw.set_id,
    collectorNumber: raw.id,
    rarity: raw.rarity,
    boardImageUrl: imageUrls.boardImageUrl,
    imageUrl: imageUrls.imageUrl,
    locale,
    artists: raw.artists,
    artVariationIds: raw.art_variations,
    imageRotationDegrees: raw.image_rotation_degrees,
    finish: raw.foiling,
    edition: raw.edition,
    expansionSlot: raw.expansion_slot,
    ...(raw.flavor_text ? { flavorText: raw.flavor_text_plain || raw.flavor_text } : {}),
    externalIds,
  };
}

function typeTextPrimaryTypes(typeText: string): readonly (typeof FAB_TYPES)[number][] {
  const matches = FAB_TYPES.filter((type) => {
    const escaped = type.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^A-Za-z])${escaped}(?=$|[^A-Za-z])`, "u").test(typeText);
  });
  return matches
    .filter((type) => !matches.some((other) => other.length > type.length && other.includes(type)))
    .sort((left, right) => typeText.indexOf(left) - typeText.indexOf(right));
}

interface CatalogCardMetadataOverride {
  readonly types: FleshAndBloodCatalogSourceCard["types"];
  readonly typeText: string;
}

const CATALOG_CARD_METADATA_OVERRIDES: Readonly<Record<string, CatalogCardMetadataOverride>> = {
  BRdKgPG6pJk8pGT7CWCpB: {
    types: ["Lightning", "Wizard", "Action"],
    typeText: "Lightning Wizard Action",
  },
  kLgnHP8nHtnMwHfqN9zkp: {
    types: ["Lightning", "Wizard", "Action"],
    typeText: "Lightning Wizard Action",
  },
  Mbrg9P78qm9PGCdPLbncD: {
    types: ["Lightning", "Wizard", "Action"],
    typeText: "Lightning Wizard Action",
  },
};

function normalizeTypeTokens(
  rawTypes: readonly string[],
  typeText: string,
): FleshAndBloodCatalogSourceCard["types"] {
  const knownTokens = [
    "Generic",
    ...FAB_METATYPES,
    ...FAB_CLASS_SUPERTYPES,
    ...FAB_TALENT_SUPERTYPES,
    ...FAB_TYPES,
    ...FAB_SUBTYPES,
  ] as const;
  const normalized = rawTypes.map((rawType) => {
    const type = knownTokens.find((knownType) => knownType === rawType);
    if (!type) throw new Error(`unsupported FAB type-box vocabulary token ${rawType}`);
    return type;
  });
  const printedPrimaryTypes = typeTextPrimaryTypes(typeText);
  if (printedPrimaryTypes.length === 0) return normalized;
  const primaryTypes = new Set<string>(FAB_TYPES);
  const rawPrimaryTypes = normalized.filter((type) => primaryTypes.has(type));
  if (rawPrimaryTypes.length !== printedPrimaryTypes.length) return normalized;
  let primaryIndex = 0;
  return normalized.map((type) =>
    primaryTypes.has(type) ? printedPrimaryTypes[primaryIndex++]! : type,
  );
}

export function supertypeSetsFromTypeText(typeText: string): FabSupertypeSets | undefined {
  if (!typeText.includes(" / ")) return undefined;
  const knownSupertypes: readonly FabSupertype[] = [
    ...FAB_CLASS_SUPERTYPES,
    ...FAB_TALENT_SUPERTYPES,
  ];
  const segments = typeText.split(" / ");
  const alternatives = segments
    .map((segment): FabSupertypeSet | undefined => {
      const [first, ...rest] = knownSupertypes.filter((supertype) =>
        new RegExp(`(^|\\s)${supertype}(?=\\s|$)`, "u").test(segment),
      );
      return first ? [first, ...rest] : undefined;
    })
    .filter((set): set is FabSupertypeSet => set !== undefined);
  const [first, second, ...rest] = alternatives;
  if (!first || !second || alternatives.length !== segments.length) return undefined;
  return [first, second, ...rest];
}

function normalizeCard(
  raw: z.infer<typeof FabCubeCardSchema>,
  locale: string,
  assetPrintings: FleshAndBloodAssetPrintings,
): FleshAndBloodCatalogSourceCard {
  const metadataOverride = CATALOG_CARD_METADATA_OVERRIDES[raw.unique_id];
  const color = raw.color.trim() || undefined;
  const pitch =
    raw.pitch.trim() ||
    (color === "Red" ? "1" : color === "Yellow" ? "2" : color === "Blue" ? "3" : undefined);
  const functionalTextHtml = raw.functional_text || undefined;
  const functionalTextPlain = raw.functional_text_plain || undefined;
  const supertypeSets = supertypeSetsFromTypeText(raw.type_text);

  const printings = raw.printings
    .map((printing, sourceIndex) => ({ printing, sourceIndex }))
    .sort(
      (left, right) =>
        sourceImageRank(right.printing.image_url) - sourceImageRank(left.printing.image_url) ||
        left.sourceIndex - right.sourceIndex,
    )
    .map(({ printing }) => normalizePrinting(printing, locale, raw.unique_id, assetPrintings));

  return {
    canonicalId: raw.unique_id,
    slug: cardSlug(raw.name, color),
    name: raw.name,
    printings,
    externalIds: { fabCube: raw.unique_id },
    ...(color ? { color } : {}),
    ...(pitch ? { pitch } : {}),
    cost: optionalNumber(raw.cost),
    power: optionalNumber(raw.power),
    defense: optionalNumber(raw.defense),
    health: optionalNumber(raw.health),
    intelligence: optionalNumber(raw.intelligence),
    arcane: optionalNumber(raw.arcane),
    types: metadataOverride?.types ?? normalizeTypeTokens(raw.types, raw.type_text),
    ...(supertypeSets ? { supertypeSets } : {}),
    traits: raw.traits,
    cardKeywords: raw.card_keywords,
    abilitiesAndEffects: raw.abilities_and_effects,
    abilityAndEffectKeywords: raw.ability_and_effect_keywords,
    grantedKeywords: raw.granted_keywords,
    removedKeywords: raw.removed_keywords,
    interactsWithKeywords: raw.interacts_with_keywords,
    ...(functionalTextHtml ? { functionalTextHtml } : {}),
    ...(functionalTextPlain ? { functionalTextPlain } : {}),
    typeText: metadataOverride?.typeText ?? raw.type_text,
    playedHorizontally: raw.played_horizontally,
    legalities: applyCatalogLegalityOverride(raw.name, normalizeLegality(raw)),
    ...(raw.cards_referenced_by ? { cardsReferencedBy: raw.cards_referenced_by } : {}),
  };
}

function normalizeSet(raw: z.infer<typeof FabCubeSetSchema>): FleshAndBloodSetDefinition {
  const releaseDate = raw.printings
    .map((printing) => printing.initial_release_date)
    .filter(
      (candidate): candidate is string =>
        typeof candidate === "string" &&
        candidate.length > 0 &&
        !Number.isNaN(Date.parse(candidate)),
    )
    .sort()[0];
  return {
    id: raw.id,
    name: raw.name,
    ...(releaseDate ? { releaseDate } : {}),
  };
}

function collectorSortValue(value: string): [number, string] {
  const numeric = Number.parseInt(value, 10);
  return [Number.isNaN(numeric) ? Number.MAX_SAFE_INTEGER : numeric, value];
}

function sortCatalog(
  catalog: PopulatedFleshAndBloodCatalogSource,
): PopulatedFleshAndBloodCatalogSource {
  return {
    ...catalog,
    sets: [...catalog.sets].sort((left, right) => left.id.localeCompare(right.id)),
    cards: [...catalog.cards].sort((left, right) => {
      const leftPrinting = left.printings[0];
      const rightPrinting = right.printings[0];
      if (!leftPrinting && !rightPrinting) {
        return left.canonicalId.localeCompare(right.canonicalId);
      }
      if (!leftPrinting) return 1;
      if (!rightPrinting) return -1;
      const setOrder = leftPrinting.setCode.localeCompare(rightPrinting.setCode);
      if (setOrder !== 0) return setOrder;
      const [leftNumber, leftText] = collectorSortValue(leftPrinting.collectorNumber);
      const [rightNumber, rightText] = collectorSortValue(rightPrinting.collectorNumber);
      return (
        leftNumber - rightNumber ||
        leftText.localeCompare(rightText) ||
        left.canonicalId.localeCompare(right.canonicalId)
      );
    }),
  };
}

function rejectDuplicateIdentities(catalog: FleshAndBloodCatalog): void {
  const seenSets = new Set<string>();
  const seenCards = new Set<string>();
  const seenPrintings = new Set<string>();
  for (const set of catalog.sets) {
    if (seenSets.has(set.id)) {
      throw new FleshAndBloodCatalogError(`Duplicate set identity: ${set.id}`);
    }
    seenSets.add(set.id);
    if (set.releaseDate && Number.isNaN(Date.parse(set.releaseDate))) {
      throw new FleshAndBloodCatalogError(`Set ${set.id} has an invalid release date.`);
    }
  }
  for (const card of catalog.cards) {
    if (seenCards.has(card.canonicalId)) {
      throw new FleshAndBloodCatalogError(`Duplicate canonical card identity: ${card.canonicalId}`);
    }
    seenCards.add(card.canonicalId);
    for (const printing of card.printings) {
      if (seenPrintings.has(printing.id)) {
        throw new FleshAndBloodCatalogError(`Duplicate printing identity: ${printing.id}`);
      }
      seenPrintings.add(printing.id);
    }
  }
}

function printingIds(catalog: FleshAndBloodCatalog): Set<string> {
  return new Set(catalog.cards.flatMap((card) => card.printings.map((printing) => printing.id)));
}

function typeTokens(catalog: FleshAndBloodCatalogSource): Set<string> {
  return new Set(catalog.cards.flatMap((card) => [...card.types]));
}

function sortedDifference(left: ReadonlySet<string>, right: ReadonlySet<string>): string[] {
  return [...left].filter((value) => !right.has(value)).sort();
}

function stableCardData(card: FleshAndBloodCatalogSourceCard): unknown {
  const { externalIds: _externalIds, ...stable } = card;
  return stable;
}

function printingMap(catalog: FleshAndBloodCatalog): Map<string, FleshAndBloodPrinting> {
  return new Map(
    catalog.cards.flatMap((card) => card.printings.map((printing) => [printing.id, printing])),
  );
}

function stableIdentity(card: FleshAndBloodCatalogCard): unknown {
  return {
    canonicalId: card.canonicalId,
    printings: card.printings.map((printing) => ({
      id: printing.id,
      artId: printing.artId,
      setCode: printing.setCode,
      collectorNumber: printing.collectorNumber,
    })),
  };
}

export function diffFleshAndBloodCatalogs(
  previous: FleshAndBloodCatalogSource,
  next: FleshAndBloodCatalogSource,
  sourceImages?: FleshAndBloodSourceImageDiffInput,
): FleshAndBloodCatalogChangeReport {
  const previousCards = new Map(previous.cards.map((card) => [card.canonicalId, card]));
  const nextCards = new Map(next.cards.map((card) => [card.canonicalId, card]));
  const previousSets = new Set(previous.sets.map((set) => set.id));
  const nextSets = new Set(next.sets.map((set) => set.id));
  const previousSetData = new Map(previous.sets.map((set) => [set.id, set]));
  const nextSetData = new Map(next.sets.map((set) => [set.id, set]));
  const previousPrintings = printingIds(previous);
  const nextPrintings = printingIds(next);
  const previousPrintingData = printingMap(previous);
  const nextPrintingData = printingMap(next);
  const changedCardIds = [...previousCards.keys()]
    .filter((id) => {
      const nextCard = nextCards.get(id);
      return (
        nextCard !== undefined &&
        JSON.stringify(stableCardData(previousCards.get(id)!)) !==
          JSON.stringify(stableCardData(nextCard))
      );
    })
    .sort();

  return {
    previous: {
      cards: previous.cards.length,
      sets: previous.sets.length,
      printings: previousPrintings.size,
    },
    next: { cards: next.cards.length, sets: next.sets.length, printings: nextPrintings.size },
    addedCardIds: sortedDifference(new Set(nextCards.keys()), new Set(previousCards.keys())),
    removedCardIds: sortedDifference(new Set(previousCards.keys()), new Set(nextCards.keys())),
    changedCardIds,
    addedSetIds: sortedDifference(nextSets, previousSets),
    removedSetIds: sortedDifference(previousSets, nextSets),
    changedSetIds: [...previousSets]
      .filter(
        (id) =>
          nextSetData.has(id) &&
          JSON.stringify(previousSetData.get(id)) !== JSON.stringify(nextSetData.get(id)),
      )
      .sort(),
    addedPrintingIds: sortedDifference(nextPrintings, previousPrintings),
    removedPrintingIds: sortedDifference(previousPrintings, nextPrintings),
    changedPrintingIds: [...previousPrintings]
      .filter(
        (id) =>
          nextPrintingData.has(id) &&
          JSON.stringify(previousPrintingData.get(id)) !== JSON.stringify(nextPrintingData.get(id)),
      )
      .sort(),
    changedStableIdentityCardIds: [...previousCards.keys()]
      .filter((id) => {
        const nextCard = nextCards.get(id);
        return (
          nextCard !== undefined &&
          JSON.stringify(stableIdentity(previousCards.get(id)!)) !==
            JSON.stringify(stableIdentity(nextCard))
        );
      })
      .sort(),
    changedLegalityCardIds: [...previousCards.keys()]
      .filter((id) => {
        const nextCard = nextCards.get(id);
        return (
          nextCard !== undefined &&
          JSON.stringify(previousCards.get(id)!.legalities) !== JSON.stringify(nextCard.legalities)
        );
      })
      .sort(),
    changedImageSourcePrintingIds: [...previousPrintings]
      .filter(
        (id) =>
          nextPrintingData.has(id) &&
          (sourceImages
            ? sourceImages.previous.get(id) !== sourceImages.next.get(id)
            : previousPrintingData.get(id)!.imageUrl !== nextPrintingData.get(id)!.imageUrl),
      )
      .sort(),
    addedTypeTokens: sortedDifference(typeTokens(next), typeTokens(previous)),
    removedTypeTokens: sortedDifference(typeTokens(previous), typeTokens(next)),
  };
}

export function assertNoCatalogRemovals(report: FleshAndBloodCatalogChangeReport): void {
  if (
    report.removedCardIds.length > 0 ||
    report.removedSetIds.length > 0 ||
    report.removedPrintingIds.length > 0 ||
    report.changedStableIdentityCardIds.length > 0
  ) {
    throw new FleshAndBloodCatalogError(
      `Source refresh removes ${report.removedCardIds.length} card(s), ${report.removedSetIds.length} set(s), and ${report.removedPrintingIds.length} printing(s), with ${report.changedStableIdentityCardIds.length} stable identity change(s); rerun with the explicit removal flag after reviewing the generated diff.`,
    );
  }
}

export function normalizeFabCubeCatalog(
  raw: unknown,
  context: FleshAndBloodImportContext,
  assetPrintings: FleshAndBloodAssetPrintings = new Map(),
): PopulatedFleshAndBloodCatalogSource {
  const result = FabCubePayloadSchema.safeParse(raw);
  if (!result.success) throw schemaError("fab-cube", result.error);

  const locale = canonicalLocale(context.locale);
  const setById = new Map(result.data.sets.map((set) => [set.id, normalizeSet(set)]));
  const cards = withOfficialReleaseNoteCards(result.data.cards).map((card) =>
    normalizeCard(card, locale, assetPrintings),
  );

  // Ensure every referenced set is present; add any missing set stubs using the set code.
  const referencedSetIds = new Set(cards.flatMap((card) => card.printings.map((p) => p.setCode)));
  for (const setId of referencedSetIds) {
    if (!setById.has(setId)) {
      setById.set(setId, { id: setId, name: setId });
    }
  }

  const provenance: FleshAndBloodCatalogProvenance = {
    source: context.source,
    sourceUrl: context.sourceUrl,
    sourceRef: context.sourceRef,
    locale,
    fetchedAt: context.fetchedAt,
    sourceVersion: context.sourceVersion,
    sha256: context.sha256,
    productionEligible: false,
  };

  const catalog = sortCatalog({
    schemaVersion: 1,
    game: "flesh-and-blood",
    provenance,
    sets: [...setById.values()],
    cards,
  });
  rejectDuplicateIdentities(catalog);
  return catalog;
}

function canonicalLocale(locale: string): string {
  try {
    return Intl.getCanonicalLocales(locale.replaceAll("_", "-"))[0] ?? locale;
  } catch (error) {
    throw new FleshAndBloodCatalogError(`Invalid catalog locale: ${locale}`, { cause: error });
  }
}

function parseSnapshot(value: unknown): FleshAndBloodRawSnapshot {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new FleshAndBloodCatalogError("Raw snapshot must be an object.");
  }
  const snapshot = value as Partial<FleshAndBloodRawSnapshot>;
  if (
    snapshot.schemaVersion !== 2 ||
    snapshot.source !== "fab-cube" ||
    typeof snapshot.sourceUrl !== "string" ||
    typeof snapshot.sourceRef !== "string" ||
    typeof snapshot.locale !== "string" ||
    typeof snapshot.fetchedAt !== "string" ||
    typeof snapshot.sourceVersion !== "string" ||
    !/^[a-f0-9]{40}$/.test(snapshot.sourceVersion) ||
    !Array.isArray(snapshot.artifacts) ||
    snapshot.artifacts.some(
      (entry) =>
        typeof entry.path !== "string" ||
        typeof entry.sourceUrl !== "string" ||
        typeof entry.sha256 !== "string" ||
        !/^[a-f0-9]{64}$/.test(entry.sha256),
    ) ||
    typeof snapshot.sha256 !== "string" ||
    !("payload" in snapshot)
  ) {
    throw new FleshAndBloodCatalogError("Raw snapshot metadata is malformed.");
  }
  const parsed = snapshot as FleshAndBloodRawSnapshot;
  const actualSha256 = createHash("sha256").update(JSON.stringify(parsed.payload)).digest("hex");
  if (parsed.sha256 !== actualSha256) {
    throw new FleshAndBloodCatalogError("Raw snapshot SHA-256 does not match its payload.");
  }
  return parsed;
}

export function fabCubeImageSourcesFromSnapshot(
  snapshotValue: unknown,
): ReadonlyMap<string, string | null> {
  const snapshot = parseSnapshot(snapshotValue);
  const result = FabCubePayloadSchema.safeParse(snapshot.payload);
  if (!result.success) throw schemaError("fab-cube", result.error);
  return new Map(
    result.data.cards.flatMap((card) =>
      card.printings.map((printing) => [printing.unique_id, printing.image_url] as const),
    ),
  );
}

export function catalogFromSnapshot(
  snapshotValue: unknown,
  assetPrintings: FleshAndBloodAssetPrintings = new Map(),
): PopulatedFleshAndBloodCatalogSource {
  const snapshot = parseSnapshot(snapshotValue);
  return normalizeFabCubeCatalog(
    snapshot.payload,
    {
      source: snapshot.source,
      sourceUrl: snapshot.sourceUrl,
      sourceRef: snapshot.sourceRef,
      locale: snapshot.locale,
      fetchedAt: snapshot.fetchedAt,
      sourceVersion: snapshot.sourceVersion,
      sha256: snapshot.sha256,
    },
    assetPrintings,
  );
}

const FORBIDDEN_EXECUTABLE_KEYS = new Set([
  "ability",
  "abilities",
  "effect",
  "effects",
  "trigger",
  "triggers",
  "target",
  "targets",
  "legalActions",
  "engineAction",
]);

/** Legacy hash-disambiguation slug emitted by the original `uniqueSlug`
 * algorithm: `name-{last4OfCanonicalId}-{n}` (e.g. `cold-snap-pHPL-2`). The
 * catalog is regenerated with color-suffixed slugs, so any match signals a
 * stale catalog that must be rebuilt. */
const HASH_DISAMBIGUATED_SLUG = /^[a-z0-9-]+-[a-z0-9]{4}-\d+$/;

/** Reject slug regressions so the catalog can never silently carry the legacy
 * hash-disambiguation identity again:
 *  - No card may keep a `{last4OfCanonicalId}-{n}` hash slug.
 *  - Every pitch card must end with its slugified color suffix, since color is
 *    the canonical disambiguator for same-name pitch variants. */
function assertCanonicalSlugs(catalog: FleshAndBloodCatalog): void {
  for (const card of catalog.cards) {
    if (HASH_DISAMBIGUATED_SLUG.test(card.slug)) {
      throw new FleshAndBloodCatalogError(
        `Card ${card.canonicalId} has a legacy hash-disambiguated slug "${card.slug}"; regenerate the catalog with color-suffixed slugs.`,
      );
    }
    const color = "color" in card && typeof card.color === "string" ? card.color : undefined;
    if (color && !card.slug.endsWith(`-${color.toLowerCase()}`)) {
      throw new FleshAndBloodCatalogError(
        `Card ${card.canonicalId} (color "${color}") is missing its color suffix in slug "${card.slug}".`,
      );
    }
  }
}

function assertNoExecutableRuleKeys(value: unknown, pathLabel = "catalog"): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoExecutableRuleKeys(entry, `${pathLabel}[${index}]`));
    return;
  }
  if (value === null || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value)) {
    if (FORBIDDEN_EXECUTABLE_KEYS.has(key)) {
      throw new FleshAndBloodCatalogError(
        `Executable rule field is forbidden at ${pathLabel}.${key}.`,
      );
    }
    assertNoExecutableRuleKeys(nested, `${pathLabel}.${key}`);
  }
}

export function verifyFleshAndBloodCatalog(
  catalog: FleshAndBloodCatalog,
): asserts catalog is PopulatedFleshAndBloodCatalog {
  if (catalog.schemaVersion !== 1 || catalog.game !== "flesh-and-blood") {
    throw new FleshAndBloodCatalogError("Catalog identity or schema version is invalid.");
  }
  if (!catalog.provenance) {
    throw new FleshAndBloodCatalogError("Catalog provenance is required for generated data.");
  }
  if (catalog.provenance.source !== "fab-cube") {
    throw new FleshAndBloodCatalogError("Catalog must originate from The FAB Cube.");
  }
  if (!catalog.provenance.sourceRef.trim()) {
    throw new FleshAndBloodCatalogError("Catalog provenance source ref is required.");
  }
  if (!/^[a-f0-9]{40}$/.test(catalog.provenance.sourceVersion)) {
    throw new FleshAndBloodCatalogError("Catalog provenance source commit is invalid.");
  }
  if (!/^[a-f0-9]{64}$/.test(catalog.provenance.sha256)) {
    throw new FleshAndBloodCatalogError("Catalog provenance SHA-256 is invalid.");
  }
  if (Number.isNaN(Date.parse(catalog.provenance.fetchedAt))) {
    throw new FleshAndBloodCatalogError("Catalog provenance fetchedAt is invalid.");
  }
  canonicalLocale(catalog.provenance.locale);
  rejectDuplicateIdentities(catalog);
  assertCanonicalSlugs(catalog);
  assertNoExecutableRuleKeys(catalog);
}

export function auditFleshAndBloodCatalog(
  catalog: FleshAndBloodCatalog,
): FleshAndBloodCatalogAudit {
  verifyFleshAndBloodCatalog(catalog);

  const printings = catalog.cards.flatMap((card) =>
    card.printings.map((printing) => ({ cardCanonicalId: card.canonicalId, printing })),
  );
  const sourceCounts = new Map<string, number>();
  const cardsByArt = new Map<string, Set<string>>();
  const printingsByPhysicalIdentity = new Map<string, string[]>();
  const missingImagePrintingIds: string[] = [];
  const nonHttpsImagePrintingIds: string[] = [];

  for (const { cardCanonicalId, printing } of printings) {
    const imageUrl = printing.imageUrl.trim();
    if (imageUrl === "") {
      missingImagePrintingIds.push(printing.id);
    } else {
      sourceCounts.set(imageUrl, (sourceCounts.get(imageUrl) ?? 0) + 1);
      try {
        if (new URL(imageUrl).protocol !== "https:") nonHttpsImagePrintingIds.push(printing.id);
      } catch {
        nonHttpsImagePrintingIds.push(printing.id);
      }
    }

    const artCards = cardsByArt.get(printing.artId) ?? new Set<string>();
    artCards.add(cardCanonicalId);
    cardsByArt.set(printing.artId, artCards);

    const physicalKey = [
      cardCanonicalId,
      printing.setCode,
      printing.collectorNumber,
      printing.finish,
      printing.edition,
    ].join(":");
    const ids = printingsByPhysicalIdentity.get(physicalKey) ?? [];
    ids.push(printing.id);
    printingsByPhysicalIdentity.set(physicalKey, ids);
  }

  const crossCardArtworkGroups = Object.fromEntries(
    [...cardsByArt.entries()]
      .filter(([, cardIds]) => cardIds.size > 1)
      .map(([artId, cardIds]) => [artId, [...cardIds].sort()]),
  );
  const physicalIdentityCollisions = Object.fromEntries(
    [...printingsByPhysicalIdentity.entries()]
      .filter(([, printingIds]) => printingIds.length > 1)
      .map(([key, printingIds]) => [key, [...printingIds].sort()]),
  );

  return {
    canonicalCardCount: catalog.cards.length,
    printingCount: printings.length,
    uniqueSourceImageCount: sourceCounts.size,
    printingsSharingSourceImages: [...sourceCounts.values()].reduce(
      (count, occurrences) => count + Math.max(0, occurrences - 1),
      0,
    ),
    missingImagePrintingIds: missingImagePrintingIds.sort(),
    nonHttpsImagePrintingIds: nonHttpsImagePrintingIds.sort(),
    crossCardArtworkGroups,
    physicalIdentityCollisions,
  };
}

export function verifyFleshAndBloodTranslationCatalog(
  translations: FleshAndBloodTranslationCatalog,
  catalog: FleshAndBloodCatalog,
): void {
  verifyFleshAndBloodCatalog(catalog);
  if (translations.schemaVersion !== 1 || translations.game !== "flesh-and-blood") {
    throw new FleshAndBloodCatalogError(
      "Translation catalog identity or schema version is invalid.",
    );
  }
  canonicalLocale(translations.locale);
  if (translations.provenance) {
    if (canonicalLocale(translations.provenance.locale) !== canonicalLocale(translations.locale)) {
      throw new FleshAndBloodCatalogError(
        "Translation provenance locale does not match the translation catalog locale.",
      );
    }
    if (!/^[a-f0-9]{40}$/.test(translations.provenance.sourceVersion)) {
      throw new FleshAndBloodCatalogError("Translation provenance source version is invalid.");
    }
    if (!/^[a-f0-9]{64}$/.test(translations.provenance.sha256)) {
      throw new FleshAndBloodCatalogError("Translation provenance hash is invalid.");
    }
  }
  if (translations.catalogSha256 !== catalog.provenance.sha256) {
    throw new FleshAndBloodCatalogError(
      "Translation catalog does not match the card catalog revision.",
    );
  }

  const expectedCards = new Set(catalog.cards.map((card) => card.canonicalId));
  const translatedCards = new Set<string>();
  for (const translation of translations.cards) {
    if (translatedCards.has(translation.canonicalId)) {
      throw new FleshAndBloodCatalogError(
        `Duplicate translated card identity: ${translation.canonicalId}`,
      );
    }
    if (!expectedCards.has(translation.canonicalId)) {
      throw new FleshAndBloodCatalogError(
        `Translation references unknown card: ${translation.canonicalId}`,
      );
    }
    translatedCards.add(translation.canonicalId);
  }
  const language = new Intl.Locale(translations.locale).language;
  const missingCards = [...expectedCards].filter((id) => !translatedCards.has(id));
  if (language === "en" && missingCards.length > 0) {
    throw new FleshAndBloodCatalogError(
      `Translation catalog is missing ${missingCards.length} card(s), starting with ${missingCards[0]}.`,
    );
  }

  const expectedSets = new Set(catalog.sets.map((set) => set.id));
  const translatedSets = new Set<string>();
  for (const translation of translations.sets) {
    if (translatedSets.has(translation.setId)) {
      throw new FleshAndBloodCatalogError(
        `Duplicate translated set identity: ${translation.setId}`,
      );
    }
    if (!expectedSets.has(translation.setId)) {
      throw new FleshAndBloodCatalogError(
        `Translation references unknown set: ${translation.setId}`,
      );
    }
    translatedSets.add(translation.setId);
  }
  const missingSets = [...expectedSets].filter((id) => !translatedSets.has(id));
  if (language === "en" && missingSets.length > 0) {
    throw new FleshAndBloodCatalogError(
      `Translation catalog is missing ${missingSets.length} set(s), starting with ${missingSets[0]}.`,
    );
  }
}

export function formatFleshAndBloodCatalogJson(catalog: FleshAndBloodCatalogSource): string {
  verifyFleshAndBloodCatalog(catalog);
  return `${JSON.stringify(compactFleshAndBloodCatalog(catalog), null, 2)}\n`;
}

export function splitFleshAndBloodCatalog(catalog: FleshAndBloodCatalogSource): {
  cardData: SparseFleshAndBloodCardDataCatalog;
  printingData: SparseFleshAndBloodPrintingsCatalog;
} {
  const compact = compactFleshAndBloodCatalog(catalog);
  return {
    cardData: {
      ...compact,
      cards: compact.cards.map(({ printings: _printings, ...card }) => card),
    },
    printingData: {
      schemaVersion: compact.schemaVersion,
      game: compact.game,
      catalogSha256: catalog.provenance?.sha256 ?? "",
      printingsByCanonicalId: Object.fromEntries(
        compact.cards.map((card) => [card.canonicalId, card.printings]),
      ),
    },
  };
}

export function formatFleshAndBloodCardDataJson(catalog: FleshAndBloodCatalogSource): string {
  return `${JSON.stringify(splitFleshAndBloodCatalog(catalog).cardData, null, 2)}\n`;
}

export function formatFleshAndBloodPrintingsJson(catalog: FleshAndBloodCatalogSource): string {
  return `${JSON.stringify(splitFleshAndBloodCatalog(catalog).printingData, null, 2)}\n`;
}

function compactFormatLegality(
  legality: FleshAndBloodFormatLegality,
): Partial<FleshAndBloodFormatLegality> | undefined {
  const compact = {
    ...(legality.legal === false ? { legal: false } : {}),
    ...(legality.banned ? { banned: true } : {}),
    ...(legality.suspended ? { suspended: true } : {}),
    ...(legality.livingLegend ? { livingLegend: true } : {}),
    ...(legality.restricted ? { restricted: true } : {}),
  };
  return Object.keys(compact).length > 0 ? compact : undefined;
}

export function compactFleshAndBloodCatalog(
  catalog: FleshAndBloodCatalogSource,
): SparseFleshAndBloodCatalog {
  return {
    ...catalog,
    cards: catalog.cards.map((card) => {
      const legalities = Object.fromEntries(
        Object.entries(card.legalities).flatMap(([format, legality]) => {
          const compact = compactFormatLegality(legality);
          return compact ? [[format, compact]] : [];
        }),
      );
      return {
        ...card,
        printings: card.printings.map((printing) => {
          const { artVariationIds, imageRotationDegrees, edition, ...requiredPrinting } = printing;
          return {
            ...requiredPrinting,
            ...(artVariationIds && artVariationIds.length > 0 ? { artVariationIds } : {}),
            ...(imageRotationDegrees ? { imageRotationDegrees } : {}),
            ...(edition !== "N" ? { edition } : {}),
          };
        }),
        ...(card.traits.length > 0 ? { traits: card.traits } : { traits: undefined }),
        ...(card.abilitiesAndEffects.length > 0
          ? { abilitiesAndEffects: card.abilitiesAndEffects }
          : { abilitiesAndEffects: undefined }),
        ...(card.abilityAndEffectKeywords.length > 0
          ? { abilityAndEffectKeywords: card.abilityAndEffectKeywords }
          : { abilityAndEffectKeywords: undefined }),
        ...(card.grantedKeywords.length > 0
          ? { grantedKeywords: card.grantedKeywords }
          : { grantedKeywords: undefined }),
        ...(card.removedKeywords.length > 0
          ? { removedKeywords: card.removedKeywords }
          : { removedKeywords: undefined }),
        ...(card.interactsWithKeywords.length > 0
          ? { interactsWithKeywords: card.interactsWithKeywords }
          : { interactsWithKeywords: undefined }),
        ...(card.playedHorizontally
          ? { playedHorizontally: true }
          : { playedHorizontally: undefined }),
        ...(Object.keys(legalities).length > 0 ? { legalities } : { legalities: undefined }),
      };
    }),
  };
}

export function formatFleshAndBloodCatalogModule(
  cardDataFilename = "flesh-and-blood-card-data.json",
  printingsFilename = "flesh-and-blood-printings.json",
): string {
  return [
    "import type {",
    "  SparseFleshAndBloodCardDataCatalog,",
    "  SparseFleshAndBloodPrintingsCatalog,",
    '} from "@tcg/flesh-and-blood-types/catalog";',
    'import { hydrateFleshAndBloodCatalogParts } from "../../../types/src/catalog-defaults.ts";',
    `import cardDataJson from "./${cardDataFilename}" with { type: "json" };`,
    `import printingsJson from "./${printingsFilename}" with { type: "json" };`,
    "",
    "export const fleshAndBloodCatalog = hydrateFleshAndBloodCatalogParts(",
    "  cardDataJson as SparseFleshAndBloodCardDataCatalog,",
    "  printingsJson as SparseFleshAndBloodPrintingsCatalog,",
    ");",
    "",
  ].join("\n");
}

export function formatFleshAndBloodCardDataModule(
  cardDataFilename = "flesh-and-blood-card-data.json",
): string {
  return [
    'import type { SparseFleshAndBloodCardDataCatalog } from "@tcg/flesh-and-blood-types/catalog";',
    'import { hydrateFleshAndBloodCardDataCatalog } from "../../../types/src/catalog-defaults.ts";',
    `import cardDataJson from "./${cardDataFilename}" with { type: "json" };`,
    "",
    "export const fleshAndBloodCardData = hydrateFleshAndBloodCardDataCatalog(",
    "  cardDataJson as SparseFleshAndBloodCardDataCatalog,",
    ");",
    "",
  ].join("\n");
}

export function extractFleshAndBloodTranslations(
  catalog: FleshAndBloodCatalog,
): FleshAndBloodTranslationCatalog {
  verifyFleshAndBloodCatalog(catalog);
  const translations: FleshAndBloodTranslationCatalog = {
    schemaVersion: 1,
    game: "flesh-and-blood",
    locale: catalog.provenance.locale,
    provenance: catalog.provenance,
    catalogSha256: catalog.provenance.sha256,
    sets: catalog.sets.map(
      (set): FleshAndBloodSetTranslation => ({
        setId: set.id,
        name: set.name,
      }),
    ),
    cards: catalog.cards.map(
      (card): FleshAndBloodCardTranslation => ({
        canonicalId: card.canonicalId,
        name: card.name,
        ...(card.functionalTextHtml ? { functionalTextHtml: card.functionalTextHtml } : {}),
        ...(card.functionalTextPlain ? { functionalTextPlain: card.functionalTextPlain } : {}),
        ...(card.typeText ? { typeText: card.typeText } : {}),
      }),
    ),
  };
  verifyFleshAndBloodTranslationCatalog(translations, catalog);
  return translations;
}

export function formatFleshAndBloodTranslationsJson(
  translations: FleshAndBloodTranslationCatalog,
): string {
  return `${JSON.stringify(translations, null, 2)}\n`;
}

export function formatFleshAndBloodTranslationsModule(
  jsonFilename = "flesh-and-blood-translations.json",
): string {
  return [
    'import type { FleshAndBloodTranslationCatalog } from "@tcg/flesh-and-blood-types/catalog";',
    `import translationsJson from "./${jsonFilename}" with { type: "json" };`,
    "",
    "export const fleshAndBloodTranslations = translationsJson as FleshAndBloodTranslationCatalog;",
    "",
  ].join("\n");
}

export async function generateFleshAndBloodCatalogFiles(options: {
  snapshotPath: string;
  assetManifestPath: string;
  outputDirectory: string;
}): Promise<PopulatedFleshAndBloodCatalogSource> {
  const snapshot = JSON.parse(await readFile(options.snapshotPath, "utf8")) as unknown;
  const assetManifest = JSON.parse(await readFile(options.assetManifestPath, "utf8")) as unknown;
  const assetPrintings = fleshAndBloodAssetPrintingsFromManifest(assetManifest);
  const catalog = catalogFromSnapshot(snapshot, assetPrintings);

  const cardDataFilename = "flesh-and-blood-card-data.json";
  const printingsFilename = "flesh-and-blood-printings.json";
  const moduleFilename = "flesh-and-blood-catalog.ts";
  const cardDataModuleFilename = "flesh-and-blood-card-data.ts";

  await mkdir(options.outputDirectory, { recursive: true });
  for (const [filename, contents] of [
    [cardDataFilename, formatFleshAndBloodCardDataJson(catalog)],
    [printingsFilename, formatFleshAndBloodPrintingsJson(catalog)],
    [moduleFilename, formatFleshAndBloodCatalogModule(cardDataFilename, printingsFilename)],
    [cardDataModuleFilename, formatFleshAndBloodCardDataModule(cardDataFilename)],
  ] as const) {
    const target = path.join(options.outputDirectory, filename);
    const temporary = `${target}.tmp`;
    const formatted = await format(filename, contents);
    if (formatted.errors.length > 0) {
      throw new FleshAndBloodCatalogError(
        `Could not format generated catalog artifact ${filename}: ${formatted.errors
          .map((error) => error.message)
          .join(", ")}`,
      );
    }
    await writeFile(temporary, formatted.code, "utf8");
    await rename(temporary, target);
  }
  return catalog;
}
