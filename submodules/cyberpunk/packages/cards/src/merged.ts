import type { CardDefinition, StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { prm01Cards } from "./PRM01/index.ts";
import { boxToppersRetailCards } from "./boxtoppersretail/index.ts";
import { promoCards } from "./promo/index.ts";
import { theHeistRetailStarterDeckCards } from "./theheistretailstarterdeck/index.ts";
import { embracingPowerRetailStarterDeckCards } from "./embracingpowerretailstarterdeck/index.ts";
import { welcomeToNightCityRetailCards } from "./welcometonightcityretail/index.ts";

/**
 * The full runtime Cyberpunk card pool before any dedup/merge, assembled from
 * the exported set arrays. This mirrors the assembly in `src/index.ts` and
 * `src/bundle.ts`; preview-only sets are intentionally excluded from runtime
 * card lookup and deck validation.
 */
const allStructuredCards: StructuredCardDefinition[] = [
  ...promoCards,
  ...prm01Cards,
  ...boxToppersRetailCards,
  ...theHeistRetailStarterDeckCards,
  ...embracingPowerRetailStarterDeckCards,
  ...welcomeToNightCityRetailCards,
];

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
export const SET_PRIORITY: Record<string, number> = {
  welcometonightcityretail: 100,
  theheistretailstarterdeck: 90,
  embracingpowerretailstarterdeck: 90,
  boxtoppersretail: 80,
  promo: 70,
  PRM01: 70,
};

export function setPriority(setCode: string): number {
  return SET_PRIORITY[setCode] ?? 50;
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
 * every consumer of the merged pool sees a stable `canonicalId == slug` and
 * each printing's `artId == printing.id` (the 1:1 degenerate art tier — RFC §3,
 * §4, §7). Raw authored `id` is per-set and source-only (see `CardIdentity.id`).
 */
const mergedCyberpunkCards: CardDefinition[] = mergeDuplicateCards(allStructuredCards).map(
  (card) => ({
    ...card,
    canonicalId: card.slug,
    printings: card.printings.map((printing) => ({ ...printing, artId: printing.id })),
  }),
);

/**
 * Lookup keyed by every `id` present in the runtime card pool. Preview-only
 * ids are intentionally absent, so callers can keep a strict "Unknown
 * Cyberpunk card" rejection while resolving any legitimately stored runtime
 * card id to its complete printing set. Memoized at module load.
 */
const mergedCyberpunkCardsById: ReadonlyMap<string, CardDefinition> = (() => {
  const slugToMerged = new Map<string, CardDefinition>();
  for (const merged of mergedCyberpunkCards) {
    slugToMerged.set(merged.slug, merged);
  }
  const byId = new Map<string, CardDefinition>();
  for (const source of allStructuredCards) {
    const merged = slugToMerged.get(source.slug);
    if (merged) byId.set(source.id, merged);
  }
  return byId;
})();

export function getMergedCyberpunkCards(): CardDefinition[] {
  return mergedCyberpunkCards;
}

export function getMergedCyberpunkCardsById(): ReadonlyMap<string, CardDefinition> {
  return mergedCyberpunkCardsById;
}
