/**
 * Gallery Parser
 *
 * Loads data/inputs/wilds-unknown-gallery.json (scraped from
 * disneylorcana.com) and synthesizes Ravensburger-shaped InputCards for
 * any gallery entry whose culture_invariant_id is absent from the
 * Ravensburger API input. This gives the pipeline a safety net for
 * cards the official API hasn't exposed yet (typically promos).
 *
 * Text fallback chain in the pipeline:
 *   Lorcast rules_text  →  Ravensburger rules_text
 * For cards seeded from the gallery, the Ravensburger fallback is the
 * gallery's own rules_text (both sources come from the same upstream,
 * so the text format is identical).
 */

import fs from "node:fs";
import path from "node:path";
import type { CardType, InputCard, InputCardVariant, RavensburgerInputJson } from "../types";

const DEFAULT_GALLERY_PATH = path.resolve(
  __dirname,
  "../../data/inputs/wilds-unknown-gallery.json",
);

interface GalleryVariant {
  variant_id: string;
  detail_image_url: string;
  foil_type?: string;
  foil_mask_url?: string;
}

export interface GalleryCard {
  id: number;
  name: string;
  subtitle: string | null;
  cardType: "characters" | "actions" | "items" | "locations";
  inkColors: string[];
  inkCost: number;
  inkConvertible: boolean;
  strength: number | null;
  willpower: number | null;
  loreValue: number | null;
  rarity: string;
  specialRarityId: string | null;
  subtypes: string[];
  rulesText: string;
  flavorText: string | null;
  abilities: unknown[];
  additionalInfo: unknown[];
  author: string;
  cardIdentifier: string;
  cardSets: string[];
  deckBuildingId: string;
  searchableKeywords: string[];
  setRotationState: string;
  sortNumber: number;
  thumbnailUrl: string;
  variants: GalleryVariant[];
}

/**
 * Load gallery JSON. Returns [] when the file is missing or malformed so
 * the pipeline keeps working in environments where the scraper hasn't
 * run. A missing file is a normal case (no warning); a malformed file is
 * reported via console.warn so the operator can investigate.
 */
export function loadGalleryJson(inputPath?: string): GalleryCard[] {
  const filePath = inputPath || DEFAULT_GALLERY_PATH;
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  Gallery file not found (skipping fallback): ${filePath}`);
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw) as GalleryCard[];
  } catch (err) {
    console.warn(
      `  ⚠️  Gallery file is malformed, skipping fallback: ${filePath} (${(err as Error).message})`,
    );
    return [];
  }
}

/**
 * Bucket a gallery card into one of Ravensburger's four card-type groups.
 * Gallery uses the same plural form ("characters" | "actions" | ...),
 * so this is a direct passthrough with a narrow type.
 */
function toBucket(cardType: GalleryCard["cardType"]): keyof RavensburgerInputJson["cards"] {
  return cardType;
}

/**
 * Narrow an `unknown[]` gallery field to `string[]`, dropping non-string
 * entries. Gallery JSON is scraped, so schema drift is possible; this
 * keeps the generator resilient without silently trusting bad data.
 */
function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function convertVariants(variants: GalleryVariant[]): InputCardVariant[] {
  return variants.map((v) => {
    const variantId: InputCardVariant["variant_id"] =
      v.variant_id === "Foiled" ? "Foiled" : "Regular";
    const out: InputCardVariant = {
      variant_id: variantId,
      detail_image_url: v.detail_image_url,
    };
    if (v.foil_type) out.foil_type = v.foil_type;
    if (v.foil_mask_url) out.foil_mask_url = v.foil_mask_url;
    return out;
  });
}

/**
 * Convert a gallery entry into the Ravensburger InputCard shape so the
 * rest of the pipeline can treat it as if it came from the official API.
 *
 * NOTE: The gallery payload omits `move_cost` for locations. If a
 * seeded location ever needs a move cost, the scraper will have to be
 * extended. Today Wilds Unknown's 8 locations are all present in
 * Ravensburger, so this isn't a live gap.
 */
export function galleryToInputCard(g: GalleryCard): InputCard & { cardType: CardType } {
  const cardTypeSingular: CardType =
    g.cardType === "characters"
      ? "character"
      : g.cardType === "locations"
        ? "location"
        : g.cardType === "items"
          ? "item"
          : "action";

  const input: InputCard & { cardType: CardType } = {
    name: g.name,
    ...(g.subtitle ? { subtitle: g.subtitle } : {}),
    ...(g.strength != null ? { strength: g.strength } : {}),
    ...(g.willpower != null ? { willpower: g.willpower } : {}),
    ...(cardTypeSingular === "location"
      ? { lore: g.loreValue ?? undefined }
      : { quest_value: g.loreValue ?? undefined }),
    rarity: g.rarity,
    ...(g.specialRarityId ? { special_rarity_id: g.specialRarityId } : {}),
    ink_cost: g.inkCost,
    author: g.author,
    sort_number: g.sortNumber,
    additional_info: toStringArray(g.additionalInfo),
    ink_convertible: g.inkConvertible,
    abilities: toStringArray(g.abilities),
    subtypes: g.subtypes,
    flavor_text: g.flavorText ?? "",
    rules_text: g.rulesText,
    card_identifier: g.cardIdentifier,
    thumbnail_url: g.thumbnailUrl,
    variants: convertVariants(g.variants),
    card_sets: g.cardSets,
    magic_ink_colors: g.inkColors,
    searchable_keywords: g.searchableKeywords,
    ...(g.setRotationState ? { set_rotation_state: g.setRotationState } : {}),
    culture_invariant_id: g.id,
    ...(g.deckBuildingId ? { deck_building_id: g.deckBuildingId } : {}),
    cardType: cardTypeSingular,
  };

  return input;
}

/**
 * Collect every culture_invariant_id already present in the Ravensburger input.
 */
function collectRavensburgerIds(input: RavensburgerInputJson): Set<number> {
  const ids = new Set<number>();
  for (const bucket of ["characters", "locations", "items", "actions"] as const) {
    for (const card of input.cards[bucket] ?? []) {
      if (typeof card.culture_invariant_id === "number") {
        ids.add(card.culture_invariant_id);
      }
    }
  }
  return ids;
}

export interface GalleryFallbackStats {
  total: number;
  alreadyInRavensburger: number;
  seeded: number;
  skippedUnknownSet: number;
}

/**
 * Merge gallery entries into the Ravensburger input as a fallback for
 * missing cards. Only appends cards whose `culture_invariant_id` is
 * absent from Ravensburger AND whose set is declared in Ravensburger's
 * `card_sets` (so we never introduce an orphan set).
 */
export function mergeGalleryFallback(
  input: RavensburgerInputJson,
  gallery: GalleryCard[],
): { input: RavensburgerInputJson; stats: GalleryFallbackStats } {
  const existingIds = collectRavensburgerIds(input);
  const knownSetIds = new Set(input.card_sets.map((s) => s.id));

  const stats: GalleryFallbackStats = {
    total: gallery.length,
    alreadyInRavensburger: 0,
    seeded: 0,
    skippedUnknownSet: 0,
  };

  const buckets: RavensburgerInputJson["cards"] = {
    characters: [...input.cards.characters],
    locations: [...input.cards.locations],
    items: [...input.cards.items],
    actions: [...input.cards.actions],
  };

  for (const g of gallery) {
    if (existingIds.has(g.id)) {
      stats.alreadyInRavensburger++;
      continue;
    }
    if (!g.cardSets.some((s) => knownSetIds.has(s))) {
      stats.skippedUnknownSet++;
      continue;
    }
    const synthesized = galleryToInputCard(g);
    const bucket = toBucket(g.cardType);
    // Strip the cardType field before pushing into the bucket - InputCard
    // doesn't carry cardType; the bucket identifies the type.
    const { cardType: _cardType, ...plain } = synthesized;
    void _cardType;
    buckets[bucket].push(plain);
    stats.seeded++;
  }

  return {
    input: { ...input, cards: buckets },
    stats,
  };
}
