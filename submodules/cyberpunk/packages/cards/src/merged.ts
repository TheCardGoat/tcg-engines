import {
  CYBERPUNK_CANONICAL_SET_PRIORITY,
  type CardDefinition,
  type SetCode,
  type StructuredCardDefinition,
} from "@tcg/cyberpunk-types";
import { structuredCards } from "./cards/index.ts";
import { cyberpunkArtworkManifest } from "./artwork-manifest.ts";
import { getCyberpunkArtIdForPrinting } from "./artwork.ts";

/**
 * The full runtime Cyberpunk card pool before any dedup/merge. Since the
 * canonical-card consolidation this is already slug-unique — one authored
 * definition per card under `src/cards/<type>/` — and the merge below stays as
 * the defensive canonical-selection + printing-union pass shared with the
 * platform catalog. Preview-only sets are intentionally excluded from runtime
 * card lookup and deck validation.
 */
const allStructuredCards: StructuredCardDefinition[] = structuredCards;

/**
 * Minimal shape a card must expose to participate in the cross-set merge.
 * Both the raw {@link CardDefinition} (this package) and the platform's
 * transformed `CyberpunkCard` (catalog) satisfy it, so the same algorithm can
 * be shared as the single source of truth for canonical selection + printing
 * unioning.
 */
export interface MergeablePrinting {
  id: string;
}

export interface MergeableCard {
  id: string;
  slug: string;
  set: { code: string };
  printings: MergeablePrinting[];
}

/**
 * Set priority used to pick the canonical entry when the same card appears in
 * multiple sets. Released retail sets win over lower-priority preview-style
 * sets so the released gameplay definition is authoritative.
 *
 * This MUST stay in lockstep with the catalog merge in
 * `platform/apps/general-api/src/modules/cyberpunk/service.ts`. It is exported
 * so the catalog imports it from here instead of re-declaring it.
 */
export const SET_PRIORITY = CYBERPUNK_CANONICAL_SET_PRIORITY;

/**
 * Sets that have parsed cards in the shipped runtime catalog. `SetCode` also
 * includes preview-only vocabulary, so it cannot be inferred from the
 * exhaustive priority map.
 */
export const RUNTIME_SET_CODES = [
  "promo",
  "PRM01",
  "boxtoppersretail",
  "theheistretailstarterdeck",
  "embracingpowerretailstarterdeck",
  "welcometonightcityretail",
] as const satisfies readonly SetCode[];

export function setPriority(setCode: string): number {
  return setCode in SET_PRIORITY ? SET_PRIORITY[setCode as SetCode] : 50;
}

/**
 * Given a group of cards that share an `id` (or a `slug`, in the second pass),
 * pick the most authoritative entry by {@link SET_PRIORITY} (ties broken by
 * ascending `id`) and union every member's `printings` onto it, keeping the
 * canonical's own printings first and appending unseen printings in group
 * order. All non-`printings` fields are preserved verbatim from the canonical.
 */
export function pickCanonicalAndMergePrintings<TCard extends MergeableCard>(group: TCard[]): TCard {
  if (group.length === 1) return group[0]!;

  const sorted = group.toSorted((a, b) => {
    const priorityDiff = setPriority(b.set.code) - setPriority(a.set.code);
    if (priorityDiff !== 0) return priorityDiff;
    return a.id.localeCompare(b.id);
  });

  const canonical = sorted[0]!;
  const seenPrintingIds = new Set(canonical.printings.map((printing) => printing.id));
  const mergedPrintings: MergeablePrinting[] = [...canonical.printings];

  for (const card of sorted.slice(1)) {
    for (const printing of card.printings) {
      if (!seenPrintingIds.has(printing.id)) {
        seenPrintingIds.add(printing.id);
        mergedPrintings.push(printing);
      }
    }
  }

  // Spread preserves every canonical field; only `printings` is replaced with
  // the unioned set. The cast is required because TypeScript cannot prove a
  // generic spread reconstructs `TCard` exactly, but the runtime shape is
  // identical to `canonical` with the merged printings substituted in.
  return { ...canonical, printings: mergedPrintings } as TCard;
}

/**
 * Two-pass dedup that mirrors the catalog merge exactly:
 *
 * 1. Group by `id` — identical ids are almost always the same card reprinted
 *    across sets. Keep the most authoritative version and union its printings.
 * 2. Group by `slug` — the same runtime card can also be reprinted with a NEW
 *    id across sets. The slug pass collapses these onto one canonical entry.
 *
 * Returns a slug-unique array. This is the single shared implementation used
 * by both the card catalog and the deck-save validator to prevent drift.
 */
export function mergeDuplicateCards<TCard extends MergeableCard>(cards: TCard[]): TCard[] {
  // First pass: identical IDs.
  const byId = new Map<string, TCard[]>();
  for (const card of cards) {
    const group = byId.get(card.id) ?? [];
    group.push(card);
    byId.set(card.id, group);
  }
  const dedupedById = Array.from(byId.values()).map(pickCanonicalAndMergePrintings);

  // Second pass: same card reprinted with a new ID collapses by slug.
  const bySlug = new Map<string, TCard[]>();
  for (const card of dedupedById) {
    const group = bySlug.get(card.slug) ?? [];
    group.push(card);
    bySlug.set(card.slug, group);
  }
  return Array.from(bySlug.values()).map(pickCanonicalAndMergePrintings);
}

/**
 * Slug-unique view of the Cyberpunk card pool with every cross-set printing
 * unioned onto the canonical (highest-priority set) entry. Mirrors the catalog
 * output shape but operates on raw {@link CardDefinition}s. Memoized at module
 * load.
 *
 * The merge itself stays identity-agnostic (it groups by `id`/`slug` only); the
 * authoritative canonical identity is stamped HERE, on the merged output, so
 * every consumer of the merged pool sees a stable `canonicalId == slug` and a
 * reviewed visual art identity shared by equivalent printings. Raw authored
 * `id` remains per-set and source-only (see `CardIdentity.id`).
 */
const mergedCyberpunkCards: CardDefinition[] = mergeDuplicateCards(allStructuredCards).map(
  (card) => {
    const artwork = Object.entries(cyberpunkArtworkManifest).find(
      ([slug]) => slug === card.slug,
    )?.[1];
    if (!artwork) throw new Error(`Missing Cyberpunk art manifest for ${card.slug}`);
    return {
      ...card,
      canonicalId: card.slug,
      printings: card.printings.map((printing) => {
        const artId = getCyberpunkArtIdForPrinting(printing.id);
        if (!artId) throw new Error(`Missing Cyberpunk art identity for printing ${printing.id}`);
        return { ...printing, artId };
      }),
    };
  },
);

/**
 * Legacy catalog slugs that embedded accent-mangling artifacts (a combining
 * mark turned into a stray hyphen by an upstream slugifier, e.g. "Gilded
 * Matón" → `gilded-mato-n`). Catalog slugs are accent-folded since the
 * scraper converged on the canonical slugify, so these map onto the folded
 * canonical slug. Kept as lookup aliases so deck rows, URLs, and snapshots
 * stored under the legacy slugs keep resolving.
 */
export const legacyAccentMangledSlugAliases: Readonly<Record<string, string>> = {
  "gilded-mato-n": "gilded-maton",
  "el-sombrero-n-la-venganza-lenta": "el-sombreron-la-venganza-lenta",
  "judy-a-lvarez-braindance-maestro": "judy-alvarez-braindance-maestro",
  "judy-a-lvarez-nothing-to-doubt": "judy-alvarez-nothing-to-doubt",
  "les-e-le-mens": "les-elemens",
  "muamar-reyes-el-capita-n": "muamar-reyes-el-capitan",
};

/**
 * Fold a printed name the way stored deck rows are slugified: decompose
 * accents, drop marks, then hyphenate. Catalog slugs are folded the same way
 * (`gilded-maton`), so this is an exact match for current slugs and only
 * differs for data stored under legacy aliases.
 */
function foldDisplaySlug(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_\u2014-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function indexUnambiguousDerivedDisplaySlugs(
  cards: readonly CardDefinition[],
  byId: Map<string, CardDefinition>,
): void {
  const derived = new Map<string, CardDefinition>();
  const ambiguous = new Set<string>();
  for (const card of cards) {
    const slug = foldDisplaySlug(card.displayName);
    if (!slug) continue;
    const existing = derived.get(slug);
    if (existing && existing.canonicalId !== card.canonicalId) {
      derived.delete(slug);
      ambiguous.add(slug);
      continue;
    }
    if (!ambiguous.has(slug)) derived.set(slug, card);
  }
  for (const [slug, card] of derived) {
    if (!byId.has(slug)) byId.set(slug, card);
  }
}

/**
 * Lookup keyed by each stable canonical slug, merged runtime id, authored
 * source id, and every printing id on the merged cards. With one authored
 * definition per slug, non-canonical set versions survive only as `printings[]`
 * entries — indexing those ids keeps stored deck rows, art selections, and
 * format-specific decks resolving to the canonical
 * definition that owns them. Preview-only ids are intentionally absent, so
 * callers can keep a strict "Unknown Cyberpunk card" rejection while resolving
 * any legitimately stored identity to its complete printing set. Memoized at
 * module load.
 */
const mergedCyberpunkCardsById: ReadonlyMap<string, CardDefinition> = (() => {
  const slugToMerged = new Map<string, CardDefinition>();
  for (const merged of mergedCyberpunkCards) {
    slugToMerged.set(merged.slug, merged);
  }
  const byId = new Map<string, CardDefinition>();
  for (const merged of mergedCyberpunkCards) {
    byId.set(merged.canonicalId, merged);
    byId.set(merged.id, merged);
  }
  // Printing ids resolve to their owning canonical card; definition ids win
  // collisions (a printing id equal to a definition id is that card's own
  // primary printing).
  for (const merged of mergedCyberpunkCards) {
    for (const printing of merged.printings) {
      if (!byId.has(printing.id)) {
        byId.set(printing.id, merged);
      }
    }
  }
  for (const source of allStructuredCards) {
    const merged = slugToMerged.get(source.slug);
    if (merged) byId.set(source.id, merged);
  }
  indexUnambiguousDerivedDisplaySlugs(mergedCyberpunkCards, byId);
  for (const [legacySlug, canonicalSlug] of Object.entries(legacyAccentMangledSlugAliases)) {
    const merged = slugToMerged.get(canonicalSlug);
    if (merged && !byId.has(legacySlug)) byId.set(legacySlug, merged);
  }
  return byId;
})();

export function getMergedCyberpunkCards(): CardDefinition[] {
  return mergedCyberpunkCards;
}

export function getMergedCyberpunkCardsById(): ReadonlyMap<string, CardDefinition> {
  return mergedCyberpunkCardsById;
}
