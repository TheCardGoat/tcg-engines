#!/usr/bin/env bun
/**
 * Scrape every card from the Wilds Unknown card gallery on
 * https://www.disneylorcana.com and write a single JSON file.
 *
 * The gallery is a Nuxt 3 SPA, but the SSR payload (a devalue-encoded
 * array under <script id="__NUXT_DATA__">) already contains the full
 * card list with every field the modal exposes — no headless browser
 * or per-card requests required.
 */

import fs from "node:fs";
import path from "node:path";

const GALLERY_URL = "https://www.disneylorcana.com/en-US/product/wilds-unknown/card-gallery";
const OUTPUT_PATH = path.resolve(__dirname, "../data/inputs/wilds-unknown-gallery.json");
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// Nuxt wraps reactive values via devalue "reducers". When we hydrate
// the payload we transparently unwrap these to their inner value.
const REDUCER_TAGS = new Set([
  "ShallowReactive",
  "Reactive",
  "Ref",
  "ShallowRef",
  "EmptyRef",
  "NuxtError",
  "Pinia",
]);

function hydratePayload(entries: unknown[]): unknown {
  const cache = new Map<number, unknown>();
  const visit = (idx: number): unknown => {
    if (cache.has(idx)) return cache.get(idx);
    const node = entries[idx];
    if (node === null || typeof node !== "object") {
      cache.set(idx, node);
      return node;
    }
    if (Array.isArray(node)) {
      if (typeof node[0] === "string" && REDUCER_TAGS.has(node[0])) {
        const unwrapped = visit(node[1] as number);
        cache.set(idx, unwrapped);
        return unwrapped;
      }
      const out: unknown[] = [];
      cache.set(idx, out);
      for (const ref of node) out.push(visit(ref as number));
      return out;
    }
    const out: Record<string, unknown> = {};
    cache.set(idx, out);
    for (const [k, v] of Object.entries(node as Record<string, number>)) {
      out[k] = visit(v);
    }
    return out;
  };
  return visit(0);
}

function extractNuxtData(html: string): unknown[] {
  const match = html.match(/id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) {
    throw new Error('Could not find <script id="__NUXT_DATA__"> in page');
  }
  const parsed = JSON.parse(match[1]) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("__NUXT_DATA__ payload is not an array");
  }
  return parsed;
}

interface CardRecord {
  id: number;
  name: string;
  subtitle: string | null;
  cardType: string;
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
  variants: unknown[];
}

function normalize(raw: Record<string, unknown>): CardRecord {
  const num = (v: unknown): number | null =>
    typeof v === "number" ? v : v == null ? null : Number(v);
  const str = (v: unknown): string => (typeof v === "string" ? v : String(v));
  const optStr = (v: unknown): string | null => (typeof v === "string" && v.length > 0 ? v : null);
  const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

  return {
    id: raw.culture_invariant_id as number,
    name: str(raw.name),
    subtitle: optStr(raw.subtitle),
    cardType: str(raw.card_type),
    inkColors: arr<string>(raw.magic_ink_colors),
    inkCost: raw.ink_cost as number,
    inkConvertible: Boolean(raw.ink_convertible),
    strength: num(raw.strength),
    willpower: num(raw.willpower),
    loreValue: num(raw.quest_value),
    rarity: str(raw.rarity),
    specialRarityId: optStr(raw.special_rarity_id),
    subtypes: arr<string>(raw.subtypes),
    rulesText: str(raw.rules_text ?? ""),
    flavorText: optStr(raw.flavor_text),
    abilities: arr(raw.abilities),
    additionalInfo: arr(raw.additional_info),
    author: str(raw.author),
    cardIdentifier: str(raw.card_identifier),
    cardSets: arr<string>(raw.card_sets),
    deckBuildingId: str(raw.deck_building_id),
    searchableKeywords: arr<string>(raw.searchable_keywords),
    setRotationState: str(raw.set_rotation_state),
    sortNumber: raw.sort_number as number,
    thumbnailUrl: str(raw.thumbnail_url),
    variants: arr(raw.variants),
  };
}

async function main(): Promise<void> {
  console.log(`Fetching ${GALLERY_URL}`);
  const res = await fetch(GALLERY_URL, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const html = await res.text();

  const entries = extractNuxtData(html);
  const root = hydratePayload(entries) as {
    data?: { cards?: Record<string, Record<string, unknown>[]> };
  };

  const buckets = root.data?.cards;
  if (!buckets || typeof buckets !== "object") {
    throw new Error("Hydrated payload missing data.cards");
  }

  const seen = new Set<number>();
  const cards: CardRecord[] = [];
  for (const [bucket, list] of Object.entries(buckets)) {
    if (!Array.isArray(list)) continue;
    for (const raw of list) {
      const id = raw.culture_invariant_id as number;
      if (typeof id !== "number") {
        console.warn(`  ⚠️ ${bucket}: card without culture_invariant_id`);
        continue;
      }
      if (seen.has(id)) continue;
      seen.add(id);
      cards.push(normalize(raw));
    }
  }

  cards.sort((a, b) => {
    if (a.sortNumber !== b.sortNumber) return a.sortNumber - b.sortNumber;
    return a.id - b.id;
  });

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(cards, null, 2)}\n`, "utf-8");

  console.log(`✅ Scraped ${cards.length} cards → ${OUTPUT_PATH}`);
}

await main();
