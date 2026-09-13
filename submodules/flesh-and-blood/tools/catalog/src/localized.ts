import { z } from "zod";
import { runtimeImageUrls, type FleshAndBloodAssetPrintings } from "./index.ts";

import type {
  FleshAndBloodCatalogProvenance,
  FleshAndBloodCardTranslation,
  FleshAndBloodPrinting,
  FleshAndBloodRawSnapshot,
  FleshAndBloodSetTranslation,
  FleshAndBloodTranslationCatalog,
} from "@tcg/flesh-and-blood-types/catalog";

/**
 * Per-locale extraction from fab-cube's translated `json/<language>/` trees.
 *
 * The translated trees reuse the English record schema with localized display
 * text and printing art, but only cover a subset of the catalog, so this pass
 * is deliberately lenient: it requires only the identity + display-text fields
 * and joins records into the English catalog by `unique_id` (which is the
 * canonical id). Unmatched records are reported, never dropped silently.
 */

const LocalizedPrintingSchema = z
  .object({
    unique_id: z.string().min(1),
    set_printing_unique_id: z.string().min(1),
    /** Collector number within the set (fab-cube `id`). */
    id: z.string().min(1),
    set_id: z.string().min(1),
    edition: z.string(),
    foiling: z.string(),
    rarity: z.string(),
    expansion_slot: z.boolean().optional(),
    artists: z.array(z.string()).optional(),
    art_variations: z.array(z.string()).optional(),
    flavor_text: z.string().optional(),
    flavor_text_plain: z.string().optional(),
    image_url: z.union([z.string().url(), z.null()]).optional(),
    image_rotation_degrees: z.number().optional(),
  })
  .passthrough();

const LocalizedCardSchema = z
  .object({
    unique_id: z.string().min(1),
    name: z.string().min(1),
    type_text: z.string().optional(),
    functional_text: z.string().optional(),
    functional_text_plain: z.string().optional(),
    printings: z.array(LocalizedPrintingSchema).min(1),
  })
  .passthrough();

const LocalizedPayloadSchema = z.object({
  cards: z.array(LocalizedCardSchema),
  sets: z
    .array(
      z
        .object({ unique_id: z.string().min(1), id: z.string().min(1), name: z.string().min(1) })
        .passthrough(),
    )
    .optional(),
});

export interface CatalogKeyIndex {
  /** Every canonical id the English catalog owns. */
  canonicalIds: ReadonlySet<string>;
  /** Canonical id -> set id (used to keep only set translations we can place). */
  setIds: ReadonlySet<string>;
  sha256: string;
}

export function catalogKeyIndex(catalog: {
  provenance?: { sha256?: string } | null;
  cards: readonly { canonicalId: string }[];
  sets: readonly { id: string }[];
}): CatalogKeyIndex {
  return {
    canonicalIds: new Set(catalog.cards.map((card) => card.canonicalId)),
    setIds: new Set(catalog.sets.map((set) => set.id)),
    sha256: catalog.provenance?.sha256 ?? "",
  };
}

export interface LocalizedExtraction {
  translations: FleshAndBloodTranslationCatalog;
  printingsByCanonicalId: Record<string, FleshAndBloodPrinting[]>;
  matchedCardCount: number;
  unmatchedCardIds: readonly string[];
  matchedSetCount: number;
  unmatchedSetIds: readonly string[];
}

function canonicalLocale(locale: string): string {
  try {
    return Intl.getCanonicalLocales(locale.replaceAll("_", "-"))[0] ?? locale;
  } catch {
    throw new Error(`Invalid localized snapshot locale: ${locale}`);
  }
}

function printingFromLocalized(
  raw: z.infer<typeof LocalizedPrintingSchema>,
  locale: string,
  canonicalId: string,
  assetPrintings: FleshAndBloodAssetPrintings,
): FleshAndBloodPrinting {
  const externalIds: { fabCube: string } = { fabCube: raw.unique_id };
  return {
    id: raw.unique_id,
    artId: raw.set_printing_unique_id,
    setPrintingId: raw.set_printing_unique_id,
    setCode: raw.set_id,
    collectorNumber: raw.id,
    rarity: raw.rarity,
    ...runtimeImageUrls(raw.unique_id, canonicalId, assetPrintings),
    locale,
    artists: raw.artists ?? [],
    artVariationIds: raw.art_variations ?? [],
    finish: raw.foiling,
    edition: raw.edition,
    expansionSlot: raw.expansion_slot ?? false,
    externalIds,
    ...(raw.flavor_text ? { flavorText: raw.flavor_text } : {}),
    ...(raw.image_rotation_degrees ? { imageRotationDegrees: raw.image_rotation_degrees } : {}),
  };
}

function snapshotProvenance(
  snapshot: FleshAndBloodRawSnapshot,
  locale: string,
): FleshAndBloodCatalogProvenance {
  return {
    source: snapshot.source,
    sourceUrl: snapshot.sourceUrl,
    sourceRef: snapshot.sourceRef,
    locale,
    fetchedAt: snapshot.fetchedAt,
    sourceVersion: snapshot.sourceVersion,
    sha256: snapshot.sha256,
    productionEligible: false,
  };
}

export function extractLocalizedCatalogData(options: {
  snapshot: FleshAndBloodRawSnapshot;
  keys: CatalogKeyIndex;
  assetPrintings: FleshAndBloodAssetPrintings;
}): LocalizedExtraction {
  if (options.snapshot.locale === "en-US") {
    throw new Error(
      "The English snapshot is the full catalog and must not be extracted as a translation layer.",
    );
  }
  const locale = canonicalLocale(options.snapshot.locale);
  const payload = LocalizedPayloadSchema.parse(options.snapshot.payload);

  const translations: FleshAndBloodCardTranslation[] = [];
  const printingsByCanonicalId: Record<string, FleshAndBloodPrinting[]> = {};
  const unmatchedCardIds: string[] = [];
  const seenCardIds = new Set<string>();
  const seenPrintingIds = new Set<string>();

  for (const card of payload.cards) {
    if (seenCardIds.has(card.unique_id)) {
      throw new Error(`Duplicate localized card identity: ${card.unique_id}`);
    }
    seenCardIds.add(card.unique_id);
    if (!options.keys.canonicalIds.has(card.unique_id)) {
      unmatchedCardIds.push(card.unique_id);
      continue;
    }
    const canonicalId = card.unique_id;
    for (const printing of card.printings) {
      if (seenPrintingIds.has(printing.unique_id)) {
        throw new Error(`Duplicate localized printing identity: ${printing.unique_id}`);
      }
      seenPrintingIds.add(printing.unique_id);
    }
    translations.push({
      canonicalId,
      name: card.name,
      ...(card.functional_text ? { functionalTextHtml: card.functional_text } : {}),
      ...(card.functional_text_plain ? { functionalTextPlain: card.functional_text_plain } : {}),
      ...(card.type_text ? { typeText: card.type_text } : {}),
    });
    printingsByCanonicalId[canonicalId] = card.printings.map((printing) =>
      printingFromLocalized(printing, locale, canonicalId, options.assetPrintings),
    );
  }

  const enSetIds = options.keys.setIds;
  const unmatchedSetIds = (payload.sets ?? [])
    .filter((set) => !enSetIds.has(set.id))
    .map((set) => set.id)
    .sort();
  const localizedSets: FleshAndBloodSetTranslation[] = (payload.sets ?? [])
    .filter((set) => enSetIds.has(set.id))
    .map((set) => ({ setId: set.id, name: set.name }));

  const duplicateSetId = localizedSets.find(
    (set, index) => localizedSets.findIndex((candidate) => candidate.setId === set.setId) !== index,
  )?.setId;
  if (duplicateSetId) throw new Error(`Duplicate localized set identity: ${duplicateSetId}`);

  translations.sort((left, right) => left.canonicalId.localeCompare(right.canonicalId));
  localizedSets.sort((left, right) => left.setId.localeCompare(right.setId));
  for (const printings of Object.values(printingsByCanonicalId)) {
    printings.sort((left, right) => left.id.localeCompare(right.id));
  }

  const provenance = snapshotProvenance(options.snapshot, locale);

  return {
    translations: {
      schemaVersion: 1,
      game: "flesh-and-blood",
      locale,
      provenance,
      // The English catalog sha anchors the canonical-id keying: if the
      // English catalog is re-ingested with new ids, per-locale files must be
      // regenerated alongside it.
      catalogSha256: options.keys.sha256,
      sets: localizedSets,
      cards: translations,
    },
    printingsByCanonicalId,
    matchedCardCount: translations.length,
    unmatchedCardIds: unmatchedCardIds.sort(),
    matchedSetCount: localizedSets.length,
    unmatchedSetIds,
  };
}
