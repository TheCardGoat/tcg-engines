import type { CardCatalog, DeckList } from "@tcg/cyberpunk-engine";
import type { CardColor, CardDefinition } from "@tcg/cyberpunk-types";
import { structuredCards } from "@tcg/cyberpunk-cards";

const TARGET_DECK_SIZE = 40;

/**
 * Real catalog backed by `@tcg/cyberpunk-cards`. Keys cards by `slug` so
 * deck lists reference cards the same way the engine fixtures do. Includes
 * every set (alpha + spoiler + promo) so deck-builders have a full pool.
 */
export function createRealCatalog(): CardCatalog {
  const map = new Map<string, CardDefinition>();
  for (const card of structuredCards) {
    map.set(card.slug, card as unknown as CardDefinition);
    map.set(card.id, card as unknown as CardDefinition);
  }
  return {
    get(slug) {
      return map.get(slug);
    },
    *entries() {
      yield* map.entries();
    },
    get size() {
      return map.size;
    },
  };
}

interface CardLite {
  slug: string;
  type: string;
  ram?: number;
  color?: CardColor;
}

/**
 * Build a deterministic, RAM-aware 40-card deck from the real card pool.
 *
 *   1. Pick the first 3 legends (sorted by slug) — that fixes the
 *      RAM-by-color budget for the main deck.
 *   2. Walk every non-legend card in slug order; include it if doing so
 *      stays inside the color's RAM budget. Each include consumes 1 from
 *      that color's budget.
 *   3. Refill the budget when all colors hit zero (a real deck repeats
 *      cards anyway — there are typically more deck slots than unique
 *      cards in the alpha pool).
 *   4. Pad with the lowest-slug card if we still fall short of 40 (e.g.
 *      a budget-exhausted edge case) — keeps the engine happy without
 *      crashing on a too-small deck.
 *
 * Same deck for both players so symmetric smoke runs surface real-card-
 * text issues without strategy-vs-deck variance.
 */
export function createRealDeckList(playerId: string): DeckList {
  const sorted = [...structuredCards].sort((a, b) => a.slug.localeCompare(b.slug));
  // Dedupe by slug before picking the legend trio — the same legend can appear
  // in multiple structured sets (e.g. alpha + retail reprint) and a deck must
  // use 3 DISTINCT legends. Slicing without dedup yields duplicate slugs.
  const legendsBySlug = new Map<string, CardLite>();
  for (const card of sorted) {
    if (card.type !== "legend") continue;
    const lite = card as CardLite;
    if (legendsBySlug.has(lite.slug)) continue;
    legendsBySlug.set(lite.slug, lite);
  }
  const legends = [...legendsBySlug.values()].slice(0, 3);
  if (legends.length < 3) {
    throw new Error(`Need at least 3 legends in the catalog; found ${legends.length}`);
  }

  const colorBudget = legends.reduce<Record<string, number>>((acc, legend) => {
    if (!legend.color || !legend.ram) return acc;
    acc[legend.color] = (acc[legend.color] ?? 0) + legend.ram;
    return acc;
  }, {});

  // Guard against an empty budget — would otherwise spin the deck loop
  // forever (no card's color is in `remaining`, `included` stays 0, so we
  // refill from an already-empty `colorBudget`). Happens if every chosen
  // legend lacks `color` / `ram` (or `ram === 0`, which is falsy here).
  if (Object.keys(colorBudget).length === 0) {
    const summary = legends.map((l) => `${l.slug}(color=${l.color},ram=${l.ram})`).join(", ");
    throw new Error(
      `createRealDeckList: legends produced an empty color/ram budget — cannot build a deck. Legends: ${summary}`,
    );
  }

  const nonLegend = sorted.filter((c) => c.type !== "legend") as CardLite[];
  if (nonLegend.length === 0) {
    throw new Error("No non-legend cards in the catalog");
  }

  const mainDeck: string[] = [];
  let remaining = { ...colorBudget };
  while (mainDeck.length < TARGET_DECK_SIZE) {
    let included = 0;
    for (const card of nonLegend) {
      if (mainDeck.length >= TARGET_DECK_SIZE) break;
      const color = card.color ?? "blue";
      if ((remaining[color] ?? 0) <= 0) continue;
      mainDeck.push(card.slug);
      remaining[color] = (remaining[color] ?? 0) - 1;
      included += 1;
    }
    if (included === 0) {
      // Budget exhausted before we hit 40 — refill from the legends' totals
      // and keep going. Real decks typically wrap around the pool.
      remaining = { ...colorBudget };
    }
  }

  // Fallback: if (somehow) the loop didn't fill 40, pad with the first card.
  while (mainDeck.length < TARGET_DECK_SIZE) {
    mainDeck.push(nonLegend[0]!.slug);
  }

  return {
    playerId,
    playerName: `Player ${playerId}`,
    legends: legends.map((l) => l.slug),
    mainDeck,
  };
}

export function createRealDecks(): [DeckList, DeckList] {
  return [createRealDeckList("p1"), createRealDeckList("p2")];
}
