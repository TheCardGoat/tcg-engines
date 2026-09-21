import {
  CYBERPUNK_STARTER_DECK_SOURCE_URL,
  mergeDuplicateCards,
  starterDeckLists,
  structuredCards,
} from "@tcg/cyberpunk-cards";
import type { CardDefinition } from "@tcg/cyberpunk-types";

const CARD_LINE_PATTERN = /^\s*(\d+)\s+(.+?)\s*$/;
const MAIN_DECK_HEADER_PATTERN = /^main deck(?:\s*\(\d+\))?$/i;
const LEGENDS_HEADER_PATTERN = /^legends$/i;
const TITLE_SEPARATOR_PATTERN = /[‐‑‒–—―:]/g;
const TITLE_SEPARATORS = ["-", "—", "–", ":"] as const;

export interface CyberpunkDeckPresetEntry {
  cardId: string;
  name: string;
  quantity: number;
}

export interface CyberpunkDeckPreset {
  id: string;
  name: string;
  sourceUrl: string;
  legends: CyberpunkDeckPresetEntry[];
  mainDeck: CyberpunkDeckPresetEntry[];
}

function normalizeCardName(value: string): string {
  return value
    .toLowerCase()
    .replace(TITLE_SEPARATOR_PATTERN, "-")
    .replace(/\s*-\s*/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function registerCardName(map: Map<string, CardDefinition>, card: CardDefinition): void {
  const keys = [card.displayName, card.name, card.slug, card.slug.replace(/-/g, " ")];
  if (card.subname) {
    for (const separator of TITLE_SEPARATORS) {
      keys.push(`${card.name} ${separator} ${card.subname}`);
    }
  }
  for (const key of keys) {
    map.set(normalizeCardName(key), card);
  }
}

function buildCardNameMap(): Map<string, CardDefinition> {
  const cardNames = new Map<string, CardDefinition>();
  for (const card of mergeDuplicateCards(structuredCards)) {
    registerCardName(cardNames, card);
  }
  return cardNames;
}

const cardsByName = buildCardNameMap();

function resolvePresetCard(name: string): CardDefinition {
  const card = cardsByName.get(normalizeCardName(name));
  if (!card) {
    throw new Error(`Unknown Cyberpunk starter deck card "${name}"`);
  }
  return card;
}

function starterDeckLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function extractStarterDeckName(text: string): string {
  const deckName = starterDeckLines(text).find(
    (line) =>
      !CARD_LINE_PATTERN.test(line) &&
      !LEGENDS_HEADER_PATTERN.test(line) &&
      !MAIN_DECK_HEADER_PATTERN.test(line),
  );
  if (!deckName) {
    throw new Error("Cyberpunk starter deck is missing a deck name");
  }
  return deckName;
}

function slugifyPresetId(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseStarterDeckList(text: string): CyberpunkDeckPreset {
  const lines = starterDeckLines(text);
  const name = extractStarterDeckName(text);
  let section: "legends" | "mainDeck" | null = null;
  const parsed: CyberpunkDeckPreset = {
    id: slugifyPresetId(name),
    name,
    sourceUrl: CYBERPUNK_STARTER_DECK_SOURCE_URL,
    legends: [],
    mainDeck: [],
  };

  for (const line of lines) {
    if (line === name) continue;
    if (LEGENDS_HEADER_PATTERN.test(line)) {
      section = "legends";
      continue;
    }
    if (MAIN_DECK_HEADER_PATTERN.test(line)) {
      section = "mainDeck";
      continue;
    }
    const match = line.match(CARD_LINE_PATTERN);
    if (!match) continue;
    if (!section) {
      throw new Error(`Cyberpunk starter deck card appears before a section: "${line}"`);
    }
    const quantity = Number.parseInt(match[1]!, 10);
    const cardName = match[2]!;
    const card = resolvePresetCard(cardName);
    parsed[section].push({
      cardId: card.canonicalId,
      name: card.displayName,
      quantity,
    });
  }

  if (parsed.legends.length === 0 || parsed.mainDeck.length === 0) {
    throw new Error(`Cyberpunk starter deck "${name}" is missing legends or main deck cards`);
  }

  return parsed;
}

/** Official Welcome to Night City starter decks for the deck-builder precon picker. */
export function listCyberpunkDeckPresets(): CyberpunkDeckPreset[] {
  return starterDeckLists.map((deckText) => parseStarterDeckList(deckText));
}
