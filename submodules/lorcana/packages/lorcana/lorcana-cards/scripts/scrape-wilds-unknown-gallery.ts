#!/usr/bin/env bun
/**
 * Scrape every card from the official Disney Lorcana card gallery and write a
 * single JSON file for one set.
 * The gallery is currently a TanStack Start app. Its SSR stream embeds the full
 * card list in a script tag; evaluating that stream with mocked browser globals
 * gives us the same card records the client hydrates, without a headless browser
 * or per-card requests.
 *
 * Usage: bun scripts/scrape-wilds-unknown-gallery.ts [setId] [outputSlug]
 */

import fs from "node:fs";
import path from "node:path";

const DEFAULT_SET_ID = "set13";
const DEFAULT_OUTPUT_SLUG = "attack-of-the-vine";
const setId = process.argv[2] || DEFAULT_SET_ID;
const outputSlug = process.argv[3] || (setId === DEFAULT_SET_ID ? DEFAULT_OUTPUT_SLUG : setId);
const GALLERY_URL = "https://cards.disneylorcana.com/en-US/";
const TRUSTED_GALLERY_ORIGIN = "https://cards.disneylorcana.com";
const OUTPUT_PATH = path.resolve(__dirname, `../data/inputs/${outputSlug}-gallery.json`);
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function extractTanStackGalleryCards(html: string): Record<string, unknown>[] {
  const match = html.match(
    /<script class="\$tsr" id="\$tsr-stream-barrier">([\s\S]*?)<\/script>/,
  );
  if (!match?.[1]) {
    throw new Error('Could not find <script class="$tsr" id="$tsr-stream-barrier"> in page');
  }

  const self: { $_TSR?: { router?: { matches?: Array<{ l?: unknown }> } } } = {};
  const document = { currentScript: { remove() {} } };
  // Trust boundary: this executes the official Disney Lorcana gallery stream.
  // Do not point this scraper at mirrors, cached copies, or user-controlled HTML.
  Function("self", "document", `with (self) { ${match[1]} }`)(self, document);

  const cards = self.$_TSR?.router?.matches
    ?.map((route) => route.l)
    .find(
      (loaderData): loaderData is { cardsData: { cards: Record<string, unknown>[] } } =>
        typeof loaderData === "object" &&
        loaderData !== null &&
        Array.isArray(
          (loaderData as { cardsData?: { cards?: unknown } }).cardsData?.cards,
        ),
    )?.cardsData.cards;

  if (!cards) {
    throw new Error("Hydrated TanStack payload missing cardsData.cards");
  }

  return cards;
}

function toCardSetIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry === "string") return [entry];
    if (
      entry &&
      typeof entry === "object" &&
      typeof (entry as { id?: unknown }).id === "string"
    ) {
      return [(entry as { id: string }).id];
    }
    return [];
  });
}

function toPluralCardType(value: unknown): CardRecord["cardType"] {
  if (value === "character" || value === "characters") return "characters";
  if (value === "action" || value === "actions") return "actions";
  if (value === "item" || value === "items") return "items";
  if (value === "location" || value === "locations") return "locations";
  console.warn(`unknown card_type "${String(value)}" - classifying as actions`);
  return "actions";
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
    cardType: toPluralCardType(raw.card_type),
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
    cardSets: toCardSetIds(raw.card_sets),
    deckBuildingId: str(raw.deck_building_id),
    searchableKeywords: arr<string>(raw.searchable_keywords),
    setRotationState: str(raw.set_rotation_state),
    sortNumber: raw.sort_number as number,
    thumbnailUrl: str(raw.thumbnail_url),
    variants: arr(raw.variants),
  };
}

async function main(): Promise<void> {
  const galleryOrigin = new URL(GALLERY_URL).origin;
  if (galleryOrigin !== TRUSTED_GALLERY_ORIGIN) {
    throw new Error(`Refusing to evaluate gallery stream from untrusted origin ${galleryOrigin}`);
  }

  console.log(`Fetching ${GALLERY_URL}`);
  const res = await fetch(GALLERY_URL, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const html = await res.text();

  const seen = new Set<number>();
  const cards: CardRecord[] = [];
  for (const raw of extractTanStackGalleryCards(html)) {
    const id = raw.culture_invariant_id as number;
    if (typeof id !== "number") {
      console.warn("  ⚠️ card without culture_invariant_id");
      continue;
    }
    const cardSets = toCardSetIds(raw.card_sets);
    if (!cardSets.includes(setId)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    cards.push(normalize(raw));
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
